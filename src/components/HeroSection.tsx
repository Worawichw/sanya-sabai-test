import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "@/components/icons/ShieldCheck";
import { Camera, FileText, AlertTriangle } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
              <ShieldCheck className="w-5 h-5" />
              <span>AI คู่คิดทางกฎหมาย</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              สัญญา-สบาย
              <span className="block text-gradient-primary mt-2">
                เข้าใจสัญญา ง่ายนิดเดียว
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              แค่ถ่ายรูป AI จะช่วยแปลสัญญายากๆ เป็นภาษาชาวบ้าน 
              พร้อมเตือนจุดเสี่ยงที่ต้องระวัง ก่อนเซ็นชื่อ
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl">
                <Camera className="w-6 h-6" />
                สแกนเอกสาร
              </Button>
              <Button variant="outline" size="xl">
                ดูตัวอย่าง
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm">ฟรี ไม่มีค่าใช้จ่าย</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm">ปลอดภัย เป็นส่วนตัว</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm">ใช้งานง่าย</span>
              </div>
            </div>
          </div>

          {/* Visual Card */}
          <div className="flex-1 w-full max-w-md animate-slide-up">
            <div className="relative">
              {/* Main card */}
              <div className="bg-card rounded-3xl shadow-elevated p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">สัญญาเงินกู้</h3>
                    <p className="text-sm text-muted-foreground">วิเคราะห์แล้ว</p>
                  </div>
                </div>

                {/* Risk items preview */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive text-sm">ดอกเบี้ยสูงผิดปกติ</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        อัตราดอกเบี้ย 24% ต่อปี สูงกว่าที่กฎหมายกำหนด
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-warning text-sm">เงื่อนไขยึดทรัพย์</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        สามารถยึดทรัพย์ได้หากค้างชำระเพียง 1 งวด
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
                    <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-success text-sm">ระยะเวลาชำระคืน</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        12 เดือน ตามมาตรฐานทั่วไป
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-sm font-semibold shadow-card animate-float">
                พบ 2 จุดเสี่ยง!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
