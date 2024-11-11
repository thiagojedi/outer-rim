import { FreshContext } from "fresh";

export default function ErrorPage(ctx: FreshContext) {
  // Exact signature to be determined, but the status
  // code will live somewhere in "ctx"
  const status = (ctx.error as { status: number }).status;

  if (status === 404) {
    return <h1>This is not the page you're looking for</h1>;
  } else {
    return <h1>Sorry - Some other error happend!</h1>;
  }
}
