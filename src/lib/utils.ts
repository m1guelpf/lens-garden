import uaParser from 'ua-parser-js'

export const isBot = (userAgent: string): boolean => {
	const ua = uaParser(userAgent)

	return !!!ua.os.name
}
