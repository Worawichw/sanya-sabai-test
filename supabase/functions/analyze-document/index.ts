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

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
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

**สำคัญมาก:** กรุณาตอบกลับเป็น JSON object เท่านั้น ห้ามใส่ \`\`\`json หรือข้อความอื่นใดนอกเหนือจาก JSON object ที่สมบูรณ์`;

    // Prepare messages for OpenAI API
    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt
      }
    ];

    if (imageBase64) {
      // Extract base64 data without data URI prefix
      const base64Data = imageBase64.includes("base64,")
        ? imageBase64.split("base64,")[1]
        : imageBase64;

      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "กรุณาวิเคราะห์เอกสารในรูปภาพนี้และตอบกลับเป็น JSON ตามรูปแบบที่กำหนด"
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`
            }
          }
        ]
      });
    } else if (textContent) {
      messages.push({
        role: "user",
        content: `กรุณาวิเคราะห์เอกสารต่อไปนี้:\n\n${textContent}`
      });
    } else {
      return new Response(
        JSON.stringify({ error: "ไม่พบข้อมูลเอกสาร กรุณาอัพโหลดรูปภาพหรือข้อความ" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling OpenAI API for document analysis...");
    console.log("Using model:", imageBase64 ? "gpt-4o" : "gpt-4o-mini");

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: imageBase64 ? "gpt-4o" : "gpt-4o-mini",
          messages: messages,
          temperature: 0.3,
          max_tokens: 2048,
          response_format: { type: "json_object" }
        })
      }
    );

    console.log("OpenAI API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error details:", errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "ระบบมีผู้ใช้งานมาก กรุณารอสักครู่แล้วลองใหม่" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "API Key ไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ error: "ไม่มีสิทธิ์เข้าถึง API กรุณาตรวจสอบ API Key" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 429 || response.status === 402) {
        return new Response(
          JSON.stringify({ error: "OpenAI credits หมด กรุณาเติมเครดิตในบัญชี OpenAI" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("OpenAI API response:", JSON.stringify(data));
      throw new Error("No content in AI response");
    }

    console.log("AI Response:", content);

    // Parse JSON from the response
    let analysisResult;
    try {
      // OpenAI with response_format json_object should return clean JSON
      analysisResult = JSON.parse(content);
      console.log("✅ Successfully parsed JSON response");
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      console.error("Raw content:", content);

      // Fallback: try to clean and parse
      let cleanContent = content;
      cleanContent = cleanContent.replace(/```json\s*/gi, '');
      cleanContent = cleanContent.replace(/```\s*/g, '');
      cleanContent = cleanContent.trim();

      try {
        analysisResult = JSON.parse(cleanContent);
        console.log("✅ Parsed after cleaning");
      } catch (e) {
        // Return a fallback response
        analysisResult = {
          documentType: "เอกสารทั่วไป",
          riskScore: 50,
          summary: content.slice(0, 200),
          risks: [],
          recommendations: ["กรุณาปรึกษาผู้เชี่ยวชาญเพิ่มเติม"]
        };
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
