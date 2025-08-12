"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Phone, Mail, Clock, CheckCircle, AlertTriangle, Send, Plus } from 'lucide-react';
import { useState } from 'react';

const mockConversations = [
  {
    id: 1,
    project: 'Riverside Apartments',
    subject: 'Foundation Inspection Schedule',
    lastMessage: 'Hi, when is the next foundation inspection scheduled? We need to coordinate with the city inspector.',
    lastMessageTime: '2024-08-12 14:30',
    status: 'Active',
    priority: 'Medium',
    participants: ['John Smith (Foreman)', 'Sarah Wilson (Client)', 'Mike Johnson (Inspector)'],
    unreadCount: 2,
    lastSender: 'Mike Johnson'
  },
  {
    id: 2,
    project: 'Tech Innovation Hub',
    subject: 'Material Delivery Confirmation',
    lastMessage: 'The steel beams have been delivered and are ready for installation. Please confirm receipt.',
    lastMessageTime: '2024-08-11 09:15',
    status: 'Resolved',
    priority: 'Low',
    participants: ['David Brown (Project Manager)', 'Lisa Chen (Supplier)', 'James Wilson (Site Supervisor)'],
    unreadCount: 0,
    lastSender: 'David Brown'
  },
  {
    id: 3,
    project: 'Sunset Plaza Retail Center',
    subject: 'Permit Application Status',
    lastMessage: 'We\'re still waiting for the final soil test results. This is holding up our permit application.',
    lastMessageTime: '2024-08-10 16:45',
    status: 'Pending',
    priority: 'High',
    participants: ['Robert Lee (Site Manager)', 'Jennifer Park (Permit Specialist)', 'Carlos Rodriguez (Surveyor)'],
    unreadCount: 1,
    lastSender: 'Jennifer Park'
  },
  {
    id: 4,
    project: 'Heritage Home Renovation',
    subject: 'Historical Preservation Requirements',
    lastMessage: 'The historical society has approved our renovation plans with minor modifications.',
    lastMessageTime: '2024-08-09 11:20',
    status: 'Resolved',
    priority: 'Medium',
    participants: ['Maria Garcia (Architect)', 'Alex Thompson (Historical Consultant)', 'Tom Davis (Contractor)'],
    unreadCount: 0,
    lastSender: 'Maria Garcia'
  }
];

const mockSupportTickets = [
  {
    id: 1,
    title: 'Payment Processing Issue',
    description: 'Unable to process payment for invoice INV-2024-003. Getting an error message.',
    status: 'Open',
    priority: 'High',
    category: 'Payment',
    createdAt: '2024-08-12 10:30',
    lastUpdated: '2024-08-12 15:45',
    assignedTo: 'Support Team'
  },
  {
    id: 2,
    title: 'Document Upload Problem',
    description: 'Can\'t upload new project photos. File size seems to be the issue.',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Technical',
    createdAt: '2024-08-11 14:20',
    lastUpdated: '2024-08-12 09:15',
    assignedTo: 'IT Support'
  },
  {
    id: 3,
    title: 'Project Status Update Request',
    description: 'Need weekly status updates for the Riverside Apartments project.',
    status: 'Resolved',
    priority: 'Low',
    category: 'Information',
    createdAt: '2024-08-08 16:00',
    lastUpdated: '2024-08-10 11:30',
    assignedTo: 'Project Manager'
  }
];

export default function CommunicationPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockConversations.filter(conv => {
    const statusMatch = selectedStatus === 'all' || conv.status === selectedStatus;
    const priorityMatch = selectedPriority === 'all' || conv.priority === selectedPriority;
    const searchMatch = conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       conv.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-900/40 text-blue-400';
      case 'Resolved': return 'bg-emerald-900/40 text-emerald-400';
      case 'Pending': return 'bg-yellow-900/40 text-yellow-400';
      case 'Closed': return 'bg-gray-900/40 text-gray-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-900/40 text-red-400';
      case 'Medium': return 'bg-yellow-900/40 text-yellow-400';
      case 'Low': return 'bg-emerald-900/40 text-emerald-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Medium': return <Clock className="h-4 w-4" />;
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Communication & Support</h1>
            <p className="text-muted-foreground">Stay connected with your project team and get support when you need it</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Support Ticket
            </Button>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Phone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
            <p className="text-muted-foreground mb-4">Speak directly with our team</p>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = 'tel:+15551234567'}>
              Call Now
            </Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Mail className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
            <p className="text-muted-foreground mb-4">Send us a detailed message</p>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = 'mailto:support@construction.com'}>
              Send Email
            </Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <MessageSquare className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
            <p className="text-muted-foreground mb-4">Chat with support in real-time</p>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </div>
        </div>

        {/* Communication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockConversations.length}</div>
                <div className="text-muted-foreground text-sm">Total Conversations</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockConversations.filter(c => c.status === 'Active').length}
                </div>
                <div className="text-muted-foreground text-sm">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockConversations.filter(c => c.status === 'Resolved').length}
                </div>
                <div className="text-muted-foreground text-sm">Resolved</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockConversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                </div>
                <div className="text-muted-foreground text-sm">Unread Messages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#141414] p-6 rounded-xl border border-border/40 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Search</label>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        </div>

        {/* Conversations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Project Conversations</h2>
          <div className="space-y-4">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white">{conv.subject}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conv.status)}`}>
                        {conv.status}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(conv.priority)}`}>
                        {getPriorityIcon(conv.priority)}
                        {conv.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      Project: <span className="text-white">{conv.project}</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{conv.lastMessage}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{conv.lastMessageTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Last: {conv.lastSender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{conv.participants.length} participants</span>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-blue-400">{conv.unreadCount} unread</span>
                        </div>
                      )}
                    </div>

                    {/* Participants */}
                    <div className="flex flex-wrap gap-2">
                      {conv.participants.map((participant, index) => (
                        <span key={index} className="px-2 py-1 bg-[#232323] rounded-full text-xs text-white">
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:ml-6">
                    <Button variant="outline" className="w-full lg:w-auto">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" className="w-full lg:w-auto">
                      View History
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Support Tickets</h2>
          <div className="space-y-4">
            {mockSupportTickets.map((ticket) => (
              <div key={ticket.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white">{ticket.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityIcon(ticket.priority)}
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{ticket.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Created: {ticket.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Updated: {ticket.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Category: {ticket.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Assigned: {ticket.assignedTo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:ml-6">
                    <Button variant="outline" className="w-full lg:w-auto">
                      View Details
                    </Button>
                    {ticket.status === 'Open' && (
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto">
                        Update Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No conversations found with the selected criteria.</div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Start New Conversation
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 