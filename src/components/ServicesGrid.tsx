
const ServicesGrid = () => {
  const services = [
    { name: 'قراءة القرآن', icon: '📖', color: 'bg-purple-500', textColor: 'text-purple-500' },
    { name: 'الإذاعات', icon: '📻', color: 'bg-blue-500', textColor: 'text-blue-500' },
    { name: 'الأذكار', icon: '📿', color: 'bg-teal-500', textColor: 'text-teal-500' },
    { name: 'من نحن', icon: '❓', color: 'bg-indigo-500', textColor: 'text-indigo-500' },
    { name: 'التسبيح', icon: '🕌', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { name: 'الحديث', icon: '📚', color: 'bg-red-500', textColor: 'text-red-500' },
    { name: 'حقوق النشر', icon: '⏰', color: 'bg-pink-500', textColor: 'text-pink-500' },
    { name: 'سياسة الخصوصية', icon: '🛡️', color: 'bg-green-500', textColor: 'text-green-500' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">الخدمات السريعة</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center text-white text-xl mb-2 shadow-lg`}>
              {service.icon}
            </div>
            <span className="text-xs text-gray-700 text-center leading-tight">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;
