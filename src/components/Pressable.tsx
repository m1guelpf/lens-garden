import { FC } from 'react'

const Pressable: FC<{ as?: string | FC; className?: string }> = ({
	as: Component = 'button',
	className = '',
	...props
}) => {
	// @ts-ignore
	return <Component className={`transform transition hover:scale-105 active:scale-95 ${className}`} {...props} />
}

export default Pressable
