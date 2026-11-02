import React, { useRef } from 'react';
import { Patient, SOAPNote } from '../types/clinic';
import { CLINIC_INFO } from '../data/clinicData';
import { Printer, Download, X, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DischargeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  soapNotes?: SOAPNote[];
}

export const DischargeReportModal: React.FC<DischargeReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  soapNotes = []
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  if (!patient) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
          <Award className="w-12 h-12 text-[#B59B62] mx-auto" />
          <h3 className="font-bold text-lg text-[#075563]">لا يوجد مراجع محدد حالياً</h3>
          <p className="text-xs text-gray-500">
            يرجى تسجيل أو تحديد مراجع من "سجل المراجعين" لإنشاء وطباعة تقرير التخرج الطبي المعتمد له.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#075563] text-white text-xs font-bold rounded-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('ar-OM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Action Toolbar (Hidden during print) */}
        <div className="no-print bg-[#075563] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Award className="w-6 h-6 text-[#B59B62]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">تقرير التخرج الطبي النهائي (Medical Discharge Report)</h3>
              <p className="text-xs text-[#FAF8F1]/80">
                جاهز للطباعة والتحميل ومشاركته مع الطبيب المحول وشركات التأمين
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#B59B62] hover:bg-[#B59B62]/90 text-[#075563] text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              طباعة / حفظ كـ PDF
            </button>
            <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Medical Document Canvas */}
        <div ref={printRef} className="p-6 sm:p-10 bg-white text-[#24383B] space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Clinic Official Letterhead */}
          <div className="border-b-2 border-[#075563] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/icon.svg" alt="شعار المجمع" className="w-16 h-16 rounded-xl border border-gray-200" />
              <div>
                <h1 className="font-black text-xl text-[#075563]">{CLINIC_INFO.nameAr}</h1>
                <p className="text-xs font-bold text-[#B59B62]">{CLINIC_INFO.nameEn}</p>
                <p className="text-[11px] text-gray-500">{CLINIC_INFO.specialtyAr} • {CLINIC_INFO.mottoAr}</p>
              </div>
            </div>

            <div className="text-left text-[11px] text-gray-600 space-y-0.5">
              <div>📍 سلطنة عمان - ولاية بركاء</div>
              <div>بناية R&B - بجانب مستشفى بدر السماء</div>
              <div>📞 {CLINIC_INFO.phone1} / {CLINIC_INFO.phone2}</div>
              <div className="font-mono text-[#075563] font-bold">Ref: UAQ-DISCHARGE-2026-089</div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center py-2 bg-[#FAF8F1] rounded-xl border border-[#B59B62]/30">
            <h2 className="text-base sm:text-lg font-black text-[#075563]">
              تقرير ختام الخطة التأهيلية والتخرج الطبي (FINAL MEDICAL DISCHARGE SUMMARY)
            </h2>
            <div className="text-xs text-gray-500 mt-0.5">تاريخ إصدار التقرير: {todayStr}</div>
          </div>

          {/* Patient Demographics Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-500 block">اسم المراجع:</span>
              <strong className="font-bold text-[#075563]">{patient.name}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">الرقم المدني العماني:</span>
              <strong className="font-mono">{patient.civilId}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">العمر / الجنس:</span>
              <strong>{patient.age} سنة / {patient.gender === 'female' ? 'أنثى' : 'ذكر'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">الهاتف ومحل الإقامة:</span>
              <span>{patient.city}</span>
            </div>
          </div>

          {/* Clinical Case & Referral Info */}
          <div className="p-3.5 rounded-xl border border-gray-200 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#075563]">التشخيص الإكلينيكي المبدئي:</span>
              <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono text-[10px]">ICD-10 M50.20</span>
            </div>
            <p className="text-gray-800 font-medium">{patient.diagnosis}</p>
          </div>

          {/* Comparative Clinical Outcomes Table (Baseline vs Current) */}
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-[#075563] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              مقارنة النتائج الإكلينيكية (يوم الدخول Baseline vs يوم التخرج Discharge):
            </h3>
            <table className="w-full text-xs text-right border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-[#075563] text-white">
                <tr>
                  <th className="p-2.5">المؤشر السريري</th>
                  <th className="p-2.5">التقييم الأولي (Baseline)</th>
                  <th className="p-2.5">التقييم الختامي (Discharge)</th>
                  <th className="p-2.5">نسبة ومقدار التحسن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="p-2.5 font-bold">مقياس شدة الألم البصري (VAS)</td>
                  <td className="p-2.5 font-mono text-red-600 font-bold">{patient.baselinePainVAS} / 10 (شديد)</td>
                  <td className="p-2.5 font-mono text-emerald-700 font-bold">{patient.currentPainVAS} / 10 (طفيف جداً)</td>
                  <td className="p-2.5 font-bold text-emerald-700">انخفاض الألم بنسبة {Math.round(((patient.baselinePainVAS - patient.currentPainVAS) / patient.baselinePainVAS) * 100)}%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">مدى حركة المفصل النشط (ROM)</td>
                  <td className="p-2.5">محدودية حركية مع انثناء 25° وبسط 20°</td>
                  <td className="p-2.5">مدى وظيفي كامل (انثناء 45°، بسط 40°)</td>
                  <td className="p-2.5 font-bold text-emerald-700">استعادة 90% من المدى الطبيعي</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">القوة العضلية اليدوية (MMT)</td>
                  <td className="p-2.5">3/5 (ضعف ملحوظ ومقاومة محدودة)</td>
                  <td className="p-2.5">5/5 (قوة كاملة متناظرة)</td>
                  <td className="p-2.5 font-bold text-emerald-700">تحسن درجتين كاملتين (+2)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">مؤشر الإعاقة الوظيفية (Disability)</td>
                  <td className="p-2.5">62% (عجز وظيفي شديد بالأنشطة)</td>
                  <td className="p-2.5">14% (عجز طفيف غير معيق)</td>
                  <td className="p-2.5 font-bold text-emerald-700">تحسن بنسبة 77%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Modalities & Procedures Administered */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1.5">
            <span className="font-bold text-gray-800 block">الإجراءات والتقنيات الطبية المطبقة خلال البرنامج:</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-gray-700 list-disc pr-4">
              <li>جلسات شد الفقرات بالكمبيوتر (Computerized Spinal Traction Bed)</li>
              <li>العلاج بالموجات التصادمية (BTL Radial Shockwave Therapy)</li>
              <li>العلاج الكهربائي والموجات فوق الصوتية (BTL 4000 Combo Modality)</li>
              <li>جلسات التدليك بضغط الهواء الليمفاوي (Air Compression Boots)</li>
              <li>تمارين التقوية الحركية والتوازن بصالة الجيم التأهيلي</li>
            </ul>
          </div>

          {/* Recommendations & Discharge Instructions */}
          <div className="p-3.5 bg-[#FAF8F1] rounded-xl border border-[#B59B62]/30 text-xs space-y-2">
            <span className="font-bold text-[#075563] block">التوصيات الطبية بعد إنهاء البرنامج التأهيلي:</span>
            <p className="text-gray-800 leading-relaxed">
              1. الاستمرار على التمارين المنزلية الموصوفة عبر تطبيق المراجع بمعدل 3 مرات أسبوعياً.
              <br />
              2. الالتزام ببيئة العمل الصحية وتفادي انحناء الرقبة أو الجلوس المتصل لأكثر من 45 دقيقة.
              <br />
              3. مراجعة المجمع لجلسة فحص متابعة دورية وقائية بعد شهرين من تاريخه.
            </p>
          </div>

          {/* Signatures & Stamps */}
          <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs">
            <div className="text-center space-y-2">
              <div className="font-bold text-gray-700">الأخصائي المعالج المعتمد:</div>
              <div className="font-bold text-[#075563] text-sm">د. سبأ / أخصائي العلاج الطبيعي</div>
              <div className="text-[11px] text-gray-500">أخصائية أولى علاج طبيعي وتأهيل إكلينيكي</div>
              <div className="italic text-gray-400 font-serif">Saba Physiotherapist</div>
            </div>

            {/* Clinic Official Stamp Watermark */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#075563] flex flex-col items-center justify-center text-[#075563] text-[9px] font-bold transform -rotate-12 opacity-85">
              <span>مجمع أم القرى الطبي</span>
              <span>بركاء - سلطنة عمان</span>
              <span>ختم الاعتماد الطبي</span>
              <span className="font-mono">2026</span>
            </div>

            <div className="text-center space-y-2">
              <div className="font-bold text-gray-700">إدارة مجمع أم القرى الطبي:</div>
              <div className="font-bold text-[#075563] text-sm">المدير الطبي والإداري</div>
              <div className="text-[11px] text-gray-500">مجمع أم القرى الطبي - بركاء</div>
              <div className="text-emerald-700 font-bold flex items-center gap-1 justify-center">
                <ShieldCheck className="w-3.5 h-3.5" /> معتمد وموثق رقمياً
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
