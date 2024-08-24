import MdxLayout from '@/client/page/mdx/MdxLayout';

export let NotFound = () => {
  return <MdxLayout mdx={import('./notFound.mdx')} />;
};
