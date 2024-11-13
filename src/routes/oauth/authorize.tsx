import { authServer } from "../../auth/server.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  POST: authServer.authorize,
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
