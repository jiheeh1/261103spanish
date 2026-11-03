import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { site } from '../config/site';
import { texts } from '../config/texts';

const navItems = [
  { to: '/research', label: texts.nav.research },
  { to: '/courses', label: texts.nav.courses },
  { to: '/discussion', label: texts.nav.discussion },
  { to: '/about', label: texts.nav.about },
];

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // 현재 메뉴는 아래 포인트 선으로 표시 (색만으로 구분하지 않음)
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block border-b-2 px-3 py-2 ${isActive ? 'border-accent font-semibold text-accent' : 'border-transparent text-ink hover:text-accent'}`;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={close}>
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent font-serif text-2xl font-bold text-white"
          >
            ñ
          </span>
          <span className="font-serif text-base font-bold leading-snug text-ink md:text-lg">{site.siteName}</span>
        </Link>
        <button
          type="button"
          className="btn-outline shrink-0 whitespace-nowrap md:hidden"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {texts.nav.menu}
        </button>
        <nav
          id="main-nav"
          aria-label="주 메뉴"
          className={`${open ? 'block' : 'hidden'} absolute left-0 right-0 top-full z-10 border-b border-line bg-white px-4 pb-4 shadow-md md:static md:block md:border-0 md:p-0 md:shadow-none`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass} onClick={close}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 md:ml-4 md:mt-0">
              {user ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">
                    {user.displayName}
                    {isAdmin && <span className="ml-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">{texts.common.admin}</span>}
                  </span>
                  <button
                    type="button"
                    className="btn-outline px-3 py-1"
                    onClick={() => {
                      close();
                      void signOut();
                    }}
                  >
                    {texts.nav.logout}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary px-4 py-1.5" onClick={close}>
                  {texts.nav.login}
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
