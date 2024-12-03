import { useState } from "preact/hooks";
import { Card } from "../common/components/Card.tsx";
import { FunctionComponent } from "preact";

export const UserForm: FunctionComponent<{ method: "POST" | "PATCH" }> = (
  { method },
) => {
  const [handle, setHandle] = useState<string>("username");
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  return (
    <form method={method} className="form">
      <div className="field">
        <label htmlFor="handle" className="label">Handle</label>
        <div className="control has-icons-left">
          <input
            type="text"
            className="input"
            name="handle"
            placeholder="username"
            onChange={(e) => setHandle(e.currentTarget.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-at"></i>
          </span>
        </div>
        <p className="help is-danger">This cannot be changed in the future</p>
      </div>

      <div className="columns is-flex-direction-row-reverse">
        <div className="column">
          <Card
            title={name}
            subtitle={`@${handle}`}
            content={bio}
          />
        </div>

        <div className="column">
          <div className="field is-grouped">
            <div className="file is-boxed">
              <label className="file-label">
                <input className="file-input" type="file" name="header" />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Header</span>
                </span>
              </label>
            </div>

            <div className="control is-expanded">
              <div className="control">
                <textarea
                  className="input"
                  name="headerDescription"
                  placeholder="Header description (optional)"
                />
              </div>
              <p className="help">600x200 images are best</p>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="file is-boxed">
              <label className="file-label">
                <input className="file-input" type="file" name="avatar" />
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

          <div className="field">
            <div className="control">
              <label htmlFor="name" className="label">Display name</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  name="name"
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label htmlFor="Bio" className="label">Bio</label>
              <div className="control">
                <textarea
                  name="bio"
                  className="input"
                  onChange={(e) => setBio(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>

          <br />

          <p className="field is-grouped">
            <div className="control">
              <input type="submit" className="button is-primary" value="Save" />
            </div>

            <div className="control">
              <input type="reset" className="button" />
            </div>
          </p>
        </div>
      </div>
    </form>
  );
};
