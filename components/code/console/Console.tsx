'use client';

import { Log } from '../type';

export default function Console({
  logList,
  fit = false,
}: {
  logList: Log[];
  fit?: boolean;
}) {
  if (fit && logList.length === 0) return null;

  return (
    <div
      className={`flex resize-y flex-col overflow-y-scroll rounded bg-slate-50 p-4 text-sm`}
      style={{ height: fit ? undefined : '112px' }}
    >
      {logList.map((log, idx) => (
        <Row key={idx} log={log} />
      ))}
    </div>
  );
}

const Row = ({ log }: { log: Log }) => {
  return (
    <p
      className="whitespace-pre-wrap break-words font-firacode"
      style={{ color: log.type === 'log' ? '#6a737d' : '#ff4040' }}
    >
      {/* 빈 문자열이어도 newline 반영 */}
      {log.data === '' ? ' ' : log.data}
    </p>
  );
};
