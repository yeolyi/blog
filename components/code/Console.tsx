import { Log } from './log';

export default function Console({ logList }: { logList: Log[] }) {
  return (
    <div
      className={`flex max-h-[500px] min-h-[52px] flex-col overflow-y-scroll bg-slate-50 p-4 text-sm`}
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
      className="text-wrap break-words"
      style={{
        fontFamily: 'Fira Code',
        color: log.type === 'log' ? '#6a737d' : '#ff4040',
      }}
    >
      {log.data}
    </p>
  );
};
