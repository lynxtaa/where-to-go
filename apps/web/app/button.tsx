import clsx, { type ClassValue } from 'clsx'
import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react'

type Props = {
	children?: React.ReactNode
	className?: string
	variant?: 'solid' | 'outline' | 'link'
	isDisabled?: boolean
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export default function Button({
	children,
	className,
	variant = 'solid',
	isDisabled = false,
	...rest
}: Props) {
	const baseStyles: ClassValue[] = [
		'transition duration-200 ease-in-out text-gray-200 rounded-sm leading-tight',
		isDisabled
			? 'cursor-not-allowed opacity-80'
			: 'focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600',
	]

	const variants: Record<typeof variant, ClassValue[]> = {
		solid: [
			'bg-gray-700 border border-gray-700 px-3 py-2 hover:bg-gray-700 focus-visible:border-blue-600',
		],
		outline: ['border border-gray-700 px-3 py-2 focus-visible:border-blue-600'],
		link: ['hover:underline'],
	}

	return (
		<button
			className={clsx(baseStyles, variants[variant], className)}
			disabled={isDisabled}
			type="button"
			{...rest}
		>
			{children}
		</button>
	)
}
