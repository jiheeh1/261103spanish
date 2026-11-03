import { Link } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';
import { texts } from '../config/texts';

export function NotFound({ message = texts.notFound.body }: { message?: string }) {
  return (
    <div className="py-12 text-center">
      <p className="font-serif text-5xl text-accent" aria-hidden="true">404</p>
      <PageTitle title={texts.notFound.title} />
      <p className="mb-6 text-muted">{message}</p>
      <Link to="/" className="btn-primary">{texts.notFound.goHome}</Link>
    </div>
  );
}
