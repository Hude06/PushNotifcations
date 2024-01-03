import puppeteer from 'puppeteer';
import fs from 'fs'
export async function run() {
  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the target website
  await page.goto('https://api.sauerproperties.net/availability');

  await page.waitForSelector('#available_units tbody');

  // Extract data from the table
  const units = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#available_units tbody tr'));
      return rows.map(row => {
          const columns = row.querySelectorAll('td');
          return {
              rent: columns[1].textContent.trim(),
              address: columns[2].textContent.trim(),
              type: columns[3].textContent.trim(),
              // Add more properties as needed
          };
      });
  });

  await browser.close();
  return(units);

}