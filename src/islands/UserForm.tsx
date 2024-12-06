import { Card } from "../common/components/Card.tsx";
import { useSignal } from "@preact/signals";
import { FC } from "preact/compat";
import { TextInput } from "../common/components/TextInput.tsx";
import { TextArea } from "../common/components/TextArea.tsx";
import { useRef } from "preact/hooks";
import { Checkbox } from "../common/components/Checkbox.tsx";
import { ImageInput } from "../common/components/ImageInput.tsx";

export const UserForm: FC<
  { initialData?: Record<string, string> }
> = (
  { initialData },
) => {
  const handle = useSignal(initialData?.handle);
  const name = useSignal(initialData?.name);
  const bio = useSignal("");

  const isPublic = useSignal(false);

  const image = useSignal(initialData?.header);
  const avatar = useSignal("");

  const headerRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  return (
    <form method="POST" className="form" encType="multipart/form-data">
      <TextInput
        label="Handle"
        icon="fa-at"
        type="text"
        name="handle"
        required
        disabled={initialData !== undefined}
        placeholder="username"
        pattern="[a-z0-9_]+"
        value={handle}
        onChange={(e) => handle.value = e.currentTarget.value}
      />

      <div className="columns is-flex-direction-row-reverse">
        <div className="column">
          <Card
            title={name.value}
            subtitle={`@${handle}`}
            content={bio.value}
            image={image.value}
            avatar={avatar.value}
            footer={isPublic.value
              ? ["123 posts", "123 followers", "123 following"]
              : ["123 posts"]}
          />
        </div>

        <div className="column">
          <ImageInput
            ref={headerRef}
            name="header"
            descriptionName="headerDescription"
            label="Header"
            accept="image/jpeg"
            onChange={() => {
              const file = headerRef.current?.files?.item(0);

              image.value = file ? URL.createObjectURL(file) : "";
            }}
          />

          <ImageInput
            ref={avatarRef}
            name="avatar"
            descriptionName="avatarDescription"
            label="Avatar"
            accept="image/jpeg"
            onChange={() => {
              const file = avatarRef.current?.files?.item(0);

              avatar.value = file ? URL.createObjectURL(file) : "";
            }}
          />

          <TextInput
            type="text"
            name="name"
            label="Display name"
            value={name}
            onChange={(e) => name.value = e.currentTarget.value}
          />

          <TextArea
            name="bio"
            label="Bio"
            onChange={(e) => bio.value = e.currentTarget.value}
          />

          <div className="checkboxes">
            <Checkbox label="Is Bot?" name="bot" />

            <Checkbox
              label="Show relations"
              name="public"
              onChange={(e) => isPublic.value = e.currentTarget.checked}
            />
          </div>

          <br />

          <div className="field is-grouped">
            <div className="control">
              <input type="submit" className="button is-primary" value="Save" />
            </div>

            <div className="control">
              <input type="reset" className="button" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
