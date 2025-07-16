import {Header} from "../components/Header.tsx";
import { useState} from "react";
import {HomeContext } from "../contexts/globalContexts.tsx";
import {SideBar} from "../components/SideBar.tsx";
import {VenueList} from "../components/VenueList.tsx";
export function HomePage() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    return(
        <HomeContext.Provider value={{isSideBarOpen,setIsSideBarOpen}}>
            <div className="flex flex-col min-h-screen w-full">
                {/* 顶部导航栏 */}
                <Header />

                {/* 主体内容区 */}
                <div className="relative flex overflow-auto">
                    {/*<div className="flex-1" 测试用/> */}
                    {/* 场地列表 - 自适应区域 */}
                    <VenueList />
                    {/* 侧边栏 */}
                    <SideBar/>
                </div>
            </div>
        </HomeContext.Provider>
    );
}