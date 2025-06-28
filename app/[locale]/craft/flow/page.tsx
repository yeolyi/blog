'use client';

import Flow from '@/components/cs/flow';
import dynamic from 'next/dynamic';

const FlowPlayground = () => {
  return (
    <div className="flex flex-col justify-center mt-24 p-2">
      <Flow id="flow-playground" height={screen.height - 400} />
    </div>
  );
};

export default dynamic(() => Promise.resolve(FlowPlayground), {
  ssr: false,
});
