import MdxLayout from '@/client/page/mdx/MdxLayout';
import { MdxPage } from '@/client/mdx/MdxPage';

export let WebAPILayout = (props: MdxPage) => {
  return <MdxLayout discussionNumber={10} mdx={props.mdx} />;
};
