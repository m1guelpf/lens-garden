import { withSession } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from '@/types/next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method != 'POST') return res.status(400).send()

	req.session.destroy()

	res.send()
}

export default withSession(handler)
