import React, { useState } from 'react';
import { PainPoint } from '../types/clinic';
import { Eye, Plus, Trash2, Activity, Info } from 'lucide-react';

interface BodyMapProps {
  painPoints: PainPoint[];
  onChange?: (points: PainPoint[]) => void;
  readonly?: boolean;
}

export const BodyMap: React.FC<BodyMapProps> = ({ painPoints, onChange, readonly = false }) => {
  const [view, setView] = useState<'posterior' | 'anterior'>('posterior');
  const [selectedRegion, setSelectedRegion] = useState<PainPoint['bodyRegion']>('lumbar');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [painScore, setPainScore] = useState<number>(6);
  const [painDesc, setPainDesc] = useState<string>('ألم مستمر مع الحركة');
  const [activeSessionFilter, setActiveSessionFilter] = useState<number | 'all'>('all');

  const filteredPoints = painPoints.filter((p) => p.view === view);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (readonly || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPoint: PainPoint = {
      id: 'pp-' + Date.now(),
      bodyRegion: selectedRegion,
      view,
      x,
      y,
      severity: painScore >= 8 ? 'severe' : painScore >= 5 ? 'moderate' : 'mild',
      score: painScore,
      description: painDesc || 'ألم محدد بالضغط أو الحركة'
    };

    onChange([...painPoints, newPoint]);
  };

  const removePoint = (id: string) => {
    if (readonly || !onChange) return;
    onChange(painPoints.filter((p) => p.id !== id));
  };

  const getSeverityColor = (sev: PainPoint['severity']) => {
    switch (sev) {
      case 'severe':
        return '#ef4444'; // Red
      case 'moderate':
        return '#f97316'; // Orange
      case 'mild':
        return '#eab308'; // Yellow
      default:
        return '#10b981'; // Green
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Activity className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-lg text-[#075563]">الخريطة البصرية التفاعلية لمواضع الألم (Visual Body Map)</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            انقر على المجسم لتحديد موضع الألم ودرجة شدته بدقة وتتبع انحساره عبر الجلسات
          </p>
        </div>

        {/* Anterior / Posterior Switcher */}
        <div className="flex items-center bg-[#FAF8F1] p-1 rounded-xl border border-[#B59B62]/30">
          <button
            onClick={() => setView('posterior')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              view === 'posterior'
                ? 'bg-[#075563] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            المظهر الخلفي (العمود الفقري والرقبة)
          </button>
          <button
            onClick={() => setView('anterior')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              view === 'anterior'
                ? 'bg-[#075563] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#075563]'
            }`}
          >
            المظهر الأمامي (الركبة والكتف)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Interactive SVG Human Model Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FAF8F1] to-white rounded-xl border border-gray-100 relative min-h-[440px]">
          <div className="absolute top-3 right-3 text-[11px] bg-white/90 px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 shadow-xs flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#2A9DA5]" />
            {view === 'posterior' ? 'عرض خلفي (Posterior View)' : 'عرض أمامي (Anterior View)'}
          </div>

          {!readonly && (
            <div className="absolute top-3 left-3 text-[11px] bg-[#075563] text-white px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              انقر لإضافة نقطة ألم
            </div>
          )}

          <div className="relative w-full max-w-[280px] h-[400px]">
            <svg
              viewBox="0 0 200 400"
              className={`w-full h-full filter drop-shadow-sm ${readonly ? '' : 'cursor-crosshair'}`}
              onClick={handleSvgClick}
            >
              {/* Anatomical Silhouette (Stylized Human Body) */}
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f1f5f9" />
                  <stop offset="100%" stop-color="#e2e8f0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Head */}
              <ellipse cx="100" cy="38" rx="22" ry="26" fill="url(#bodyGradient)" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Neck */}
              <path d="M 91 62 L 91 76 L 109 76 L 109 62 Z" fill="url(#bodyGradient)" stroke="#94a3b8" strokeWidth="1.5" />
              
              {/* Torso & Shoulders */}
              <path
                d="M 60 84 C 70 78, 130 78, 140 84 C 152 92, 148 135, 142 165 C 138 185, 130 205, 126 215 L 74 215 C 70 205, 62 185, 58 165 C 52 135, 48 92, 60 84 Z"
                fill="url(#bodyGradient)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Spine representation for posterior view */}
              {view === 'posterior' && (
                <g opacity="0.6">
                  {/* Cervical C1-C7 */}
                  <line x1="100" y1="64" x2="100" y2="82" stroke="#B59B62" strokeWidth="4" strokeDasharray="2 2" />
                  {/* Thoracic T1-T12 */}
                  <line x1="100" y1="84" x2="100" y2="150" stroke="#075563" strokeWidth="5" strokeDasharray="3 2" />
                  {/* Lumbar L1-L5 */}
                  <line x1="100" y1="152" x2="100" y2="195" stroke="#2A9DA5" strokeWidth="6" strokeDasharray="3 3" />
                  {/* Sacrum */}
                  <polygon points="95,198 105,198 100,212" fill="#B59B62" opacity="0.7" />
                </g>
              )}

              {/* Arms */}
              {/* Left Arm (viewer's left) */}
              <path
                d="M 58 88 C 42 105, 34 140, 32 175 C 30 195, 24 220, 20 240 C 18 248, 26 250, 28 244 C 34 224, 40 200, 42 180 C 44 150, 52 120, 58 100 Z"
                fill="url(#bodyGradient)"
                stroke="#94a3b8"
                strokeWidth="1.8"
              />
              {/* Right Arm (viewer's right) */}
              <path
                d="M 142 88 C 158 105, 166 140, 168 175 C 170 195, 176 220, 180 240 C 182 248, 174 250, 172 244 C 166 224, 160 200, 158 180 C 156 150, 148 120, 142 100 Z"
                fill="url(#bodyGradient)"
                stroke="#94a3b8"
                strokeWidth="1.8"
              />

              {/* Pelvis / Hips */}
              <path d="M 74 215 C 74 235, 90 242, 100 242 C 110 242, 126 235, 126 215 Z" fill="url(#bodyGradient)" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Left Leg */}
              <path
                d="M 74 232 C 70 260, 68 295, 72 325 C 74 340, 72 370, 70 385 C 68 392, 80 395, 84 390 C 88 370, 88 340, 86 325 C 84 295, 88 260, 94 238 Z"
                fill="url(#bodyGradient)"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              {/* Right Leg */}
              <path
                d="M 126 232 C 130 260, 132 295, 128 325 C 126 340, 128 370, 130 385 C 132 392, 120 395, 116 390 C 112 370, 112 340, 114 325 C 116 295, 112 260, 106 238 Z"
                fill="url(#bodyGradient)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Knee joint landmarks on anterior view */}
              {view === 'anterior' && (
                <g opacity="0.5">
                  <circle cx="78" cy="325" r="7" fill="none" stroke="#2A9DA5" strokeWidth="2" />
                  <circle cx="122" cy="325" r="7" fill="none" stroke="#2A9DA5" strokeWidth="2" />
                </g>
              )}

              {/* Render User-Placed Pain Points with Animated Glow */}
              {filteredPoints.map((point) => {
                const color = getSeverityColor(point.severity);
                // Map percentage coordinates (0-100) to SVG viewBox (200x400)
                const cx = (point.x / 100) * 200;
                const cy = (point.y / 100) * 400;

                return (
                  <g key={point.id} className="cursor-pointer group">
                    <circle cx={cx} cy={cy} r="14" fill={color} opacity="0.3" filter="url(#glow)">
                      <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={cx} cy={cy} r="8" fill={color} stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={cx}
                      y={cy + 3.5}
                      fontSize="9"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                    >
                      {point.score}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100 w-full text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-xs" />
              <span className="text-gray-700">شديد (8-10)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-xs" />
              <span className="text-gray-700">متوسط (5-7)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-xs" />
              <span className="text-gray-700">خفيف (1-4)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
              <span className="text-gray-700">تعافى (0)</span>
            </div>
          </div>
        </div>

        {/* Configuration & Recorded Pain Points List */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {!readonly ? (
            <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/25 space-y-3.5">
              <h4 className="font-bold text-sm text-[#075563] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#B59B62]" />
                إعدادات نقطة الألم الجديدة
              </h4>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  المنطقة التشريحية المستهدفة:
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as any)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-800 focus:outline-[#075563]"
                >
                  <option value="cervical">الفقرات العنقية والرقبة (Cervical C1-C7)</option>
                  <option value="lumbar">الفقرات القطنية وأسفل الظهر (Lumbar L1-L5)</option>
                  <option value="thoracic">الفقرات الصدرية وأعلى الظهر (Thoracic T1-T12)</option>
                  <option value="shoulder_r">مفصل الكتف الأيمن (Right Shoulder)</option>
                  <option value="shoulder_l">مفصل الكتف الأيسر (Left Shoulder)</option>
                  <option value="knee_r">مفصل الركبة اليمنى (Right Knee)</option>
                  <option value="knee_l">مفصل الركبة اليسرى (Left Knee)</option>
                  <option value="hip_r">مفصل الحوض والورك (Hip)</option>
                  <option value="ankle_r">الكاحل والقدم (Ankle & Foot)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-700">مقياس شدة الألم البصري (VAS):</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-white ${
                    painScore >= 8 ? 'bg-red-600' : painScore >= 5 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}>
                    {painScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painScore}
                  onChange={(e) => setPainScore(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  طبيعة الألم وملاحظات الأخصائي:
                </label>
                <input
                  type="text"
                  value={painDesc}
                  onChange={(e) => setPainDesc(e.target.value)}
                  placeholder="مثال: ألم وتشنج عضلي ممتد مع الجلوس"
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-lg border border-blue-200">
              وضع الاستعراض الطبي: نقاط الألم موثقة ومحفوظة ضمن السجل الإكلينيكي
            </div>
          )}

          {/* List of active points */}
          <div className="mt-4 flex-1">
            <h5 className="font-bold text-xs text-gray-600 mb-2">
              النقاط الموثقة في هذا التقييم ({painPoints.length}):
            </h5>
            {painPoints.length === 0 ? (
              <p className="text-xs text-gray-400 italic p-3 text-center bg-gray-50 rounded-lg">
                لم يتم تسجيل نقاط ألم بعد. انقر على خريطة الجسم للإضافة.
              </p>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {painPoints.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs hover:border-[#2A9DA5] transition"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getSeverityColor(point.severity) }}
                      />
                      <div>
                        <span className="font-bold text-[#075563] ml-1">{point.description}</span>
                        <span className="text-gray-500 text-[10px]">({point.view === 'posterior' ? 'خلفي' : 'أمامي'})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {point.score}/10
                      </span>
                      {!readonly && onChange && (
                        <button
                          onClick={() => removePoint(point.id)}
                          className="text-gray-400 hover:text-red-600 transition p-1"
                          title="حذف النقطة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
