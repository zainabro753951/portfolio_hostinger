export const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};

export const renderEmailTemplate = (template, values) => {
  return template.replace(
    /{{\s*(fullName|email|subject|message)\s*}}/g,
    (_, key) => escapeHtml(values[key] ?? ""),
  );
};
