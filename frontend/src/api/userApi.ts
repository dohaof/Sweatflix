import type {RegisterForm} from "../types.ts";

export async function userRegister(e:RegisterForm){

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(e),
            // headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`注册失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data; // “注册成功”
        } else {
            throw new Error(result.message || ("注册失败"+response.status));
        }
    } catch (error) {
        console.error("注册错误:", error);
        throw error;
    }

}