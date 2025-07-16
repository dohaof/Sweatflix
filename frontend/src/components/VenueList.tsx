import VenueItem from './VenueItem';
import type { Venue } from '../types';
import {useContext, useEffect, useState} from "react";
import {HomeContext, UserContext} from "../contexts/globalContexts.tsx";
import {getFavours, getVenue} from "../api/venueAPI.ts";
import {useNavigate} from "react-router-dom";
export const VenueList = () => {
    const state = useContext(HomeContext);
    const userState = useContext(UserContext);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]); // 添加过滤后的场馆状态
    const [searchTerm, setSearchTerm] = useState(''); // 添加搜索关键词状态
    const [loading, setLoading] = useState(true);
    const [favourOnly, setFavourOnly] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                setLoading(true);
                const data = await getVenue(sessionStorage.getItem("authToken") as string);
                setVenues(data);
                if(userState?.isLoggedIn){
                const favourites = await getFavours(sessionStorage.getItem("authToken") as string);
                userState?.setFavourList(favourites);
                }
                setFilteredVenues(data); // 初始化时显示所有场馆
            } catch (err) {
                console.error('获取场馆数据失败:', err);
                window.alert('获取场馆数据失败');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, [userState?.isLoggedIn]);
    useEffect(() => {
        let filtered = venues;
        // 搜索过滤
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(venue =>
                venue.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // 收藏过滤
        if (favourOnly && userState?.favourList) {
            filtered = filtered.filter(venue =>
                userState.favourList.some(fav => fav === venue.id)
            );
        }
        setFilteredVenues(filtered);
    }, [venues, searchTerm, favourOnly, userState?.favourList]); // 所有依赖项

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className={`p-4 overflow-auto ${state?.isSideBarOpen ? 'w-3/4' : 'w-full'}`}>
            {/* 添加搜索栏 */}
            <div className="mb-6 flex items-center">
                <div className="relative flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="搜索场馆名称..."
                        className="input input-bordered w-full text-black pl-10 pr-10 h-15 bg-gradient-to-tl from-green-200 to-blue-200 rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm ? (
                        <button
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 bg-red-300"
                            onClick={()=>setSearchTerm('')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    ) : (
                        <div className="absolute left-3 top-5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* 显示搜索结果数量 */}
                {userState?.currentUser?.role!='admin' && (
                    <button
                    className="ml-auto bg-amber-300 rounded"
                    onClick={() => {
                        if(!userState || !userState.isLoggedIn) {
                            alert("请先登录");
                            return;
                        }
                        setFavourOnly(!favourOnly);
                    }}
                >
                    {favourOnly ? "仅收藏" : "所有内容"}
                </button>)}
            </div>

            {/* 无结果提示 */}
            {filteredVenues.length === 0 && !loading && (
                <div className="alert alert-info shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>没有找到匹配的场馆</span>
                    </div>
                </div>
            )}

            {/* 场馆列表 */}
            <div className={`grid grid-cols-1 ${state?.isSideBarOpen ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-6 p-0`}>
                {filteredVenues.map((venue) => (
                    <VenueItem
                        key={venue.id}
                        venue={venue}
                        onClick={() => { navigate('/venue/' + venue.id) }}
                    />
                ))}
            </div>
        </div>
    );
};
