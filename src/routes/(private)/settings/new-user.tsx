import { define } from "../../../utils.ts";
import { UserForm } from "../../../islands/UserForm.tsx";
import { page } from "fresh";

export const handler = define.handlers({
  POST: async (ctx) => {
    const formData = await ctx.req.formData();

    const fromEntries = Object.fromEntries(formData.entries());

    console.log(fromEntries);

    return page();
  },
});

const NewUserPage = define.page(() => {
  return (
    <>
      <header>
        <h2 className="subtitle">Create a new user</h2>
        <p>All fields can be changed in the future, except the handle</p>
      </header>
      <br />
      <UserForm method="POST" />
    </>
  );
});

export default NewUserPage;
