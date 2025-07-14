import React from 'react';
import type {Venue} from '../types';

interface VenueItemProps {
    venue: Venue;
    onClick: () => void;
}

const VenueItem: React.FC<VenueItemProps> = ({ venue, onClick }) => {
    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
    onClick={onClick}
    >
            <div className="h-48 bg-gray-200 border-2 border-dashed rounded-t-xl" >
                {venue.image ? (
                    <img
                        src={venue.image}
                        alt="场地照片"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center bg-gray-200 w-full h-full">没有照片</div>
                )}
            </div>
    <div className="p-4">
    <div className="flex justify-between items-start">
    <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
        {venue?.scheduleId?.length>0?'有预约项':'无预约项'}
            </span>
        </div>
        <div className="mt-2 flex items-center text-gray-600">
            <span>描述: {venue.description}</span>
        </div>
    <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">
        查看详情
        </button>
        </div>
        </div>
);
};

export default VenueItem;