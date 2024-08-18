import MdxLayout from '@/components/layout/MdxLayout';
import { mdxComponents } from '@/components/mdxComponents';
import { HTMLTemplate } from '@/HTMLTemplate';
import { Page } from '@/mdx/page';

export let WebAPILayout = (props: Page) => {
  return (
    <HTMLTemplate {...props}>
      <MdxLayout discussionNumber={10}>
        <props.Mdx components={mdxComponents} />
      </MdxLayout>
    </HTMLTemplate>
  );
};
