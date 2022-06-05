import { FC } from 'react'
import 'tailwindcss/tailwind.css'
import { AppProps } from 'next/app'
import { client } from '@/lib/apollo'
import '@rainbow-me/rainbowkit/styles.css'
import { ApolloProvider } from '@apollo/client'
import { chain, createClient, WagmiProvider } from 'wagmi'
import { apiProvider, configureChains, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'

const { chains, provider } = configureChains(
	[chain.polygonMumbai, chain.polygon],
	[apiProvider.infura(process.env.NEXT_PUBLIC_INFURA_ID), apiProvider.fallback()]
)

const { connectors } = getDefaultWallets({ appName: 'Gated Garden', chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })
const rainbowTheme = lightTheme({ accentColor: 'green' })

const App: FC<AppProps> = ({ Component, pageProps }) => (
	<WagmiProvider client={wagmiClient}>
		<RainbowKitProvider chains={chains} theme={rainbowTheme}>
			<ApolloProvider client={client}>
				<Component {...pageProps} />
			</ApolloProvider>
		</RainbowKitProvider>
	</WagmiProvider>
)

export default App
