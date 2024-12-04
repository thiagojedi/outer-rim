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

  const image = useSignal("");
  const avatar = useSignal("");

  const headerRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  return (
    <form method="POST" className="form">
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
              ? ["123 followers", "123 following"]
              : undefined}
          />
        </div>

        <div className="column">
          <ImageInput
            ref={headerRef}
            name="header"
            label="Header"
            accept="image/jpeg"
            onChange={() => {
              const file = headerRef.current?.files?.item(0);

              image.value = file ? URL.createObjectURL(file) : "";
            }}
          />
          <div className="field is-grouped">
            <div className="file is-boxed">
              <label className="file-label">
                <input
                  ref={avatarRef}
                  className="file-input"
                  type="file"
                  name="avatar"
                  accept="image/jpeg"
                  onChange={() => {
                    const file = avatarRef.current?.files?.item(0);

                    avatar.value = file ? URL.createObjectURL(file) : "";
                  }}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Avatar</span>
                </span>
              </label>
            </div>

            <div className="control is-expanded">
              <div className="control">
                <textarea
                  className="input"
                  name="avatarDescription"
                  placeholder="Avatar description (optional)"
                />
              </div>
              <p className="help">1:1 images are best</p>
            </div>
          </div>

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
