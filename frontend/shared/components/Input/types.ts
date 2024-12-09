import { ComponentProps } from "react";

export interface IInputProps extends ComponentProps<"input"> {
  label?: string;
  errors?: string[];
}
