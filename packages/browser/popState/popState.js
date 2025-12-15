import router from "@browser/router";

const popState = () => window.addEventListener("popstate", router.handle);

export default popState;
