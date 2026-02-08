import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotRequest {
  message: string;
  history?: ChatMessage[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json() as ChatbotRequest;

    const messages = [
      {
        role: 'system',
        content: `You are a friendly and knowledgeable Nepal travel assistant. You help travelers with:
- Information about destinations in Nepal (Kathmandu, Pokhara, Everest, Annapurna, etc.)
- Trekking advice, routes, and difficulty levels
- Visa and permit requirements
- Best times to visit different regions
- Local customs, culture, and etiquette
- Food recommendations
- Accommodation suggestions
- Safety tips and altitude sickness prevention
- Budget planning and cost estimates

Be concise but helpful. Use emojis occasionally to be friendly. If you don't know something specific, suggest they check official sources.`
      },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return new Response(
      JSON.stringify({ success: true, reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
