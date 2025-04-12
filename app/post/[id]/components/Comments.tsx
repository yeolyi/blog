import { Suspense } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentsProps {
  postId: string;
}

// 로딩 상태 컴포넌트
function CommentLoading() {
  return (
    <div className="py-4 text-center">
      <div
        className="inline-block h-6 w-6 animate-spin border-4 border-solid border-gray-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        aria-hidden="true"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          로딩 중...
        </span>
      </div>
      <p className="mt-2 text-gray-500">로딩 중...</p>
    </div>
  );
}

// 댓글 작성 로딩 컴포넌트
function CommentFormLoading() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">댓글 작성</h2>
      <div className="h-24 bg-gray-200 dark:bg-gray-800 animate-pulse" />
    </div>
  );
}

export default function Comments({ postId }: CommentsProps) {
  return (
    <div className="mt-10 border-t border-gray-300 pt-8 dark:border-gray-700">
      <Suspense fallback={<CommentFormLoading />}>
        <CommentForm postId={postId} />
      </Suspense>

      <div className="mt-10">
        <Suspense fallback={<CommentLoading />}>
          <CommentList postId={postId} />
        </Suspense>
      </div>
    </div>
  );
}
