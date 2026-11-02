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
  X
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
  const [showIOSGuide, setShowIOSGuide] = useState(false);

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
              src="/icon.svg"
              alt="شعار مجمع أم القرى الطبي"
              className="w-11 h-11 rounded-xl shadow-xs border border-gray-100 flex-shrink-0"
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

          {/* Codebase & Database Export Modal Button */}
          <button
            onClick={onOpenExportCenter}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition flex items-center gap-1.5"
            title="تصدير كود Supabase و Flutter و Docker"
          >
            <FileCode className="w-3.5 h-3.5 text-[#075563]" />
            <span className="hidden md:inline">مركز التصدير</span>
          </button>

          {/* In-App PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="px-3.5 py-1.5 bg-[#2A9DA5] hover:bg-[#2A9DA5]/90 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs animate-pulse"
              title="تثبيت التطبيق على جهازك كأيقونة تطبيق رسمي"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 bg-[#FAF8F1] text-[#075563] border border-[#075563] text-xs font-bold rounded-xl hover:bg-white transition flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تثبيت على الآيفون</span>
            </button>
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

      {/* iOS Safari PWA Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-right">
            <h3 className="font-bold text-lg text-[#075563]">طريقة التثبيت على الآيفون (iOS Safari)</h3>
            <div className="text-xs text-gray-700 space-y-2 leading-relaxed bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/30">
              <p>1. اضغط على أيقونة <strong>المشاركة (Share)</strong> في شريط متصفح Safari السفلي.</p>
              <p>2. مرر للأسفل واضغط على <strong>إضافة إلى الصفحة الرئيسية (Add to Home Screen)</strong>.</p>
              <p>3. اضغط (إضافة / Add) في الزاوية العليا لتثبيت أيقونة مجمع أم القرى الطبي.</p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-[#075563] text-white text-xs font-bold rounded-xl transition hover:bg-[#075563]/90"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
