import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import { renderMarkdown } from '../utils/markdown';
import { DeleteButton } from './DeleteButton';

interface Comment {
  id: string;
  post_id: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  developerNumber: number;
  profiles?: {
    id: string;
    github_id: string | null;
  };
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  deleteAction: (
    formData: FormData,
  ) => Promise<{ success?: boolean; error?: string }>;
}

export async function CommentItem({
  comment,
  postId,
  currentUserId,
  deleteAction,
}: CommentItemProps) {
  const headerT = await getTranslations('Header');
  const commentT = await getTranslations('Comment');
  const githubId = comment.profiles?.github_id;
  const githubUrl = githubId ? `https://github.com/${githubId}` : '#';
  const developerNumber = comment.developerNumber;

  // 마크다운을 HTML로 변환
  const renderedContent = await renderMarkdown(comment.content);

  return (
    <div className="p-4 border border-[#5E5E5E] dark:border-[#5E5E5E]">
      {/* 게시물에 첨부된 경우 prose가 적용되지 않도록 처리 */}
      <div className="not-prose flex justify-between items-start mb-4">
        <p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 hover:underline dark:text-gray-300"
          >
            {headerT('developer', { number: developerNumber })}
          </a>
          <span className="text-xs text-gray-500 mt-2 whitespace-pre">
            {`  ${dayjs(comment.created_at).format(commentT('dateFormat'))}`}
          </span>
        </p>
        {currentUserId === comment.author_id && (
          <DeleteButton
            commentId={comment.id}
            postId={postId}
            deleteAction={deleteAction}
          />
        )}
      </div>

      <div
        className="prose prose-invert"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 마크다운 렌더링을 위해 필요하며, DOMPurify로 HTML을 정화했습니다
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </div>
  );
}
