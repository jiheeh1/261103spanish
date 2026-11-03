// 연구·수업 자료의 모양. 자료는 research.ts / courses.ts 에서 직접 추가합니다.

export type LinkType = 'paper' | 'drive' | 'youtube' | 'web' | 'slides';

export interface ExternalLink {
  type: LinkType;
  /** 화면에 보일 이름 */
  label: string;
  url: string;
}

export interface ResearchItem {
  /** 주소에 쓰이는 고유 이름 (영문 소문자·숫자·하이픈). 예: /research/magical-realism */
  id: string;
  title: string;
  field: string;
  year: number;
  keywords: string[];
  summary: string;
  /** 마크다운 형식 본문 (# 제목, **굵게**, - 목록 등) */
  body: string;
  links: ExternalLink[];
}

export type CourseLevel = 'undergraduate' | 'graduate';

export interface CourseWeek {
  week: number;
  topic: string;
  links: ExternalLink[];
}

export interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  /** 예: "2026년 2학기" */
  semester: string;
  overview: string;
  weeks: CourseWeek[];
}
