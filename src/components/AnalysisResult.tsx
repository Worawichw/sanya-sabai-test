import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Phone, Download, Share2 } from "lucide-react";
import { ShieldCheck } from "@/components/icons/ShieldCheck";

interface RiskItem {
  level: "high" | "medium" | "low";
  title: string;
  description: string;
  clause?: string;
}

interface AnalysisResultProps {
  documentType?: string;
  riskScore?: number;
  risks?: RiskItem[];
  summary?: string;
}

const sampleData: AnalysisResultProps = {
  documentType: "สัญญาเงินกู้",
  riskScore: 65,
  summary: "สัญญานี้เป็นสัญญากู้ยืมเงินระยะเวลา 12 เดือน วงเงิน 50,000 บาท พบเงื่อนไขที่ควรระวัง 2 ข้อ และมีดอกเบี้ยสูงกว่าที่กฎหมายกำหนด",
  risks: [
    {
      level: "high",
      title: "อัตราดอกเบี้ยเกินกฎหมาย",
      description: "ดอกเบี้ยที่ระบุคือ 24% ต่อปี ซึ่งเกินกว่าอัตราสูงสุดที่กฎหมายกำหนด (15% ต่อปี)",
      clause: "ข้อ 3.2: ผู้กู้ตกลงชำระดอกเบี้ยในอัตรา 2% ต่อเดือน...",
    },
    {
      level: "high",
      title: "สิทธิ์ยึดทรัพย์ไม่ชอบธรรม",
      description: "สัญญาระบุว่าสามารถยึดทรัพย์ได้หากค้างชำระเพียง 1 งวด ซึ่งรุนแรงเกินไป",
      clause: "ข้อ 7.1: หากผู้กู้ผิดนัดชำระแม้เพียงครั้งเดียว...",
    },
    {
      level: "medium",
      title: "ค่าธรรมเนียมการชำระล่าช้า",
      description: "มีค่าปรับ 500 บาทต่อวันที่ชำระล่าช้า ซึ่งสูงกว่าปกติ",
      clause: "ข้อ 5.4: กรณีชำระล่าช้าจากกำหนด...",
    },
    {
      level: "low",
      title: "ระยะเวลาผ่อนชำระ",
      description: "ระยะเวลา 12 เดือน เป็นไปตามมาตรฐานทั่วไป",
    },
  ],
};

export const AnalysisResult: React.FC<AnalysisResultProps> = (props) => {
  const data = { ...sampleData, ...props };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/20",
          text: "text-destructive",
          badge: "bg-destructive text-destructive-foreground",
        };
      case "medium":
        return {
          bg: "bg-warning/10",
          border: "border-warning/20",
          text: "text-warning",
          badge: "bg-warning text-warning-foreground",
        };
      case "low":
        return {
          bg: "bg-success/10",
          border: "border-success/20",
          text: "text-success",
          badge: "bg-success text-success-foreground",
        };
      default:
        return {
          bg: "bg-muted",
          border: "border-border",
          text: "text-muted-foreground",
          badge: "bg-muted text-muted-foreground",
        };
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "high":
        return "เสี่ยงสูง";
      case "medium":
        return "ควรระวัง";
      case "low":
        return "ปกติ";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-destructive";
    if (score >= 40) return "text-warning";
    return "text-success";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "ความเสี่ยงสูง";
    if (score >= 40) return "ควรระวัง";
    return "ความเสี่ยงต่ำ";
  };

  return (
    <section className="py-20 px-4 bg-secondary/30" id="result">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-card rounded-3xl shadow-elevated border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    ผลการวิเคราะห์
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  ประเภทเอกสาร: <span className="font-medium text-foreground">{data.documentType}</span>
                </p>
              </div>

              <div className="text-center md:text-right">
                <div className={`text-4xl font-bold ${getScoreColor(data.riskScore || 0)}`}>
                  {data.riskScore}
                  <span className="text-lg font-normal text-muted-foreground">/100</span>
                </div>
                <p className={`text-sm font-medium ${getScoreColor(data.riskScore || 0)}`}>
                  {getScoreLabel(data.riskScore || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 md:p-8 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground mb-3">สรุปใจความสำคัญ</h3>
            <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
          </div>

          {/* Risk Items */}
          <div className="p-6 md:p-8">
            <h3 className="font-semibold text-foreground mb-4">รายละเอียดความเสี่ยง</h3>
            <div className="space-y-4">
              {data.risks?.map((risk, index) => {
                const colors = getRiskColor(risk.level);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}
                  >
                    <div className="flex items-start gap-3">
                      {risk.level === "low" ? (
                        <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                      ) : (
                        <AlertTriangle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{risk.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                            {getRiskLabel(risk.level)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {risk.description}
                        </p>
                        {risk.clause && (
                          <div className="p-3 rounded-lg bg-background/80 border border-border">
                            <p className="text-xs text-muted-foreground italic">
                              "{risk.clause}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 md:p-8 border-t border-border bg-muted/30">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" className="flex-1">
                <Phone className="w-5 h-5" />
                โทรหาสายด่วนทนาย
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="w-5 h-5" />
                ดาวน์โหลดรายงาน
              </Button>
              <Button variant="secondary" className="flex-1">
                <Share2 className="w-5 h-5" />
                แชร์เตือนชุมชน
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
