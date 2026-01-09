import React from "react";
import { FileText, Users, AlertTriangle, Shield } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: "10,000+",
    label: "เอกสารที่สแกนแล้ว",
  },
  {
    icon: Users,
    value: "5,000+",
    label: "ผู้ใช้งาน",
  },
  {
    icon: AlertTriangle,
    value: "3,500+",
    label: "จุดเสี่ยงที่ตรวจพบ",
  },
  {
    icon: Shield,
    value: "50+",
    label: "ชุมชนที่เข้าร่วม",
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
