import { SiweMessage } from 'siwe'
import { NextApiRequest, NextApiResponse } from '@/types/next'
import { withSession } from '@/lib/session'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const message = new SiweMessage(req.body.message)

	try {
		const fields = await message.validate(req.body.signature)

		if (fields.nonce !== req.session.nonce) throw new Error('Invalid nonce.')

		req.session.address = fields.address
		await req.session.save()

		res.status(200).json({ address: req.session.address })
	} catch (e) {
		req.session.destroy()

		res.status(400).json({ error: e.message })
	}
}

export default withSession(handler)
