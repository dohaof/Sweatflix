import React, {useState, useRef, useContext} from 'react';
import {GlobalContext} from "../contexts/userContexts.tsx";
import {useNavigate} from "react-router-dom";

export function ModifyPage() {
    // 模拟当前用户数据（实际应用中应从上下文或API获取）
    const navigate = useNavigate();
    const [currentUser] = useState({
        username: 'user123',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
    });
    const state = useContext(GlobalContext)
    const [formData, setFormData] = useState({
        username: currentUser.username,
        oldPassword: '',
        newPassword: '',
        image: currentUser.image
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser.image);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 处理表单字段变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // 清除该字段的错误信息
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // 处理头像上传
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const file = e.target.files?.[0];
        // if (file) {
        //     // 客户端预览
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const previewUrl = reader.result as string;
        //         setAvatarPreview(previewUrl);
        //         setFormData(prev => ({ ...prev, image: previewUrl }));
        //     };
        //     reader.readAsDataURL(file);
        // }
    };

    // 验证表单
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = '用户名不能为空';
        }

        if (formData.newPassword) {
            if (!formData.oldPassword) {
                newErrors.oldPassword = '请输入旧密码';
            }

            if (formData.newPassword.length < 6) {
                newErrors.newPassword = '密码长度至少为6位';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;
        //
        // setIsSubmitting(true);
        // setSuccessMessage('');
        //
        // try {
        //     // 模拟API请求
        //     await new Promise(resolve => setTimeout(resolve, 1500));
        //
        //     // 实际项目中应调用更新用户信息的API
        //     // const response = await axios.put('/api/user/profile', formData);
        //
        //     console.log('更新数据:', formData);
        //     setSuccessMessage('用户信息更新成功！');
        // } catch (error) {
        //     console.error('更新失败:', error);
        //     setErrors({ form: '更新失败，请重试' });
        // } finally {
        //     setIsSubmitting(false);
        // }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br w-[100vw] from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-[100vw] max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* 顶部标题栏 */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">修改个人信息</h2>
                            <div className="bg-indigo-800 rounded-full p-2" onClick={()=>{navigate('/home')}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-indigo-200 mt-2">更新您的账户信息</p>
                    </div>

                    <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                        {/* 头像上传区域 */}
                        <div className="flex flex-col items-center">
                            <div
                                className="relative w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg cursor-pointer group overflow-hidden"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="头像预览"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <p className="mt-3 text-sm text-gray-500 font-medium">点击更换头像</p>
                        </div>

                        {/* 用户名 */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                                className={`w-full px-4 py-2.5 border ${
                                    errors.username ? 'border-red-300' : 'border-blue-700'
                                } text-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="输入新用户名"
                            />
                        </div>

                        {/* 旧密码 */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                                    旧密码
                                </label>
                                {errors.oldPassword && (
                                    <span className="text-red-500 text-sm">{errors.oldPassword}</span>
                                )}
                            </div>
                            <input
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                className={`w-full px-4 py-2.5 border ${
                                    errors.oldPassword ? 'border-red-300' : 'border-blue-700'
                                } text-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                                value={formData.oldPassword}
                                onChange={handleChange}
                                placeholder="输入当前密码"
                            />
                            <p className="mt-1 text-xs text-gray-500">仅在修改密码时需要填写</p>
                        </div>

                        {/* 新密码 */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    新密码
                                </label>
                                {errors.newPassword && (
                                    <span className="text-red-500 text-sm">{errors.newPassword}</span>
                                )}
                            </div>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                className={`w-full px-4 py-2.5 border ${
                                    errors.newPassword ? 'border-red-300' : 'border-blue-700'
                                } text-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="输入新密码"
                            />
                            <p className="mt-1 text-xs text-gray-500">留空表示不修改密码</p>
                        </div>

                        {/* 表单错误信息 */}
                        {errors.form && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                <p className="text-red-700 text-sm">{errors.form}</p>
                            </div>
                        )}

                        {/* 成功消息 */}
                        {successMessage && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <p className="text-green-700 text-sm">{successMessage}</p>
                            </div>
                        )}

                        {/* 操作按钮 */}
                        <div className="pt-3 flex space-x-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition ${
                                    isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    保存中...
                  </span>
                                ) : '保存更改'}
                            </button>

                            <button
                                type="button"
                                className="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                onClick={() => {
                                    setFormData({
                                        username: currentUser.username,
                                        oldPassword: '',
                                        newPassword: '',
                                        image: currentUser.image
                                    });
                                    setAvatarPreview(currentUser.image);
                                    setErrors({});
                                }}
                            >
                                重置
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}