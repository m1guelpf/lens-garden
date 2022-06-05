import { AllHTMLAttributes, FC } from 'react'
import Pressable from './Pressable'

const Button: FC<AllHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => {
	return (
		<Pressable
			as="button"
			className={`bg-emerald-500 text-white py-2 px-3.5 rounded-xl font-bold shadow ${className}`}
			{...props}
		/>
	)
}

export default Button
