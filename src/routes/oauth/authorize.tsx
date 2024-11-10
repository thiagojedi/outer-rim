import { Handlers } from "$fresh/server.ts";
import { getOAuthServer } from "../../auth/server.ts";

export const handler: Handlers = {
  POST: (req, ctx) => {
    //TODO Login in and confirm before authorize on OAuth
    const loggedUser = { user: { id: 1 } };

    return getOAuthServer(req, ctx).authorize(loggedUser);
  },
};

const LoginForm = () => {
  return (
    <>
      <form method="POST">
        <fieldset>
          <input type="text" name="user" />
          <input type="text" name="password" />
        </fieldset>
        <input type="submit" value="Login" />
      </form>
    </>
  );
};

export default LoginForm;
