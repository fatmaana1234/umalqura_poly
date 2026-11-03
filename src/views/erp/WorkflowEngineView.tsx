import React, { useState } from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Settings2,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { WorkflowRule } from '../../types/erp';

interface WorkflowEngineViewProps {
  rules: WorkflowRule[];
  onUpdateRules: (rules: WorkflowRule[]) => void;
}

export const WorkflowEngineView: React.FC<WorkflowEngineViewProps> = ({
  rules,
  onUpdateRules
}) => {
  const [triggeringId, setTriggeringId] = useState<string | null>(null);

  const handleToggleRule = (id: string) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onUpdateRules(updated);
  };

  const handleManualTrigger = (rule: WorkflowRule) => {
    setTriggeringId(rule.id);
    setTimeout(() => {
      const now = new Date().toISOString().substring(0, 10);
      const updated = rules.map((r) =>
        r.id === rule.id
          ? {
              ...r,
              executionsCount: r.executionsCount + 1,
              lastExecuted: now
            }
          : r
      );
      onUpdateRules(updated);
      setTriggeringId(null);
      alert(`تم تشغيل قاعدة الأتمتة بنجاح:\n"${rule.nameAr}"\nالإجراء المنفذ: ${rule.actionAr}`);
    }, 600);
  };

  return (
    <div className="space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#075563]">
            <Zap className="w-4 h-4 text-[#2A9DA5]" />
            محرك الأتمتة وسير العمليات المؤسسي (Automation Engine 2026)
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#075563] mt-1">
            قواعد الأتمتة اللحظية والتحكم التلقائي بالعمليات
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            خصم تلقائي للمواد، توليد مسودات أوامر الشراء عند قرب النفاذ، واحتساب إضافي العمل دون تدخل يدوي
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4" />
          المحرك يعمل في الخلفية 24/7
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => {
          const isBusy = triggeringId === rule.id;

          return (
            <div
              key={rule.id}
              className={`bg-white rounded-3xl p-6 border transition shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                rule.enabled ? 'border-gray-100 hover:border-[#2A9DA5]/50' : 'border-gray-200 opacity-60 bg-gray-50'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold bg-teal-50 text-[#075563] px-2.5 py-0.5 rounded-full">
                    الحدث المشغل: {rule.triggerEvent}
                  </span>
                  <h3 className="font-black text-base text-[#075563]">{rule.nameAr}</h3>
                </div>

                <div className="text-xs text-gray-600 flex items-center gap-2 bg-[#FAF8F1] p-3 rounded-xl border border-[#075563]/10">
                  <ArrowRight className="w-4 h-4 text-[#075563] flex-shrink-0" />
                  <span>الإجراء الآلي: <strong className="text-gray-800">{rule.actionAr}</strong></span>
                </div>

                <div className="text-[11px] text-gray-400 flex items-center gap-4 pt-1 font-mono">
                  <span>مرات التنفيذ الناجحة: {rule.executionsCount}</span>
                  {rule.lastExecuted && <span>آخر تنفيذ: {rule.lastExecuted}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleManualTrigger(rule)}
                  disabled={!rule.enabled || isBusy}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Play className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                  {isBusy ? 'جاري التشغيل...' : 'تشغيل تجريبي'}
                </button>

                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className="text-xs font-bold flex items-center gap-1.5 text-gray-700 hover:text-[#075563]"
                >
                  {rule.enabled ? (
                    <span className="flex items-center gap-1 text-emerald-700">
                      <ToggleRight className="w-8 h-8 text-emerald-600" />
                      مفعل
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400">
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                      معطل
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
