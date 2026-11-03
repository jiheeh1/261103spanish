// 입력 검증. 화면(오류 메시지 표시)과 저장소(최종 방어) 양쪽에서 같은 규칙을 씁니다.
import { limits } from '../config/limits';
import { texts } from '../config/texts';

const v = texts.validation;

export function validateTitle(title: string): string | null {
  const t = title.trim();
  if (t.length === 0) return v.titleEmpty;
  if (t.length > limits.titleMax) return v.titleTooLong;
  return null;
}

export function validateBody(body: string): string | null {
  const t = body.trim();
  if (t.length === 0) return v.bodyEmpty;
  if (t.length > limits.bodyMax) return v.bodyTooLong;
  return null;
}

export function validateComment(body: string): string | null {
  const t = body.trim();
  if (t.length === 0) return v.commentEmpty;
  if (t.length > limits.commentMax) return v.commentTooLong;
  return null;
}

export function validateName(name: string): string | null {
  const t = name.trim();
  if (t.length === 0) return v.nameEmpty;
  if (t.length > limits.authorNameMax) return v.nameTooLong;
  return null;
}

/** 오류 메시지가 있으면 예외로 던집니다 (저장소에서 사용) */
export function assertValid(...messages: (string | null)[]): void {
  const first = messages.find((m) => m !== null);
  if (first) throw new Error(first);
}
