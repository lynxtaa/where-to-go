import cn from 'classnames'
import {
	parse as parseDate,
	isAfter,
	isBefore,
	isValid as isValidDate,
	startOfYear,
	endOfYear,
} from 'date-fns'
import maxBy from 'lodash/maxBy'
import range from 'lodash/range'
import sortBy from 'lodash/sortBy'

import data from '../../../data/results.json'

const resultsSortedByCountry = sortBy(
	data.map(item => ({
		country: item.country,
		city: item.city,
		intervals: item.value.intervals,
	})),
	item => `${item.country}@${item.city}`,
)

export default function Page() {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	].map(month => (
		<div className="text-center col-span-2 p-2" key={month}>
			{month}
		</div>
	))

	return (
		<div className="my-0 mx-auto p-4 max-w-4xl">
			<h1 className="text-2xl text-center mb-3">Where To Go</h1>
			<div className="grid grid-cols-24 bg-gray-900 gap-y-2">
				{months}
				{resultsSortedByCountry
					.map(result => {
						const intervals: [from: Date, to: Date][] = (
							result.intervals as [string, string][]
						).flatMap(([from, to]) => {
							const intervalFrom = parseDate(from, 'dd.MM', new Date())
							const intervalTo = parseDate(to, 'dd.MM', new Date())

							return isAfter(intervalFrom, intervalTo)
								? [
										[startOfYear(new Date()), intervalTo],
										[intervalFrom, endOfYear(new Date())],
								  ]
								: [[intervalFrom, intervalTo]]
						})

						const cols = new Set(
							range(1, 25).filter(column => {
								const month = Math.ceil(column / 2)
								const isFirstHalf = column % 2 !== 0

								const from = parseDate(
									`${isFirstHalf ? 1 : 15}.${month}`,
									'd.M',
									new Date(),
								)
								const to = parseDate(
									`${isFirstHalf ? 15 : month === 2 ? 28 : 30}.${month}`,
									'd.M',
									new Date(),
								)

								if (!isValidDate(from) || !isValidDate(to)) {
									throw new Error(`date invalid for ${column}`)
								}

								return intervals.some(
									([intervalFrom, intervalTo]) =>
										!isBefore(from, intervalFrom) && !isAfter(to, intervalTo),
								)
							}),
						)

						const spans: { isInInterval: boolean; span: number }[] = []
						for (const column of range(1, 25)) {
							const isInInterval = cols.has(column)
							const latestSpan = spans.at(-1)
							if (latestSpan?.isInInterval === isInInterval) {
								latestSpan.span++
							} else {
								spans.push({ isInInterval, span: 1 })
							}
						}

						return { city: result.city, country: result.country, spans }
					})
					.flatMap(({ city, country, spans }) => {
						const biggestSpan = maxBy(
							spans.filter(span => span.isInInterval),
							span => span.span,
						)!

						const classes: Record<number, string> = {
							1: 'col-span-1',
							2: 'col-span-2',
							3: 'col-span-3',
							4: 'col-span-4',
							5: 'col-span-5',
							6: 'col-span-6',
							7: 'col-span-7',
							8: 'col-span-8',
							9: 'col-span-9',
							10: 'col-span-10',
							11: 'col-span-11',
							12: 'col-span-12',
							13: 'col-span-13',
							14: 'col-span-14',
							15: 'col-span-15',
							16: 'col-span-16',
							17: 'col-span-17',
							18: 'col-span-18',
							19: 'col-span-19',
							20: 'col-span-20',
							21: 'col-span-21',
							22: 'col-span-22',
							23: 'col-span-23',
							24: 'col-span-24',
						}

						return spans.map((span, i) => (
							<div
								className={cn(
									`min-w-[2rem] min-h-[2rem] p-2 text-sm`,
									classes[span.span],
									span.isInInterval && 'bg-indigo-800',
								)}
								key={`${city}, ${country} ${i}`}
							>
								{span === biggestSpan && (
									<>
										{city} <span className="text-xs">{country}</span>
									</>
								)}
							</div>
						))
					})}
				{months}
			</div>
		</div>
	)
}
