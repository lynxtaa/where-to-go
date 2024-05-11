import {
	countries,
	continents,
	getEmojiFlag,
	getCountryCode,
	type TCountryCode,
} from 'countries-list'
import sortBy from 'lodash/sortBy'

import data from '../../../data/results.json'

import Content from './content'

const countriesByName = new Map(
	Object.entries(countries).map(([, info]) => [info.name, info]),
)

const resultsSortedByCountry = sortBy(
	data.map(item => ({
		country: item.country,
		city: item.city,
		intervals: item.value.intervals,
	})),
	item => `${item.country}@${item.city}`,
)

const resultsWithContinents = resultsSortedByCountry.map(result => {
	const country = countriesByName.get(
		result.country === 'Macau' ? 'Macao' : result.country,
	)
	if (!country) {
		throw new Error(`No country for ${result.country}`)
	}
	const code = getCountryCode(country.name)
	return {
		...result,
		continent: continents[country.continent],
		emoji: getEmojiFlag(code as TCountryCode),
	}
})

export default function Page() {
	return (
		<div className="my-0 mx-auto p-4 max-w-4xl">
			<h1 className="text-2xl text-center mb-3">Where To Go</h1>
			<Content countries={resultsWithContinents} />
		</div>
	)
}
