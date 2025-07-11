import {Header} from "../components/Header.tsx";
import { useState} from "react";
import {HomeContext } from "../contexts/globalContexts.tsx";
import {SideBar} from "../components/SideBar.tsx";
export function HomePage() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    return(
        <HomeContext.Provider value={{isSideBarOpen,setIsSideBarOpen}}>
        <div className="w-[99vw] flex min-h-screen ">
            <Header/>
            <SideBar isOpen={isSideBarOpen}/>
        </div>)
        </HomeContext.Provider>
    );
}