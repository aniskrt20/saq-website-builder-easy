
import { useState, useEffect } from 'react';

const PrayerTimes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const prayers = [
    { name: 'الفجر', time: '03:41', isActive: false },
    { name: 'الشروق', time: '05:32', isActive: false },
    { name: 'الظهر', time: '12:51', isActive: true },
    { name: 'العصر', time: '16:42', isActive: false },
    { name: 'المغرب', time: '20:10', isActive: false },
    { name: 'العشاء', time: '22:01', isActive: false },
  ];

  return (
    <div className="space-y-4">
      {/* Current Prayer Highlighted */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-sm">الصلاة القادمة</span>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">12:51</div>
          <div className="text-sm opacity-90">الظهر - قبلة</div>
        </div>
      </div>

      {/* All Prayer Times Grid */}
      <div className="grid grid-cols-3 gap-3">
        {prayers.map((prayer, index) => (
          <div key={index} className={`p-4 rounded-xl text-center ${
            prayer.isActive 
              ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg' 
              : 'bg-white shadow-sm border border-gray-100'
          }`}>
            <div className={`text-lg font-bold ${prayer.isActive ? 'text-white' : 'text-gray-800'}`}>
              {prayer.time}
            </div>
            <div className={`text-sm ${prayer.isActive ? 'text-white/90' : 'text-gray-600'}`}>
              {prayer.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimes;
