import VenueItem from './VenueItem';
import type { Venue } from '../types';

const VenueList = () => {
    const venues: Venue[] = [
        { id: 1, name: "篮球场" } as Venue,
        // 添加更多场地数据...
    ];

    return (
        <div className="flex-1 p-4 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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