import { styled } from "@pigment-css/react";
import Link from "next/link";

const PostList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PostLi = styled.li`
  cursor: pointer;
  &:hover {
    background-color: white;
  }
  font-size: 1.5rem;
  font-weight: 600;
  padding: 0.5rem 0;
`;

const PostItemLink = styled(Link)`
  display: flex;
  width: 100%;
  gap: 0.5rem;
  text-decoration: none;
`;

const PostItemTitle = styled.span({
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "white",
  [`${PostLi}:hover &`]: {
    color: "black",
  },
});


const PostItemDate = styled.span({
  fontSize: "1.5rem",
  color: "#666",
});

const PostItem = ({
  href,
  date,
  title,
}: {
  href: string;
  date: string;
  title: string;
}) => {
  return (
    <PostLi>
      <PostItemLink href={href}>
        <PostItemTitle>{title}</PostItemTitle>
        <PostItemDate>{date}</PostItemDate>
      </PostItemLink>
    </PostLi>
  );
};

export default Object.assign(PostList, {
  Item: PostItem,
});
