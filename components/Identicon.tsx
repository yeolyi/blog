import { minidenticon } from 'minidenticons';
import { type ImgHTMLAttributes, useMemo } from 'react';

interface IdentityIconProps
	extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
	username: string;
	saturation?: string | number;
	lightness?: string | number;
}

// https://github.com/laurentpayot/minidenticons/issues/2#issuecomment-1485545388
const IdentityIcon = ({
	username,
	saturation,
	lightness,
	...props
}: IdentityIconProps) => {
	const svgText = useMemo(
		() => minidenticon(username, saturation, lightness),
		[username, saturation, lightness],
	);

	return (
		// biome-ignore lint/performance/noImgElement: Data URI임
		<img
			src={`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`}
			alt={username}
			{...props}
		/>
	);
};

export default IdentityIcon;
