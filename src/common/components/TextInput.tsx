import { forwardRef, InputHTMLAttributes } from "preact/compat";
import { ReadonlySignal } from "@preact/signals";

import { Label } from "./Label.tsx";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: string;
  error?: string | ReadonlySignal<string>;
  name: string;
  required?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((
  { label, icon, error, ...props },
  ref,
) => (
  <div className="field">
    {label && (
      <Label htmlFor={props.name} required={props.required}>{label}</Label>
    )}
    <div className={"control " + (icon ? "has-icons-left" : "")}>
      <input className="input" ref={ref} {...props} />
      {icon && (
        <span className="icon is-small is-left">
          <i className="fas fa-at"></i>
        </span>
      )}
    </div>
    {error && <p className="help is-danger">{error}</p>}
  </div>
));
