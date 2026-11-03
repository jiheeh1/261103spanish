import { useState, type FormEvent } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PageTitle } from '../components/PageTitle';
import { texts } from '../config/texts';
import { errorMessage } from '../lib/format';
import { validateName } from '../services/validation';

const t = texts.auth;

/** 로그인 후 돌아갈 주소. 다른 사이트로 튕겨 나가지 않도록 "/"로 시작하는 주소만 허용 */
function safeRedirect(from: string | null): string {
  return from && from.startsWith('/') && !from.startsWith('//') ? from : '/';
}

export function Login() {
  const { user, mode, signIn } = useAuth();
  const [params] = useSearchParams();
  const redirectTo = safeRedirect(params.get('from'));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 이미 로그인했으면 원래 가려던 곳으로
  if (user) return <Navigate to={redirectTo} replace />;

  async function run(action: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await action(); // 성공하면 user가 바뀌어 위의 Navigate가 이동시킴
    } catch (e) {
      setError(errorMessage(e, texts.common.error));
      setBusy(false);
    }
  }

  function onDemoSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validateName(name);
    if (err) {
      setError(err);
      return;
    }
    void run(() => signIn({ displayName: name, email }));
  }

  return (
    <>
      <PageTitle title={t.title} />
      <div className="card mx-auto max-w-md md:p-8">
        {mode === 'demo' ? (
          <form onSubmit={onDemoSubmit} noValidate className="flex flex-col gap-4">
            <p className="text-sm text-muted">{t.demoIntro}</p>
            <label className="text-sm">
              <span className="mb-1 block font-medium">{t.demoNameLabel}</span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">{t.demoEmailLabel}</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? t.signingIn : t.demoSubmit}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-muted">{t.firebaseIntro}</p>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button type="button" className="btn-primary" disabled={busy} onClick={() => void run(() => signIn())}>
              {busy ? t.signingIn : t.google}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
