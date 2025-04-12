import { getIsAdmin } from "@/utils/auth";
import Link from "next/link";

export default async function Admin() {
const isAdmin = await getIsAdmin();

  return isAdmin && (
    <div className="flex gap-4 mb-4">
      <Link href="/memes/upload" className="underline text-white cursor-pointer">밈 추가</Link>
      <Link href="/memes/batch-upload" className="underline text-white cursor-pointer">배치 업로드</Link>
    </div>
  );
}