import useAuth from './useAuth'
import { useQuery } from '@apollo/client'
import DOES_FOLLOW from '@/graphql/follow/doesFollow'

const useFollowing = (profileId: string): boolean => {
	const { address } = useAuth()

	const { data: followData } = useQuery(DOES_FOLLOW, {
		variables: { address, profileId },
		skip: !address || !profileId,
	})

	return followData?.doesFollow?.[0]?.follows ?? false
}

export default useFollowing
