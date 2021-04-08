import React from "react";
import styled from "styled-components";

//#region styles
const StyledLabel = styled.label`
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border-radius: 8px;
  border: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;
//#endregion

//#region types
type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};
//#endregion

//#region component
export const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        id={id}
        data-testid="submit"
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};
//#endregion
