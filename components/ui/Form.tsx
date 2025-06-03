import { getErrMessage } from '@/utils/string';
import clsx from 'clsx';
import { Clipboard, Keyboard } from 'lucide-react';
import type {
  FormHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';

export const Label = ({
  className,
  htmlFor,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> &
  Required<Pick<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>>) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: 왜뜨지
    <label
      htmlFor={htmlFor}
      className={clsx(
        // 라벨 누르다가 텍스트 선택되는거 방지
        'block font-bold text-white cursor-pointer select-none shrink-0',
        className,
      )}
      {...props}
    />
  );
};

const LabelGroup = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div
      className={clsx(
        'w-full bg-stone-700 text-white flex items-center pl-2 focus-within:border-white focus-within:outline-none border-2 border-transparent',
      )}
    >
      <Keyboard size={16} />
      <input
        className={clsx('p-2 w-full focus:outline-none', className)}
        {...props}
      />
    </div>
  );
};

const Text = ({
  title,
  ...inputProps
}: {
  title: string;
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <LabelGroup>
      <Label htmlFor="title">{title}</Label>
      <Input id="title" type="text" {...inputProps} />
    </LabelGroup>
  );
};

export const ImageUploader = ({
  title = '이미지 첨부',
  ...inputProps
}: {
  title?: string;
} & InputHTMLAttributes<HTMLInputElement> &
  Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'name'>>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async (e?: ClipboardEvent) => {
    if (!inputRef.current) return;

    try {
      const clipboardItems = await navigator.clipboard.read();
      const clipboardItem = clipboardItems[0];
      const imageType = clipboardItem.types.find((type) =>
        type.startsWith('image/'),
      );
      if (!imageType) throw new Error('이미지가 없습니다.');

      const blob = await clipboardItem.getType(imageType);
      const extension = imageType.split('/')[1];

      const file = new File([blob], `pasted-image.${extension}`, {
        type: imageType,
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      inputRef.current.files = dataTransfer.files;
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {
      toast.error(`이미지 붙여넣기 실패: ${getErrMessage(err)}`);
    }
  };

  return (
    <LabelGroup>
      <Label htmlFor={inputProps.name}>{title}</Label>
      <div className="flex gap-2">
        <input
          {...inputProps}
          ref={inputRef}
          type="file"
          accept="image/*"
          className="w-full text-white bg-stone-700 p-2 file:cursor-pointer file:text-base file:not-italic text-sm italic file:mr-2"
        />
        <button
          type="button"
          onClick={() => handlePaste()}
          className="bg-stone-700 p-2 text-white hover:bg-stone-600"
          title="클립보드에서 붙여넣기"
        >
          <Clipboard size={20} />
        </button>
      </div>
    </LabelGroup>
  );
};

const Form = ({
  children,
  ...props
}: FormHTMLAttributes<HTMLFormElement> & { children: React.ReactNode }) => {
  return (
    <form {...props} className={clsx('flex flex-col gap-8', props.className)}>
      {children}
    </form>
  );
};

export default Object.assign(Form, { Text, Label, Image: ImageUploader });
