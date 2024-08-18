import MdxLayout from '@/components/layout/MdxLayout';
import { mdxComponents } from '@/components/mdxComponents';

import { Page } from '@/mdx/page';

export let WebAPILayout = (props: Page) => {
  return (
    <MdxLayout discussionNumber={10}>
      <props.Mdx components={mdxComponents} />
    </MdxLayout>
  );
};
