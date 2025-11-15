import React from "react";

export default function FractionalKnapsackVisualizer({items = [], currentStep = null, capacity = 0}) {
  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-center">
          <div className="text-gray-400">No data to visualize</div>
        </div>
      </div>
    );
  }
  const step = currentStep;
  const selectedItems = step.selectedItems || [];
  const totalValue = step.totalValue || 0;
  const remainingCapacity = step.remainingCapacity !== undefined ? step.remainingCapacity : capacity;
  const usedCapacity = capacity - remainingCapacity;

  const getItemStatus = (item) => {
    const selected = selectedItems.find(si => si.index === item.index);
    
    if (selected) {
      return selected.fraction === 1.0 ? "full" : "partial";
    }
    
    if (step.currentItem && step.currentItem.index === item.index) {
      if (step.type === "consider_item") {
        return "considering";
      } else if (step.type === "skip_item") {
        return "skipped";
      }
    }
    
    return "not_selected";
  };

  const getItemClass = (status) => {
    switch (status) {
      case "full":
        return "bg-green-600 border-green-500";
      case "partial":
        return "bg-yellow-600 border-yellow-500";
      case "considering":
        return "bg-blue-600 border-blue-500";
      case "skipped":
        return "bg-gray-600 border-gray-500 opacity-50";
      default:
        return "bg-gray-700 border-gray-600";
    }
  };
  return (
    <div className="w-3/4 h-full mx-auto space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-bold mb-3 text-white">Items (Sorted by Value/Weight Ratio)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {step.items?.map((item, idx) => {
            const status = getItemStatus(item);
            const selected = selectedItems.find(si => si.index === item.index);
            return (
              <div
                key={item.index}
                className={`border rounded p-2 transition-colors duration-200 ${getItemClass(status)}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-bold text-white text-xs">Item {item.index + 1}</div>
                  <div className="text-xs bg-white/20 px-1 py-0.5 rounded text-white">
                    {item.ratio.toFixed(2)}
                  </div>
                </div>
                <div className="space-y-0.5 text-xs text-white">
                  <div className="flex justify-between">
                    <span>W:</span>
                    <span className="font-semibold">{item.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>V:</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  {selected && (
                    <div className="border-t border-white/20 pt-1 mt-1">
                      <div className="text-xs font-bold">
                        {selected.fraction === 1.0 
                          ? "100%" 
                          : `${(selected.fraction * 100).toFixed(0)}%`}
                      </div>
                      <div className="text-xs">
                        {selected.actualWeight.toFixed(1)}kg
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-bold mb-3 text-white">Knapsack</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1 text-gray-300">
              <span>Capacity</span>
              <span className="font-semibold text-white">
                {usedCapacity.toFixed(1)} / {capacity} kg
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden border border-gray-600">
              <div
                className="h-full bg-green-600 flex items-center justify-center text-white font-bold text-xs transition-all duration-300"
                style={{ width: `${Math.min((usedCapacity / capacity) * 100, 100)}%` }}>
                {capacity > 0 ? ((usedCapacity / capacity) * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>
          {selectedItems.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-semibold text-gray-300 mb-2">Selected Items:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {selectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border text-xs ${
                      item.fraction === 1.0
                        ? "bg-green-600/30 border-green-500"
                        : "bg-yellow-600/30 border-yellow-500"
                    }`}
                  >
                    <div className="text-white">
                      <div className="font-semibold">Item {item.index + 1}</div>
                      <div className="text-gray-300 text-xs">
                        {item.fraction === 1.0 ? "Full" : `${(item.fraction * 100).toFixed(0)}%`}
                      </div>
                      <div className="text-xs mt-1">
                        {item.actualWeight.toFixed(1)}kg
                      </div>
                      <div className="text-xs text-gray-300">
                        V: {item.actualValue.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3 p-3 rounded borde">
            <div className="flex gap-4 items-center">
              <span className="text-sm font-semibold text-white">Total Value:</span>
              <span className="text-xl font-bold text-white">{totalValue.toFixed(2)}</span>
            </div>
            {remainingCapacity > 0 && step.type === "complete" && (
              <div className="text-xs text-gray-300 mt-1">
                Remaining: {remainingCapacity.toFixed(1)} kg
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

