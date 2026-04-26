export const safeParse = (str) => {
  if (!str || str === "undefined" || str === "null") return null;
  if (typeof str === "object") return str;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const parseJSONArray = (value) => {
  if (!value || value === "[]" || value === "") return [];
  const parsed = safeParse(value);
  if (Array.isArray(parsed)) return parsed;
  return [];
};

export const extractValues = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => item.name || item.value || null).filter(Boolean);
};

// ── Helper: Normalize boolean from FormData ──────────────────────
export const normalizeBool = (val) => val === "true" || val === true;

// ── Helper: Normalize number from FormData ───────────────────────
export const normalizeNumber = (val, defaultVal = 0) => {
  const num = parseInt(val, 10);
  return isNaN(num) ? defaultVal : num;
};
