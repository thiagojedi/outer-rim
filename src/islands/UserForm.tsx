import { useComputed } from "@preact/signals";
import { FC } from "preact/compat";
import { useRef } from "preact/hooks";
import { getValue, pattern, required, useForm } from "@modular-forms/preact";

import { Card } from "../common/components/Card.tsx";
import { TextInput } from "../common/components/TextInput.tsx";
import { TextArea } from "../common/components/TextArea.tsx";
import { Checkbox } from "../common/components/Checkbox.tsx";

type UserFormType = {
  handle: string;
  name: string;
  bio: string;
  header: {
    file?: File;
    description: string;
  };
  avatar: {
    file?: File;
    description: string;
  };
  bot: boolean;
  public: boolean;
};

export const UserForm: FC<
  {
    initialData?: Partial<UserFormType>;
    action: string;
    method: "POST" | "PATCH";
    redirect?: boolean;
  }
> = (
  { initialData, action, method = "POST", redirect },
) => {
  const [form, { Form, Field }] = useForm<UserFormType>({
    initialValues: initialData,
  });

  const handle = useComputed(() => getValue(form, "handle"));

  const name = useComputed(() => getValue(form, "name"));
  const bio = useComputed(() => getValue(form, "bio"));

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async () => {
    const body = new FormData(formRef.current?.base ?? undefined);

    const result = await fetch(action, { method, body });

    if (redirect && result.ok) {
      const { username } = await result.json();

      globalThis.location.href = "./" + username;
    }
  };

  return (
    <Form
      ref={formRef}
      className="form"
      onSubmit={handleSubmit}
    >
      <Field
        name="handle"
        validateOn="change"
        validate={[
          required("Handle is required"),
          pattern(/^[a-z0-9_]+$/, "Only letters and underscore"),
        ]}
      >
        {(field, props) => (
          <TextInput
            {...props}
            label="Handle"
            icon="fa-at"
            error={field.error}
            disabled={initialData !== undefined}
            value={useComputed(() => field.value.value || "")}
          />
        )}
      </Field>

      <div className="columns is-flex-direction-row-reverse">
        <div className="column">
          <Card
            title={name.value}
            subtitle={`@${handle}`}
            content={bio.value}
          />
        </div>

        <div className="column">
          <Field name="name">
            {(field, props) => (
              <TextInput
                label="Display name"
                {...props}
                value={useComputed(() => field.value.value || "")}
              />
            )}
          </Field>

          <Field name="bio">
            {(field, props) => (
              <TextArea
                label="Bio"
                {...props}
                value={useComputed(() => field.value.value || "")}
              />
            )}
          </Field>

          {
            /* <div className="field is-grouped">
            <Field name="header.file" type="File">
              {(_, props) => (
                <div className="file is-boxed">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      {...props}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Header</span>
                    </span>
                  </label>
                </div>
              )}
            </Field>

            <Field name="header.description">
              {(_, props) => (
                <div className="control is-expanded">
                  <div className="control">
                    <textarea
                      className="input"
                      {...props}
                    />
                  </div>
                </div>
              )}
            </Field>
          </div>

          <div className="field is-grouped">
            <Field name="avatar.file" type="File">
              {(_, props) => (
                <div className="file is-boxed">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      {...props}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Avatar</span>
                    </span>
                  </label>
                </div>
              )}
            </Field>

            <Field name="avatar.description">
              {(_, props) => (
                <div className="control is-expanded">
                  <div className="control">
                    <textarea
                      className="input"
                      {...props}
                    />
                  </div>
                </div>
              )}
            </Field>
          </div> */
          }

          <div className="checkboxes">
            <Field name="bot" type="boolean">
              {(field, props) => (
                <Checkbox
                  label="Is Bot?"
                  {...props}
                  checked={useComputed(() => field.value.value || false)}
                />
              )}
            </Field>

            {
              /* <Field name="public" type="boolean">
              {(field, props) => (
                <Checkbox
                  label="Show relations"
                  {...props}
                  checked={useComputed(() => field.value.value || false)}
                />
              )}
            </Field> */
            }
          </div>

          <br />

          <div className="field is-grouped">
            <div className="control">
              <input
                type="submit"
                className="button is-primary"
                value="Save"
              />
            </div>

            <div className="control">
              <input type="reset" className="button" />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
