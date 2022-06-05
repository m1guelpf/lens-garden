import { NextApiRequest, NextApiResponse } from '@/types/next'
import prisma from '@/prisma/client'
import { withSession } from '@/lib/session'
import GET_PROFILES from '@/graphql/profiles/get-profiles'
import { client } from '@/lib/apollo'
import GET_PROFILE from '@/graphql/profiles/get-profile'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method == 'GET') return getLink(req, res)

	if (!req.session.address) return res.status(403).send('Unauthenticated.')

	const {
		data: {
			profiles: { items: profiles },
		},
	} = await client.query({ query: GET_PROFILES, variables: { address: req.session.address } })

	const link = await prisma.link.findUnique({ where: { id: parseInt(req.query.id as string) } })
	if (!link || !profiles.map(profile => profile.id).includes(link.profileId)) {
		return res.status(401).send('Unauthenticated.')
	}

	switch (req.method) {
		case 'DELETE':
			return deleteLink(req, res)

		case 'PUT':
			return editLink(req, res)

		default:
			return res.status(405).send('Method not allowed.')
	}
}

const getLink = async (req: NextApiRequest, res: NextApiResponse) => {
	const link = await prisma.link.findUnique({ where: { id: parseInt(req.query.id as string) } })

	res.json(link)
}

const editLink = async (req: NextApiRequest, res: NextApiResponse) => {
	const { label, profileId, url }: { label: string; profileId: string; url: string } = req.body
	if (!label || !profileId || !url) return res.status(422).send('Invalid request.')

	const {
		data: {
			profiles: { items: profiles },
		},
	} = await client.query({ query: GET_PROFILE, variables: { profileId } })

	const link = await prisma.link.update({
		where: { id: parseInt(req.query.id as string) },
		data: { label, profileId, profileHandle: profiles[0].handle, url },
	})

	res.json(link)
}

const deleteLink = async (req: NextApiRequest, res: NextApiResponse) => {
	await prisma.link.delete({ where: { id: parseInt(req.query.id as string) } })

	res.json({})
}

export default withSession(handler)
