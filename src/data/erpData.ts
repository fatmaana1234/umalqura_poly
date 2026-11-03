/**
 * Um Alqura Polyclinic & Rehabilitation Manufacturing Enterprise ERP
 * Initial Production Data Set 2026
 */

import {
  Warehouse,
  InventoryItem,
  BillOfMaterials,
  ProductionOrder,
  Supplier,
  PurchaseOrder,
  SalesInvoice,
  GLTransaction,
  Employee,
  BiometricTerminal,
  BiometricLog,
  WorkflowRule,
  ExternalIntegration
} from '../types/erp';

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'raw_materials',
    nameAr: 'مستودع المواد الخام ومستلزمات الإنتاج',
    nameEn: 'Raw Materials & Components Warehouse',
    location: 'المنطقة الصناعية - مبنى المصنع - بركاء',
    manager: 'م. سالم البلوشي',
    totalItemsCount: 8,
    totalValuationOMR: 14250.0
  },
  {
    id: 'wip',
    nameAr: 'مستودع التشغيل والتصنيع قيد التنفيذ',
    nameEn: 'Work-In-Progress (WIP) Floor',
    location: 'صالة خطوط الخياطة والتجميع الإلكتروني',
    manager: 'م. راشد المعمري',
    totalItemsCount: 4,
    totalValuationOMR: 6840.0
  },
  {
    id: 'finished_goods',
    nameAr: 'مستودع المنتجات تامة الصنع والتوزيع',
    nameEn: 'Finished Goods & Distribution Warehouse',
    location: 'المستودع الرئيسي اللوجستي - بركاء',
    manager: 'أ. طارق الفارسي',
    totalItemsCount: 6,
    totalValuationOMR: 29800.0
  }
];

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  // Raw Materials
  {
    id: 'item-raw-01',
    sku: 'RAW-NEO-01',
    barcode: '608400010011',
    nameAr: 'قماش نييوبرين طبي مسامي عالي الجودة',
    nameEn: 'Medical Grade Breathable Neoprene 3mm',
    category: 'raw',
    warehouseId: 'raw_materials',
    quantity: 450,
    unit: 'متر',
    costPriceOMR: 3.5,
    sellingPriceOMR: 0,
    minReorderLevel: 100,
    maxStorageLevel: 1000,
    batchNumber: 'LOT-NEO-26-01',
    lastUpdated: '2026-03-28'
  },
  {
    id: 'item-raw-02',
    sku: 'RAW-VEL-02',
    barcode: '608400010028',
    nameAr: 'أشرطة فيلكرو طبية مقاومة للتمزق 50 مم',
    nameEn: 'Heavy Duty Medical Hook & Loop Velcro 50mm',
    category: 'raw',
    warehouseId: 'raw_materials',
    quantity: 820,
    unit: 'متر',
    costPriceOMR: 0.85,
    sellingPriceOMR: 0,
    minReorderLevel: 200,
    maxStorageLevel: 2000,
    batchNumber: 'LOT-VEL-26-02',
    lastUpdated: '2026-03-29'
  },
  {
    id: 'item-raw-03',
    sku: 'RAW-SIL-03',
    barcode: '608400010035',
    nameAr: 'أقطاب سيليكون كربونية موصلة كهربائية',
    nameEn: 'Conductive Carbon Rubber Electrodes 50x50',
    category: 'raw',
    warehouseId: 'raw_materials',
    quantity: 1200,
    unit: 'قطعة',
    costPriceOMR: 0.65,
    sellingPriceOMR: 0,
    minReorderLevel: 300,
    maxStorageLevel: 3000,
    batchNumber: 'LOT-SIL-26-03',
    lastUpdated: '2026-03-25'
  },
  {
    id: 'item-raw-04',
    sku: 'RAW-GEL-BULK',
    barcode: '608400010042',
    nameAr: 'مادة جل كربومير بلمري ناقل للألتراساوند (خام براميل)',
    nameEn: 'Bulk Ultrasound Coupling Polymer Base (200L Drum)',
    category: 'raw',
    warehouseId: 'raw_materials',
    quantity: 6,
    unit: 'علبة',
    costPriceOMR: 120.0,
    sellingPriceOMR: 0,
    minReorderLevel: 2,
    maxStorageLevel: 15,
    batchNumber: 'LOT-GEL-26-04',
    lastUpdated: '2026-03-20'
  },
  {
    id: 'item-raw-05',
    sku: 'RAW-ALUM-STRIP',
    barcode: '608400010059',
    nameAr: 'دعامات ألمنيوم قابلة للتشكيل الطبي للظهر والركبة',
    nameEn: 'Contourable Aluminum Medical Stays 30cm',
    category: 'raw',
    warehouseId: 'raw_materials',
    quantity: 380,
    unit: 'قطعة',
    costPriceOMR: 1.1,
    sellingPriceOMR: 0,
    minReorderLevel: 80,
    maxStorageLevel: 800,
    batchNumber: 'LOT-ALUM-26-05',
    lastUpdated: '2026-03-26'
  },
  {
    id: 'item-raw-06',
    sku: 'PKG-BOX-MED',
    barcode: '608400010066',
    nameAr: 'صناديق تغليف كرتونية معتمدة للمعدات الطبية',
    nameEn: 'Custom Medical Packaging Box Medium',
    category: 'packaging',
    warehouseId: 'raw_materials',
    quantity: 1500,
    unit: 'علبة',
    costPriceOMR: 0.35,
    sellingPriceOMR: 0,
    minReorderLevel: 400,
    maxStorageLevel: 4000,
    batchNumber: 'LOT-BOX-26-06',
    lastUpdated: '2026-03-22'
  },

  // WIP (Work-in-progress)
  {
    id: 'item-wip-01',
    sku: 'WIP-LUMB-FRAME',
    barcode: '608400020010',
    nameAr: 'هيكل حزام دعم الفقرات القطنية المقصوص والمجهز',
    nameEn: 'Semi-Assembled Lumbar Support Belt Core',
    category: 'semi_finished',
    warehouseId: 'wip',
    quantity: 140,
    unit: 'قطعة',
    costPriceOMR: 4.8,
    sellingPriceOMR: 0,
    minReorderLevel: 30,
    maxStorageLevel: 300,
    batchNumber: 'WIP-LUM-26-01',
    lastUpdated: '2026-03-29'
  },
  {
    id: 'item-wip-02',
    sku: 'WIP-CERV-STRAP',
    barcode: '608400020027',
    nameAr: 'حزام سحب الفقرات العنقية قيد الخياطة المزدوجة',
    nameEn: 'Stitched Cervical Traction Harness WIP',
    category: 'semi_finished',
    warehouseId: 'wip',
    quantity: 65,
    unit: 'قطعة',
    costPriceOMR: 6.2,
    sellingPriceOMR: 0,
    minReorderLevel: 20,
    maxStorageLevel: 200,
    batchNumber: 'WIP-CER-26-02',
    lastUpdated: '2026-03-28'
  },

  // Finished Goods
  {
    id: 'item-fin-01',
    sku: 'MED-PRO-LUMB30',
    barcode: '608400030019',
    nameAr: 'حزام دعم وتثبيت الفقرات القطنية المتطور (أم القرى أورثو)',
    nameEn: 'Um Alqura Ortho Lumbar Spine Support Brace',
    category: 'finished',
    warehouseId: 'finished_goods',
    quantity: 185,
    unit: 'قطعة',
    costPriceOMR: 7.5,
    sellingPriceOMR: 19.5,
    minReorderLevel: 40,
    maxStorageLevel: 500,
    batchNumber: 'LOT-FIN-LUM-2026-03',
    lastUpdated: '2026-03-29'
  },
  {
    id: 'item-fin-02',
    sku: 'MED-PRO-CERV-TRAC',
    barcode: '608400030026',
    nameAr: 'طقم سحب الفقرات العنقية الطبي (متوافق مع أجهزة الشد)',
    nameEn: 'Clinical Cervical Traction Harness Set Pro',
    category: 'finished',
    warehouseId: 'finished_goods',
    quantity: 92,
    unit: 'طقم',
    costPriceOMR: 11.2,
    sellingPriceOMR: 28.0,
    minReorderLevel: 25,
    maxStorageLevel: 250,
    batchNumber: 'LOT-FIN-CER-2026-02',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'item-fin-03',
    sku: 'MED-PRO-GEL5L',
    barcode: '608400030033',
    nameAr: 'جل التراساوند طبي عالي النقاء 5 لتر (أم القرى فارما)',
    nameEn: 'Medical Ultrasound Transmission Gel 5 Liters',
    category: 'finished',
    warehouseId: 'finished_goods',
    quantity: 340,
    unit: 'علبة',
    costPriceOMR: 2.1,
    sellingPriceOMR: 5.5,
    minReorderLevel: 80,
    maxStorageLevel: 800,
    batchNumber: 'LOT-FIN-GEL-2026-03',
    expiryDate: '2028-03-01',
    lastUpdated: '2026-03-29'
  },
  {
    id: 'item-fin-04',
    sku: 'MED-PRO-KNEE-HINGE',
    barcode: '608400030040',
    nameAr: 'مشد الركبة المفصلي للرباط الصليبي والخشونة المتقدمة',
    nameEn: 'Hinged Knee ROM Brace Post-Op & Osteoarthritis',
    category: 'finished',
    warehouseId: 'finished_goods',
    quantity: 110,
    unit: 'قطعة',
    costPriceOMR: 12.8,
    sellingPriceOMR: 32.0,
    minReorderLevel: 30,
    maxStorageLevel: 300,
    batchNumber: 'LOT-FIN-KNE-2026-01',
    lastUpdated: '2026-03-26'
  }
];

export const INITIAL_BOMS: BillOfMaterials[] = [
  {
    id: 'bom-01',
    productSku: 'MED-PRO-LUMB30',
    productNameAr: 'حزام دعم وتثبيت الفقرات القطنية المتطور (أم القرى أورثو)',
    productNameEn: 'Um Alqura Ortho Lumbar Spine Support Brace',
    outputQuantity: 1,
    outputUnit: 'قطعة',
    laborHoursEst: 0.75,
    laborCostOMR: 2.2,
    overheadCostOMR: 0.9,
    components: [
      {
        itemId: 'item-raw-01',
        itemSku: 'RAW-NEO-01',
        itemName: 'قماش نييوبرين طبي مسامي 3 مم',
        quantityRequired: 0.6,
        unit: 'متر',
        unitCostOMR: 3.5,
        wastePercentage: 5
      },
      {
        itemId: 'item-raw-02',
        itemSku: 'RAW-VEL-02',
        itemName: 'أشرطة فيلكرو طبية 50 مم',
        quantityRequired: 1.2,
        unit: 'متر',
        unitCostOMR: 0.85,
        wastePercentage: 2
      },
      {
        itemId: 'item-raw-05',
        itemSku: 'RAW-ALUM-STRIP',
        itemName: 'دعامات ألمنيوم قابلة للتشكيل 30 سم',
        quantityRequired: 4,
        unit: 'قطعة',
        unitCostOMR: 1.1,
        wastePercentage: 1
      },
      {
        itemId: 'item-raw-06',
        itemSku: 'PKG-BOX-MED',
        itemName: 'صندوق تغليف كرتوني معتمد',
        quantityRequired: 1,
        unit: 'علبة',
        unitCostOMR: 0.35,
        wastePercentage: 0
      }
    ],
    totalEstimatedCostOMR: 7.5,
    status: 'active',
    version: 'v2.4'
  },
  {
    id: 'bom-02',
    productSku: 'MED-PRO-CERV-TRAC',
    productNameAr: 'طقم سحب الفقرات العنقية الطبي (متوافق مع أجهزة الشد)',
    productNameEn: 'Clinical Cervical Traction Harness Set Pro',
    outputQuantity: 1,
    outputUnit: 'طقم',
    laborHoursEst: 1.2,
    laborCostOMR: 3.5,
    overheadCostOMR: 1.2,
    components: [
      {
        itemId: 'item-raw-01',
        itemSku: 'RAW-NEO-01',
        itemName: 'قماش نييوبرين طبي مسامي',
        quantityRequired: 0.8,
        unit: 'متر',
        unitCostOMR: 3.5,
        wastePercentage: 4
      },
      {
        itemId: 'item-raw-02',
        itemSku: 'RAW-VEL-02',
        itemName: 'أشرطة فيلكرو طبية مقاومة',
        quantityRequired: 2.0,
        unit: 'متر',
        unitCostOMR: 0.85,
        wastePercentage: 3
      },
      {
        itemId: 'item-raw-06',
        itemSku: 'PKG-BOX-MED',
        itemName: 'صندوق تغليف كرتوني معتمد',
        quantityRequired: 1,
        unit: 'علبة',
        unitCostOMR: 0.35,
        wastePercentage: 0
      }
    ],
    totalEstimatedCostOMR: 11.2,
    status: 'active',
    version: 'v1.8'
  }
];

export const INITIAL_PRODUCTION_ORDERS: ProductionOrder[] = [
  {
    id: 'prd-2026-088',
    orderNumber: 'MO-2026-088',
    productSku: 'MED-PRO-LUMB30',
    productNameAr: 'حزام دعم وتثبيت الفقرات القطنية المتطور (أم القرى أورثو)',
    targetQuantity: 100,
    completedQuantity: 65,
    wasteQuantity: 2,
    status: 'in_progress',
    startDate: '2026-03-27',
    targetDate: '2026-03-31',
    supervisor: 'م. سالم البلوشي',
    productionLine: 'خط إنتاج المشدات والدعامات أ',
    rawMaterialsDeducted: true,
    finishedGoodsAdded: false,
    notes: 'طلب توريد لمستشفيات محافظتي الباطنة ومسقط بالإضافة لتزويد عيادة العمود الفقري بالمجمع.'
  },
  {
    id: 'prd-2026-089',
    orderNumber: 'MO-2026-089',
    productSku: 'MED-PRO-CERV-TRAC',
    productNameAr: 'طقم سحب الفقرات العنقية الطبي (متوافق مع أجهزة الشد)',
    targetQuantity: 50,
    completedQuantity: 50,
    wasteQuantity: 1,
    status: 'completed',
    startDate: '2026-03-20',
    targetDate: '2026-03-25',
    actualEndDate: '2026-03-24',
    supervisor: 'م. راشد المعمري',
    productionLine: 'خط التجميع والخياطة الدقيقة ب',
    rawMaterialsDeducted: true,
    finishedGoodsAdded: true,
    notes: 'تم فحص الجودة بالكامل ومطابقة مواصفات الشد الميكانيكي مع جهاز BTL Traction.'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-01',
    nameAr: 'الشركة العمانية للبوليمرات والمستلزمات الطبية ش.م.م',
    nameEn: 'Oman Medical Polymers LLC',
    code: 'OMP-MCT-01',
    phone: '+968 24501122',
    email: 'procurement@omanmedpolymers.om',
    city: 'مسقط - الرسيل الصناعية',
    country: 'سلطنة عمان',
    taxNumber: 'OM1100234589',
    paymentTermsDays: 30,
    rating: 4.9,
    category: 'مواد خام وبوليمرات طبية'
  },
  {
    id: 'sup-02',
    nameAr: 'مؤسسة بركاء الحديثة للتغليف والكرتون الطبي',
    nameEn: 'Barka Packaging & Medical Cartons',
    code: 'BPC-BRK-02',
    phone: '+968 26881144',
    email: 'sales@barkapackaging.om',
    city: 'بركاء - السقسوق',
    country: 'سلطنة عمان',
    taxNumber: 'OM1100789012',
    paymentTermsDays: 45,
    rating: 4.7,
    category: 'صناديق ومواد تعبئة'
  },
  {
    id: 'sup-03',
    nameAr: 'مستودعات الخليج للسبائك والألمنيوم الإكلينيكي',
    nameEn: 'Gulf Clinical Alloys & Aluminum FZE',
    code: 'GCA-DXB-03',
    phone: '+971 4 8812345',
    email: 'orders@gulfclinicalalloys.com',
    city: 'دبي - جبل علي',
    country: 'الإمارات العربية المتحدة',
    taxNumber: '10023490000003',
    paymentTermsDays: 30,
    rating: 4.8,
    category: 'دعامات معدنية ومفصلات'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-2026-104',
    poNumber: 'PO-2026-104',
    supplierId: 'sup-01',
    supplierName: 'الشركة العمانية للبوليمرات والمستلزمات الطبية',
    orderDate: '2026-03-24',
    expectedDeliveryDate: '2026-03-30',
    items: [
      {
        itemId: 'item-raw-01',
        itemSku: 'RAW-NEO-01',
        itemName: 'قماش نييوبرين طبي مسامي 3 مم',
        quantity: 300,
        unitPriceOMR: 3.5,
        totalOMR: 1050.0,
        receivedQuantity: 300
      },
      {
        itemId: 'item-raw-02',
        itemSku: 'RAW-VEL-02',
        itemName: 'أشرطة فيلكرو طبية 50 مم',
        quantity: 500,
        unitPriceOMR: 0.85,
        totalOMR: 425.0,
        receivedQuantity: 500
      }
    ],
    subtotalOMR: 1475.0,
    taxOMR: 73.75, // 5% Oman VAT
    totalOMR: 1548.75,
    status: 'received',
    paymentStatus: 'paid'
  }
];

export const INITIAL_SALES_INVOICES: SalesInvoice[] = [
  {
    id: 'inv-2026-512',
    invoiceNumber: 'INV-2026-512',
    customerName: 'مستشفى ومراكز بدر السماء الطبية - فرع بركاء',
    customerPhone: '+968 26884000',
    customerType: 'hospital',
    invoiceDate: '2026-03-26',
    dueDate: '2026-04-26',
    items: [
      {
        itemId: 'item-fin-01',
        itemSku: 'MED-PRO-LUMB30',
        itemName: 'حزام دعم وتثبيت الفقرات القطنية (أم القرى أورثو)',
        quantity: 40,
        unitPriceOMR: 19.5,
        totalOMR: 780.0
      },
      {
        itemId: 'item-fin-03',
        itemSku: 'MED-PRO-GEL5L',
        itemName: 'جل التراساوند طبي عالي النقاء 5 لتر',
        quantity: 20,
        unitPriceOMR: 5.5,
        totalOMR: 110.0
      }
    ],
    subtotalOMR: 890.0,
    taxOMR: 44.5, // 5% Oman VAT
    totalOMR: 934.5,
    status: 'issued'
  }
];

export const INITIAL_GL_TRANSACTIONS: GLTransaction[] = [
  {
    id: 'gl-001',
    entryNumber: 'JE-2026-0301',
    date: '2026-03-26',
    accountCode: '1110',
    accountNameAr: 'البنك الوطني العماني - الحساب التجاري الرئيسي',
    debitOMR: 934.5,
    creditOMR: 0,
    costCenter: 'FACTORY',
    descriptionAr: 'تحصيل دفعة مبيعات دعامات طبية - مستشفى بدر السماء',
    referenceType: 'INVOICE',
    referenceId: 'INV-2026-512'
  },
  {
    id: 'gl-002',
    entryNumber: 'JE-2026-0302',
    date: '2026-03-26',
    accountCode: '4100',
    accountNameAr: 'إيرادات مبيعات المصنع الطبية',
    debitOMR: 0,
    creditOMR: 890.0,
    costCenter: 'FACTORY',
    descriptionAr: 'قيد مبيعات منتجات مصنع أم القرى',
    referenceType: 'INVOICE',
    referenceId: 'INV-2026-512'
  },
  {
    id: 'gl-003',
    entryNumber: 'JE-2026-0303',
    date: '2026-03-26',
    accountCode: '2210',
    accountNameAr: 'ضريبة القيمة المضافة المحصلة (VAT 5%) - جهاز الضرائب العماني',
    debitOMR: 0,
    creditOMR: 44.5,
    costCenter: 'FACTORY',
    descriptionAr: 'استحقاق ضريبة القيمة المضافة 5%',
    referenceType: 'INVOICE',
    referenceId: 'INV-2026-512'
  },
  {
    id: 'gl-004',
    entryNumber: 'JE-2026-0304',
    date: '2026-03-28',
    accountCode: '4200',
    accountNameAr: 'إيرادات جلسات العلاج الطبيعي والتأهيل - المجمع',
    debitOMR: 0,
    creditOMR: 1350.0,
    costCenter: 'CLINIC',
    descriptionAr: 'إيرادات جلسات وباقات تأهيل المرضى (90 جلسة * 15 ر.ع)',
    referenceType: 'CLINIC_SESSION',
    referenceId: 'CLINIC-REV-WK12'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-01',
    code: 'EMP-001',
    nameAr: 'د. سبأ البلوشية',
    nameEn: 'Dr. Saba Al-Balushi',
    nationalIdOrCivilId: '10982345',
    department: 'CLINIC',
    jobTitleAr: 'رئيسة أخصائيي العلاج الطبيعي والتأهيل',
    phone: '+968 79470050',
    joinDate: '2024-01-15',
    basicSalaryOMR: 1200.0,
    allowancesOMR: 350.0,
    biometricId: 'BIO-101',
    status: 'active',
    gender: 'female'
  },
  {
    id: 'emp-02',
    code: 'EMP-002',
    nameAr: 'م. سالم بن سعيد البلوشي',
    nameEn: 'Eng. Salim Said Al-Balushi',
    nationalIdOrCivilId: '10476219',
    department: 'PRODUCTION',
    jobTitleAr: 'مدير عمليات المصنع وخطوط الإنتاج الطبي',
    phone: '+968 94545025',
    joinDate: '2023-06-01',
    basicSalaryOMR: 1100.0,
    allowancesOMR: 300.0,
    biometricId: 'BIO-201',
    status: 'active',
    gender: 'male'
  },
  {
    id: 'emp-03',
    code: 'EMP-003',
    nameAr: 'أ. مريم السعدية',
    nameEn: 'Maryam Al-Saadi',
    nationalIdOrCivilId: '11394820',
    department: 'CLINIC',
    jobTitleAr: 'مساعدة علاج طبيعي وفنية أجهزة التأهيل',
    phone: '+968 91234567',
    joinDate: '2024-03-01',
    basicSalaryOMR: 550.0,
    allowancesOMR: 120.0,
    biometricId: 'BIO-102',
    status: 'active',
    gender: 'female'
  },
  {
    id: 'emp-04',
    code: 'EMP-004',
    nameAr: 'أ. طارق بن حمود الفارسي',
    nameEn: 'Tariq Hamoud Al-Farsi',
    nationalIdOrCivilId: '10884920',
    department: 'WAREHOUSE',
    jobTitleAr: 'مسؤول المستودعات اللوجستية وضبط المخزون',
    phone: '+968 98765432',
    joinDate: '2023-11-10',
    basicSalaryOMR: 620.0,
    allowancesOMR: 150.0,
    biometricId: 'BIO-301',
    status: 'active',
    gender: 'male'
  },
  {
    id: 'emp-05',
    code: 'EMP-005',
    nameAr: 'أ. نورة المقبالية',
    nameEn: 'Noura Al-Maqbali',
    nationalIdOrCivilId: '11928374',
    department: 'ADMIN',
    jobTitleAr: 'مسؤولة الاستقبال وخدمة المراجعين',
    phone: '+968 92345678',
    joinDate: '2024-05-01',
    basicSalaryOMR: 450.0,
    allowancesOMR: 100.0,
    biometricId: 'BIO-103',
    status: 'active',
    gender: 'female'
  }
];

export const INITIAL_BIOMETRIC_TERMINALS: BiometricTerminal[] = [
  {
    id: 'term-01',
    name: 'جهاز بصمة مجمع أم القرى الطبي (المدخل الرئيسي)',
    location: 'بركاء - مبنى R&B - الاستقبال',
    ipAddress: '192.168.1.201',
    port: 4370,
    protocol: 'ZKTECO_STANDALONE',
    status: 'online',
    lastPing: 'منذ دقيقة واحدة',
    recordsCount: 4210
  },
  {
    id: 'term-02',
    name: 'جهاز بصمة مصنع المستلزمات الطبية (بوابة العاملين)',
    location: 'بركاء الصناعية - صالة الإنتاج',
    ipAddress: '192.168.10.15',
    port: 4370,
    protocol: 'REST_WEBHOOK',
    status: 'online',
    lastPing: 'منذ دقيقتين',
    recordsCount: 9840
  },
  {
    id: 'term-03',
    name: 'جهاز بصمة مستودع التوزيع اللوجستي المركزي',
    location: 'بركاء - بوابة شحن المستودع',
    ipAddress: '192.168.10.22',
    port: 4370,
    protocol: 'TCP_IP',
    status: 'online',
    lastPing: 'منذ 5 دقائق',
    recordsCount: 3120
  }
];

export const INITIAL_BIOMETRIC_LOGS: BiometricLog[] = [
  {
    id: 'bio-log-01',
    employeeId: 'emp-01',
    employeeName: 'د. سبأ البلوشية',
    biometricId: 'BIO-101',
    terminalIp: '192.168.1.201',
    timestamp: '2026-03-30 08:52:14',
    type: 'IN',
    method: 'fingerprint',
    deviceModel: 'ZKTeco SilkBio-101TC',
    verificationStatus: 'verified'
  },
  {
    id: 'bio-log-02',
    employeeId: 'emp-02',
    employeeName: 'م. سالم البلوشي',
    biometricId: 'BIO-201',
    terminalIp: '192.168.10.15',
    timestamp: '2026-03-30 07:58:33',
    type: 'IN',
    method: 'fingerprint',
    deviceModel: 'ZKTeco uFace800 Plus',
    verificationStatus: 'verified'
  },
  {
    id: 'bio-log-03',
    employeeId: 'emp-05',
    employeeName: 'أ. نورة المقبالية',
    biometricId: 'BIO-103',
    terminalIp: '192.168.1.201',
    timestamp: '2026-03-30 08:48:02',
    type: 'IN',
    method: 'face',
    deviceModel: 'ZKTeco SilkBio-101TC',
    verificationStatus: 'verified'
  }
];

export const INITIAL_WORKFLOW_RULES: WorkflowRule[] = [
  {
    id: 'wf-01',
    nameAr: 'الخصم التلقائي للمواد الخام عند اعتماد أمر الإنتاج',
    triggerEvent: 'PRODUCTION_COMPLETED',
    actionAr: 'خصم أمتار القماش والفيلكرو من مستودع المواد الخام وإيداع المنتج تام الصنع فوراً',
    enabled: true,
    executionsCount: 34,
    lastExecuted: '2026-03-24'
  },
  {
    id: 'wf-02',
    nameAr: 'تنبيه حد إعادة الطلب الأدنى لمواد التعبئة والمستهلكات',
    triggerEvent: 'LOW_STOCK',
    actionAr: 'إرسال إشعار فوري لمسؤول المشتريات وتجهيز مسودة أمر شراء PO تلقائياً',
    enabled: true,
    executionsCount: 12,
    lastExecuted: '2026-03-22'
  },
  {
    id: 'wf-03',
    nameAr: 'احتساب الساعات الإضافية تلقائياً وفق قانون العمل العماني (1.25x / 1.5x)',
    triggerEvent: 'ATTENDANCE_LATE',
    actionAr: 'تسجيل ساعات العمل الإضافي في كشف الرواتب الشهري بعد اعتماد المشرف',
    enabled: true,
    executionsCount: 68,
    lastExecuted: '2026-03-28'
  }
];

export const INITIAL_INTEGRATIONS: ExternalIntegration[] = [
  {
    id: 'int-01',
    nameAr: 'بوابة واتساب للأعمال السحابية (WhatsApp Cloud API)',
    nameEn: 'Meta WhatsApp Business API',
    category: 'TELECOM',
    status: 'connected',
    endpoint: 'https://graph.facebook.com/v19.0/um_alqura_barka',
    lastHeartbeat: 'منذ دقيقة',
    authType: 'BEARER_TOKEN',
    notes: 'إرسال تأكيدات المواعيد، روابط فيديوهات التمارين، وإشعارات جاهزية طلبيات المصنع.'
  },
  {
    id: 'int-02',
    nameAr: 'منظومة الضمان والتأمين الصحي العماني (Daman / OHI)',
    nameEn: 'Oman Health Insurance Unified Gateway',
    category: 'INSURANCE',
    status: 'connected',
    endpoint: 'https://api.daman.om/v2/claims/polyclinic',
    lastHeartbeat: 'منذ 3 دقائق',
    authType: 'API_KEY',
    notes: 'التحقق اللحظي من بطاقات التأمين، ونسب التحمل، ومطالبات جلسات العلاج الطبيعي.'
  },
  {
    id: 'int-03',
    nameAr: 'خادم ربط أجهزة البصمة البيومترية ZKTeco REST Bridge',
    nameEn: 'ZKTeco BioTime Terminal Bridge API',
    category: 'HARDWARE',
    status: 'connected',
    endpoint: 'http://192.168.1.200:8088/api/attendance/push',
    lastHeartbeat: 'منذ 30 ثانية',
    authType: 'BASIC',
    notes: 'مزامنة فورية لحركات الحضور والانصراف من أجهزة بصمات الأصابع والوجه.'
  },
  {
    id: 'int-04',
    nameAr: 'جهاز تحليل مكونات الجسم الإكلينيكي InBody 770',
    nameEn: 'InBody Medical Composition Direct Link',
    category: 'HEALTHCARE',
    status: 'connected',
    endpoint: 'https://inbody-api.lookinbody.com/v1/sync',
    lastHeartbeat: 'منذ 10 دقائق',
    authType: 'API_KEY',
    notes: 'استيراد قياسات توزيع الدهون والكتلة العضلية واحتباس السوائل للمراجعين.'
  },
  {
    id: 'int-05',
    nameAr: 'خادم المحتوى وإدارة مكتبة التمارين Strapi Open-Source Headless CMS',
    nameEn: 'Strapi Headless CMS Exercise Repository',
    category: 'CLOUD',
    status: 'connected',
    endpoint: 'https://cms.um-alqura-oman.com/api/exercises',
    lastHeartbeat: 'منذ 4 دقائق',
    authType: 'BEARER_TOKEN',
    notes: 'مكتبة الفيديوهات والبروتوكولات التأهيلية المحتشمة مفتوحة المصدر.'
  }
];
