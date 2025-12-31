import { serve } from "std/server";

serve(async (req) => {
  try {
    const body = await req.json();
    const {
      messages = [],
      userText = "",
      stats = {},
      userName = "usuario",
    } = body;

    const API_KEY =
      Deno.env.get("GOOGLE_API_KEY") ||
      Deno.env.get("VITE_GOOGLE_API_KEY") ||
      Deno.env.get("google_api_key");
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "Google API key not configured on server" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemInstruction = `Eres "Vitality Coach", una IA experta en salud y fitness. El usuario se llama ${userName}. Sus estadísticas actuales: ${JSON.stringify(
      stats
    )}. Sé motivadora, concisa (máximo 3 líneas) y usa emojis ocasionalmente. Habla en español.`;

    const conversation = messages
      .map((m: any) => `${m.role}: ${m.text}`)
      .join("\n");

    const prompt = `${systemInstruction}\n\nContexto:\n${JSON.stringify(
      stats
    )}\n\nConversación reciente:\n${conversation}\n\nUsuario: ${userText}`;

    const url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash-latest:generateText?key=${API_KEY}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.2,
        maxOutputTokens: 256,
      }),
    });

    const j = await resp.json();

    // Intentar normalizar distintos formatos de respuesta
    let text = "";
    if (j.candidates && j.candidates[0]) {
      const c = j.candidates[0];
      if (c.content) text = c.content.map((p: any) => p.text || "").join("");
      else if (c.output) text = c.output;
    } else if (j.output && j.output[0] && j.output[0].content) {
      text = j.output[0].content.map((p: any) => p.text || "").join("");
    } else if (j.result && j.result.output_text) {
      text = j.result.output_text;
    } else if (
      j.outputs &&
      j.outputs[0] &&
      j.outputs[0].data &&
      j.outputs[0].data.text
    ) {
      text = j.outputs[0].data.text;
    } else {
      text = JSON.stringify(j);
    }

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
