import {type JSX, useContext, useEffect} from "react";
import {HomeContext, NotificationContext, UserContext} from "../contexts/globalContexts.tsx";
import {LoginForm} from "./LoginForm.tsx";
import {useNavigate} from "react-router-dom";


export function SideBar(): JSX.Element {
    const state = useContext(UserContext);
    const homeState=useContext(HomeContext);
    const noticeState=useContext(NotificationContext);
    const navigate = useNavigate();
    const renderIfNorm=(e:string,f:()=>void)=>{
        if (state==null||state.currentUser==null||state.currentUser.role=="admin"){return null;}
        return  <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition" onClick={f}>{e}</button></li>
    }
    const renderIfAdmin=(e:string,f:()=>void)=>{
        if (state==null||state.currentUser==null||state.currentUser.role=="norm"){return null;}
        return  <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition" onClick={f}>{e}</button></li>
    }
    const handleNotice=()=>{
        noticeState?.setIsNewNotice(false);
        navigate("/notification");
        // console.log(noticeState)
    }
    useEffect(() => {
        console.log(noticeState)
    },[noticeState])
    return (
        <div className={`
      fixed top-2/25 bottom-0 right-0 w-full md:w-[24vw] shadow-xl z-40 rounded-2xl transform transition-transform bg-gradient-to-tr from-cyan-300 to-blue-300 border
      ${homeState?.isSideBarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col items-center">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {state?.isLoggedIn ? '个人中心' : '登录'}
                    </h2>
                </div>
                <div className="flex-1 overflow-auto">
                    {state!=null&&state.isLoggedIn && state.currentUser!=null? (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 w-full md:w-[20vw]">
                                <div className="border-2 border-dashed rounded-xl overflow-hidden inline-flex">
                                    {state.currentUser.image ? (
                                        <img
                                            src={state.currentUser.image}
                                            alt="用户头像"
                                            className="max-w-full h-auto" // 让高度根据宽度自动调整
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center bg-gray-200 w-[20vw] h-[20vw]">没有头像</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl text-amber-950 font-bold">用户名: {state.currentUser.username}</h3>
                                <p className="text-gray-600">手机号: {state.currentUser.phone}</p>
                                <p className="text-gray-600">{state.currentUser.role=='admin'?'管理员':"普通用户"}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3 text-black">账户设置</h4>
                                <ul className="space-y-2">
                                    <li><button className="w-full py-2 bg-red-500  rounded-lg hover:text-blue-700 transition" onClick={()=>{
                                        navigate('/user/modify');
                                    }}>账号信息修改</button></li>
                                    {renderIfNorm("预约历史",()=>{navigate('/history')})}
                                    {renderIfAdmin("增加场地",()=>{navigate('/venue/create')})}
                                    {state?.currentUser.role=='norm'&&<li className="relative">
                                        <button
                                            className="w-full py-2 bg-red-500 rounded-lg hover:text-blue-700 transition"
                                            onClick={() => {handleNotice()}}
                                        >
                                            通知查看
                                            {/* 小红点 - 只有在有通知时显示 */}
                                            {noticeState?.isNewNotice && (
                                                <span className="absolute top-3 right-3 w-6 h-6 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                                    <p className={`text-white`}> N</p>
                                                </span>
                                            )}
                                        </button>
                                    </li>}
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