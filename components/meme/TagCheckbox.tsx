import Tag from '@/components/meme/Tag';
import type { Tag as TagType } from '@/types/helper.types';

const TagCheckbox = ({
  tags,
  name,
  initialValues,
}: {
  tags: Pick<TagType, 'id' | 'name'>[];
  name: string;
  initialValues: string[] | null;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          id={`${name}-${tag.id}`}
          type="checkbox"
          value={tag.name}
          name={name}
          defaultChecked={initialValues?.includes(tag.id)}
          label={tag.name}
        />
      ))}
    </div>
  );
};

export default TagCheckbox;
