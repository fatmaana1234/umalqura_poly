import React, { useState } from 'react';
import {
  Package,
  Layers,
  ArrowRightLeft,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Barcode,
  History,
  Boxes,
  FileSpreadsheet
} from 'lucide-react';
import { Warehouse, InventoryItem, StockMovement, WarehouseType } from '../../types/erp';

interface WarehousesViewProps {
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  movements: StockMovement[];
  onUpdateInventory: (items: InventoryItem[]) => void;
  onAddMovement: (movement: StockMovement) => void;
}

export const WarehousesView: React.FC<WarehousesViewProps> = ({
  warehouses,
  inventory,
  movements,
  onUpdateInventory,
  onAddMovement
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // Transfer state
  const [transferItemId, setTransferItemId] = useState(inventory[0]?.id || '');
  const [transferTargetWh, setTransferTargetWh] = useState<WarehouseType>('wip');
  const [transferQty, setTransferQty] = useState(10);
  const [transferNotes, setTransferNotes] = useState('');

  // Add Item state
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemNameAr, setNewItemNameAr] = useState('');
  const [newItemWh, setNewItemWh] = useState<WarehouseType>('raw_materials');
  const [newItemQty, setNewItemQty] = useState(50);
  const [newItemCost, setNewItemCost] = useState(2.5);
  const [newItemUnit, setNewItemUnit] = useState<InventoryItem['unit']>('قطعة');
  const [newItemMin, setNewItemMin] = useState(15);

  const filteredItems = inventory.filter((item) => {
    if (selectedWarehouse !== 'all' && item.warehouseId !== selectedWarehouse) return false;
    if (filterLowStock && item.quantity > item.minReorderLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.barcode.includes(q)
      );
    }
    return true;
  });

  const handleExecuteTransfer = () => {
    const item = inventory.find((it) => it.id === transferItemId);
    if (!item) return;
    if (item.quantity < transferQty) {
      alert('الكمية المطلوبة للتحويل أكبر من الرصيد المتوفر في المستودع الحالي!');
      return;
    }
    if (item.warehouseId === transferTargetWh) {
      alert('لا يمكن التحويل إلى نفس المستودع الحالي.');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 1. Deduct from source item
    let updated = inventory.map((it) => {
      if (it.id === item.id) {
        return {
          ...it,
          quantity: it.quantity - transferQty,
          lastUpdated: now.substring(0, 10)
        };
      }
      return it;
    });

    // 2. Add or create in target warehouse
    const existingInTarget = updated.find(
      (it) => it.sku === item.sku && it.warehouseId === transferTargetWh
    );

    if (existingInTarget) {
      updated = updated.map((it) => {
        if (it.id === existingInTarget.id) {
          return {
            ...it,
            quantity: it.quantity + transferQty,
            lastUpdated: now.substring(0, 10)
          };
        }
        return it;
      });
    } else {
      const newItem: InventoryItem = {
        ...item,
        id: `item-${Date.now()}`,
        warehouseId: transferTargetWh,
        quantity: transferQty,
        lastUpdated: now.substring(0, 10)
      };
      updated.push(newItem);
    }

    onUpdateInventory(updated);

    onAddMovement({
      id: `mov-${Date.now()}`,
      timestamp: now,
      itemId: item.id,
      itemSku: item.sku,
      itemName: item.nameAr,
      fromWarehouse: item.warehouseId,
      toWarehouse: transferTargetWh,
      quantity: transferQty,
      unit: item.unit,
      referenceType: 'TRANSFER',
      referenceId: `TR-${Date.now().toString().slice(-4)}`,
      performedBy: 'أمين المستودعات اللوجستية',
      notes: transferNotes || 'تحويل داخلي بين مستودعات المصنع'
    });

    setIsTransferModalOpen(false);
    alert('تم تنفيذ التحويل المخزني وتحديث الأرصدة بنجاح.');
  };

  const handleAddNewItem = () => {
    if (!newItemSku || !newItemNameAr) {
      alert('يرجى ملء كود الصنف واسمه بالعربية.');
      return;
    }
    const item: InventoryItem = {
      id: `item-${Date.now()}`,
      sku: newItemSku.toUpperCase(),
      barcode: `6084000${Math.floor(10000 + Math.random() * 90000)}`,
      nameAr: newItemNameAr,
      nameEn: newItemSku,
      category: newItemWh === 'raw_materials' ? 'raw' : newItemWh === 'wip' ? 'semi_finished' : 'finished',
      warehouseId: newItemWh,
      quantity: newItemQty,
      unit: newItemUnit,
      costPriceOMR: newItemCost,
      sellingPriceOMR: newItemWh === 'finished_goods' ? newItemCost * 2 : 0,
      minReorderLevel: newItemMin,
      maxStorageLevel: newItemMin * 10,
      batchNumber: `LOT-${Date.now().toString().slice(-6)}`,
      lastUpdated: new Date().toISOString().substring(0, 10)
    };

    onUpdateInventory([item, ...inventory]);
    setIsAddItemModalOpen(false);
    setNewItemSku('');
    setNewItemNameAr('');
    alert('تمت إضافة الصنف بنجاح إلى المستودع.');
  };

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <Boxes className="w-4 h-4 text-[#2A9DA5]" />
            منظومة إدارة المستودعات الثلاثية (WMS 2026)
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            مستودعات المواد الخام والتصنيع والمنتج التام
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            تتبع دقيق للأرصدة، الباركود الدولي، حد إعادة الطلب الأدنى، والتحويلات اللحظية بين صالات الإنتاج والمجمع
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF8F1] hover:bg-gray-100 text-[#075563] border border-[#075563]/20 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#075563]" />
            تحويل مخزني بين الصالات
          </button>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#075563] hover:bg-[#064450] text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            إضافة صنف جديد للمخزون
          </button>
        </div>
      </div>

      {/* 3 Warehouse Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map((wh) => {
          const isSelected = selectedWarehouse === wh.id;
          const whItems = inventory.filter((it) => it.warehouseId === wh.id);
          const whValuation = whItems.reduce((acc, it) => acc + it.quantity * it.costPriceOMR, 0);

          return (
            <div
              key={wh.id}
              onClick={() => setSelectedWarehouse(isSelected ? 'all' : wh.id)}
              className={`p-5 rounded-3xl cursor-pointer border transition text-right ${
                isSelected
                  ? 'bg-gradient-to-br from-[#075563] to-[#0d697a] text-white border-transparent shadow-md'
                  : 'bg-white hover:bg-[#FAF8F1] border-gray-100 text-[#24383B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-teal-50 text-[#075563]'
                  }`}
                >
                  {wh.id === 'raw_materials' ? 'مستودع 1' : wh.id === 'wip' ? 'مستودع 2' : 'مستودع 3'}
                </span>
                <span className="text-xs font-mono font-bold">
                  {whItems.length} صنف
                </span>
              </div>

              <h3 className="font-bold text-base mt-2">{wh.nameAr}</h3>
              <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                {wh.location}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                  القيمة التقديرية:
                </span>
                <span className="font-mono font-bold text-sm">
                  {whValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.ع
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برمز SKU أو الباركود أو اسم الصنف..."
            className="w-full pr-9 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#075563]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              filterLowStock
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            الأصناف المقاربة للحد الأدنى فقط
          </button>
          {selectedWarehouse !== 'all' && (
            <button
              onClick={() => setSelectedWarehouse('all')}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200"
            >
              عرض كافة المستودعات
            </button>
          )}
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF8F1] text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3.5">كود الصنف (SKU)</th>
                <th className="p-3.5">الباركود الدولي</th>
                <th className="p-3.5">اسم المادة / المنتج</th>
                <th className="p-3.5">المستودع</th>
                <th className="p-3.5">الرصيد المتاح</th>
                <th className="p-3.5">الوحدة</th>
                <th className="p-3.5">تكلفة الوحدة (ر.ع)</th>
                <th className="p-3.5">إجمالي القيمة</th>
                <th className="p-3.5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.minReorderLevel;
                const totalItemVal = item.quantity * item.costPriceOMR;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-3.5 font-mono font-bold text-[#075563]">{item.sku}</td>
                    <td className="p-3.5 font-mono text-gray-500 flex items-center gap-1">
                      <Barcode className="w-3.5 h-3.5 text-gray-400" />
                      {item.barcode}
                    </td>
                    <td className="p-3.5 font-bold text-gray-800">
                      <div>{item.nameAr}</div>
                      <div className="text-[10px] text-gray-400 font-sans">{item.nameEn}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                        {item.warehouseId === 'raw_materials'
                          ? 'المواد الخام'
                          : item.warehouseId === 'wip'
                          ? 'قيد التصنيع'
                          : 'المنتج التام'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="p-3.5 text-gray-500">{item.unit}</td>
                    <td className="p-3.5 font-mono text-gray-600">{item.costPriceOMR.toFixed(2)}</td>
                    <td className="p-3.5 font-mono font-bold text-[#075563]">
                      {totalItemVal.toFixed(2)} ر.ع
                    </td>
                    <td className="p-3.5">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          أقل من الحد ({item.minReorderLevel})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          متوفر
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Movements Log */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#075563]" />
            <h3 className="font-bold text-base text-[#075563]">سجل حركات المخزون والتحويلات اللحظية</h3>
          </div>
          <span className="text-xs text-gray-400">{movements.length} حركات مسجلة</span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {movements.slice(0, 5).map((mov) => (
            <div key={mov.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-[#075563] ml-2">{mov.itemName}</span>
                <span className="font-mono text-gray-400 text-[11px]">({mov.itemSku})</span>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  من: <span className="font-semibold">{mov.fromWarehouse || 'مورد خارجي'}</span> إلى:{' '}
                  <span className="font-semibold">{mov.toWarehouse || 'صالة الإنتاج'}</span> • المرجع:{' '}
                  <span className="font-mono">{mov.referenceId}</span>
                </div>
              </div>
              <div className="text-left">
                <span className="font-mono font-bold text-sm text-[#075563]">
                  {mov.quantity} {mov.unit}
                </span>
                <div className="text-[10px] text-gray-400">{mov.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Transfer Stock */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">تحويل مخزني بين الصالات والمستودعات</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">اختر الصنف المراد تحويله:</label>
                <select
                  value={transferItemId}
                  onChange={(e) => setTransferItemId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {inventory.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.nameAr} ({it.sku}) - متاح: {it.quantity} {it.unit} [{it.warehouseId}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">المستودع الوجهة:</label>
                <select
                  value={transferTargetWh}
                  onChange={(e) => setTransferTargetWh(e.target.value as WarehouseType)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="raw_materials">مستودع المواد الخام</option>
                  <option value="wip">صالة التصنيع والتشغيل قيد التنفيذ (WIP)</option>
                  <option value="finished_goods">مستودع المنتجات تامة الصنع والتوزيع</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">الكمية المراد نقلها:</label>
                <input
                  type="number"
                  min="1"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">ملاحظات التحويل:</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="سبب النقل أو رقم إذن الصرف..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleExecuteTransfer}
                className="flex-1 py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs hover:bg-[#064450]"
              >
                تأكيد التحويل المخزني
              </button>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Item */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">إضافة صنف جديد لمنظومة المستودعات</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">كود الصنف (SKU):</label>
                <input
                  type="text"
                  value={newItemSku}
                  onChange={(e) => setNewItemSku(e.target.value)}
                  placeholder="مثال: RAW-FOAM-10 أو MED-BRACE-01"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">اسم الصنف بالعربية:</label>
                <input
                  type="text"
                  value={newItemNameAr}
                  onChange={(e) => setNewItemNameAr(e.target.value)}
                  placeholder="مثال: رغوة طبية لتبطين أحزمة الشد"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">المستودع المودع به:</label>
                  <select
                    value={newItemWh}
                    onChange={(e) => setNewItemWh(e.target.value as WarehouseType)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="raw_materials">المواد الخام</option>
                    <option value="wip">قيد التصنيع WIP</option>
                    <option value="finished_goods">المنتج التام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">الوحدة:</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value as InventoryItem['unit'])}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="قطعة">قطعة</option>
                    <option value="متر">متر</option>
                    <option value="علبة">علبة</option>
                    <option value="لتر">لتر</option>
                    <option value="كيلوغرام">كيلوغرام</option>
                    <option value="طقم">طقم</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">الرصيد الأولي:</label>
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">التكلفة (ر.ع):</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">الحد الأدنى:</label>
                  <input
                    type="number"
                    value={newItemMin}
                    onChange={(e) => setNewItemMin(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleAddNewItem}
                className="flex-1 py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs hover:bg-[#064450]"
              >
                إضافة الصنف للمستودع
              </button>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
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
