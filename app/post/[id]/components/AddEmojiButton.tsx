'use client';

import './emoji.css';

const AddEmojiButton = () => {
  return (
    <button
      className="flex items-center border border-[#5E5E5E] px-2 py-1 cursor-pointer hover:bg-white hover:text-black text-white"
      type="button"
    >
      <span className="text-xl">+</span>
    </button>
  );
};

export default AddEmojiButton;
