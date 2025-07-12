import type {VenueCreation} from "../types.ts";

export async function createVenue(e:VenueCreation,token:string):Promise<void> {
    try {
        const response = await fetch("/api/", {
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
            return result.data; // “注册成功”
        } else {
            throw new Error(result.message || ("创建场馆api失败"+response.status));
        }
    } catch (error) {
        console.error("创建场馆api错误:", error);
        throw error;
    }
}