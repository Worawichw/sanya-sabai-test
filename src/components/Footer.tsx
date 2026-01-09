import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { ShieldCheck } from "@/components/icons/ShieldCheck";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-8 h-8" />
              <span className="text-2xl font-bold">สัญญา-สบาย</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              AI คู่คิดทางกฎหมายและการเงิน ช่วยให้คนไทยทุกคนเข้าถึงความยุติธรรม
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">ลิงก์ด่วน</h4>
            <ul className="space-y-3 text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  วิธีใช้งาน
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  ประเภทสัญญาที่รองรับ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  คำถามที่พบบ่อย
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  นโยบายความเป็นส่วนตัว
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-3 text-background/70">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>สายด่วน: 1167 (สภาทนายความ)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>support@sanya-sabai.th</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>กรุงเทพมหานคร, ประเทศไทย</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-background/10 mb-8">
          <p className="text-sm text-background/70 text-center">
            <strong>ข้อสำคัญ:</strong> การวิเคราะห์ของ AI เป็นเพียงการให้ข้อมูลเบื้องต้น 
            ไม่ใช่คำแนะนำทางกฎหมายที่เป็นทางการ กรุณาปรึกษาทนายความสำหรับกรณีที่ซับซ้อน
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-background/50 text-sm">
          <p>© 2567 สัญญา-สบาย. พัฒนาเพื่อคนไทยทุกคน</p>
        </div>
      </div>
    </footer>
  );
};
