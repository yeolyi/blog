import { signOut, signInWithGithub } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { styled } from "@pigment-css/react";
import NextLink from "next/link";
import Button from "./Button";

export default async function Header() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <Container>
      <HomeLink href="/">seongyeol</HomeLink>
      <RightContainer>
        {user.user ? (
          <Button onClick={signOut}>
            로그아웃
          </Button>
        ) : (
          <Button onClick={signInWithGithub}>
            GitHub 로그인
          </Button>
        )}
      </RightContainer>
    </Container>
  );
}

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const HomeLink = styled(NextLink)`
  color: #e0e0e0;
  font-size: 2.5rem;
  font-weight: 700;
  text-decoration: none;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
