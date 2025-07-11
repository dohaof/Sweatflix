export const uploadImageToServer = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/images", {
            method: "POST",
            body: formData,
            // 如果需要认证，添加 headers
            // headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`上传失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.code == 200) {
            return result.data; // 返回图片URL
        } else {
            throw new Error(result.message || ("上传失败"+response.status));
        }
    } catch (error) {
        console.error("图片上传错误:", error);
        throw error;
    }
};
