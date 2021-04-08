import styled from "styled-components";

export const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;
  border-radius: 8px;

  &:hover {
    background: #171212;
    color: #ffffff;
  }

  &:hover > svg > g {
    fill: #ffffff;
    stroke: #ffffff;
  }
`;
