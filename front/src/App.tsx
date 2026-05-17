import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout'
import OpeningFormPage from '@/pages/opening-form-page'
import OpeningListPage from '@/pages/opening-list-page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/openings" replace />} />
        <Route element={<Layout />}>
          <Route path="/openings" element={<OpeningListPage />} />
          <Route path="/openings/new" element={<OpeningFormPage />} />
          <Route path="/openings/:id/edit" element={<OpeningFormPage />} />
          <Route path="*" element={<Navigate to="/openings" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
