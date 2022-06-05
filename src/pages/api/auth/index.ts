import { withSession } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from '@/types/next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.json({ address: req.session.address })
}

export default withSession(handler)
