import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Meta from './Meta'
const ConnectWallet = dynamic(() => import('@/components/ConnectWallet'), { ssr: false })

const Layout: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
	return (
		<>
			<Meta />
			<div className="min-h-screen flex flex-col bg-gray-50">
				<header className="bg-white shadow flex items-center justify-between py-4 px-10">
					<Link href="/">
						<a className="text-2xl font-bold">Gated Garden</a>
					</Link>
					<ConnectWallet />
				</header>
				<main className="h-full flex-1 flex flex-col p-12">{children}</main>
			</div>
			<Toaster position="top-center" />
		</>
	)
}

export default Layout
