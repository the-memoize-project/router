import listeners from "@browser/listeners";

const urlFor = (name, params = {}) => {
  const path = listeners.find(({ page }) => page?.name === name)?.path;
  if (!path) return "#";

  const pathname = path.replace(
    /:(\w+)/g,
    (_, key) => params[key] ?? `:${key}`,
  );
  return `${globalThis.location.origin}${pathname}`;
};

export default urlFor;
