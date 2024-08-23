import { jsPageList } from '@/mdx/js/page';
import { postPageList } from '@/mdx/post/page';
import { webapiPageList } from '@/mdx/webapi/page';

export let allMdxPages = [...jsPageList, ...webapiPageList, postPageList];
