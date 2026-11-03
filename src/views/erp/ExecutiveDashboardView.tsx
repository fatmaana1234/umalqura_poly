import React from 'react';
import {
  Factory,
  Building2,
  TrendingUp,
  Package,
  Layers,
  Users,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Clock,
  ArrowUpRight,
  DollarSign,
  Activity,
  Cpu
} from 'lucide-react';
import { Warehouse, InventoryItem, ProductionOrder, SalesInvoice, Employee, BiometricTerminal } from '../../types/erp';
import { Patient, Appointment } from '../../types/clinic';

interface ExecutiveDashboardViewProps {
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  productionOrders: ProductionOrder[];
  salesInvoices: SalesInvoice[];
  employees: Employee[];
  terminals: BiometricTerminal[];
  patients: Patient[];
  appointments: Appointment[];
  onNavigate: (tabId: string) => void;
  onOpenVoiceAssistant: () => void;
  onOpenAiAdvisor: () => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  warehouses,
  inventory,
  productionOrders,
  salesInvoices,
  employees,
  terminals,
  patients,
  appointments,
  onNavigate,
  onOpenVoiceAssistant,
  onOpenAiAdvisor
}) => {
  // Inventory metrics
  const totalValuation = inventory.reduce((acc, it) => acc + it.quantity * it.costPriceOMR, 0);
  const lowStockCount = inventory.filter((it) => it.quantity <= it.minReorderLevel).length;

  // Production metrics
  const activeProductionOrders = productionOrders.filter((po) => po.status === 'in_progress');
  const completedProductionOrders = productionOrders.filter((po) => po.status === 'completed');

  // Sales metrics
  const totalSalesOMR = salesInvoices.reduce((acc, inv) => acc + inv.totalOMR, 0);

  // Clinic metrics
  const clinicRevenueEstOMR = appointments.length * 15 + patients.length * 3;

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Top Banner with Entity Context & Voice / AI quick triggers */}
      <div className="bg-gradient-to-l from-[#075563] via-[#0b6374] to-[#2A9DA5] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-amber-200">
              <ShieldCheck className="w-4 h-4" />
              منظومة تخطيط الموارد المؤسسية الشاملة ERP 2026
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              لوحة الإدارة التنفيذية الموحدة — المصنع والمجمع الطبي
            </h1>
            <p className="text-white/80 text-xs md:text-sm max-w-2xl leading-relaxed">
              إدارة تكاملية تربط عمليات تصنيع المستلزمات والدعامات الطبية، مستودعات التخزين الثلاثة، الجدولة خماسية الأبعاد،
              وسجلات المراجعين بمجمع أم القرى الطبي في بركاء، سلطنة عمان.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenVoiceAssistant}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#075563] rounded-xl font-bold text-xs shadow-md transition"
            >
              <Cpu className="w-4 h-4" />
              المساعد الصوتي التنفيذي
            </button>
            <button
              onClick={onOpenAiAdvisor}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs backdrop-blur-md transition"
            >
              <Activity className="w-4 h-4" />
              مستشار الذكاء الاصطناعي
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Inventory Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2A9DA5]/40 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#075563] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
              3 مستودعات
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500 font-semibold">قيمة المخزون الإجمالي</div>
            <div className="text-2xl font-black text-[#075563] mt-1 font-mono">
              {totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-sans text-gray-500">ر.ع</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
              <span>{inventory.length} صنف مسجل</span>
              {lowStockCount > 0 && (
                <span className="text-amber-600 font-bold">({lowStockCount} قارب النفاذ)</span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 2: Production Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2A9DA5]/40 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {activeProductionOrders.length} قيد التشغيل
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500 font-semibold">أوامر الإنتاج والتصنيع</div>
            <div className="text-2xl font-black text-[#24383B] mt-1 font-mono">
              {productionOrders.length} <span className="text-xs font-sans text-gray-500">أمر إنتاج</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">
              {completedProductionOrders.length} أمر منجز ومطابق للمواصفات
            </div>
          </div>
        </div>

        {/* KPI 3: Total Sales & Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2A9DA5]/40 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              ضريبة VAT 5%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500 font-semibold">مبيعات المصنع والعيادات</div>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
              {(totalSalesOMR + clinicRevenueEstOMR).toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
              <span className="text-xs font-sans text-gray-500">ر.ع</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              مبيعات المصنع: {totalSalesOMR.toFixed(2)} | العيادة: {clinicRevenueEstOMR.toFixed(2)} ر.ع
            </div>
          </div>
        </div>

        {/* KPI 4: Active Biometrics & Workforce */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2A9DA5]/40 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {terminals.filter((t) => t.status === 'online').length}/{terminals.length} أجهزة متصلة
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500 font-semibold">القوى العاملة وحضور البصمة</div>
            <div className="text-2xl font-black text-[#24383B] mt-1 font-mono">
              {employees.length} <span className="text-xs font-sans text-gray-500">موظف معتمد</span>
            </div>
            <div className="text-[11px] text-blue-600 font-bold mt-1">
              مزامنة حية مع بوابات ZKTeco
            </div>
          </div>
        </div>
      </div>

      {/* Two-Entity Split Operations Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entity A: Manufacturing Arm */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#075563] text-white flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#075563]">عمليات مصنع المستلزمات الطبية</h3>
                <p className="text-xs text-gray-400">خطوط إنتاج الدعامات، أطقم الشد، والمستهلكات</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('erp_manufacturing')}
              className="text-xs font-bold text-[#075563] hover:underline flex items-center gap-1"
            >
              إدارة الإنتاج
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Warehouses Status */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-gray-500">حالة المستودعات الثلاثة:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {warehouses.map((wh) => (
                <div key={wh.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] font-bold text-gray-700 truncate">{wh.nameAr.split(' ')[1]}</div>
                  <div className="text-xs font-mono font-bold text-[#075563] mt-1">
                    {wh.totalValuationOMR.toLocaleString()} ر.ع
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{wh.totalItemsCount} أصناف نشطة</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Production Orders list */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-500">أحدث أوامر التشغيل:</div>
            {productionOrders.slice(0, 2).map((po) => (
              <div
                key={po.id}
                className="p-3 rounded-xl border border-gray-100 bg-[#FAF8F1]/40 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#075563]">{po.productNameAr}</div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {po.orderNumber} • المشرف: {po.supervisor}
                  </div>
                </div>
                <div className="text-left">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {po.status === 'completed' ? 'منجز 100%' : `منجز ${po.completedQuantity}/${po.targetQuantity}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entity B: Medical Complex Arm */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2A9DA5] text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#075563]">مجمع أم القرى الطبي — بركاء</h3>
                <p className="text-xs text-gray-400">العلاج الطبيعي والتأهيل فقط • إشراف د. سبأ البلوشية</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-bold text-[#075563] hover:underline flex items-center gap-1"
            >
              جدول المواعيد
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100">
              <div className="text-xs text-gray-600 font-medium">المراجعين المسجلين</div>
              <div className="text-xl font-black text-[#075563] font-mono mt-1">{patients.length}</div>
              <div className="text-[10px] text-gray-500 mt-1">سجلات إلكترونية كاملة</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="text-xs text-gray-600 font-medium">جلسات اليوم المجدولة</div>
              <div className="text-xl font-black text-amber-800 font-mono mt-1">
                {appointments.filter((a) => a.date === '2026-03-30').length || appointments.length}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">تحقق خماسي الأبعاد 5D</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1.5">
            <div className="font-bold text-gray-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#075563]" />
              مواعيد العمل الرسمية للمجمع:
            </div>
            <div>السبت إلى الخميس: 9:00 ص - 1:00 م & 4:00 م - 8:00 م (الجمعة مغلق)</div>
            <div className="text-[11px] text-[#075563] font-semibold">
              الأسعار: كشف واستشارة 3 ر.ع | الجلسة الفردية 15 ر.ع | باقات 5+ جلسات خصم 10%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onNavigate('erp_warehouses')}
          className="p-4 bg-white hover:bg-[#FAF8F1] rounded-2xl border border-gray-100 text-right transition group shadow-2xs"
        >
          <Package className="w-5 h-5 text-[#075563] group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-gray-800 mt-2">المستودعات الثلاثة</div>
          <div className="text-[10px] text-gray-400 mt-0.5">أرصدة وباركود وحركات</div>
        </button>

        <button
          onClick={() => onNavigate('erp_manufacturing')}
          className="p-4 bg-white hover:bg-[#FAF8F1] rounded-2xl border border-gray-100 text-right transition group shadow-2xs"
        >
          <Factory className="w-5 h-5 text-[#075563] group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-gray-800 mt-2">هندسة الإنتاج BOM</div>
          <div className="text-[10px] text-gray-400 mt-0.5">تتبع دورة التصنيع</div>
        </button>

        <button
          onClick={() => onNavigate('erp_sales_purchases')}
          className="p-4 bg-white hover:bg-[#FAF8F1] rounded-2xl border border-gray-100 text-right transition group shadow-2xs"
        >
          <TrendingUp className="w-5 h-5 text-[#075563] group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-gray-800 mt-2">المبيعات والمشتريات</div>
          <div className="text-[10px] text-gray-400 mt-0.5">فواتير وضريبة 5%</div>
        </button>

        <button
          onClick={() => onNavigate('erp_finance')}
          className="p-4 bg-white hover:bg-[#FAF8F1] rounded-2xl border border-gray-100 text-right transition group shadow-2xs"
        >
          <DollarSign className="w-5 h-5 text-[#075563] group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-gray-800 mt-2">الحسابات ودفتر الأستاذ</div>
          <div className="text-[10px] text-gray-400 mt-0.5">قيود وأرباح وخسائر</div>
        </button>

        <button
          onClick={() => onNavigate('erp_hr')}
          className="p-4 bg-white hover:bg-[#FAF8F1] rounded-2xl border border-gray-100 text-right transition group shadow-2xs"
        >
          <Users className="w-5 h-5 text-[#075563] group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-gray-800 mt-2">الموارد البشرية والرواتب</div>
          <div className="text-[10px] text-gray-400 mt-0.5">حساب العمل الإضافي</div>
        </button>

        <button
          onClick={() => onNavigate('erp_biometrics')}
          className="p-4 bg-white hover:bg-[#FAF8F1] rounded-2xl border border-gray-100 text-right transition group shadow-2xs"
        >
          <Cpu className="w-5 h-5 text-[#075563] group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-gray-800 mt-2">أجهزة البصمة ZKTeco</div>
          <div className="text-[10px] text-gray-400 mt-0.5">تسجيل فوري للحضور</div>
        </button>
      </div>
    </div>
  );
};
