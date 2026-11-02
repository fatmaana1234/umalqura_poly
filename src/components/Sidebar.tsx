import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  FileText,
  Activity,
  Calculator,
  Package,
  Video,
  LineChart,
  ShieldAlert,
  MessageSquare,
  Award,
  Sparkles,
  Camera,
  Bot,
  BrainCircuit,
  Layers,
  Scale,
  Crosshair,
  Lock,
  HeartPulse,
  Flame,
  Images,
  Users,
  ChevronLeft
} from 'lucide-react';

export type ActiveNavTab =
  | 'dashboard'
  | 'appointments'
  | 'soap_notes'
  | 'body_map'
  | 'calculators'
  | 'packages'
  | 'exercise_library'
  | 'progress_charts'
  | 'insurance_billing'
  | 'whatsapp_notifications'
  | 'discharge_report'
  | 'ai_scribe'
  | 'ai_motion_camera'
  | 'ai_rep_counter'
  | 'ai_voice_bot'
  | 'ai_predictive'
  | 'clinic_spine'
  | 'clinic_knee'
  | 'clinic_shoulder'
  | 'clinic_sports_rtp'
  | 'clinic_surgical'
  | 'clinic_geriatric'
  | 'clinic_neuro'
  | 'clinic_fitness'
  | 'equipment_gallery'
  | 'patients_directory';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navSections = [
    {
      title: 'الرئيسية والإدارة',
      items: [
        { id: 'dashboard', label: 'لوحة التحكم والمؤشرات', icon: LayoutDashboard },
        { id: 'patients_directory', label: 'سجل المراجعين والمرضى', icon: Users },
        { id: 'equipment_gallery', label: 'معرض أجهزة المجمع الحقيقية', icon: Images },
      ]
    },
    {
      title: 'المرحلة 1: الأنظمة الأساسية (1-10)',
      items: [
        { id: 'appointments', label: '1. الجدولة خماسية الأبعاد (5D Conflict)', icon: CalendarCheck2 },
        { id: 'soap_notes', label: '2. ملفات تقييم SOAP المطورة', icon: FileText },
        { id: 'body_map', label: '3. الخريطة البصرية لمواضع الألم', icon: Activity },
        { id: 'calculators', label: '4. الحواسب الطبية (DASH/Oswestry/Berg)', icon: Calculator },
        { id: 'packages', label: '5. باقات وكورسات العلاج (خصم 10%)', icon: Package },
        { id: 'exercise_library', label: '6. مكتبة التمارين المحتشمة', icon: Video },
        { id: 'progress_charts', label: '7. الرسم البياني للتحسن والـ ROM', icon: LineChart },
        { id: 'insurance_billing', label: '8. مطالبات التأمين العماني (ضمان)', icon: ShieldAlert },
        { id: 'whatsapp_notifications', label: '9. إشعارات WhatsApp الذكية', icon: MessageSquare },
        { id: 'discharge_report', label: '10. تقرير التخرج الطبي النهائي PDF', icon: Award },
      ]
    },
    {
      title: 'المرحلة 2: إضافات الذكاء الاصطناعي (11-15)',
      items: [
        { id: 'ai_scribe', label: '11. الموثق الصوتي الذكي (AI Scribe)', icon: Sparkles },
        { id: 'ai_motion_camera', label: '12. تحليل المدى بالكاميرا (Markerless ROM)', icon: Camera },
        { id: 'ai_rep_counter', label: '13. مدرب التمارين المنزلي بالكاميرا', icon: Activity },
        { id: 'ai_voice_bot', label: '14. المساعد الصوتي العماني للانتظار', icon: Bot },
        { id: 'ai_predictive', label: '15. التنبؤ الذكي بنسب التعافي', icon: BrainCircuit },
      ]
    },
    {
      title: 'المرحلة 3: العيادات المتخصصة (16-23)',
      items: [
        { id: 'clinic_spine', label: '16. عيادة العمود الفقري والشد المحوسب', icon: Layers },
        { id: 'clinic_knee', label: '17. عيادة الركبة والخشونة وحمل المفصل', icon: Scale },
        { id: 'clinic_shoulder', label: '18. عيادة الكتف والكتف المتجمد', icon: Crosshair },
        { id: 'clinic_sports_rtp', label: '19. الإصابات الرياضية والعودة للملاعب', icon: Lock },
        { id: 'clinic_surgical', label: '20. التأهيل بعد العمليات والخطوط الحمراء', icon: ShieldAlert },
        { id: 'clinic_geriatric', label: '21. تأهيل كبار السن ومخاطر السقوط', icon: Activity },
        { id: 'clinic_neuro', label: '22. التأهيل العصبي وتشنج العضلات', icon: HeartPulse },
        { id: 'clinic_fitness', label: '23. اللياقة الطبية والـ InBody وحرق الدهون', icon: Flame },
      ]
    }
  ];

  const handleSelect = (id: ActiveNavTab) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 right-0 h-screen w-72 bg-white border-l border-gray-200 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Clinic Mini Header in Sidebar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF8F1]">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="شعار مجمع أم القرى الطبي"
              className="h-10 w-auto max-w-[80px] object-contain rounded-lg border border-gray-200 bg-white p-0.5"
            />
            <div>
              <div className="text-xs font-black text-[#075563]">مجمع أم القرى الطبي</div>
              <div className="text-[10px] text-[#B59B62] font-semibold">بركاء - سلطنة عمان 2026</div>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-gray-500 hover:text-gray-800 p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Links Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id as ActiveNavTab)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-right ${
                      isActive
                        ? 'bg-[#075563] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-[#FAF8F1] hover:text-[#075563]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#B59B62]' : 'text-gray-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer with Location & Quick Call */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 space-y-1 text-center">
          <div>بناية R&B، بركاء، سلطنة عمان</div>
          <div className="font-mono text-[#075563] font-bold">+968 79470050</div>
        </div>
      </aside>
    </>
  );
};
