// 입력 글자 수 제한. firestore.rules 의 숫자와 같게 유지해야 합니다.
export const limits = {
  titleMax: 100,
  bodyMax: 5000,
  commentMax: 1000,
  authorNameMax: 30,
  pageSize: 20, // 토론 목록 "더 보기" 한 번에 불러오는 개수
  homeRecentPosts: 5,
  homeRecentResearch: 3,
} as const;
