import useSWR from 'swr'

const useAuth = () => {
	const { data, isValidating, mutate } = useSWR<{ address: string }>('/api/auth', url =>
		fetch(url).then(res => res.json())
	)

	return { address: data?.address, isAuthenticated: !!data, loading: isValidating, mutate }
}

export default useAuth
