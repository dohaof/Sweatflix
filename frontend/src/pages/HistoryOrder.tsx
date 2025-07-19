import {useState, useEffect, useContext} from 'react';
import { getOrderByUserId } from '../api/userAPI.ts';
import type {DetailOrder} from "../types.ts";
import {UserContext} from "../contexts/globalContexts.tsx";
import {useNavigate} from "react-router-dom";
import {cancelScheduleOrder} from "../api/scheduleAPI.ts"; // 根据实际路径调整

// 订单状态类型
type OrderStatus = 'all' | 'paid' | 'unpaid';

export function OrderHistoryPage() {
    const [orders, setOrders] = useState<DetailOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<DetailOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;
    const navigate= useNavigate();
    const state=useContext(UserContext)

    useEffect(() => {
        const userId =state!.currentUser!.id ;
        const token = sessionStorage.getItem('authToken') as string;
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const ordersData: DetailOrder[] = await getOrderByUserId(userId, token);

                setOrders(ordersData);
                setFilteredOrders(ordersData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : '加载订单失败');
                console.error('加载订单失败:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            fetchOrders();
        } else {
            setError('用户未登录');
            setLoading(false);
        }
    }, [state]);

    // 应用筛选和搜索
    useEffect(() => {
        let result = orders;

        // 应用状态筛选
        if (statusFilter !== 'all') {
            result = result.filter(order =>
                statusFilter === 'paid' ? order.paySuccess : !order.paySuccess
            );
        }

        // 应用搜索
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(order =>
                order.id.toString().includes(term) ||
                order.venueName.toLowerCase().includes(term)
            );
        }

        setFilteredOrders(result);
        setCurrentPage(1); // 重置到第一页
    }, [orders, statusFilter, searchTerm]);

    // 分页计算
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
    const handleClick = async (orderId:number) => {
        if (!window.confirm('确定要取消这个订单吗？此操作不可撤销。')) {
            return;
        }
        try {
            await cancelScheduleOrder(orderId,sessionStorage.getItem("authToken") as string);
            window.alert("取消成功")
            navigate('/home'); // 删除成功后跳转回场馆列表
        } catch (err) {
            setError(err instanceof Error ? err.message : '取消订单失败');
            console.error('取消订单失败:', err);
        }
    }
    // 渲染加载状态
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <span className="ml-4 text-lg">加载订单中...</span>
            </div>
        );
    }

    // 渲染错误状态
    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-12 p-6">
                <div className="alert alert-error shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
                <button
                    className="btn btn-primary mt-4"
                    onClick={() => navigate('/home')}
                >
                   返回主页
                </button>
            </div>
        );
    }

    // 无订单状态
    if (orders.length === 0 && !loading) {
        return (
            <div className="max-w-4xl mx-auto mt-12 p-6">
                <div className="text-center py-12">
                    <div className="inline-block p-4 bg-base-200 rounded-full mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">暂无订单记录</h2>
                    <p className="text-gray-600 mb-6">您还没有任何场馆预约订单</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.href = '/home'}
                    >
                        回主页
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* 页面标题 */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">历史订单</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        查看您的所有场馆预约记录，管理您的订单状态
                    </p>
                </div>

                {/* 控制栏：搜索和筛选 */}
                <div className="bg-base-200 rounded-xl p-4 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:w-1/3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="搜索订单ID或场馆名称..."
                                    className="input input-bordered w-full pl-10 h-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 rounded">
                            <button
                                className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setStatusFilter('all')}
                            >
                                全部订单
                            </button>
                            <button
                                className={`btn ${statusFilter === 'paid' ? 'btn-success' : 'btn-ghost'}`}
                                onClick={() => setStatusFilter('paid')}
                            >
                                已支付
                            </button>
                            <button
                                className={`btn ${statusFilter === 'unpaid' ? 'btn-error' : 'btn-ghost'}`}
                                onClick={() => setStatusFilter('unpaid')}
                            >
                                未支付成功
                            </button>
                        </div>
                    </div>
                </div>

                {/* 订单统计信息 */}
                <div className="stats shadow mb-8 w-full border bg-blue-100 rounded">
                    <div className="stat">
                        <div className="stat-title">总订单数</div>
                        <div className="stat-value text-primary">{orders.length}</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">已完成订单</div>
                        <div className="stat-value text-success">{orders.filter(o => o.paySuccess).length}</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">未完成支付订单</div>
                        <div className="stat-value text-error">{orders.filter(o => !o.paySuccess).length}</div>
                    </div>
                </div>

                {/* 订单列表 */}
                <div className="grid grid-cols-1 gap-6 mb-10">
                    {currentOrders.map((order) => (
                        <div key={order.id} className="card lg:card-side bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-dotted p-4">
                            <figure className="lg:w-1/4">
                                <img
                                    src={order.venueImage}
                                    alt={order.venueName}
                                    className="w-full h-48 lg:h-full object-cover"
                                />
                            </figure>

                            <div className="card-body lg:w-3/4">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                    <div>
                                        <h2 className="card-title text-xl">
                                            {order.venueName}
                                            <div className={`badge ml-2 ${order.paySuccess ? 'badge-success' : 'badge-error'}`}>
                                                {order.paySuccess ? '已支付' : '未支付'}
                                            </div>
                                        </h2>
                                        <p className="text-gray-600 mt-1">订单号: #{order.id}</p>

                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-sm text-gray-500">预约时间</p>
                                                <p>{formatDateTime(order.startTime)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">结束时间</p>
                                                <p>{formatDateTime(order.endTime)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">金额</p>
                                                <p className="text-primary font-bold">¥{order.price.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">订单状态</p>
                                                <p>{order.paySuccess ? '已完成' : '待支付'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end">
                                            <button className="btn btn-outline" onClick={()=>{navigate('/venue/'+order.venueId)}}>
                                                查看详情
                                            </button>
                                    </div>
                                   {order.paySuccess&&<div className="card-actions justify-end">
                                        <button className="btn btn-outline" onClick={()=>{handleClick(order.id)}}>
                                            取消订单
                                        </button>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 分页控件 */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="btn-group">
                            <button
                                className="btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`btn ${currentPage === page ? 'btn-active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
