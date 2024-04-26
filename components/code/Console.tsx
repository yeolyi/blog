import { Log } from './log';

export default function Console({ logList }: { logList: Log[] }) {
  return (
    <div
      className={`flex max-h-[500px] flex-col overflow-y-scroll bg-slate-50 p-4 text-sm`}
    >
      {logList.map((log, idx) => (
        <Row key={idx} log={log} />
      ))}
      {logList.length === 0 && (
        <Row
          log={logList.length === 0 ? { type: 'log', data: ' ' } : logList[0]}
        />
      )}
    </div>
  );
}

const Row = ({ log }: { log: Log }) => {
  const text =
    log.data instanceof Array
      ? log.data.map((x) => String(x)).join(', ')
      : String(log.data);

  return (
    <p
      className="text-wrap break-words"
      style={{
        fontFamily: 'Fira Code',
        color: log.type === 'log' ? '#6a737d' : '#ff4040',
      }}
    >
      {text === '' ? ' ' : text}
    </p>
  );
};
