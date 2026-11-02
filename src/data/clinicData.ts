import {
  StaffMember,
  MedicalBed,
  MedicalDevice,
  Patient,
  Appointment,
  PackageCourse,
  SOAPNote,
  HomeExercise,
  InsuranceClaim
} from '../types/clinic';

export const CLINIC_INFO = {
  nameAr: 'مجمع أم القرى الطبي',
  nameEn: 'Um Alqura Polyclinic',
  mottoAr: 'صحتك.. أولويتنا',
  mottoEn: 'Your Health, Our Priority',
  specialtyAr: 'العلاج الطبيعي والتأهيل الطبي فقط',
  specialtyEn: 'Physiotherapy & Rehabilitation Only',
  locationAr: 'سلطنة عمان – بركاء – الشارع العام – بناية R & B – بجانب مستشفى بدر السماء',
  locationEn: 'Barka, Main Road, Building R&B, Near Badr Al Sama Hospital, Sultanate of Oman',
  phone1: '+968 79 470 050',
  phone2: '+968 94 545 025',
  whatsapp: '96879470050',
  workHoursMorning: '9:00 ص – 1:00 ظهراً',
  workHoursEvening: '4:00 م – 8:00 مساءً',
  workDays: 'السبت إلى الخميس (الجمعة مغلق)',
  pricing: {
    consultationOMR: 3,
    singleSessionOMR: 15,
    packageDiscountPercent: 10, // For 5+ sessions
    package5SessionsOMR: 67.5,
    package10SessionsOMR: 135,
    package12SessionsOMR: 162,
  },
  culturalComplianceNotice: 'التزام تام بالخصوصية والتقاليد العُمانية الأصيلة: كادر طبي بقيادة د. سبأ للمريضات وكافة أجهزة التأهيل الحديثة',
  heroImages: {
    entrance: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.55_PM__2__5715f662.jpeg',
    reception: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.57_PM__2__32373791.jpeg',
    treatmentRoom: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.56_PM__1__82ba14c8.jpeg',
    tractionBed: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.54_PM__3__977570fa.jpeg',
    shockwavePoster: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.58_PM__1__a747ffff.jpeg',
    medicalGym: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.58_PM_4f83512b.jpeg',
    comboDevice: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.57_PM_b31e37c1.jpeg',
    airCompression: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.55_PM__4__3ccc8480.jpeg',
  }
};

/**
 * Real verified staff of Um Alqura Polyclinic:
 * 1. Dr. Saba (Physiotherapy & Rehabilitation Specialist)
 * 2. Clinic Assistant
 * 3. Receptionist & Coordinator
 */
export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-saba',
    name: 'د. سبأ',
    nameEn: 'Dr. Saba',
    role: 'physiotherapist',
    gender: 'female',
    specialty: 'أخصائية أولى في العلاج الطبيعي والتأهيل الطبي السريري',
    title: 'أخصائية أولى علاج طبيعي وتأهيل إكلينيكي',
    avatar: 'https://images.unsplash.com/photo-1594824813626-d62f43bb2248?auto=format&fit=crop&q=80&w=300',
    culturalDress: 'عباءة محتشمة إسلامية وفق التقاليد العمانية والخليجية',
    phone: '+968 79470050',
    isAvailable: true,
  },
  {
    id: 'staff-assistant',
    name: 'المساعدة الطبية',
    nameEn: 'Clinical Assistant',
    role: 'assistant',
    gender: 'female',
    specialty: 'مساعدة الأخصائية وتجهيز أسرة وأجهزة العلاج الطبيعي وتعقيم الأدوات',
    title: 'مساعدة علاج طبيعي معتمدة',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    culturalDress: 'زي طبي رسمي ساتر ومحتشم',
    phone: '+968 79470050',
    isAvailable: true,
  },
  {
    id: 'staff-reception',
    name: 'موظفة الاستقبال والتنسيق',
    nameEn: 'Receptionist & Coordinator',
    role: 'receptionist',
    gender: 'female',
    specialty: 'إدارة المواعيد والتأمين الصحي والتنسيق والفوترة وخدمة المراجعين',
    title: 'مسؤولة الاستقبال والخدمات الإدارية',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    culturalDress: 'عباءة محتشمة إسلامية',
    phone: '+968 79470050',
    isAvailable: true,
  }
];

export const INITIAL_BEDS: MedicalBed[] = [
  { id: 'bed-1', name: 'السرير الطبي 1 - جناح الرعاية الخاصة (أزرق)', room: 'غرفة العلاج الرئيسي Bay 1', isOccupied: false, assignedGender: 'female' },
  { id: 'bed-2', name: 'السرير الطبي 2 - سرير شد الفقرات المحوسب', room: 'وحدة شد الفقرات Traction Bay', isOccupied: false },
  { id: 'bed-3', name: 'السرير الطبي 3 - جناح الموجات التصادمية BTL', room: 'غرفة الموجات التصادمية Shockwave Bay', isOccupied: false },
  { id: 'bed-4', name: 'السرير الطبي 4 - جناح الفحص والتأهيل الطبي', room: 'غرفة العلاج Bay 2', isOccupied: false },
  { id: 'bed-gym', name: 'منطقة تمارين الصالة التأهيلية Gym Bay', room: 'صالة التأهيل الطبي والتمارين الحركية', isOccupied: false }
];

export const INITIAL_DEVICES: MedicalDevice[] = [
  {
    id: 'dev-traction',
    name: 'جهاز شد الفقرات العنقية والقطنية المحوسب',
    nameEn: 'Cervical & Lumbar Traction Computerized Unit',
    type: 'cervical_lumbar_traction',
    model: 'Computerized Spinal Decompression Bed & Terminal',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.54_PM__3__977570fa.jpeg',
    status: 'available',
    safetyLimitMinutes: 30,
    safetyIntensityLimit: 'حمل الشد الأقصى: 25-50% من وزن الجسم للقطنية / 10-15% للعنقية',
    room: 'غرفة شد الفقرات'
  },
  {
    id: 'dev-shockwave',
    name: 'جهاز الموجات التصادمية BTL الحديث',
    nameEn: 'BTL Shockwave Therapy System',
    type: 'shockwave_btl',
    model: 'BTL Radial Shockwave Therapy',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.55_PM__1__39013166.jpeg',
    status: 'available',
    safetyLimitMinutes: 20,
    safetyIntensityLimit: 'أقصى طاقة 2.5 بار / 2000-2500 ضربة للجلسة',
    room: 'غرفة الموجات التصادمية'
  },
  {
    id: 'dev-btl4000',
    name: 'جهاز العلاج الكهربائي والموجات فوق الصوتية BTL 4000',
    nameEn: 'BTL 4000 Combined Electrotherapy & Ultrasound',
    type: 'electrotherapy_ultrasound_btl4000',
    model: 'BTL 4000 Smart Electro + Ultrasound',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.57_PM_b31e37c1.jpeg',
    status: 'available',
    safetyLimitMinutes: 25,
    safetyIntensityLimit: 'الكهرباء: 0-40 mA، الموجات: 0.5 - 2.0 W/cm2',
    room: 'غرفة العلاج الطبيعي Bay 1'
  },
  {
    id: 'dev-aircompression',
    name: 'جهاز التدليك بضغط الهواء وأحذية الضغط الليمفاوي',
    nameEn: 'Pneumatic Air Compression Boots & Cuffs',
    type: 'air_compression_boots',
    model: 'Air Compression Recovery Massage System',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.55_PM__4__3ccc8480.jpeg',
    status: 'available',
    safetyLimitMinutes: 30,
    safetyIntensityLimit: 'ضغط الهواء الآمن 60-120 mmHg',
    room: 'غرفة الاستشفاء والضغط'
  },
  {
    id: 'dev-gym',
    name: 'أجهزة صالة التأهيل الرياضي والحركي المتكاملة',
    nameEn: 'Rehabilitation Medical Gym & Parallel Bars',
    type: 'medical_gym',
    model: 'Medical Gym & Functional Training Set',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.58_PM_4f83512b.jpeg',
    status: 'available',
    safetyLimitMinutes: 45,
    safetyIntensityLimit: 'حسب البروتوكول ومعدل ضربات القلب والجهد METs',
    room: 'صالة التأهيل الحركي'
  },
  {
    id: 'dev-manual',
    name: 'علاج يدوي وتمارين فردية بدون أجهزة',
    nameEn: 'Manual Therapy & Hands-on Mobilization',
    type: 'manual_none',
    model: 'Hands-on Clinical Joint Mobilization',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.56_PM__1__82ba14c8.jpeg',
    status: 'available',
    safetyLimitMinutes: 45,
    room: 'جميع غرف الكشف'
  }
];

/**
 * INITIAL PATIENTS: ZEROED OUT - FRESH NEW CLINIC LAUNCH
 * Clinic starts completely clean. Patients are dynamically registered by staff.
 */
export const INITIAL_PATIENTS: Patient[] = [];

/**
 * INITIAL PACKAGES: ZEROED OUT - READY FOR STAFF ENTRY
 */
export const INITIAL_PACKAGES: PackageCourse[] = [];

/**
 * INITIAL APPOINTMENTS: ZEROED OUT - READY FOR REAL BOOKINGS
 */
export const INITIAL_APPOINTMENTS: Appointment[] = [];

/**
 * INITIAL SOAP NOTES: ZEROED OUT - READY FOR REAL CLINICAL DOCUMENTATION
 */
export const INITIAL_SOAP_NOTES: SOAPNote[] = [];

/**
 * INITIAL INSURANCE CLAIMS: ZEROED OUT
 */
export const INITIAL_INSURANCE_CLAIMS: InsuranceClaim[] = [];

/**
 * Standard Home Exercise Templates Library
 * Used by physiotherapist to prescribe exercises to patients
 */
export const HOME_EXERCISES: HomeExercise[] = [
  {
    id: 'ex-1',
    title: 'تمرين إرجاع الذقن للخلف (Chin Tucks)',
    titleEn: 'Cervical Retraction (Chin Tuck)',
    category: 'العمود الفقري والرقبة',
    targetRegion: 'cervical',
    difficulty: 'beginner',
    reps: 10,
    sets: 3,
    holdSeconds: 5,
    frequency: 'مرتين يومياً (صباحاً ومساءً)',
    instructions: 'اجلس مستقيماً واجعل نظرك للأمام مباشرة. ادفع ذقنك للخلف بلطف كما لو أنك تصنع ذقناً مزدوجاً دون إمالة رأسك لأسفل. اثبت 5 ثوانٍ ثم استرخِ.',
    safetyCautions: 'توقف فوراً إذا شعرت بدوخة أو وخز كهربائي ممتد للأصابع.',
    thumbnailUrl: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.58_PM_4f83512b.jpeg',
    modestGuidelines: 'تمرين يؤدى بملابس مريحة ومحتشمة في بيئة منزلية هادئة.'
  },
  {
    id: 'ex-2',
    title: 'تمرين تقوية العضلة الرباعية للركبة (Straight Leg Raise)',
    titleEn: 'Quadriceps Straight Leg Raise',
    category: 'مشاكل الركبة والخشونة',
    targetRegion: 'knee_r',
    difficulty: 'beginner',
    reps: 12,
    sets: 3,
    holdSeconds: 3,
    frequency: 'يومياً بمعدل مرتين',
    instructions: 'استلقِ على ظهرك واثنِ إحدى الركبتين، واجعل الساق الأخرى ممدودة تماماً. شد عضلة الفخذ الأمامية وارفع ساقك المستقيمة 20 سم عن الأرض. اثبت لثوانٍ ثم انزل ببطء.',
    safetyCautions: 'احرص ألا يرتفع أسفل ظهرك عن السطح المستوي أثناء الرفع.',
    thumbnailUrl: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.56_PM__1__82ba14c8.jpeg',
    modestGuidelines: 'ينفذ على سجادة التمارين في مكان خاص بالمنزل.'
  },
  {
    id: 'ex-3',
    title: 'تمرين البندول لمفصل الكتف المتجمد (Codman Pendulum)',
    titleEn: 'Codman Shoulder Pendulum Exercise',
    category: 'الكتف والطرف العلوي',
    targetRegion: 'shoulder_r',
    difficulty: 'beginner',
    reps: 15,
    sets: 3,
    holdSeconds: 0,
    frequency: '3 مرات يومياً لتليين المحفظة المفصلية',
    instructions: 'انحنِ للأمام مستنداً بيدك السليمة على طاولة ثابتة. دع الذراع المصابة تتدلى بحرية كاملة كالبندول. حرك جذعك بلطف بحركات دائرية صغيرة مع استرخاء عضلات الكتف تماماً.',
    safetyCautions: 'لا تستخدم عضلات كتفك في الحركة، بل دع الجاذبية وتأرجح الجذع يقومان بالمهمة.',
    thumbnailUrl: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.57_PM__4__ad1d6296.jpeg',
    modestGuidelines: 'تمرين لطيف وآمن ومناسب لجميع الأعمار.'
  },
  {
    id: 'ex-4',
    title: 'تمرين الجسر لتقوية أسفل الظهر والحوض (Glute Bridge)',
    titleEn: 'Glute Pelvic Bridging',
    category: 'العمود الفقري وأسفل الظهر',
    targetRegion: 'lumbar',
    difficulty: 'intermediate',
    reps: 10,
    sets: 3,
    holdSeconds: 4,
    frequency: 'يومياً مرة واحدة',
    instructions: 'استلقِ على الظهر مع ثني الركبتين والقدمين مستويتين على الأرض. ارفع الحوض للأعلى حتى يشكل جسمك خطاً مستقيماً من الركبتين للكتفين مع شد عضلات الحوض والبطن.',
    safetyCautions: 'تجنب المبالغة في تقويس الظهر للأعلى لحماية الفقرات القطنية.',
    thumbnailUrl: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.54_PM__3__977570fa.jpeg',
    modestGuidelines: 'يتم التمرين بكل حشمة في غرفة المريض الخاصة.'
  },
  {
    id: 'ex-5',
    title: 'تمرين الوقوف والتوازن لكبار السن (Tandem Stance)',
    titleEn: 'Elderly Tandem Balance Training',
    category: 'برامج كبار السن والوقاية من السقوط',
    targetRegion: 'ankle_r',
    difficulty: 'beginner',
    reps: 5,
    sets: 2,
    holdSeconds: 10,
    frequency: 'يومياً بمساعدة أو قرب جدار آمن',
    instructions: 'قف بجانب طاولة ثابتة ممسكاً بها بإحدى اليدين للأمان. ضع كعب إحدى القدمين مباشرة أمام أصابع القدم الأخرى في خط مستقيم. حافظ على اتزانك 10 ثوانٍ مع التنفس المنتظم.',
    safetyCautions: 'يجب وجود مسند ثابت أو جدار دائم بجانبك أو أحد أفراد الأسرة للمساعدة.',
    thumbnailUrl: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.58_PM_4f83512b.jpeg',
    modestGuidelines: 'تمرين مخصص لكبار السن بإشراف عائلي دافئ ومحترم.'
  }
];
