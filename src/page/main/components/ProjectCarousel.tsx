import { Carousel } from './carousel/Carousel';
import { WideTile, WideTileProps } from './carousel/WideTile';
import { CserealBg } from './post/CserealBg';
import InstaBg from './post/InstaBg';

export let ProjectCarousel = () => {
  return (
    <Carousel wide>
      {projectList.map((prop) => (
        <WideTile key={prop.href} {...prop} />
      ))}
    </Carousel>
  );
};

let projectList: WideTileProps[] = [
  {
    name: 'cse.snu.ac.kr',
    copy: '서울대학교 컴퓨터공학부 홈페이지 리뉴얼에 프론트엔드 개발자로 참여했어요.',
    href: 'https://cse.snu.ac.kr',
    bg: <CserealBg />,
  },
  {
    name: '@yeolyii',
    copy: '인스타그램 개발 계정에 개발 일상을 나눠요. 최근에 팔로워 1만명을 넘었습니다 🎉',
    href: 'https://instagram.com/yeolyii',
    bg: <InstaBg />,
  },
];
