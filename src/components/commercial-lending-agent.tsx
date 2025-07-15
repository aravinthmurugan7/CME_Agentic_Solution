import {
	AlertCircle,
	ArrowLeft,
	ArrowUp,
	Bot,
	CheckCircle,
	Clock,
	Download,
	Eye,
	FileText,
	Filter,
	Mail,
	MessageSquare,
	Search,
	Send,
	User,
	Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import DocumentChatInterface from './document-chat-interface';
import EmailList from './email-list/email-list';
import { Email, mockEmails } from '../mock-data/mock-emails';

const CommercialLendingAgent = () => {
	const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
	const [currentPage, setCurrentPage] = useState('landing');
	const [agentStatus, setAgentStatus] = useState('idle');
	const [processingStep, setProcessingStep] = useState(0);
	const [draftResponse, setDraftResponse] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editedResponse, setEditedResponse] = useState('');
	const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
	const [showChat, setShowChat] = useState(false);
	const [isChatMinimized, setIsChatMinimized] = useState(false);

	const [emails, setEmails] = useState<Email[]>(mockEmails);

	const [newEmailsQueue, setNewEmailsQueue] = useState<Email[]>([
		{
			id: 4,
			from: 'lisa.chen@manufactureplus.com',
			subject: 'Credit Line Increase Request - Account #LC-2024-0089',
			timestamp: 'Just now',
			priority: 'high',
			status: 'pending',
			loanAccount: 'LC-2024-0089',
			requestType: 'credit_increase',
			preview:
				'We would like to request an increase to our credit line from $500K to $750K to support our expansion plans.',
			isNew: true,
		},
		{
			id: 5,
			from: 'robert.kim@logistics.com',
			subject: 'Loan Restructuring Request - Account #LC-2023-0456',
			timestamp: 'Just now',
			priority: 'high',
			status: 'pending',
			loanAccount: 'LC-2023-0456',
			requestType: 'restructure',
			preview:
				'Due to market changes, we need to restructure our loan terms. Please review our updated financial statements.',
			isNew: true,
		},
		{
			id: 7,
			from: 'david.thompson@realestatedev.com',
			subject: 'Construction Loan Extension - Account #LC-2023-0334',
			timestamp: 'Just now',
			priority: 'high',
			status: 'pending',
			loanAccount: 'LC-2023-0334',
			requestType: 'loan_extension',
			preview:
				'Our construction project needs a 6-month extension due to permit delays. Please review our request.',
			isNew: true,
		},
	]);

	useEffect(() => {
		if (currentPage === 'email-agent') {
			const interval = setInterval(() => {
				if (newEmailsQueue.length > 0 && emails.length < 7) {
					const nextEmail = newEmailsQueue[0];
					setNewEmailsQueue((prev) => prev.slice(1));
					setEmails((prevEmails) => [nextEmail, ...prevEmails]);
				}
			}, 15000);

			return () => clearInterval(interval);
		}
	}, [currentPage, emails.length, newEmailsQueue]);

	const processingSteps = [
		'Analyzing email content',
		'Identifying loan account',
		'Retrieving relevant documents',
		'Reviewing loan terms',
		'Calculating payoff amount',
		'Drafting response',
	];

	const getDocumentsForEmail = (email: Email | null) => {
		if (!email) return [];

		switch (email.id) {
			case 1:
				return [
					{ id: 1, name: 'Loan Agreement - LC-2024-0158.pdf', type: 'agreement', status: 'analyzed' },
					{ id: 2, name: 'Payment Schedule - LC-2024-0158.xlsx', type: 'schedule', status: 'analyzed' },
					{ id: 3, name: 'Credit Report - TechCorp.pdf', type: 'credit', status: 'analyzed' },
					{ id: 4, name: 'Financial Statements - Q3 2024.pdf', type: 'financial', status: 'reviewing' },
				];
			case 2:
				return [
					{ id: 5, name: 'Loan Agreement - LC-2023-0892.pdf', type: 'agreement', status: 'analyzed' },
					{
						id: 6,
						name: 'Modification Request - LC-2023-0892.pdf',
						type: 'modification',
						status: 'analyzed',
					},
					{ id: 7, name: 'Credit Report - RetailPlus.pdf', type: 'credit', status: 'analyzed' },
					{ id: 8, name: 'Cash Flow Analysis - RetailPlus.xlsx', type: 'financial', status: 'analyzed' },
				];
			case 3:
				return [
					{ id: 9, name: 'Loan Agreement - LC-2024-0245.pdf', type: 'agreement', status: 'analyzed' },
					{ id: 10, name: 'Payment Schedule - LC-2024-0245.xlsx', type: 'schedule', status: 'analyzed' },
					{ id: 11, name: 'Credit Report - ConstructCo.pdf', type: 'credit', status: 'analyzed' },
					{ id: 12, name: 'Project Delay Notice - ConstructCo.pdf', type: 'notice', status: 'analyzed' },
				];
			default:
				return [
					{
						id: 13,
						name: `Loan Agreement - ${  email.loanAccount  }.pdf`,
						type: 'agreement',
						status: 'analyzed',
					},
					{
						id: 14,
						name: `Credit Report - ${  email.from.split('@')[1]  }.pdf`,
						type: 'credit',
						status: 'analyzed',
					},
					{ id: 15, name: 'Financial Statements - Current.pdf', type: 'financial', status: 'analyzed' },
				];
		}
	};

	const generateResponseForEmail = (email: Email | null) => {
		if (!email) return '';

		switch (email.id) {
			case 1:
				return `Dear Mr. Smith,

Thank you for your inquiry regarding the early payoff of your commercial loan (Account #LC-2024-0158).

Based on our review of your loan agreement and current payment schedule, here are the details:

**Current Loan Balance:** $487,250.00
**Accrued Interest:** $2,180.45
**Prepayment Penalty:** $9,745.00 (2% of remaining principal)
**Total Payoff Amount:** $499,175.45

**Important Notes:**
- This payoff amount is valid through [Date + 10 days]
- The prepayment penalty applies as outlined in Section 4.3 of your loan agreement
- Payment must be received via wire transfer or certified funds

To proceed with the payoff, please confirm your intent and we will provide wire transfer instructions.

Please contact me if you have any questions or need clarification on any of these terms.

Best regards,
Commercial Lending Department`;

			default:
				return `Dear ${email.from
					.split('@')[0]
					.split('.')
					.map((n: string) => n.charAt(0).toUpperCase() + n.slice(1))
					.join(' ')},

Thank you for your recent request regarding account #${email.loanAccount}.

We have received your inquiry and are currently reviewing your request. Our team will analyze your account details and provide you with a comprehensive response within 2-3 business days.

If you have any urgent questions, please don't hesitate to contact us directly.

Best regards,
Commercial Lending Department`;
		}
	};

	const sendEmail = () => {
		if (!selectedEmail) return;

		setEmails((prevEmails) =>
			prevEmails.map((email) => (email.id === selectedEmail.id ? { ...email, status: 'completed' } : email)),
		);

		setSelectedEmail((prev) => (prev ? { ...prev, status: 'completed' } : null));

		setNotification({
			type: 'success',
			message: 'Successfully Sent',
		});

		setTimeout(() => {
			setNotification(null);
		}, 3000);
	};

	const startEditing = () => {
		setEditedResponse(draftResponse);
		setIsEditing(true);
		setTimeout(() => {
			const textarea = document.querySelector(
				'textarea[placeholder="Edit your response here..."]',
			) as HTMLTextAreaElement;
			if (textarea) {
				textarea.focus();
				textarea.setSelectionRange(textarea.value.length, textarea.value.length);
			}
		}, 0);
	};

	const saveEdits = () => {
		setDraftResponse(editedResponse);
		setIsEditing(false);
	};

	const cancelEdits = () => {
		setEditedResponse(draftResponse);
		setIsEditing(false);
	};

	const simulateProcessing = () => {
		if (!selectedEmail) return;

		setAgentStatus('processing');
		setProcessingStep(0);

		setEmails((prevEmails) =>
			prevEmails.map((email) =>
				email.id === selectedEmail.id ? { ...email, status: 'processing', isNew: false } : email,
			),
		);
		setSelectedEmail((prev) => (prev ? { ...prev, status: 'processing', isNew: false } : null));

		const interval = setInterval(() => {
			setProcessingStep((prev) => {
				const nextStep = prev + 1;
				if (nextStep >= processingSteps.length) {
					clearInterval(interval);
					setAgentStatus('completed');
					const responseText = generateResponseForEmail(selectedEmail);
					setDraftResponse(responseText);
					setEditedResponse(responseText);
					return processingSteps.length;
				}
				return nextStep;
			});
		}, 1000);
	};

	const LandingPage = () => {
		const tiles = [
			{
				id: 'email-agent',
				title: 'Email Request Processing',
				description: 'AI-powered email processing for loan requests, modifications, and customer inquiries',
				icon: <Mail className="w-8 h-8 text-blue-600" />,
				stats: `${emails.length} active requests`,
				color: 'blue',
				action: () => setCurrentPage('email-agent'),
			},
			{
				id: 'qc-validation',
				title: 'Quality Control & Validation',
				description: 'Post-booking QC processes, loan validation, and compliance checking',
				icon: <CheckCircle className="w-8 h-8 text-green-600" />,
				stats: 'Coming Soon',
				color: 'green',
				action: () => alert('QC Module - Coming Soon'),
			},
			{
				id: 'document-analysis',
				title: 'Document Analysis',
				description: 'AI-powered document review, extraction, and risk assessment',
				icon: <FileText className="w-8 h-8 text-purple-600" />,
				stats: 'Coming Soon',
				color: 'purple',
				action: () => alert('Document Analysis - Coming Soon'),
			},
			{
				id: 'risk-assessment',
				title: 'Risk Assessment',
				description: 'Automated risk scoring, credit analysis, and decision support',
				icon: <AlertCircle className="w-8 h-8 text-orange-600" />,
				stats: 'Coming Soon',
				color: 'orange',
				action: () => alert('Risk Assessment - Coming Soon'),
			},
			{
				id: 'compliance-monitoring',
				title: 'Compliance Monitoring',
				description: 'Real-time compliance checks, regulatory reporting, and audit trails',
				icon: <Clock className="w-8 h-8 text-red-600" />,
				stats: 'Coming Soon',
				color: 'red',
				action: () => alert('Compliance Monitoring - Coming Soon'),
			},
			{
				id: 'analytics-dashboard',
				title: 'Analytics & Reporting',
				description: 'Performance metrics, trend analysis, and business intelligence',
				icon: <Bot className="w-8 h-8 text-indigo-600" />,
				stats: 'Coming Soon',
				color: 'indigo',
				action: () => alert('Analytics Dashboard - Coming Soon'),
			},
		];

		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
				<div className="bg-white shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<Bot className="w-8 h-8 text-blue-600" />
									<h1 className="text-xl font-bold text-gray-900">Commercial Lending AI Platform</h1>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
									<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
										RJ
									</div>
									<span className="text-sm font-medium text-blue-900">Rachel Ji</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Commercial Lending AI</h2>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							Streamline your commercial lending operations with AI-powered automation, intelligent
							document processing, and real-time decision support across the entire loan lifecycle.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tiles.map((tile) => (
							<div
								key={tile.id}
								onClick={tile.action}
								className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-gray-300"
							>
								<div className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div className={`p-3 rounded-lg bg-${tile.color}-50`}>{tile.icon}</div>
										<div className="text-right">
											<div className="text-sm text-gray-500">Status</div>
											<div
												className={`text-sm font-medium ${tile.id === 'email-agent' ? 'text-green-600' : 'text-gray-400'}`}
											>
												{tile.id === 'email-agent' ? 'Active' : 'Coming Soon'}
											</div>
										</div>
									</div>

									<h3 className="text-lg font-semibold text-gray-900 mb-2">{tile.title}</h3>
									<p className="text-sm text-gray-600 mb-4">{tile.description}</p>

									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500">{tile.stats}</span>
										<ArrowUp className="w-4 h-4 text-gray-400 transform rotate-45" />
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-10 bg-white rounded-lg shadow-sm">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
						</div>
						<div className="p-6">
							<div className="space-y-4">
								<div className="flex items-center space-x-4">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm text-gray-900">
											Email request processed for TechCorp Industries
										</p>
										<p className="text-xs text-gray-500">2 minutes ago</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm text-gray-900">New loan modification request received</p>
										<p className="text-xs text-gray-500">15 minutes ago</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm text-gray-900">
											Document analysis completed for 3 loan applications
										</p>
										<p className="text-xs text-gray-500">1 hour ago</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const EmailDetails = () => (
		<div className="space-y-6">
			<div className="border-b pb-4">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">{selectedEmail?.subject}</h2>
					<div className="flex items-center space-x-3">
						<button
							onClick={simulateProcessing}
							disabled={agentStatus === 'processing'}
							className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
						>
							<Bot className="w-4 h-4" />
							<span>{agentStatus === 'processing' ? 'Processing...' : 'Process with AI'}</span>
						</button>
						<button
							onClick={() => setShowChat(true)}
							className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
						>
							<MessageSquare className="w-4 h-4" />
							<span>Chat with Documents</span>
						</button>
					</div>
				</div>
				<div className="flex items-center space-x-4 text-sm text-gray-600">
					<span>From: {selectedEmail?.from}</span>
					<span>Account: {selectedEmail?.loanAccount}</span>
					<span>{selectedEmail?.timestamp}</span>
				</div>
			</div>

			<div className="bg-gray-50 p-4 rounded-lg">
				<p className="text-gray-800">{selectedEmail?.preview}</p>
			</div>

			{agentStatus !== 'idle' && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h3 className="font-medium text-blue-900 mb-3 flex items-center">
						<Zap className="w-4 h-4 mr-2" />
						AI Agent Processing
					</h3>
					<div className="space-y-2">
						{processingSteps.map((step, index) => (
							<div key={index} className="flex items-center space-x-3">
								{index < processingStep ? (
									<CheckCircle className="w-4 h-4 text-green-500" />
								) : index === processingStep && agentStatus === 'processing' ? (
									<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
								) : (
									<div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
								)}
								<span
									className={`text-sm ${
										index < processingStep
											? 'text-green-700 font-medium'
											: index === processingStep && agentStatus === 'processing'
												? 'text-blue-700 font-medium'
												: 'text-gray-500'
									}`}
								>
									{step}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h3 className="font-medium text-gray-900 mb-3">Related Documents</h3>
					<div className="space-y-2">
						{getDocumentsForEmail(selectedEmail).map((doc) => (
							<div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex items-center space-x-3">
									<FileText className="w-4 h-4 text-gray-500" />
									<div>
										<p className="text-sm font-medium">{doc.name}</p>
										<p className="text-xs text-gray-500">{doc.type}</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<span
										className={`px-2 py-1 rounded-full text-xs ${
											doc.status === 'analyzed'
												? 'bg-green-100 text-green-800'
												: doc.status === 'reviewing'
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-gray-100 text-gray-800'
										}`}
									>
										{doc.status}
									</span>
									<button className="p-1 hover:bg-gray-100 rounded">
										<Eye className="w-4 h-4" />
									</button>
									<button className="p-1 hover:bg-gray-100 rounded">
										<Download className="w-4 h-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div>
					<h3 className="font-medium text-gray-900 mb-3">Loan Details</h3>
					<div className="bg-gray-50 p-4 rounded-lg space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">Loan Amount:</span>
							<span className="text-sm font-medium">$500,000</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">Current Balance:</span>
							<span className="text-sm font-medium">$487,250</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">Interest Rate:</span>
							<span className="text-sm font-medium">6.25%</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">Maturity Date:</span>
							<span className="text-sm font-medium">March 15, 2029</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">Prepayment Penalty:</span>
							<span className="text-sm font-medium">2% of remaining principal</span>
						</div>
					</div>
				</div>
			</div>

			{draftResponse && agentStatus === 'completed' && (
				<div className="mt-6">
					<h3 className="font-medium text-gray-900 mb-3">Draft Response</h3>
					<div className="border rounded-lg">
						<div className="p-4 bg-gray-50 border-b">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">AI-Generated Response</span>
								<div className="flex items-center space-x-2">
									{isEditing ? (
										<>
											<button
												onClick={cancelEdits}
												className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
											>
												Cancel
											</button>
											<button
												onClick={saveEdits}
												className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
											>
												Save
											</button>
										</>
									) : (
										<button
											onClick={startEditing}
											className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
										>
											Edit
										</button>
									)}
									<button
										onClick={sendEmail}
										disabled={isEditing}
										className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1 disabled:opacity-50"
									>
										<Send className="w-3 h-3" />
										<span>Send</span>
									</button>
								</div>
							</div>
						</div>
						<div className="p-4">
							{isEditing ? (
								<textarea
									value={editedResponse}
									onChange={(e) => setEditedResponse(e.target.value)}
									className="w-full h-96 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
									placeholder="Edit your response here..."
								/>
							) : (
								<pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
									{draftResponse}
								</pre>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);

	const EmailAgentPage = () => (
		<div className="min-h-screen bg-gray-50">
			{notification && (
				<div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
					<CheckCircle className="w-5 h-5" />
					<span>{notification.message}</span>
				</div>
			)}

			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => setCurrentPage('landing')}
								className="p-2 hover:bg-gray-100 rounded-lg"
							>
								<ArrowLeft className="w-5 h-5 text-gray-600" />
							</button>
							<div className="flex items-center space-x-2">
								<Bot className="w-8 h-8 text-blue-600" />
								<h1 className="text-xl font-bold text-gray-900">Email Request Processing</h1>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium text-green-900">Live Email Flow</span>
							</div>
							<button className="p-2 hover:bg-gray-100 rounded-lg">
								<Search className="w-5 h-5 text-gray-600" />
							</button>
							<button className="p-2 hover:bg-gray-100 rounded-lg">
								<Filter className="w-5 h-5 text-gray-600" />
							</button>
							<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
								<User className="w-4 h-4 text-white" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="space-y-6">
					<div className="bg-white rounded-lg shadow-sm">
						<div className="p-4 border-b">
							<h2 className="font-semibold text-gray-900 flex items-center">
								<Mail className="w-5 h-5 mr-2" />
								Email Requests
								<span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
									{emails.length}
								</span>
							</h2>
						</div>
						<div className="p-4">
							<EmailList
								emails={emails}
								selectedEmail={selectedEmail}
								setSelectedEmail={setSelectedEmail}
							/>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm">
						<div className="p-6">
							{selectedEmail ? (
								<EmailDetails />
							) : (
								<div className="text-center py-12">
									<MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										Select an email to get started
									</h3>
									<p className="text-gray-600">
										Choose an email from the list to review loan details and process requests
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{selectedEmail && (
				<DocumentChatInterface
					email={selectedEmail}
					documents={getDocumentsForEmail(selectedEmail)}
					isOpen={showChat}
					onClose={() => setShowChat(false)}
					isMinimized={isChatMinimized}
					onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
				/>
			)}

			{!showChat && selectedEmail && (
				<button
					onClick={() => setShowChat(true)}
					className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
				>
					<MessageSquare className="w-6 h-6" />
				</button>
			)}
		</div>
	);

	return <div>{currentPage === 'landing' ? <LandingPage /> : <EmailAgentPage />}</div>;
};

export default CommercialLendingAgent;
