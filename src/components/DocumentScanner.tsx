import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const DocumentScanner: React.FC = () => {
  return (
    <section className="py-20 px-4" id="scanner">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            สแกนเอกสารของคุณ
          </h2>
          <p className="text-lg text-muted-foreground">
            ถ่ายรูปหรืออัพโหลดสัญญาที่ต้องการวิเคราะห์
          </p>
        </div>

        <div className="relative p-8 md:p-12 rounded-3xl border-2 border-dashed border-border bg-card hover:border-primary/50 transition-all duration-300">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              พร้อมวิเคราะห์เอกสารด้วย AI
            </h3>
            <p className="text-muted-foreground mb-6">
              คลิกปุ่มด้านล่างเพื่อเริ่มสแกนเอกสาร
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/demo">
                  <Sparkles className="w-5 h-5" />
                  เริ่มสแกนด้วย AI
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              รองรับไฟล์ภาพ (JPG, PNG) และ PDF
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
