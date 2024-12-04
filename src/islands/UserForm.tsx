import { Card } from "../common/components/Card.tsx";
import { useSignal } from "@preact/signals";
import { FC } from "preact/compat";
import { TextInput } from "../common/components/TextInput.tsx";
import { TextArea } from "../common/components/TextArea.tsx";

export const UserForm: FC<
  { initialData?: Record<string, string> }
> = (
  { initialData },
) => {
  const handle = useSignal(initialData?.handle);
  const name = useSignal(initialData?.name);
  const bio = useSignal("");

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
          />
        </div>

        <div className="column">
          {/*<div className="field is-grouped">*/}
          {/*  <div className="file is-boxed">*/}
          {/*    <label className="file-label">*/}
          {/*      <input className="file-input" type="file" name="header" />*/}
          {/*      <span className="file-cta">*/}
          {/*        <span className="file-icon">*/}
          {/*          <i className="fas fa-upload"></i>*/}
          {/*        </span>*/}
          {/*        <span className="file-label">Header</span>*/}
          {/*      </span>*/}
          {/*    </label>*/}
          {/*  </div>*/}

          {/*  <div className="control is-expanded">*/}
          {/*    <div className="control">*/}
          {/*      <textarea*/}
          {/*        className="input"*/}
          {/*        name="headerDescription"*/}
          {/*        placeholder="Header description (optional)"*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*    <p className="help">600x200 images are best</p>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className="field is-grouped">*/}
          {/*  <div className="file is-boxed">*/}
          {/*    <label className="file-label">*/}
          {/*      <input className="file-input" type="file" name="avatar" />*/}
          {/*      <span className="file-cta">*/}
          {/*        <span className="file-icon">*/}
          {/*          <i className="fas fa-upload"></i>*/}
          {/*        </span>*/}
          {/*        <span className="file-label">Avatar</span>*/}
          {/*      </span>*/}
          {/*    </label>*/}
          {/*  </div>*/}

          {/*  <div className="control is-expanded">*/}
          {/*    <div className="control">*/}
          {/*      <textarea*/}
          {/*        className="input"*/}
          {/*        name="avatarDescription"*/}
          {/*        placeholder="Avatar description (optional)"*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*    <p className="help">1:1 images are best</p>*/}
          {/*  </div>*/}
          {/*</div>*/}

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

          {/*<div className="checkboxes">*/}
          {/*  <label className="checkbox">*/}
          {/*    <input name="bot" type="checkbox" /> Is Bot?*/}
          {/*  </label>*/}
          {/*</div>*/}

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
