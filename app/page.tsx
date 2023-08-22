import getFilledPost from "@/lib/getFilledPost";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Home() {
  const source = await getFilledPost({ type: "PATH", path: "about.md" });
  return (
    <>
      <h1>About</h1>
      <MDXRemote source={source.content} />
    </>
  );
}
