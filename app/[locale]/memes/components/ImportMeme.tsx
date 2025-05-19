'use client';
import Button from '@/app/[locale]/components/ui/Button';
import Link from '@/app/[locale]/components/ui/Link';
import { crawlImage } from '@/app/[locale]/memes/actions';
import { memeImagesAtom } from '@/app/[locale]/memes/store';
import { useRouter } from '@/i18n/navigation';
import { useSetAtom } from 'jotai';
import { AppWindow, Clipboard, FileCheck, FileJson } from 'lucide-react';
import { useState } from 'react';

export default function ImportMeme() {
  const router = useRouter();
  const setMemeImages = useSetAtom(memeImagesAtom);
  const [shouldOpen, setShouldOpen] = useState('');

  const pasteUrl = async () => {
    const url = await navigator.clipboard.readText();
    if (!url) {
      window.alert('클립보드가 비어있습니다');
      return;
    }

    if (url.includes('/s/')) {
      setShouldOpen(url);
      return;
    }

    const crawlResult = await crawlImage(url);

    if (crawlResult.success) {
      setMemeImages(crawlResult.value);
      router.push('/memes/select');
    } else {
      window.alert(crawlResult.error);
    }
  };

  return (
    <div className="flex gap-2">
      <Button theme="gray" Icon={Clipboard} onClick={pasteUrl}>
        붙여넣기
      </Button>
      {shouldOpen && (
        <Button
          theme="gray"
          Icon={AppWindow}
          onClick={() => {
            setShouldOpen('');
            open('', '_blank');
          }}
        >
          새 창 열기
        </Button>
      )}
      <Link theme="gray" locale="ko" href="/memes/bulk" Icon={FileJson}>
        JSON
      </Link>
      <Link theme="gray" locale="ko" href="/memes/buttons" Icon={FileCheck}>
        중복검사
      </Link>
    </div>
  );
}
