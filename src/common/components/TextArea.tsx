import { forwardRef, TextareaHTMLAttributes } from "preact/compat";

import { Label } from "./Label.tsx";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  name: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((
  { label, error, ...props },
  ref,
) => (
  <div className="field">
    <div className="control">
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <div className="control">
        <textarea className="input" {...props} ref={ref} />
      </div>
    </div>
    {error && <p className="help is-danger">{error}</p>}
  </div>
));
