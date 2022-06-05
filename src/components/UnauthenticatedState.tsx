import { FC } from 'react'
import ConnectWallet from './ConnectWallet'
import { LoginIcon } from '@heroicons/react/outline'

const UnauthenticatedState: FC = () => {
	return (
		<div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8">
			<div className="space-y-2">
				<LoginIcon className="mx-auto h-24 w-24 text-gray-400 transform rotate-180" />
				<h2 className="block font-medium text-4xl text-gray-900">Sign in to continue</h2>
			</div>
			<ConnectWallet />
		</div>
	)
}

export default UnauthenticatedState
