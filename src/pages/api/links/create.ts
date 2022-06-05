import prisma from '@/prisma/client'
import { client } from '@/lib/apollo'
import { withSession } from '@/lib/session'
import GET_PROFILE from '@/graphql/profiles/get-profile'
import { NextApiRequest, NextApiResponse } from '@/types/next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!req.session.address) return res.status(403).send('Unauthenticated.')
	if (req.method != 'POST') return res.status(405).send('Method not allowed.')

	const { label, profileId, url }: { label: string; profileId: string; url: string } = req.body
	if (!label || !profileId || !url) return res.status(422).send('Invalid request.')

	const {
		data: {
			profiles: { items: profiles },
		},
	} = await client.query({ query: GET_PROFILE, variables: { profileId } })

	const link = await prisma.link.create({ data: { label, profileHandle: profiles[0].handle, profileId, url } })

	res.json(link)
}

export default withSession(handler)
