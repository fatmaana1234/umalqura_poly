import React, { useState } from 'react';
import {
  DollarSign,
  Receipt,
  Building,
  FileCheck2,
  PieChart,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Scale,
  Landmark
} from 'lucide-react';
import { GLTransaction, SalesInvoice, PurchaseOrder } from '../../types/erp';
import { Appointment, Patient } from '../../types/clinic';

interface FinanceAccountingViewProps {
  transactions: GLTransaction[];
  salesInvoices: SalesInvoice[];
  purchaseOrders: PurchaseOrder[];
  appointments: Appointment[];
  patients: Patient[];
  onAddTransaction: (tx: GLTransaction) => void;
}

export const FinanceAccountingView: React.FC<FinanceAccountingViewProps> = ({
  transactions,
  salesInvoices,
  purchaseOrders,
  appointments,
  patients,
  onAddTransaction
}) => {
  const [selectedCostCenter, setSelectedCostCenter] = useState<'ALL' | 'FACTORY' | 'CLINIC'>('ALL');
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  // New manual entry state
  const [accountCode, setAccountCode] = useState('5100');
  const [accountNameAr, setAccountNameAr] = useState('مصروفات تشغيلية وصيانة دورية');
  const [amount, setAmount] = useState(150);
  const [costCenter, setCostCenter] = useState<'FACTORY' | 'CLINIC' | 'ADMIN'>('CLINIC');
  const [descriptionAr, setDescriptionAr] = useState('');

  // Calculations
  const factorySalesTotal = salesInvoices.reduce((sum, inv) => sum + inv.subtotalOMR, 0);
  const clinicRevenueTotal = appointments.length * 15 + patients.length * 3;
  const totalRevenue = factorySalesTotal + clinicRevenueTotal;

  const totalPurchasesCost = purchaseOrders
    .filter((po) => po.status === 'received')
    .reduce((sum, po) => sum + po.subtotalOMR, 0);

  // Oman VAT Calculations (5%)
  const vatCollectedOutput = salesInvoices.reduce((sum, inv) => sum + inv.taxOMR, 0);
  const vatPaidInput = purchaseOrders
    .filter((po) => po.status === 'received')
    .reduce((sum, po) => sum + po.taxOMR, 0);
  const netVatPayableToTaxAuthority = Math.max(0, vatCollectedOutput - vatPaidInput);

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedCostCenter === 'ALL') return true;
    return tx.costCenter === selectedCostCenter;
  });

  const handleCreateManualEntry = () => {
    if (!descriptionAr) {
      alert('يرجى كتابة بيان القيد المحاسبي');
      return;
    }

    const newTx: GLTransaction = {
      id: `gl-${Date.now()}`,
      entryNumber: `JE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().substring(0, 10),
      accountCode,
      accountNameAr,
      debitOMR: amount,
      creditOMR: 0,
      costCenter,
      descriptionAr,
      referenceType: 'MANUAL_JOURNAL',
      referenceId: 'DIR-ADJ'
    };

    onAddTransaction(newTx);
    setIsNewEntryOpen(false);
    setDescriptionAr('');
    alert(`تم ترحيل القيد المحاسبي ${newTx.entryNumber} إلى دفتر الأستاذ بنجاح.`);
  };

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <Landmark className="w-4 h-4 text-[#2A9DA5]" />
            الإدارة المالية والمحاسبية ودفتر الأستاذ العام
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            القوائم المالية، مراكز التكلفة، وإقرار ضريبة القيمة المضافة 5%
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            تقارير الأرباح والخسائر للمصنع ومجمع التأهيل الطبي مطابقة لمعايير جهاز الضرائب العماني
          </p>
        </div>

        <button
          onClick={() => setIsNewEntryOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075563] hover:bg-[#064450] text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          إضافة قيد يومية يدوي (Journal Entry)
        </button>
      </div>

      {/* Financial Health KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">إجمالي الإيرادات المجمعة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-2">
            {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-sans text-gray-500">ر.ع</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            المصنع: {factorySalesTotal.toFixed(2)} | العيادة: {clinicRevenueTotal.toFixed(2)} ر.ع
          </div>
        </div>

        {/* KPI 2: Direct Production & Purchase Costs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">تكلفة المشتريات ومستلزمات الإنتاج</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-700 font-mono mt-2">
            {totalPurchasesCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-sans text-gray-500">ر.ع</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            خامات وبوليمرات وأقطاب طبية معتمدة
          </div>
        </div>

        {/* KPI 3: Net Operational Margin */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">صافي الربح التشغيلي التقديري</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#075563] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#075563] font-mono mt-2">
            {(totalRevenue - totalPurchasesCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-sans text-gray-500">ر.ع</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            هامش ربح إيجابي قوي ومستدام
          </div>
        </div>

        {/* KPI 4: Oman 5% VAT Return */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-800 font-bold">إقرار ضريبة VAT 5% (عمان)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              5%
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 font-mono mt-2">
            {netVatPayableToTaxAuthority.toFixed(2)}{' '}
            <span className="text-xs font-sans text-gray-500">ر.ع</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            محصل: {vatCollectedOutput.toFixed(2)} | مدفوع: {vatPaidInput.toFixed(2)} ر.ع
          </div>
        </div>
      </div>

      {/* Cost Center Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500">تصفية حسب مركز التكلفة:</span>
        <button
          onClick={() => setSelectedCostCenter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCostCenter === 'ALL'
              ? 'bg-[#075563] text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          كافة المراكز
        </button>
        <button
          onClick={() => setSelectedCostCenter('FACTORY')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCostCenter === 'FACTORY'
              ? 'bg-[#075563] text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          مصنع المستلزمات الطبية
        </button>
        <button
          onClick={() => setSelectedCostCenter('CLINIC')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCostCenter === 'CLINIC'
              ? 'bg-[#075563] text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          مجمع أم القرى الطبي
        </button>
      </div>

      {/* General Ledger Transactions */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-sm text-[#075563]">
          قيود دفتر الأستاذ العام (General Ledger)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF8F1] text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3.5">رقم القيد</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">رمز الحساب</th>
                <th className="p-3.5">اسم الحساب</th>
                <th className="p-3.5">مركز التكلفة</th>
                <th className="p-3.5">مدين (Debit)</th>
                <th className="p-3.5">دائن (Credit)</th>
                <th className="p-3.5">البيان والشرح</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition">
                  <td className="p-3.5 font-mono font-bold text-[#075563]">{tx.entryNumber}</td>
                  <td className="p-3.5 font-mono text-gray-500">{tx.date}</td>
                  <td className="p-3.5 font-mono text-gray-700">{tx.accountCode}</td>
                  <td className="p-3.5 font-bold text-gray-800">{tx.accountNameAr}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {tx.costCenter === 'FACTORY' ? 'المصنع' : tx.costCenter === 'CLINIC' ? 'العيادة' : 'الإدارة'}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    {tx.debitOMR > 0 ? `${tx.debitOMR.toFixed(2)} ر.ع` : '-'}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-blue-700">
                    {tx.creditOMR > 0 ? `${tx.creditOMR.toFixed(2)} ر.ع` : '-'}
                  </td>
                  <td className="p-3.5 text-gray-600">{tx.descriptionAr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Journal Entry */}
      {isNewEntryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">تسجيل قيد يومية محاسبي يدوي</h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">رقم الحساب:</label>
                  <input
                    type="text"
                    value={accountCode}
                    onChange={(e) => setAccountCode(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">مركز التكلفة:</label>
                  <select
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="CLINIC">مجمع أم القرى الطبي</option>
                    <option value="FACTORY">مصنع المستلزمات الطبية</option>
                    <option value="ADMIN">الإدارة العامة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">اسم الحساب المحاسبي:</label>
                <input
                  type="text"
                  value={accountNameAr}
                  onChange={(e) => setAccountNameAr(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">المبلغ (ر.ع):</label>
                <input
                  type="number"
                  step="0.5"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">البيان والشرح:</label>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="بيان القيد المحاسبي والغرض منه..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleCreateManualEntry}
                className="flex-1 py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs hover:bg-[#064450]"
              >
                ترحيل القيد لدفتر الأستاذ
              </button>
              <button
                onClick={() => setIsNewEntryOpen(false)}
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
