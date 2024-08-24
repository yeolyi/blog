import { jsPageList } from './js/page';
import { postPageList } from './post/page';
import { webapiPageList } from './webapi/page';

export let allMdxPages = [...jsPageList, ...webapiPageList, postPageList];
