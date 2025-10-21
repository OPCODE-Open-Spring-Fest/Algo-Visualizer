import React from "react";

const COLORS = {
  default: "bg-slate-700 shadow-[0_0_8px_rgba(15,23,42,0.6)]",
  push: "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]",
  pop: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.35)]",
  peek: "bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]",
  underflow: "bg-rose-600/60",
};

export default function StackVisualizer({ array = [], highlight = null }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-sm text-slate-400">Top</div>

      <div className="w-48 min-h-[200px] max-h-[420px] border rounded-lg p-3 bg-white/5 overflow-auto">
        <div className="flex flex-col items-center space-y-2">
          {array.length === 0 ? (
            <div className="text-slate-400 italic py-6">Stack is empty</div>
          ) : (
            array.map((value, idx) => {
              let cls = COLORS.default;

              if (highlight) {
                if (highlight.type === "push" && highlight.array && highlight.array[0] === value && idx === 0) {
                  cls = COLORS.push;
                }
                if ((highlight.type === "pop" || highlight.type === "pop-start") && idx === 0) {
                  cls = COLORS.pop;
                }
                if (highlight.type === "peek" && highlight.index === idx) {
                  cls = COLORS.peek;
                }
                if (highlight.type === "underflow") {
                  cls = COLORS.underflow;
                }
                if (highlight.type === "clear" && array.length === 0) {
                  cls = COLORS.default;
                }
              }

              return (
                <div
                  key={idx + "-" + String(value)}
                  className={`${cls} w-full rounded-md px-3 py-2 flex justify-between items-center text-white transition-all duration-300`}
                  style={{ minHeight: 40 }}
                >
                  <div className="truncate">{String(value)}</div>
                  <div className="text-xs opacity-80">#{array.length - idx}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-2 text-sm text-slate-500">Bottom</div>
    </div>
  );
}
