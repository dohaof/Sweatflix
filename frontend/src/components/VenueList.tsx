import VenueItem from './VenueItem';
import type { Venue } from '../types';
import {useContext, useEffect, useState} from "react";
import {HomeContext} from "../contexts/globalContexts.tsx";
import {getVenue} from "../api/venueAPI.ts";
import {useNavigate} from "react-router-dom";
export const VenueList = () => {
    const state = useContext(HomeContext);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]); // 添加过滤后的场馆状态
    const [searchTerm, setSearchTerm] = useState(''); // 添加搜索关键词状态
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                setLoading(true);
                const data = await getVenue(sessionStorage.getItem("authToken") as string);
                setVenues(data);
                setFilteredVenues(data); // 初始化时显示所有场馆
            } catch (err) {
                console.error('获取场馆数据失败:', err);
                window.alert('获取场馆数据失败');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    // 添加搜索处理函数
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setFilteredVenues(venues);
        } else {
            const filtered = venues.filter(venue =>
                venue.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredVenues(filtered);
        }
    };

    // 添加清除搜索函数
    const clearSearch = () => {
        setSearchTerm('');
        setFilteredVenues(venues);
    };

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
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchTerm ? (
                        <button
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 bg-red-300"
                            onClick={clearSearch}
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
                {searchTerm && (
                    <div className="ml-4 text-sm text-gray-600">
                        找到 {filteredVenues.length} 个匹配结果
                    </div>
                )}
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
