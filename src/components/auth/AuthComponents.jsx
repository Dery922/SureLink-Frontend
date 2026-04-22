import React from "react";

export function FeedbackBanner({ type = "error", message, onRetry }) {
  if (!message) return null;

  const palette = {
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`border rounded-lg p-3 text-sm flex items-start gap-2 ${palette[type] || palette.error}`}>
      <span aria-hidden="true">{type === "success" ? "✓" : "⚠"}</span>
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="underline mt-1">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

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
    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
    : isError
      ? "border-red-300 focus:ring-red-100"
      : "border-[#E8F0FF] focus:border-[#0057FF] focus:ring-[#E8F0FF]";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-[#1A1A1A]">
        {label}
      </label>
      <input
        id={id}
        disabled={isDisabled}
        className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 ${stateClass}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

export function AuthButton({ variant = "primary", loading, children, ...props }) {
  const base = "w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const stylesMap = {
    primary: "bg-[#0057FF] text-white hover:bg-blue-700",
    secondary: "border border-[#E8F0FF] text-[#1A1A1A] hover:bg-[#F5F8FF]",
    disabled: "bg-gray-200 text-gray-500",
    loading: "bg-[#0057FF] text-white",
  };
  const styles = stylesMap[variant] || stylesMap.primary;

  return (
    <button className={`${base} ${styles}`} disabled={loading || props.disabled} {...props}>
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function OtpInputGroup({ value, onChange, disabled }) {
  const safe = `${value || ""}`.replace(/\D/g, "").slice(0, 6);

  const updateAt = (idx, digit) => {
    const chars = safe.padEnd(6, " ").split("");
    chars[idx] = digit || " ";
    onChange(chars.join("").replace(/\s/g, "").slice(0, 6));
  };

  return (
    <div className="flex gap-2 justify-between">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={safe[idx] || ""}
          onChange={(e) => updateAt(idx, e.target.value.replace(/\D/g, "").slice(-1))}
          onPaste={(e) => {
            e.preventDefault();
            onChange((e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6));
          }}
          className="w-11 h-12 text-center text-lg font-semibold border border-[#E8F0FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8F0FF]"
          aria-label={`OTP digit ${idx + 1}`}
        />
      ))}
    </div>
  );
}

export function RoleCard({ title, description, selected, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition ${
        disabled
          ? "border-gray-200 bg-gray-100 text-gray-400"
          : selected
            ? "border-[#0057FF] bg-[#F5F8FF]"
            : "border-[#E8F0FF] hover:border-[#0057FF]"
      } disabled:opacity-60`}
    >
      <h4 className="font-semibold text-[#1A1A1A]">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </button>
  );
}

export function ConsentRow({ id, checked, onChange, children, disabled }) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-gray-700">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <span>{children}</span>
    </label>
  );
}
