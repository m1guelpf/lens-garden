import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'

const httpLink = new HttpLink({ uri: 'https://api.lens.dev/', fetch })

const authLink = new ApolloLink((operation, forward) => {
	// const token = localStorage.getItem('lens_token')

	// operation.setContext({
	// 	headers: {
	// 		'x-access-token': token ? `Bearer ${token}` : '',
	// 	},
	// })

	return forward(operation)
})

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
})
