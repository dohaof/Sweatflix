import {type JSX, useContext} from "react";
import {GlobalContext} from "../contexts/userContexts.tsx";
import type {Credentials} from "../types.ts";
import {LoginForm} from "./LoginForm.tsx";


export function SideBar({isOpen}: {isOpen: boolean}): JSX.Element {
    const state = useContext(GlobalContext)
    // const navigate = useNavigate();
    const handleLogin = (credentials:Credentials) => {
        // 实际项目中这里会有API调用
        console.log('登录请求:', credentials);

        // 模拟登录成功

    };
    const renderIfNorm=(e:string)=>{
        if (state==null||state.currentUser==null||state.currentUser.role=="admin"){return null;}
        return  <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition">{e}</button></li>
    }
    const renderIfAdmin=(e:string)=>{
        if (state==null||state.currentUser==null||state.currentUser.role=="norm"){return null;}
        return  <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition">{e}</button></li>
    }
    return (
        <div className={`
      fixed top-2/25 bottom-1 right-0 w-full md:w-96 shadow-xl z-40 transform transition-transform bg-green-300
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col items-center">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {state?.isLoggedIn ? '个人中心' : '登录'}
                    </h2>
                </div>
                <div className="flex-1 overflow-auto">
                    {state!=null&&state.isLoggedIn && state.currentUser!=null? (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-[12vw] aspect-square" />
                                <div>
                                    <h3 className="text-xl font-bold">{state.currentUser.username}</h3>
                                    <p className="text-gray-600">{state.currentUser.phone}</p>
                                    <p className="text-gray-600">{state.currentUser.role}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-3">账户设置</h4>
                                <ul className="space-y-2">
                                    <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition">账号信息修改</button></li>
                                    {renderIfNorm("预约历史")}
                                    {renderIfAdmin("增加场地")}
                                    {renderIfNorm("通知设置")}
                                    <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition">退出登录</button></li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <LoginForm onSubmit={handleLogin} />
                    )}
                </div>
            </div>
        </div>
    );
}