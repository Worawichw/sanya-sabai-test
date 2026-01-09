import React, { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Camera, Upload, FileText, Loader2, ArrowLeft, 
  AlertTriangle, CheckCircle, Phone, Download, Share2,
  Sparkles, Eye, RotateCcw
} from "lucide-react";
import { ShieldCheck } from "@/components/icons/ShieldCheck";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface RiskItem {
  level: "high" | "medium" | "low";
  title: string;
  description: string;
  clause?: string;
}

interface AnalysisData {
  documentType: string;
  riskScore: number;
  summary: string;
  risks: RiskItem[];
  recommendations?: string[];
}

const Demo: React.FC = () => {
  const [step, setStep] = useState<"upload" | "preview" | "analyzing" | "result">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setStep("preview");
    };
    reader.readAsDataURL(file);
  };

  const analyzeDocument = useCallback(async () => {
    if (!imagePreview) return;
    
    setStep("analyzing");
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-document", {
        body: { imageBase64: imagePreview }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.analysis) {
        setAnalysisResult(data.analysis);
        setStep("result");
        toast.success("วิเคราะห์เสร็จสิ้น!");
      } else {
        throw new Error("ไม่สามารถวิเคราะห์เอกสารได้");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
      setStep("preview");
    }
  }, [imagePreview]);

  const resetDemo = () => {
    setStep("upload");
    setUploadedFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
  };

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
      case "high": return "เสี่ยงสูง";
      case "medium": return "ควรระวัง";
      case "low": return "ปกติ";
      default: return "";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                ทดลองสแกนเอกสาร
              </h1>
              <p className="text-muted-foreground">
                อัพโหลดรูปสัญญาเพื่อให้ AI วิเคราะห์ความเสี่ยง
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["อัพโหลด", "ตรวจสอบ", "วิเคราะห์", "ผลลัพธ์"].map((label, index) => {
              const stepIndex = ["upload", "preview", "analyzing", "result"].indexOf(step);
              const isActive = index <= stepIndex;
              const isCurrent = index === stepIndex;
              return (
                <React.Fragment key={label}>
                  {index > 0 && (
                    <div className={`h-0.5 w-8 md:w-16 ${isActive ? "bg-primary" : "bg-border"}`} />
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCurrent ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : 
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                    `}>
                      {index + 1}
                    </div>
                    <span className={`text-xs ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Step Content */}
          {step === "upload" && (
            <div
              className={`
                relative p-8 md:p-12 rounded-3xl border-2 border-dashed transition-all duration-300
                ${isDragging 
                  ? "border-primary bg-primary/5 scale-[1.02]" 
                  : "border-border bg-card hover:border-primary/50"
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  ลากไฟล์มาวางที่นี่
                </h3>
                <p className="text-muted-foreground mb-6">
                  หรือเลือกจากตัวเลือกด้านล่าง
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" asChild>
                    <label className="cursor-pointer">
                      <Camera className="w-5 h-5" />
                      ถ่ายรูป
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </label>
                  </Button>
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-5 h-5" />
                      อัพโหลดไฟล์
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </label>
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  รองรับไฟล์ภาพ (JPG, PNG) และ PDF
                </p>
              </div>
            </div>
          )}

          {step === "preview" && imagePreview && (
            <div className="space-y-6">
              <div className="bg-card rounded-3xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-primary" />
                    <span className="font-medium">ตรวจสอบเอกสาร</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{uploadedFile?.name}</span>
                </div>
                <div className="p-4 bg-muted/30">
                  <img 
                    src={imagePreview} 
                    alt="Document preview" 
                    className="max-h-[400px] mx-auto rounded-lg object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={resetDemo} className="flex-1">
                  <RotateCcw className="w-5 h-5" />
                  เลือกรูปใหม่
                </Button>
                <Button variant="hero" onClick={analyzeDocument} className="flex-1">
                  <Sparkles className="w-5 h-5" />
                  เริ่มวิเคราะห์ด้วย AI
                </Button>
              </div>
            </div>
          )}

          {step === "analyzing" && (
            <div className="bg-card rounded-3xl border border-border p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                AI กำลังวิเคราะห์เอกสาร
              </h3>
              <p className="text-muted-foreground mb-6">
                กำลังอ่านข้อความ ตรวจสอบเงื่อนไข และประเมินความเสี่ยง
              </p>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                {["อ่านข้อความในเอกสาร", "วิเคราะห์เงื่อนไขสัญญา", "ตรวจสอบกฎหมายที่เกี่ยวข้อง"].map((task, i) => (
                  <div key={task} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <span className="text-muted-foreground">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "result" && analysisResult && (
            <div className="space-y-6">
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
                        ประเภทเอกสาร: <span className="font-medium text-foreground">{analysisResult.documentType}</span>
                      </p>
                    </div>

                    <div className="text-center md:text-right">
                      <div className={`text-4xl font-bold ${getScoreColor(analysisResult.riskScore)}`}>
                        {analysisResult.riskScore}
                        <span className="text-lg font-normal text-muted-foreground">/100</span>
                      </div>
                      <p className={`text-sm font-medium ${getScoreColor(analysisResult.riskScore)}`}>
                        {getScoreLabel(analysisResult.riskScore)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6 md:p-8 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-3">สรุปใจความสำคัญ</h3>
                  <p className="text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
                </div>

                {/* Risk Items */}
                {analysisResult.risks && analysisResult.risks.length > 0 && (
                  <div className="p-6 md:p-8 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-4">รายละเอียดความเสี่ยง</h3>
                    <div className="space-y-4">
                      {analysisResult.risks.map((risk, index) => {
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
                )}

                {/* Recommendations */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div className="p-6 md:p-8 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-4">คำแนะนำ</h3>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="p-6 md:p-8 bg-muted/30">
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

              <Button variant="outline" onClick={resetDemo} className="w-full">
                <RotateCcw className="w-5 h-5" />
                วิเคราะห์เอกสารใหม่
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
