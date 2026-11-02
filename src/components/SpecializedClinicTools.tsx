import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Scale,
  Zap,
  TrendingDown,
  Layers,
  HeartPulse,
  Flame,
  Camera,
  Eye,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

// -------------------------------------------------------------
// MODULE 16: Spine Care Clinic (Radar Spine Map & Traction Protocols)
// -------------------------------------------------------------
export const SpineRadarMap: React.FC = () => {
  const [selectedVertebra, setSelectedVertebra] = useState<string>('L4-L5');
  const [patientWeightKg, setPatientWeightKg] = useState<number>(75);

  const spineProtocols: { [key: string]: { section: string; type: 'cervical' | 'lumbar'; recommendedTensionKg: number; holdSec: number; restSec: number; durationMin: number; notes: string } } = {
    'C4-C5': { section: 'فقرات عنقية عليا', type: 'cervical', recommendedTensionKg: 6.5, holdSec: 30, restSec: 15, durationMin: 20, notes: 'زاوية سحب 15 درجة للأعلى لتوسيع الثقوب الفقرية العلوية' },
    'C5-C6': { section: 'فقرات عنقية وسطى (الأكثر شيوعاً للانزلاق)', type: 'cervical', recommendedTensionKg: 7.5, holdSec: 30, restSec: 15, durationMin: 20, notes: 'زاوية سحب 20-25 درجة لتحرير العصب العنقي السادس C6' },
    'C6-C7': { section: 'فقرات عنقية سفلية', type: 'cervical', recommendedTensionKg: 8.0, holdSec: 35, restSec: 15, durationMin: 20, notes: 'زاوية سحب 25 درجة لتخفيف الضغط عن عصب الذراع الأيمن/الأيسر' },
    'L3-L4': { section: 'فقرات قطنية عليا', type: 'lumbar', recommendedTensionKg: 28, holdSec: 45, restSec: 20, durationMin: 25, notes: 'سحب مستقيم مع وسادة رفع تحت الركبتين بزاوية 90 درجة' },
    'L4-L5': { section: 'فقرات قطنية وسطى (عرق النسا والديسك)', type: 'lumbar', recommendedTensionKg: 32, holdSec: 50, restSec: 20, durationMin: 25, notes: 'سحب متقطع على سرير الشد المحوسب بقوة تعادل ثلث وزن المريض' },
    'L5-S1': { section: 'المفصل القطني العجزي', type: 'lumbar', recommendedTensionKg: 34, holdSec: 50, restSec: 20, durationMin: 25, notes: 'تركيز الشد على قاعدة الحوض مع تثبيت الحزام الصدري المزدوج' }
  };

  const currentProto = spineProtocols[selectedVertebra] || spineProtocols['L4-L5'];
  // Dynamic weight-based tension calculation (25-40% of body weight for lumbar, 10% for cervical)
  const adjustedTensionKg = currentProto.type === 'lumbar'
    ? Math.round(patientWeightKg * 0.35)
    : Math.round(patientWeightKg * 0.10);

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#075563] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B59B62]" />
            خريطة الفقرات الرادارية وبروتوكولات الشد بالكمبيوتر (Spine Radar Map)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            تحديد الفقرات المصابة تلقائياً وربطها بمعايير سرير الشد المحوسب (BTL Traction Bed)
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 px-3 py-1 rounded-full">
          عيادة العمود الفقري والرقبة
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Vertebrae Spine Selector */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#FAF8F1] to-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-xs font-bold text-gray-700 mb-2">اختر المستوى الفقري المصاب:</div>
          <div className="space-y-1.5 max-w-[220px] mx-auto font-mono text-xs">
            <div className="text-[10px] text-gray-400 font-sans">الفقرات العنقية (Cervical)</div>
            {['C4-C5', 'C5-C6', 'C6-C7'].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVertebra(v)}
                className={`w-full py-1.5 px-3 rounded-lg border font-bold transition flex items-center justify-between ${
                  selectedVertebra === v
                    ? 'bg-[#075563] text-white border-[#075563] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{v}</span>
                <span className="text-[10px] font-sans font-normal opacity-80">عنقية</span>
              </button>
            ))}

            <div className="text-[10px] text-gray-400 font-sans pt-2">الفقرات القطنية (Lumbar)</div>
            {['L3-L4', 'L4-L5', 'L5-S1'].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVertebra(v)}
                className={`w-full py-1.5 px-3 rounded-lg border font-bold transition flex items-center justify-between ${
                  selectedVertebra === v
                    ? 'bg-[#2A9DA5] text-white border-[#2A9DA5] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{v}</span>
                <span className="text-[10px] font-sans font-normal opacity-80">قطنية</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <label className="text-[11px] text-gray-600 block mb-1">وزن المريض الإجمالي (كجم):</label>
            <input
              type="number"
              value={patientWeightKg}
              onChange={(e) => setPatientWeightKg(Number(e.target.value))}
              className="w-24 text-center font-mono font-bold text-sm bg-white border border-gray-300 rounded-lg p-1.5"
            />
          </div>
        </div>

        {/* Automated Computerized Traction Protocol Display */}
        <div className="lg:col-span-7 bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#075563]">
              بروتوكول سرير الشد لجهاز ({selectedVertebra}):
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              معتمد ومأمون
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-gray-500 block text-[10px]">قوة الشد (Tension)</span>
              <strong className="text-[#075563] text-base font-mono">{adjustedTensionKg} كجم</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-gray-500 block text-[10px]">زمن الشد (Hold)</span>
              <strong className="text-gray-800 text-base font-mono">{currentProto.holdSec} ثانية</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-gray-500 block text-[10px]">زمن الراحة (Rest)</span>
              <strong className="text-gray-800 text-base font-mono">{currentProto.restSec} ثانية</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-gray-500 block text-[10px]">مدة الجلسة الكلية</span>
              <strong className="text-emerald-700 text-base font-mono">{currentProto.durationMin} دقيقة</strong>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs space-y-1">
            <span className="font-bold text-[#075563]">التوجيه الإكلينيكي لسرير الشد:</span>
            <p className="text-gray-700 leading-relaxed">{currentProto.notes}</p>
          </div>

          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#075563] flex-shrink-0" />
            <span>يتم نقل هذه الإعدادات تلقائياً إلى وحدة حاسوب سرير الشد بمجمع أم القرى لتوفير وقت الأخصائي.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MODULE 17: Knee & Osteoarthritis Care (Joint Loading Calculator & Safe Electrotherapy)
// -------------------------------------------------------------
export const JointLoadingCalculator: React.FC = () => {
  const [patientWeightKg, setPatientWeightKg] = useState<number>(88);
  const [targetWeightLossKg, setTargetWeightLossKg] = useState<number>(6);

  // Biomechanics rule: Walking creates 3x body weight load on knee, stairs create 4x body weight.
  // Each 1 kg lost removes 4 kg of repetitive peak force from the patellofemoral & tibiofemoral joints!
  const normalWalkingLoad = patientWeightKg * 3.0;
  const stairClimbingLoad = patientWeightKg * 4.2;
  const reducedLoadPerStep = targetWeightLossKg * 4.0;
  const dailyRelievedPressureKg = Math.round(reducedLoadPerStep * 5000); // 5000 steps daily

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#075563] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#B59B62]" />
            حاسبة الحمل المفصلي وتخفيف الضغط على الركبة (Joint Loading Calculator)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            ربط الوزن الميكانيكي بضغط الغضاريف وتحفيز تقوية العضلة الرباعية لتخفيف الخشونة
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 px-3 py-1 rounded-full">
          عيادة الركبة والخشونة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/20 space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">وزن المريض الحالي (كجم):</label>
            <input
              type="number"
              value={patientWeightKg}
              onChange={(e) => setPatientWeightKg(Number(e.target.value))}
              className="w-full text-base font-mono font-bold bg-white border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">الوزن المستهدف إنقاصه بالبرنامج (كجم):</label>
            <input
              type="number"
              value={targetWeightLossKg}
              onChange={(e) => setTargetWeightLossKg(Number(e.target.value))}
              className="w-full text-base font-mono font-bold bg-white border border-gray-300 rounded-lg p-2 text-emerald-700"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 flex flex-col justify-center">
          <div className="text-xs text-gray-500">الضغط اللحظي على الركبة أثناء صعود الدرج:</div>
          <div className="text-3xl font-black text-red-600 font-mono">
            {Math.round(stairClimbingLoad)} <span className="text-xs font-sans text-gray-600">كجم قوة لكل خطوة</span>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-emerald-800 font-bold">الضغط المزاح عن المفصل بإنقاص {targetWeightLossKg} كجم فقط:</div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              -{reducedLoadPerStep} <span className="text-xs font-sans text-gray-600">كجم في كل خطوة واحدة</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              ما يعادل توفير <strong className="text-emerald-700 font-bold">{dailyRelievedPressureKg.toLocaleString()} كجم</strong> من الضغط التراكمي يومياً على غضاريف الركبة!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MODULE 18: Shoulder & Upper Limb Clinic (Complex Angles & Frozen Shoulder)
// -------------------------------------------------------------
export const FrozenShoulderDashboard: React.FC = () => {
  const [activeROM, setActiveROM] = useState({ abduction: 110, externalRotation: 35, internalRotation: 40, flexion: 125 });
  const [passiveROM, setPassiveROM] = useState({ abduction: 130, externalRotation: 45, internalRotation: 50, flexion: 140 });

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#075563] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#B59B62]" />
            متتبع زوايا الكتف المعقدة والكتف المتجمد (Frozen Shoulder Dashboard)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            مقارنة المدى الحركي الإيجابي والسلبي ومؤشر الاستجابة الأسبوعية لتحريك المحفظة المفصلية
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 px-3 py-1 rounded-full">
          عيادة الكتف والطرف العلوي
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {[
          { name: 'تبعيد الكتف (Abduction)', active: activeROM.abduction, passive: passiveROM.abduction, normal: 180 },
          { name: 'دوران خارجي (External Rot)', active: activeROM.externalRotation, passive: passiveROM.externalRotation, normal: 90 },
          { name: 'دوران داخلي (Internal Rot)', active: activeROM.internalRotation, passive: passiveROM.internalRotation, normal: 70 },
          { name: 'انثناء أمامي (Flexion)', active: activeROM.flexion, passive: passiveROM.flexion, normal: 180 }
        ].map((item, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center space-y-1">
            <span className="font-bold text-gray-800 block">{item.name}</span>
            <div className="flex justify-around items-center pt-1 font-mono text-xs">
              <div>
                <span className="text-[10px] text-gray-500 block">نشط</span>
                <strong className="text-[#075563] font-bold text-sm">{item.active}°</strong>
              </div>
              <div className="text-gray-300">|</div>
              <div>
                <span className="text-[10px] text-gray-500 block">سلبي</span>
                <strong className="text-[#2A9DA5] font-bold text-sm">{item.passive}°</strong>
              </div>
            </div>
            <div className="text-[10px] text-gray-400">الطبيعي: {item.normal}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MODULE 19: Sports Injuries & Return to Play (RTP Checklist Gatekeeper)
// -------------------------------------------------------------
export const ReturnToPlayGatekeeper: React.FC = () => {
  const [tests, setTests] = useState([
    { id: 't1', title: 'انعدام الارتشاح والتورم بالمفصل (Zero Joint Effusion)', passed: true },
    { id: 't2', title: 'مؤشر القوة التناظري للعضلة الرباعية (Quad Index > 90%)', passed: true },
    { id: 't3', title: 'اختبار القفز على ساق واحدة (Single Leg Hop Test > 90%)', passed: false },
    { id: 't4', title: 'مقياس التوازن الديناميكي Y-Balance Test', passed: false },
    { id: 't5', title: 'الجري المتعرج وتغيير الاتجاه بدون تردد أو خوف حركي', passed: false }
  ]);

  const allPassed = tests.every((t) => t.passed);

  const toggleTest = (id: string) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, passed: !t.passed } : t)));
  };

  const handleAttemptDischarge = () => {
    if (allPassed) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      alert('تم استيفاء جميع معايير العودة للملاعب بنجاح! تم اعتماد الإذن الطبي الرياضي.');
    } else {
      alert('عذراً! لا يمكن إغلاق ملف الحالة الرياضية أو إصدار إذن العودة للملاعب قبل اجتياز كافة الاختبارات بنسبة 100% حفاظاً على سلامة الرباط الصليبي.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#075563] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#B59B62]" />
            مؤشر الجاهزية الرياضية وحارس العودة للملاعب (RTP Checklist Gatekeeper)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            نظام صارم يمنع إغلاق حالة الرياضي أو التصريح باللعب إلا بعد اجتياز متتالية الاختبارات الرقمية
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 px-3 py-1 rounded-full">
          عيادة الإصابات الرياضية
        </span>
      </div>

      <div className="space-y-2.5">
        {tests.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleTest(t.id)}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
              t.passed
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${t.passed ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                {t.passed ? <CheckCircle2 className="w-4 h-4" /> : null}
              </span>
              <span>{t.title}</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${t.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-gray-200 text-gray-600'}`}>
              {t.passed ? 'مجتاز بنجاح' : 'معلق / لم يجتز'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs">
          حالة الملف الرياضي:{' '}
          <strong className={allPassed ? 'text-emerald-700' : 'text-red-600'}>
            {allPassed ? 'مؤهل للمصادقة الطبية' : 'مغلق ومحمي بواسطة الحارس الرقمي (Locked)'}
          </strong>
        </div>
        <button
          onClick={handleAttemptDischarge}
          className={`px-5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 text-white ${
            allPassed
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md'
              : 'bg-gray-400 cursor-not-allowed opacity-80'
          }`}
        >
          {allPassed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          اعتماد إذن العودة للملاعب (RTP Clearance)
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MODULE 20: Post-Surgical Rehabilitation (Surgical Red Flags & Contraindications)
// -------------------------------------------------------------
export const SurgicalRedFlagsSystem: React.FC = () => {
  const [surgeryType, setSurgeryType] = useState<string>('acl_recon');
  const [postOpDays, setPostOpDays] = useState<number>(18);

  // Auto red flags mapping
  const redFlagsMap: { [key: string]: { allowedPhase: string; blockedMoves: string[]; safeProtocols: string[] } } = {
    acl_recon: {
      allowedPhase: 'المرحلة 1: حماية الطعم والتورم واستعادة البسط الكامل',
      blockedMoves: [
        'ممنوع منعاً باتاً: تمارين البسط المفتوح للركبة بالأوزان (Open Kinetic Chain Extension 0-30°)',
        'ممنوع: الدوران المحوري أو الحركات الالتفافية الحادة (Pivoting/Cutting)',
        'ممنوع: الجري أو القفز قبل الأسبوع الـ 12'
      ],
      safeProtocols: [
        'تمارين الانقباض الإيزومتري للعضلة الرباعية (Quad Sets)',
        'تحريك صابونة الركبة يدوياً (Patellar Mobilization)',
        'استخدام أحذية الضغط الهوائي وموجات التبريد لتصريف السوائل'
      ]
    },
    rotator_cuff: {
      allowedPhase: 'المرحلة 1: حماية وتر الكتف المستصلح والحركة السلبية فقط',
      blockedMoves: [
        'ممنوع: أي رفع نشط للذراع بدون مساندة (No Active Arm Elevation)',
        'ممنوع: حمل أي أوزان تتعدى نصف كيلوجرام باليد المصابة',
        'ممنوع: الدوران الخارجي الأقصى المفرط'
      ],
      safeProtocols: [
        'تمارين البندول اللطيفة لكودمان (Codman Pendulum)',
        'تحريك أصابع اليد والرسغ لتنشيط الدورة الدموية',
        'علاج كهربائي تسكيني خفيف للأنسجة المحيطة'
      ]
    },
    lumbar_microdiscectomy: {
      allowedPhase: 'المرحلة 1: حماية القرص الغضروفي وثبات الجذع',
      blockedMoves: [
        'ممنوع: الانحناء للأمام مع حمل أوزان (No Bending & Lifting)',
        'ممنوع: الجلوس المتواصل لأكثر من 20 دقيقة متصلة',
        'ممنوع: شد الفقرات العنيف في الأسابيع الستة الأولى'
      ],
      safeProtocols: [
        'المشي المتدرج على أسطح مستوية يومياً',
        'تمارين تنشيط عضلات البطن العميقة (Transverse Abdominis Bracing)',
        'تعديل وضعية النوم بوضع وسادة بين الركبتين'
      ]
    }
  };

  const currentFlag = redFlagsMap[surgeryType] || redFlagsMap.acl_recon;

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#075563] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            نظام الخطوط الحمراء الجراحية (Surgical Red Flags System)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            حظر وإخفاء الحركات والتمارين الممنوعة تلقائياً بناءً على تاريخ العملية لحماية المريض
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 px-3 py-1 rounded-full">
          عيادة التأهيل بعد الجراحة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-bold text-gray-700 block mb-1">نوع العملية الجراحية المجراة:</label>
          <select
            value={surgeryType}
            onChange={(e) => setSurgeryType(e.target.value)}
            className="w-full bg-[#FAF8F1] border border-gray-200 rounded-xl p-2.5 font-bold text-[#075563]"
          >
            <option value="acl_recon">ترميم الرباط الصليبي الأمامي (ACL Reconstruction)</option>
            <option value="rotator_cuff">خياطة أوتار الكفة المدورة للكتف (Rotator Cuff Repair)</option>
            <option value="lumbar_microdiscectomy">استئصال غضروف قطني ميكروسكوبي (Lumbar Discectomy)</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">المدة المنقضية منذ تاريخ الجراحة:</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={postOpDays}
              onChange={(e) => setPostOpDays(Number(e.target.value))}
              className="w-24 bg-gray-50 border border-gray-300 rounded-xl p-2 font-mono font-bold text-center"
            />
            <span className="text-gray-500">يوماً (الأسبوع {Math.ceil(postOpDays / 7)})</span>
          </div>
        </div>
      </div>

      {/* Blocked Contraindications (Red Box) */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-red-800 font-bold text-xs sm:text-sm">
          <Lock className="w-4 h-4 text-red-600" />
          <span>الحركات والتمارين المحظورة إكلينيكياً في هذه المرحلة (محجوبة تلقائياً في خطة الجلسة):</span>
        </div>
        <ul className="space-y-1 text-xs text-red-700 list-disc pr-6">
          {currentFlag.blockedMoves.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      {/* Allowed Safe Protocols (Green Box) */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>البروتوكولات الآمنة والموصى بها للمرحلة الحالية:</span>
        </div>
        <ul className="space-y-1 text-xs text-emerald-700 list-disc pr-6">
          {currentFlag.safeProtocols.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MODULE 22: Neurological Rehabilitation (Modified Ashworth Scale Spasticity Tracker)
// -------------------------------------------------------------
export const NeuroSpasticityTracker: React.FC = () => {
  const [ashworthScore, setAshworthScore] = useState<string>('2');

  const ashworthLevels: { [key: string]: { label: string; desc: string; color: string } } = {
    '0': { label: 'درجة 0: لا توجد أي زيادة في المقاومة العضلية (طبيعي)', desc: 'مرونة طبيعية وتناغم عضلي سليم', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    '1': { label: 'درجة 1: مسك خفيف طفيف عند نهاية المدى الحركي', desc: 'Catch and release عند الثني أو البسط السريع', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    '1+': { label: 'درجة 1+: مسك طفيف متبوع بمقاومة طفيفة في أقل من نصف المدى', desc: 'زيادة مقبولة في التوتر العضلي', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    '2': { label: 'درجة 2: زيادة أوضح في المقاومة لمعظم المدى لكن الجزء يتحرك بسهولة', desc: 'تشنج ملحوظ لدى مرضى الجلطات يحتاج لتثبيط حركي', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    '3': { label: 'درجة 3: زيادة حادة في المقاومة والحركة السلبية صعبة', desc: 'صعوبة في فرد الذراع أو الساق دون إطالة مطولة', color: 'bg-red-100 text-red-800 border-red-300' },
    '4': { label: 'درجة 4: الجزء المصاب متصلب تماماً في الثني أو البسط', desc: 'تيبس شديد (Rigid Contracture)', color: 'bg-red-200 text-red-900 border-red-400 font-bold' }
  };

  const currentInfo = ashworthLevels[ashworthScore] || ashworthLevels['2'];

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#075563] flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#B59B62]" />
            متتبع التشنج العضلي العصبي (Modified Ashworth Scale Tracker)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            تسجيل ومتابعة مرونة العضلات وجدارتها الحركية لمرضى الجلطات والشلل الرعاش في كل زيارة
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 px-3 py-1 rounded-full">
          عيادة التأهيل العصبي
        </span>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-700 block">
          اختر درجة التشنج وفق مقياس أشفورث المعدل:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {Object.keys(ashworthLevels).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setAshworthScore(lvl)}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition ${
                ashworthScore === lvl
                  ? 'bg-[#075563] text-white border-[#075563] shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Grade {lvl}
            </button>
          ))}
        </div>

        <div className={`p-4 rounded-xl border text-xs space-y-1 ${currentInfo.color}`}>
          <div className="font-bold text-sm">{currentInfo.label}</div>
          <div className="opacity-90">{currentInfo.desc}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MODULE 23: Medical Fitness & Weight Management (InBody & METs Calorie Calculator)
// -------------------------------------------------------------
export const MedicalFitnessCalculator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(85);
  const [skeletalMuscleKg, setSkeletalMuscleKg] = useState<number>(31);
  const [bodyFatKg, setBodyFatKg] = useState<number>(27);
  const [visceralFatLevel, setVisceralFatLevel] = useState<number>(11);
  const [exerciseMets, setExerciseMets] = useState<number>(4.5); // 4.5 METs = Medical gym cycling/walking
  const [durationMin, setDurationMin] = useState<number>(30);

  // Calorie expenditure formula: Calories = METs * 3.5 * weightKg / 200 * durationMinutes
  const caloriesBurned = Math.round(((exerciseMets * 3.5 * weightKg) / 200) * durationMin);
  const bodyFatPercent = ((bodyFatKg / weightKg) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#075563] flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#B59B62]" />
            ربط قراءات InBody وحاسبة السعرات الحركية (METs Calculator)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            تصميم برنامج حرق دهون في الجيم الطبي دون تحميل مفاصل المريض أوزاناً خطيرة
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 px-3 py-1 rounded-full">
          برامج الحركة وتخفيف الوزن
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* InBody Inputs */}
        <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/20 space-y-3 text-xs">
          <span className="font-bold text-[#075563] block">قراءات محلل تكوين الجسم (InBody Integration):</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-600 block mb-1">الوزن الكلي (كجم):</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-1">كتلة العضلات الهيكلية (SMM):</label>
              <input
                type="number"
                value={skeletalMuscleKg}
                onChange={(e) => setSkeletalMuscleKg(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-1">كتلة الدهون الكلية (BFM):</label>
              <input
                type="number"
                value={bodyFatKg}
                onChange={(e) => setBodyFatKg(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-1">مستوى الدهون الحشوية:</label>
              <input
                type="number"
                value={visceralFatLevel}
                onChange={(e) => setVisceralFatLevel(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* METs Calorie Calculation Output */}
        <div className="bg-gradient-to-br from-[#075563] to-[#2A9DA5] text-white p-5 rounded-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs text-[#FAF8F1]/80">نسبة الدهون الإجمالية للجسم:</div>
            <div className="text-3xl font-black font-mono text-[#B59B62]">{bodyFatPercent}%</div>
          </div>

          <div className="pt-2 border-t border-white/20">
            <div className="text-xs text-[#FAF8F1]/80">الطاقة المستهلكة في تمرين الجيم الطبي (30 دقيقة):</div>
            <div className="text-4xl font-black font-mono my-1">
              {caloriesBurned} <span className="text-sm font-sans font-normal">سعر حراري</span>
            </div>
            <div className="text-[11px] text-[#FAF8F1]/90">
              مستوى جهد منخفض التأثير (Low-impact 4.5 METs) آمن تماماً لمفاصل الركبة والفقرات القطنية.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
