import MdxLayout from '@/components/layout/MdxLayout';
import { mdxComponents } from '@/components/mdxComponents';
import { HTMLTemplate } from '@/HTMLTemplate';
import { Page } from '@/mdx/page';

export let JSLayout = (props: Page & { cssPath: string }) => {
  return (
    <HTMLTemplate {...props}>
      <MdxLayout discussionNumber={2}>
        <props.Mdx components={mdxComponents} />
      </MdxLayout>
    </HTMLTemplate>
  );
};
