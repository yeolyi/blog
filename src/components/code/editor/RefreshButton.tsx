import { VscRefresh } from 'react-icons/vsc';

export default function RefreshButton({ refresh }: { refresh: () => void }) {
  return (
    <button onClick={refresh}>
      <VscRefresh className="h-6 w-6 text-neutral-300 hover:drop-shadow active:text-neutral-500" />
    </button>
  );
}
