import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, FileText, Loader2 } from "lucide-react";

interface DocumentScannerProps {
  onScanComplete?: (result: string) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({ onScanComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onScanComplete?.("Document processed successfully");
    }, 2000);
  };

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

        <div
          className={`
            relative p-8 md:p-12 rounded-3xl border-2 border-dashed transition-all duration-300
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border bg-card hover:border-primary/50"
            }
            ${isProcessing ? "pointer-events-none" : ""}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                กำลังวิเคราะห์เอกสาร...
              </h3>
              <p className="text-muted-foreground">
                AI กำลังอ่านและแปลความหมายสัญญาให้คุณ
              </p>
            </div>
          ) : uploadedFile ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                <FileText className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {uploadedFile.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                พร้อมวิเคราะห์แล้ว
              </p>
              <Button variant="hero" onClick={() => setUploadedFile(null)}>
                สแกนเอกสารใหม่
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
};
