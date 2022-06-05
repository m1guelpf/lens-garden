import type { IronSessionOptions } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'

export const sessionOptions: IronSessionOptions = {
	password: process.env.APP_KEY as string,
	cookieName: 'garden-key',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
}

export const withSession = handler => withIronSessionApiRoute(handler, sessionOptions)

declare module 'iron-session' {
	interface IronSessionData {
		nonce?: string
		address?: string
	}
}
