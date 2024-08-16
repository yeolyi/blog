declare module '*.mdx' {
  let title: string;
  let description: string;
  export { title, description };

  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}
