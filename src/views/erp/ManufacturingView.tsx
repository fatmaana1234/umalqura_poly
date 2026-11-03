import React, { useState } from 'react';
import {
  Factory,
  Layers,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Percent,
  Cpu,
  FileText,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { BillOfMaterials, ProductionOrder, InventoryItem, StockMovement, GLTransaction } from '../../types/erp';
import { ERPEngine } from '../../services/erpEngine';

interface ManufacturingViewProps {
  boms: BillOfMaterials[];
  productionOrders: ProductionOrder[];
  inventory: InventoryItem[];
  onUpdateProductionOrders: (orders: ProductionOrder[]) => void;
  onUpdateInventory: (items: InventoryItem[]) => void;
  onAddStockMovements: (movements: StockMovement[]) => void;
  onAddJournalEntries: (entries: GLTransaction[]) => void;
}

export const ManufacturingView: React.FC<ManufacturingViewProps> = ({
  boms,
  productionOrders,
  inventory,
  onUpdateProductionOrders,
  onUpdateInventory,
  onAddStockMovements,
  onAddJournalEntries
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'bom'>('orders');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<BillOfMaterials | null>(boms[0] || null);

  // New Order State
  const [selectedProductSku, setSelectedProductSku] = useState(boms[0]?.productSku || '');
  const [targetQuantity, setTargetQuantity] = useState(50);
  const [supervisor, setSupervisor] = useState('م. سالم البلوشي');
  const [productionLine, setProductionLine] = useState('خط تجميع المشدات الطبية أ');
  const [notes, setNotes] = useState('');

  const handleCreateOrder = () => {
    const bom = boms.find((b) => b.productSku === selectedProductSku);
    if (!bom) return;

    const newOrder: ProductionOrder = {
      id: `po-${Date.now()}`,
      orderNumber: `MO-2026-${Math.floor(100 + Math.random() * 900)}`,
      productSku: bom.productSku,
      productNameAr: bom.productNameAr,
      targetQuantity,
      completedQuantity: 0,
      wasteQuantity: 0,
      status: 'in_progress',
      startDate: new Date().toISOString().substring(0, 10),
      targetDate: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
      supervisor,
      productionLine,
      rawMaterialsDeducted: false,
      finishedGoodsAdded: false,
      notes
    };

    onUpdateProductionOrders([newOrder, ...productionOrders]);
    setIsNewOrderModalOpen(false);
    alert(`تم إنشاء أمر الإنتاج ${newOrder.orderNumber} وبدء جدول التشغيل.`);
  };

  const handleCompleteOrder = (order: ProductionOrder) => {
    const confirmation = window.confirm(
      `هل ترغب في اعتماد إنجاز أمر الإنتاج ${order.orderNumber}؟\nسيتم خصم المواد الخام تلقائياً حسب جدول المكونات (BOM) وإيداع المنتجات التامة بالمستودع.`
    );
    if (!confirmation) return;

    const result = ERPEngine.completeProductionOrder(order, boms, inventory);

    // Update state
    const updatedOrders = productionOrders.map((po) =>
      po.id === order.id ? result.updatedOrder : po
    );
    onUpdateProductionOrders(updatedOrders);
    onUpdateInventory(result.updatedItems);
    if (result.newMovements.length > 0) {
      onAddStockMovements(result.newMovements);
    }
    if (result.newJournalEntries.length > 0) {
      onAddJournalEntries(result.newJournalEntries);
    }

    alert(`تم إنجاز أمر الإنتاج ${order.orderNumber} بنجاح!\n- تم خصم المواد الخام من مستودع الخامات\n- تم إيداع ${result.updatedOrder.completedQuantity} وحدة تامة الصنع في مستودع المنتجات.`);
  };

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* View Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <Factory className="w-4 h-4 text-[#2A9DA5]" />
            هندسة التصنيع والإنتاج الطبي المتكامل (MRP II)
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            إدارة أوامر التصنيع وجداول المكونات (BOM)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            ربط مباشر بين مخططات التصنيع، تكلفة العمالة، ونسب الهدر، مع خصم المخزون الآلي وترحيل قيود التكلفة
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075563] hover:bg-[#064450] text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            إصدار أمر إنتاج جديد (MO)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeSubTab === 'orders'
              ? 'border-[#075563] text-[#075563]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          أوامر التشغيل والإنتاج النشطة ({productionOrders.length})
        </button>
        <button
          onClick={() => setActiveSubTab('bom')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeSubTab === 'bom'
              ? 'border-[#075563] text-[#075563]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          جداول المكونات الهندسية Bill of Materials ({boms.length})
        </button>
      </div>

      {/* SubTab 1: Production Orders */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl">
              <div className="text-xs text-amber-800 font-bold">أوامر قيد التنفيذ الآن</div>
              <div className="text-2xl font-black text-amber-900 font-mono mt-1">
                {productionOrders.filter((po) => po.status === 'in_progress').length}
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">في صالات الخياطة والتجميع</div>
            </div>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl">
              <div className="text-xs text-emerald-800 font-bold">أوامر مكتملة ومعتمدة</div>
              <div className="text-2xl font-black text-emerald-900 font-mono mt-1">
                {productionOrders.filter((po) => po.status === 'completed').length}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">مودعة في مستودع المنتج التام</div>
            </div>
            <div className="p-4 bg-teal-50/70 border border-teal-200/60 rounded-2xl">
              <div className="text-xs text-[#075563] font-bold">إجمالي الوحدات المستهدفة</div>
              <div className="text-2xl font-black text-[#075563] font-mono mt-1">
                {productionOrders.reduce((sum, po) => sum + po.targetQuantity, 0)}
              </div>
              <div className="text-[11px] text-teal-700 mt-0.5">دعامات وأطقم شد طبية</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-sm text-[#075563]">
              قائمة أوامر التصنيع والتشغيل
            </div>
            <div className="divide-y divide-gray-100">
              {productionOrders.map((order) => {
                const isCompleted = order.status === 'completed';
                const progressPct = Math.min(
                  100,
                  Math.round((order.completedQuantity / order.targetQuantity) * 100)
                );

                return (
                  <div key={order.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">
                          {order.orderNumber}
                        </span>
                        <h4 className="font-bold text-sm text-[#075563]">{order.productNameAr}</h4>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isCompleted ? 'مكتمل ومودع بالمخزن' : 'قيد التشغيل'}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                        <span>المشرف: <strong className="text-gray-700">{order.supervisor}</strong></span>
                        <span>الخط: <strong className="text-gray-700">{order.productionLine}</strong></span>
                        <span>تاريخ البدء: <span className="font-mono">{order.startDate}</span></span>
                        <span>التسليم المستهدف: <span className="font-mono">{order.targetDate}</span></span>
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-gray-400 italic mt-1">{order.notes}</p>
                      )}

                      {/* Progress Bar */}
                      <div className="w-full max-w-md pt-2">
                        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                          <span>نسبة الإنجاز الفعلي:</span>
                          <span className="font-mono font-bold text-[#075563]">{progressPct}% ({order.completedQuantity}/{order.targetQuantity})</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      {!isCompleted ? (
                        <button
                          onClick={() => handleCompleteOrder(order)}
                          className="w-full lg:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          اعتماد الإنجاز وخصم المواد
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
                          <CheckCircle2 className="w-4 h-4" />
                          تم ترحيل الخامات والمنتج التام
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Bill of Materials (BOM) */}
      {activeSubTab === 'bom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BOM Select List */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-gray-500">اختر المنتج لاستعراض مخطط تصنيعه:</div>
            {boms.map((bom) => (
              <div
                key={bom.id}
                onClick={() => setSelectedBOM(bom)}
                className={`p-4 rounded-2xl cursor-pointer border transition text-right ${
                  selectedBOM?.id === bom.id
                    ? 'bg-[#075563] text-white border-transparent shadow-md'
                    : 'bg-white hover:bg-[#FAF8F1] border-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold opacity-75">{bom.version}</span>
                  <span className="text-[11px] font-bold font-mono">
                    {bom.totalEstimatedCostOMR.toFixed(2)} ر.ع
                  </span>
                </div>
                <h4 className="font-bold text-xs mt-1">{bom.productNameAr}</h4>
                <div className="text-[10px] opacity-70 mt-1 font-mono">{bom.productSku}</div>
              </div>
            ))}
          </div>

          {/* BOM Detail Sheet */}
          {selectedBOM && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#075563]">
                    جدول المكونات المعتمد {selectedBOM.version}
                  </span>
                  <h3 className="font-black text-lg text-[#075563] mt-1">{selectedBOM.productNameAr}</h3>
                  <div className="text-xs text-gray-400 font-mono">{selectedBOM.productSku}</div>
                </div>

                <div className="text-left">
                  <div className="text-xs text-gray-500 font-semibold">إجمالي التكلفة التقديرية</div>
                  <div className="text-xl font-black text-[#075563] font-mono">
                    {selectedBOM.totalEstimatedCostOMR.toFixed(2)} <span className="text-xs font-sans text-gray-500">ر.ع</span>
                  </div>
                </div>
              </div>

              {/* Labor & Overhead stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] text-gray-500">ساعات العمل المباشرة:</div>
                  <div className="text-sm font-bold font-mono text-[#075563] mt-0.5">
                    {selectedBOM.laborHoursEst} ساعة
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] text-gray-500">تكلفة اليد العاملة:</div>
                  <div className="text-sm font-bold font-mono text-[#075563] mt-0.5">
                    {selectedBOM.laborCostOMR.toFixed(2)} ر.ع
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] text-gray-500">المصاريف الصناعية غير المباشرة:</div>
                  <div className="text-sm font-bold font-mono text-[#075563] mt-0.5">
                    {selectedBOM.overheadCostOMR.toFixed(2)} ر.ع
                  </div>
                </div>
              </div>

              {/* Raw components table */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-2">المواد والمكونات المطلوبة لإنتاج وحدة واحدة:</div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#FAF8F1] text-gray-700 font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-2.5">المكون</th>
                        <th className="p-2.5">كود المادة</th>
                        <th className="p-2.5">الكمية للوحدة</th>
                        <th className="p-2.5">نسبة الهدر المتوقعة</th>
                        <th className="p-2.5">تكلفة المكون (ر.ع)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedBOM.components.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2.5 font-bold text-gray-800">{comp.itemName}</td>
                          <td className="p-2.5 font-mono text-gray-500">{comp.itemSku}</td>
                          <td className="p-2.5 font-mono">
                            {comp.quantityRequired} {comp.unit}
                          </td>
                          <td className="p-2.5 font-mono text-amber-700">{comp.wastePercentage}%</td>
                          <td className="p-2.5 font-mono font-bold text-[#075563]">
                            {(comp.quantityRequired * comp.unitCostOMR * (1 + comp.wastePercentage / 100)).toFixed(2)} ر.ع
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: New Production Order */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">إصدار أمر إنتاج طبي جديد (MO)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">اختر المنتج المراد تصنيعه:</label>
                <select
                  value={selectedProductSku}
                  onChange={(e) => setSelectedProductSku(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {boms.map((bom) => (
                    <option key={bom.id} value={bom.productSku}>
                      {bom.productNameAr} ({bom.productSku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">الكمية المستهدفة (وحدة):</label>
                <input
                  type="number"
                  min="1"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">المشرف المسؤول:</label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">خط الإنتاج:</label>
                <input
                  type="text"
                  value={productionLine}
                  onChange={(e) => setProductionLine(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">ملاحظات التشغيل والوجهة:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: توريد لصالح عيادة العظام ومستشفيات السلطنة"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleCreateOrder}
                className="flex-1 py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs hover:bg-[#064450]"
              >
                تأكيد وبدء أمر الإنتاج
              </button>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
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
