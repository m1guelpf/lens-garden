import useSWR from 'swr'
import Error from 'next/error'
import useAuth from '@/hooks/useAuth'
import { Link } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useQuery } from '@apollo/client'
import { useEffect, useMemo } from 'react'
import DOES_FOLLOW from '@/graphql/follow/doesFollow'
import NeedsFollowState from '@/components/NeedsFollowState'
import UnauthenticatedState from '@/components/UnauthenticatedState'
import Meta from '@/components/Meta'

const Redirect = () => {
	const {
		query: { linkId },
	} = useRouter()
	const { address } = useAuth()
	const { data: link, isValidating: linkLoading } = useSWR<Link>(
		() => linkId && `/api/links/${linkId}`,
		url => fetch(url).then(res => res.json())
	)
	const { data: followData } = useQuery(DOES_FOLLOW, {
		variables: { address, profileId: link?.profileId },
		skip: !address || !link,
	})

	const isFollowing = useMemo(() => {
		return followData?.doesFollow?.[0]?.follows ?? false
	}, [followData])

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
