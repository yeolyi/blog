const headers = new Headers({
  'User-Agent':
    'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
  Origin: 'https://www.instagram.com',
  Referer: 'https://www.instagram.com/',
});

export const fetchFollowerCnt = async () => {
  try {
    const resp = await fetch(
      'https://i.instagram.com/api/v1/users/web_profile_info/?username=yeolyii',
      { headers },
    );
    const json = await resp.json();
    return json.data.user.edge_followed_by.count as number;
  } catch (e) {
    console.error('인스타그램 fetch 실패: ', e);
    return -1;
  }
};
