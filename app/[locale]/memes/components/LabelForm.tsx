import type { InputHTMLAttributes } from 'react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';

export default function LabelForm({
  title,
  registerName,
  registerOptions,
  ...inputProps
}: {
  title: string;
  registerName: string;
  registerOptions?: RegisterOptions;
} & InputHTMLAttributes<HTMLInputElement>) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor="title" className="block mb-2 font-bold text-white">
        {title}
      </label>
      <input
        id="title"
        type="text"
        className={'w-full p-2 bg-[#333] text-white border'}
        {...register(registerName, registerOptions)}
        {...inputProps}
      />
      {errors[registerName] && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[registerName].message)}
        </p>
      )}
    </div>
  );
}
