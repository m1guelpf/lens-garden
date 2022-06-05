import useSWR from 'swr'
import Error from 'next/error'
import { useEffect } from 'react'
import Meta from '@/components/Meta'
import useAuth from '@/hooks/useAuth'
import { Link } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import useFollowing from '@/hooks/useFollowing'
import NeedsFollowState from '@/components/NeedsFollowState'
import UnauthenticatedState from '@/components/UnauthenticatedState'

const Redirect = () => {
	const {
		query: { linkId },
	} = useRouter()
	const { address } = useAuth()
	const { data: link, isValidating: linkLoading } = useSWR<Link>(
		() => linkId && `/api/links/${linkId}`,
		url => fetch(url).then(res => res.json())
	)
	const isFollowing = useFollowing(link?.profileId)

	useEffect(() => {
		if (!link || !address || !isFollowing) return

		window.location.href = `/redirect/${linkId}`
	})

	if (!linkId && !link && !linkLoading) {
		return (
			<>
				<Meta
					title="This link has been gated with Lens Garden"
					description="Gated Garden allows you to create links only your Lens followers can access. This is one of them."
				/>
				<Error statusCode={404} />
			</>
		)
	}

	return (
		<Layout>
			{(() => {
				if (!address) return <UnauthenticatedState />
				if (!isFollowing) return <NeedsFollowState link={link} />

				return <span>Redirecting...</span>
			})()}
		</Layout>
	)
}

export default Redirect
