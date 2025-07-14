
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {HomePage} from "./pages/HomePage.tsx";
import {RegisterPage} from "./pages/ReigisterPage.tsx";
import {ModifyPage} from "./pages/ModifyPage.tsx";
import {UserContext} from "./contexts/globalContexts.tsx";
import {useState} from "react";
import type {User} from "./types.ts";
import {VenueCreateOrModify} from "./pages/VenueCreateOrModify.tsx";
import {VenueDetail} from "./pages/VenueDetail.tsx";



function NotificationPage() {
    return null;
}




function App() {
const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
        <UserContext.Provider value={{currentUser, setCurrentUser,isLoggedIn,setIsLoggedIn}}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/user/register" element={<RegisterPage/>}/>
                <Route path="/user/modify" element={<ModifyPage/>}/>
                <Route path="/venue/create/:venue_id?" element={<VenueCreateOrModify/>}/>
                <Route path="/venue/:venue_id" element={<VenueDetail />} />
                <Route path="/notification/:user_id" element={<NotificationPage />} />
            </Routes>
        </BrowserRouter>
        </UserContext.Provider>
    </>
  )
}

export default App
