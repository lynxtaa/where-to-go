import clsx from 'clsx'

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

type Props = {
	isInInterval: boolean
	span: number
	children?: React.ReactNode
}

export default function CountryRow({ span, isInInterval, children }: Props) {
	return (
		<div
			className={clsx(
				`min-w-[2rem] min-h-[2rem] p-2 text-sm`,
				classes[span],
				isInInterval && 'bg-indigo-800',
			)}
		>
			{children}
		</div>
	)
}
