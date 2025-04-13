import dayjs from 'dayjs';
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
  const githubId = comment.profiles?.github_id;
  const githubUrl = githubId ? `https://github.com/${githubId}` : '#';
  const developerNumber = comment.developerNumber;

  // 마크다운을 HTML로 변환
  const renderedContent = await renderMarkdown(comment.content);

  return (
    <div className="p-4 border border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gray-700 hover:underline dark:text-gray-300"
        >
          #{developerNumber}번째 개발자님
        </a>
        {currentUserId === comment.author_id && (
          <DeleteButton
            commentId={comment.id}
            postId={postId}
            deleteAction={deleteAction}
          />
        )}
      </div>

      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 마크다운 렌더링을 위해 필요하며, DOMPurify로 HTML을 정화했습니다
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      <p className="text-xs text-gray-500 mt-2">
        {dayjs(comment.created_at).format('YYYY년 MM월 DD일 HH:mm')}
      </p>
    </div>
  );
}
