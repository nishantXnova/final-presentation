import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, amount } = await req.json();

    // Using exchangerate.host - completely free, no API key needed
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${from}&symbols=${to}`
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.info || 'Failed to fetch exchange rates');
    }

    const rate = data.rates?.[to];

    if (!rate) {
      throw new Error(`Rate not found for ${to}`);
    }

    const converted = (amount * rate).toFixed(2);

    return new Response(
      JSON.stringify({ rate, converted, from, to, amount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
