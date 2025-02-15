import { SourceDAO } from "@/infra/dao/source.dao.js";
import { CronJob } from "cron";
import puppeteer from "puppeteer";
import { LiveloSource } from "./sources/livelo.js";
import { env } from "@/infra/env.js";

const sourceDAO = new SourceDAO();

export const startScraping = async () => {
	console.log("Scraping job runnning", new Date().toISOString());

	const sources = await sourceDAO.findAll();

	const browser = await puppeteer.launch({
		headless: true,
		executablePath: env.ENVIRONMENT !== 'development' ? '/usr/bin/google-chrome' : undefined,
		args: ['--no-sandbox']
	});
	const page = await browser.newPage();
	await page.setUserAgent(
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
	);

	for (const source of sources) {
		switch (source.name) {
			case "Livelo": {
				const liveloSource = new LiveloSource(sourceDAO, source.id);
				await liveloSource.run(page);
				break;
			}
			default:
				console.log("Source not implemented");
				break;
		}
	}
	console.log("Scraping job finished", new Date().toISOString());

	await browser.close();
};

// If development run every minute otherwise run every hour
const cronExpression =
	env.ENVIRONMENT === "development" ? "0 * * * * *" : "0 0 * * * *";

export const scrapingJob = new CronJob(
	cronExpression,
	startScraping,
	null,
	false,
	"America/Sao_Paulo",
);
