import { Link } from 'react-router-dom';

export type PostCellProps = {
  title: string;
  path: string;
  src?: string;
  dateStr?: string;
};

export const PostCell = ({ title, src, dateStr, path }: PostCellProps) => (
  <li className="group relative mt-[24px] flex w-full list-none flex-col overflow-hidden rounded-[16px] bg-white md:w-[333px] lg:mt-[36px] lg:w-[303px]">
    <Link to={path} className="flex h-full w-full flex-col">
      <img
        src={src}
        className={`relative h-[187px] w-full transform bg-center object-contain p-4 transition-[400ms_cubic-bezier(0.4,0,0.25,1)_0ms,opacity_1s_cubic-bezier(0.4,0,0.25,1)_0ms] group-hover:scale-105 lg:h-[266px]`}
        alt=""
      />
      <div className="flex grow flex-col justify-between p-[24px] lg:p-[32px]">
        <div className="text-[19px] font-bold lg:text-[24px]">{title}</div>
        <div className="mt-[8px] text-[14px] font-semibold text-[#6e6e73] lg:mt-[12px]">
          {dateStr}
        </div>
      </div>
    </Link>
  </li>
);
