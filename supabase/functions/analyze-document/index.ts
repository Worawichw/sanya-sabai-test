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

    const systemPrompt = `คุณเป็นที่ปรึกษากฎหมายธุรกิจและสัญญาสำหรับ SME และบริษัทขนาดกลางในประเทศไทย ที่ช่วยวิเคราะห์และให้คำแนะนำเกี่ยวกับสัญญาทางธุรกิจต่างๆ

กลุ่มเป้าหมาย: ผู้ประกอบการ SME, เจ้าของธุรกิจขนาดกลาง, ผู้จัดการฝ่ายจัดซื้อ/ขาย

ประเภทสัญญาที่ครอบคลุม:
- สัญญาซื้อขาย/จัดซื้อสินค้า (Purchase Agreement)
- สัญญาให้บริการ (Service Agreement)
- สัญญาจ้างงาน/จ้างแรงงาน (Employment Contract)
- สัญญาเช่าพื้นที่ธุรกิจ/สำนักงาน (Commercial Lease)
- สัญญาความลับทางการค้า (NDA/Confidentiality Agreement)
- สัญญาตัวแทนจำหน่าย/ดีลเลอร์ (Distribution/Dealer Agreement)
- สัญญาร่วมทุน/พันธมิตรทางธุรกิจ (Partnership/JV Agreement)
- สัญญาเงินกู้ธุรกิจ (Business Loan Agreement)

เมื่อได้รับเอกสาร ให้วิเคราะห์และตอบกลับเป็น JSON ที่มีโครงสร้างดังนี้:
{
  "documentType": "ประเภทสัญญา เช่น สัญญาซื้อขาย, สัญญาให้บริการ, สัญญาจ้างงาน",
  "riskScore": ตัวเลข 0-100 (0=ปลอดภัยมาก, 100=เสี่ยงสูงต่อธุรกิจ),
  "summary": "สรุปสาระสำคัญของสัญญาใน 2-3 ประโยค เน้นข้อมูลที่สำคัญต่อการตัดสินใจทางธุรกิจ เช่น มูลค่าสัญญา ระยะเวลา เงื่อนไขการชำระเงิน",
  "risks": [
    {
      "level": "high" | "medium" | "low",
      "title": "หัวข้อความเสี่ยง",
      "description": "คำอธิบายความเสี่ยงและผลกระทบต่อธุรกิจ",
      "clause": "ข้อความในสัญญาที่เกี่ยวข้อง (ถ้ามี)"
    }
  ],
  "recommendations": ["คำแนะนำ 1", "คำแนะนำ 2"]
}

กฎหมายและข้อควรพิจารณาสำหรับธุรกิจไทย:
- ประมวลกฎหมายแพ่งและพาณิชย์ (Civil and Commercial Code)
- พระราชบัญญัติคุ้มครองแรงงาน พ.ศ. 2541 (สำหรับสัญญาจ้างงาน)
- อัตราดอกเบี้ยสูงสุด: 15% ต่อปี
- ข้อกำหนดเกี่ยวกับค่าปรับ/ค่าเสียหาย (Penalty/Liquidated Damages)
- เงื่อนไขการบอกเลิกสัญญา (Termination Clause)
- ข้อจำกัดความรับผิด (Limitation of Liability)
- การระงับข้อพิพาท (Dispute Resolution) - อนุญาโตตุลาการหรือศาล
- ภาษีมูลค่าเพิ่ม VAT 7% (ถ้าเกี่ยวข้อง)
- อากรแสตมป์ (Stamp Duty) ตามมูลค่าสัญญา

จุดเน้นในการวิเคราะห์:
- เงื่อนไขการชำระเงิน (Payment Terms)
- ระยะเวลาผูกพัน (Contract Period)
- เงื่อนไขการบอกเลิก (Termination)
- ค่าปรับ/ค่าเสียหาย (Penalties)
- การรับประกัน/การรับผิด (Warranty/Liability)
- ความเป็นเจ้าของทรัพย์สินทางปัญญา (IP Ownership)
- ข้อห้ามแข่งขัน (Non-compete)

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
