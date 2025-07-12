import {useRef, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {uploadImageToServer} from "../api/upload.ts";
import {userRegister} from "../api/userAPI.ts";
import type {Role} from "../types.ts";
export function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        phone: '',
        image: '',
        role: 'norm' as Role,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    // 验证表单
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = '用户名不能为空';
        }
        if (!formData.phone.trim()) {
                newErrors.phone = '手机号不能为空';
        }
        if (formData.password.length < 6) {
            newErrors.password = '密码长度至少为6位';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length == 0;
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 客户端预览
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
            // 上传到服务器
            const imageUrl = await uploadImageToServer(file);

            // 保存服务器返回的URL
            setFormData(prev => ({
                ...prev,
                image: imageUrl
            }));
        } catch (error) {
            // 上传失败时清除预览
            setAvatarPreview(null);
            setFormData(prev => ({...prev, image: ""}));
            window.alert("图片上传失败，请重试！");
            console.error("上传错误详情:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            // 调用注册API
            const responseData = await userRegister(formData)

            console.log('注册成功:', responseData);
            alert('注册成功！');
            navigate('/home');
        } catch (error) {
            console.error('注册失败:', error);
            alert('注册失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center w-screen p-4">
            <div className="w-[100vw] max-w-md">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                        <h2 className="text-2xl font-bold text-white text-center">创建新账户</h2>
                    </div>

                    <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                        {/* 头像上传 */}
                        <div className="flex flex-col items-center">
                            <div
                                className="relative w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="头像预览"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full" >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <p className="mt-2 text-sm text-gray-500">点击上传头像</p>
                        </div>

                        {/* 用户名 */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                            <label htmlFor="username" className="flex text-sm font-medium text-gray-700 mb-1">
                                用户名
                            </label>
                            {errors.username && (
                                <span className="text-red-500 text-sm">{errors.username}</span>
                            )}
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="输入用户名"
                            />
                        </div>

                        {/* 密码 */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                密码
                            </label>
                            {errors.password && (
                                <span className="text-red-500 text-sm">{errors.password}</span>
                            )}
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="输入密码"
                            />
                        </div>

                        {/* 电话 */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                电话号码
                            </label>
                            {errors.phone && (
                                <span className="text-red-500 text-sm">{errors.phone}</span>
                            )}
                            </div>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="输入电话号码"
                            />
                        </div>

                        {/* 角色选择 */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                用户角色
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent transition"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="USER">普通用户</option>
                                <option value="ADMIN">管理员</option>
                            </select>
                        </div>

                        {/* 提交按钮 */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                                    isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                            >
                                {isSubmitting ? <div className='text-black'>注册中... </div>: <div className='text-black'>注册账户</div>}
                            </button>
                        </div>
                    </form>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            已有账户? <a href="#" className="font-medium text-blue-600 hover:text-blue-500" onClick={()=>{navigate("/home")}}>登录</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}