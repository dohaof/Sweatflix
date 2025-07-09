import type {Credentials} from "../types.ts";
import {useState} from "react";
import * as React from "react";

export function LoginForm(props: { onSubmit: (credentials: Credentials) => void }) {
    const [credentials, setCredentials] = useState({
        phone: '',
        password: '',
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSubmit(credentials);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p>注:（手机号不存在则自动注册账号）</p>
            <p>注册后默认为普通用户，前往账号详情更改身份</p>

        </form>
    );
}