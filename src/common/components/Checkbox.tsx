import { forwardRef, InputHTMLAttributes } from "preact/compat";

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, ...props }, ref) => (
  <label className="checkbox">
    <input
      {...props}
      type="checkbox"
      ref={ref}
    />{" "}
    {label}
  </label>
));
