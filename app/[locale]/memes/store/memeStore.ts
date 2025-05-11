import type { Meme, Tag } from '@/types/meme';
import { create } from 'zustand';

// Fisher-Yates 셔플 알고리즘
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const useMemeStore = create<{
  // 상태
  key: number;
  memes: Meme[]; // 모든 밈 데이터
  displayedMemes: Meme[]; // 현재 화면에 표시된 밈
  allTags: Tag[];
  selectedTag: string | undefined;
  selectedMeme: Meme | null;
  isHiddenMode: boolean;

  // 상태 설정 함수
  initialize: (memes: Meme[], tags: Tag[]) => void;
  setSelectedTag: (tag?: string) => void;
  setSelectedMeme: (meme: Meme | null) => void;

  // 밈 관리 함수
  updateMeme: (updatedMeme: Meme) => void;
  deleteMeme: (memeId: string) => void;

  // 비즈니스 로직 함수
  shuffleMemes: () => void;
  changeTag: (tag: string) => Promise<void>;
  showHiddenMemes: () => void;
}>((set, get) => ({
  // 초기 상태 - 확인안함이 기본 선택
  key: 0,
  memes: [],
  displayedMemes: [],
  allTags: [],
  loading: false,
  selectedTag: '확인안함',
  selectedMeme: null,
  isHiddenMode: false,

  // 상태 설정 함수
  initialize: (memes, tags) => {
    set({
      memes,
      allTags: tags,
      displayedMemes: memes.filter((meme) => !meme.hidden),
    });
    get().shuffleMemes();
  },
  setSelectedTag: (selectedTag) => set({ selectedTag, key: get().key + 1 }),
  setSelectedMeme: (selectedMeme) => set({ selectedMeme }),

  updateMeme: (updatedMeme) => {
    set((state) => ({
      memes: state.memes.map((meme) =>
        meme.id === updatedMeme.id ? updatedMeme : meme,
      ),
      displayedMemes: state.displayedMemes.map((meme) =>
        meme.id === updatedMeme.id ? updatedMeme : meme,
      ),
      selectedMeme:
        state.selectedMeme?.id === updatedMeme.id
          ? updatedMeme
          : state.selectedMeme,
      key: get().key + 1,
    }));
  },

  deleteMeme: (memeId) =>
    set((state) => ({
      memes: state.memes.filter((meme) => meme.id !== memeId),
      displayedMemes: state.displayedMemes.filter((meme) => meme.id !== memeId),
      selectedMeme:
        state.selectedMeme?.id === memeId ? null : state.selectedMeme,
      key: get().key + 1,
    })),

  // 밈 셔플
  shuffleMemes: () => {
    const { memes } = get();
    const shuffledMemes = shuffleArray(memes);

    set({
      memes: shuffledMemes,
      displayedMemes: shuffledMemes, // 모든 밈을 바로 표시
      selectedTag: undefined,
      isHiddenMode: false,
      key: get().key + 1,
    });
  },

  changeTag: async (tag: string) => {
    const memes = get().memes;

    const filteredMemes = memes.filter((meme) =>
      meme.meme_tags.some((memeTag) => memeTag.tags.name === tag),
    );

    set({
      selectedTag: tag,
      displayedMemes: filteredMemes,
      selectedMeme: null,
      isHiddenMode: false,
      key: get().key + 1,
    });
  },

  showHiddenMemes: () => {
    const { memes } = get();
    set({
      displayedMemes: memes.filter((meme) => meme.hidden),
      isHiddenMode: true,
      key: get().key + 1,
    });
  },
}));
