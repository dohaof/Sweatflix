import VenueItem from './VenueItem';
import type { Venue } from '../types';
import {useContext} from "react";
import {HomeContext} from "../contexts/globalContexts.tsx";

const VenueList = () => {
    const state = useContext(HomeContext)
    const venues: Venue[] = [
        { id: 1, name: "篮球场" } as Venue,
        { id: 2, name: "篮球场" } as Venue,
        { id: 3, name: "篮球场" } as Venue,
        { id: 4, name: "篮球场" } as Venue,
        { id: 5, name: "篮球场" } as Venue,
        { id: 6, name: "篮球场" } as Venue,
        { id: 7, name: "篮球场" } as Venue,
        { id: 8, name: "篮球场" } as Venue,
        { id: 9, name: "篮球场" } as Venue,
        { id: 10, name: "篮球场" } as Venue,

        // 添加更多场地数据...
    ];

    return (
        <div className={`p-4 overflow-auto ${state?.isSideBarOpen ? 'w-3/4' :'w-full'}`}>
            <div className={`grid grid-cols-1 ${state?.isSideBarOpen? 'md:grid-cols-3': 'md:grid-cols-4'} gap-6 p-0`}>
                {venues.map((venue) => (
                    <VenueItem
                        key={venue.id}
                        venue={venue}
                        onClick={() => console.log("todo")}
                    />
                ))}
            </div>
        </div>
    );
};

export default VenueList;