import listeners from "../listeners/listeners.js";

const urlFor = (page, params, host = "") => {
  const anchor = { path: "#" };
  const { path } =
    listeners.GET.find(({ name }) => name === page.name) ?? anchor;
  return `${host}${path.replace(/:(?<key>\w+)/g, (_, key) => params[key])}`;
};

export default urlFor;
