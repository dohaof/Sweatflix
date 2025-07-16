import {useState, useEffect, useContext, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import type {CommentDTO, Comment, Venue, VenueSchedule} from "../types.ts";
import {deleteVenue, favourVenue, getVenueById} from "../api/venueAPI.ts";
import {UserContext} from "../contexts/globalContexts.tsx";
import {bookSchedule, deleteSchedule, getSchedulesOfVenue, notifyPay} from "../api/scheduleAPI.ts";
import {addComment, getCommentsByVenueId, thumbUpComment} from "../api/commentAPI.ts";
import {uploadImageToServer} from "../api/upload.ts";
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
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState({
        content: '',
        rate: 5,
        images: [] as string[]
    } as CommentDTO);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const navigate = useNavigate();
    const handleDelete = async () => {
        if (!venue || !state) return;

        if (!window.confirm('确定要删除这个场馆吗？此操作不可撤销。')) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteVenue(venue.id,sessionStorage.getItem("authToken") as string);
            navigate('/home'); // 删除成功后跳转回场馆列表
        } catch (err) {
            setError(err instanceof Error ? err.message : '删除场馆失败');
            console.error('删除场馆失败:', err);
        } finally {
            setIsDeleting(false);
        }
    };
    const handleScheduleClick =async (scheduleId:number) => {
        try {
            const token = sessionStorage.getItem('authToken') as string;
            let responseData;
            if(state!.currentUser!.role=='admin') {
                if (!window.confirm('确定要删除吗？此操作不可撤销。')) {
                    return;
                }
                responseData = await deleteSchedule(scheduleId,token)
                setSchedules(prevSchedules =>
                    prevSchedules.filter(s => s.id !== scheduleId)
                );
                window.alert(responseData);
            }else {
                if (!window.confirm('确定要预定吗？')) {
                    return;
                }
                responseData = await bookSchedule(scheduleId,token)
                if(window.confirm('模拟付款成功？(模拟支付宝等支付回调是否成功)')){setSchedules(prevSchedules =>
                    prevSchedules.map(schedule =>
                        schedule.id === scheduleId
                            ? { ...schedule, bookedForCurrentUser: true } // 创建新对象
                            : schedule
                    )
                );
                    console.log(schedules);
                    await notifyPay(responseData.orderId, true, token)
                }else{
                    await notifyPay(responseData.orderId, false, token)
                }
                window.alert(responseData.info);
            }
        }catch (error) {
            window.alert(error);
        }
    }
    const fetchComments = useCallback(async () => {
        if (!venue_id) return;

        try {
            setIsLoadingComments(true);
            const token = sessionStorage.getItem('authToken') as string;
            const commentsData = await getCommentsByVenueId(parseInt(venue_id), token);
            console.log(commentsData);
            setComments(commentsData);
        } catch (error) {
            setError('加载评论失败: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsLoadingComments(false);
        }
    },[venue_id]);
    const handleSubmitComment = async () => {
        if (!newComment.content.trim()) {
            alert('请填写评论内容');
            return;
        }

        if (!venue || !state?.currentUser) return;

        try {
            const token = sessionStorage.getItem('authToken') as string;
            const dto = {
                venueId: venue.id,
                content: newComment.content,
                rate: newComment.rate,
                images: newComment.images
            };

            await addComment(dto, token);

            // 重置表单并刷新评论
            setNewComment({ content: '', rate: 5, images: [] });
            await fetchComments();
            setActiveTab('comments');
            alert('评论发表成功！');
        } catch (error) {
            alert('发表评论失败: ' + (error instanceof Error ? error.message : String(error)));
        }
    };
    const handleThumbUp = async (commentId: number) => {
        try {
            const token = sessionStorage.getItem('authToken') as string;
            await thumbUpComment(commentId, token);

            // 更新点赞状态
            setComments(prev => prev.map(comment =>
                comment.id === commentId
                    ? { ...comment, thumbUpCount: comment.thumbUpCount + 1, hasThumbed: true }
                    : comment
            ));
        } catch (error) {
            alert('点赞失败: ' + (error instanceof Error ? error.message : String(error)));
        }
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newImages = [...newComment.images];

        // 限制最多3张图片
        if (newImages.length + files.length > 3) {
            alert('最多只能上传3张图片');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 20 * 1024 * 1024) { // 5MB限制
                alert('图片大小不能超过20MB');
                continue;
            }

            // const reader = new FileReader();
            // reader.onload = (event) => {
            //     if (event.target?.result) {
            //         newImages.push(event.target.result as string);
            //         setNewComment({...newComment, images: newImages});
            //     }
            // };
            // reader.readAsDataURL(file);
            try {
                // 上传到服务器
                const imageUrl = await uploadImageToServer(file);
                newImages.push(imageUrl);
                // 保存服务器返回的URL
                setNewComment({ ...newComment, images: newImages});
            } catch (error) {
                window.alert("图片上传失败，请重试！");
                console.error("上传错误详情:", error);
            }
        }
    };

// 删除已选图片
    const removeImage = (index: number) => {
        const newImages = [...newComment.images];
        newImages.splice(index, 1);
        setNewComment({ ...newComment, images: newImages });
    };
    const handleToggleFavorite = async () => {
        if (!state || !venue) return;
        try {
            const token = sessionStorage.getItem('authToken') as string;
            const responseMsg=await favourVenue(venue.id,token);
            setIsFavorite(!isFavorite);
            // 显示操作反馈
            alert(responseMsg);
        } catch (err) {
            console.error('收藏操作失败:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem('authToken') as string;

                // 获取场馆详情
                const venueData = await getVenueById(parseInt(venue_id as string),token);
                setVenue(venueData);

                // 获取场馆排期
                const scheduleData = await getSchedulesOfVenue(venueData.id,token);
                scheduleData.forEach((schedule) => {
                    schedule.bookedForCurrentUser = schedule.scheduleOrders && schedule.scheduleOrders.some(item => item.userId == state!.currentUser!.id && (item.paySuccess == null || item.paySuccess));
                })
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

    }, [fetchComments, navigate, state, state?.currentUser, venue_id]);
    useEffect(() => {
        if (activeTab === 'comments' && comments.length == 0) {
            fetchComments();
        }
    }, [activeTab, comments.length, fetchComments]);
    useEffect(() => {
        if(state?.favourList.some(e=>e==parseInt(venue_id as string))){
            setIsFavorite(true);
        }
    }, [state, state?.favourList, venue_id]);
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
        // console.log(dateString)
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl bg-blue-100 rounded-xl">
            {/* 顶部图片和基本信息 */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="md:w-1/2 border-1 rounded">
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
                                    onClick={()=>{navigate('/venue/createSchedule/'+venue.id)}}
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
            {activeTab === 'schedules' && (
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
                                <div key={schedule.id} className="card bg-base-100 shadow-md border rounded">
                                    <div className="card-body px-2">
                                        <h3 className="card-title text-lg">开始:{formatDateTime(schedule.startTime)}</h3>
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
                                            <button className="btn btn-primary btn-sm" onClick={()=>{handleScheduleClick(schedule.id)

                                            }}
                                            disabled={state!.currentUser!.role=="norm"&& (schedule.bookedForCurrentUser||schedule.scheduleOrders.filter((e)=>e.paySuccess==null||e.paySuccess).length>=schedule.capacity)}>
                                                {state!.currentUser!.role=='admin'?'删除排程':(schedule.bookedForCurrentUser?'预约成功'
                                                    :(schedule.bookedForCurrentUser||schedule.scheduleOrders.filter((e)=>e.paySuccess==null||e.paySuccess).length>=schedule.capacity)?"人数已满": '立即预约')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'comments' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">用户评论 ({comments.length})</h2>

                    {isLoadingComments ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>暂无评论，成为第一个评论者吧！</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {comments.map(comment => (
                                <div key={comment.id} className="bg-base-100 p-4 rounded-lg shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full">
                                                        {comment.userAvatar ? (
                                                            <img
                                                                src={comment.userAvatar}
                                                                alt="用户头像"
                                                                className="w-[8vw] h-[8vw] rounded-full object-cover" // 让高度根据宽度自动调整
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center rounded-full bg-gray-200 w-[8vw] h-[8vw]">没有头像</div>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="font-bold">{comment.userName}</h4>
                                                <div className="rating rating-xs">
                                                    {[...Array(5)].map((_, i) => (
                                                        <input
                                                            key={i}
                                                            type="radio"
                                                            name={`rating-${comment.id}`}
                                                            className="mask mask-star-2 bg-orange-400"
                                                            checked={i < comment.rate}
                                                            readOnly
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                {formatDateTime(comment.createdAt)}
              </span>
                                    </div>

                                    <p className="text-gray-700 mb-3">{comment.content}</p>

                                    {comment.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {comment.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`评论图片 ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded cursor-pointer"
                                                    onClick={() => window.open(img, '_blank')}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <button
                                            className={`btn btn-sm ${comment.hasThumbed ? 'btn-primary' : 'btn-outline'}`}
                                            onClick={() => handleThumbUp(comment.id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                            点赞 ({comment.thumbUpCount})
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'post-comment' && (
            <div className="max-w-2xl mx-auto b">
                <h2 className="text-2xl font-bold mb-6">发表评论</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">评分</label>
                    <div className="rating rating-lg">
                        {[1, 2, 3, 4, 5].map(star => (
                            <input
                                key={star}
                                type="radio"
                                name="rating"
                                className="mask mask-star-2 bg-orange-400"
                                checked={star === newComment.rate}
                                onChange={() => setNewComment({...newComment, rate: star})}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">评论内容</label>
                    <textarea
                        className="textarea textarea-bordered w-full h-32 border border-"
                        placeholder="分享您的体验..."
                        value={newComment.content}
                        onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">上传图片 (最多3张)</label>
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={newComment.images.length >= 3}
                    />

                    {newComment.images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                            {newComment.images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img}
                                        alt={`预览 ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded border border-dotted"
                                    />
                                    <button
                                        className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                                        onClick={() => removeImage(index)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmitComment}
                        disabled={!newComment.content.trim()}
                    >
                        提交评论
                    </button>
                </div>
            </div>
        )}
        </div>
    );
}

// 示例API函数（需要根据实际API实现）
// async function getVenueSchedules(token: string, venueId: number): Promise<VenueSchedule[]> {
//     // 实际实现中调用API
//     return [
//         {
//             id: 1,
//             venueId,
//             startTime: "2023-07-20T09:00:00Z",
//             endTime: "2023-07-20T11:00:00Z",
//             capacity: 20,
//             price: 300,
//             scheduleOrderId: []
//         },
//         {
//             id: 2,
//             venueId,
//             startTime: "2023-07-20T13:00:00Z",
//             endTime: "2023-07-20T15:00:00Z",
//             capacity: 20,
//             price: 350,
//             scheduleOrderId: []
//         },
//         {
//             id: 3,
//             venueId,
//             startTime: "2023-07-20T18:00:00Z",
//             endTime: "2023-07-20T20:00:00Z",
//             capacity: 20,
//             price: 400,
//             scheduleOrderId: []
//         }
//     ];
// }
