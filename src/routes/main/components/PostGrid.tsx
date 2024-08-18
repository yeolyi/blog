import { postPageList } from '@/mdx/post/page';
import { PostCell } from './post/PostCell';
import { PostGridContainer } from '@/routes/main/components/post/PostGridContainer';

export let PostGrid = () => {
  return (
    <PostGridContainer>
      {postPageList.map(({ title, dateStr, imageSrc, path }) => (
        <PostCell
          key={title}
          title={title}
          src={imageSrc}
          dateStr={dateStr}
          path={path}
        />
      ))}
    </PostGridContainer>
  );
};
