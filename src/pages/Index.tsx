
import React from "react";
import Header from "@/components/Header";
import PrayerTimes from "@/components/PrayerTimes";
import QuickServices from "@/components/QuickServices";
import DailyQuote from "@/components/DailyQuote";
import BottomNavigation from "@/components/BottomNavigation";
import ThreeDBackground from "@/components/ThreeDBackground";
import { Button } from "@/components/ui/button";
import { Volume2, Palette } from "lucide-react";
import { useTestAdhan } from "@/hooks/use-test-adhan";
import { toast } from "sonner";

const Index = () => {
  const { testAdhan } = useTestAdhan();

  // دالة للتعامل مع الزر مع إشعار
  const handleTestAdhan = () => {
    testAdhan();
    toast.info("تم تشغيل الأذان للتجربة");
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950">
      {/* خلفية ثلاثية أبعاد عصرية متحركة */}
      <ThreeDBackground />
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-teal-50/30 to-cyan-100/40 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-cyan-950/60"></div>
        
        {/* Animated Particles - More Elegant */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-30 dark:opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <div 
                className="w-1 h-1 bg-emerald-400 dark:bg-emerald-300 rounded-full animate-pulse"
                style={{
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              ></div>
            </div>
          ))}
        </div>
        
        {/* Floating Geometric Shapes - Islamic Pattern Inspired */}
        <div className="absolute top-1/4 left-1/6 w-32 h-32 rotate-45 opacity-10 dark:opacity-5">
          <div className="w-full h-full border-2 border-emerald-400 rounded-lg animate-spin" style={{animationDuration: '20s'}}></div>
        </div>
        <div className="absolute bottom-1/3 right-1/5 w-24 h-24 rotate-12 opacity-10 dark:opacity-5">
          <div className="w-full h-full border-2 border-teal-400 rounded-full animate-bounce" style={{animationDuration: '6s'}}></div>
        </div>
        
        {/* Subtle Orbs */}
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-700/10 dark:to-teal-700/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 dark:from-cyan-700/10 dark:to-blue-700/10 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Content with improved spacing and centering */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Enhanced Header */}
        <div className="pt-6 px-4 pb-2">
          <div className="transform hover:scale-[1.02] transition-all duration-500 max-w-4xl mx-auto">
            <Header />
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
            {/* Prayer Times - Enhanced Card */}
            <div className="transform hover:scale-[1.02] transition-all duration-500">
              <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/30 shadow-2xl shadow-emerald-500/10">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
                <div className="p-1">
                  <PrayerTimes />
                </div>
              </div>
            </div>

            {/* Grid Layout for Services and Quote - Improved Responsiveness */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Quick Services - Enhanced */}
              <div className="transform hover:scale-[1.02] transition-all duration-500">
                <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/30 shadow-2xl shadow-blue-500/10">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
                  <div className="p-6">
                    <QuickServices />
                  </div>
                </div>
              </div>

              {/* Daily Quote - Enhanced */}
              <div className="transform hover:scale-[1.02] transition-all duration-500">
                <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-purple-200/50 dark:border-purple-700/30 shadow-2xl shadow-purple-500/10">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400"></div>
                  <div className="p-6">
                    <DailyQuote />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artistic Signature/Watermark */}
        <div className="relative z-10 pb-24">
          <div className="flex justify-center items-center">
            <div className="group cursor-default">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-400/20 dark:via-teal-400/20 dark:to-cyan-400/20 backdrop-blur-sm border border-emerald-200/30 dark:border-emerald-700/30 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 arabic-text">
                      صُنع بحب من
                    </p>
                    <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent arabic-text">
                      كرطوش محمد أنيس
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-md transform rotate-12">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
