import MdxLayout from '@/client/page/mdx/MdxLayout';
import { MdxPage } from '@/client/mdx/MdxPage';

export let JSLayout = (props: MdxPage) => {
  return <MdxLayout discussionNumber={2} mdx={props.mdx} />;
};
