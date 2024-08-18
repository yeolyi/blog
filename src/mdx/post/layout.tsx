import MdxLayout from '@/components/layout/MdxLayout';
import { mdxComponents } from '@/components/mdxComponents';
import { HTMLTemplate } from '@/HTMLTemplate';
import { Page } from '@/mdx/page';

export let PostLayout = (props: Page) => {
  return (
    <HTMLTemplate {...props}>
      <MdxLayout>
        <props.Mdx components={mdxComponents} />
      </MdxLayout>
    </HTMLTemplate>
  );
};
