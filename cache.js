const { Redis } = require('@upstash/redis');
const fetch = require('node-fetch');  // Stellen Sie sicher, dass node-fetch installiert ist

// Initialize the Redis client with your Upstash Redis instance details
const redis = new Redis({
    url: 'https://immortal-raven-55499.upstash.io',
    token: 'AdjLAAIncDE0NTQzYzYyMDM1YWQ0ZTBjOWZkNGQyMWI5MGIzZTkwZHAxNTU0OTk',
});

// Function to set and get data from Redis
async function cacheData() {
    try {
        // Set data in Redis with an expiry time of 1 hour
        await redis.set('foo', 'bar', { ex: 3600 });

        // Get data from Redis
        const data = await redis.get('foo');
        console.log(data);  // Outputs: 'bar'
    } catch (error) {
        console.error('Fehler bei der Interaktion mit Redis:', error);
    }
}

// Function to cache API responses
async function cacheApiResponse(url) {
    try {
        const cachedResponse = await redis.get(url);
        if (cachedResponse) {
            return JSON.parse(cachedResponse);
        }

        const response = await fetch(url);
        const data = await response.json();
        await redis.set(url, JSON.stringify(data), { ex: 3600 });  // Cache for 1 hour
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

// Example usage of cacheApiResponse
async function exampleUsage() {
    const apiUrl = 'https://api.example.com/data';  // Ersetzen Sie dies durch die tatsächliche API-URL
    const data = await cacheApiResponse(apiUrl);
    console.log(data);
}

// Call the functions to test them
cacheData();
exampleUsage();
