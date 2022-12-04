import * as cheerio from 'cheerio'
import { fetch } from 'undici'
import { z } from 'zod'

import { getIntervals } from './get-intervals.js'

const QueryResultSchema = z.object({
	url: z.string(),
	countryCode: z.string(),
	flagUrl: z.string().url(),
	nameTr: z.string(),
	restTr: z.string(),
})

async function getBestTime(url: string): Promise<string> {
	const page = await fetch(`https://weatherspark.com${url}`)
	const html = await page.text()
	const $ = cheerio.load(html)
	for (const p of $('p')) {
		const text = $(p).text()
		if (/Based on this score, the best time(s)? of year to visit/.test(text)) {
			return text
		}
	}
	throw new Error(`Best time not found for: ${url}`)
}

export async function getDataByCity({
	city,
	country,
}: {
	city: string
	country: string
}): Promise<{ intervals: [from: string, to: string][]; name: string; country: string }> {
	const response = await fetch(
		`https://weatherspark.com/search?${new URLSearchParams({
			q: city,
			ic: 'false',
			y: '0',
			m: '0',
			d: '0',
		}).toString()}`,
		{ headers: { 'X-Requested-With': 'XMLHttpRequest' } },
	)
	if (!response.ok) {
		throw new Error(`Bad response from ${response.url}: ${response.status}`)
	}
	const json = await response.json()
	const data = z
		.object({
			results: z.array(QueryResultSchema),
		})
		.parse(json)

	const result = data.results.find(result => result.restTr === country) ?? data.results[0]
	if (!result) {
		throw new Error('No results found')
	}
	const bestTime = await getBestTime(result.url)
	const intervals = getIntervals(bestTime)
	return { intervals, name: result.nameTr, country: result.restTr }
}
