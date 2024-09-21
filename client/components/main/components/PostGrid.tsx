import { PostGridContainer } from '@/client/components/main/components/post/PostGridContainer';
import { postPageList } from '../../../mdx/post';
import { PostCell } from './post/PostCell';

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
