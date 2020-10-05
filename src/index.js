const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();

function getCity() {
  const city = prompt('Cidade: ');
  const url = `https://www.google.com/search?sxsrf=ALeKk01zVQl7c8mWrqB0cRAluB1bSnpMTg%3A1601854765432&source=hp&ei=LV16X8-iGIGw5wLCv5XQAw&q=${city}+temp&oq=${city}+temp&gs_lcp=CgZwc3ktYWIQAzIECCMQJzIECCMQJzICCAAyAggAMgIIADICCCYyAggmMgIIJjICCCYyBggAEBYQHjoHCCMQ6gIQJzoICC4QsQMQgwE6CAgAELEDEIMBOgUIABCxAzoFCC4QsQM6AgguUM8SWJMaYN0aaABwAHgAgAHVAogBwhCSAQcwLjkuMS4xmAEAoAEBqgEHZ3dzLXdperABCg&sclient=psy-ab&ved=0ahUKEwiP7ZeCjpzsAhUB2FkKHcJfBToQ4dUDCAc&uact=5`;

  return url;
}

async function browserConfig() {
  const url = getCity();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  return page;
}

async function getTemp(page) {
  const data = await page.evaluate(() => {
    const temp = document.querySelector('#wob_tm').innerText;
    const minTemp = document.querySelector(
      '#wob_dp > div.wob_df.wob_ds > div.wNE31c > div.QrNVmd.ZXCv8e > span:nth-child(1)',
    ).innerText;
    const maxTemp = document.querySelector(
      '#wob_dp > div.wob_df.wob_ds > div.wNE31c > div.vk_gy.gNCp2e > span:nth-child(1)',
    ).innerText;

    return {
      temp,
      minTemp,
      maxTemp,
    };
  });

  console.log(`Temperatura atual: ${data.temp}ºC`);
  console.log(`Min: ${data.minTemp}ºC Max: ${data.maxTemp}ºC`);
}

async function run() {
  let page = await browserConfig();
  await getTemp(page);
  page.close();
  process.exit();
}

run();
