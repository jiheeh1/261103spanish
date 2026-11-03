import { Link } from 'react-router-dom';
import { texts } from '../config/texts';
import { formatDate } from '../lib/format';
import type { Post } from '../services/types';

export function PostCard({ post }: { post: Post }) {
  return (
    <li className="border-b border-line last:border-b-0">
      <Link to={`/discussion/${post.id}`} className="group -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-accent-soft/60">
        <span className="mr-2 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
          {texts.discussion.categories[post.category]}
        </span>
        {/* 사용자가 쓴 제목은 항상 글자로만 표시 (HTML로 해석하지 않음) */}
        <span className="font-medium group-hover:text-accent">{post.title}</span>
        <span className="mt-1 block text-sm text-muted">
          {post.authorName} · {formatDate(post.createdAt)}
        </span>
      </Link>
    </li>
  );
}
