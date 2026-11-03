import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Um Alqura System ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F1] flex items-center justify-center p-6 text-[#24383B] font-['Cairo',sans-serif] dir-rtl text-right">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-red-200 shadow-xl space-y-5 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#075563]">
                مجمع أم القرى الطبي ومصنع التأهيل 2026
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                حدث استثناء غير متوقع في واجهة المستخدم، وتم حفظ الحالة بأمان لمنع فقدان البيانات.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-left font-mono text-red-600 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#075563] text-white rounded-xl font-bold text-sm hover:bg-[#064450] transition shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة تشغيل النظام
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('um_alqura_tab');
                  window.location.href = './';
                }}
                className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
