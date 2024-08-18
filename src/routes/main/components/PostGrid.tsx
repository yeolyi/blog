import { postRoutePreview } from '@/mdx/post/preview';
import { PostCell } from './post/PostCell';
import { PostGridContainer } from '@/routes/main/components/post/PostGridContainer';

export let PostGrid = () => {
  return (
    <PostGridContainer>
      {postRoutePreview.map(({ title, dateStr, imageSrc, path }) => (
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
