// 사이트 전체에서 쓰는 기본 정보는 모두 여기서 고칩니다.
// [ ] 로 둘러싸인 값은 실제 내용으로 바꿔 주세요.
export const site = {
  siteName: '[사이트 이름] 연구·수업 아카이브',
  professorName: '[교수 이름]',
  department: '[대학교] 스페인어중남미학과',
  intro:
    '[소개 문구] 스페인어권 문학·문화·언어를 연구하고 가르칩니다. 이곳에서 연구와 수업 자료를 정리하고, 학생들과 함께 토론합니다.',
  contactEmail: '[연락처 이메일]',
  // 이 이메일로 로그인한 사람은 모든 글·댓글을 삭제할 수 있습니다.
  // firestore.rules 의 ADMIN_EMAIL 과 반드시 같은 값이어야 합니다.
  adminEmail: '[관리자 이메일]',
  // 약력: 한 줄에 하나씩
  biography: [
    '[학위] [대학교] 박사',
    '[현직] [대학교] 스페인어중남미학과 교수',
    '[관심 분야] 중남미 현대문학, 스페인어 사회언어학',
  ],
} as const;

/** 관리자인지 판별. 대소문자와 앞뒤 공백 차이는 무시합니다. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === site.adminEmail.trim().toLowerCase();
}
