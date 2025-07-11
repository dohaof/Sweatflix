import {type JSX, useContext} from "react";
import {UserContext} from "../contexts/globalContexts.tsx";
import {LoginForm} from "./LoginForm.tsx";
import {useNavigate} from "react-router-dom";


export function SideBar({isOpen}: {isOpen: boolean}): JSX.Element {
    const state = useContext(UserContext);
    const navigate = useNavigate();
    const renderIfNorm=(e:string,f:()=>void)=>{
        if (state==null||state.currentUser==null||state.currentUser.role=="admin"){return null;}
        return  <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition" onClick={f}>{e}</button></li>
    }
    const renderIfAdmin=(e:string,f:()=>void)=>{
        if (state==null||state.currentUser==null||state.currentUser.role=="norm"){return null;}
        return  <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition" onClick={f}>{e}</button></li>
    }
    return (
        <div className={`
      top-2/25 bottom-0 right-0 w-full md:w-96 shadow-xl z-40 rounded-2xl transform transition-transform bg-green-300 border
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
                                <div className="border-2 border-dashed rounded-xl w-[12vw] aspect-square overflow-hidden">
                                    {state.currentUser.image ? (
                                        <img
                                            src={state.currentUser.image}
                                            alt="用户头像"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center bg-gray-200 w-full h-full">没有头像</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl text-amber-950 font-bold">用户名: {state.currentUser.username}</h3>
                                    <p className="text-gray-600">手机号: {state.currentUser.phone}</p>
                                    <p className="text-gray-600">{state.currentUser.role=='admin'?'管理员':"普通用户"}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-3 text-black">账户设置</h4>
                                <ul className="space-y-2">
                                    <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition" onClick={()=>{
                                        navigate('/user/modify');
                                    }}>账号信息修改</button></li>
                                    {renderIfNorm("预约历史",()=>{console.log("tobe done")})}
                                    {renderIfAdmin("增加场地",()=>{console.log("tobe done")})}
                                    {renderIfNorm("通知设置",()=>{console.log("tobe done")})}
                                    <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition" onClick={()=>{
                                        state?.setCurrentUser(null)
                                        state?.setIsLoggedIn(false);
                                    }}>退出登录</button></li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <LoginForm/>
                    )}
                </div>
            </div>
        </div>
    );
}