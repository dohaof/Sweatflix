import {type JSX, useContext} from "react";
import logo from '../assets/homelogo.png';
import {HomeContext} from "../contexts/globalContexts.tsx";
import { useNavigate } from 'react-router-dom';
// interface HeaderProps {
//     onUserClick: () => void;
//     isLoggedIn: boolean;
// }

export function Header(): JSX.Element {
    const state = useContext(HomeContext)
    const navigate = useNavigate();
    return (
        <div className=" sticky top-0 z-50 bg-gradient-to-tl from-blue-300 to-green-200 h-[8vh] flex items-center w-full rounded">
            {/* 添加内容确保可见性 */}
            <img src={logo} alt="Logo" className="h-[7vh] rounded-full" onClick={()=>{navigate('/home')}}/>
            <ul className="flex flex-row items-center space-x-6 ml-auto mr-4">
                <li>
                    <button className={"hover:text-blue-700"} onClick={()=>navigate(-1)}>
                        返回
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