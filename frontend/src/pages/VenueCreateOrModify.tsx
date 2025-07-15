import React, {useState, useRef, useEffect, useContext} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { uploadImageToServer } from "../api/upload";
import {changeVenue, createVenue, getVenueById} from "../api/venueAPI";
import type {VenueCreation} from "../types.ts";
import {UserContext} from "../contexts/globalContexts.tsx"; // 假设存在创建场馆的API

export function VenueCreateOrModify() {
    const { venue_id } = useParams<{ venue_id: string }>();
    const navigate = useNavigate();
    const state=useContext(UserContext)
    const [formData, setFormData] = useState<VenueCreation>({
        name: '',
        description: '',
        image: ''
    });
    const isCreating=!venue_id;
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken') as string;

                // 获取场馆详情
                const venueData = await getVenueById(parseInt(venue_id as string),token);
                setFormData(venueData);
                setImagePreview(venueData?.image);
            } catch (err) {
                window.alert(err);
            }
        };
        if (!state) {
            console.error("GlobalContext is missing!");
            window.alert("GlobalContext is missing!")
            return;
        }

        if(!isCreating) {fetchData()}
        if (!state.currentUser) {
            navigate('/home'); // 在 useEffect 里调用 navigate
            return;
        }
    }, [state, navigate, isCreating, venue_id]);
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const maxSize = 20 * 1024 * 1024;
        if (file && file.size > maxSize) {
            alert('文件大小不能超过20MB！');
            e.target.value = ''; // 清空已选文件
        }
        // 客户端预览
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
            const imageUrl = await uploadImageToServer(file);
            setFormData(prev => ({
                ...prev,
                image: imageUrl
            }));
        } catch (error) {
            setImagePreview(null);
            setFormData(prev => ({...prev, image: ""}));
            window.alert("图片上传失败，请重试！");
            console.error("上传错误:", error);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = '场馆名称不能为空';
        if (!formData.description.trim()) newErrors.description = '场馆描述不能为空';
        if (!formData.image) newErrors.image = '请上传场馆图片';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({ form: '' }); // 清除之前的错误

        try {
            let response;
            if (isCreating) {
                response = await createVenue(formData, localStorage.getItem("authToken") as string);
            } else {
                response = await changeVenue(
                    { ...formData, id: parseInt(venue_id as string) },
                    localStorage.getItem("authToken") as string
                );
            }

            setSuccessMessage(response);
            console.log(response,formData);
            setTimeout(() => navigate('/home'), 1500);
        } catch (error) {
            setErrors({ form: `创建/修改失败: ${error instanceof Error ? error.message : String(error)}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                        <div className="flex items-center justify-between">
                            {(isCreating)?(<h2 className="text-2xl font-bold text-white">创建新场馆</h2>):
                            <h2 className="text-2xl font-bold text-white">修改场馆</h2>
                            }
                            <div className="bg-indigo-800 rounded-full p-2" onClick={()=>{navigate('/home')}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-indigo-200 mt-2">设置运动场所信息</p>
                    </div>

                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        {/* 图片上传区域 */}
                        <div className="flex flex-col items-center">
                            <div
                                className="relative w-48 h-48 rounded-xl bg-gray-100 border-4 border-white shadow-lg cursor-pointer group overflow-hidden"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="场馆预览"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="mt-2 text-sm">点击上传图片</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            {errors.image && (
                                <p className="mt-2 text-red-500 text-sm">{errors.image}</p>
                            )}
                        </div>

                        {/* 场馆名称 */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    场馆名称 *
                                </label>
                                {errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name}</span>
                                )}
                            </div>
                            <input
                                name="name"
                                type="text"
                                className={`w-full px-4 py-2.5 border ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="输入场馆名称(修改时可留空，表示不更改)"
                            />
                        </div>

                        {/* 场馆描述 */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    场馆描述 *
                                </label>
                                {errors.description && (
                                    <span className="text-red-500 text-sm">{errors.description}</span>
                                )}
                            </div>
                            <textarea
                                name="description"
                                rows={4}
                                className={`w-full px-4 py-2.5 border ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="描述场馆特点、位置等信息(修改时可留空，表示不更改)"
                            />
                        </div>

                        {/* 状态消息 */}
                        {errors.form && (
                            <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-red-700">{errors.form}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-green-700">{successMessage}</p>
                            </div>
                        )}

                        {/* 提交按钮 */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-70"
                            >
                                {isSubmitting ? <p className={`text-black`}>提交中...</p> :<p className={`text-black`}> 提交场馆</p>}
                            </button>

                            <button
                                type="button"
                                className="py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                                onClick={() => navigate('/home')}
                            >
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}