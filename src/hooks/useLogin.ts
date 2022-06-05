import { chain, useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import useAuth from './useAuth'

const useLogin = (): { login: () => Promise<void>; logout: () => Promise<void> } => {
	const { mutate } = useAuth()
	const { data: account } = useAccount()
	const { disconnect } = useDisconnect()
	const { signMessageAsync: signMessage } = useSignMessage()

	const login = async (): Promise<void> => {
		const nonce = await fetch('/api/auth/challenge').then(res => res.text())

		const message = new SiweMessage({
			domain: window.location.host,
			address: account?.address,
			statement: 'Sign in to Lens',
			uri: window.location.origin,
			version: '1',
			chainId: chain.polygon.id,
			nonce,
		}).prepareMessage()

		const signature = await signMessage({ message })

		await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ message, signature }),
		})

		mutate({ address: account?.address }, { revalidate: false })
	}

	const logout = async () => {
		await fetch('/api/auth/logout', { method: 'POST' })
		mutate(null, { revalidate: false })
		disconnect()
	}

	return { login, logout }
}

export default useLogin
