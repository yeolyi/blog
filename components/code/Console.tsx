'use client';

import { useState } from 'react';
import { Log } from './log';

export default function Console({ logList }: { logList: Log[] }) {
  const [expanded, setExpanded] = useState(false);
  const expandable = 1 < logList.length;

  return (
    <button
      className={`relative flex flex-col overflow-y-hidden overflow-x-scroll bg-slate-50 p-4 text-base 
      ${expandable ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={() => setExpanded((x) => !x)}
      aria-label={expanded ? '콘솔 결과 접기' : '콘솔 결과 펼치기'}
    >
      {logList.slice(0, expanded ? logList.length : 1).map((log, idx) => (
        <Row key={idx} log={log} />
      ))}
      {expandable && !expanded && (
        <span className="absolute -bottom-3 blur">
          <Row log={logList[1]} />
        </span>
      )}
      {logList.length === 0 && <Row log={{ type: 'log', data: ' ' }} />}
    </button>
  );
}

const Row = ({ log }: { log: Log }) => {
  return (
    <p
      className="break-words text-left font-firacode"
      style={{
        color: log.type === 'log' ? '#6a737d' : '#ff4040',
      }}
    >
      {log.data}
    </p>
  );
};
