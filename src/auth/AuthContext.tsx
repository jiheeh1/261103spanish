// 현재 로그인한 사용자와 저장소를 앱 전체에 나눠 주는 곳.
// 화면은 useAuth() / useRepository()로 꺼내 쓰고, 실제 구현(데모/Firebase)은 알지 못합니다.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isAdminEmail } from '../config/site';
import type { Backend, BackendMode, Repository } from '../services/repository';
import type { DemoSignInInput, User } from '../services/types';

interface AuthState {
  user: User | null;
  /** 처음 로그인 상태를 확인하는 중이면 true (깜빡임 방지) */
  loading: boolean;
  isAdmin: boolean;
  mode: BackendMode;
  readRequiresLogin: boolean;
  signIn: (input?: DemoSignInInput) => Promise<User>;
  signOut: () => Promise<void>;
  /** 이 사용자가 authorUid가 쓴 글·댓글을 지울 수 있는지 */
  canDelete: (authorUid: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);
const RepositoryContext = createContext<Repository | null>(null);

export function AuthProvider({ backend, children }: { backend: Backend; children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      backend.auth.onAuthChange((u) => {
        setUser(u);
        setLoading(false);
      }),
    [backend],
  );

  const value = useMemo<AuthState>(() => {
    // 보안 규칙과 똑같이 "인증된 이메일"일 때만 관리자로 봅니다
    const isAdmin = !!user && user.emailVerified && isAdminEmail(user.email);
    return {
      user,
      loading,
      isAdmin,
      mode: backend.mode,
      readRequiresLogin: backend.readRequiresLogin,
      signIn: (input) => backend.auth.signIn(input),
      signOut: () => backend.auth.signOut(),
      canDelete: (authorUid) => !!user && (user.uid === authorUid || isAdmin),
    };
  }, [user, loading, backend]);

  return (
    <RepositoryContext.Provider value={backend.repository}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </RepositoryContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 쓸 수 있습니다.');
  return ctx;
}

export function useRepository(): Repository {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error('useRepository는 AuthProvider 안에서만 쓸 수 있습니다.');
  return ctx;
}
