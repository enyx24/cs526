import serverConfig from '../config/config';

const normalizeValue = (value) => {
    if (Array.isArray(value)) {
        return value.find((item) => item !== null && item !== undefined && String(item).trim() !== '') ?? '';
    }

    if (value === null || value === undefined) {
        return '';
    }

    return String(value);
};

const stripCodeFence = (text) => {
    const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fencedMatch) {
        return fencedMatch[1].trim();
    }

    return text.trim();
};

const tryParseJsonLikeValue = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === 'object') {
        return value;
    }

    if (typeof value !== 'string') {
        return null;
    }

    let current = value.trim();
    if (!current) {
        return null;
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
        const fenced = stripCodeFence(current);
        if (fenced !== current) {
            current = fenced;
        }

        try {
            const parsed = JSON.parse(current);
            if (typeof parsed === 'string') {
                current = parsed.trim();
                continue;
            }

            return parsed;
        } catch (error) {
            const objectStart = current.indexOf('{');
            const objectEnd = current.lastIndexOf('}');
            if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
                current = current.slice(objectStart, objectEnd + 1);
                continue;
            }

            const arrayStart = current.indexOf('[');
            const arrayEnd = current.lastIndexOf(']');
            if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
                current = current.slice(arrayStart, arrayEnd + 1);
                continue;
            }

            return null;
        }
    }

    return null;
};

const normalizeSlmResponse = (rawResponse) => {
    const candidate = tryParseJsonLikeValue(rawResponse);
    if (!candidate) {
        return null;
    }

    const content = candidate?.choices?.[0]?.message?.content ?? candidate;
    const parsedContent = tryParseJsonLikeValue(content);
    const data = parsedContent ?? content;

    if (!data || typeof data !== 'object') {
        return null;
    }

    return {
        date: normalizeValue(data.date),
        time: normalizeValue(data.time),
        amount: normalizeValue(data.amount),
        category: normalizeValue(data.category),
        source: normalizeValue(data.source),
        confidence: data.confidence !== undefined && data.confidence !== null
            ? Number(data.confidence)
            : null,
    };
};

const buildFallbackResponse = ({ ocrResultRegex }) => ({
    date: normalizeValue(ocrResultRegex?.date),
    time: normalizeValue(ocrResultRegex?.time),
    amount: normalizeValue(ocrResultRegex?.money),
    category: '',
    source: normalizeValue(ocrResultRegex?.source),
    confidence: 0,
});

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
        // Convert all fields to strings
        const stringifiedOcrResult = typeof ocrResult === 'string' ? ocrResult : JSON.stringify(ocrResult);
        const stringifiedOcrResultRegex = typeof ocrResultRegex === 'string' ? ocrResultRegex : JSON.stringify(ocrResultRegex);
        const stringifiedCategories = typeof categories === 'string' ? categories : JSON.stringify(categories);
        const stringifiedSources = typeof sources === 'string' ? sources : JSON.stringify(sources);

        const response = await fetch(`${serverConfig.API_URL}/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serverConfig.API_KEY}`,
            },
            body: JSON.stringify({
                ocr_result: stringifiedOcrResult,
                ocr_result_regex: stringifiedOcrResultRegex,
                categories: stringifiedCategories,
                sources: stringifiedSources,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch SLM extracted info');
        }

        const rawResponse = await response.json();
        const parsedResponse = normalizeSlmResponse(rawResponse);

        if (!parsedResponse) {
            // Parse ocrResultRegex if it's a string
            const parsedOcrResultRegex = typeof ocrResultRegex === 'string' ? tryParseJsonLikeValue(ocrResultRegex) : ocrResultRegex;
            return buildFallbackResponse({ ocrResultRegex: parsedOcrResultRegex });
        }

        return parsedResponse;
    } catch (error) {
        console.error('Error in slmExtractedInfo:', error);
        // Parse ocrResultRegex if it's a string
        const parsedOcrResultRegex = typeof ocrResultRegex === 'string' ? tryParseJsonLikeValue(ocrResultRegex) : ocrResultRegex;
        return buildFallbackResponse({ ocrResultRegex: parsedOcrResultRegex });
    }
}