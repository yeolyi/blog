import { globalCss, styled } from "@pigment-css/react";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      {children}
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 10rem auto 30vh auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  & * {
    color: #f0f0f0;
  }

  & h1 {
    font-size: 2rem;
    font-weight: 600;
  }

  & h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  & h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  & p {
    font-size: 1rem;
    font-weight: 400;
  }

  & a {
    color: #f0f0f0;
  }

  & ul {
    list-style: disc;
  }

  & ol {
    list-style: decimal;
  }

  & blockquote {
    border-left: 2px solid #f0f0f0;
    padding-left: 1rem;
  }

  & code {
    background-color: #f0f0f0;
    color: #000;
  }

  & pre {
    background-color: #f0f0f0;
    color: #000;
    padding: 1rem;
    border-radius: 0.25rem;
  }

  & img {
    max-width: 100%;
    height: auto;
  }
`;
