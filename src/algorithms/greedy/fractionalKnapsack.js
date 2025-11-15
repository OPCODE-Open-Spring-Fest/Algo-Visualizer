export function* fractionalKnapsack(weights, values, capacity) {
  const n = weights.length;
  const items = [];
  for (let i = 0; i < n; i++) {
    items.push({index: i, weight: weights[i], value: values[i], ratio: values[i] / weights[i]});
  }
  
  yield {
    type: "calculate_ratios",
    message: "Calculating value-to-weight ratio for each item",
    items: items.map(item => ({ ...item })),
    capacity,
    selectedItems: [],
    totalValue: 0,
    remainingCapacity: capacity
  };

  items.sort((a, b) => b.ratio - a.ratio);
  
  yield {
    type: "sort_items",
    message: "Sorting items by value-to-weight ratio (descending) - Greedy approach",
    items: items.map(item => ({ ...item })), capacity, selectedItems: [], totalValue: 0, remainingCapacity: capacity
  };
  
  const selectedItems = [];
  let totalValue = 0;
  let remainingCapacity = capacity;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    yield {
      type: "consider_item",
      message: `Considering item ${item.index + 1}: weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(2)}`,
      items: items.map(item => ({ ...item })),
      currentItem: { ...item }, capacity, selectedItems: selectedItems.map(si => ({ ...si })), totalValue, remainingCapacity
    };
    
    if (remainingCapacity <= 0) {
      yield {
        type: "skip_item",
        message: `Skipping item ${item.index + 1}: No remaining capacity`,
        items: items.map(item => ({ ...item })),
        currentItem: { ...item },capacity, selectedItems: selectedItems.map(si => ({ ...si })), totalValue, remainingCapacity
      };
      break;
    }
    
    if (item.weight <= remainingCapacity) {
      const fraction = 1.0;
      const itemValue = item.value;
      const itemWeight = item.weight;
      
      selectedItems.push({index: item.index, weight: itemWeight, value: itemValue, ratio: item.ratio, fraction: fraction, actualWeight: itemWeight, actualValue: itemValue});
      
      totalValue += itemValue;
      remainingCapacity -= itemWeight;
      
      yield {
        type: "take_full",
        message: `Taking full item ${item.index + 1}: ${itemWeight}kg (value: ${itemValue})`,
        items: items.map(item => ({ ...item })),
        currentItem: { ...item },
        capacity,
        selectedItems: selectedItems.map(si => ({ ...si })),
        totalValue,
        remainingCapacity
      };
    } else {
      const fraction = remainingCapacity / item.weight;
      const actualWeight = remainingCapacity;
      const actualValue = item.value * fraction;
      
      selectedItems.push({index: item.index, weight: item.weight, value: item.value, ratio: item.ratio, fraction: fraction, actualWeight: actualWeight, actualValue: actualValue});
      
      totalValue += actualValue;
      remainingCapacity = 0;
      
      yield {
        type: "take_fraction",
        message: `Taking ${(fraction * 100).toFixed(1)}% of item ${item.index + 1}: ${actualWeight.toFixed(2)}kg (value: ${actualValue.toFixed(2)})`,
        items: items.map(item => ({ ...item })), currentItem: { ...item }, capacity, selectedItems: selectedItems.map(si => ({ ...si })), totalValue, remainingCapacity, fraction
      };
      break;
    }
  }
  
  yield {type: "complete", message: `Knapsack filled! Total value: ${totalValue.toFixed(2)}`, items: items.map(item => ({ ...item })), capacity, selectedItems: selectedItems.map(si => ({ ...si })), totalValue, remainingCapacity};
  return { selectedItems, totalValue, remainingCapacity};
}
