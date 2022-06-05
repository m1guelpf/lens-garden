export type { NextApiResponse } from 'next'
import { NextApiRequest as BaseRequest } from 'next'

type Query = Record<string, string | string[]>

export interface NextApiRequest<T extends Query = Query> extends BaseRequest {
	query: T
}
