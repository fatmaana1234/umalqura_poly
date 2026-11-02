import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertTriangle, X, RefreshCw, Award } from 'lucide-react';

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScore?: (tool: 'DASH' | 'Oswestry' | 'Berg', score: number, category: string) => void;
}

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({ isOpen, onClose, onApplyScore }) => {
  const [activeTab, setActiveTab] = useState<'DASH' | 'Oswestry' | 'Berg'>('Oswestry');

  // --- Oswestry Disability Index (10 sections) ---
  const [oswestryAnswers, setOswestryAnswers] = useState<number[]>([1, 1, 2, 1, 2, 1, 1, 0, 1, 1]);
  const oswestryTotal = oswestryAnswers.reduce((a, b) => a + b, 0);
  const oswestryMax = 50;
  const oswestryPercent = Math.round((oswestryTotal / oswestryMax) * 100);

  const getOswestryCategory = (pct: number) => {
    if (pct <= 20) return { label: 'عجز طفيف (Minimal Disability)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (pct <= 40) return { label: 'عجز متوسط (Moderate Disability)', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
    if (pct <= 60) return { label: 'عجز شديد (Severe Disability)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    if (pct <= 80) return { label: 'عجز مقعد (Crippled)', color: 'text-red-700 bg-red-50 border-red-200' };
    return { label: 'طريح الفراش (Bed-bound)', color: 'text-red-900 bg-red-100 border-red-300' };
  };

  const oswestryQuestions = [
    { title: '1. شدة الألم (Pain Intensity)', options: ['لا أشعر بألم حالياً (0)', 'الألم خفيف جداً (1)', 'الألم معتدل (2)', 'الألم شديد إلى حد ما (3)', 'الألم شديد جداً (4)', 'أسوأ ألم يمكن تخيله (5)'] },
    { title: '2. العناية الشخصية (Personal Care)', options: ['أعتني بنفسي طبيعياً دون زيادة ألم (0)', 'أعتني بنفسي طبيعياً لكن مع ألم (1)', 'العناية بنفسي بطيئة وحذرة (2)', 'أحتاج مساعدة في بعض الأمور (3)', 'أحتاج مساعدة في معظم الأمور (4)', 'لا أستطيع ارتداء ملابسي وأغسل نفسي بصعوبة (5)'] },
    { title: '3. رفع الأوزان (Lifting)', options: ['أرفع أوزاناً ثقيلة دون ألم إضافي (0)', 'أرفع أوزاناً ثقيلة ولكن مع ألم (1)', 'الألم يمنعني من رفع الأوزان الثقيلة عن الأرض (2)', 'أرفع أوزاناً خفيفة إلى متوسطة إذا وضعت بمكان ملائم (3)', 'أرفع أوزاناً خفيفة جداً فقط (4)', 'لا أستطيع رفع أي شيء إطلاقاً (5)'] },
    { title: '4. المشي (Walking)', options: ['الألم لا يمنعني من المشي لأي مسافة (0)', 'الألم يمنعني من المشي لأكثر من 1.5 كم (1)', 'الألم يمنعني من المشي لأكثر من 800 متر (2)', 'الألم يمنعني من المشي لأكثر من 400 متر (3)', 'أمشي فقط باستخدام عكاز أو عصا (4)', 'أنا طريح الفراش معظم الوقت (5)'] },
    { title: '5. الجلوس (Sitting)', options: ['أستطيع الجلوس على أي كرسي طالما أشاء (0)', 'أجلس على كرسي مريح فقط طالما أشاء (1)', 'الألم يمنعني من الجلوس لأكثر من ساعة (2)', 'الألم يمنعني من الجلوس لأكثر من 30 دقيقة (3)', 'الألم يمنعني من الجلوس لأكثر من 10 دقائق (4)', 'الألم يمنعني من الجلوس نهائياً (5)'] },
    { title: '6. الوقوف (Standing)', options: ['أستطيع الوقوف طالما أشاء دون ألم زائد (0)', 'أستطيع الوقوف طالما أشاء لكن مع ألم (1)', 'الألم يمنعني من الوقوف لأكثر من ساعة (2)', 'الألم يمنعني من الوقوف لأكثر من 30 دقيقة (3)', 'الألم يمنعني من الوقوف لأكثر من 10 دقائق (4)', 'الألم يمنعني من الوقوف نهائياً (5)'] },
    { title: '7. النوم (Sleeping)', options: ['نومي لا يضطرب أبداً بسبب الألم (0)', 'نومي يضطرب أحياناً بالألم (1)', 'بسبب الألم أنام أقل من 6 ساعات (2)', 'بسبب الألم أنام أقل من 4 ساعات (3)', 'بسبب الألم أنام أقل من ساعتين (4)', 'الألم يمنعني من النوم إطلاقاً (5)'] },
    { title: '8. الحياة الاجتماعية (Social Life)', options: ['حياتي الاجتماعية طبيعية ولا تتأثر (0)', 'حياتي الاجتماعية طبيعية لكن تزيد الألم (1)', 'الألم يمنعني من الأنشطة الحركية كالرياضة (2)', 'الألم يقلل خروجي وزياراتي الاجتماعية (3)', 'حياتي الاجتماعية محصورة بالمنزل (4)', 'ليس لدي أي حياة اجتماعية بسبب الألم (5)'] },
    { title: '9. السفر والتنقل (Traveling)', options: ['أستطيع السفر إلى أي مكان دون ألم (0)', 'أستطيع السفر لكن السفر يسبب لي ألماً (1)', 'الألم يمنع الرحلات لأكثر من ساعتين (2)', 'الألم يمنع الرحلات لأكثر من ساعة (3)', 'الألم يقيدني بالسفر للحصول على العلاج فقط (4)', 'الألم يمنعني من السفر إطلاقاً (5)'] },
    { title: '10. الوظيفة والعمل (Employment)', options: ['أعمل بشكل طبيعي دون قيود (0)', 'أعمل لكن العمل يزيد الألم (1)', 'أؤدي معظم مهام العمل لكن أتجنب الثقيل (2)', 'أستطيع القيام بمهام مكتبية خفيفة فقط (3)', 'الألم يمنعني من الاستمرار في الدوام الكامل (4)', 'عاجز عن العمل تماماً (5)'] }
  ];

  // --- DASH Calculator (Upper Limb) ---
  const [dashScores, setDashScores] = useState<number[]>([2, 1, 2, 2, 3, 2, 1, 2, 2, 1, 2]);
  const dashSum = dashScores.reduce((a, b) => a + b, 0);
  const dashDisabilityScore = Math.round(((dashSum / dashScores.length) - 1) * 25);

  // --- Berg Balance Scale (Fall Risk) ---
  const [bergScores, setBergScores] = useState<number[]>([4, 3, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 4, 3]);
  const bergTotal = bergScores.reduce((a, b) => a + b, 0); // Max 56
  const getBergCategory = (score: number) => {
    if (score >= 41) return { label: 'خطر سقوط منخفض (Low Fall Risk)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 21) return { label: 'خطر سقوط متوسط (Medium Fall Risk)', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
    return { label: 'خطر سقوط مرتفع جداً (High Fall Risk) - يلزم تحذير أحمر', color: 'text-red-700 bg-red-50 border-red-300 font-bold' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-[#075563] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Calculator className="w-6 h-6 text-[#B59B62]" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl">الحواسب الطبية الإكلينيكية (Clinical Calculators 2026)</h3>
              <p className="text-xs text-[#FAF8F1]/80 mt-0.5">
                حساب نسب العجز والتحسن الأوتوماتيكي المعترف بها دولياً في العلاج الطبيعي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-[#FAF8F1] px-4 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('Oswestry')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition whitespace-nowrap ${
              activeTab === 'Oswestry'
                ? 'bg-white text-[#075563] border-t-2 border-[#075563] shadow-xs'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            مؤشر أوزوستري لآلام الظهر (Oswestry ODI)
          </button>
          <button
            onClick={() => setActiveTab('DASH')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition whitespace-nowrap ${
              activeTab === 'DASH'
                ? 'bg-white text-[#075563] border-t-2 border-[#075563] shadow-xs'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            مقياس إعاقة الذراع والكتف (DASH Calculator)
          </button>
          <button
            onClick={() => setActiveTab('Berg')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition whitespace-nowrap ${
              activeTab === 'Berg'
                ? 'bg-white text-[#075563] border-t-2 border-[#075563] shadow-xs'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            مقياس بيرغ للتوازن وخطر السقوط (Berg Balance)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          {/* 1. Oswestry Index */}
          {activeTab === 'Oswestry' && (
            <div className="space-y-6">
              {/* Score Display Card */}
              <div className="bg-gradient-to-r from-[#FAF8F1] to-white p-4 rounded-xl border border-[#B59B62]/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500">النتيجة المحسوبة تلقائياً:</div>
                  <div className="text-2xl font-black text-[#075563]">
                    {oswestryTotal} / {oswestryMax} نقطة ({oswestryPercent}%)
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${getOswestryCategory(oswestryPercent).color}`}>
                  التصنيف: {getOswestryCategory(oswestryPercent).label}
                </div>
                {onApplyScore && (
                  <button
                    onClick={() => onApplyScore('Oswestry', oswestryPercent, getOswestryCategory(oswestryPercent).label)}
                    className="px-4 py-2 bg-[#075563] text-white text-xs font-bold rounded-lg hover:bg-[#075563]/90 transition"
                  >
                    إدراج النتيجة في ملف المريض
                  </button>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {oswestryQuestions.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <h5 className="font-bold text-xs sm:text-sm text-gray-800 mb-2">{q.title}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                            oswestryAnswers[idx] === optIdx
                              ? 'bg-[#075563]/10 border-[#075563] text-[#075563] font-bold'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`oswestry-${idx}`}
                            checked={oswestryAnswers[idx] === optIdx}
                            onChange={() => {
                              const newAns = [...oswestryAnswers];
                              newAns[idx] = optIdx;
                              setOswestryAnswers(newAns);
                            }}
                            className="accent-[#075563]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. DASH Calculator */}
          {activeTab === 'DASH' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#FAF8F1] to-white p-4 rounded-xl border border-[#B59B62]/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500">درجة عجز الطرف العلوي (DASH Score):</div>
                  <div className="text-2xl font-black text-[#075563]">
                    {dashDisabilityScore}% عجز وظيفي
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                    نسبة القدرة الحركية والتحسن: {100 - dashDisabilityScore}%
                  </div>
                </div>
                {onApplyScore && (
                  <button
                    onClick={() => onApplyScore('DASH', dashDisabilityScore, `${dashDisabilityScore}% عجز`)}
                    className="px-4 py-2 bg-[#075563] text-white text-xs font-bold rounded-lg hover:bg-[#075563]/90 transition"
                  >
                    إدراج النتيجة في ملف المريض
                  </button>
                )}
              </div>

              {/* DASH Items Sample */}
              <div className="space-y-3">
                {[
                  'فتح برطمان زجاجي محكم جديد',
                  'الكتابة بالقلم على الورق لمدة ربع ساعة',
                  'تدوير المفتاح في قفل الباب',
                  'تحضير وجبة طعام خفيفة',
                  'دفع باب ثقيل مفتوحاً باليد',
                  'وضع جسم ثقيل على رف أعلى من مستوى الرأس',
                  'أداء الأعمال المنزلية الثقيلة (مسح الأرضيات/تنظيف النوافذ)',
                  'غسيل الشعر أو الاستحمام',
                  'ارتداء سترة أو دشداشة أو عباءة محتشمة',
                  'الأنشطة الترفيهية وممارسة الرياضة اليدوية',
                  'شدة الألم في الذراع أو الكتف أو اليد أثناء أي نشاط'
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-gray-800">{i + 1}. {item}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            const newScores = [...dashScores];
                            newScores[i] = val;
                            setDashScores(newScores);
                          }}
                          className={`w-7 h-7 rounded-md font-bold text-xs transition ${
                            dashScores[i] === val
                              ? 'bg-[#075563] text-white'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Berg Balance Scale */}
          {activeTab === 'Berg' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#FAF8F1] to-white p-4 rounded-xl border border-[#B59B62]/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500">المجموع الكلي لمقياس بيرغ (Berg Total):</div>
                  <div className="text-2xl font-black text-[#075563]">
                    {bergTotal} / 56 نقطة
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold ${getBergCategory(bergTotal).color}`}>
                  {getBergCategory(bergTotal).label}
                </div>
                {onApplyScore && (
                  <button
                    onClick={() => onApplyScore('Berg', bergTotal, getBergCategory(bergTotal).label)}
                    className="px-4 py-2 bg-[#075563] text-white text-xs font-bold rounded-lg hover:bg-[#075563]/90 transition"
                  >
                    إدراج النتيجة في ملف المريض
                  </button>
                )}
              </div>

              {bergTotal < 45 && (
                <div className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-center gap-3 text-red-800 text-xs sm:text-sm">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 animate-pulse" />
                  <div>
                    <span className="font-bold">تحذير أحمر إكلينيكي (Red Flag Alert):</span> المريض يسجل أقل من 45 نقطة، مما يشير إلى خطر سقوط مرتفع أثناء الأنشطة اليومية. يوصى بإرشاد المرافق وتعديل البيئة المنزلية واستخدام مشاية داعمة فوراً.
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {[
                  { name: '1. الجلوس إلى الوقوف (Sitting to Standing)', desc: 'القدرة على النهوض دون استخدام اليدين' },
                  { name: '2. الوقوف بدون دعم لمدة دقيقتين', desc: 'الوقوف بأمان دون الاستناد' },
                  { name: '3. الجلوس بدون دعم للظهر مع استواء القدمين', desc: 'الجلوس لمدة دقيقتين بأمان' },
                  { name: '4. الوقوف إلى الجلوس (Standing to Sitting)', desc: 'الجلوس بأمان مع سيطرة حركية' },
                  { name: '5. الانتقال بين كرسي وسرير (Transfers)', desc: 'الانتقال الآمن مع أقل قدر من المساعدة' },
                  { name: '6. الوقوف بدون دعم مع إغلاق العينين 10 ثوانٍ', desc: 'اختبار الحواس والتوازن الداخلي' },
                  { name: '7. الوقوف بدون دعم مع ضم القدمين تماماً', desc: 'تضييق قاعدة الارتكاز' },
                  { name: '8. مد الذراع للأمام أثناء الوقوف (Functional Reach)', desc: 'مد اليد لأكثر من 25 سم بأمان' },
                  { name: '9. التقاط غرض من الأرض أثناء الوقوف', desc: 'الانحناء والتقاط حذاء أو غرض دون اختلال' },
                  { name: '10. الالتفات للنظر للخلف فوق الكتف الأيمن والأيسر', desc: 'دوران الرأس والجذع دون فقد الاتزان' },
                  { name: '11. الدوران 360 درجة كاملة في مكان واحد', desc: 'إتمام الدورة في أقل من 4 ثوانٍ بأمان' },
                  { name: '12. وضع القدمين بالتناوب على درج (Dynamic Stepping)', desc: 'لمس الدرجة 8 مرات بأمان' },
                  { name: '13. الوقوف بقدم أمام الأخرى (Tandem Stance)', desc: 'وضع الكعب أمام الأصابع 30 ثانية' },
                  { name: '14. الوقوف على ساق واحدة (Single Leg Stance)', desc: 'رفع ساق واحدة لأكثر من 10 ثوانٍ' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-[11px] text-gray-500">{item.desc}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((pts) => (
                        <button
                          key={pts}
                          onClick={() => {
                            const newScores = [...bergScores];
                            newScores[idx] = pts;
                            setBergScores(newScores);
                          }}
                          className={`w-7 h-7 rounded-md font-bold text-xs transition ${
                            bergScores[idx] === pts
                              ? 'bg-[#075563] text-white shadow-xs'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pts}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            معايير تقييم العلاج الطبيعي والتأهيل المعتمدة بسلطنة عمان 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
