import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Cpu,
  Bot,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Warehouse, InventoryItem, ProductionOrder, SalesInvoice, BiometricTerminal } from '../types/erp';
import { Appointment, Patient } from '../types/clinic';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  productionOrders: ProductionOrder[];
  salesInvoices: SalesInvoice[];
  terminals: BiometricTerminal[];
  appointments: Appointment[];
  patients: Patient[];
  onNavigateTab?: (tab: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  warehouses,
  inventory,
  productionOrders,
  salesInvoices,
  terminals,
  appointments,
  patients,
  onNavigateTab
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState<string>(
    'مرحباً بك في منظومة أم القرى المتكاملة 2026. يمكنك سؤالي صوتياً عن أرصدة المستودعات، أوامر الإنتاج، الإيرادات وضريبة الـ 5%، أو حضور الموظفين.'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Synthesis & Recognition
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const processQuery = (rawText: string) => {
    const text = rawText.toLowerCase();
    let reply = '';

    if (text.includes('مخزن') || text.includes('مواد خام') || text.includes('مستودع')) {
      const rawWh = warehouses.find((w) => w.id === 'raw_materials');
      const lowCount = inventory.filter((i) => i.quantity <= i.minReorderLevel).length;
      reply = `رصيد مستودع المواد الخام يبلغ ${rawWh?.totalValuationOMR.toLocaleString()} ريال عماني، ويحتوي على ${rawWh?.totalItemsCount} أصناف نشطة. يوجد حالياً ${lowCount} أصناف قاربت الحد الأدنى لإعادة الطلب.`;
      if (onNavigateTab) onNavigateTab('erp_warehouses');
    } else if (text.includes('إنتاج') || text.includes('تصنيع') || text.includes('أوامر')) {
      const inProg = productionOrders.filter((po) => po.status === 'in_progress');
      reply = `يوجد حالياً ${inProg.length} أوامر إنتاج قيد التشغيل في خطوط المصنع، وأبرزها تصنيع أحزمة دعم الفقرات القطنية وأطقم سحب الرقبة.`;
      if (onNavigateTab) onNavigateTab('erp_manufacturing');
    } else if (text.includes('مبيعات') || text.includes('ضريبة') || text.includes('فاتورة') || text.includes('vat')) {
      const totalSales = salesInvoices.reduce((acc, inv) => acc + inv.totalOMR, 0);
      const totalVat = salesInvoices.reduce((acc, inv) => acc + inv.taxOMR, 0);
      reply = `إجمالي مبيعات المصنع المسجلة يبلغ ${totalSales.toFixed(2)} ريال عماني، منها ${totalVat.toFixed(2)} ريال عماني ضريبة قيمة مضافة 5% مستحقة لجهاز الضرائب العماني.`;
      if (onNavigateTab) onNavigateTab('erp_sales_purchases');
    } else if (text.includes('بصمة') || text.includes('حضور') || text.includes('دوام') || text.includes('موظف')) {
      const onlineTerms = terminals.filter((t) => t.status === 'online').length;
      reply = `أجهزة البصمة البيومترية ZKTeco متصلة وتعمل بكفاءة بنسبة مئة بالمئة (${onlineTerms} أجهزة نشطة)، وجميع حركات الدخول والخروج موثقة لحظياً.`;
      if (onNavigateTab) onNavigateTab('erp_biometrics');
    } else if (text.includes('مجمع') || text.includes('مرضى') || text.includes('مواعيد') || text.includes('عيادة')) {
      reply = `مجمع أم القرى الطبي يضم حالياً ${patients.length} مراجع مسجل و${appointments.length} جلسات مجدولة مع د. سبأ البلوشية وأخصائيي التأهيل.`;
      if (onNavigateTab) onNavigateTab('appointments');
    } else {
      reply = `فهمت طلبك: "${rawText}". النظام جاهز ويمكنك الاطلاع على كافة التفاصيل في لوحة الإدارة التنفيذية.`;
    }

    setAssistantReply(reply);
    speakText(reply);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('المتصفح لا يدعم التسجيل الصوتي المباشر. يمكنك استخدام الأسئلة الجاهزة الموضحة أدناه.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('جاري الاستماع لصوتك...');
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        processQuery(spoken);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('تعذر التقاط الصوت، يمكنك النقر على الأوامر الجاهزة.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs dir-rtl text-right">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-5 left-5 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#075563] to-[#2A9DA5] text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg text-[#075563]">المساعد الصوتي التنفيذي الذكي 2026</h3>
            <p className="text-xs text-gray-400">استجابة فورية للأوامر الصوتية وتحليل بيانات ERP والمجمع</p>
          </div>
        </div>

        {/* Interactive Mic Center */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition shadow-xl relative ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200'
                : 'bg-gradient-to-tr from-[#075563] to-[#2A9DA5] text-white hover:scale-105'
            }`}
          >
            {isListening ? <Mic className="w-10 h-10" /> : <MicOff className="w-10 h-10" />}
          </button>
          <div className="text-xs font-bold text-gray-600 text-center">
            {isListening ? 'جاري الاستماع... تحدث الآن' : 'انقر على المايك لبدء التحدث'}
          </div>
          {transcript && (
            <div className="text-xs font-mono text-[#075563] bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
              "{transcript}"
            </div>
          )}
        </div>

        {/* Assistant Reply Card */}
        <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#075563]/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#075563]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              الرد المباشر للمساعد:
            </span>
            {isSpeaking && (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                جاري التحدث...
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">{assistantReply}</p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-gray-400">أوامر صوتية سريعة للتجربة الفورية:</div>
          <div className="flex flex-wrap gap-2">
            {[
              'كم رصيد مخزن المواد الخام؟',
              'ما هي أوامر الإنتاج النشطة؟',
              'كم إجمالي المبيعات مع ضريبة VAT 5%؟',
              'تحقق من حضور اليوم عبر البصمة',
              'حالة مواعيد مجمع أم القرى الطبي'
            ].map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(cmd);
                  processQuery(cmd);
                }}
                className="text-[11px] px-3 py-1.5 bg-gray-50 hover:bg-teal-50 hover:text-[#075563] border border-gray-200 rounded-xl font-medium transition text-right"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
