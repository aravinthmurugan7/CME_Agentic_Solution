export interface Email {
	id: number;
	from: string;
	subject: string;
	timestamp: string;
	priority: string;
	status: string;
	loanAccount: string;
	requestType: string;
	preview: string;
	isNew: boolean;
}

export const mockEmails: Email[] = [
	{
		id: 1,
		from: 'john.smith@techcorp.com',
		subject: 'Request for Early Loan Payoff - Account #LC-2024-0158',
		timestamp: '2 hours ago',
		priority: 'high',
		status: 'pending',
		loanAccount: 'LC-2024-0158',
		requestType: 'early_payoff',
		preview:
			'Hi, I would like to discuss paying off my commercial loan early. Could you please provide me with the payoff amount and any prepayment penalties?',
		isNew: false,
	},
	{
		id: 2,
		from: 'sarah.jones@retailplus.com',
		subject: 'Loan Modification Request - Account #LC-2023-0892',
		timestamp: '4 hours ago',
		priority: 'high',
		status: 'completed',
		loanAccount: 'LC-2023-0892',
		requestType: 'modification',
		preview:
			'We are requesting a modification to our loan terms due to changes in our business cash flow. Please review our request.',
		isNew: false,
	},
	{
		id: 3,
		from: 'mike.williams@constructco.com',
		subject: 'Payment Extension Request - Account #LC-2024-0245',
		timestamp: '1 day ago',
		priority: 'low',
		status: 'completed',
		loanAccount: 'LC-2024-0245',
		requestType: 'extension',
		preview:
			'Due to unexpected project delays, we are requesting a 30-day payment extension on our next installment.',
		isNew: false,
	},
];
