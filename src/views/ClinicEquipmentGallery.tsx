import React from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { ShieldCheck, Cpu, HeartPulse, Check, Info } from 'lucide-react';

export const ClinicEquipmentGallery: React.FC = () => {
  const equipmentItems = [
    {
      title: 'سرير شد الفقرات العنقية والقطنية المحوسب',
      titleEn: 'Computerized Spinal Decompression & Traction Bed',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.54_PM__3__977570fa.jpeg',
      description: 'سرير متطور مجهز بوحدة تحكم كمبيوتر وطباعة رقمية لضبط شد الفقرات العنقية والقطنية بالجرام مع أحزمة تثبيت متدرجة ومساند زاوية للركبتين والحوض.',
      indications: 'الانزلاق الغضروفي، الديسك، عرق النسا، تضيق القناة الفقرية، خشونة فقرات الرقبة والظهر.',
      specs: 'شاشة تحكم إلكترونية • قوة سحب حتى 90 كجم • زوايا سحب قابلة للتعديل من 0 إلى 30 درجة.'
    },
    {
      title: 'جهاز الموجات التصادمية الحديث BTL',
      titleEn: 'BTL Radial Shockwave Therapy System',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.55_PM__1__39013166.jpeg',
      description: 'أحدث تقنيات الموجات الصوتية التصادمية لتفتيت التكلسات، وتحفيز إعادة بناء الأنسجة والأوتار، وتخفيف التشنجات العضلية المزمنة وتسريع الشفاء.',
      indications: 'شوكة العظم بالقدم (Plantar Fasciitis)، التهاب وتر أخيل، تكلسات الكتف، كوع التنس، خشونة الركبة.',
      specs: 'تردد 1-20 هرتز • ضغط حتى 5 بار • عداد ضربات رقمي • بروتوكولات مبرمجة سلفاً.'
    },
    {
      title: 'جهاز العلاج الكهربائي والموجات فوق الصوتية BTL 4000',
      titleEn: 'BTL 4000 Combined Electrotherapy & Ultrasound',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.57_PM_b31e37c1.jpeg',
      description: 'جهاز مزدوج رائد عالمياً يجمع بين التيارات الكهربائية المسكنة والمحفزة (TENS/Interferential/Russian) ومسبار الموجات فوق الصوتية برأس مضيء 1 و 3 ميجاهرتز.',
      indications: 'تسكين الألم الحاد والمزمن، التورم بعد العمليات، إعادة تأهيل العضلات، تسريع التئام الأوتار.',
      specs: 'شاشة لمس ملونة • قناتين كهربائيتين مستقلتين • مسبار موجات فوق صوتية متعدد الترددات.'
    },
    {
      title: 'جهاز التدليك وأحذية الضغط الليمفاوي الهوائي',
      titleEn: 'Pneumatic Air Compression Boots & Cuffs',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.55_PM__4__3ccc8480.jpeg',
      description: 'أكمام وأحذية ضغط هوائي متسلسل لتنشيط الدورة الدموية، وتصريف التورمات الليمفاوية، وتسريع الاستشفاء الرياضي بعد الجهد الشاق والعمليات الجراحية.',
      indications: 'تورم الساقين، الوذمة الليمفاوية، تأهيل ما بعد جراحة الرباط الصليبي والكسور، تنشيط الدورة الدموية.',
      specs: 'مضخة هواء ذكية متعددة الغرف • تحكم دقيق في الضغط من 20 إلى 200 mmHg • أكمام للساقين والذراعين والخصر.'
    },
    {
      title: 'صالة التأهيل الرياضي والجيم الطبي الحركي',
      titleEn: 'Medical Rehabilitation Gym & Parallel Bars',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.58_PM_4f83512b.jpeg',
      description: 'صالة تأهيلية متكاملة تضم متوازي المشي الطبي، دراجات التأهيل الحركي، أجهزة المقاومة والأثقال الحركية، كرات التوازن، وألواح الثبات الحركي.',
      indications: 'تأهيل الرياضيين والعودة للملاعب (RTP)، تأهيل كبار السن، تدريب التوازن ومنع السقوط، إعادة اكتساب المشي.',
      specs: 'أرضيات ماصة للصدمات • متوازي مشي من الستانلس ستيل • مرايا فحص القوام • بكرات مقاومة متدرجة.'
    },
    {
      title: 'أجنحة وغرف العلاج السريري الخاص',
      titleEn: 'Private Treatment Bays with BTL Equipment',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.56_PM__1__82ba14c8.jpeg',
      description: 'غرف علاجية مجهزة بأسرة طبية مريحة وأنظمة تعقيم عالي، مخصصة لتقديم جلسات العلاج اليدوي والموجات التصادمية في خصوصية وسكينة تامة.',
      indications: 'جلسات العلاج الفردية المتخصصة تحت إشراف د. سبأ للمريضات والأخصائي للمرضى الذكور.',
      specs: 'أسرة طبية هيدروليكية • وحدات أجهزة متنقلة • ستائر خصوصية عازلة • تجهيزات أمان وسلامة.'
    },
    {
      title: 'المدخل الرئيسي لمجمع أم القرى الطبي',
      titleEn: 'Um Alqura Polyclinic Main Entrance - Office 3',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.55_PM__2__5715f662.jpeg',
      description: 'أبواب زجاجية رسمية بشعار مجمع أم القرى الطبي - إشراف الإدارة العامة، بناية R&B - ولاية بركاء بجوار مستشفى بدر السماء.',
      indications: 'سهولة الوصول ومصاعد مهيأة لذوي الإعاقة وكبار السن.',
      specs: 'بناية R&B • مواقف سيارات واسعة • تجهيزات مطابقة لمواصفات وزارة الصحة العمانية.'
    },
    {
      title: 'صالة الاستقبال والانتظار العمانية الأصيلة',
      titleEn: 'Reception & Patient Care Waiting Lounge',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-25_at_3.16.57_PM__2__32373791.jpeg',
      description: 'صالة استقبال حديثة بتشطيب رخامي فاخر، ومزينة بصور السلاطين، تقدم بيئة هادئة ومريحة للمراجعين وموظفة استقبال لتنظيم المواعيد والتأمين.',
      indications: 'استقبال المراجعين وتسجيل المواعيد خماسية الأبعاد وتأكيد الحضور.',
      specs: 'نظام نداء إلكتروني • مقاعد انتظار مريحة • خدمة استفسارات واتساب فورية.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
            <Cpu className="w-5 h-5" />
          </span>
          <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
            معرض التجهيزات والأجهزة الطبية الحقيقية بمجمع أم القرى الطبي - بركاء 2026
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          صور حقيقية وموثقة من داخل مجمع أم القرى الطبي بسلطنة عمان - استعراض المواصفات التقنية والمؤشرات العلاجية
        </p>
      </div>

      {/* Grid of Real Photos with Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {equipmentItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#075563]/15 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-[#075563]/90 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  مجمع أم القرى الطبي - بركاء
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 text-xs">
                <div>
                  <h3 className="font-black text-base text-[#075563]">{item.title}</h3>
                  <div className="text-[11px] text-[#B59B62] font-semibold font-sans mt-0.5">{item.titleEn}</div>
                </div>

                <p className="text-gray-700 leading-relaxed font-medium">{item.description}</p>

                <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#B59B62]/25 space-y-1">
                  <span className="font-bold text-[#075563] block">دواعي الاستخدام العلاجي:</span>
                  <p className="text-gray-600 text-[11px]">{item.indications}</p>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#2A9DA5] flex-shrink-0" />
                  <span>{item.specs}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> جاهز للتشغيل السريري
              </span>
              <span>تحديث 2026</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
