export const fetchFollowerCnt = async () => {
  const resp = await fetch(
    'https://i.instagram.com/api/v1/users/web_profile_info/?username=yeolyii',
    {
      headers: {
        'User-Agent':
          'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
        Origin: 'https://www.instagram.com',
        Referer: 'https://www.instagram.com',
      },
      next: { revalidate: 60 },
    },
  );

  if (resp.status !== 200) throw new Error(`${resp.status}`);

  const json = await resp.json();
  const cnt = json?.data?.user?.edge_followed_by?.count;

  if (cnt === undefined) throw new Error('JSON structure');

  return cnt;
};
