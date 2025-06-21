
const IslamicHeader = () => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-8">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">صلاة جارية</h1>
        <p className="text-sm opacity-90">لكل تهديد الهوية بنجاح</p>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold">بِسْمِ اللّهِ الرَّحْمَنِ</h2>
        <p className="text-sm opacity-90">١٤٤٥ هجريا ٢٨</p>
      </div>
      
      {/* Search Bar */}
      <div className="mt-6 mx-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-white/80">أوقات الصلاة</span>
          <div className="text-white/80">🔍</div>
        </div>
      </div>
    </div>
  );
};

export default IslamicHeader;
