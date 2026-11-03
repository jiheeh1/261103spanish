// 연구 자료 목록. 새 연구를 추가하려면 아래 배열에 { ... } 덩어리를 하나 복사해 붙이고 내용을 바꾸세요.
// 링크 주소(url)는 모두 예시(example.com)이므로 실제 주소로 바꿔 주세요.
import type { ResearchItem } from './types';

export const research: ResearchItem[] = [
  {
    id: 'magical-realism',
    title: '(샘플) 중남미 소설 속 마술적 사실주의의 서술 전략',
    field: '중남미 문학',
    year: 2026,
    keywords: ['마술적 사실주의', 'realismo mágico', '소설', '서술'],
    summary:
      '환상적 사건을 일상처럼 서술하는 방식이 독자에게 어떤 효과를 주는지 살펴보는 연구 메모입니다.',
    body: `## 연구 질문

- 환상적 요소는 **왜** 놀라움 없이 서술되는가?
- 서술자의 태도는 역사적 기억과 어떻게 연결되는가?

## 메모

마술적 사실주의(*realismo mágico*)는 현실과 환상의 경계를 흐리는 서술 방식입니다.
이 페이지는 샘플이며, 실제 연구 내용으로 바꿔 쓰시면 됩니다.

> «La realidad también sueña.» — 예시 인용문
`,
    links: [
      { type: 'drive', label: '읽기 자료 폴더 (예시)', url: 'https://example.com/drive-folder' },
      { type: 'youtube', label: '강연 영상 (예시)', url: 'https://example.com/video' },
    ],
  },
  {
    id: 'spanish-variation',
    title: '(샘플) 중남미 스페인어의 2인칭 대명사 vos와 tú',
    field: '스페인어학',
    year: 2025,
    keywords: ['voseo', '사회언어학', '대명사', 'variación'],
    summary: '지역과 세대에 따라 vos와 tú가 어떻게 쓰이는지 정리한 사회언어학 연구 메모입니다.',
    body: `## 개요

일부 중남미 지역에서는 tú 대신 **vos**를 씁니다 (*voseo*).

- **tú**: ¿Tú tienes tiempo?
- **vos**: ¿Vos tenés tiempo?

샘플 내용입니다. 제목(##), 목록(-), 굵게(**), 인용(>) 등 마크다운 문법을 쓸 수 있습니다.
`,
    links: [{ type: 'slides', label: '발표 자료 (예시)', url: 'https://example.com/slides' }],
  },
  {
    id: 'urban-culture',
    title: '(샘플) 라틴아메리카 도시 문화와 벽화 운동',
    field: '중남미 문화',
    year: 2025,
    keywords: ['벽화', 'muralismo', '도시', '시각문화'],
    summary: '공공 공간의 벽화가 공동체 기억을 어떻게 기록하는지 살펴보는 문화 연구 메모입니다.',
    body: `## 관찰 포인트

1. 벽화의 주제와 공동체의 역사
2. 도시 재개발과 벽화의 운명
3. 관광과 상업화

*샘플 본문입니다.*
`,
    links: [{ type: 'web', label: '참고 웹페이지 (예시)', url: 'https://example.com/murals' }],
  },
  {
    id: 'translation-poetry',
    title: '(샘플) 스페인어 시 번역에서 리듬 옮기기',
    field: '번역학',
    year: 2024,
    keywords: ['번역', '시', 'traducción', '리듬'],
    summary: '스페인어 시의 음절 수와 리듬을 한국어로 옮길 때 생기는 문제를 정리했습니다.',
    body: `## 메모

스페인어 시는 음절 수(*sílabas métricas*)를 세는 전통이 있습니다.
한국어 번역에서 이를 어떻게 살릴지 사례를 모아 둡니다.

*샘플 본문입니다.*
`,
    links: [{ type: 'paper', label: '관련 원고 (예시)', url: 'https://example.com/paper' }],
  },
];

/** id로 연구 하나 찾기 */
export function findResearch(id: string): ResearchItem | undefined {
  return research.find((r) => r.id === id);
}
