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
      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_1fr_2fr]">
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
        <ul className="grid gap-4">
          {filtered.map((r) => (
            <li key={r.id} className="card">
              <p className="text-sm text-muted">{r.field} · {r.year}</p>
              <h2 className="mt-1 font-serif text-lg font-semibold">
                <Link to={`/research/${r.id}`} className="hover:text-accent hover:underline">{r.title}</Link>
              </h2>
              <p className="mt-2 text-muted">{r.summary}</p>
              <p className="mt-3 flex flex-wrap gap-1">
                {r.keywords.map((k) => (
                  <span key={k} className="rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">{k}</span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
