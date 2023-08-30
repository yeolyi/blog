import CustomMDXRemote from '@/components/CustomMDXRemote';
import PageHeader from '@/components/PageHeader';
import getFilledMD from '@/lib/getFilledMD';
import { getAboutMDPath } from '@/lib/getPath';

export default async function Home() {
  const aboutMDPath = getAboutMDPath();
  const source = await getFilledMD(aboutMDPath);

  return (
    <>
      <PageHeader bottomMargin>About</PageHeader>
      <CustomMDXRemote source={source.content} />
    </>
  );
}
