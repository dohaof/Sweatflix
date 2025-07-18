import type {Credentials, ModifyForm, RegisterForm} from "../types.ts";

export async function userRegister(e:RegisterForm){

    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(e),
            // headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`注册api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data; // “注册成功”
        } else {
            throw new Error(result.msg || ("注册api失败"+response.status));
        }
    } catch (error) {
        console.error("注册api错误:", error);
        throw error;
    }

}
export async function userLogin(e:Credentials){

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(e),
            // headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`登录api失败(not ok): ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data; // “token&user”
        } else {
            throw new Error(result.msg || `登录api失败: ${response.status}`);
        }
    } catch (error) {
        console.error("登录api错误:", error);
        throw error;
    }

}

export async function userModify(e:ModifyForm,token:string){

    try {
        const response = await fetch("/api/users", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(e),
        });

        if (!response.ok) {
            throw new Error(`修改用户api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data; // “修改成功”
        } else {
            throw new Error(result.msg || ("修改用户api失败:"+result.status));
        }
    } catch (error) {
        console.error("修改用户api错误:", error);
        throw error;
    }

}
export async function getOrderByUserId(userId:number,token:string){
    try {
        const response = await fetch("/api/venue_schedule/orders/"+userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`获取用户订单api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data; // “修改成功”
        } else {
            throw new Error(result.msg || ("获取用户订单api失败:"+result.status));
        }
    } catch (error) {
        console.error("获取用户订单api错误:", error);
        throw error;
    }
}export async function getNotice(token:string){
    try {
        const response = await fetch("/api/users/notice", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`获取用户通知api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data; // “修改成功”
        } else {
            throw new Error(result.msg || ("获取用户通知api失败:"+result.status));
        }
    } catch (error) {
        console.error("获取用户通知api错误:", error);
        throw error;
    }
}