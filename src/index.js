#!/usr/bin/env node
const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const { log } = console;

function getCity() {
  console.log(
    chalk.greenBright(
      "Se o nome da cidade tem acento escreva entre aspas 'ipirá' ",
    ),
  );
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
  try {
    const data = await page.evaluate(() => {
      const cityName = document.querySelector('#wob_loc').innerText;
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
        cityName,
      };
    });

    const cityName = `${chalk.greenBright(`${data.cityName}`)}`;
    const currentTemp = `${chalk.yellow(`Temp: ${data.temp}ºC`)}`;
    const minTemp = `${chalk.blue(`Min: ${data.minTemp}ºC`)}`;
    const maxTemp = `${chalk.red(`Max: ${data.maxTemp}ºC`)}`;

    log(cityName);
    log(currentTemp);
    log(minTemp);
    log(maxTemp);
  } catch (error) {
    console.log(error);
  }
}

async function run() {
  let page = await browserConfig();
  console.clear();
  await getTemp(page);
  page.close();
  process.exit();
}

run();
