import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import QuotesPage from './pages/QuotesPage.jsx';
import AddQuotePage from './pages/AddQuotePage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuotesPage />} />
        <Route path="/add" element={<AddQuotePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
