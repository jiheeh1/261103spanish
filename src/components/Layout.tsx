import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { texts } from '../config/texts';
import { DemoBanner } from './DemoBanner';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  const { pathname, hash } = useLocation();

  // 페이지를 옮기면 맨 위로, #privacy 같은 주소면 해당 위치로 이동
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        {texts.nav.skipToContent}
      </a>
      <DemoBanner />
      <Header />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:py-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
