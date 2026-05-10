import serverConfig from '../config/config';

export const logConfig = () => {
    console.log('API_URL:', serverConfig.API_URL);
    console.log('API_KEY:', serverConfig.API_KEY);
}

export const slmHealthCheck = async () => {
    try {
        const response = await fetch(`${serverConfig.API_URL}/health`, {
            method: 'GET',
            headers: {
                // 'Authorization': `Bearer ${serverConfig.API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error('SLM API health check failed');
        }

        const data = await response.json();
        return data.status === 'ok';
    } catch (error) {
        console.error('Error in slmHealthCheck:', error);
        return false;
    }
}

export const slmExtractedInfo = async ({ ocrResult, ocrResultRegex, categories, sources }) => {
    try {
        const response = await fetch(`${serverConfig.API_URL}/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ocr_result: ocrResult,
                ocr_result_regex: ocrResultRegex,
                categories,
                sources,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch SLM extracted info');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in slmExtractedInfo:', error);
        return null;
    }
}