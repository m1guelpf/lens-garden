import { gql } from '@apollo/client'

const GET_PROFILE = gql`
	query ($profileId: ProfileId!) {
		profiles(request: { profileIds: [$profileId] }) {
			items {
				id
				handle
			}
		}
	}
`

export default GET_PROFILE
