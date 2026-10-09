import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="text-[#3D7954] shrink-0" size={18} />,
          warning: <AlertTriangle className="text-[#A65D12] shrink-0" size={18} />,
          error: <AlertCircle className="text-[#B42318] shrink-0" size={18} />,
          info: <Info className="text-[#1D5B79] shrink-0" size={18} />
        };

        const bg = {
          success: 'bg-white border-[#E4F0E5] shadow-lg',
          warning: 'bg-[#FEF7ED] border-[#A65D12]/30 shadow-lg',
          error: 'bg-[#FEF3F2] border-[#B42318]/30 shadow-lg',
          info: 'bg-[#F0F7FB] border-[#1D5B79]/30 shadow-lg'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border flex items-start justify-between gap-3 transition-all duration-200 transform translate-y-0 ${bg[toast.type]}`}
          >
            <div className="flex items-start gap-3">
              {icons[toast.type]}
              <div>
                <p className="text-sm font-semibold text-[#1D2921]">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-[#68736B] mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#68736B] hover:text-[#1D2921] p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
