/* eslint-disable no-console */
import { readFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'

import {
	isValid as isValidDate,
	parse as parseDate,
	isAfter,
	isBefore,
	startOfMonth,
	endOfMonth,
} from 'date-fns'
import { z } from 'zod'

const args = parseArgs({
	options: {
		data: { type: 'string' },
		month: { type: 'string' },
		strict: { type: 'boolean' },
	},
	allowPositionals: false,
})

if (args.values.data === undefined || args.values.month === undefined) {
	throw new Error(`Expected an --data and --month options`)
}

const json = JSON.parse(await readFile(args.values.data, 'utf8'))

const data = z
	.array(
		z.object({
			city: z.string(),
			country: z.string(),
			value: z.object({
				intervals: z.array(z.tuple([z.string(), z.string()])),
			}),
		}),
	)
	.parse(json)

const from = startOfMonth(parseDate(args.values.month, 'MM', new Date()))
const to = endOfMonth(parseDate(args.values.month, 'MM', new Date()))

if (!isValidDate(from) || !isValidDate(to)) {
	throw new Error(`Invalid date input`)
}

const cities = data.filter(item => {
	for (const interval of item.value.intervals) {
		let intervalFrom = parseDate(interval[0], 'dd.MM', new Date())
		let intervalTo = parseDate(interval[1], 'dd.MM', new Date())
		if (isAfter(intervalFrom, intervalTo)) {
			intervalTo.setFullYear(from.getFullYear() + 1)
		}
		intervalFrom.setFullYear(from.getFullYear())
		if (args.values.strict !== true) {
			if (intervalFrom.getDate() === 15) {
				intervalFrom = startOfMonth(intervalFrom)
			}
			if (intervalTo.getDate() === 15) {
				intervalTo = endOfMonth(intervalTo)
			}
		}
		if (!isBefore(from, intervalFrom) && !isAfter(to, intervalTo)) {
			return true
		}
	}
	return false
})

console.log(JSON.stringify(cities, null, 2))
