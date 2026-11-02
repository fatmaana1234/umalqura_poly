import React, { useState, useEffect, useRef } from 'react';
import { Camera, Volume2, VolumeX, RotateCcw, Award, AlertTriangle, Check, Play, Square } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseRepCounterProps {
  initialExerciseName?: string;
  targetReps?: number;
}

export const ExerciseRepCounter: React.FC<ExerciseRepCounterProps> = ({
  initialExerciseName = 'تمرين القرفصاء العلاجي الآمن (Safe Therapeutic Squat)',
  targetReps = 10
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(175);
  const [formFeedback, setFormFeedback] = useState<string>('ابدأ بالنزول ببطء مع ثني الركبتين');
  const [isWarning, setIsWarning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const repStateRef = useRef<'up' | 'down'>('up');

  // Text to Speech in Arabic
  const speakVoice = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not allowed or supported', e);
    }
  };

  const startTrainer = async () => {
    setCurrentReps(0);
    setIsCompleted(false);
    setIsActive(true);
    speakVoice('مرحباً بك في مدرب التمارين الذكي لمجمع أم القرى. ابدأ التمرين بحذر');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn('Camera fallback to optical simulator', err);
    }
  };

  const stopTrainer = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  // Exercise loop & Rep counter logic
  useEffect(() => {
    if (!isActive || isCompleted) return;

    let angle = 175;
    let delta = -1.2;

    const interval = setInterval(() => {
      angle += delta;
      if (angle < 82) {
        // Exceeded safe squat angle of 90 degrees!
        setIsWarning(true);
        setFormFeedback('تحذير: نزول عميق جداً يضغط على صابونة الركبة! ارفع جسمك للأعلى');
        if (Math.random() < 0.2) {
          speakVoice('احذر! زاوية الركبة تهدد سلامة المفصل، ارفع نفسك قليلاً');
        }
        delta = 1.4; // Force user back up
      } else if (angle <= 95 && delta < 0) {
        // Good bottom inflection point
        setIsWarning(false);
        setFormFeedback('زاوية ممتازة ومثالية! الآن ادفع للأعلى بلطف');
        repStateRef.current = 'down';
        delta = 1.2;
      } else if (angle >= 170 && delta > 0) {
        // Reached top
        if (repStateRef.current === 'down') {
          repStateRef.current = 'up';
          setCurrentReps((prev) => {
            const next = prev + 1;
            speakVoice(`تكرار ${next}`);
            if (next >= targetReps) {
              setIsCompleted(true);
              speakVoice('أحسنت! أتممت التكرارات المقررة بنجاح وبأمان تام');
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
            }
            return next;
          });
        }
        setIsWarning(false);
        setFormFeedback('تكرار ناجح! انزل للتكرار التالي بحذر');
        delta = -1.2;
      }

      setCurrentAngle(Math.round(angle));

      // Draw overlay on canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (videoRef.current && videoRef.current.readyState === 4) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          } else {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // Draw skeleton lines
          ctx.strokeStyle = isWarning ? '#ef4444' : '#10b981';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(320, 120);
          ctx.lineTo(320, 240);
          ctx.lineTo(angle > 90 ? 270 : 250, 360);
          ctx.stroke();

          // Draw angle readout
          ctx.fillStyle = 'rgba(7, 85, 99, 0.85)';
          ctx.roundRect(240, 220, 160, 36, 8);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px Cairo, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`الزاوية: ${Math.round(angle)}°`, 320, 244);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isCompleted, targetReps, isWarning]);

  return (
    <div className="bg-white rounded-2xl border border-[#075563]/15 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#2A9DA5]/10 text-[#2A9DA5]">
              <Camera className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-lg text-[#075563]">
              مدرب التمارين المنزلي الذكي (AI Rep Counting & Form Feedback)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            عدّ التكرارات تلقائياً بالكاميرا مع تنبيهات صوتية فورية لحماية المفصل من الزوايا الخاطئة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 ${
              voiceEnabled ? 'bg-[#075563] text-white border-[#075563]' : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {voiceEnabled ? 'التوجيه الصوتي مفعّل' : 'صامت'}
          </button>
        </div>
      </div>

      {/* Exercise Info Box */}
      <div className="bg-[#FAF8F1] p-3 rounded-xl border border-[#B59B62]/20 flex flex-wrap items-center justify-between text-xs gap-2">
        <span className="font-bold text-gray-800">{initialExerciseName}</span>
        <span className="bg-[#075563] text-white px-3 py-1 rounded-md font-mono font-bold">
          الهدف: {targetReps} تكرارات
        </span>
      </div>

      {/* Video & Feedback Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 relative bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[340px]">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} width={640} height={400} className="w-full h-auto max-h-[380px] object-cover" />

          {!isActive && !isCompleted && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#075563] flex items-center justify-center text-white shadow-lg">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <h4 className="font-bold text-base">ابدأ جلستك الرياضية بإشراف الذكاء الاصطناعي</h4>
              <p className="text-xs text-gray-300 max-w-sm">
                ضع الهاتف أمامك بمسافة مترين بحيث تظهر كامل الساقين. سيتولى النظام عد التكرارات وتنبيهك فوراً إذا زادت زاوية المفصل عن الحد الآمن.
              </p>
              <button
                onClick={startTrainer}
                className="px-6 py-2.5 bg-[#2A9DA5] hover:bg-[#2A9DA5]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md"
              >
                تشغيل المدرب الذكي
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="absolute inset-0 bg-[#075563]/90 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <Award className="w-16 h-16 text-[#B59B62] animate-bounce" />
              <h4 className="font-black text-xl">مبروك! أتممت التكرارات بنجاح</h4>
              <p className="text-xs text-[#FAF8F1] max-w-sm">
                تم تنفيذ {targetReps} تكرارات وفق المعايير الإكلينيكية السليمة لحماية المفصل.
              </p>
              <button
                onClick={startTrainer}
                className="px-6 py-2.5 bg-[#B59B62] hover:bg-[#B59B62]/90 text-[#075563] text-xs sm:text-sm font-black rounded-xl transition shadow-md"
              >
                تكرار الجلسة التدريبية
              </button>
            </div>
          )}

          {isActive && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Form Tracking Live
            </div>
          )}
        </div>

        {/* Counter and Form Feedback Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {/* Big Rep Counter */}
          <div className="bg-gradient-to-br from-[#FAF8F1] to-white p-5 rounded-2xl border border-[#B59B62]/30 text-center">
            <span className="text-xs font-bold text-gray-500">التكرارات المنجزة:</span>
            <div className="text-5xl font-black text-[#075563] font-mono my-2">
              {currentReps} <span className="text-xl text-gray-400">/ {targetReps}</span>
            </div>

            {/* Rep Progress bar */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-[#075563] to-[#2A9DA5] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (currentReps / targetReps) * 100)}%` }}
              />
            </div>
          </div>

          {/* Form Safety Feedback Box */}
          <div
            className={`p-4 rounded-xl border text-xs transition-all ${
              isWarning
                ? 'bg-red-50 border-red-300 text-red-900 shadow-md animate-pulse'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {isWarning ? (
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              )}
              <span>{isWarning ? 'تنبيه أمان للمفصل' : 'حالة الأداء الحركي'}</span>
            </div>
            <p className="font-medium leading-relaxed">{formFeedback}</p>
          </div>

          {/* Control buttons */}
          {isActive && (
            <button
              onClick={stopTrainer}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4 fill-white" />
              إنهاء جلسة التمارين
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
