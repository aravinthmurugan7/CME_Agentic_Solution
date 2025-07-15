import { Activity, Bot, CheckCircle, Clock, FileText, Mail, Zap } from 'lucide-react';
import React, { useEffect,useState } from 'react';

interface ActivityItem {
	id: number;
	type: 'email_received' | 'status_change' | 'document_analyzed' | 'response_generated' | 'email_sent';
	emailId: number;
	emailFrom: string;
	loanAccount: string;
	message: string;
	timestamp: string;
	status?: string;
	previousStatus?: string;
}

interface Email {
	id: number;
	from: string;
	loanAccount: string;
	status: string;
}

interface LiveActivityFeedProps {
	emails: Email[];
	isVisible: boolean;
	onToggle: () => void;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ emails, isVisible, onToggle }) => {
	const [activities, setActivities] = useState<ActivityItem[]>([]);

	useEffect(() => {
		// Generate activities based on email status changes
		const newActivities: ActivityItem[] = [];

		emails.forEach((email) => {
			const baseTime = new Date();

			// Email received activity
			newActivities.push({
				id: email.id * 1000 + 1,
				type: 'email_received',
				emailId: email.id,
				emailFrom: email.from,
				loanAccount: email.loanAccount,
				message: `New email received from ${email.from}`,
				timestamp: new Date(baseTime.getTime() - 300000).toLocaleTimeString(), // 5 minutes ago
			});

			// Status progression activities
			if (email.status !== 'incoming') {
				newActivities.push({
					id: email.id * 1000 + 2,
					type: 'status_change',
					emailId: email.id,
					emailFrom: email.from,
					loanAccount: email.loanAccount,
					message: `Status changed to analyzing`,
					timestamp: new Date(baseTime.getTime() - 240000).toLocaleTimeString(), // 4 minutes ago
					status: 'analyzing',
					previousStatus: 'incoming',
				});
			}

			if (['drafting_response', 'pending_review', 'completed'].includes(email.status)) {
				newActivities.push({
					id: email.id * 1000 + 3,
					type: 'document_analyzed',
					emailId: email.id,
					emailFrom: email.from,
					loanAccount: email.loanAccount,
					message: `Documents analyzed for ${email.loanAccount}`,
					timestamp: new Date(baseTime.getTime() - 180000).toLocaleTimeString(), // 3 minutes ago
				});

				newActivities.push({
					id: email.id * 1000 + 4,
					type: 'status_change',
					emailId: email.id,
					emailFrom: email.from,
					loanAccount: email.loanAccount,
					message: `Status changed to drafting response`,
					timestamp: new Date(baseTime.getTime() - 120000).toLocaleTimeString(), // 2 minutes ago
					status: 'drafting_response',
					previousStatus: 'analyzing',
				});
			}

			if (['pending_review', 'completed'].includes(email.status)) {
				newActivities.push({
					id: email.id * 1000 + 5,
					type: 'response_generated',
					emailId: email.id,
					emailFrom: email.from,
					loanAccount: email.loanAccount,
					message: `AI response generated for ${email.loanAccount}`,
					timestamp: new Date(baseTime.getTime() - 60000).toLocaleTimeString(), // 1 minute ago
				});

				newActivities.push({
					id: email.id * 1000 + 6,
					type: 'status_change',
					emailId: email.id,
					emailFrom: email.from,
					loanAccount: email.loanAccount,
					message: `Status changed to pending review`,
					timestamp: new Date(baseTime.getTime() - 30000).toLocaleTimeString(), // 30 seconds ago
					status: 'pending_review',
					previousStatus: 'drafting_response',
				});
			}

			if (email.status === 'completed') {
				newActivities.push({
					id: email.id * 1000 + 7,
					type: 'email_sent',
					emailId: email.id,
					emailFrom: email.from,
					loanAccount: email.loanAccount,
					message: `Response sent to ${email.from}`,
					timestamp: new Date().toLocaleTimeString(),
				});
			}
		});

		// Sort by timestamp (most recent first)
		newActivities.sort((a, b) => {
			const timeA = new Date(`1970/01/01 ${a.timestamp}`).getTime();
			const timeB = new Date(`1970/01/01 ${b.timestamp}`).getTime();
			return timeB - timeA;
		});

		setActivities(newActivities.slice(0, 20)); // Keep only the latest 20 activities
	}, [emails]);

	const getActivityIcon = (type: ActivityItem['type']) => {
		switch (type) {
			case 'email_received':
				return <Mail className="w-4 h-4 text-blue-500" />;
			case 'status_change':
				return <Activity className="w-4 h-4 text-orange-500" />;
			case 'document_analyzed':
				return <FileText className="w-4 h-4 text-green-500" />;
			case 'response_generated':
				return <Bot className="w-4 h-4 text-purple-500" />;
			case 'email_sent':
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			default:
				return <Clock className="w-4 h-4 text-gray-500" />;
		}
	};

	const getActivityColor = (type: ActivityItem['type']) => {
		switch (type) {
			case 'email_received':
				return 'border-blue-200 bg-blue-50';
			case 'status_change':
				return 'border-orange-200 bg-orange-50';
			case 'document_analyzed':
				return 'border-green-200 bg-green-50';
			case 'response_generated':
				return 'border-purple-200 bg-purple-50';
			case 'email_sent':
				return 'border-green-200 bg-green-50';
			default:
				return 'border-gray-200 bg-gray-50';
		}
	};

	if (!isVisible) {
		return (
			<button
				onClick={onToggle}
				className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-r-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
			>
				<div className="flex items-center space-x-2">
					<Activity className="w-5 h-5 text-blue-600" />
					<span className="text-sm font-medium text-gray-700 writing-mode-vertical-rl text-orientation-mixed">
						Activity Feed
					</span>
				</div>
			</button>
		);
	}

	return (
		<div className="fixed left-4 top-20 bottom-4 w-80 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
				<div className="flex items-center space-x-2">
					<Activity className="w-5 h-5 text-blue-600" />
					<h3 className="font-semibold text-gray-900">Live Activity Feed</h3>
				</div>
				<button onClick={onToggle} className="p-1 hover:bg-gray-200 rounded">
					<Zap className="w-4 h-4" />
				</button>
			</div>

			{/* Activity List */}
			<div className="flex-1 overflow-y-auto p-4">
				<div className="space-y-3">
					{activities.map((activity, index) => (
						<div
							key={activity.id}
							className={`p-3 border rounded-lg transition-all duration-300 ${getActivityColor(activity.type)} ${
								index === 0 ? 'animate-pulse' : ''
							}`}
						>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900">{activity.message}</p>
									<div className="flex items-center justify-between mt-1">
										<p className="text-xs text-gray-600">{activity.loanAccount}</p>
										<p className="text-xs text-gray-500">{activity.timestamp}</p>
									</div>
									{activity.status && activity.previousStatus && (
										<div className="mt-2 flex items-center space-x-2 text-xs">
											<span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
												{activity.previousStatus.replace('_', ' ')}
											</span>
											<span className="text-gray-400">→</span>
											<span className="px-2 py-1 bg-blue-200 text-blue-700 rounded-full">
												{activity.status.replace('_', ' ')}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					))}

					{activities.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							<Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
							<p>No recent activity</p>
						</div>
					)}
				</div>
			</div>

			{/* Footer */}
			<div className="p-3 border-t bg-gray-50 rounded-b-lg">
				<div className="flex items-center justify-between text-xs text-gray-600">
					<span>Real-time updates</span>
					<div className="flex items-center space-x-1">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span>Live</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LiveActivityFeed;
