import listeners from "../listeners/listeners.js";
import { PATH_VARIABLE } from "../vars/vars.js";

const urlFor = (page, params, host = "") => {
  const anchor = { path: "#" };
  const { path } = listeners.GET.find(({ name }) => name === page.name) ?? anchor;
  return `${host}${path.replace(PATH_VARIABLE, (_, key) => params[key])}`;
};

export default urlFor;
