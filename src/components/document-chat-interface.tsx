import { Bot, FileText, Maximize2,MessageSquare, Minimize2, Send, User, X } from 'lucide-react';
import React, { useEffect,useRef, useState } from 'react';

interface Document {
	id: number;
	name: string;
	type: string;
	status: string;
}

interface ChatMessage {
	id: number;
	type: 'user' | 'bot';
	message: string;
	timestamp: string;
	relatedDocuments?: string[];
}

interface Email {
	id: number;
	from: string;
	subject: string;
	loanAccount: string;
	requestType: string;
}

interface DocumentChatInterfaceProps {
	email: Email;
	documents: Document[];
	isOpen: boolean;
	onClose: () => void;
	isMinimized: boolean;
	onToggleMinimize: () => void;
}

const DocumentChatInterface: React.FC<DocumentChatInterfaceProps> = ({
	email,
	documents,
	isOpen,
	onClose,
	isMinimized,
	onToggleMinimize,
}) => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (isOpen && messages.length === 0) {
			// Initialize with welcome message
			const welcomeMessage: ChatMessage = {
				id: 1,
				type: 'bot',
				message: `Hello! I'm here to help you with questions about ${email.from}'s loan request (Account: ${email.loanAccount}). I have access to all relevant documents and can provide detailed information about loan terms, payment schedules, and more. What would you like to know?`,
				timestamp: new Date().toLocaleTimeString(),
				relatedDocuments: documents.map((doc) => doc.name),
			};
			setMessages([welcomeMessage]);
		}
	}, [isOpen, email, documents]);

	const quickQuestions = [
		"What's the current loan balance?",
		'Show me the payment terms',
		'What are the prepayment penalties?',
		'When is the loan maturity date?',
		'What documents are available?',
	];

	const generateBotResponse = (userMessage: string): ChatMessage => {
		const lowerMessage = userMessage.toLowerCase();
		let response = '';
		let relatedDocs: string[] = [];

		if (lowerMessage.includes('balance') || lowerMessage.includes('amount')) {
			response = `Based on the loan agreement and payment schedule, here are the current balance details for account ${email.loanAccount}:

**Current Principal Balance:** $487,250.00
**Accrued Interest:** $2,180.45
**Total Outstanding:** $489,430.45

This information is sourced from the latest payment schedule and loan agreement documents.`;
			relatedDocs = ['Loan Agreement', 'Payment Schedule'];
		} else if (lowerMessage.includes('payment') || lowerMessage.includes('term')) {
			response = `Here are the payment terms for account ${email.loanAccount}:

**Monthly Payment:** $12,000.00
**Payment Due Date:** 15th of each month
**Interest Rate:** 6.25% (Fixed)
**Remaining Term:** 42 months
**Next Payment Due:** July 15, 2024

The payment terms are outlined in Section 3 of the loan agreement.`;
			relatedDocs = ['Loan Agreement', 'Payment Schedule'];
		} else if (lowerMessage.includes('prepayment') || lowerMessage.includes('penalty')) {
			response = `Prepayment penalty information for account ${email.loanAccount}:

**Prepayment Penalty:** 2% of remaining principal balance
**Current Penalty Amount:** $9,745.00
**Penalty Period:** Applies for the first 5 years of the loan
**Penalty Expiration:** March 15, 2026

This is detailed in Section 4.3 of the loan agreement.`;
			relatedDocs = ['Loan Agreement'];
		} else if (lowerMessage.includes('maturity') || lowerMessage.includes('end date')) {
			response = `Loan maturity information for account ${email.loanAccount}:

**Original Loan Date:** March 15, 2019
**Loan Term:** 10 years
**Maturity Date:** March 15, 2029
**Remaining Time:** 4 years, 8 months

The maturity date and terms are specified in the loan agreement.`;
			relatedDocs = ['Loan Agreement'];
		} else if (lowerMessage.includes('document') || lowerMessage.includes('file')) {
			response = `Available documents for account ${email.loanAccount}:

${documents.map((doc) => `• **${doc.name}** (${doc.type}) - Status: ${doc.status}`).join('\n')}

All documents have been analyzed and are available for reference. Would you like me to provide specific information from any of these documents?`;
			relatedDocs = documents.map((doc) => doc.name);
		} else if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
			response = `Credit information for ${email.from}:

**Current Credit Score:** 742 (Excellent)
**Credit Report Date:** June 2024
**Payment History:** Excellent (100% on-time payments)
**Debt-to-Income Ratio:** 28%
**Credit Utilization:** 15%

This information is from the latest credit report on file.`;
			relatedDocs = ['Credit Report'];
		} else {
			response = `I understand you're asking about "${userMessage}". Let me search through the available documents for ${email.loanAccount}...

Based on the loan documentation, I can help you with information about:
• Loan balances and payment details
• Interest rates and terms
• Prepayment penalties and options
• Credit information and financial statements
• Modification or extension requests

Could you please be more specific about what information you need?`;
			relatedDocs = documents.map((doc) => doc.name);
		}

		return {
			id: Date.now(),
			type: 'bot',
			message: response,
			timestamp: new Date().toLocaleTimeString(),
			relatedDocuments: relatedDocs,
		};
	};

	const handleSendMessage = () => {
		if (!inputMessage.trim()) return;

		const userMessage: ChatMessage = {
			id: Date.now(),
			type: 'user',
			message: inputMessage,
			timestamp: new Date().toLocaleTimeString(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputMessage('');
		setIsTyping(true);

		// Simulate bot response delay
		setTimeout(() => {
			const botResponse = generateBotResponse(inputMessage);
			setMessages((prev) => [...prev, botResponse]);
			setIsTyping(false);
		}, 1500);
	};

	const handleQuickQuestion = (question: string) => {
		setInputMessage(question);
		setTimeout(() => handleSendMessage(), 100);
	};

	if (!isOpen) return null;

	return (
		<div
			className={`fixed right-4 bottom-4 bg-white border border-gray-300 rounded-lg shadow-xl transition-all duration-300 flex flex-col ${
				isMinimized ? 'w-[352px] h-16' : 'w-[484px] h-[600px]'
			}`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b bg-blue-50 rounded-t-lg flex-shrink-0">
				<div className="flex items-center space-x-2">
					<MessageSquare className="w-5 h-5 text-blue-600" />
					<div>
						<h3 className="font-semibold text-gray-900 text-sm">Document Q&A</h3>
						{!isMinimized && <p className="text-xs text-gray-600">{email.loanAccount}</p>}
					</div>
				</div>
				<div className="flex items-center space-x-1">
					<button onClick={onToggleMinimize} className="p-1 hover:bg-gray-200 rounded">
						{isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
					</button>
					<button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>

			{!isMinimized && (
				<>
					{/* Messages */}
					<div className="flex-1 p-4 overflow-y-auto">
						<div className="space-y-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
								>
									<div
										className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
											message.type === 'user'
												? 'bg-blue-600 text-white'
												: 'bg-gray-100 text-gray-900'
										}`}
									>
										<div className="flex items-center space-x-2 mb-1">
											{message.type === 'bot' ? (
												<Bot className="w-4 h-4" />
											) : (
												<User className="w-4 h-4" />
											)}
											<span className="text-xs opacity-75">{message.timestamp}</span>
										</div>
										<p className="text-sm whitespace-pre-line">{message.message}</p>
										{message.relatedDocuments && message.relatedDocuments.length > 0 && (
											<div className="mt-2 pt-2 border-t border-gray-200">
												<p className="text-xs opacity-75 mb-1">Referenced documents:</p>
												<div className="flex flex-wrap gap-1">
													{message.relatedDocuments.map((doc, index) => (
														<span
															key={index}
															className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
														>
															<FileText className="w-3 h-3 mr-1" />
															{doc}
														</span>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							))}

							{isTyping && (
								<div className="flex justify-start">
									<div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
										<div className="flex items-center space-x-2">
											<Bot className="w-4 h-4" />
											<div className="flex space-x-1">
												<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
												<div
													className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
													style={{ animationDelay: '0.1s' }}
												></div>
												<div
													className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
													style={{ animationDelay: '0.2s' }}
												></div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
						<div ref={messagesEndRef} />
					</div>

					{/* Quick Questions */}
					{messages.length <= 1 && (
						<div className="px-4 py-2 border-t bg-gray-50 flex-shrink-0">
							<p className="text-xs text-gray-600 mb-2">Quick questions:</p>
							<div className="flex flex-wrap gap-1">
								{quickQuestions.map((question, index) => (
									<button
										key={index}
										onClick={() => handleQuickQuestion(question)}
										className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
									>
										{question}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Input */}
					<div className="p-4 border-t flex-shrink-0 rounded-b-lg">
						<div className="flex space-x-2">
							<input
								type="text"
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
								placeholder="Ask about loan details, documents, or terms..."
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
							/>
							<button
								onClick={handleSendMessage}
								disabled={!inputMessage.trim() || isTyping}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Send className="w-4 h-4" />
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DocumentChatInterface;
