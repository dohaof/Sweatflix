import {type JSX, useContext} from "react";
import logo from '../assets/homelogo.png';
import {GlobalContext} from "../contexts/userContexts.tsx";
// interface HeaderProps {
//     onUserClick: () => void;
//     isLoggedIn: boolean;
// }

export function Header(): JSX.Element {
    const state = useContext(GlobalContext)
    return (
        <div className="sticky top-0 z-50 bg-blue-300 h-[8vh] flex items-center w-full rounded">
            {/* 添加内容确保可见性 */}
            <img src={logo} alt="Logo" className="h-[7vh] rounded-full" />
            <ul className="flex flex-row items-center space-x-6 ml-auto mr-4">
                <li>
                    <button className={"hover:text-blue-700"}>
                        随机推荐
                    </button>
                </li>
                <li>
                    <button className={"hover:text-blue-700"} onClick={()=>{state?.setIsSideBarOpen(!state.isSideBarOpen)}}>
                        侧边栏开关
                    </button>
                </li>
            </ul>
        </div>
    );
}