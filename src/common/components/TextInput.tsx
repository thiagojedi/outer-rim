import { forwardRef, InputHTMLAttributes } from "preact/compat";

import { Label } from "./Label.tsx";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: string;
  error?: string;
  name: string;
  required?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((
  { label, icon, error, ...props },
  ref,
) => {
  const { name, required } = props;
  return (
    <div className="field">
      {label && <Label htmlFor={name} required={required}>{label}</Label>}
      <div className={"control " + (icon ? "has-icons-left" : "")}>
        <input className="input" {...props} ref={ref} />
        {icon && (
          <span className="icon is-small is-left">
            <i className="fas fa-at"></i>
          </span>
        )}
      </div>
      {error && <p className="help is-danger">{error}</p>}
    </div>
  );
});
