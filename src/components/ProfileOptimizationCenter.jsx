import React from "react";

export default function ProfileOptimizationCenter({ user, onActionClick }) {
  // 1. Safety Gate: If there is no user data or the user is not a provider, render nothing
  if (!user || user.type !== "provider" || !user.profileOptimization) {
    return null;
  }

  const { score, issuesList } = user.profileOptimization;

  // 2. Safety Gate: If profile is 100% complete with no tasks left, render nothing
  if (!issuesList || issuesList.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm my-5">
      {/* Header Profile Progress Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            💡 Optimize Your Business Profile
          </h3>
          <p className="text-sm text-gray-500">
            Provider profiles with lower completion scores miss out on local
            customer searches.
          </p>
        </div>
        <div className="sm:text-right flex items-center sm:flex-col gap-2 sm:gap-0">
          <span
            className={`text-2xl font-black ${
              score < 60
                ? "text-red-500"
                : score < 85
                  ? "text-amber-500"
                  : "text-green-500"
            }`}
          >
            {score}%
          </span>
          <p className="text-xs text-gray-400 font-semibold tracking-wide uppercase">
            Profile Health
          </p>
        </div>
      </div>

      {/* Visual Health Score Bar Indicator */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            score < 60
              ? "bg-red-500"
              : score < 85
                ? "bg-amber-500"
                : "bg-green-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Actionable Urgent Issues Pipeline List */}
      <div className="space-y-3.5">
        {issuesList.map((tip) => (
          <div
            key={tip.id}
            className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border transition-all ${
              tip.type === "critical"
                ? "bg-red-50/40 border-red-100"
                : tip.type === "warning"
                  ? "bg-amber-50/40 border-amber-100"
                  : "bg-blue-50/40 border-blue-100"
            }`}
          >
            <div className="flex-1 pr-0 md:pr-4">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    tip.type === "critical"
                      ? "bg-red-100 text-red-700"
                      : tip.type === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {tip.type}
                </span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  {tip.impactScore}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 mt-1.5">{tip.title}</h4>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                {tip.message}
              </p>
            </div>

            {/* Context Navigation Trigger Action */}
            <button
              onClick={() => onActionClick(tip.targetRoute)}
              className={`mt-4 md:mt-0 w-full md:w-auto px-5 py-2.5 text-sm font-bold rounded-lg shadow-sm whitespace-nowrap transition-all duration-150 transform active:scale-95 text-center ${
                tip.type === "critical"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : tip.type === "warning"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-gray-800 hover:bg-gray-900 text-white"
              }`}
            >
              {tip.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
