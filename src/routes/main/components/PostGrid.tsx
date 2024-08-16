import { PostCell } from './post/PostCell';
import { PostGridContainer } from '@/routes/main/components/post/PostGridContainer';
import { postCellProps } from '@/mdx/post/preview';

export let PostGrid = () => {
  return (
    <PostGridContainer>
      {postCellProps.map((prop) => (
        <PostCell key={prop.title} {...prop} />
      ))}
    </PostGridContainer>
  );
};
