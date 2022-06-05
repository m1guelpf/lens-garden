import { isBot } from '@/lib/utils'
import prisma from '@/prisma/client'
import { client } from '@/lib/apollo'
import { withSession } from '@/lib/session'
import DOES_FOLLOW from '@/graphql/follow/doesFollow'
import { NextApiRequest, NextApiResponse } from '@/types/next'

const handler = async (req: NextApiRequest<{ id: string }>, res: NextApiResponse) => {
	const link = await prisma.link.findUnique({ where: { id: parseInt(req.query.id) } })
	if (!link) return res.status(404).send('Not Found')

	if (!req.session.address || isBot(req.headers['user-agent'])) {
		return res.redirect(`/redirect?linkId=${req.query.id}`)
	}

	const {
		data: { doesFollow },
	} = await client.query({
		query: DOES_FOLLOW,
		variables: { address: req.session.address, profileId: link.profileId },
	})

	if (!doesFollow[0].follows) return res.redirect(`/redirect?linkId=${req.query.id}`)

	res.redirect(link.url)
}

export default withSession(handler)
