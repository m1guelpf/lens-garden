import { generateNonce } from 'siwe'
import { NextApiRequest, NextApiResponse } from '@/types/next'
import { withSession } from '@/lib/session'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	req.session.nonce = generateNonce()
	await req.session.save()

	res.status(200).send(req.session.nonce)
}

export default withSession(handler)
