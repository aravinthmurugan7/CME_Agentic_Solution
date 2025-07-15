import { AlertCircle, CheckCircle, Clock, FileText, Mail, Zap } from 'lucide-react';
import React, { useEffect,useState } from 'react';

interface Email {
  id: number;
  from: string;
  subject: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status: 'incoming' | 'analyzing' | 'drafting_response' | 'pending_review' | 'completed' | 'pending' | 'processing';
  loanAccount: string;
  requestType: string;
  preview: string;
}

interface EmailFlowStreamProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  selectedEmailId?: number;
}

const EmailFlowStream: React.FC<EmailFlowStreamProps> = ({ emails, onEmailSelect, selectedEmailId }) => {
  const [animatingEmails, setAnimatingEmails] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Animate new emails when they appear
    const newEmails = emails.filter(email => email.status === 'incoming');
    if (newEmails.length > 0) {
      const newIds = new Set(newEmails.map(email => email.id));
      setAnimatingEmails(newIds);
      
      // Remove animation after 1 second
      setTimeout(() => {
        setAnimatingEmails(new Set());
      }, 1000);
    }
  }, [emails]);

  const getStatusIcon = (status: Email['status']) => {
    switch (status) {
      case 'incoming':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'analyzing':
        return <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />;
      case 'drafting_response':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'pending_review':
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Email['status']) => {
    switch (status) {
      case 'incoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'drafting_response':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending_review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Email['status']) => {
    switch (status) {
      case 'incoming':
        return 'Incoming';
      case 'analyzing':
        return 'Analyzing';
      case 'drafting_response':
        return 'Drafting Response';
      case 'pending_review':
        return 'Pending Review';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getPriorityColor = (priority: Email['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Live Email Stream
        </h3>
        <div className="text-sm text-gray-500">
          {emails.filter(e => e.status !== 'completed').length} active requests
        </div>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {emails.map(email => (
          <div
            key={email.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
              selectedEmailId === email.id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            } ${
              animatingEmails.has(email.id) 
                ? 'animate-pulse border-blue-400 bg-blue-50' 
                : ''
            }`}
            onClick={() => onEmailSelect(email)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(email.priority)}`}></div>
                <span className="font-medium text-gray-900 text-sm">{email.from}</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(email.status)}
                <span className="text-xs text-gray-500">{email.timestamp}</span>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">{email.subject}</h4>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{email.preview}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>Account: {email.loanAccount}</span>
                <span>Type: {email.requestType.replace('_', ' ')}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(email.status)}`}>
                {getStatusText(email.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {emails.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No email requests yet</p>
        </div>
      )}
    </div>
  );
};

export default EmailFlowStream;
