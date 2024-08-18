import MdxLayout from '@/components/layout/MdxLayout';
import { mdxComponents } from '@/components/mdxComponents';
import { Page } from '@/mdx/page';

export let JSLayout = (props: Page) => {
  return (
    <MdxLayout discussionNumber={2}>
      <props.Mdx components={mdxComponents} />
    </MdxLayout>
  );
};
