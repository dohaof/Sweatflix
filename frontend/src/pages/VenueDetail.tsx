import {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import type {Venue, VenueSchedule} from "../types.ts";
import {deleteVenue, getVenueById} from "../api/venueAPI.ts";
import {UserContext} from "../contexts/globalContexts.tsx";
// import { getVenueById, getVenueSchedules } from '../api/venueAPI.ts'; // 根据你的实际路径调整

export function VenueDetail() {
    const { venue_id } = useParams<{ venue_id: string }>();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [schedules, setSchedules] = useState<VenueSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'schedules' | 'comments'|'post-comment'>('schedules');
    const state=useContext(UserContext);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const handleDelete = async () => {
        if (!venue || !state) return;

        if (!window.confirm('确定要删除这个场馆吗？此操作不可撤销。')) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteVenue(venue.id,localStorage.getItem("authToken") as string);
            navigate('/home'); // 删除成功后跳转回场馆列表
        } catch (err) {
            setError(err instanceof Error ? err.message : '删除场馆失败');
            console.error('删除场馆失败:', err);
        } finally {
            setIsDeleting(false);
        }
    };
    const handleToggleFavorite = async () => {
        if (!state || !venue) return;

        // try {
        //     const token = localStorage.getItem('token') || '';
        //     const newFavoriteStatus = await toggleFavorite(token, venue.id);
        //     setIsFavorite(newFavoriteStatus);
        //
        //     // 显示操作反馈
        //     if (newFavoriteStatus) {
        //         // 这里可以添加更美观的通知
        //         console.log('已添加到收藏');
        //     } else {
        //         console.log('已从收藏中移除');
        //     }
        // } catch (err) {
        //     console.error('收藏操作失败:', err);
        //     // 这里可以添加错误提示
        // }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken') as string;

                // 获取场馆详情
                const venueData = await getVenueById(parseInt(venue_id as string),token);
                setVenue(venueData);

                // 获取场馆排期
                const scheduleData = await getVenueSchedules(token, venueData.id);
                setSchedules(scheduleData);

                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : '加载场馆详情失败');
            } finally {
                setLoading(false);
            }
        };
        if (!state?.currentUser){
            window.alert('请先登录');
            navigate('/home');
        }
        if (venue_id) {
            fetchData();
        } else {
            setError('场馆ID无效');
            console.log(venue_id);
            setLoading(false);
        }
    }, [navigate, state?.currentUser, venue_id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error max-w-3xl mx-auto mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="alert alert-warning max-w-3xl mx-auto mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>未找到场馆信息</span>
            </div>
        );
    }

    // 格式化日期时间
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* 顶部图片和基本信息 */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="md:w-1/2">
                    {venue.image ? (
                        <img
                            src={venue.image}
                            alt={venue.name}
                            className="w-full h-80 object-cover rounded-xl shadow-lg"
                        />
                    ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center">
                            <span className="text-gray-500">暂无图片</span>
                        </div>
                    )}
                </div>

                <div className="md:w-1/2">

                    <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
                    <p className="text-gray-700 mb-6 whitespace-pre-line">{venue.description}</p>

                    <div className="bg-base-200 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">基本信息</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <span className="font-medium">可预约时段:</span>
                                <span className="ml-2">{schedules.length}个</span>
                            </div>
                            <div>
                                <span className="font-medium">平均价格:</span>
                                <span className="ml-2">
                  {schedules.length > 0
                      ? `¥${(schedules.reduce((sum, s) => sum + s.price, 0) / schedules.length).toFixed(2)}`
                      : '暂无数据'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute  flex gap-2">
                        {state!.currentUser!.role=='admin' ?(
                            <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="btn btn-error btn-sm"
                            >
                                {isDeleting ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        删除场馆
                                    </>
                                )}
                            </button>
                                <button
                                    onClick={()=>{navigate('')}}
                                    disabled={isDeleting}
                                    className="btn btn-error btn-sm"
                                >
                                    {isDeleting ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            添加预约
                                        </>
                                    )}
                                </button>
                            <button
                                onClick={()=>{navigate('/venue/create/'+venue.id)}}
                                disabled={isDeleting}
                                className="btn btn-error btn-sm"
                            >
                                {isDeleting ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        修改场馆
                                    </>
                                )}
                            </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleToggleFavorite}
                                className={`btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline'}`}
                            >
                                {isFavorite ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                        已收藏
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        收藏
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 选项卡切换 */}
            <div className="tabs tabs-boxed bg-base-200 p-1 rounded-lg mb-8">
                <button
                    className={`tab ${activeTab === 'schedules' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('schedules')}
                >
                    可预约时间
                </button>
                <button
                    className={`tab ${activeTab === 'comments' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                    用户评论
                </button>
                <button
                    className={`tab ${activeTab === 'post-comment' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('post-comment')}
                >
                    发表评论
                </button>
            </div>

            {/* 内容区域 */}
            {activeTab === 'schedules' ? (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">可预约时段</h2>

                    {schedules.length === 0 ? (
                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>暂无可用预约时段</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {schedules.map((schedule) => (
                                <div key={schedule.id} className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title text-lg">{formatDateTime(schedule.startTime)}</h3>
                                        <p className="text-gray-600">结束: {formatDateTime(schedule.endTime)}</p>

                                        <div className="flex justify-between items-center mt-3">
                                            <div>
                                                <span className="font-medium">价格:</span>
                                                <span className="text-primary ml-1">¥{schedule.price}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">容量:</span>
                                                <span className="ml-1">{schedule.capacity}人</span>
                                            </div>
                                        </div>

                                        <div className="card-actions justify-end mt-4">
                                            <button className="btn btn-primary btn-sm">
                                                立即预约
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4">用户评论</h2>

                    <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>评论功能即将上线，敬请期待！</span>
                    </div>

                    {/* 占位评论 */}
                    <div className="space-y-6 mt-6">
                        <div className="bg-base-100 p-4 rounded-lg shadow">
                            <div className="flex items-center mb-3">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                        <span className="text-xs">用户</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-bold">张先生</h4>
                                    <div className="rating rating-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <input
                                                key={i}
                                                type="radio"
                                                name="rating"
                                                className="mask mask-star-2 bg-orange-400"
                                                checked={i < 4}
                                                readOnly
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">场地设施非常完善，服务也很周到，下次还会再来！</p>
                            <p className="text-gray-500 text-sm mt-2">2023-06-15</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 示例API函数（需要根据实际API实现）
async function getVenueSchedules(token: string, venueId: number): Promise<VenueSchedule[]> {
    // 实际实现中调用API
    return [
        {
            id: 1,
            venueId,
            startTime: "2023-07-20T09:00:00Z",
            endTime: "2023-07-20T11:00:00Z",
            capacity: 20,
            price: 300,
            autoRenew: false,
            scheduleOrderId: []
        },
        {
            id: 2,
            venueId,
            startTime: "2023-07-20T13:00:00Z",
            endTime: "2023-07-20T15:00:00Z",
            capacity: 20,
            price: 350,
            autoRenew: true,
            scheduleOrderId: []
        },
        {
            id: 3,
            venueId,
            startTime: "2023-07-20T18:00:00Z",
            endTime: "2023-07-20T20:00:00Z",
            capacity: 20,
            price: 400,
            autoRenew: false,
            scheduleOrderId: []
        }
    ];
}
