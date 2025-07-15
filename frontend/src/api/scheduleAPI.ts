import type {BookResponse, VenueSchedule, VenueScheduleCreation} from "../types.ts";

export async function createSchedule(e:VenueScheduleCreation,token:string):Promise<string> {
    try {
        const response = await fetch("/api/venue_schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(e),
        });

        if (!response.ok) {
            throw new Error(`创建场馆时间段api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.msg || ("创建场馆时间段api失败"+response.status));
        }
    } catch (error) {
        console.error("创建场馆时间段api错误:", error);
        throw error;
    }
}export async function deleteSchedule(scheduleId:number,token:string):Promise<string> {
    try {
        const response = await fetch("/api/venue_schedule/"+scheduleId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`删除场馆时间段api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.msg || ("删除场馆时间段api失败"+response.status));
        }
    } catch (error) {
        console.error("删除场馆时间段api错误:", error);
        throw error;
    }
}
export async function getSchedulesOfVenue(venueId:number,token:string):Promise<VenueSchedule[]> {
    try {
        const response = await fetch("/api/venue_schedule/"+venueId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`获取场馆时间段api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.msg || ("获取场馆时间段api失败"+response.status));
        }
    } catch (error) {
        console.error("获取场馆时间段api错误:", error);
        throw error;
    }
}export async function bookSchedule(scheduleId:number,token:string):Promise<BookResponse> {
    try {
        const response = await fetch("/api/venue_schedule/"+scheduleId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`预定时间段api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.msg || ("预定场馆时间段api失败"+response.status));
        }
    } catch (error) {
        console.error("预定场馆时间段api错误:", error);
        throw error;
    }
}export async function notifyPay(schedule_order_id:number,success:boolean,token:string):Promise<VenueSchedule[]> {
    try {
        const response = await fetch("/api/venue_schedule/notify/"+schedule_order_id+'/'+success, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`notify api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.msg || ("notify api失败"+response.status));
        }
    } catch (error) {
        console.error("notify api错误:", error);
        throw error;
    }
}