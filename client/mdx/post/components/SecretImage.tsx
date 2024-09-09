import { useState } from 'react';

export let SecretImage = ({
  children,
  src,
}: {
  children: string;
  src: string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button
        className="cursor-pointer underline"
        onClick={() => setVisible(!visible)}
      >
        {children}
      </button>
      {visible && <img src={src} />}
    </>
  );
};
