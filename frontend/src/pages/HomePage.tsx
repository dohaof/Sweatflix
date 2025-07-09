import {Header} from "../components/Header.tsx";
import { useState} from "react";
import {GlobalContext } from "../contexts/userContexts.tsx";
import type {User} from "../types.ts";
import {SideBar} from "../components/SideBar.tsx";
export function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>({id: 0, image: "", phone: "2", role: "admin",
        username: "1"});
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    return(
        <GlobalContext.Provider value={{isLoggedIn,setIsLoggedIn,isSideBarOpen,setIsSideBarOpen,currentUser,setCurrentUser}}>
        <div className="w-[99vw] flex min-h-screen ">
            <Header/>
            <SideBar isOpen={isSideBarOpen}/>
        </div>)
        </GlobalContext.Provider>
    );
}