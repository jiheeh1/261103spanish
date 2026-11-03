// 수업 자료 목록. 새 수업은 배열에 { ... } 덩어리를 복사해 추가합니다.
// level: 'undergraduate'(학부) 또는 'graduate'(대학원)
import type { Course } from './types';

export const courses: Course[] = [
  {
    id: 'spanish-reading',
    title: '(샘플) 스페인어 강독',
    level: 'undergraduate',
    semester: '2026년 2학기',
    overview:
      '짧은 스페인어 산문과 신문 기사를 함께 읽으며 문법과 독해력을 기릅니다. 접속법(subjuntivo) 등 중급 문법을 실제 글에서 확인합니다.',
    weeks: [
      {
        week: 1,
        topic: '수업 안내, 스페인어 발음과 강세 복습',
        links: [{ type: 'slides', label: '1주차 슬라이드 (예시)', url: 'https://example.com/w1' }],
      },
      {
        week: 2,
        topic: '신문 기사 읽기: 직설법 과거 시제',
        links: [{ type: 'drive', label: '읽기 자료 (예시)', url: 'https://example.com/w2' }],
      },
      { week: 3, topic: '짧은 소설 읽기: 접속법', links: [] },
    ],
  },
  {
    id: 'latam-culture',
    title: '(샘플) 라틴아메리카 문화의 이해',
    level: 'undergraduate',
    semester: '2026년 2학기',
    overview: '음악, 영화, 축제, 음식 등 다양한 문화 현상을 통해 라틴아메리카 사회를 이해합니다.',
    weeks: [
      {
        week: 1,
        topic: '라틴아메리카란 무엇인가: 지역과 언어',
        links: [{ type: 'youtube', label: '소개 영상 (예시)', url: 'https://example.com/latam1' }],
      },
      { week: 2, topic: '음악과 춤: 지역별 장르', links: [] },
    ],
  },
  {
    id: 'grad-literary-theory',
    title: '(샘플) 중남미 문학 비평 세미나',
    level: 'graduate',
    semester: '2026년 2학기',
    overview: '대학원 세미나. 주요 비평 개념을 읽고 각자의 연구 주제에 적용해 발표합니다.',
    weeks: [
      {
        week: 1,
        topic: '세미나 안내 및 발표 순서 정하기',
        links: [{ type: 'drive', label: '세미나 자료 폴더 (예시)', url: 'https://example.com/seminar' }],
      },
      { week: 2, topic: '탈식민주의 비평 개념 읽기', links: [] },
    ],
  },
];

export function findCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
