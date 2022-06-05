import { FC } from 'react'
import Button from './Button'
import { UserAddIcon, UserGroupIcon } from '@heroicons/react/outline'

const MiguelFollowState: FC = () => {
	return (
		<div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8">
			<div className="space-y-6 flex flex-col items-center">
				<UserGroupIcon className="mx-auto h-24 w-24 text-gray-400" />
				<div className="space-y-2">
					<h2 className="block font-medium text-4xl text-gray-900 text-center">This app is follow-gated</h2>
					<p className="max-w-md mx-center text-center mt-2  text-gray-700">
						To use the Gated Garden app, you must follow{' '}
						<a
							href={`https://open.withlens.app/profile/m1guelpf.lens`}
							target="_blank"
							className="font-medium"
							rel="noreferrer"
						>
							@m1guelpf.lens
						</a>
						.
					</p>
				</div>
				<Button
					className="inline-flex items-center !font-normal leading-5"
					as="a"
					href={`https://www.lensfrens.xyz/m1guelpf.lens`}
					target="_blank"
				>
					<UserAddIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
					Follow @m1guelpf.lens
				</Button>
			</div>
		</div>
	)
}

export default MiguelFollowState
