import { NextApiRequest, NextApiResponse } from '@/types/next'
import { withSession } from '@/lib/session'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.json({ address: req.session.address })
}

export default withSession(handler)
