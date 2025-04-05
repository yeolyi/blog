// utils/mediaType.ts
export function getMediaTypeFromUrl(url: string): "image" | "video" {
  const fileExt = url.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
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
}
