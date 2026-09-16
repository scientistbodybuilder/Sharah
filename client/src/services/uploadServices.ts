import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL
// console.log(API_URL)

export const hashFile = (file: File, reUpload: boolean) => {
    const dateTime = new Date().toLocaleString()
    const string_key = reUpload ? `${file.name}-${file.size}-${file.lastModified}-${dateTime}` : `${file.name}-${file.size}-${file.lastModified}`;

    let hash = 0x811c9dc5;
    for (let i = 0; i < string_key.length; i++) {
        hash ^= string_key.charCodeAt(i);
        // 32-bit integer multiplication
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    // Return unsigned 32-bit hex string, padded to 8 characters
    return (hash >>> 0).toString(16).padStart(8, '0');
}

export const uploadFile = async (file: File, reUpload: boolean) => {
    const formData = new FormData();
    formData.append("file", file);

    const dateTime = new Date().toLocaleString()
    const response = await axios.post(`${API_URL}/api/pipeline`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    // console.log('file upload response:', response);
    if (response.status >= 200 && response.status < 300) {
        console.log("File analyzed successfully", response.data)
        let obj = {} as Record<string, any[]>
        const rulingData = response.data.data
        Object.keys(rulingData).forEach((ruling) => {
            obj[ruling] = rulingData[ruling].map((item: any) => ({
                chunk: item?.metadata.chunk,
                chunkPage: item?.metadata.chunk_page,
                ruling: item?.metadata.ruling,
                confidence: item?.confidence,
                suggestion: item?.suggestion,
                summary: item?.summary,
                reasoning: item?.reasoning,
                citation: item?.citation
            }))
        })
        //upload file key to session storage
        // const key = `${file.name}-${dateTime}`
        const hash = hashFile(file, reUpload)
        const keyObj = {
            hash,
            filename: file.name,
            timestamp: dateTime
        }
        //current keys
        const currentKeys = sessionStorage.getItem('recentUploads')
        const updatedKeys = currentKeys ? [...JSON.parse(currentKeys), keyObj] : [keyObj]
        sessionStorage.setItem('recentUploads', JSON.stringify(updatedKeys))
        return { data: obj, hash }
    } else {
        throw new Error(response.data?.error || "Error analyzing file")
    }
}