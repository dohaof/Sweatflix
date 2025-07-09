
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {HomePage} from "./pages/HomePage.tsx";



function VenueDetail() {
    return null;
}

function NotificationPage() {
    return null;
}

function App() {


  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/venue_detail/:venue_id" element={<VenueDetail />} />
                <Route path="/notification" element={<NotificationPage />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
