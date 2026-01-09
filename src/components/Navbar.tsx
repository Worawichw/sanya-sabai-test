import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "@/components/icons/ShieldCheck";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <ShieldCheck className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-foreground">สัญญา-สบาย</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              วิธีใช้งาน
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              ประเภทสัญญา
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              เกี่ยวกับเรา
            </a>
            <Button variant="hero" size="sm">
              เริ่มสแกน
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">
                วิธีใช้งาน
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">
                ประเภทสัญญา
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">
                เกี่ยวกับเรา
              </a>
              <Button variant="hero" className="w-full mt-2">
                เริ่มสแกน
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
