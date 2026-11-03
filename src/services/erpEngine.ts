/**
 * Um Alqura Enterprise ERP Business Logic Engine 2026
 * Handles BOM execution, 3-warehouse stock balance, Oman VAT, GL journal entries, and Biometrics
 */

import {
  InventoryItem,
  StockMovement,
  BillOfMaterials,
  ProductionOrder,
  GLTransaction,
  Employee,
  BiometricLog
} from '../types/erp';

export class ERPEngine {
  /**
   * Oman VAT Standard Rate (5%)
   */
  static readonly OMAN_VAT_RATE = 0.05;

  /**
   * Calculate total warehouse valuations
   */
  static calculateWarehouseValuation(items: InventoryItem[], warehouseId: string): number {
    return items
      .filter((item) => item.warehouseId === warehouseId)
      .reduce((sum, item) => sum + item.quantity * item.costPriceOMR, 0);
  }

  /**
   * Execute Production Order:
   * 1. Deducts raw materials according to BOM
   * 2. Moves semi-finished or adds to finished goods warehouse
   * 3. Generates stock movements
   */
  static completeProductionOrder(
    order: ProductionOrder,
    bomList: BillOfMaterials[],
    items: InventoryItem[]
  ): {
    updatedOrder: ProductionOrder;
    updatedItems: InventoryItem[];
    newMovements: StockMovement[];
    newJournalEntries: GLTransaction[];
  } {
    const bom = bomList.find((b) => b.productSku === order.productSku);
    const updatedItems = [...items];
    const newMovements: StockMovement[] = [];
    const newJournalEntries: GLTransaction[] = [];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (bom && !order.rawMaterialsDeducted) {
      // Deduct raw materials based on targetQuantity
      for (const comp of bom.components) {
        const requiredQty = comp.quantityRequired * order.targetQuantity * (1 + comp.wastePercentage / 100);
        const itemIdx = updatedItems.findIndex((it) => it.sku === comp.itemSku);
        if (itemIdx !== -1) {
          updatedItems[itemIdx] = {
            ...updatedItems[itemIdx],
            quantity: Math.max(0, Number((updatedItems[itemIdx].quantity - requiredQty).toFixed(2))),
            lastUpdated: now.substring(0, 10)
          };

          newMovements.push({
            id: `mov-${Date.now()}-${comp.itemSku}`,
            timestamp: now,
            itemId: updatedItems[itemIdx].id,
            itemSku: comp.itemSku,
            itemName: comp.itemName,
            fromWarehouse: 'raw_materials',
            toWarehouse: 'wip',
            quantity: requiredQty,
            unit: comp.unit,
            referenceType: 'PRODUCTION_ISSUE',
            referenceId: order.orderNumber,
            performedBy: order.supervisor,
            notes: `صرف خامات لأمر الإنتاج ${order.orderNumber}`
          });
        }
      }
    }

    // Add finished goods
    const finishedItemIdx = updatedItems.findIndex((it) => it.sku === order.productSku);
    const netProduced = order.targetQuantity - (order.wasteQuantity || 0);

    if (finishedItemIdx !== -1) {
      updatedItems[finishedItemIdx] = {
        ...updatedItems[finishedItemIdx],
        quantity: updatedItems[finishedItemIdx].quantity + netProduced,
        lastUpdated: now.substring(0, 10)
      };

      newMovements.push({
        id: `mov-${Date.now()}-fin`,
        timestamp: now,
        itemId: updatedItems[finishedItemIdx].id,
        itemSku: updatedItems[finishedItemIdx].sku,
        itemName: updatedItems[finishedItemIdx].nameAr,
        fromWarehouse: 'wip',
        toWarehouse: 'finished_goods',
        quantity: netProduced,
        unit: updatedItems[finishedItemIdx].unit,
        referenceType: 'PRODUCTION_RECEIPT',
        referenceId: order.orderNumber,
        performedBy: order.supervisor,
        notes: `استلام منتجات تامة الصنع من خط الإنتاج ${order.productionLine}`
      });
    }

    // Journal Entry for production capitalization
    const totalCost = (bom?.totalEstimatedCostOMR || 10) * netProduced;
    newJournalEntries.push({
      id: `gl-${Date.now()}-1`,
      entryNumber: `JE-${Date.now().toString().slice(-4)}`,
      date: now.substring(0, 10),
      accountCode: '1310',
      accountNameAr: 'مخزون الإنتاج التام (Finished Goods)',
      debitOMR: Number(totalCost.toFixed(2)),
      creditOMR: 0,
      costCenter: 'FACTORY',
      descriptionAr: `إثبات تكلفة إنتاج ${netProduced} وحدة - أمر الإنتاج ${order.orderNumber}`,
      referenceType: 'PRODUCTION',
      referenceId: order.orderNumber
    });

    const updatedOrder: ProductionOrder = {
      ...order,
      status: 'completed',
      completedQuantity: netProduced,
      rawMaterialsDeducted: true,
      finishedGoodsAdded: true,
      actualEndDate: now.substring(0, 10)
    };

    return {
      updatedOrder,
      updatedItems,
      newMovements,
      newJournalEntries
    };
  }

  /**
   * Calculate Oman Overtime and Payroll per Oman Labor Law:
   * Daytime Overtime: 1.25x basic hourly
   * Night / Rest day Overtime: 1.50x basic hourly
   */
  static calculateEmployeePayroll(emp: Employee, overtimeHoursDay = 0, overtimeHoursNight = 0) {
    const monthlyWorkingHours = 192; // 8 hrs * 24 days average
    const hourlyBasicRate = emp.basicSalaryOMR / monthlyWorkingHours;

    const dayOvertimePay = overtimeHoursDay * hourlyBasicRate * 1.25;
    const nightOvertimePay = overtimeHoursNight * hourlyBasicRate * 1.5;
    const totalOvertime = dayOvertimePay + nightOvertimePay;

    const grossSalary = emp.basicSalaryOMR + emp.allowancesOMR + totalOvertime;
    // Social Security (PASI) Oman pension contribution (approx 7% on basic + housing)
    const pasiDeduction = Number((emp.basicSalaryOMR * 0.07).toFixed(3));
    const netSalary = Number((grossSalary - pasiDeduction).toFixed(3));

    return {
      basicSalary: emp.basicSalaryOMR,
      allowances: emp.allowancesOMR,
      overtimeHoursTotal: overtimeHoursDay + overtimeHoursNight,
      overtimePay: Number(totalOvertime.toFixed(3)),
      grossSalary: Number(grossSalary.toFixed(3)),
      pasiDeduction,
      netSalary
    };
  }

  /**
   * Biometric Terminal Punch simulator for live demo & testing
   */
  static createBiometricPunch(
    emp: Employee,
    type: 'IN' | 'OUT',
    terminalIp = '192.168.1.201',
    method: 'fingerprint' | 'face' | 'card' = 'fingerprint'
  ): BiometricLog {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    return {
      id: `bio-live-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.nameAr,
      biometricId: emp.biometricId,
      terminalIp,
      timestamp: now,
      type,
      method,
      deviceModel: 'ZKTeco SilkBio-101TC Pro',
      verificationStatus: 'verified'
    };
  }
}
