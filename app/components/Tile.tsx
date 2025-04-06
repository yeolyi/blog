import { styled } from "@pigment-css/react";

const Tile = styled.div`
  display: flex;
  gap: 1rem;
`;

type TileItemProps = {
  size: "75%";
};

const TileItemStyle = styled.div<TileItemProps>({
  border: "1px solid #5e5e5e",
  "&:hover": {
    backgroundColor: "white",
  },
  cursor: "pointer",
  position: "relative",
  variants: [
    {
      props: { size: "75%" },
      style: {
        width: "75%",
        height: "75%",
      },
    },
  ],
});

const TileItemTitle = styled.h3({
  position: "absolute",
  bottom: "10px",
  left: "10px",
  backgroundColor: "black",
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "white",
  [`${TileItemStyle}:hover &`]: {
    color: "black",
    backgroundColor: "white",
  },
});

const TileItem = ({
  title,
  children,
  size,
}: {
  title: string;
  children: React.ReactNode;
  size: TileItemProps["size"];
}) => {
  return (
    <TileItemStyle size={size}>
      {children}
      <TileItemTitle>{title}</TileItemTitle>
    </TileItemStyle>
  );
};

export default Object.assign(Tile, {
  Item: TileItem,
});
