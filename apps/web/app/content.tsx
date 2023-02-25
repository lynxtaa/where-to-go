'use client'

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
import uniq from 'lodash/uniq'
import { useMemo, useState } from 'react'

import Button from './button'
import CountryRow from './country-row'

type Props = {
	countries: {
		continent: string
		emoji: string
		country: string
		city: string
		intervals: string[][]
	}[]
}

export default function Content({ countries }: Props) {
	const continentNames = useMemo(
		() => uniq(countries.map(result => result.continent)).sort(),
		[countries],
	)

	const [activeContinents, setActiveContinents] = useState<string[]>(continentNames)

	return (
		<>
			<div className="flex justify-center mb-3 flex-wrap gap-3">
				{continentNames.map(continent => (
					<Button
						key={continent}
						variant={activeContinents.includes(continent) ? 'solid' : 'outline'}
						onClick={() =>
							setActiveContinents(
								activeContinents.includes(continent)
									? activeContinents.filter(
											activeContinent => activeContinent !== continent,
									  )
									: [...activeContinents, continent],
							)
						}
					>
						{continent}
					</Button>
				))}
			</div>
			<div className="grid grid-cols-24 bg-gray-900 gap-y-2 max-h-[85vh] overflow-y-auto overflow-x-hidden">
				{[
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
					<div
						className="text-center col-span-2 p-2 sticky top-0 bg-gray-900 drop-shadow-md"
						key={month}
					>
						{month}
					</div>
				))}
				{countries
					.filter(country => activeContinents.includes(country.continent))
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

						return spans.map((span, i) => (
							<CountryRow
								span={span.span}
								isInInterval={span.isInInterval}
								key={`${city}, ${country} ${i}`}
							>
								{span === biggestSpan ? (
									<>
										{city} <span className="text-xs">{country}</span>
									</>
								) : undefined}
							</CountryRow>
						))
					})}
			</div>
		</>
	)
}
