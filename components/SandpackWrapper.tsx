'use client';

import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react';

const _ = (props: SandpackProps) => (
  <div className="not-prose">
    <Sandpack {...props} />
  </div>
);

export default _;
