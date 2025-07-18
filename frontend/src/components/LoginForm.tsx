import type {Credentials} from "../types.ts";
import {useContext, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {userLogin} from "../api/userAPI.ts";
import {NotificationContext, UserContext} from "../contexts/globalContexts.tsx";
export function LoginForm() {
    const navigate = useNavigate();
    const state = useContext(UserContext);
    const noticeState = useContext(NotificationContext);
    console.log(state);
    const [credentials, setCredentials] = useState({
        phone: '',
        password: '',
    } as Credentials);
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit =async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // 调用API
            const  responseData=await userLogin(credentials);
            console.log(responseData)
            sessionStorage.setItem("authToken", responseData.token);
            if(!state){
                throw new Error("StaTe Is nUlL??")
            }
            state.setCurrentUser(responseData.userVO);
            state.setIsLoggedIn(true);
            //websocket
            const token = responseData.token;
            const ws = new WebSocket(`ws://localhost:8088/ws`);

            ws.onopen = () => {
                console.log("WebSocket连接已建立");
                // 发送认证消息
                ws.send(JSON.stringify({
                    type: 'AUTHENTICATE',
                    token: token
                }));
            };

            ws.onmessage = (event) => {
                console.log("收到服务器消息:", event.data);
                // 处理服务器消息
                try {
                    const message = JSON.parse(event.data);
                    if (message.type == 'AUTH_SUCCESS') {
                        state.setWebSocket(message.content);
                        //保存WebSocket实例到上下文
                    }else if(message.type == 'AUTH_FAILURE') {
                        console.error(message);
                    }else if(message.type == 'NEW_NOTICE') {
                        noticeState?.setIsNewNotice(true);
                        console.log("new notice")
                    }
                } catch (error) {
                    console.error("消息解析错误:", error);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket连接关闭");
            };

            ws.onerror = (error) => {
                console.error("WebSocket错误:", error);
            };


            alert('登录成功！');
        } catch (error) {
            console.error('登录失败:', error);
            alert(`登录失败，请重试,${error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    手机号
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={credentials.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>


            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    立即登录
                </button>
            </div>
            <div>
                <button
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={()=>{navigate("/user/register")}}>
                    前往注册
                </button>
            </div>
        </form>
    );
}