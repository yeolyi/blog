import MdxLayout from '@/page/mdx/MdxLayout';
import { MdxPage } from '@/mdx/MdxPage';

export let PostLayout = (props: MdxPage) => {
  return <MdxLayout mdx={props.mdx} />;
};
