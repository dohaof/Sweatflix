import type {CommentDTO, Comment} from "../types.ts";

export async function getCommentsByVenueId(venueId:number,token:string):Promise<Comment[]>
{
    try{
    const response = await fetch("/api/comments/"+venueId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`获取场馆评论api失败: ${response.status}`);
    }

    const result = await response.json();
    if (result.code == 200) {
        return result.data;
    } else {
        throw new Error(result.msg || ("获取场馆评论api失败"+response.status));
    }
}
catch (error) {
    console.error("获取场馆评论api错误:", error);
    throw error;
    }
}
export async function addComment(e:CommentDTO,token:string):Promise<Comment[]>
{
    try{
        const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify(e)
        });

        if (!response.ok) {
            throw new Error(`创建场馆评论api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.msg || ("创建场馆评论api失败"+response.status));
        }
    }
    catch (error) {
        console.error("创建场馆评论api错误:", error);
        throw error;
    }
}
export async function thumbUpComment(commentId:number,token:string):Promise<Comment[]>
{
    try{
        const response = await fetch("/api/comments/thumbs/"+commentId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`点赞评论api失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data;
        } else {
            throw new Error(result.msg || ("点赞场馆评论api失败"+response.status));
        }
    }
    catch (error) {
        console.error("点赞场馆评论api错误:", error);
        throw error;
    }
}