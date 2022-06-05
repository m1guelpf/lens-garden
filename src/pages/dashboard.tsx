import useSWR from 'swr'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import useAuth from '@/hooks/useAuth'
import { Link } from '@prisma/client'
import Button from '@/components/Button'
import Layout from '@/components/Layout'
import { useQuery } from '@apollo/client'
import useFollowing from '@/hooks/useFollowing'
import { MIGUEL_PROFILE_ID } from '@/lib/consts'
import { FormEventHandler, useState } from 'react'
import GET_PROFILES from '@/graphql/profiles/get-profiles'
import MiguelFollowState from '@/components/MiguelFollowState'
import UnauthenticatedState from '@/components/UnauthenticatedState'
import { ClipboardCheckIcon, ClipboardCopyIcon, LinkIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline'

const Dashboard = () => {
	const { address } = useAuth()
	const isFollowing = useFollowing(MIGUEL_PROFILE_ID)
	const [justCopied, setJustCopied] = useState<boolean>(false)
	const [isCreating, setCreating] = useState<boolean>(false)
	const [linkId, setLinkId] = useState<number>(null)
	const [label, setLabel] = useState<string>('')
	const [profileId, setProfileId] = useState<string>(null)
	const [destination, setDestination] = useState<string>(null)

	const { data: profiles } = useQuery<{ profiles: { items: Array<{ id: string; handle: string }> } }>(GET_PROFILES, {
		variables: { address },
		skip: !address,
	})
	const { data: links, mutate: mutateLinks } = useSWR<Link[]>(
		() => address && '/api/links',
		url => fetch(url).then(res => res.json())
	)

	const copyLink = link => {
		copy(`${window.location.origin}/redirect/${link.id}`)
		toast.success('Copied link!')
		setJustCopied(true)
		setTimeout(() => setJustCopied(false), 1000)
	}

	const createLink: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()

		let link
		if (!linkId) {
			link = await fetch('api/links/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ label, profileId, url: `https://${destination}` }),
			}).then(res => res.json())

			toast.success('Link created!')

			mutateLinks(
				links => {
					links.push(link)

					return links
				},
				{ revalidate: true }
			)
		} else {
			link = await fetch(`api/links/${linkId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ label, profileId, url: `https://${destination}` }),
			}).then(res => res.json())

			toast.success('Link updated!')

			mutateLinks(links => links.map(l => (l.id === link.id ? link : l)), { revalidate: true })
		}

		setLabel('')
		setProfileId(null)
		setDestination('')
		setLinkId(null)
		setCreating(false)
	}

	const deleteLink = async (link: Link) => {
		try {
			await fetch(`/api/links/${link.id}`, { method: 'DELETE' }).then(res => res.json())

			mutateLinks(links => links.filter(l => l.id != link.id), { revalidate: true })
			toast.success('Link deleted!')
		} catch (e) {
			console.log(e)
			toast.error('Could delete link, try again!')
		}
	}

	const editLink = (link: Link) => {
		setLinkId(link.id)
		setLabel(link.label)
		setProfileId(link.profileId)
		setDestination(link.url.split('https://', 2)[1])
		setCreating(true)
	}

	return (
		<Layout>
			{(() => {
				if (!address) return <UnauthenticatedState />
				if (!isFollowing) return <MiguelFollowState />

				return (
					<div className="px-4 sm:px-6 lg:px-8">
						<div className="sm:flex sm:items-center">
							<div className="sm:flex-auto">
								<h1 className="text-xl font-semibold text-gray-900">Links</h1>
								<p className="mt-2 text-sm text-gray-700">
									Create links that only followers of the selected Lens profile will be able to
									access.
								</p>
							</div>
							{!isCreating && (
								<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
									<Button onClick={() => setCreating(true)} className="!font-normal leading-5">
										Create
									</Button>
								</div>
							)}
						</div>
						{isCreating ? (
							<form className="mt-6" onSubmit={createLink} method="POST">
								<div className="shadow sm:rounded-md sm:overflow-hidden">
									<div className="px-4 py-5 bg-white space-y-6 sm:p-6">
										<div className="grid grid-cols-3 gap-6">
											<div className="col-span-3 grid sm:grid-cols-2 gap-6">
												<div>
													<label
														htmlFor="label"
														className="block text-sm font-medium text-gray-700"
													>
														Label
													</label>
													<input
														type="text"
														name="label"
														id="label"
														className="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
														required
														placeholder="My link"
														value={label}
														onChange={event => setLabel(event.target.value)}
													/>
													<p className="mt-2 text-sm text-gray-500">
														Used to recognize your link in the dashboard. Users won&apos;t
														see it.
													</p>
												</div>
												<div>
													<label
														htmlFor="profile"
														className="block text-sm font-medium text-gray-700"
													>
														Profile
													</label>
													<select
														id="profile"
														name="profile"
														value={profileId}
														onChange={event => setProfileId(event.target.value)}
														className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm invalid:text-gray-600"
														required
													>
														<option value="" disabled selected hidden>
															Select a profile...
														</option>
														{profiles?.profiles?.items?.map(profile => (
															<option key={profile.id} value={profile.id}>
																@{profile.handle}
															</option>
														))}
													</select>
												</div>
											</div>

											<div className="col-span-3 sm:col-span-2">
												<label
													htmlFor="destination"
													className="block text-sm font-medium text-gray-700"
												>
													Destination
												</label>
												<div className="mt-1 flex rounded-md shadow-sm">
													<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
														https://
													</span>
													<input
														type="text"
														name="destination"
														id="destination"
														className="focus:ring-emerald-500 focus:border-emerald-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
														placeholder="miguelpiedrafita.com/lens"
														value={destination}
														onChange={event => setDestination(event.target.value)}
														required
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
										<Button type="submit" className="!font-normal leading-5">
											Save
										</Button>
									</div>
								</div>
							</form>
						) : links?.length > 0 ? (
							<div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
								<table className="min-w-full divide-y divide-gray-300">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
											>
												Title
											</th>
											<th
												scope="col"
												className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
											>
												Profile
											</th>
											<th
												scope="col"
												className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
											>
												Destination
											</th>
											<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
												<span className="sr-only">Edit</span>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{links.map(link => (
											<tr key={link.id}>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
													{link.label}
												</td>
												<td className=" whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
													@{link.profileHandle}
												</td>
												<td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
													{link.url}
												</td>
												<td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium space-x-2 sm:pr-6 flex items-center justify-end">
													<button
														onClick={() => copyLink(link)}
														className="text-gray-600 hover:text-gray-900"
													>
														{justCopied ? (
															<ClipboardCheckIcon className="w-4 h-4" />
														) : (
															<ClipboardCopyIcon className="w-4 h-4" />
														)}
													</button>
													<button
														onClick={() => editLink(link)}
														className="text-emerald-600 hover:text-emerald-900"
													>
														<PencilAltIcon className="w-4 h-4" />
													</button>
													<button
														onClick={() => deleteLink(link)}
														className="text-red-600 hover:text-red-900"
													>
														<TrashIcon className="w-4 h-4" />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="mt-20 text-center">
								<LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
								<h3 className="mt-2 text-sm font-medium text-gray-900">No links</h3>
								<p className="mt-1 text-sm text-gray-500">Get started by creating a new link</p>
								<div className="mt-6">
									<Button
										onClick={() => setCreating(true)}
										className="inline-flex items-center !font-normal leading-5"
									>
										<LinkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
										Create link
									</Button>
								</div>
							</div>
						)}
					</div>
				)
			})()}
		</Layout>
	)
}

export default Dashboard
