import { getMemes } from '@/app/[locale]/memes/actions';
import type { Meme, Tag } from '@/types/meme';
import { create } from 'zustand';

// 스토어 상태 타입 정의 (코드 생성용)
type State = {
  memes: Meme[];
  allTags: Tag[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  selectedTag: string | undefined;
  selectedMeme: Meme | null;
};

export const useMemeStore = create<State>((set, get) => ({
  // 초기 상태 - 확인안함이 기본 선택
  memes: [],
  allTags: [],
  page: 1,
  loading: false,
  hasMore: true,
  selectedTag: '확인안함',
  selectedMeme: null,

  // 상태 설정 함수
  setAllTags: (tags: Tag[]) => set({ allTags: tags }),
  setMemes: (memes: Meme[]) => set({ memes }),
  setPage: (page: number) => set({ page }),
  setLoading: (loading: boolean) => set({ loading }),
  setHasMore: (hasMore: boolean) => set({ hasMore }),
  setSelectedTag: (tag?: string) => set({ selectedTag: tag }),
  setSelectedMeme: (meme: Meme | null) => set({ selectedMeme: meme }),

  updateMeme: (updatedMeme: Meme) =>
    set((state: State) => ({
      memes: state.memes.map((meme: Meme) =>
        meme.id === updatedMeme.id ? updatedMeme : meme,
      ),
      selectedMeme:
        state.selectedMeme?.id === updatedMeme.id
          ? updatedMeme
          : state.selectedMeme,
    })),
  deleteMeme: (memeId: string) =>
    set((state: State) => ({
      memes: state.memes.filter((meme: Meme) => meme.id !== memeId),
      selectedMeme:
        state.selectedMeme?.id === memeId ? null : state.selectedMeme,
    })),

  // 비즈니스 로직 함수
  loadMoreMemes: async () => {
    const { loading, hasMore, page, selectedTag } = get();

    if (loading || !hasMore) return;

    set({ loading: true });

    try {
      const nextPage = page + 1;

      // 태그 선택에 따른 필터링 로직
      let result: { data: Meme[]; count: number };
      switch (selectedTag) {
        case '확인함':
          result = await getMemes(undefined, nextPage, 30, false, true); // onlyChecked=true
          break;
        case '확인안함':
          result = await getMemes(undefined, nextPage, 30, true, false); // onlyUnchecked=true
          break;
        default:
          // 일반 태그 선택 시 checked 필터링 없이 모든 항목 표시
          result = await getMemes(selectedTag, nextPage, 30, false, false);
      }

      if (result.data.length === 0) {
        set({ hasMore: false });
      } else {
        set((state: State) => ({
          memes: [...state.memes, ...result.data],
          page: nextPage,
        }));
      }
    } catch (error) {
      console.error('밈 추가 로딩 오류:', error);
    } finally {
      set({ loading: false });
    }
  },

  changeTag: async (tag?: string) => {
    const { loading, selectedTag } = get();

    // 이미 선택된 태그를 다시 선택한 경우 아무것도 하지 않음
    if (loading || selectedTag === tag) return;

    set({
      selectedTag: tag,
      memes: [],
      page: 1,
      hasMore: true,
      loading: true,
      selectedMeme: null,
    });

    try {
      // 태그 선택에 따른 필터링 로직
      let result: { data: Meme[]; count: number };
      switch (tag) {
        case '확인함':
          result = await getMemes(undefined, 1, 30, false, true); // onlyChecked=true
          break;
        case '확인안함':
          result = await getMemes(undefined, 1, 30, true, false); // onlyUnchecked=true
          break;
        default:
          // 일반 태그 선택 시 checked 필터링 없이 모든 항목 표시
          result = await getMemes(tag, 1, 30, false, false);
      }

      set({
        memes: result.data,
        loading: false,
      });
    } catch (error) {
      console.error('태그 변경 중 오류:', error);
      set({ loading: false });
    }
  },

  resetState: () =>
    set({
      memes: [],
      page: 1,
      loading: false,
      hasMore: true,
      selectedTag: '확인안함',
      selectedMeme: null,
    }),
}));
