import { getOAuthServer } from "../../auth/server.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  POST: ({ req, ...ctx }) => {
    //TODO Login in and confirm before authorize on OAuth
    const loggedUser = { user: { id: 1 } };

    return getOAuthServer(req, ctx).authorize(loggedUser);
  },
});

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
