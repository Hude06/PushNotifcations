// server.mjs
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors middleware
import fs from 'fs/promises';
import path from 'path';
import { run } from './WebScrapping.js';
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const app = express();
const port = 3500;
app.use(cors({ origin: [ "*","http://127.0.0.1:5500"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
async function loadJson() {
    try {
        // Read the file with options specifying utf8 encoding
        const data = await fs.readFile('Address.json', { encoding: 'utf8' });

        // Parse the JSON data
            return JSON.parse(data);
    } catch (error) {
        console.error('Error reading/parsing JSON file:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

app.get('/New', async (req, res) => {
    try {
        function normalizeString(str) {
            if (typeof str === 'string') {
                return str.replace(/\s/g, '').toLowerCase(); // Convert to lowercase
            } else {
                return '';
            }
        }

        const newAddress = await run();
        const jsonData = await loadJson();
        const NotListed = [];
        console.log(newAddress)
        for (let i = 0; i < newAddress.length; i++) {
            const NEWNormalizedAddress = normalizeString(newAddress[i].address);
            let foundMatch = false;
            for (let h = 0; h < jsonData.notListed.length; h++) {
                const normalizedAddress = normalizeString(jsonData.notListed[h]);
                if (NEWNormalizedAddress === normalizedAddress) {
                    foundMatch = true;
                } else {
                    console.log("Found No Match")
                }
            }
            if (!foundMatch) {
                NotListed.push(NEWNormalizedAddress);
            }
        }
        res.send((NotListed));
        const updatedData = {
            notListed: NotListed
        };
        fs.writeFile('./AddressToPost.json', JSON.stringify(updatedData), err => {
            if (err) {
                console.error(err);
            } else {
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
