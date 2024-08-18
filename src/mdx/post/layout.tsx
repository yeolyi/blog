import MdxLayout from '@/components/layout/MdxLayout';
import { mdxComponents } from '@/components/mdxComponents';
import { Page } from '@/mdx/page';

export let PostLayout = (props: Page) => {
  return (
    <MdxLayout>
      <props.Mdx components={mdxComponents} />
    </MdxLayout>
  );
};
