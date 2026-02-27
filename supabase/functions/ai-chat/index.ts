import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const Kestora_CONTEXT = `
Kestora College is a higher education institution in Helsinki, Finland, dedicated to sustainability, innovation, and practical excellence.

Key Information:
- Location: Helsinki Campus, Malmin kauppatie 8, 00700 Helsinki, Finland.
- Programs: Bachelor's and Master's degrees in sustainability, technology, business, and arts.
- Core Schools: School of Arts & Design, School of Business, School of Technology, School of Science.
- Mission: To empower the next generation of leaders with the skills to build a regenerative future.
- Admissions: Open for Autumn 2026. Process is transparent and supportive.
- Tuition Fees: Kestora College accepts tuition payments exclusively via direct bank transfer to Kuda Bank.
- Kuda Bank Details: Bank: Kuda Bank, Account Number: 3003469520, Account Name: Kestora EDUCATIONAL SERVICES.
- Early Payment: There is an Early Payment Credit (discount) available for those who pay before the deadline.
- Partnerships: strategic partnerships with over 200 global companies and research institutions.
- Employment: 92% of graduates find relevant employment within 6 months.

Contact: admissions@kestora.fi | +358-20-4721-739
`;

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { message, history } = await req.json();
        const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

        if (!openaiApiKey) {
            console.error("Missing OPENAI_API_KEY");
            return new Response(JSON.stringify({
                reply: "I'm currently in 'offline' mode because my AI brains are being configured. However, I can still tell you that Kestora College is a leader in sustainability! Please ask your administrator to configure the OPENAI_API_KEY secret."
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const messages = [
            { role: "system", content: `You are a helpful assistant for Kestora College. Use the following context to answer student questions. If you don't know the answer, politely refer them to admissions@kestora.fi.\n\nContext:\n${Kestora_CONTEXT}` },
            ...history.map((h: any) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
            { role: "user", content: message }
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openaiApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages,
                max_tokens: 500,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenAI API Error Details:", JSON.stringify(data.error));
            throw new Error(data.error.message || "OpenAI API Error");
        }

        const reply = data.choices[0].message.content;

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Chat Logic Error Path:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
