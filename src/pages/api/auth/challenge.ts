import { generateNonce } from 'siwe'
import { withSession } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from '@/types/next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	req.session.nonce = generateNonce()
	await req.session.save()

	res.status(200).send(req.session.nonce)
}

export default withSession(handler)
