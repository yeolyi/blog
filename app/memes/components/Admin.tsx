import { getIsAdmin } from "@/utils/auth";
import { styled } from "@pigment-css/react";
import Link from "next/link";

export default async function Admin() {
const isAdmin = await getIsAdmin();

  return  isAdmin && (
      <AdminContainer>
        <AdminLink href="/memes/upload">밈 추가</AdminLink>
        <AdminLink href="/memes/batch-upload">배치 업로드</AdminLink>
      </AdminContainer>
    );
}

const AdminContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AdminLink = styled(Link)`
  text-decoration: underline;
  color: white;
  cursor: pointer;
`;