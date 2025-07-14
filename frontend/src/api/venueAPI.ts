import type {Venue, VenueChange, VenueCreation} from "../types.ts";

export async function createVenue(e:VenueCreation,token:string):Promise<string> {
    try {
        const response = await fetch("/api/venue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(e),
        });

        if (!response.ok) {
            throw new Error(`创建场馆api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.message || ("创建场馆api失败"+response.status));
        }
    } catch (error) {
        console.error("创建场馆api错误:", error);
        throw error;
    }
}
export async function getVenue(token:string):Promise<Venue[]> {
    try {
        const response = await fetch("/api/venue/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`GET场馆api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.message || ("GET场馆api失败"+response.status));
        }
    } catch (error) {
        console.error("GET场馆api错误:", error);
        throw error;
    }
}
export async function getVenueById(venueId: number | undefined, token: string):Promise<Venue> {
    try {
        const response = await fetch(`/api/venue/${venueId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`GET场馆api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.message || ("GET场馆api失败"+response.status));
        }
    } catch (error) {
        console.error("GET场馆api错误:", error);
        throw error;
    }
}
export async function changeVenue(e:VenueChange,token:string):Promise<string> {
    try {
        const response = await fetch("/api/venue", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(e),
        });

        if (!response.ok) {
            throw new Error(`PUT场馆api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.message || ("PUT场馆api失败"+response.status));
        }
    } catch (error) {
        console.error("PUT场馆api错误:", error);
        throw error;
    }
}
export async function deleteVenue(venueId:number,token:string):Promise<string> {
    try {
        const response = await fetch(`/api/venue/${venueId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`DELETE场馆api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.message || ("DELETE场馆api失败"+response.status));
        }
    } catch (error) {
        console.error("DELETE场馆api错误:", error);
        throw error;
    }
}