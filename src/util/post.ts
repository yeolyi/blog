export const createPostMeta = (title: string, description: string) => ({
  title,
  description,
  openGraph: {
    title,
    description,
  },
});
