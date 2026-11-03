/**
 * Um Alqura Polyclinic & Manufacturing ERP System 2026
 * Types for Enterprise Factory Operations & Polyclinic Management
 */

export type WarehouseType = 'raw_materials' | 'wip' | 'finished_goods';

export interface Warehouse {
  id: WarehouseType;
  nameAr: string;
  nameEn: string;
  location: string;
  manager: string;
  totalItemsCount: number;
  totalValuationOMR: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  barcode: string;
  nameAr: string;
  nameEn: string;
  category: 'raw' | 'packaging' | 'semi_finished' | 'finished' | 'consumable' | 'spare_part';
  warehouseId: WarehouseType;
  quantity: number;
  unit: 'متر' | 'كيلوغرام' | 'قطعة' | 'علبة' | 'لتر' | 'طقم';
  costPriceOMR: number;
  sellingPriceOMR: number;
  minReorderLevel: number;
  maxStorageLevel: number;
  batchNumber: string;
  expiryDate?: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  timestamp: string;
  itemId: string;
  itemSku: string;
  itemName: string;
  fromWarehouse?: WarehouseType | 'external_supplier';
  toWarehouse?: WarehouseType | 'customer' | 'production_floor' | 'clinic_use';
  quantity: number;
  unit: string;
  referenceType: 'PO' | 'PRODUCTION_ISSUE' | 'PRODUCTION_RECEIPT' | 'TRANSFER' | 'SALE' | 'ADJUSTMENT';
  referenceId: string;
  performedBy: string;
  notes?: string;
}

export interface BOMComponent {
  itemId: string;
  itemSku: string;
  itemName: string;
  quantityRequired: number;
  unit: string;
  unitCostOMR: number;
  wastePercentage: number;
}

export interface BillOfMaterials {
  id: string;
  productSku: string;
  productNameAr: string;
  productNameEn: string;
  outputQuantity: number;
  outputUnit: string;
  laborHoursEst: number;
  laborCostOMR: number;
  overheadCostOMR: number;
  components: BOMComponent[];
  totalEstimatedCostOMR: number;
  status: 'active' | 'draft' | 'archived';
  version: string;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productSku: string;
  productNameAr: string;
  targetQuantity: number;
  completedQuantity: number;
  wasteQuantity: number;
  status: 'draft' | 'approved' | 'in_progress' | 'quality_check' | 'completed' | 'cancelled';
  startDate: string;
  targetDate: string;
  actualEndDate?: string;
  supervisor: string;
  productionLine: string;
  rawMaterialsDeducted: boolean;
  finishedGoodsAdded: boolean;
  notes?: string;
}

export interface Supplier {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  taxNumber: string;
  paymentTermsDays: number;
  rating: number; // 1 to 5
  category: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemSku: string;
  itemName: string;
  quantity: number;
  unitPriceOMR: number;
  totalOMR: number;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  subtotalOMR: number;
  taxOMR: number; // 5% Oman VAT
  totalOMR: number;
  status: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
}

export interface SalesInvoiceItem {
  itemId: string;
  itemSku: string;
  itemName: string;
  quantity: number;
  unitPriceOMR: number;
  totalOMR: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerType: 'hospital' | 'retail_clinic' | 'distributor' | 'patient';
  invoiceDate: string;
  dueDate: string;
  items: SalesInvoiceItem[];
  subtotalOMR: number;
  taxOMR: number; // 5% VAT
  totalOMR: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'void';
}

export interface GLTransaction {
  id: string;
  entryNumber: string;
  date: string;
  accountCode: string;
  accountNameAr: string;
  debitOMR: number;
  creditOMR: number;
  costCenter: 'FACTORY' | 'CLINIC' | 'ADMIN';
  descriptionAr: string;
  referenceType: string;
  referenceId: string;
}

export interface Employee {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  nationalIdOrCivilId: string;
  department: 'PRODUCTION' | 'CLINIC' | 'WAREHOUSE' | 'FINANCE' | 'ADMIN';
  jobTitleAr: string;
  phone: string;
  joinDate: string;
  basicSalaryOMR: number;
  allowancesOMR: number;
  biometricId: string;
  status: 'active' | 'on_leave' | 'terminated';
  gender: 'male' | 'female';
}

export interface BiometricLog {
  id: string;
  employeeId: string;
  employeeName: string;
  biometricId: string;
  terminalIp: string;
  timestamp: string;
  type: 'IN' | 'OUT' | 'BREAK_OUT' | 'BREAK_IN';
  method: 'fingerprint' | 'face' | 'card' | 'rfid';
  deviceModel: string;
  verificationStatus: 'verified' | 'tamper_alert';
}

export interface BiometricTerminal {
  id: string;
  name: string;
  location: string;
  ipAddress: string;
  port: number;
  protocol: 'ZKTECO_STANDALONE' | 'REST_WEBHOOK' | 'MQTT' | 'TCP_IP';
  status: 'online' | 'offline' | 'syncing';
  lastPing: string;
  recordsCount: number;
}

export interface WorkflowRule {
  id: string;
  nameAr: string;
  triggerEvent: 'LOW_STOCK' | 'PO_APPROVED' | 'PRODUCTION_COMPLETED' | 'ATTENDANCE_LATE' | 'INVOICE_OVERDUE';
  actionAr: string;
  enabled: boolean;
  executionsCount: number;
  lastExecuted?: string;
}

export interface ExternalIntegration {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'TELECOM' | 'INSURANCE' | 'HARDWARE' | 'HEALTHCARE' | 'CLOUD';
  status: 'connected' | 'degraded' | 'disconnected' | 'testing';
  endpoint: string;
  lastHeartbeat: string;
  authType: 'API_KEY' | 'OAUTH2' | 'BEARER_TOKEN' | 'BASIC';
  notes: string;
}
