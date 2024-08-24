import { jsPageList } from '@/client/mdx/js/page';
import { postPageList } from '@/client/mdx/post/page';
import { webapiPageList } from '@/client/mdx/webapi/page';

export let allMdxPosts = [...jsPageList, ...webapiPageList, ...postPageList];
