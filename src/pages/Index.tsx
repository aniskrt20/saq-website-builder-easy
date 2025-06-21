
import { useState, useEffect } from 'react';
import PrayerTimes from '../components/PrayerTimes';
import ServicesGrid from '../components/ServicesGrid';
import HadithSection from '../components/HadithSection';
import IslamicHeader from '../components/IslamicHeader';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200" dir="rtl">
      <IslamicHeader />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Prayer Times */}
          <div className="space-y-6">
            <PrayerTimes />
            <HadithSection />
          </div>
          
          {/* Right Column - Services */}
          <div>
            <ServicesGrid />
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <div className="flex flex-col items-center p-2">
            <div className="w-6 h-6 bg-teal-500 rounded mb-1"></div>
            <span className="text-xs text-teal-600">الرئيسية</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs text-gray-500">القبلة</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs text-gray-500">الأذكار</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs text-gray-500">الإذاعات</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs text-gray-500">الإعدادات</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
