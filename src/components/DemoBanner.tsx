import { useAuth } from '../auth/AuthContext';
import { texts } from '../config/texts';

/** 데모 모드일 때만 화면 맨 위에 안내 띠를 보여 줍니다 */
export function DemoBanner() {
  const { mode } = useAuth();
  if (mode !== 'demo') return null;
  return (
    <div role="status" className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">
      {texts.demoBanner}
    </div>
  );
}
