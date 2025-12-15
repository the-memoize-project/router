import args from "@browser/args";
import matching from "@browser/matching";
import params from "@browser/params";

function handle() {
  const { page, path } = matching();
  args();
  params(path);
  if (page) page();
}

export default handle;
