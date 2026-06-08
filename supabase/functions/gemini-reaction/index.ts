import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { elements, conditions } = await req.json();

    if (!elements || elements.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No elements provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable not set');
    }

    const elementSymbols = elements.map((e: { Symbol: string }) => e.Symbol).join(', ');
    const prompt = `
You are a chemistry expert. Analyze the following chemical reaction:
Reactants: ${elementSymbols}
Conditions: Temperature ${conditions.temperature}K, Pressure ${conditions.pressure}atm

Determine if a reaction occurs. If it does, provide:
1. "products": A list of resulting chemical formulas (e.g. ["H2O"]).
2. "description": A short explanation of the reaction.
3. "exothermic": true or false.
4. "energyChange": estimated energy change in kJ/mol.
5. "safe": true or false.

If no reaction occurs under these conditions, return an empty products list and explain why in the description.

Respond ONLY with a valid JSON object matching this schema:
{
  "products": string[],
  "description": string,
  "exothermic": boolean,
  "energyChange": number,
  "safe": boolean
}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const reactionResult = JSON.parse(resultText);

    return new Response(
      JSON.stringify(reactionResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
