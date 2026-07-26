export function makeSlug(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const shortId = Math.random().toString(36).slice(2, 7);
  return `${base || "for-you"}-${shortId}`;
}
