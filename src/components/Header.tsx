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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md ${isActive ? 'text-accent font-semibold' : 'text-ink hover:text-accent'}`;

  return (
    <header className="relative border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="font-serif text-lg font-bold leading-snug text-ink" onClick={close}>
          {site.siteName}
        </Link>
        <button
          type="button"
          className="btn-outline md:hidden"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {texts.nav.menu}
        </button>
        <nav
          id="main-nav"
          aria-label="주 메뉴"
          className={`${open ? 'block' : 'hidden'} absolute left-0 right-0 top-full z-10 border-b border-line bg-white px-4 pb-4 md:static md:block md:border-0 md:p-0`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass} onClick={close}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 md:ml-3 md:mt-0">
              {user ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">
                    {user.displayName}
                    {isAdmin && <span className="ml-1 rounded bg-accent-soft px-1.5 text-accent">{texts.common.admin}</span>}
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
                <Link to="/login" className="btn-primary px-3 py-1" onClick={close}>
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
