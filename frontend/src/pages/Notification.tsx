import {useState, useEffect, useContext} from 'react';
import { getNotice } from '../api/userAPI.ts';
import type {Notice} from "../types.ts";
import {useNavigate} from "react-router-dom";
import {NotificationContext} from "../contexts/globalContexts.tsx"; // 根据实际路径调整

export function NotificationPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const navigate = useNavigate();
    const state=useContext(NotificationContext);
    // 获取token
    const token = sessionStorage.getItem('authToken') || '';

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const noticesData = await getNotice(token);

                // 按创建时间倒序排序
                const sortedNotices = [...noticesData].sort((a, b) =>
                    new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
                );

                setNotices(sortedNotices);

                // 计算未读通知数量
                const count = sortedNotices.filter(notice => !notice.read).length;
                setUnreadCount(count);
                state?.setIsNewNotice(false);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : '加载通知失败');
                console.error('加载通知失败:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchNotices();
        } else {
            setError('用户未登录');
            setLoading(false);
            navigate('/home');
        }
    }, []);
    // 切换通知展开状态
    const toggleNotice = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 标记通知为已读
    const markAsRead = (id: number) => {
        const updatedNotices = notices.map(notice => {
            if (notice.id === id && !notice.read) {
                return { ...notice, read: true };
            }
            return notice;
        });

        setNotices(updatedNotices);
        // 更新未读计数
        const count = updatedNotices.filter(notice => !notice.read).length;
        setUnreadCount(count);
    };

    // 全部标记为已读
    const markAllAsRead = () => {
        const updatedNotices = notices.map(notice => {
            if (!notice.read) {
                return { ...notice, read: true };
            }
            return notice;
        });

        setNotices(updatedNotices);
        setUnreadCount(0);
    };

    // 渲染加载状态
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <span className="ml-4 text-lg">加载通知中...</span>
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
                    onClick={() => window.location.reload()}
                >
                    重新加载
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* 页面标题 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">通知中心</h1>
                        <p className="text-gray-600 mt-2">查看场地更新和评论通知</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="badge badge-primary badge-lg">
                            {unreadCount} 条未读
                        </div>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                        >
                            全部标记为已读
                        </button>
                    </div>
                </div>

                {/* 通知列表 */}
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div
                            key={notice.id}
                            className={`card shadow-md transition-all duration-300 ${
                                expandedId === notice.id
                                    ? 'bg-base-200 border-l-4 border-primary'
                                    : 'bg-base-100'
                            } ${!notice.read ? 'ring-1 ring-primary/20' : ''}`}
                        >
                            <div
                                className="card-body p-4 cursor-pointer"
                                onClick={() => {
                                    toggleNotice(notice.id);
                                    if (!notice.read) {
                                        markAsRead(notice.id);
                                    }
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        {!notice.read && (
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        )}
                                        <div>
                                            <h2 className={`font-bold ${
                                                !notice.read ? 'text-primary' : 'text-gray-600'
                                            }`}>
                                                {notice.text}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-1">
                        <span className="badge badge-ghost badge-sm">
                          {notice.venueName}
                        </span>
                                                <span className="text-xs text-gray-500">
                          {formatDate(notice.createTime)}
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-ghost btn-circle btn-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleNotice(notice.id);
                                            if (!notice.read) {
                                                markAsRead(notice.id);
                                            }
                                        }}
                                    >
                                        {expandedId === notice.id ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* 通知详情 */}
                                {expandedId === notice.id && (
                                    <div className="mt-4 pl-5 border-l-2 border-primary/30 animate-fadeIn">
                                        <div className="prose prose-sm max-w-none text-gray-700">
                                            <p>{notice.content}</p>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    console.log("跳转到场地:", notice.venueId);
                                                    navigate('/venue/' + notice.venueId);
                                                }}
                                            >
                                                查看场地详情
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 通知统计 */}
                <div className="mt-10 p-6 bg-base-200 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">通知统计</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="stat bg-base-100 rounded-lg p-4">
                            <div className="stat-title">总通知数</div>
                            <div className="stat-value text-primary">{notices.length}</div>
                            <div className="stat-desc">所有历史通知</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg p-4">
                            <div className="stat-title">未读通知</div>
                            <div className="stat-value text-secondary">{unreadCount}</div>
                            <div className="stat-desc">待查看通知</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg p-4">
                            <div className="stat-title">本周通知</div>
                            <div className="stat-value text-accent">
                                {notices.filter(n => {
                                    const noticeDate = new Date(n.createTime);
                                    const oneWeekAgo = new Date();
                                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                    return noticeDate > oneWeekAgo;
                                }).length}
                            </div>
                            <div className="stat-desc">最近7天</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 示例样式（添加到CSS文件中）