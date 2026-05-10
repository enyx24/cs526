const serverConfig = {
    API_URL: 'http://localhost:8000',
    API_KEY: 'your_api_key_here',
    API_TIMEOUT: 30000,
    API_RETRY_ATTEMPTS: 3,
    API_RETRY_DELAY: 1000,
    LOG_LEVEL: 'debug',
    NODE_ENV: 'development',
    ENABLE_HEALTH_CHECK: true,
    HEALTH_CHECK_INTERVAL: 30000,
    OFFLINE_MODE: false,
};

export default serverConfig;