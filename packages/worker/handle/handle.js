import args from "../args/args.js";
import body from "../body/body.js";
import match from "../match/match.js";
import params from "../params/params.js";

async function handle(request, env, ctx) {
  const { page, path } = match(request);

  await body(request);
  args(request);
  params(request, path);

  return page?.(request, env, ctx);
}

export default handle;
