import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenueById } from '../api/venueAPI.ts';
import type {Venue, VenueScheduleCreation} from "../types.ts";
import {createSchedule} from "../api/scheduleAPI.ts";


export function ScheduleCreate() {
    const { venue_id: venue_id } = useParams<{ venue_id: string }>();
    const navigate = useNavigate();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<VenueScheduleCreation>({
        venueId: parseInt(venue_id || '0'),
        startTime: '',
        endTime: '',
        capacity: 10,
        price: 100
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken') as string;
                const venueData = await getVenueById(parseInt(venue_id as string), token);
                setVenue(venueData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : '加载场馆信息失败');
            } finally {
                setLoading(false);
            }
        };

        if (venue_id) {
            fetchVenue();
        } else {
            setError('场馆ID无效');
            setLoading(false);
        }
    }, [venue_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' || name === 'price' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 表单验证
        if (!formData.startTime || !formData.endTime) {
            setError('请填写完整的开始和结束时间');
            return;
        }

        if (new Date(formData.startTime) >= new Date(formData.endTime)) {
            setError('结束时间必须晚于开始时间');
            return;
        }

        if (formData.capacity <= 0) {
            setError('容量必须大于0');
            return;
        }

        if (formData.price <= 0) {
            setError('价格必须大于0');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            // 调用创建API
            const responseData = await createSchedule(formData,token as string);
            window.alert(responseData)
            setSubmitSuccess(true);
            navigate(-1);
        } catch (err) {
            setError(err instanceof Error ? err.message : '创建过程中发生错误');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 格式化日期时间显示
    const formatDateTime = (dateString: string) => {
        if (!dateString) return '未设置';
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
                </div>
        );
    }

    if (error && !venue) {
        return (
            <div className="alert alert-error max-w-3xl mx-auto mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            </div>
    );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
        <button
            className="btn btn-ghost text-primary"
    onClick={() => navigate(-1)}
>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
    返回场馆
    </button>
    <h1 className="text-3xl font-bold mt-4">
        为 <span className="text-primary">{venue?.name}</span> 创建预约时段
    </h1>
    <div className="divider"></div>
        </div>

    {submitSuccess ? (
        <div className="alert alert-success shadow-lg">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>预约时段创建成功！3秒后返回场馆详情页</span>
    </div>
    </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 场馆信息卡片 */}
            <div className="md:col-span-1">
    <div className="card bg-base-100 shadow-md">
    <figure>
        {venue?.image ? (
            <img
                src={venue.image}
        alt={venue.name}
        className="w-full h-48 object-cover"
            />
    ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48 flex items-center justify-center">
        <span className="text-gray-500">暂无图片</span>
            </div>
    )}
        </figure>
        <div className="card-body">
    <h2 className="card-title">{venue?.name}</h2>
    <p className="text-gray-600 text-sm">{venue?.description}</p>
    </div>
    </div>
    </div>

        {/* 创建表单 */}
        <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-xl shadow-md">
        {error && (
            <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
        </div>
    )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 开始时间 */}
            <div className="form-control">
    <label className="label">
    <span className="label-text font-semibold">开始时间</span>
        </label>
        <input
        type="datetime-local"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
        />
        <div className="text-sm text-gray-500 mt-1">
            选择时间: {formatDateTime(formData.startTime)}
        </div>
        </div>

        {/* 结束时间 */}
        <div className="form-control">
        <label className="label">
        <span className="label-text font-semibold">结束时间</span>
            </label>
            <input
        type="datetime-local"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
        />
        <div className="text-sm text-gray-500 mt-1">
            选择时间: {formatDateTime(formData.endTime)}
        </div>
        </div>

        {/* 容量 */}
        <div className="form-control">
        <label className="label">
        <span className="label-text font-semibold">最大容量</span>
            </label>
            <div className="join">
    <button
        type="button"
        className="join-item btn"
        onClick={() => setFormData(prev => ({
        ...prev,
        capacity: Math.max(1, prev.capacity - 1)
    }))}
    >
        -
            </button>
        <input
        type="number"
        name="capacity"
        value={formData.capacity}
        onChange={handleChange}
        min="1"
        className="input input-bordered join-item w-full text-center"
        required
        />
        <button
            type="button"
        className="join-item btn"
        onClick={() => setFormData(prev => ({
        ...prev,
        capacity: prev.capacity + 1
    }))}
    >
        +
            </button>
        </div>
        <div className="text-sm text-gray-500 mt-1">
        可同时容纳 {formData.capacity} 人
    </div>
    </div>

        {/* 价格 */}
        <div className="form-control">
        <label className="label">
        <span className="label-text font-semibold">价格 (¥)</span>
            </label>
            <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        ¥
        </span>
        <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        min="0.01"
        step="0.01"
        className="input input-bordered w-full pl-8"
        required
        />
        </div>
        <div className="text-sm text-gray-500 mt-1">
        每人每小时费用
        </div>
        </div>
        </div>

        <div className="form-control mt-8">
    <button
        type="submit"
        className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
        disabled={isSubmitting}
            >
            {isSubmitting ? '创建中...' : '创建预约时段'}
            </button>
            </div>
            </form>

        {/* 预览卡片 */}
        <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">预览效果</h3>
            <div className="card bg-base-100 shadow-md">
    <div className="card-body">
    <h4 className="card-title">{venue?.name} 预约时段</h4>
    <div className="grid grid-cols-2 gap-4 mt-3">
    <div>
        <div className="text-sm text-gray-500">开始时间</div>
        <div className="font-medium">{formatDateTime(formData.startTime)}</div>
    </div>
    <div>
    <div className="text-sm text-gray-500">结束时间</div>
        <div className="font-medium">{formatDateTime(formData.endTime)}</div>
    </div>
    <div>
    <div className="text-sm text-gray-500">容量</div>
        <div className="font-medium">{formData.capacity} 人</div>
    </div>
    <div>
    <div className="text-sm text-gray-500">价格</div>
        <div className="font-medium text-primary">¥{formData.price.toFixed(2)}/人</div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    )}
    </div>
);
}
