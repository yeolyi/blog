import Button from '@/app/[locale]/components/ui/Button';
import {
  checkAllSimilarMemes,
  updateMissingEmbeddings,
} from '@/app/[locale]/memes/actions';
import { RefreshCcw } from 'lucide-react';

export default function MemeButtons() {
  return (
    <div className="flex gap-8 mx-auto my-auto">
      <Button
        onClick={updateMissingEmbeddings}
        type="button"
        theme="gray"
        Icon={RefreshCcw}
      >
        임베딩 업데이트
      </Button>

      <Button
        onClick={checkAllSimilarMemes}
        type="button"
        theme="gray"
        Icon={RefreshCcw}
      >
        모든 밈 비교
      </Button>
    </div>
  );
}
