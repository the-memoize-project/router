import args from "@args";
import params from "@params";
import matching from "@matching";

function handle() {
  const { page, path } = matching();
  args();
  params(path);
  if (page) page();
}

export default handle;
