
import React from "react";
import { Card } from "@/components/ui/card";
import { Home, Settings, Headphones, BookOpen, Sparkles, Book } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: Book, label: "المصحف", path: "/quran" },
    { icon: BookOpen, label: "الأذكار", path: "/adhkar" },
    { icon: Sparkles, label: "التسبيح", path: "/tasbih" },
    { icon: Settings, label: "الإعدادات", path: "/settings" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[60px] group ${
                  isActive 
                    ? "bg-gradient-to-t from-purple-500 to-pink-500 shadow-lg scale-105" 
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors duration-300 ${
                    isActive 
                      ? "text-white" 
                      : "text-gray-600 group-hover:text-purple-600"
                  }`} 
                />
                <span className={`text-xs font-medium mt-1 transition-colors duration-300 ${
                  isActive 
                    ? "text-white" 
                    : "text-gray-600 group-hover:text-purple-600"
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default BottomNavigation;
