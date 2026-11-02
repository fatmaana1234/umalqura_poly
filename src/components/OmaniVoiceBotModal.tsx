import React, { useState } from 'react';
import { PhoneCall, PhoneOff, Check, X, MessageSquare, UserCheck, AlertCircle, Sparkles, Send } from 'lucide-react';

interface OmaniVoiceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSlotReassigned?: (cancelledPatient: string, newPatient: string, time: string) => void;
}

export const OmaniVoiceBotModal: React.FC<OmaniVoiceBotModalProps> = ({
  isOpen,
  onClose,
  onSlotReassigned
}) => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'confirmed' | 'cancelled_shifted'>('idle');
  const [whatsappSent, setWhatsappSent] = useState(false);

  if (!isOpen) return null;

  // Authentic Omani dialect script
  const omaniScript = `يا هلا ومرحباً بيك أخي سعيد، مساك الله بالخير والسرور. نكلّمك من مجمع أم القرى الطبي في بركاء بخصوص موعد جلسة العلاج الطبيعي والتأهيل اليوم الساعة 10:30 صباحاً مع الأخصائي بجناح الموجات التصادمية. هل تحب نثبّت موعدك، أو حاب تعتذر عنه لظرف طارئ؟`;

  const handleStartCall = () => {
    setCallState('calling');
    setTimeout(() => {
      setCallState('connected');
    }, 1500);
  };

  const handleConfirmAttendance = () => {
    setCallState('confirmed');
  };

  const handleCancelAndShiftWaitlist = () => {
    setCallState('cancelled_shifted');
    if (onSlotReassigned) {
      onSlotReassigned('سعيد بن ناصر المعمري', 'خالد بن ناصر السعدي (قائمة الانتظار)', '10:30 صباحاً');
    }
  };

  const handleSendWhatsAppNotification = () => {
    setWhatsappSent(true);
    const message = encodeURIComponent(
      `السلام عليكم أخي خالد السعدي، مجمع أم القرى الطبي في بركاء يحييكم. توفر لك شاغر فوري لجلسة العلاج الطبيعي اليوم الساعة 10:30 ص إثر اعتذار مراجع. لتأكيد الحجز يرجى الرد برقم (1) أو التواصل على 79470050. صحتك أولويتنا.`
    );
    window.open(`https://wa.me/96879470050?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#075563] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <PhoneCall className="w-6 h-6 text-[#B59B62]" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl">
                المساعد الصوتي العُماني الذكي لإدارة قائمة الانتظار
              </h3>
              <p className="text-xs text-[#FAF8F1]/80 mt-0.5">
                AI Voice Bot باللهجة العمانية الترحيبية لأتمتة تأكيد المواعيد ونقل الشاغر للانتظار
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Flow Workspace */}
        <div className="p-4 sm:p-6 space-y-6">
          {callState === 'idle' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#FAF8F1] border-2 border-[#B59B62] flex items-center justify-center mx-auto text-[#075563] shadow-md">
                <PhoneCall className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-base text-gray-800">
                  بدء مكالمة آلية مع المراجع لتأكيد موعده اليوم
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  المراجع: <strong>سعيد بن ناصر المعمري</strong> (+968 92345678)
                  <br />
                  الموعد: اليوم 10:30 ص | جلسة موجات تصادمية BTL
                </p>
              </div>
              <button
                onClick={handleStartCall}
                className="px-6 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2 mx-auto"
              >
                <PhoneCall className="w-4 h-4 text-[#B59B62]" />
                إجراء الاتصال الذكي باللهجة العمانية
              </button>
            </div>
          )}

          {callState === 'calling' && (
            <div className="text-center py-8 space-y-3">
              <div className="w-20 h-20 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mx-auto animate-bounce">
                <PhoneCall className="w-10 h-10" />
              </div>
              <div className="font-bold text-sm text-gray-700">جاري الاتصال بالرقم +968 92345678...</div>
              <div className="text-xs text-gray-400">نظام الربط الهاتفي السحابي مجمع أم القرى بركاء</div>
            </div>
          )}

          {callState === 'connected' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#FAF8F1] to-white rounded-xl border border-[#B59B62]/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#075563] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#B59B62]" />
                    صوت الروبوت الذكي (باللهجة العمانية):
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                    المكالمة متصلة 00:14
                  </span>
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-gray-200">
                  "{omaniScript}"
                </p>
              </div>

              {/* Simulation of patient response */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-700">اختر محاكاة استجابة المريض:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleConfirmAttendance}
                    className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition flex items-center gap-2 justify-center"
                  >
                    <Check className="w-4 h-4 text-emerald-700" />
                    المريض: "نعم أكيد حاضر بالموعد إن شاء الله"
                  </button>

                  <button
                    onClick={handleCancelAndShiftWaitlist}
                    className="p-3.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold transition flex items-center gap-2 justify-center"
                  >
                    <PhoneOff className="w-4 h-4 text-red-700" />
                    المريض: "أعتذر منكم عندي ظرف طارئ وما أقدر أجي"
                  </button>
                </div>
              </div>
            </div>
          )}

          {callState === 'confirmed' && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-emerald-900">تم تأكيد حضور المريض بنجاح</h4>
              <p className="text-xs text-emerald-800">
                قام الروبوت الذكي بتسجيل تأكيد الحضور في قاعدة بيانات النظام وحجز السرير والجهاز دون أي تدخل يدوي من موظفة الاستقبال.
              </p>
            </div>
          )}

          {callState === 'cancelled_shifted' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>اعتذر المريض عن الموعد - تم تفعيل نظام التقديم التلقائي لقائمة الانتظار:</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  تم إلغاء الموعد وتحرير موارد الجلسة (السرير 3 + جهاز Shockwave BTL).
                  تم اختيار المريض التالي فوراً في قائمة الانتظار:
                  <br />
                  <strong className="text-[#075563]">خالد بن ناصر السعدي</strong> (+968 91992200) - المسجل على قائمة الانتظار منذ 3 أيام.
                </p>
              </div>

              {/* WhatsApp Auto Offer */}
              <div className="p-4 bg-white rounded-xl border border-[#2A9DA5]/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#075563] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    رسالة WhatsApp التلقائية للمريض البديل:
                  </span>
                  {whatsappSent && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      تم الإرسال عبر WhatsApp Cloud API
                    </span>
                  )}
                </div>

                <div className="text-xs bg-[#FAF8F1] p-3 rounded-lg border border-gray-200 text-gray-800 font-sans">
                  "السلام عليكم ورحمة الله أخي خالد السعدي، مجمع أم القرى الطبي في بركاء يحييكم. توفر لك شاغر فوري لجلسة العلاج الطبيعي والتأهيل اليوم الساعة 10:30 صباحاً. لتأكيد الحجز فوراً اضغط الرابط أو رد برقم 1. صحتك أولويتنا."
                </div>

                <button
                  onClick={handleSendWhatsAppNotification}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  إرسال العرض للشاغر عبر WhatsApp الآن (+968 79470050)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            أرقام المجمع المعتمدة للاتصال والواتساب: +968 79470050 / +968 94545025
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
