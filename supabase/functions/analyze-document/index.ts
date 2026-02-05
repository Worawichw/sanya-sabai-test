import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, textContent } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `คุณเป็นผู้เชี่ยวชาญด้านกฎหมายและการเงินของไทย ที่ช่วยวิเคราะห์สัญญาและเอกสารทางกฎหมายให้เข้าใจง่าย

เมื่อได้รับเอกสาร ให้วิเคราะห์และตอบกลับเป็น JSON ที่มีโครงสร้างดังนี้:
{
  "documentType": "ประเภทเอกสาร เช่น สัญญาเงินกู้, สัญญาเช่าซื้อ, สัญญาจ้างงาน",
  "riskScore": ตัวเลข 0-100 (0=ปลอดภัยมาก, 100=เสี่ยงมาก),
  "summary": "สรุปใจความสำคัญของเอกสารใน 2-3 ประโยค ภาษาชาวบ้านที่เข้าใจง่าย",
  "risks": [
    {
      "level": "high" | "medium" | "low",
      "title": "หัวข้อความเสี่ยง",
      "description": "คำอธิบายความเสี่ยงภาษาชาวบ้าน",
      "clause": "ข้อความในสัญญาที่เกี่ยวข้อง (ถ้ามี)"
    }
  ],
  "recommendations": ["คำแนะนำ 1", "คำแนะนำ 2"]
}

กฎหมายไทยที่ควรพิจารณา:
- อัตราดอกเบี้ยสูงสุดตามกฎหมาย: 15% ต่อปี (หรือ 1.25% ต่อเดือน)
- สัญญากู้ยืมเงินต้องมีหลักฐานเป็นหนังสือ
- ห้ามเรียกดอกเบี้ยทบต้น
- สัญญาที่ไม่เป็นธรรมอาจถูกศาลสั่งให้เป็นโมฆะได้

หากเป็นรูปภาพ ให้อ่านข้อความจากรูปก่อนแล้วจึงวิเคราะห์`;

    // Prepare content for Gemini API
    let parts: any[] = [];

    // Add system prompt as text
    parts.push({
      text: systemPrompt + "\n\n**สำคัญมาก:** กรุณาตอบกลับเป็น JSON object เท่านั้น ห้ามใส่ ```json หรือข้อความอื่นใดนอกเหนือจาก JSON object ที่สมบูรณ์"
    });

    if (imageBase64) {
      // Extract base64 data without data URI prefix
      const base64Data = imageBase64.includes("base64,")
        ? imageBase64.split("base64,")[1]
        : imageBase64;

      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data
        }
      });
    } else if (textContent) {
      parts.push({
        text: `\n\nเอกสารที่ต้องวิเคราะห์:\n${textContent}`
      });
    } else {
      return new Response(
        JSON.stringify({ error: "ไม่พบข้อมูลเอกสาร กรุณาอัพโหลดรูปภาพหรือข้อความ" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contents = [{
      role: "user",
      parts: parts
    }];

    console.log("Calling Gemini API for document analysis");
    console.log("Using model: gemini-2.5-flash");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.3,

            responseMimeType: "application/json"
          }
        })
      }
    );

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error details:", errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "ระบบมีผู้ใช้งานมาก กรุณารอสักครู่แล้วลองใหม่" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: "API Key ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: "Model ไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API raw response:", JSON.stringify(data).substring(0, 200));

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("Gemini API response:", JSON.stringify(data));
      throw new Error("No content in AI response");
    }

    console.log("AI Response:", content.substring(0, 200));

    // Parse JSON from the response
    let analysisResult;
    try {
      // Gemini with responseMimeType json should return clean JSON
      analysisResult = JSON.parse(content);
      console.log("✅ Successfully parsed JSON response");
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      console.error("Raw content:", content);

      // Fallback: try to clean and parse
      let cleanContent = content;
      cleanContent = cleanContent.replace(/```json\s*/gi, '');
      cleanContent = cleanContent.replace(/```\s*/g, '');
      cleanContent = cleanContent.replace(/^["']?json\s*/i, '');
      cleanContent = cleanContent.trim();

      try {
        // Try direct parse after cleaning
        analysisResult = JSON.parse(cleanContent);
        console.log("✅ Parsed after cleaning");
      } catch (e) {
        // Try regex extraction
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[0]);
            console.log("✅ Parsed using regex extraction");
          } catch (e2) {
            // Return fallback response
            analysisResult = {
              documentType: "เอกสารทั่วไป",
              riskScore: 50,
              summary: content.slice(0, 200),
              risks: [],
              recommendations: ["กรุณาปรึกษาผู้เชี่ยวชาญเพิ่มเติม"]
            };
          }
        } else {
          // Return fallback response
          analysisResult = {
            documentType: "เอกสารทั่วไป",
            riskScore: 50,
            summary: content.slice(0, 200),
            risks: [],
            recommendations: ["กรุณาปรึกษาผู้เชี่ยวชาญเพิ่มเติม"]
          };
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, analysis: analysisResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error analyzing document:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการวิเคราะห์"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
