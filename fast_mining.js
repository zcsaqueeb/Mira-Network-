const axios = require('axios');
const fs = require('fs');

const headers = {
    'user-agent': 'Dart/3.6 (dart:io)',
    'accept-encoding': 'gzip',
    'host': 'api.airdroptoken.com',
    'accept': '*/*',
    'content-type': 'application/json'
};

const firebaseHeaders = {
    'Content-Type': 'application/json',
    'X-Android-Package': 'com.lumira_mobile',
    'X-Android-Cert': '1A1F179100AAF62649EAD01C6870FDE2510B1BC2',
    'Accept-Language': 'en-US',
    'X-Client-Version': 'Android/Fallback/X22003001/FirebaseCore-Android',
    'X-Firebase-GMPID': '1:599727959790:android:5c819be0c7e7e3057a4dff',
    'X-Firebase-Client': 'H4sIAAAAAAAAAKtWykhNLCpJSk0sKVayio7VUSpLLSrOzM9TslIyUqoFAFyivEQfAAAA',
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; ASUS_Z01QD Build/N2G48H)',
    'Host': 'www.googleapis.com',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip'
};

async function login(email, password) {
    try {
        const payload = {
            email: email,
            password: password,
            returnSecureToken: true,
            clientType: 'CLIENT_TYPE_ANDROID'
        };

        const response = await axios.post(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyB0YXNLWl-mPWQNX-tvd7rp-HVNr_GhAmk',
            payload,
            { headers: firebaseHeaders }
        );

        return response.data.idToken;
    } catch (error) {
        console.error('Login failed:', error.response?.data?.error?.message || error.message);
        return null;
    }
}

async function startMining(token) {
    try {
        await axios.put(
            'https://api.airdroptoken.com/miners/miner',
            {},
            {
                headers: {
                    ...headers,
                    'authorization': `Bearer ${token}`,
                    'content-length': 0
                }
            }
        );

        await axios.put(
            'https://api.airdroptoken.com/user/ads',
            'ads_enabled=false',
            {
                headers: {
                    ...headers,
                    'authorization': `Bearer ${token}`,
                    'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'content-length': '17'
                }
            });

        console.log('Mining started successfully.');
        return true;
    } catch (error) {
        console.error('Error starting mining:', error.message);
        return false;
    }
}

async function monitorUserAndMiningInfo(token, email) {
    let running = true;

    process.on('SIGINT', () => {
        console.log(`\nStopping monitoring for ${email}...`);
        running = false;
    });

    while (running) {
        try {
            const userResponse = await axios.get(
                'https://api.airdroptoken.com/user/user/',
                {
                    headers: {
                        ...headers,
                        'authorization': `Bearer ${token}`
                    }
                }
            );

            const miningResponse = await axios.get(
                'https://api.airdroptoken.com/miners/miner/',
                {
                    headers: {
                        ...headers,
                        'authorization': `Bearer ${token}`
                    }
                }
            );

            const userData = userResponse.data;
            const userDetails = userData.details || {};
            const miningData = miningResponse.data.object || {};

            console.clear();
            console.log(`Information for ${email}:`);
            console.log(`Full Name: ${userData.full_name || 'N/A'}`);
            console.log(`Email: ${userData.email || 'N/A'}`);
            console.log(`Country: ${userData.country || 'N/A'}`);
            console.log(`Miner Active: ${userDetails.miner_active ?? 'N/A'}`);
            console.log(`ADT Balance: ${userDetails.adt_balance ?? 'N/A'}`);
            console.log(`Max Miners: ${userDetails.max_miners ?? 'N/A'}`);
            console.log(`Mining Active: ${miningData.active ?? 'N/A'}`);
            console.log(`ADT Earned: ${miningData.adt_earned ?? 'N/A'}`);
            console.log(`Mining Time Left: ${miningData.mining_time_left ?? 'N/A'} seconds`);
            console.log(`ADT Per Hour: ${miningData.adt_per_hour ?? 'N/A'}`);
            console.log('\nPress Ctrl+C to stop monitoring...');

            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error(`Error monitoring for ${email}:`, error.message);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

function loadAccountsFromFile() {
    if (!fs.existsSync('accounts.txt')) {
        console.error('accounts.txt file not found!');
        process.exit(1);
    }
    const data = fs.readFileSync('accounts.txt', 'utf8');
    return data.split('\n').map(line => JSON.parse(line)).filter(account => account.email && account.password);
}

async function main() {
    const accounts = loadAccountsFromFile();
    console.log(`Loaded ${accounts.length} accounts from accounts.txt`);

    for (const account of accounts) {
        const token = await login(account.email, account.password);
        if (token) {
            const miningStarted = await startMining(token);
            console.log(`Mining ${miningStarted ? 'started successfully' : 'failed to start'} for ${account.email}`);
            if (miningStarted) {
                // Start monitoring mining status for this account
                monitorUserAndMiningInfo(token, account.email);
            }
        } else {
            console.log(`Failed to login for ${account.email}`);
        }
    }
}

main().catch(console.error);
