import puppeteer from "puppeteer";
import { LiveloSource } from "./sources/livelo.js";
import { CronJob } from "cron";
import { db } from "@/infra/db/connection.js";
import { SourceRepository } from "@/infra/repositories/source.repository.js";
import { SourceDAO } from "@/infra/dao/source.dao.js";

const sourceRepository = new SourceRepository();
const sourceDAO = new SourceDAO();

const startScrapping = async () => {
  console.log('Scrapping job runnning', new Date().toISOString());

  const sources = await sourceDAO.findAll();

  console.log('Sources', sources)

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");

  for (const source of sources) {
    switch (source.name) {
      case 'Livelo':
        const liveloSource = new LiveloSource(sourceRepository, source.id)
        await liveloSource.run(page);
        break;
      default:
        console.log('Source not implemented');
        break;
    }
  }

  await browser.close();
}

export const scrappingJob = new CronJob(
	'* * * * *',
	startScrapping,
	null,
	false,
	'America/Sao_Paulo'
);
