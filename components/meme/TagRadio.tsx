import Tag from '@/components/meme/Tag';
import { Label } from '@/components/ui/Form';
import type { Tag as TagType } from '@/types/helper.types';

const TagRadio = ({
  tags,
  name,
  initialValue,
}: {
  tags: Pick<TagType, 'id' | 'name'>[];
  name: string;
  initialValue: string | null;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>태그 선택</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            id={`${name}-${tag.id}`}
            type="radio"
            value={tag.name}
            name={name}
            defaultChecked={tag.id === initialValue}
            label={tag.name}
          />
        ))}
      </div>
    </div>
  );
};

export default TagRadio;
