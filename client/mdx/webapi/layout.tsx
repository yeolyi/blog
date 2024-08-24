import MdxLayout from '@/page/mdx/MdxLayout';
import { MdxPage } from '@/mdx/MdxPage';

export let WebAPILayout = (props: MdxPage) => {
  return <MdxLayout discussionNumber={10} mdx={props.mdx} />;
};
