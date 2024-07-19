'use client';

import { Log } from '../type';

export default function Console({ logList }: { logList: Log[] }) {
  return (
    <div
      className={`flex h-[52px] resize-y flex-col overflow-y-hidden overflow-x-scroll rounded bg-slate-50 p-4 text-sm`}
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
      className="break-words text-left font-firacode leading-[1.3rem]"
      style={{
        color: log.type === 'log' ? '#6a737d' : '#ff4040',
      }}
    >
      {/* 빈 문자열이어도 newline 반영 */}
      {log.data === '' ? ' ' : log.data}
    </p>
  );
};
