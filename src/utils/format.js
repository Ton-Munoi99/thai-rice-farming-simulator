export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function formatNumber(value) {
  return Math.round(value).toLocaleString("en-US");
}

export function signedBaht(value) {
  const prefix = value >= 0 ? "+฿" : "-฿";
  return `${prefix}${formatNumber(Math.abs(value))}`;
}

export function scoreColor(value) {
  if (value >= 70) return "#2f8f4e";
  if (value >= 50) return "#6fae3f";
  if (value >= 30) return "#e0a82e";
  return "#d2603a";
}

export function riskColor(value) {
  if (value <= 25) return "#2f8f4e";
  if (value <= 50) return "#e0a82e";
  return "#d2603a";
}
