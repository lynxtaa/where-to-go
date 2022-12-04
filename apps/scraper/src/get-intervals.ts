import {
	parse as parseDate,
	isValid as isValidDate,
	format as formatDate,
	addMonths,
} from 'date-fns'

function parseMonth(str: string) {
	const [stage, month] = str.split(' ')

	const dateMonth = parseDate(month ?? '', 'MMMM', new Date())

	if (!isValidDate(dateMonth)) {
		throw new Error(`Unknown interval: ${str}`)
	}

	switch (stage) {
		case 'early':
			return `01.${formatDate(dateMonth, 'MM')}`
		case 'mid':
			return `15.${formatDate(dateMonth, 'MM')}`
		case 'late':
			return `01.${formatDate(addMonths(dateMonth, 1), 'MM')}`
		default:
			throw new Error(`Unknown interval: ${str}`)
	}
}

export function getIntervals(text: string): [from: string, to: string][] {
	const intervals: [from: string, to: string][] = []
	{
		const matches = text.matchAll(/from (?<from>\w+ \w+) to (?<to>\w+ \w+)/g)
		for (const { groups } of matches) {
			if (groups && typeof groups.from === 'string' && typeof groups.to === 'string') {
				intervals.push([parseMonth(groups.from), parseMonth(groups.to)])
			}
		}
	}
	{
		const matches = text.matchAll(/entire month of (?<month>\w+)/g)
		for (const { groups } of matches) {
			if (groups && typeof groups.month === 'string') {
				intervals.push([
					parseMonth(`early ${groups.month}`),
					parseMonth(`late ${groups.month}`),
				])
			}
		}
	}
	return intervals
}
