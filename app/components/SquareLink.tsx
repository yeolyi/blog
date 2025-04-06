import { styled } from "@pigment-css/react";
import Link from "next/link";

const SquareLink = styled(Link)`
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

export default SquareLink;
