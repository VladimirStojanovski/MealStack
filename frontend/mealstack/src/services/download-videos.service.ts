import axios from 'axios';
import authHeader from './auth-headers';

const API_URL = `/api/auth/`;


interface ProgressUpdate {
    current: number;
    total: number;
    message: string;
}

export const downloadVideos = (
    urls: string[],
    text: string | null,
    onProgress: (update: ProgressUpdate) => void,
    onComplete: (error: Error | null) => void,
    token: string | null
) => {
    const cleanedUrls = urls.map(url => url.trim());

    let queryParams = cleanedUrls.map(url => `urls=${encodeURIComponent(url)}`).join('&');

    if (text && text.trim() !== '') {
        queryParams += `&text=${encodeURIComponent(text.trim())}`;
    }

    // ✅ Append token as a query param
    if (token) {
        queryParams += `&token=${encodeURIComponent(token)}`;
    }

    const eventSource = new EventSource(`${API_URL}downloadUrls?${queryParams}`);

    eventSource.addEventListener('progress', (event) => {
        try {
            const progress = JSON.parse(event.data);
            onProgress(progress);
        } catch (error) {
            console.error('Error parsing progress:', error);
        }
    });

    eventSource.addEventListener('complete', () => {
        eventSource.close();
        onComplete(null);
    });

    eventSource.onerror = () => {
        eventSource.close();
        onComplete(new Error('Connection failed'));
    };

    return () => eventSource.close();
};



// export const trackDownloads = async (urlCount: number) => {
//     await axios.post(
//         `${API_URL}count-downloads`,
//         { count: urlCount },
//         { headers: authHeader() }
//     );
// };

export const trackDownloads = async (urlCount: number): Promise<string | null> => {
    try {
        const response = await axios.post(
            `${API_URL}count-downloads`,
            { count: urlCount },
            { headers: authHeader() }
        );
        const userUUID = response.data.userUUID;
        return userUUID;
    } catch (error) {
        console.error('Failed to track downloads:', error);
        return null;
    }
};
