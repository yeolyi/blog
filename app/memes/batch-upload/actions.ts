"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/actions/supabase";

interface Meme {
  title: string;
  description?: string;
  media_url: string;
  tags?: string[];
}

const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`재시도 중... (${attempt}/${maxRetries})`);
      }
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt);
        console.log(`오류 발생, ${waitTime}ms 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error("최대 재시도 횟수 초과");
};

export async function uploadMemes(memes: Meme[]) {
  try {
    let progress = 0;
    const blobList = await Promise.all(
      memes.map(async (meme) => {
        const mediaResponse = await retry(async () => {
          const response = await fetch(meme.media_url);
          if (!response.ok) {
            throw new Error(`미디어 다운로드 실패 (${response.status})`);
          }
          return response;
        });

        progress++;
        console.log(`${progress}번째 밈 다운로드 완료`);
        return mediaResponse.blob();
      })
    );

    console.log("blobList 완료");
    progress = 0;

    const urlList = await Promise.all(
      blobList.map(async (blob, idx) => {
        const fileExt =
          memes[idx].media_url.split(".").pop()?.split("?")[0] || "";
        const fileName = `${uuidv4()}.${fileExt}`;

        const publicUrl = await retry(async () => {
          return await uploadFileToSupabase(fileName, blob);
        });
        progress++;
        console.log(`${progress}번째 밈 업로드 완료`);
        return publicUrl;
      })
    );

    console.log("urlList 완료");

    const supabase = await createClient();

    for (let i = 0; i < memes.length; i++) {
      const meme = memes[i];
      const url = urlList[i];

      await supabase
        .from("memes")
        .insert([
          {
            title: meme.title,
            description: meme.description || null,
            media_url: url,
          },
        ])
        .select()
        .single()
        .throwOnError();

      console.log(`${i + 1}번째 밈 업로드 완료`);
    }

    revalidatePath("/memes");
  } catch (error) {
    console.log(error);
  }
}
