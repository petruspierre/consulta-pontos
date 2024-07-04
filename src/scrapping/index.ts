import puppeteer from "puppeteer";
import { LiveloSource } from "./sources/livelo.js";
import { CronJob } from "cron";
import { db } from "@/infra/db/connection.js";

const startScrapping = async () => {
  console.log('Scrapping job runnning', new Date().toISOString());

  const sources = await db('source').select('*');

  console.log('Sources', sources)

  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");

  const liveloSource = new LiveloSource()
  await liveloSource.run(page);

  await browser.close();
}

export const scrappingJob = new CronJob(
	'* * * * *',
	startScrapping,
	null,
	false,
	'America/Sao_Paulo'
);
