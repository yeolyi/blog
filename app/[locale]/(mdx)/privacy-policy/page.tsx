export default function PrivacyPolicy() {
  return (
    <div className="prose prose-invert">
      <h1>개인정보처리방침</h1>
      <p>
        yeolyi.com은「개인정보 보호법」등 관련 법령에 따라 이용자의 개인정보를
        보호하고, 권익을 존중하며, 아래와 같은 내용으로 개인정보를 처리합니다.
      </p>
      <ol>
        <li>
          <strong>수집하는 개인정보 항목</strong>
          <ul>
            <li>수집 항목: 이메일 주소</li>
            <li>수집 방법: 홈페이지를 통한 직접 입력</li>
          </ul>
        </li>
        <li>
          <strong>개인정보의 수집 및 이용 목적</strong>
          <ul>
            <li>뉴스레터 발송</li>
            <li>비영리 정보 제공 및 커뮤니케이션</li>
          </ul>
        </li>
        <li>
          <strong>개인정보 보유 및 이용 기간</strong>
          <ul>
            <li>이용자가 구독 해지를 요청할 때까지 보유 및 이용</li>
            <li>구독 해지 시 즉시 파기</li>
          </ul>
        </li>
        <li>
          <strong>개인정보 제3자 제공</strong>
          <ul>
            <li>수집된 이메일은 제3자에게 제공하지 않습니다.</li>
          </ul>
        </li>
        <li>
          <strong>개인정보 처리 위탁</strong>
          <ul>
            <li>
              수집된 개인정보는 Supabase(클라우드 데이터베이스 서비스)를 통해
              안전하게 저장·관리됩니다.
            </li>
          </ul>
        </li>
        <li>
          <strong>정보주체의 권리</strong>
          <ul>
            <li>
              이용자는 언제든지 구독 해지, 개인정보 열람·수정·삭제를 요청할 수
              있습니다.
            </li>
            <li>문의: 이성열(yeolyi1310@gmail.com)</li>
          </ul>
        </li>
      </ol>
    </div>
  );
}
