import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_ACCOUNT_KEY = '../.github/workflows/portfolio-8fba4-firebase-adminsdk-fbsvc-c4e6c25870.json';
const STORAGE_BUCKET = 'portfolio-8fba4.firebasestorage.app';

async function setCors() {
    const keyPath = path.join(__dirname, SERVICE_ACCOUNT_KEY);
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

    const app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: STORAGE_BUCKET
    });

    const bucket = getStorage(app).bucket();
    console.log(`Setting CORS for bucket: ${bucket.name}`);

    const cors = [
        {
            origin: ["*"],
            method: ["GET", "PUT", "POST", "DELETE", "HEAD"],
            responseHeader: ["Content-Type", "x-goog-resumable"],
            maxAgeSeconds: 3600
        }
    ];

    try {
        await bucket.setCorsConfiguration(cors);
        console.log('✅ CORS configuration set successfully.');
    } catch (err) {
        console.error('❌ Failed to set CORS:', err.message);
        // Try without .firebasestorage.app suffix if it failed
        if (STORAGE_BUCKET.endsWith('.firebasestorage.app')) {
            const altBucketName = STORAGE_BUCKET.replace('.firebasestorage.app', '.appspot.com');
            console.log(`Retrying with ${altBucketName}...`);
            try {
                const altBucket = getStorage(app).bucket(altBucketName);
                await altBucket.setCorsConfiguration(cors);
                console.log(`✅ CORS configuration set successfully for ${altBucketName}.`);
            } catch (err2) {
                console.error(`❌ Failed for ${altBucketName} as well:`, err2.message);
            }
        }
    }
}

setCors();
