import React, { useState } from 'react';
import { SOAPNote, Patient, PainPoint } from '../types/clinic';
import { BodyMap } from '../components/BodyMap';
import {
  FileText,
  Activity,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Calendar,
  Save,
  Printer,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface SOAPNotesViewProps {
  soapNotes: SOAPNote[];
  patients: Patient[];
  onSaveNote: (note: SOAPNote) => void;
  onOpenVoiceScribe: () => void;
  onOpenDischargeReport: (patient: Patient) => void;
}

export const SOAPNotesView: React.FC<SOAPNotesViewProps> = ({
  soapNotes,
  patients,
  onSaveNote,
  onOpenVoiceScribe,
  onOpenDischargeReport
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Active SOAP Note editing state
  const existingNote = soapNotes.find((n) => n.patientId === currentPatient?.id) || soapNotes[0];

  const [sessionNumber, setSessionNumber] = useState<number>(existingNote?.sessionNumber || 5);
  const [chiefComplaint, setChiefComplaint] = useState<string>(existingNote?.subjective.chiefComplaint || 'المريضة تشعر بارتياح كبير وتراجع ألم الرقبة بعد جلسات الشد المحوسب');
  const [painVAS, setPainVAS] = useState<number>(existingNote?.subjective.painVAS || 3);
  const [painCharacter, setPainCharacter] = useState<string>(existingNote?.subjective.painCharacter || 'ألم وتيبس خفيف ينشط بعد العمل المكتبي');
  const [aggravating, setAggravating] = useState<string>(existingNote?.subjective.aggravatingFactors || 'الجلوس الطويل وانحناء الرأس للأمام');
  const [relieving, setRelieving] = useState<string>(existingNote?.subjective.relievingFactors || 'الراحة، الكمادات الدافئة، وتمارين السحب الذاتي');

  // Objective state
  const [flexionROM, setFlexionROM] = useState<number>(45);
  const [extensionROM, setExtensionROM] = useState<number>(40);
  const [rotationROM, setRotationROM] = useState<number>(70);
  const [mmtScore, setMmtScore] = useState<string>('4+/5');
  const [palpation, setPalpation] = useState<string>('تراجع نقاط الزناد العضلية على الفقرات العنقية C5-C6');
  const [specialTests, setSpecialTests] = useState<string>('Spurling Test سلبي، لا يوجد تنميل باليد');

  // Assessment state
  const [tissueResponse, setTissueResponse] = useState<string>(existingNote?.assessment.tissueResponse || 'استجابة ممتازة لبروتوكول شد الفقرات والعلاج الكهربائي التسكيني');
  const [recoveryPercent, setRecoveryPercent] = useState<number>(75);
  const [clinicalImpression, setClinicalImpression] = useState<string>('انحسار الضغط الجذري على العصب العنقي وتحسن استقرار المفاصل');

  // Plan state
  const [tractionTension, setTractionTension] = useState<number>(7.5);
  const [tractionDuration, setTractionDuration] = useState<number>(20);
  const [electroIntensity, setElectroIntensity] = useState<number>(18);
  const [homeExercises, setHomeExercises] = useState<string>('تمرين إرجاع الذقن للخلف (Chin Tucks) 10 تكرارات 3 مرات يومياً');
  const [precautions, setPrecautions] = useState<string>('تجنب حمل الأوزان الثقيلة باليد اليمنى والنوم على وسادة منخفضة');

  // Pain points on body map
  const [painPoints, setPainPoints] = useState<PainPoint[]>(existingNote?.painPoints || []);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const note: SOAPNote = {
      id: 'soap-' + Date.now(),
      patientId: currentPatient.id,
      appointmentId: 'apt-active',
      sessionNumber,
      date: new Date().toISOString().split('T')[0],
      physioId: currentPatient.assignedPhysioId,
      subjective: {
        chiefComplaint,
        painVAS,
        painCharacter,
        functionalLimitation: 'قادر على ممارسة المهام اليومية مع استقرار ملحوظ',
        aggravatingFactors: aggravating,
        relievingFactors: relieving
      },
      objective: {
        activeROM: {
          'انثناء (Flexion)': flexionROM,
          'بسط (Extension)': extensionROM,
          'دوران (Rotation)': rotationROM
        },
        passiveROM: {
          'انثناء سلبي': flexionROM + 5,
          'بسط سلبي': extensionROM + 5
        },
        manualMuscleTesting: { 'عضلات الرقبة والكتف': mmtScore },
        palpationTenderness: palpation,
        specialTests,
        postureFindings: 'تحسن ميل الرأس للأمام'
      },
      assessment: {
        tissueResponse,
        recoveryProgressPercent: recoveryPercent,
        clinicalImpression,
        prognosis: 'ممتاز'
      },
      plan: {
        nextSessionDate: '2026-11-03',
        prescribedModalities: ['سرير شد الفقرات BTL', 'علاج كهربائي تداخلي', 'تمارين ثبات الرقبة'],
        tractionParams: {
          target: 'cervical',
          tensionKg: tractionTension,
          holdSeconds: 30,
          restSeconds: 15,
          durationMinutes: tractionDuration
        },
        electrotherapyParams: {
          currentType: 'TENS تداخلي',
          intensityMA: electroIntensity,
          durationMinutes: 15
        },
        homeExercisesPrescribed: [homeExercises],
        precautions
      },
      painPoints
    };

    onSaveNote(note);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (patients.length === 0 || !currentPatient) {
    return (
      <div className="bg-white rounded-3xl border border-[#075563]/15 p-10 sm:p-14 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-[#075563]/10 text-[#075563] mx-auto flex items-center justify-center">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">
            ملفات الـ SOAP Notes الإكلينيكية مصفرة وجاهزة
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            لا توجد جلسات أو مرضى مسجلين حتى الآن. يرجى تسجيل أول مراجع من "سجل المراجعين" لتفعيل التوثيق الإكلينيكي الرباعي الرقمي وخريطة الألم والقياسات الحركية ROM.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Patient Picker */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
              ملف الـ SOAP Notes المطور لتقييم العلاج الطبيعي الدوري
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            النموذج الإلزامي الرباعي الرقمي: شكوى المريض (S) • القياسات الحركية (O) • استجابة الأنسجة (A) • خطة الجلسة (P)
          </p>
        </div>

        {/* Patient Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs sm:text-sm font-bold bg-[#FAF8F1] border border-gray-200 rounded-xl p-2.5 text-[#075563]"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.gender === 'female' ? 'أنثى' : 'ذكر'}) - {p.diagnosis.slice(0, 30)}...
              </option>
            ))}
          </select>

          <button
            onClick={onOpenVoiceScribe}
            className="px-3.5 py-2 bg-[#2A9DA5] hover:bg-[#2A9DA5]/90 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#B59B62]" />
            الموثق الصوتي AI
          </button>

          <button
            onClick={() => onOpenDischargeReport(currentPatient)}
            className="px-3.5 py-2 bg-[#FAF8F1] hover:bg-[#B59B62]/20 text-[#075563] text-xs font-bold rounded-xl border border-[#B59B62]/40 transition flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-[#B59B62]" />
            تقرير التخرج PDF
          </button>
        </div>
      </div>

      {/* Patient Information Strip */}
      <div className="bg-[#FAF8F1] p-4 rounded-2xl border border-[#B59B62]/25 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-gray-500 block">المراجع الحالي:</span>
          <strong className="text-sm font-bold text-[#075563]">{currentPatient.name}</strong>
        </div>
        <div>
          <span className="text-gray-500 block">التشخيص الطبي:</span>
          <strong className="text-gray-800">{currentPatient.diagnosis}</strong>
        </div>
        <div>
          <span className="text-gray-500 block">الأخصائي المشرف:</span>
          <strong className="text-[#075563]">
            {currentPatient.gender === 'female' ? 'د. سبأ (أخصائية النساء)' : 'أخصائي العلاج الطبيعي للرجال'}
          </strong>
        </div>
        <div>
          <span className="text-gray-500 block">رقم الجلسة الحالية:</span>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="number"
              value={sessionNumber}
              onChange={(e) => setSessionNumber(Number(e.target.value))}
              className="w-16 bg-white border border-gray-300 rounded-lg p-1 font-mono font-bold text-center"
            />
            <span className="text-gray-400">من الخطة العلاجية</span>
          </div>
        </div>
      </div>

      {/* AUTOMATIC PROGRESS LINE CHART (MODULE 7) */}
      <div className="bg-white rounded-3xl border border-[#075563]/15 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#075563] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#B59B62]" />
              لوحة تقارير الرسم البياني التلقائي (Automatic Progress Line Chart)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              مقارنة أرقام المدى الحركي (ROM) ومستويات الألم (VAS) بين يوم الدخول (Baseline) والجلسة الحالية
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            تحسن إجمالي: +{recoveryPercent}%
          </div>
        </div>

        {/* Visual Comparison Chart Component */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          {/* 1. Pain VAS Trend (Line Visualization) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-700">مؤشر انخفاض الألم (VAS 0-10):</span>
              <span className="text-emerald-700 font-mono">
                من {currentPatient.baselinePainVAS} إلى {painVAS} (تراجع {currentPatient.baselinePainVAS - painVAS} درجات)
              </span>
            </div>

            {/* SVG Line Chart for Pain */}
            <div className="h-32 bg-white rounded-xl p-3 border border-gray-200 flex flex-col justify-between">
              <div className="flex justify-between text-[10px] text-gray-400 font-mono border-b border-gray-100 pb-1">
                <span>جلسة 1 (دخول)</span>
                <span>جلسة 2</span>
                <span>جلسة 3</span>
                <span>جلسة 4</span>
                <span className="font-bold text-[#075563]">جلسة {sessionNumber} (اليوم)</span>
              </div>

              {/* Vector Trend Line */}
              <div className="relative h-20 w-full flex items-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70">
                  <defs>
                    <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {/* Baseline to Current Path */}
                  <path
                    d={`M 10 15 Q 80 25, 150 40 T 290 ${65 - (10 - painVAS) * 4}`}
                    fill="none"
                    stroke="#075563"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Points */}
                  <circle cx="10" cy="15" r="5" fill="#ef4444" />
                  <circle cx="290" cy={65 - (10 - painVAS) * 4} r="5" fill="#10b981" />
                  <text x="10" y="8" fontSize="9" fontWeight="bold" fill="#ef4444">8/10</text>
                  <text x="270" y={55 - (10 - painVAS) * 4} fontSize="9" fontWeight="bold" fill="#10b981">{painVAS}/10</text>
                </svg>
              </div>
            </div>
          </div>

          {/* 2. ROM Trend (Goniometer Degrees) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-700">مؤشر اتساع المدى الحركي (ROM in Degrees):</span>
              <span className="text-[#075563] font-mono">
                الانثناء: {flexionROM}° / البسط: {extensionROM}°
              </span>
            </div>

            <div className="h-32 bg-white rounded-xl p-3 border border-gray-200 flex flex-col justify-around text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>انثناء المفصل (Flexion):</span>
                  <span className="font-mono font-bold text-[#075563]">{flexionROM}° / 50°</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#075563] h-full rounded-full transition-all" style={{ width: `${(flexionROM / 50) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>بسط المفصل (Extension):</span>
                  <span className="font-mono font-bold text-[#2A9DA5]">{extensionROM}° / 60°</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#2A9DA5] h-full rounded-full transition-all" style={{ width: `${(extensionROM / 60) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Visual Interactive Body Map (Module 3) */}
      <BodyMap
        painPoints={painPoints}
        onChange={setPainPoints}
      />

      {/* THE 4-PART DIGITAL SOAP FORM */}
      <div className="space-y-5">
        {/* S: Subjective */}
        <div className="bg-white rounded-3xl border border-[#075563]/15 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#075563] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#075563] text-white flex items-center justify-center font-bold font-mono">
                S
              </span>
              <span>1. التقييم الذاتي وشكوى المريض (Subjective)</span>
            </h3>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-bold">
              مؤشر الألم VAS: {painVAS} / 10
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* VAS Pain Slider */}
            <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/30">
              <div className="flex justify-between items-center mb-1 font-bold text-gray-800">
                <span>مقياس الألم البصري الرقمي (Visual Analog Scale - VAS):</span>
                <span className={`px-2.5 py-1 rounded-md text-white font-mono text-sm ${
                  painVAS >= 8 ? 'bg-red-600' : painVAS >= 5 ? 'bg-orange-500' : 'bg-emerald-600'
                }`}>
                  {painVAS} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painVAS}
                onChange={(e) => setPainVAS(Number(e.target.value))}
                className="w-full accent-[#075563]"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>0 = لا يوجد ألم إطلاقاً</span>
                <span>5 = ألم متوسط معتدل</span>
                <span>10 = ألم شديد جداً لا يطاق</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">شكوى المريض وتحديث الحالة اليوم:</label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-800"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">طبيعة ونمط الألم (Character of Pain):</label>
                <textarea
                  value={painCharacter}
                  onChange={(e) => setPainCharacter(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-800"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">العوامل المحفزة للألم (Aggravating):</label>
                <input
                  type="text"
                  value={aggravating}
                  onChange={(e) => setAggravating(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-800"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">العوامل المخففة للألم (Relieving):</label>
                <input
                  type="text"
                  value={relieving}
                  onChange={(e) => setRelieving(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* O: Objective */}
        <div className="bg-white rounded-3xl border border-[#075563]/15 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#075563] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2A9DA5] text-white flex items-center justify-center font-bold font-mono">
                O
              </span>
              <span>2. القياسات الموضوعية والحركية الرقمية (Objective)</span>
            </h3>
            <span className="text-xs text-gray-500">زوايا المدى ROM وقوة العضلات</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <label className="font-bold text-gray-700 block mb-1">انثناء المفصل (Flexion ROM):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={flexionROM}
                  onChange={(e) => setFlexionROM(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold"
                />
                <span className="text-gray-500 font-bold">درجة</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <label className="font-bold text-gray-700 block mb-1">بسط المفصل (Extension ROM):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={extensionROM}
                  onChange={(e) => setExtensionROM(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold"
                />
                <span className="text-gray-500 font-bold">درجة</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <label className="font-bold text-gray-700 block mb-1">القوة العضلية اليدوية (MMT):</label>
              <select
                value={mmtScore}
                onChange={(e) => setMmtScore(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold"
              >
                <option value="5/5">5/5 - قوة كاملة مقاومة طبيعية</option>
                <option value="4+/5">4+/5 - قوة ممتازة بمقاومة متوسطة</option>
                <option value="4/5">4/5 - مقاومة مقبولة</option>
                <option value="3/5">3/5 - حركة ضد الجاذبية فقط</option>
                <option value="2/5">2/5 - حركة بدون جاذبية</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">نتائج الجس وتحسس الأنسجة (Palpation):</label>
              <input
                type="text"
                value={palpation}
                onChange={(e) => setPalpation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">الاختبارات السريرية الخاصة (Special Tests):</label>
              <input
                type="text"
                value={specialTests}
                onChange={(e) => setSpecialTests(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* A: Assessment */}
        <div className="bg-white rounded-3xl border border-[#075563]/15 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#075563] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#B59B62] text-white flex items-center justify-center font-bold font-mono">
                A
              </span>
              <span>3. التقييم السريري واستجابة الأنسجة (Assessment)</span>
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              نسبة التحسن: {recoveryPercent}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">استجابة الأنسجة للبروتوكول الحالي (Tissue Response):</label>
              <textarea
                value={tissueResponse}
                onChange={(e) => setTissueResponse(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">الانطباع والتشخيص المرحلي للأخصائي:</label>
              <textarea
                value={clinicalImpression}
                onChange={(e) => setClinicalImpression(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* P: Plan */}
        <div className="bg-white rounded-3xl border border-[#075563]/15 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#075563] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold font-mono">
                P
              </span>
              <span>4. الخطة العلاجية والتعديلات البرمجية (Plan)</span>
            </h3>
            <span className="text-xs text-gray-500">معايير الأجهزة وبرنامج المنزل</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#FAF8F1] p-3.5 rounded-xl border border-[#B59B62]/20">
              <label className="font-bold text-[#075563] block mb-1">قوة شد سرير الفقرات (كجم):</label>
              <input
                type="number"
                value={tractionTension}
                onChange={(e) => setTractionTension(Number(e.target.value))}
                step="0.5"
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono font-bold"
              />
            </div>

            <div className="bg-[#FAF8F1] p-3.5 rounded-xl border border-[#B59B62]/20">
              <label className="font-bold text-[#075563] block mb-1">شدة التنبيه الكهربائي BTL (mA):</label>
              <input
                type="number"
                value={electroIntensity}
                onChange={(e) => setElectroIntensity(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono font-bold"
              />
            </div>

            <div className="bg-[#FAF8F1] p-3.5 rounded-xl border border-[#B59B62]/20">
              <label className="font-bold text-[#075563] block mb-1">زمن الجلسة بالأجهزة (دقيقة):</label>
              <input
                type="number"
                value={tractionDuration}
                onChange={(e) => setTractionDuration(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">التمارين المنزلية الموصوفة اليوم:</label>
              <input
                type="text"
                value={homeExercises}
                onChange={(e) => setHomeExercises(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">محاذير وتوجيهات السلامة:</label>
              <input
                type="text"
                value={precautions}
                onChange={(e) => setPrecautions(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button & Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
        <div>
          {savedSuccess && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              تم حفظ وتحديث ملف SOAP للجلسة {sessionNumber} بنجاح في قاعدة البيانات.
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-[#B59B62]" />
          حفظ واعتماد تقرير الـ SOAP
        </button>
      </div>
    </div>
  );
};
