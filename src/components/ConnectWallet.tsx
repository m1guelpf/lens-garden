import { FC } from 'react'
import Button from './Button'
import useAuth from '@/hooks/useAuth'
import useLogin from '@/hooks/useLogin'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const ConnectWallet: FC = () => {
	const { address } = useAuth()
	const { login, logout } = useLogin()

	return (
		<ConnectButton.Custom>
			{({ account, chain, openChainModal, openConnectModal, mounted }) => {
				return (
					<div
						{...(!mounted && {
							'aria-hidden': true,
							style: {
								opacity: 0,
								pointerEvents: 'none',
								userSelect: 'none',
							},
						})}
					>
						{(() => {
							if (!mounted || !account || !chain) {
								return <Button onClick={openConnectModal}>Connect Wallet</Button>
							}

							if (chain.unsupported) {
								return <Button onClick={openChainModal}>Wrong network</Button>
							}

							if (!address) {
								return <Button onClick={login}>Log in with Lens</Button>
							}

							return <Button onClick={logout}>Sign out</Button>
						})()}
					</div>
				)
			}}
		</ConnectButton.Custom>
	)
}

export default ConnectWallet
