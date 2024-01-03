// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors middleware
import fs from 'fs';
import path from 'path';
import { run } from './WebScrapping.js';
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const app = express();
const port = 3500;
app.use(cors({ origin: [ "*","http://127.0.0.1:5500"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/New', (req, res) => {
    run()
    .then(data => {
        // Handle the result (data) here
        console.log(data);
        fs.readFile("Address.json", 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
        
            // Parse the JSON data
            try {
                const jsonData = JSON.parse(data);
                console.log('JSON data:', jsonData);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
            }
        });
        res.send(data)
    })
    .catch(error => {
        // Handle errors here
        console.error('Error:', error);
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
