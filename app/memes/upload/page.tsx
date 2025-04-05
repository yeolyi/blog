"use client";

import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

interface Tag {
  id: string;
  name: string;
}

interface MemeTag {
  tag_id: string;
  tags: Tag;
}

interface FormInputs {
  title: string;
  description: string;
  file: FileList;
  tags: string;
}

export default function UploadMeme() {
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<FormInputs>({
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  });
  const router = useRouter();

  // 확장자로 미디어 타입 판단하는 함수 추가
  const getMediaTypeFromFile = (file: File): "image" | "video" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";

    // MIME 타입으로 판단 안되면 확장자로 판단
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    const videoExtensions = [
      "mp4",
      "webm",
      "ogg",
      "mov",
      "avi",
      "wmv",
      "flv",
      "mkv",
    ];
    return videoExtensions.includes(fileExt) ? "video" : "image";
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const file = data.file?.[0];

    if (!file) {
      setFormError("file", { message: "파일을 선택해주세요." });
      return;
    }

    // 파일 타입 자동 감지
    const mediaType = getMediaTypeFromFile(file);

    // 타입에 맞는 파일인지 확인
    if (mediaType === "image" && !file.type.startsWith("image/")) {
      setFormError("file", { message: "이미지 파일만 업로드 가능합니다" });
      return;
    }

    if (mediaType === "video" && !file.type.startsWith("video/")) {
      setFormError("file", { message: "비디오 파일만 업로드 가능합니다" });
      return;
    }

    try {
      // 1. 현재 사용자 정보 확인
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw new Error(`인증 오류: ${authError.message}`);
      if (!user) throw new Error("로그인이 필요합니다.");

      // 2. 파일 업로드를 위한 고유 이름 생성
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 3. 스토리지에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from("memes")
        .upload(filePath, file);

      if (uploadError)
        throw new Error(`파일 업로드 실패: ${uploadError.message}`);

      // 4. 업로드된 파일의 공개 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("memes").getPublicUrl(filePath);

      // 5. memes 테이블에 정보 저장
      const { data: meme, error: memeError } = await supabase
        .from("memes")
        .insert([
          {
            title: data.title,
            description: data.description,
            media_url: publicUrl,
          },
        ])
        .select()
        .single();

      if (memeError) throw new Error(`밈 정보 저장 실패: ${memeError.message}`);

      // 6. 태그 처리 (입력된 경우)
      const memeTags: MemeTag[] = [];

      if (data.tags.trim()) {
        const tagNames = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        for (const tagName of tagNames) {
          // 6-1. 기존 태그 찾기
          const { data: existingTag } = await supabase
            .from("tags")
            .select("id, name")
            .eq("name", tagName)
            .single();

          let tagId, tagData;

          // 6-2. 태그가 없으면 새로 생성
          if (!existingTag) {
            const { data: newTag, error: tagError } = await supabase
              .from("tags")
              .insert([{ name: tagName }])
              .select()
              .single();

            if (tagError)
              throw new Error(
                `태그 생성 실패 (${tagName}): ${tagError.message}`
              );
            tagId = newTag.id;
            tagData = newTag;
          } else {
            tagId = existingTag.id;
            tagData = existingTag;
          }

          // 6-3. 밈과 태그 연결
          const { data: memeTagData, error: memeTagError } = await supabase
            .from("meme_tags")
            .insert([
              {
                meme_id: meme.id,
                tag_id: tagId,
              },
            ])
            .select("tag_id")
            .single();

          if (memeTagError)
            throw new Error(`밈-태그 연결 실패: ${memeTagError.message}`);

          // 6-4. 반환할 태그 정보 추가
          memeTags.push({
            tag_id: memeTagData.tag_id,
            tags: tagData,
          });
        }
      }

      // 8. 폼 초기화
      reset();
      router.push("/memes");
    } catch (err) {
      console.error("업로드 중 오류 발생:", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

      // 폼 전체 에러 설정
      setFormError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.message && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid red",
          }}
        >
          <strong>오류:</strong> {errors.root.message}
        </div>
      )}

      <div>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "제목을 입력해주세요" })}
        />
        {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description">설명 (선택사항)</label>
        <textarea id="description" {...register("description")} rows={3} />
      </div>

      <div>
        <label htmlFor="file">파일</label>
        <input
          id="file"
          type="file"
          {...register("file", { required: "파일을 선택해주세요" })}
          accept="image/*,video/*" // 모든 이미지와 비디오 파일 허용
        />
        {errors.file && <p style={{ color: "red" }}>{errors.file.message}</p>}
      </div>

      <div>
        <label htmlFor="tags">태그 (쉼표로 구분)</label>
        <input
          id="tags"
          type="text"
          {...register("tags")}
          placeholder="예: 재밌는, 귀여운, 대학생"
        />
      </div>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? `업로드 중...` : "업로드"}
        </button>
      </div>
    </form>
  );
}
