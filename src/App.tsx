import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import { CourseDetail } from './pages/CourseDetail';
import { Courses } from './pages/Courses';
import { Discussion } from './pages/Discussion';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NewPost } from './pages/NewPost';
import { NotFound } from './pages/NotFound';
import { PostDetail } from './pages/PostDetail';
import { Research } from './pages/Research';
import { ResearchDetail } from './pages/ResearchDetail';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="research" element={<Research />} />
        <Route path="research/:id" element={<ResearchDetail />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="discussion" element={<Discussion />} />
        <Route path="discussion/new" element={<NewPost />} />
        <Route path="discussion/:postId" element={<PostDetail />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
