import { FC } from "preact/compat";

type LabelProps = {
  htmlFor?: string;
  required?: boolean;
};

export const Label: FC<LabelProps> = ({ htmlFor, required, children }) => (
  <label htmlFor={htmlFor} className="label">
    {children}
    {required && <span className="has-text-danger">*</span>}
  </label>
);
