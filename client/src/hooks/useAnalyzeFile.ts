import { useState, useEffect } from 'react'
import { useQueryClient } from "@tanstack/react-query"
import type { ClauseCardProps } from '../components/analyze/ClauseCard'

const test = false
const API_URL = test ? 'http://localhost:8000' : import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const hashFile = (file: File, reUpload: boolean, dateTime?: string) => {
    // const dateTime = dateTime || new Date().toLocaleString()
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

export default function useAnalyzeFile (file: File | null, reUpload: boolean, analyze: boolean, setResults: (data: Record<string, ClauseCardProps[]>) => void) {
    const [done, setDone] = useState<boolean>(false)
    const [data, setData] = useState<Record<string, ClauseCardProps[]> | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const queryClient = useQueryClient();

    useEffect(() => {
        if (file === null || !analyze) return
        const controller = new AbortController();
        const streamAnalysis = async () => {
            setDone(false)
            setError(null)
            setData(null)
            setLoading(true)
            const formData = new FormData();
            formData.append("file", file);

            let accumulated: Record<string, ClauseCardProps[]> = {}; // local, not state

            try {
                // const response = await axios.post(`${API_URL}/api/pipeline-stream`, formData, {
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //         "responseType": "stream"
                //     }
                // });

                const response = await fetch(`${API_URL}/api/pipeline-stream-v2`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.body) throw new Error('No response body');

                const reader = response.body.getReader()

                const decoder = new TextDecoder('utf-8')
                let buffer= ''

                while (true) {
                    const { done: streamDone, value } = await reader.read();
                    if (streamDone) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n')
                    buffer = lines.pop() ?? ''

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        // Process each line of JSON data
                        const parsed = JSON.parse(line)
                        console.log('Streamed data: ', parsed)
                        let obj = {
                            chunk: parsed?.metadata.chunk,
                            chunkPage: parsed?.metadata.chunk_page,
                            ruling: parsed?.metadata.ruling,
                            confidence: parsed?.confidence,
                            suggestion: parsed?.suggestion,
                            summary: parsed?.summary,
                            reasoning: parsed?.reasoning,
                            citation: parsed?.citation
                        }
                        const ruling = parsed?.metadata.ruling

                        accumulated = {
                            ...accumulated,
                            [ruling]: [...(accumulated[ruling] ?? []), obj]
                        };

                        setData(accumulated)
                        setResults(accumulated)

                    }
                }
                
                //done

                const dateTime = new Date().toLocaleString()
                let hash
                if (reUpload) {
                    hash = hashFile(file, reUpload, dateTime)
                } else {
                    hash = hashFile(file, reUpload)
                }
                
                queryClient.setQueryData(['analysis', hash], accumulated)
                const keyObj = {
                    hash,
                    filename: file.name,
                    timestamp: dateTime
                }
                //current keys
                const currentKeys = sessionStorage.getItem('recentUploads')
                const updatedKeys = currentKeys ? [...JSON.parse(currentKeys), keyObj] : [keyObj]
                sessionStorage.setItem('recentUploads', JSON.stringify(updatedKeys))

                //cache the data

                //end
                setDone(true)
                setLoading(false)

                // response.data.on('data', (chunk: Buffer) => {
                //     // Handle streaming data
                //     const data = JSON.parse(chunk.toString('utf-8'))
                //     let obj = {
                //         chunk: data?.metadata.chunk,
                //         chunkPage: data?.metadata.chunk_page,
                //         ruling: data?.metadata.ruling,
                //         confidence: data?.confidence,
                //         suggestion: data?.suggestion,
                //         summary: data?.summary,
                //         reasoning: data?.reasoning,
                //         citation: data?.citation
                //     }
                //     const ruling = data?.metadata.ruling
                //     // check whether the ruling result is already cached for this request
                    

                //     setData({...data, ruling: [...data[ruling] ? data[ruling] : [], obj]})
                //     console.log('updated streamed data: ', data)

                // });

                // response.data.on('end', () => {
                //     const hash = hashFile(file, reUpload)
                //     const keyObj = {
                //         hash,
                //         filename: file.name,
                //         timestamp: dateTime
                //     }
                //     //current keys
                //     const currentKeys = sessionStorage.getItem('recentUploads')
                //     const updatedKeys = currentKeys ? [...JSON.parse(currentKeys), keyObj] : [keyObj]
                //     sessionStorage.setItem('recentUploads', JSON.stringify(updatedKeys))
                //     setDone(true)
                    
                //     setHash(hash)
                // })
            } catch (err) {
                console.error('Error uploading file with stream:', err)
                setError('Error analyzing file')
            } finally {
            }
        }
        streamAnalysis()

        return () => controller.abort()


    },[file, reUpload, analyze])

    return { done, data, error, loading }

}