import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  value: number;
  [key: string]: any;
}

interface ProgressChartProps {
  data: DataPoint[];
  title: string;
  type?: "line" | "area" | "bar" | "pie";
  dataKey: string;
  color?: string | string[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

const defaultColors = {
  line: "#22c55e",
  area: "#a855f7",
  bar: "#f97316",
  pie: ["#22c55e", "#a855f7", "#f97316", "#06b6d4", "#ec4899"],
};

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  type = "line",
  dataKey,
  color,
  height = 300,
  showLegend = true,
  showGrid = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          Sin datos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={height}>
        {type === "line" && (
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            )}
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f3f4f6" }}
            />
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={typeof color === "string" ? color : "#22c55e"}
              strokeWidth={2}
              dot={{
                fill: typeof color === "string" ? color : "#22c55e",
                r: 4,
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}

        {type === "area" && (
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            )}
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f3f4f6" }}
            />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey={dataKey}
              fill={typeof color === "string" ? color : "#a855f7"}
              stroke={typeof color === "string" ? color : "#a855f7"}
              fillOpacity={0.6}
            />
          </AreaChart>
        )}

        {type === "bar" && (
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            )}
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f3f4f6" }}
            />
            {showLegend && <Legend />}
            <Bar
              dataKey={dataKey}
              fill={typeof color === "string" ? color : "#f97316"}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        )}

        {type === "pie" && (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {(defaultColors.pie as string[]).map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f3f4f6" }}
            />
            {showLegend && <Legend />}
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Componente para gráfico de progreso semanal
 */
export const WeeklyProgressChart: React.FC<{ data: DataPoint[] }> = ({
  data,
}) => {
  return (
    <ProgressChart
      data={data}
      title="Progreso Semanal"
      type="bar"
      dataKey="value"
      color="#22c55e"
      height={250}
    />
  );
};

/**
 * Componente para gráfico de actividad
 */
export const ActivityChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  return (
    <ProgressChart
      data={data}
      title="Actividad Física"
      type="area"
      dataKey="value"
      color="#a855f7"
      height={300}
    />
  );
};

/**
 * Componente para gráfico de calorías
 */
export const CaloriesChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  return (
    <ProgressChart
      data={data}
      title="Calorías Consumidas"
      type="line"
      dataKey="value"
      color="#f97316"
      height={300}
    />
  );
};

/**
 * Componente para gráfico de hidratación
 */
export const HydrationChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  return (
    <ProgressChart
      data={data}
      title="Ingesta de Agua"
      type="area"
      dataKey="value"
      color="#06b6d4"
      height={300}
    />
  );
};

/**
 * Componente para distribución de macronutrientes (pie)
 */
export const MacronutrientsChart: React.FC<{
  data: Array<{ name: string; value: number }>;
}> = ({ data }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Distribución de Macronutrientes
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}g`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {defaultColors.pie.map((color, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f3f4f6" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
