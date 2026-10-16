import React from 'react';
import { useAuctions } from '../context/AuctionContext';
import { X, AlertCircle, CheckCircle2, Info, Zap } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAuctions();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
            case 'alert':
              return <Zap className="w-5 h-5 text-amber-600 shrink-0" />;
            case 'warning':
              return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-sky-600 shrink-0" />;
          }
        };

        const getBorderBg = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-white shadow-lg shadow-emerald-950/5';
            case 'alert':
              return 'border-amber-200 bg-white shadow-lg shadow-amber-950/5';
            case 'warning':
              return 'border-rose-200 bg-white shadow-lg shadow-rose-950/5';
            default:
              return 'border-sky-200 bg-white shadow-lg shadow-sky-950/5';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border ${getBorderBg()} transition-all duration-200 transform translate-y-0`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                  {toast.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {toast.message}
                </p>
                {toast.action && (
                  <div className="mt-2.5">
                    <button
                      onClick={() => {
                        toast.action?.onClick();
                        dismissToast(toast.id);
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors"
                    >
                      {toast.action.label}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
