import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { UserRole } from '../types/clinic';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Phone,
  User,
  Heart,
  Eye,
  FileCode,
  ShieldCheck,
  Menu,
  X,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenElderlyUI: () => void;
  onOpenExportCenter: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenElderlyUI,
  onOpenExportCenter,
  onToggleMobileMenu
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios' | 'pc'>(isIOS ? 'ios' : 'android');

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowInstallGuide(true);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  return (
    <header className="bg-white border-b border-[#075563]/15 sticky top-0 z-40 shadow-xs">
      {/* Top Announcements & Cultural Compliance Strip */}
      <div className="bg-[#075563] text-[#FAF8F1] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#B59B62]" />
          <span className="font-medium text-[11px] sm:text-xs">
            {CLINIC_INFO.culturalComplianceNotice}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>ساعات الدوام: 9:00 ص - 1:00 م & 4:00 م - 8:00 م</span>
          <a
            href={`tel:${CLINIC_INFO.phone1}`}
            className="flex items-center gap-1 font-mono hover:text-[#B59B62] transition"
          >
            <Phone className="w-3 h-3 text-[#B59B62]" />
            {CLINIC_INFO.phone1}
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-[#075563] rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="شعار مجمع أم القرى الطبي"
              className="h-12 w-auto max-w-[130px] object-contain rounded-xl shadow-xs border border-gray-100 flex-shrink-0 bg-white p-0.5"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg sm:text-xl text-[#075563] tracking-tight leading-none">
                  {CLINIC_INFO.nameAr}
                </h1>
                <span className="hidden sm:inline-block bg-[#FAF8F1] text-[#B59B62] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#B59B62]/30">
                  بركاء 2026
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#B59B62] mt-0.5">
                {CLINIC_INFO.mottoAr} • {CLINIC_INFO.specialtyAr}
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Role Switcher, PWA Install, Elderly UI, Export */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Elderly UI Button */}
          <button
            onClick={onOpenElderlyUI}
            className="px-3 py-1.5 bg-[#FAF8F1] hover:bg-[#B59B62]/20 text-[#075563] text-xs font-bold rounded-xl border border-[#B59B62]/40 transition flex items-center gap-1.5 shadow-xs"
            title="واجهة ميسرة ومكبرة لكبار السن"
          >
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">واجهة كبار السن</span>
          </button>

          {/* Direct ZIP Download Link */}
          <a
            href="./um_alqura_complete_system_2026.zip"
            download="um_alqura_complete_system_2026.zip"
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#075563] text-xs font-black rounded-xl border border-amber-500/30 transition flex items-center gap-1.5 shadow-xs"
            title="تحميل جميع ملفات المشروع ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحميل المشروع ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </a>

          {/* Codebase & Database Export Modal Button */}
          <button
            onClick={onOpenExportCenter}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition flex items-center gap-1.5"
            title="تصدير كود Supabase و Flutter و Docker"
          >
            <FileCode className="w-3.5 h-3.5 text-[#075563]" />
            <span className="hidden md:inline">مركز التصدير و GitHub</span>
          </button>

          {/* Always Available PWA Install Button */}
          {!isInstalled ? (
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-[#2A9DA5] hover:bg-[#2A9DA5]/90 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs animate-pulse"
              title="تثبيت التطبيق على جهازك كأيقونة تطبيق رسمي"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق (PWA)</span>
            </button>
          ) : (
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              التطبيق مثبت
            </span>
          )}

          {/* Role Switcher Dropdown */}
          <div className="flex items-center bg-[#FAF8F1] border border-gray-200 rounded-xl p-1 text-xs">
            <span className="text-[10px] text-gray-500 px-1 hidden lg:inline">الدور:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent font-bold text-[#075563] focus:outline-hidden cursor-pointer"
            >
              <option value="physiotherapist">د. سبأ (أخصائية العلاج الطبيعي)</option>
              <option value="assistant">المساعدة الطبية</option>
              <option value="receptionist">موظفة الاستقبال والتنسيق</option>
              <option value="admin">إدارة المجمع (Admin)</option>
              <option value="patient">بوابة المراجع</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comprehensive PWA Installation Guide Modal for Android, iOS & Desktop */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.jpg"
                  alt="شعار مجمع أم القرى الطبي"
                  className="w-10 h-10 object-contain rounded-xl border border-gray-200 bg-white p-0.5"
                />
                <div>
                  <h3 className="font-bold text-base text-[#075563]">تثبيت تطبيق مجمع أم القرى الطبي (PWA)</h3>
                  <p className="text-[11px] text-gray-500">يعمل كأيقونة تطبيق كاملة بدون الحاجة لمتجر</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex bg-[#FAF8F1] p-1 rounded-xl border border-gray-200 text-xs font-bold">
              <button
                onClick={() => setActiveGuideTab('android')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  activeGuideTab === 'android' ? 'bg-[#075563] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                أندرويد (Chrome)
              </button>
              <button
                onClick={() => setActiveGuideTab('ios')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  activeGuideTab === 'ios' ? 'bg-[#075563] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                آيفون (Safari)
              </button>
              <button
                onClick={() => setActiveGuideTab('pc')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  activeGuideTab === 'pc' ? 'bg-[#075563] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                الكمبيوتر (Chrome/Edge)
              </button>
            </div>

            {/* Guide Content */}
            {activeGuideTab === 'android' && (
              <div className="text-xs text-gray-700 space-y-2.5 leading-relaxed bg-[#FAF8F1] p-4 rounded-2xl border border-[#B59B62]/30">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <span>افتح الرابط في متصفح <strong>Google Chrome</strong> على هاتفك الأندرويد.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <span>اضغط على قائمة الخيارات (<strong>الثلاث نقاط ⋮</strong>) في الزاوية العلوية للمتصفح.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <span>اضغط على <strong>"تثبيت التطبيق" (Install app)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">4</span>
                  <span>ستظهر أيقونة التطبيق باسم <strong>"أم القرى"</strong> على شاشة هاتفك وتفتح كتطبيق مستقل تماماً وبسرعة فائقة.</span>
                </div>
              </div>
            )}

            {activeGuideTab === 'ios' && (
              <div className="text-xs text-gray-700 space-y-2.5 leading-relaxed bg-[#FAF8F1] p-4 rounded-2xl border border-[#B59B62]/30">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <span>افتح الرابط في متصفح <strong>Safari</strong> الأصلي على جهاز الآيفون أو الآيباد.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <span>اضغط على أيقونة <strong>المشاركة (Share <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" />)</strong> في شريط Safari السفلي.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <span>مرر للأسفل واضغط على <strong>"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">4</span>
                  <span>اضغط على <strong>إضافة (Add)</strong> في الزاوية العليا لتثبيت أيقونة التطبيق بشعار مجمع أم القرى على شاشتك.</span>
                </div>
              </div>
            )}

            {activeGuideTab === 'pc' && (
              <div className="text-xs text-gray-700 space-y-2.5 leading-relaxed bg-[#FAF8F1] p-4 rounded-2xl border border-[#B59B62]/30">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <span>في متصفح Chrome أو Edge على الكمبيوتر، انظر إلى نهاية شريط الرابط (Address Bar).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <span>اضغط على أيقونة <strong>تثبيت التطبيق (Install App)</strong> التي تظهر كشاشة كمبيوتر وسهم صغير.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#075563] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <span>سيتم فتح النظام في نافذة مستقلة كبرنامج مكتبي على شريط المهام وسطح المكتب.</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 bg-[#075563] text-white text-xs font-bold rounded-xl transition hover:bg-[#075563]/90 shadow-md"
            >
              حسناً، فهمت الطريقة
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
