import prisma from '@/prisma/client'
import { client } from '@/lib/apollo'
import { withSession } from '@/lib/session'
import GET_PROFILES from '@/graphql/profiles/get-profiles'
import { NextApiRequest, NextApiResponse } from '@/types/next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!req.session.address) return res.status(403).send('Unauthenticated.')

	const {
		data: {
			profiles: { items: profiles },
		},
	} = await client.query({ query: GET_PROFILES, variables: { address: req.session.address } })

	res.json(await prisma.link.findMany({ where: { profileId: { in: profiles.map(profile => profile.id) } } }))
}

export default withSession(handler)
