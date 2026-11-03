import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';
import { texts } from '../config/texts';
import { research } from '../content/research';

const t = texts.research;

export function Research() {
  const [field, setField] = useState('');
  const [year, setYear] = useState('');
  const [keyword, setKeyword] = useState('');

  const fields = useMemo(() => [...new Set(research.map((r) => r.field))].sort(), []);
  const years = useMemo(() => [...new Set(research.map((r) => r.year))].sort((a, b) => b - a), []);

  // 자료 수가 적으므로 서버 없이 브라우저에서 바로 거릅니다
  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return research
      .filter((r) => !field || r.field === field)
      .filter((r) => !year || String(r.year) === year)
      .filter(
        (r) =>
          !q ||
          [r.title, r.summary, r.field, ...r.keywords].some((s) => s.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.year - a.year);
  }, [field, year, keyword]);

  return (
    <>
      <PageTitle title={t.title} description={t.description} />
      <div className="mb-8 grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-[1fr_1fr_2fr]">
        <label className="text-sm">
          <span className="mb-1 block text-muted">{t.fieldLabel}</span>
          <select className="input" value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">{t.allFields}</option>
            {fields.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted">{t.yearLabel}</span>
          <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">{t.allYears}</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted">{t.searchLabel}</span>
          <input
            type="search"
            className="input"
            placeholder={t.searchPlaceholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">{filtered.length}건</p>
      {filtered.length === 0 ? (
        <p className="text-muted">{t.noResult}</p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {filtered.map((r) => (
            <li key={r.id} className="card lift group relative flex flex-col border-l-4 border-l-accent md:p-6">
              <p className="flex items-center justify-between text-sm">
                <span className="font-semibold text-accent">{r.field}</span>
                <span className="text-muted">{r.year}</span>
              </p>
              <h2 className="mt-2 font-serif text-xl font-bold leading-snug">
                {/* 카드 전체를 눌러도 이동하도록 링크를 카드 크기로 확장 */}
                <Link to={`/research/${r.id}`} className="after:absolute after:inset-0 group-hover:text-accent">{r.title}</Link>
              </h2>
              <p className="mt-3 flex-1 text-muted">{r.summary}</p>
              <p className="mt-4 flex flex-wrap gap-1.5">
                {r.keywords.map((k) => <span key={k} className="chip">#{k}</span>)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
