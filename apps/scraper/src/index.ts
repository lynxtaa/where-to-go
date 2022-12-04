/* eslint-disable no-console */
import { readFile, writeFile } from 'node:fs/promises'
import timerP from 'node:timers/promises'
import { parseArgs } from 'node:util'

import { z } from 'zod'

import { getDataByCity } from './get-data-by-city.js'

const args = parseArgs({
	options: {
		input: {
			short: 'i',
			type: 'string',
		},
		output: {
			short: 'o',
			type: 'string',
		},
	},
	allowPositionals: false,
})

if (args.values.input === undefined || args.values.output === undefined) {
	throw new Error(`Expected an --input and --output options`)
}

const json = JSON.parse(await readFile(args.values.input, 'utf8'))
const cities = z.array(z.object({ city: z.string(), country: z.string() })).parse(json)

const results: (
	| { ok: true; city: string; country: string; value: unknown }
	| { ok: false; city: string; country: string; error: unknown }
)[] = []

for (const [i, { city, country }] of cities.entries()) {
	if ((i + 1) % 10 === 0) {
		console.log(`${i + 1}/${cities.length} processed`)
	}
	console.log(city, country)
	try {
		const result = await getDataByCity({ city, country })
		results.push({
			ok: true,
			city,
			country,
			value: result,
		})
	} catch (error) {
		console.warn(error)
		results.push({ ok: false, error, city, country })
	} finally {
		await timerP.setTimeout(1_000)
	}
}

await writeFile(args.values.output, JSON.stringify(results, null, '\t'), 'utf8')
