/**
 * Offline Sync System with IndexedDB
 * Handles data synchronization when offline and syncs when connection restored
 */

export interface SyncOperation {
  id: string;
  type: "create" | "update" | "delete";
  table: string;
  data: any;
  timestamp: number;
  status: "pending" | "synced" | "failed";
  retryCount: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

class OfflineSyncService {
  private dbName = "VitalityDB";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private isOnline = navigator.onLine;
  private syncQueue: SyncOperation[] = [];

  /**
   * Initialize IndexedDB
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("Failed to open IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("IndexedDB initialized successfully");
        this.setupOnlineStatusListener();
        this.loadSyncQueue();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // User data store
        if (!db.objectStoreNames.contains("userStats")) {
          db.createObjectStore("userStats", { keyPath: "id" });
        }

        // Workout data store
        if (!db.objectStoreNames.contains("workouts")) {
          db.createObjectStore("workouts", { keyPath: "id" });
        }

        // Meals store
        if (!db.objectStoreNames.contains("meals")) {
          db.createObjectStore("meals", { keyPath: "id" });
        }

        // Hydration logs
        if (!db.objectStoreNames.contains("hydration")) {
          db.createObjectStore("hydration", { keyPath: "id" });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains("syncQueue")) {
          const syncStore = db.createObjectStore("syncQueue", {
            keyPath: "id",
          });
          syncStore.createIndex("status", "status", { unique: false });
          syncStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        // Cache store
        if (!db.objectStoreNames.contains("cache")) {
          db.createObjectStore("cache", { keyPath: "key" });
        }

        console.log("IndexedDB schema created");
      };
    });
  }

  /**
   * Listen for online/offline status
   */
  private setupOnlineStatusListener(): void {
    window.addEventListener("online", () => {
      this.isOnline = true;
      console.log("Connection restored - starting sync");
      this.syncPendingOperations();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      console.log("Connection lost - switching to offline mode");
    });
  }

  /**
   * Save data locally
   */
  async saveLocal<T>(storeName: string, key: string, data: T): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put({ id: key, ...data });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get data from local storage
   */
  async getLocal<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? (result as T) : null);
      };
    });
  }

  /**
   * Get all data from a store
   */
  async getAllLocal<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result as T[]);
      };
    });
  }

  /**
   * Delete local data
   */
  async deleteLocal(storeName: string, key: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Queue a sync operation
   */
  async queueSyncOperation(
    type: "create" | "update" | "delete",
    table: string,
    data: any
  ): Promise<string> {
    const operation: SyncOperation = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      table,
      data,
      timestamp: Date.now(),
      status: "pending",
      retryCount: 0,
    };

    await this.saveLocal("syncQueue", operation.id, operation);
    this.syncQueue.push(operation);

    // If online, try to sync immediately
    if (this.isOnline) {
      this.syncPendingOperations();
    }

    return operation.id;
  }

  /**
   * Load sync queue from storage
   */
  private async loadSyncQueue(): Promise<void> {
    try {
      const operations = await this.getAllLocal<SyncOperation>("syncQueue");
      this.syncQueue = operations.filter((op) => op.status === "pending");
      console.log(`Loaded ${this.syncQueue.length} pending sync operations`);
    } catch (error) {
      console.error("Failed to load sync queue:", error);
    }
  }

  /**
   * Sync pending operations with server
   */
  async syncPendingOperations(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    console.log(`Starting sync of ${this.syncQueue.length} pending operations`);

    for (const operation of this.syncQueue) {
      try {
        await this.executeSyncOperation(operation);
        operation.status = "synced";
        await this.saveLocal("syncQueue", operation.id, operation);
      } catch (error) {
        operation.retryCount++;
        console.error(
          `Failed to sync operation ${operation.id}, retry ${operation.retryCount}:`,
          error
        );

        // Mark as failed after 3 retries
        if (operation.retryCount >= 3) {
          operation.status = "failed";
        }

        await this.saveLocal("syncQueue", operation.id, operation);
      }
    }

    // Remove synced operations from queue
    this.syncQueue = this.syncQueue.filter((op) => op.status === "pending");
  }

  /**
   * Execute a single sync operation
   */
  private async executeSyncOperation(operation: SyncOperation): Promise<void> {
    // This would be replaced with actual API calls
    // For now, we'll simulate the operation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Synced ${operation.type} operation for ${operation.table}`
        );
        resolve();
      }, 500);
    });
  }

  /**
   * Cache data with TTL
   */
  async cacheData<T>(
    key: string,
    data: T,
    ttl: number = 5 * 60 * 1000
  ): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    await this.saveLocal("cache", key, entry);
  }

  /**
   * Get cached data if not expired
   */
  async getCachedData<T>(key: string): Promise<T | null> {
    const entry = await this.getLocal<CacheEntry<T>>("cache", key);

    if (!entry) return null;

    const isExpired = entry.ttl && Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      await this.deleteLocal("cache", key);
      return null;
    }

    return entry.data;
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<void> {
    try {
      const allCache = await this.getAllLocal<CacheEntry<any>>("cache");
      const now = Date.now();

      for (const entry of allCache) {
        if (entry.ttl && now - entry.timestamp > entry.ttl) {
          await this.deleteLocal("cache", entry.data?.id || "");
        }
      }

      console.log("Expired cache entries cleared");
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      pendingOperations: this.syncQueue.length,
      failedOperations: this.syncQueue.filter((op) => op.status === "failed")
        .length,
    };
  }

  /**
   * Force sync
   */
  async forceSync(): Promise<void> {
    console.log("Force syncing all pending operations");
    await this.syncPendingOperations();
  }

  /**
   * Clear all local data
   */
  async clearAllData(): Promise<void> {
    if (!this.db) return;

    const stores = [
      "userStats",
      "workouts",
      "meals",
      "hydration",
      "syncQueue",
      "cache",
    ];

    for (const storeName of stores) {
      try {
        await new Promise<void>((resolve, reject) => {
          const transaction = this.db!.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          const request = store.clear();

          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        });
      } catch (error) {
        console.error(`Failed to clear store ${storeName}:`, error);
      }
    }

    console.log("All local data cleared");
  }
}

// Export singleton instance
export const offlineSyncService = new OfflineSyncService();

// Export offline analytics
export const offlineAnalytics = {
  goOffline: () => ({
    event: "app_offline",
    timestamp: Date.now(),
  }),
  goOnline: () => ({
    event: "app_online",
    timestamp: Date.now(),
  }),
  syncStarted: (operationCount: number) => ({
    event: "sync_started",
    operationCount,
    timestamp: Date.now(),
  }),
  syncCompleted: (successCount: number, failureCount: number) => ({
    event: "sync_completed",
    successCount,
    failureCount,
    timestamp: Date.now(),
  }),
  operationQueued: (type: string, table: string) => ({
    event: "operation_queued",
    type,
    table,
    timestamp: Date.now(),
  }),
};
