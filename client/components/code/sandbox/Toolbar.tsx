type Props = {
  presetName: string;
  refresh?: () => void;
};

export const Toolbar = ({ presetName, refresh }: Props) => {
  return (
    <div className="flex justify-end gap-3 px-1 font-firacode text-sm">
      <p className="text-black dark:text-white">
        {presetName.toLocaleUpperCase()}
      </p>
      {refresh && (
        <button
          className="text-neutral-300 hover:text-neutral-400"
          onClick={refresh}
        >
          refresh
        </button>
      )}
    </div>
  );
};
