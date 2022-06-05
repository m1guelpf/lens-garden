import Link from 'next/link'

const Home = () => {
	return (
		<div className="relative flex items-center justify-center min-h-screen bg-emerald-100">
			<div className="max-w-3xl mx-auto p-4 md:p-0">
				<h1 className="font-black text-4xl sm:text-6xl leading-tight text-emerald-500">
					Links only your Lens followers can access.
				</h1>
				<p className="mt-4 text-lg sm:text-xl text-black/70 sm:leading-snug">
					Enter the{' '}
					<span className="bg-emerald-300 bg-opacity-25 font-medium text-emerald-500 rounded-lg px-2 -mx-2 relative">
						Gated Garden
					</span>
					, and create links that only wallets following your Lens profile can click through.
				</p>
				<div>
					<p className="mt-4 text-lg sm:text-xl text-black/60 sm:leading-snug">
						Provide exclusive content to your followers, and give them more of an incentive to follow you.
						Or enable{' '}
						<span className="bg-emerald-300 bg-opacity-25 font-medium text-emerald-500 rounded-lg px-2 -mx-2 relative">
							charge to follow
						</span>
						, and bill people to click through!
					</p>
					<p className="mt-4 text-lg sm:text-xl text-black/70 sm:leading-snug">
						Did I mention it&apos;s completely free to use?, You only need to follow{' '}
						<a
							className="underline"
							href="https://open.withlens.app/profile/m1guelpf.lens"
							target="_blank"
							rel="noreferrer"
						>
							@m1guelpf.lens
						</a>{' '}
						to get access.
					</p>
				</div>
				<div className="mt-6 flex items-center justify-between max-w-3xl">
					<Link href="/dashboard">
						<a className="bg-emerald-500 text-white py-2 px-3.5 rounded-xl font-bold shadow transform transition hover:scale-105 active:scale-95">
							Let&apos;s do this!
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Home
