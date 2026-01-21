import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContentBriefData {
  contentType: string;
  topic: string;
  keywords: string[];
  targetAudience: string;
  tone: string;
  wordCount: number;
  vertical: string;
  additionalNotes?: string;
}

const getSystemPrompt = (brief: ContentBriefData) => {
  const toneDescriptions: Record<string, string> = {
    professional: "formal, authoritative, and business-appropriate",
    casual: "friendly, conversational, and approachable",
    technical: "precise, detailed, and expert-level",
  };

  const contentTypeFormats: Record<string, string> = {
    blog: "a comprehensive blog post with proper H1, H2, and H3 headings, introduction, body sections, and conclusion",
    linkedin: "a professional LinkedIn article optimized for engagement with a compelling hook",
    case_study: "a detailed case study with sections for Challenge, Solution, and Results",
    product_description: "persuasive product copy highlighting benefits and features",
    email: "an engaging email newsletter with clear CTA",
    landing_page: "high-converting landing page copy with compelling headlines and CTAs",
  };

  const verticalContext: Record<string, string> = {
    legal: "Ensure all legal disclaimers are included. Avoid giving specific legal advice. Include attorney bio placeholders.",
    healthcare: "Include medical disclaimers. Note that content does not substitute professional medical advice.",
    ecommerce: "Focus on benefits, include clear CTAs, and maintain accurate product claims.",
    tech: "Use appropriate technical terminology while remaining accessible. Include code examples if relevant.",
    accounting: "Include tax advice disclaimers. Mention consulting with qualified professionals.",
    finance: "Include risk disclaimers and regulatory notices where appropriate.",
    real_estate: "Include fair housing compliance language. Add license disclosure placeholders.",
    custom: "",
  };

  return `You are an expert content writer specializing in SEO-optimized, brand-consistent content. Your task is to generate ${contentTypeFormats[brief.contentType] || "high-quality content"}.

WRITING STYLE:
- Tone: ${toneDescriptions[brief.tone] || "professional and clear"}
- Target audience: ${brief.targetAudience || "general business audience"}
- Word count target: approximately ${brief.wordCount} words

SEO REQUIREMENTS:
- Primary keywords to include naturally: ${brief.keywords.join(", ") || "none specified"}
- Use proper heading hierarchy (H1, H2, H3)
- Include meta description at the start (marked as [META])
- Optimize for readability (short paragraphs, bullet points where appropriate)

${verticalContext[brief.vertical] ? `INDUSTRY COMPLIANCE (${brief.vertical.toUpperCase()}):\n${verticalContext[brief.vertical]}` : ""}

${brief.additionalNotes ? `ADDITIONAL INSTRUCTIONS:\n${brief.additionalNotes}` : ""}

OUTPUT FORMAT:
- Start with [META] followed by a 150-160 character meta description
- Use markdown formatting for headings and lists
- Include relevant internal link placeholders as [LINK: topic]
- Mark any compliance elements with [COMPLIANCE: type]

Generate engaging, well-structured content that ranks well and converts readers.`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brief } = await req.json();
    
    if (!brief || !brief.topic) {
      return new Response(
        JSON.stringify({ error: "Content brief with topic is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating content for topic:", brief.topic);
    console.log("Content type:", brief.contentType);
    console.log("Word count target:", brief.wordCount);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: getSystemPrompt(brief) },
          { role: "user", content: `Write content about: ${brief.topic}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response started");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Generate content error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
