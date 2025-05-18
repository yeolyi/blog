import type { Tag } from '@/types/meme';
import clsx from 'clsx';
import type {
  FormHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react';
import {
  type RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form';

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

const Input = ({
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
  registerName,
  registerOptions,
  ...inputProps
}: {
  title: string;
  registerName: string;
  registerOptions?: RegisterOptions;
} & InputHTMLAttributes<HTMLInputElement>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <LabelGroup>
      <Label htmlFor="title">{title}</Label>
      <Input
        id="title"
        type="text"
        className={errors[registerName] ? 'border-red-500' : 'border-[#555]'}
        {...register(registerName, registerOptions)}
        {...inputProps}
      />
      {errors[registerName] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[registerName]?.message as string}
        </p>
      )}
    </LabelGroup>
  );
};

const TagList = ({
  registerName,
  allTags,
}: {
  registerName: string;
  allTags: Tag[];
}) => {
  const { control } = useFormContext();
  const { field } = useController({ name: registerName, control });
  const value = field.value as string;
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const onClickTag = (tag: string) => {
    if (tags.includes(tag)) {
      field.onChange(tags.filter((t) => t !== tag).join(','));
    } else {
      field.onChange([...tags, tag].join(','));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="tagInput">태그</Label>
      <Input
        id="tagInput"
        type="text"
        placeholder="태그1, 태그2, 태그3"
        autoFocus
        {...field}
      />

      {/* 태그 목록 */}
      <TagContainer>
        {allTags.map((tag) => (
          <TagItem
            key={tag.id}
            tag={tag}
            onClickTag={() => onClickTag(tag.name)}
            isSelected={tags.includes(tag.name)}
          />
        ))}
      </TagContainer>
    </div>
  );
};

export const TagContainer = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-wrap gap-1">{children}</div>;
};

export const TagItem = ({
  tag,
  onClickTag,
  isSelected,
}: {
  tag: Tag;
  onClickTag: () => void;
  isSelected: boolean;
}) => {
  return (
    <button
      key={tag.id}
      type="button"
      onClick={onClickTag}
      className={clsx(
        'text-sm px-4 py-2 border-2 text-white cursor-pointer',
        isSelected ? 'border-stone-400' : 'border-stone-700',
      )}
    >
      {tag.name}
    </button>
  );
};

const Checkbox = ({
  label,
  registerName,
  registerOptions,
}: {
  label: string;
  registerName: string;
  registerOptions?: RegisterOptions;
}) => {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={registerName}>{label}</Label>
      <input
        type="checkbox"
        className="h-8 w-8 cursor-pointer border"
        {...register(registerName, registerOptions)}
      />
    </div>
  );
};

const Form = ({
  children,
  ...props
}: FormHTMLAttributes<HTMLFormElement> & { children: React.ReactNode }) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <form {...props} className={clsx('flex flex-col gap-8', props.className)}>
      {children}
      {errors.root?.message && (
        <p className="text-red-500 text-sm">{errors.root?.message}</p>
      )}
    </form>
  );
};

export default Object.assign(Form, {
  Text,
  TagList,
  Checkbox,
  Label,
});
