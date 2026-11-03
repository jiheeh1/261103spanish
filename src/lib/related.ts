// 토론 글에 연결된 연구·수업(relatedKey)을 화면용 정보로 바꿉니다.
import { findCourse } from '../content/courses';
import { findResearch } from '../content/research';

export function researchKey(id: string) {
  return `research/${id}`;
}
export function courseKey(id: string) {
  return `course/${id}`;
}

/** relatedKey → { 제목, 이동할 주소 }. 자료가 삭제됐으면 null */
export function resolveRelated(key: string | null): { title: string; href: string } | null {
  if (!key) return null;
  const [kind, id] = key.split('/');
  if (!id) return null;
  if (kind === 'research') {
    const r = findResearch(id);
    return r ? { title: r.title, href: `/research/${id}` } : null;
  }
  if (kind === 'course') {
    const c = findCourse(id);
    return c ? { title: c.title, href: `/courses/${id}` } : null;
  }
  return null;
}
