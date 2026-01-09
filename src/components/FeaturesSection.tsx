import React from "react";
import { Camera, Brain, AlertTriangle, Phone, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "สแกนง่าย แค่ถ่ายรูป",
    description: "ถ่ายรูปสัญญาด้วยมือถือ ระบบจะอ่านข้อความให้อัตโนมัติ ไม่ต้องพิมพ์อะไรเลย",
    color: "primary",
  },
  {
    icon: Brain,
    title: "AI แปลเป็นภาษาชาวบ้าน",
    description: "เปลี่ยนภาษากฎหมายซับซ้อนให้เข้าใจง่าย รู้ว่าสัญญาบอกอะไรจริงๆ",
    color: "accent",
  },
  {
    icon: AlertTriangle,
    title: "เตือนจุดเสี่ยง",
    description: "ไฮไลต์ข้อความที่อาจทำให้เสียเปรียบ เช่น ดอกเบี้ยแฝง ค่าปรับผิดปกติ",
    color: "destructive",
  },
  {
    icon: Shield,
    title: "ฐานข้อมูลกลโกง",
    description: "เชื่อมต่อกับฐานข้อมูลสัญญาอันตรายทั่วประเทศ แจ้งเตือนถ้าเจอรูปแบบคล้ายกัน",
    color: "warning",
  },
  {
    icon: Users,
    title: "ชุมชนช่วยกัน",
    description: "แชร์ประสบการณ์และเตือนภัยกันในชุมชน สร้างภูมิคุ้มกันร่วมกัน",
    color: "success",
  },
  {
    icon: Phone,
    title: "สายด่วนทนาย",
    description: "หากเจอปัญหาซับซ้อน เชื่อมต่อสภาทนายความได้ทันที",
    color: "primary",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20",
  },
  destructive: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/20",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
  },
};

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ทำไมต้องใช้ สัญญา-สบาย?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            เราช่วยให้คุณเข้าใจสัญญาทุกประเภท ก่อนเซ็นชื่อ ไม่ถูกเอาเปรียบอีกต่อไป
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className="group p-6 bg-card rounded-2xl border border-border shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
