import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'

const httpLink = new HttpLink({ uri: 'https://api.lens.dev/', fetch })

export const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() })
