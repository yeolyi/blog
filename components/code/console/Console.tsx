'use client';

import { useState } from 'react';
import { Log } from '../type';

export default function Console({
  logList,
  expandedDefault = true,
}: {
  logList: Log[];
  expandedDefault?: boolean;
}) {
  const [expanded, setExpanded] = useState(expandedDefault);
  const expandable = 1 < logList.length;

  return (
    <button
      className={`relative flex flex-col overflow-y-hidden overflow-x-scroll bg-slate-50 p-4 text-sm
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
      {/* 빈 문자열이어도 newline 반영 */}
      {log.data === '' ? ' ' : log.data}
    </p>
  );
};
