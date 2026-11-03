import { Link, useLocation } from 'react-router-dom';
import { texts } from '../config/texts';

/** 로그인이 필요한 곳에 보여 주는 안내. 로그인 후 원래 페이지로 돌아오도록 주소를 넘깁니다. */
export function LoginPrompt({ message = texts.auth.required }: { message?: string }) {
  const location = useLocation();
  const from = location.pathname + location.search;
  return (
    <div className="card text-center">
      <p className="mb-4">{message}</p>
      <Link to={`/login?from=${encodeURIComponent(from)}`} className="btn-primary">
        {texts.auth.goLogin}
      </Link>
    </div>
  );
}
