import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Receipt,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  FileText,
  DollarSign
} from 'lucide-react';
import { Supplier, PurchaseOrder, SalesInvoice, InventoryItem } from '../../types/erp';
import { ERPEngine } from '../../services/erpEngine';

interface SalesPurchasingViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  salesInvoices: SalesInvoice[];
  inventory: InventoryItem[];
  onAddPurchaseOrder: (po: PurchaseOrder) => void;
  onAddSalesInvoice: (invoice: SalesInvoice) => void;
}

export const SalesPurchasingView: React.FC<SalesPurchasingViewProps> = ({
  suppliers,
  purchaseOrders,
  salesInvoices,
  inventory,
  onAddPurchaseOrder,
  onAddSalesInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases' | 'suppliers'>('sales');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);

  // New Invoice State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [selectedInvItem, setSelectedInvItem] = useState(inventory.find((i) => i.warehouseId === 'finished_goods')?.id || '');
  const [invQty, setInvQty] = useState(10);

  // New PO State
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedRawItem, setSelectedRawItem] = useState(inventory.find((i) => i.warehouseId === 'raw_materials')?.id || '');
  const [poQty, setPoQty] = useState(100);

  const handleCreateInvoice = () => {
    const item = inventory.find((i) => i.id === selectedInvItem);
    if (!item || !custName) {
      alert('يرجى إدخال اسم العميل واختيار المنتج');
      return;
    }

    const unitPrice = item.sellingPriceOMR || 15;
    const subtotal = unitPrice * invQty;
    const tax = subtotal * ERPEngine.OMAN_VAT_RATE;
    const total = subtotal + tax;

    const newInv: SalesInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: custName,
      customerPhone: custPhone || '+968 26880000',
      customerType: 'hospital',
      invoiceDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      items: [
        {
          itemId: item.id,
          itemSku: item.sku,
          itemName: item.nameAr,
          quantity: invQty,
          unitPriceOMR: unitPrice,
          totalOMR: subtotal
        }
      ],
      subtotalOMR: subtotal,
      taxOMR: tax,
      totalOMR: total,
      status: 'issued'
    };

    onAddSalesInvoice(newInv);
    setIsNewInvoiceOpen(false);
    setCustName('');
    alert(`تم إصدار الفاتورة الضريبية ${newInv.invoiceNumber} بمبلغ ${total.toFixed(2)} ر.ع (شاملة ضريبة القيمة المضافة 5%).`);
  };

  const handleCreatePO = () => {
    const sup = suppliers.find((s) => s.id === selectedSupplierId);
    const item = inventory.find((i) => i.id === selectedRawItem);
    if (!sup || !item) return;

    const unitPrice = item.costPriceOMR || 2.0;
    const subtotal = unitPrice * poQty;
    const tax = subtotal * ERPEngine.OMAN_VAT_RATE;
    const total = subtotal + tax;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: sup.id,
      supplierName: sup.nameAr,
      orderDate: new Date().toISOString().substring(0, 10),
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
      items: [
        {
          itemId: item.id,
          itemSku: item.sku,
          itemName: item.nameAr,
          quantity: poQty,
          unitPriceOMR: unitPrice,
          totalOMR: subtotal,
          receivedQuantity: 0
        }
      ],
      subtotalOMR: subtotal,
      taxOMR: tax,
      totalOMR: total,
      status: 'sent',
      paymentStatus: 'unpaid'
    };

    onAddPurchaseOrder(newPO);
    setIsNewPOOpen(false);
    alert(`تم إصدار أمر الشراء ${newPO.poNumber} وإرساله للمورد ${sup.nameAr}.`);
  };

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <TrendingUp className="w-4 h-4 text-[#2A9DA5]" />
            منظومة المبيعات والمشتريات وسلاسل الإمداد
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            إدارة فواتير المبيعات، أوامر الشراء، وشبكة الموردين
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            احتساب تلقائي لضريبة القيمة المضافة 5% (Oman VAT)، متابعة أوامر الشراء، وتدقيق أسعار الموردين
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewPOOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF8F1] hover:bg-gray-100 text-[#075563] border border-[#075563]/20 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <ShoppingCart className="w-4 h-4 text-[#075563]" />
            أمر شراء جديد للمصنع (PO)
          </button>
          <button
            onClick={() => setIsNewInvoiceOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075563] hover:bg-[#064450] text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            إصدار فاتورة مبيعات ضريبية
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'sales'
              ? 'border-[#075563] text-[#075563]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          فواتير المبيعات الصادرة ({salesInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'purchases'
              ? 'border-[#075563] text-[#075563]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          أوامر الشراء والتوريد ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'suppliers'
              ? 'border-[#075563] text-[#075563]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          سجل الموردين المعتمدين ({suppliers.length})
        </button>
      </div>

      {/* Tab 1: Sales Invoices */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF8F1] text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">رقم الفاتورة</th>
                    <th className="p-3.5">العميل / المستشفى</th>
                    <th className="p-3.5">تاريخ الإصدار</th>
                    <th className="p-3.5">المنتجات المصروفة</th>
                    <th className="p-3.5">المجموع قبل الضريبة</th>
                    <th className="p-3.5">ضريبة VAT 5%</th>
                    <th className="p-3.5">الإجمالي (ر.ع)</th>
                    <th className="p-3.5">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salesInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                      <td className="p-3.5 font-mono font-bold text-[#075563]">{inv.invoiceNumber}</td>
                      <td className="p-3.5 font-bold text-gray-800">
                        <div>{inv.customerName}</div>
                        <div className="text-[10px] text-gray-400">{inv.customerPhone}</div>
                      </td>
                      <td className="p-3.5 font-mono text-gray-500">{inv.invoiceDate}</td>
                      <td className="p-3.5">
                        {inv.items.map((it, idx) => (
                          <div key={idx} className="text-gray-600">
                            {it.itemName} ({it.quantity} وحدة)
                          </div>
                        ))}
                      </td>
                      <td className="p-3.5 font-mono text-gray-600">{inv.subtotalOMR.toFixed(2)} ر.ع</td>
                      <td className="p-3.5 font-mono text-amber-700 font-bold">{inv.taxOMR.toFixed(2)} ر.ع</td>
                      <td className="p-3.5 font-mono font-black text-sm text-[#075563]">
                        {inv.totalOMR.toFixed(2)} ر.ع
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {inv.status === 'issued' ? 'صادرة ومعتمدة' : 'مسودة'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Purchase Orders */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF8F1] text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">رقم أمر الشراء</th>
                    <th className="p-3.5">المورد</th>
                    <th className="p-3.5">تاريخ الطلب</th>
                    <th className="p-3.5">المواد المطلوبة</th>
                    <th className="p-3.5">القيمة قبل الضريبة</th>
                    <th className="p-3.5">ضريبة القيمة المضافة</th>
                    <th className="p-3.5">الإجمالي (ر.ع)</th>
                    <th className="p-3.5">حالة التوريد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50 transition">
                      <td className="p-3.5 font-mono font-bold text-[#075563]">{po.poNumber}</td>
                      <td className="p-3.5 font-bold text-gray-800">{po.supplierName}</td>
                      <td className="p-3.5 font-mono text-gray-500">{po.orderDate}</td>
                      <td className="p-3.5">
                        {po.items.map((it, idx) => (
                          <div key={idx} className="text-gray-600">
                            {it.itemName} ({it.quantity} وحدة)
                          </div>
                        ))}
                      </td>
                      <td className="p-3.5 font-mono text-gray-600">{po.subtotalOMR.toFixed(2)}</td>
                      <td className="p-3.5 font-mono text-amber-700">{po.taxOMR.toFixed(2)}</td>
                      <td className="p-3.5 font-mono font-bold text-sm text-[#075563]">
                        {po.totalOMR.toFixed(2)} ر.ع
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            po.status === 'received'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {po.status === 'received' ? 'تم الاستلام والفحص' : 'قيد الشحن'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Suppliers Directory */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold bg-teal-50 text-[#075563] px-2 py-0.5 rounded-full">
                  {sup.code}
                </span>
                <span className="text-xs font-bold text-amber-600">★ {sup.rating}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#075563]">{sup.nameAr}</h4>
                <div className="text-[11px] text-gray-400 mt-0.5">{sup.category}</div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <div>المدينة: <strong className="text-gray-700">{sup.city}</strong></div>
                <div>الهاتف: <span className="font-mono">{sup.phone}</span></div>
                <div>الرقم الضريبي: <span className="font-mono font-bold text-[#075563]">{sup.taxNumber}</span></div>
                <div>فترة السداد: <strong className="text-gray-700">{sup.paymentTermsDays} يوم</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Invoice */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">إصدار فاتورة مبيعات ضريبية جديدة</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">اسم العميل / المستشفى / العيادة:</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="مثال: مركز بركاء الطبي التخصصي"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">رقم هاتف المشتري:</label>
                <input
                  type="text"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="+968 9XXXXXXX"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">المنتج المراد بيعه (من مستودع المنتج التام):</label>
                <select
                  value={selectedInvItem}
                  onChange={(e) => setSelectedInvItem(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {inventory
                    .filter((it) => it.warehouseId === 'finished_goods')
                    .map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.nameAr} - السعر: {it.sellingPriceOMR} ر.ع (متوفر: {it.quantity})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">الكمية:</label>
                <input
                  type="number"
                  min="1"
                  value={invQty}
                  onChange={(e) => setInvQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleCreateInvoice}
                className="flex-1 py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs hover:bg-[#064450]"
              >
                تأكيد وإصدار الفاتورة الضريبية
              </button>
              <button
                onClick={() => setIsNewInvoiceOpen(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Purchase Order */}
      {isNewPOOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">إصدار أمر شراء خامات ومستلزمات (PO)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">المورد المعتمد:</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameAr} ({s.code}) - {s.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">المادة الخام المطلوبة:</label>
                <select
                  value={selectedRawItem}
                  onChange={(e) => setSelectedRawItem(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {inventory
                    .filter((it) => it.warehouseId === 'raw_materials')
                    .map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.nameAr} ({it.sku}) - تكلفة: {it.costPriceOMR} ر.ع
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">الكمية المطلوبة للتوريد:</label>
                <input
                  type="number"
                  min="1"
                  value={poQty}
                  onChange={(e) => setPoQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleCreatePO}
                className="flex-1 py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs hover:bg-[#064450]"
              >
                إرسال أمر الشراء للمورد
              </button>
              <button
                onClick={() => setIsNewPOOpen(false)}
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
