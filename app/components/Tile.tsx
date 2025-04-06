import { styled } from "@pigment-css/react";

const Tile = styled.div`
  display: flex;
  gap: 1rem;
`;

const TileItemStyle = styled.div`
  border: 1px solid #5e5e5e;
  &: hover {
    background-color: white;
  }
  cursor: pointer;
`;

const TileItemTitle = styled.h3({
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "white",
  padding: "0.5rem",
  [`${TileItemStyle}:hover &`]: {
    color: "black",
  },
});

const TileItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return <TileItemStyle>
    {children}
    <TileItemTitle>{title}</TileItemTitle>
  </TileItemStyle>;
};

export default Object.assign(Tile, {
  Item: TileItem,
});
