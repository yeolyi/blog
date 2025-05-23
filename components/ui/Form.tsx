import clsx from 'clsx';
import type {
  FormHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react';

export const Label = ({
  className,
  htmlFor,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: 왜뜨지
    <label
      htmlFor={htmlFor}
      className={clsx('block mb-2 font-bold text-white', className)}
      {...props}
    />
  );
};

export const LabelGroup = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={clsx(
        'w-full p-2 bg-stone-700 text-white focus:border-white focus:outline-none border-2 border-transparent',
        className,
      )}
      {...props}
    />
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
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <LabelGroup>
      <Label htmlFor={inputProps.name}>{title}</Label>
      <input
        {...inputProps}
        type="file"
        accept="image/*"
        className="w-full text-white bg-stone-700 p-2"
      />
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

export default Object.assign(Form, { Text, Label });
