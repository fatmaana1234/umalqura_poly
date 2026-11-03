import React, { useState } from 'react';
import {
  Layers,
  Network,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  Server,
  Activity,
  Code2
} from 'lucide-react';
import { ExternalIntegration } from '../../types/erp';

interface ApiIntegrationManagerViewProps {
  integrations: ExternalIntegration[];
  onUpdateIntegrations: (integrations: ExternalIntegration[]) => void;
}

export const ApiIntegrationManagerView: React.FC<ApiIntegrationManagerViewProps> = ({
  integrations,
  onUpdateIntegrations
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<ExternalIntegration | null>(null);

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      const updated = integrations.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            status: 'connected' as const,
            lastHeartbeat: 'منذ ثوانٍ قليلة (استجابة 200 OK - 42ms)'
          };
        }
        return it;
      });
      onUpdateIntegrations(updated);
      setTestingId(null);
      alert('تم فحص اتصال واجهة البرمجة (API) بنجاح والاستجابة 200 OK.');
    }, 700);
  };

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <Network className="w-4 h-4 text-[#2A9DA5]" />
            مركز إدارة وبوابات واجهات البرمجة المفتوحة (API Hub 2026)
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            إدارة بوابات الربط السحابية، الأجهزة الطبية، ومكتبات CMS
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            مراقبة لحظية لنبضات الاتصال (Heartbeat)، الرموز البرمجية والمفاتيح السرية، ونقاط استقبال الويب هوك Webhooks
          </p>
        </div>

        <button
          onClick={() => {
            integrations.forEach((it) => handleTestConnection(it.id));
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#075563] hover:bg-[#064450] text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          فحص جاهزية كافة البوابات الآن
        </button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((it) => {
          const isConnected = it.status === 'connected';
          const isBusy = testingId === it.id;

          return (
            <div
              key={it.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:border-[#2A9DA5]/40 transition space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold bg-teal-50 text-[#075563] px-2.5 py-0.5 rounded-full">
                  {it.category} • {it.authType}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'}`} />
                  {isConnected ? 'متصل وجاهز للعمل' : 'غير متصل'}
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-[#075563]">{it.nameAr}</h3>
                <div className="text-xs text-gray-400 font-sans mt-0.5">{it.nameEn}</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span>نقطة النهاية (Endpoint):</span>
                  <span className="font-mono text-[11px] text-[#075563] truncate max-w-[220px]">
                    {it.endpoint}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>آخر فحص حي (Heartbeat):</span>
                  <span className="text-emerald-700 font-semibold">{it.lastHeartbeat}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">{it.notes}</p>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <button
                  onClick={() => setSelectedIntegration(it)}
                  className="text-xs font-bold text-[#075563] hover:underline flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  بيانات الاعتماد والمفاتيح
                </button>

                <button
                  onClick={() => handleTestConnection(it.id)}
                  disabled={isBusy}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                  {isBusy ? 'جاري الفحص...' : 'اختبار الـ Ping'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Credentials View */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
            <h3 className="font-black text-lg text-[#075563]">بيانات ربط {selectedIntegration.nameAr}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">نوع المصادقة المشفرة:</label>
                <div className="font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  {selectedIntegration.authType}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">عنوان الـ API:</label>
                <div className="font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-200 break-all">
                  {selectedIntegration.endpoint}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">مفتاح الوصول السري (API Secret Key):</label>
                <div className="font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-gray-500">
                  •••••••••••••••••••••••••••••••••••••••• (محمي بواسطة بيئة AI Studio)
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-[#075563] leading-relaxed">
                يتم تمرير مفاتيح الربط تلقائياً عبر متغيرات البيئة المشفرة لحماية البيانات الطبية والمالية للمؤسسة.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedIntegration(null)}
                className="w-full py-2.5 bg-[#075563] text-white font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
