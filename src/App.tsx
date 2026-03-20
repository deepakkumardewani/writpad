import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocPage from '@/pages/DocPage';
import { generateId } from '@/lib/nanoid';
import './App.css';

function HomeRedirect() {
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!redirected) {
      const id = generateId();
      setRedirected(true);
      navigate(`/doc/${id}`, { replace: true });
    }
  }, [navigate, redirected]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/doc/:roomId" element={<DocPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
