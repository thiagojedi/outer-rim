import { forwardRef, InputHTMLAttributes } from "preact/compat";

export const ImageInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string }
>((props, ref) => {
  return (
    <div className="field is-grouped">
      <div className="file is-boxed">
        <label className="file-label">
          <input
            className="file-input"
            {...props}
            ref={ref}
            type="file"
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">{props.label}</span>
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
  );
});
