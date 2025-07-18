
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {HomePage} from "./pages/HomePage.tsx";
import {RegisterPage} from "./pages/ReigisterPage.tsx";
import {ModifyPage} from "./pages/ModifyPage.tsx";
import {NotificationContext, UserContext} from "./contexts/globalContexts.tsx";
import {useState} from "react";
import type {User} from "./types.ts";
import {VenueCreateOrModify} from "./pages/VenueCreateOrModify.tsx";
import {VenueDetail} from "./pages/VenueDetail.tsx";
import {ScheduleCreate} from "./pages/ScheduleCreate.tsx";
import {OrderHistoryPage} from "./pages/HistoryOrder.tsx";
import {NotificationPage} from "./pages/Notification.tsx";

function App() {
const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favourList,setFavourList] = useState<number[]>([]);
    const [websocket, setWebSocket] = useState<WebSocket | null>(null);
    const [isNewNotice, setIsNewNotice] = useState<boolean>(false);
  return (
    <>
        <NotificationContext.Provider value={{isNewNotice, setIsNewNotice}}>
        <UserContext.Provider value={{currentUser, setCurrentUser,isLoggedIn,setIsLoggedIn,favourList,setFavourList,websocket,setWebSocket}}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/user/register" element={<RegisterPage/>}/>
                <Route path="/user/modify" element={<ModifyPage/>}/>
                <Route path="/venue/create/:venue_id?" element={<VenueCreateOrModify/>}/>
                <Route path="/venue/:venue_id" element={<VenueDetail />} />
                <Route path="/venue/createSchedule/:venue_id" element={<ScheduleCreate />} />
                <Route path="/history" element={<OrderHistoryPage />} />
                <Route path="/notification" element={<NotificationPage />} />
            </Routes>
        </BrowserRouter>
        </UserContext.Provider>
        </NotificationContext.Provider>
    </>
  )
}

export default App
