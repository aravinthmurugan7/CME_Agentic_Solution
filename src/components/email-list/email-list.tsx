import { Email } from '../../mock-data/mock-emails';
interface EmailListProps {
	emails: Email[];
	selectedEmail: Email | null;
	setSelectedEmail: (email: Email) => void;
}

const EmailList = ({ emails, selectedEmail, setSelectedEmail }: EmailListProps) => {
	return (
		<div className="space-y-2 max-h-[500px] overflow-y-auto">
			{emails.map((email) => (
				<div
					key={email.id}
					className={`p-4 border rounded-lg cursor-pointer transition-all ${
						selectedEmail?.id === email.id
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200 hover:border-gray-300'
					}`}
					onClick={(e) => {
						e.preventDefault();
						setSelectedEmail(email);
					}}
				>
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center space-x-3">
							<div
								className={`w-3 h-3 rounded-full ${
									email.status === 'completed'
										? 'bg-green-500'
										: email.status === 'processing'
											? 'bg-blue-500'
											: email.priority === 'high'
												? 'bg-red-500'
												: email.priority === 'medium'
													? 'bg-yellow-500'
													: 'bg-green-500'
								}`}
							></div>
							<span className="font-medium text-gray-900">{email.from}</span>
							<span
								className={`px-2 py-1 rounded-full text-xs ${
									email.status === 'processing'
										? 'bg-blue-100 text-blue-800'
										: email.status === 'completed'
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
								}`}
							>
								{email.status}
							</span>
							{email.isNew && (
								<span className="px-2 py-1 rounded-full text-xs bg-blue-600 text-white animate-pulse">
									NEW
								</span>
							)}
						</div>
						<span className="text-sm text-gray-500">{email.timestamp}</span>
					</div>
					<h3 className="font-medium text-gray-900 mb-1">{email.subject}</h3>
					<p className="text-sm text-gray-600 line-clamp-2">{email.preview}</p>
					<div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
						<span>Account: {email.loanAccount}</span>
						<span>Type: {email.requestType.replace('_', ' ')}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default EmailList;
