import React, { useState } from 'react';
import {
  Users,
  BadgeCheck,
  Phone,
  Calendar,
  Clock,
  Plus,
  Search,
  DollarSign,
  ShieldCheck,
  FileSpreadsheet,
  Cpu
} from 'lucide-react';
import { Employee, BiometricLog } from '../../types/erp';
import { ERPEngine } from '../../services/erpEngine';

interface HumanResourcesViewProps {
  employees: Employee[];
  biometricLogs: BiometricLog[];
  onAddEmployee: (emp: Employee) => void;
  onOpenBiometrics: () => void;
}

export const HumanResourcesView: React.FC<HumanResourcesViewProps> = ({
  employees,
  biometricLogs,
  onAddEmployee,
  onOpenBiometrics
}) => {
  const [selectedDept, setSelectedDept] = useState<'ALL' | Employee['department']>('ALL');
  const [isNewEmpModalOpen, setIsNewEmpModalOpen] = useState(false);
  const [selectedEmpForPayroll, setSelectedEmpForPayroll] = useState<Employee | null>(employees[0] || null);

  // Overtime simulation
  const [dayOvertimeHours, setDayOvertimeHours] = useState(6);
  const [nightOvertimeHours, setNightOvertimeHours] = useState(2);

  // New Employee state
  const [nameAr, setNameAr] = useState('');
  const [civilId, setCivilId] = useState('');
  const [dept, setDept] = useState<Employee['department']>('CLINIC');
  const [jobTitle, setJobTitle] = useState('');
  const [basicSal, setBasicSal] = useState(600);
  const [allowance, setAllowance] = useState(150);
  const [phone, setPhone] = useState('+968 9');
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const filteredEmployees = employees.filter((emp) => {
    if (selectedDept === 'ALL') return true;
    return emp.department === selectedDept;
  });

  const handleCreateEmployee = () => {
    if (!nameAr || !civilId || !jobTitle) {
      alert('يرجى ملء الاسم والرقم المدني والمسمى الوظيفي');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      code: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      nameAr,
      nameEn: nameAr,
      nationalIdOrCivilId: civilId,
      department: dept,
      jobTitleAr: jobTitle,
      phone,
      joinDate: new Date().toISOString().substring(0, 10),
      basicSalaryOMR: basicSal,
      allowancesOMR: allowance,
      biometricId: `BIO-${Math.floor(100 + Math.random() * 900)}`,
      status: 'active',
      gender
    };

    onAddEmployee(newEmp);
    setIsNewEmpModalOpen(false);
    setNameAr('');
    setCivilId('');
    setJobTitle('');
    alert(`تم تسجيل الموظف ${newEmp.nameAr} وربطه برقم البصمة ${newEmp.biometricId}.`);
  };

  const payrollCalc = selectedEmpForPayroll
    ? ERPEngine.calculateEmployeePayroll(
        selectedEmpForPayroll,
        dayOvertimeHours,
        nightOvertimeHours
      )
    : null;

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <Users className="w-4 h-4 text-[#2A9DA5]" />
            شؤون الموظفين والموارد البشرية (HR & Payroll 2026)
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            سجل الكادر الوظيفي، الرواتب، واحتساب العمل الإضافي العماني
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            التزام كامل بالضوابط الشرعية والمهنية العمانية، ربط مباشر مع بوابات البصمة ZKTeco، واستقطاع التأمينات PASI
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenBiometrics}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF8F1] hover:bg-gray-100 text-[#075563] border border-[#075563]/20 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <Cpu className="w-4 h-4" />
            سجلات بوابات البصمة اللحظية
          </button>
          <button
            onClick={() => setIsNewEmpModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075563] hover:bg-[#064450] text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            إضافة موظف جديد
          </button>
        </div>
      </div>

      {/* Dept Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-gray-500">القسم:</span>
        {(['ALL', 'CLINIC', 'PRODUCTION', 'WAREHOUSE', 'FINANCE', 'ADMIN'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDept(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedDept === d
                ? 'bg-[#075563] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {d === 'ALL'
              ? 'الكل'
              : d === 'CLINIC'
              ? 'المجمع الطبي'
              : d === 'PRODUCTION'
              ? 'صالة الإنتاج'
              : d === 'WAREHOUSE'
              ? 'المستودعات'
              : d === 'FINANCE'
              ? 'المالية'
              : 'الإدارة'}
          </button>
        ))}
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const empLogs = biometricLogs.filter((l) => l.biometricId === emp.biometricId);
          const isSelected = selectedEmpForPayroll?.id === emp.id;

          return (
            <div
              key={emp.id}
              onClick={() => setSelectedEmpForPayroll(emp)}
              className={`bg-white rounded-3xl p-5 border transition cursor-pointer text-right ${
                isSelected
                  ? 'border-[#075563] ring-2 ring-[#075563]/10 shadow-md'
                  : 'border-gray-100 hover:border-gray-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold bg-teal-50 text-[#075563] px-2.5 py-0.5 rounded-full">
                  {emp.code}
                </span>
                <span className="font-mono text-xs font-bold text-gray-500">
                  {emp.biometricId}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="font-bold text-base text-[#075563]">{emp.nameAr}</h4>
                <div className="text-xs text-gray-500 mt-0.5 font-medium">{emp.jobTitleAr}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">الرقم المدني:</span>
                  <span className="font-mono">{emp.nationalIdOrCivilId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">الهاتف:</span>
                  <span className="font-mono">{emp.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">الراتب الأساسي:</span>
                  <span className="font-mono font-bold text-[#075563]">
                    {emp.basicSalaryOMR.toFixed(2)} ر.ع
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">حركات البصمة اليوم:</span>
                  <span className="text-emerald-700 font-bold">
                    {empLogs.length > 0 ? `${empLogs.length} حركة مسجلة` : 'لم يسجل اليوم'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-dashed border-gray-200 text-center">
                <span className="text-[11px] text-[#2A9DA5] font-bold hover:underline">
                  انقر لحساب مسير الراتب والعمل الإضافي ←
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Employee Payroll Calculator */}
      {selectedEmpForPayroll && payrollCalc && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#075563]">
                محرك الرواتب والعمل الإضافي (Oman Labor Law Engine)
              </span>
              <h3 className="font-black text-lg text-[#075563] mt-1">
                كشف الراتب الشهري: {selectedEmpForPayroll.nameAr} ({selectedEmpForPayroll.jobTitleAr})
              </h3>
            </div>

            <div className="text-left">
              <div className="text-xs text-gray-500 font-semibold">صافي المستحق للصرف</div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {payrollCalc.netSalary.toFixed(3)} <span className="text-xs font-sans text-gray-500">ر.ع</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overtime Controls */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/60 space-y-4">
              <div className="font-bold text-xs text-[#075563]">
                ضبط ساعات العمل الإضافي المعتمدة للموظف:
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>عمل إضافي نهاري (معدل 1.25x):</span>
                  <span className="font-mono font-bold text-[#075563]">{dayOvertimeHours} ساعة</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={dayOvertimeHours}
                  onChange={(e) => setDayOvertimeHours(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>عمل إضافي ليلي أو أيام الراحة (معدل 1.50x):</span>
                  <span className="font-mono font-bold text-[#075563]">{nightOvertimeHours} ساعة</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={nightOvertimeHours}
                  onChange={(e) => setNightOvertimeHours(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div className="text-[11px] text-gray-400 leading-relaxed">
                * مستند إلى ساعات العمل المعيارية (192 ساعة شهرياً) وفق ضوابط وزارة العمل بسلطنة عمان.
              </div>
            </div>

            {/* Breakdown table */}
            <div className="text-xs space-y-2 border border-gray-100 rounded-2xl p-4 bg-white">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">الراتب الأساسي:</span>
                <span className="font-mono font-bold">{payrollCalc.basicSalary.toFixed(3)} ر.ع</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">العلاوات والبدلات (سكن ونقل):</span>
                <span className="font-mono font-bold">{payrollCalc.allowances.toFixed(3)} ر.ع</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 text-amber-700">
                <span className="font-semibold">إجمالي بدل العمل الإضافي ({payrollCalc.overtimeHoursTotal} س):</span>
                <span className="font-mono font-bold">+{payrollCalc.overtimePay.toFixed(3)} ر.ع</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 text-gray-700">
                <span className="font-bold">الراتب الإجمالي (Gross):</span>
                <span className="font-mono font-bold">{payrollCalc.grossSalary.toFixed(3)} ر.ع</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 text-red-600">
                <span>استقطاع التأمينات الاجتماعية (PASI 7%):</span>
                <span className="font-mono font-bold">-{payrollCalc.pasiDeduction.toFixed(3)} ر.ع</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-black text-emerald-800">
                <span>الصافي النهائي للتحويل البنكي:</span>
                <span className="font-mono">{payrollCalc.netSalary.toFixed(3)} ر.ع</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Employee */}
      {isNewEmpModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">تسجيل موظف جديد في المنظومة</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: يحيى بن ناصر الحراصي"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">الرقم المدني:</label>
                  <input
                    type="text"
                    value={civilId}
                    onChange={(e) => setCivilId(e.target.value)}
                    placeholder="10XXXXXX"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">الجنس:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="female">أنثى (كادر نسائي)</option>
                    <option value="male">ذكر (كادر رجالي)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">القسم:</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="CLINIC">المجمع الطبي</option>
                    <option value="PRODUCTION">صالة إنتاج المصنع</option>
                    <option value="WAREHOUSE">المستودعات</option>
                    <option value="FINANCE">المالية والحسابات</option>
                    <option value="ADMIN">الإدارة العامة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">المسمى الوظيفي:</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="مثال: فني أجهزة علاجية"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">الراتب الأساسي (ر.ع):</label>
                  <input
                    type="number"
                    value={basicSal}
                    onChange={(e) => setBasicSal(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">البدلات والعلاوات (ر.ع):</label>
                  <input
                    type="number"
                    value={allowance}
                    onChange={(e) => setAllowance(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">رقم الهاتف:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleCreateEmployee}
                className="flex-1 py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs hover:bg-[#064450]"
              >
                حفظ وإصدار كود الموظف
              </button>
              <button
                onClick={() => setIsNewEmpModalOpen(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
