import React, { useState } from 'react';
import {
  Fingerprint,
  Cpu,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Play
} from 'lucide-react';
import { BiometricTerminal, BiometricLog, Employee } from '../../types/erp';
import { ERPEngine } from '../../services/erpEngine';

interface BiometricIntegrationViewProps {
  terminals: BiometricTerminal[];
  logs: BiometricLog[];
  employees: Employee[];
  onAddLog: (log: BiometricLog) => void;
  onUpdateTerminals: (terminals: BiometricTerminal[]) => void;
}

export const BiometricIntegrationView: React.FC<BiometricIntegrationViewProps> = ({
  terminals,
  logs,
  employees,
  onAddLog,
  onUpdateTerminals
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [punchType, setPunchType] = useState<'IN' | 'OUT'>('IN');
  const [punchMethod, setPunchMethod] = useState<'fingerprint' | 'face' | 'card'>('fingerprint');

  const handleSimulatePunch = () => {
    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    const newLog = ERPEngine.createBiometricPunch(emp, punchType, '192.168.1.201', punchMethod);
    onAddLog(newLog);
    alert(
      `تم استلام نبضة البصمة الحية بنجاح:\nالموظف: ${emp.nameAr}\nالنوع: ${
        punchType === 'IN' ? 'تسجيل دخول (IN)' : 'تسجيل انصراف (OUT)'
      }\nطريقة التحقق: ${punchMethod}\nالجهاز: ZKTeco SilkBio-101TC Pro`
    );
  };

  const handlePingSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const updated = terminals.map((term) => ({
        ...term,
        lastPing: 'منذ ثوانٍ قليلة (Latency: 12ms)',
        status: 'online' as const
      }));
      onUpdateTerminals(updated);
      setIsSyncing(false);
      alert('تم الاتصال بجميع أجهزة البصمة البيومترية بنجاح عبر بروتوكول ZKTeco Bridge.');
    }, 800);
  };

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <Fingerprint className="w-4 h-4 text-[#2A9DA5]" />
            منظومة أجهزة البصمة والتحقق البيومتري (ZKTeco Biometrics API)
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            ربط أجهزة الحضور والانصراف، بصمة الوجه، وتسجيل الدوام اللحظي
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            دعم كامل لبروتوكولات ZK-Push SDK، REST Webhook، وبوابات الدخول الأمنية في المصنع ومجمع أم القرى الطبي
          </p>
        </div>

        <button
          onClick={handlePingSyncAll}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#075563] hover:bg-[#064450] text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'جاري فحص الاتصال...' : 'مزامنة واختبار الاتصال بالأجهزة'}
        </button>
      </div>

      {/* Terminals Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {terminals.map((term) => {
          const isOnline = term.status === 'online';
          return (
            <div key={term.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold bg-teal-50 text-[#075563] px-2.5 py-0.5 rounded-full">
                  {term.protocol}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {isOnline ? 'متصل بالشبكة' : 'غير متصل'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#075563]">{term.name}</h4>
                <div className="text-xs text-gray-400 mt-0.5">{term.location}</div>
              </div>

              <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">عنوان IP والمنفذ:</span>
                  <span className="font-mono">{term.ipAddress}:{term.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">آخر إشارة حية (Ping):</span>
                  <span className="text-emerald-700 font-semibold">{term.lastPing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">إجمالي الحركات المخزنة:</span>
                  <span className="font-mono font-bold text-gray-800">{term.recordsCount.toLocaleString()} حركة</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Punch Simulator & Bridge Testing */}
      <div className="bg-[#FAF8F1] rounded-3xl p-6 border border-[#075563]/15 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-[#075563]" />
          <div>
            <h3 className="font-bold text-base text-[#075563]">محاكي تسجيل البصمة اللحظية (Live Biometric Webhook)</h3>
            <p className="text-xs text-gray-500">
              اختبار استقبال نبضات الحضور والانصراف من أجهزة البصمة وتأثيرها المباشر على كشف العمل الإضافي
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-200 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">اختر الموظف:</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nameAr} ({e.biometricId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">نوع الحركة:</label>
            <select
              value={punchType}
              onChange={(e) => setPunchType(e.target.value as any)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <option value="IN">تسجيل حضور / دخول (IN)</option>
              <option value="OUT">تسجيل انصراف / خروج (OUT)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">طريقة التحقق:</label>
            <select
              value={punchMethod}
              onChange={(e) => setPunchMethod(e.target.value as any)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <option value="fingerprint">بصمة الإصبع الحيوية</option>
              <option value="face">التعرف على الوجه ثلاثي الأبعاد</option>
              <option value="card">البطاقة الذكية RFID</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulatePunch}
              className="w-full py-2 bg-[#075563] hover:bg-[#064450] text-white font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <Fingerprint className="w-4 h-4" />
              تسجيل نبضة بصمة حية
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-sm text-[#075563] flex items-center justify-between">
          <span>سجل نبضات الحضور البيومترية المستلمة</span>
          <span className="text-xs text-gray-400 font-normal">{logs.length} حركات مسجلة</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF8F1] text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3.5">وقت وتاريخ الحركة</th>
                <th className="p-3.5">اسم الموظف</th>
                <th className="p-3.5">معرف البصمة (Bio ID)</th>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">طريقة التحقق</th>
                <th className="p-3.5">عنوان IP للجهاز</th>
                <th className="p-3.5">موديل الطرفية</th>
                <th className="p-3.5">حالة المطابقة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="p-3.5 font-mono text-gray-600">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-gray-800">{log.employeeName}</td>
                  <td className="p-3.5 font-mono text-[#075563] font-bold">{log.biometricId}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.type === 'IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.type === 'IN' ? 'دخول IN' : 'خروج OUT'}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-600">
                    {log.method === 'fingerprint'
                      ? 'بصمة الإصبع'
                      : log.method === 'face'
                      ? 'بصمة الوجه'
                      : 'بطاقة ممغنطة'}
                  </td>
                  <td className="p-3.5 font-mono text-gray-500">{log.terminalIp}</td>
                  <td className="p-3.5 text-gray-500">{log.deviceModel}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      مطابق وموثق
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
