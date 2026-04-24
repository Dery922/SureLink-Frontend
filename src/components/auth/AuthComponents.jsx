import React from "react";

// ===================== INLINE SVG ICONS =====================
const icons = {
  "alert-circle": (size, className) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  check: (size, className) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
  ),
  "check-circle": (size, className) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  spinner: (size, className) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={`${className || ""} animate-spin`}><circle cx="12" cy="12" r="10" strokeDasharray="30 70"/></svg>
  ),
  warning: (size, className) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
};

export function AuthIcon({ name, size = 16, className = "" }) {
  const render = icons[name];
  return render ? render(size, className) : null;
}

// ===================== FEEDBACK BANNER =====================
export function FeedbackBanner({ type = "error", message, onRetry }) {
  if (!message) return null;

  const palette = {
    error:   "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    warning: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
    success: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
  };

  const iconMap = {
    error: "alert-circle",
    warning: "warning",
    success: "check-circle",
  };

  return (
    <div className={`border rounded-xl p-3.5 text-sm flex items-start gap-2.5 transition-all ${palette[type] || palette.error}`}>
      <AuthIcon name={iconMap[type]} size={18} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="text-xs font-semibold underline mt-1 hover:opacity-80 transition-opacity">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ===================== TEXT INPUT =====================
export function AuthTextInput({
  id,
  label,
  hint,
  error,
  state = "default",
  ...props
}) {
  const isDisabled = state === "disabled" || props.disabled;
  const isError = state === "error" || Boolean(error);
  const stateClass = isDisabled
    ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
    : isError
      ? "border-red-300 dark:border-red-600 focus:ring-red-100 dark:focus:ring-red-900"
      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-900";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label}
      </label>
      <input
        id={id}
        disabled={isDisabled}
        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all input-glow ${stateClass}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 field-error-shake">
          <AuthIcon name="alert-circle" size={12} />
          <span>{error}</span>
        </p>
      ) : null}
      {!error && hint ? <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

// ===================== BUTTON =====================
export function AuthButton({ variant = "primary", loading, children, ...props }) {
  const base = "w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const stylesMap = {
    primary:   "bg-brand-500 text-white hover:bg-brand-600 shadow-sm hover:shadow-md",
    secondary: "border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800",
    disabled:  "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
    loading:   "bg-brand-500 text-white",
  };
  const styles = stylesMap[variant] || stylesMap.primary;

  return (
    <button className={`${base} ${styles}`} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <>
          <AuthIcon name="spinner" size={16} />
          <span>Please wait…</span>
        </>
      ) : children}
    </button>
  );
}

// ===================== OTP INPUT =====================
export function OtpInputGroup({ value, onChange, disabled }) {
  const safe = `${value || ""}`.replace(/\D/g, "").slice(0, 6);

  const updateAt = (idx, digit) => {
    const chars = safe.padEnd(6, " ").split("");
    chars[idx] = digit || " ";
    const newVal = chars.join("").replace(/\s/g, "").slice(0, 6);
    onChange(newVal);

    // Auto-focus next input
    if (digit && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      if (next) next.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !safe[idx] && idx > 0) {
      const prev = document.getElementById(`otp-${idx - 1}`);
      if (prev) prev.focus();
    }
  };

  return (
    <div className="flex gap-2.5 justify-between">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={safe[idx] || ""}
          onChange={(e) => updateAt(idx, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={(e) => {
            e.preventDefault();
            onChange((e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6));
          }}
          className="w-11 h-13 text-center text-lg font-bold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-500 transition-all input-glow text-gray-900 dark:text-gray-100"
          aria-label={`OTP digit ${idx + 1}`}
        />
      ))}
    </div>
  );
}

// ===================== ROLE CARD =====================
export function RoleCard({ title, description, icon, selected, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
        disabled
          ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
          : selected
            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
            : "border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      } disabled:opacity-60`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-gray-100">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      {selected && (
        <div className="mt-2 flex justify-end">
          <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
            <AuthIcon name="check" size={12} className="text-white" />
          </div>
        </div>
      )}
    </button>
  );
}

// ===================== CONSENT ROW =====================
export function ConsentRow({ id, checked, onChange, children, disabled }) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 cursor-pointer select-none hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
    >
      <div className="relative mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked
            ? "bg-brand-500 border-brand-500"
            : "border-gray-300 dark:border-gray-600"
        }`}>
          {checked && <AuthIcon name="check" size={12} className="text-white" />}
        </div>
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{children}</span>
    </label>
  );
}
