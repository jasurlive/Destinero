import { BrowserRouter, Route, Routes } from 'react-router'
import '../tools/css/reset.css'
import '../tools/css/theme.css'
import '../tools/css/page.css'
import Layout from '../tools/components/Layout'
import Embed from '../tools/components/Embed'
import MapPage from '../tools/pages/MapPage'
import Places from '../tools/pages/Places'
import Help from '../tools/pages/Help'
import NotFound from '../tools/pages/NotFound'

// add a page: create it in tools/pages, add a <Route> here and an item in Menu.tsx
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MapPage />} />
          <Route path="places" element={<Places />} />
          <Route path="help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* no navbar, for iframes on other sites (see README) */}
        <Route element={<Embed />}>
          <Route path="itravelmap" element={<MapPage />} />
          <Route path="iblogs" element={<Places embed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
