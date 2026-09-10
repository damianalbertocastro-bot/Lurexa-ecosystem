/**
 * Interpolates values into a template string like "Hello, {name}!"
 */
export function interpolate(template: string, values?: Record<string, string | number>): string {
  if (!values || Object.keys(values).length === 0) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return String(values[key]);
    }
    return match;
  });
}
