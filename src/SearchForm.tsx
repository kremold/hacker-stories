import React from "react";
import styled from "styled-components";
import { StyledButton } from "./StyledButton";
import { InputWithLabel } from "./InputWithLabel";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fab, faSearch);

//#region styles
const StyledSearchFrom = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;
//#endregion

//#region types
type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.ChangeEvent<HTMLFormElement>) => void;
};
//#endregion

//#region components
export const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) => (
  <StyledSearchFrom onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <StyledButtonLarge type="button" disabled={!searchTerm}>
      <FontAwesomeIcon icon="search" size="1x" />
    </StyledButtonLarge>
  </StyledSearchFrom>
);
//#endregion
