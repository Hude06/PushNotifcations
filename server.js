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
class Apartment {
    constructor(Address,Price,Type,Percentage,ZillowLink) {
        this.address = Address
        this.price = Price
        this.type = Type
        this.percentage = Percentage
        this.zillowLink = ZillowLink

    }
}
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
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
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
        let percentage = 0
        let price = 0
        let type = "1 bed"
        let zillowLink = null
        console.log(newAddress)
        for (let i = 0; i < newAddress.length; i++) {
            const NEWNormalizedAddress = normalizeString(newAddress[i].address);
            let foundMatch = false;
            for (let h = 0; h < jsonData.notListed.length; h++) {
                const normalizedAddress = normalizeString(jsonData.notListed[h]);
                price = newAddress[i].rent
                zillowLink = newAddress[i].zillowLink
                type = newAddress[i].type
                percentage = Math.floor(Math.round(similarity(NEWNormalizedAddress,normalizedAddress)*100))

                if (similarity(NEWNormalizedAddress,normalizedAddress) >= 0.95) {
                    foundMatch = true;
                } else {
                    console.log("Less than 95 " +  percentage +" " +NEWNormalizedAddress+"  "+normalizedAddress)
                }
            }
            if (!foundMatch) {
                if (zillowLink !== "") {
                    NotListed.push(new Apartment(NEWNormalizedAddress,price,type,percentage,zillowLink));
                }
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
