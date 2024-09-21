import { jsPageList } from '@/client/mdx/js';
import { postPageList } from '@/client/mdx/post';
import { webapiPageList } from '@/client/mdx/webapi';

export let allMdxPosts = [...jsPageList, ...webapiPageList, ...postPageList];
