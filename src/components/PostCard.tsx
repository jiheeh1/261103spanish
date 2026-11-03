import { Link } from 'react-router-dom';
import { texts } from '../config/texts';
import { formatDate } from '../lib/format';
import type { Post } from '../services/types';

export function PostCard({ post }: { post: Post }) {
  return (
    <li className="border-b border-line py-4 last:border-b-0">
      <Link to={`/discussion/${post.id}`} className="group block">
        <span className="mr-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">
          {texts.discussion.categories[post.category]}
        </span>
        {/* 사용자가 쓴 제목은 항상 글자로만 표시 (HTML로 해석하지 않음) */}
        <span className="font-medium group-hover:text-accent group-hover:underline">{post.title}</span>
        <span className="mt-1 block text-sm text-muted">
          {post.authorName} · {formatDate(post.createdAt)}
        </span>
      </Link>
    </li>
  );
}
