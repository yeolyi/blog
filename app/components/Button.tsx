import { styled } from "@pigment-css/react";

const Button = styled.button`
  color: black;
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;

  &:hover {
    background-color: black;
    color: white;
  }
`;

export default Button;