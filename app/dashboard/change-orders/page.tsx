"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Clock, DollarSign, FileText, Plus, Eye, Edit } from 'lucide-react';
import { useState } from 'react';

const mockChangeOrders = [
  {
    id: 1,
    project: 'Riverside Apartments',
    title: 'Additional Foundation Reinforcement',
    description: 'Additional steel reinforcement required for the foundation due to soil conditions discovered during excavation.',
    type: 'Scope Change',
    status: 'Pending Approval',
    priority: 'High',
    requestedBy: 'John Smith (Foreman)',
    requestedDate: '2024-08-10',
    estimatedCost: 15000,
    estimatedTime: '3 days',
    impact: 'Foundation completion delayed by 3 days',
    documents: ['Soil Analysis Report', 'Engineering Review'],
    approvalRequired: ['Client', 'Structural Engineer']
  },
  {
    id: 2,
    project: 'Tech Innovation Hub',
    title: 'HVAC System Upgrade',
    description: 'Upgrade from standard HVAC to smart building system with IoT integration for better energy efficiency.',
    type: 'Upgrade',
    status: 'Approved',
    priority: 'Medium',
    requestedBy: 'David Brown (Project Manager)',
    requestedDate: '2024-04-15',
    estimatedCost: 45000,
    estimatedTime: '1 week',
    impact: 'Improved energy efficiency, 15% cost savings long-term',
    documents: ['Energy Analysis', 'Cost-Benefit Report'],
    approvalRequired: ['Client', 'Architect']
  },
  {
    id: 3,
    project: 'Sunset Plaza Retail Center',
    title: 'Parking Structure Modification',
    description: 'Modify parking structure design to accommodate additional retail space on ground level.',
    type: 'Design Change',
    status: 'Under Review',
    priority: 'Medium',
    requestedBy: 'Robert Lee (Site Manager)',
    requestedDate: '2024-09-05',
    estimatedCost: 25000,
    estimatedTime: '2 weeks',
    impact: 'Additional 2000 sq ft retail space, parking reduced by 15 spots',
    documents: ['Architectural Plans', 'Traffic Study'],
    approvalRequired: ['Client', 'City Planning']
  },
  {
    id: 4,
    project: 'Heritage Home Renovation',
    title: 'Historical Feature Restoration',
    description: 'Restore original stained glass windows instead of replacing with modern alternatives.',
    type: 'Restoration',
    status: 'Approved',
    priority: 'Low',
    requestedBy: 'Maria Garcia (Architect)',
    requestedDate: '2024-07-20',
    estimatedCost: 8000,
    estimatedTime: '1 week',
    impact: 'Preserves historical character, minimal schedule impact',
    documents: ['Historical Assessment', 'Restoration Quote'],
    approvalRequired: ['Client', 'Historical Society']
  }
];

const changeOrderTypes = ['All', 'Scope Change', 'Upgrade', 'Design Change', 'Restoration', 'Material Change'];
const statuses = ['All', 'Pending Approval', 'Under Review', 'Approved', 'Rejected', 'Completed'];
const priorities = ['All', 'High', 'Medium', 'Low'];

export default function ChangeOrdersPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChangeOrders = mockChangeOrders.filter(order => {
    const typeMatch = selectedType === 'All' || order.type === selectedType;
    const statusMatch = selectedStatus === 'All' || order.status === selectedStatus;
    const priorityMatch = selectedPriority === 'All' || order.priority === selectedPriority;
    const searchMatch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       order.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && statusMatch && priorityMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-900/40 text-emerald-400';
      case 'Pending Approval': return 'bg-yellow-900/40 text-yellow-400';
      case 'Under Review': return 'bg-blue-900/40 text-blue-400';
      case 'Rejected': return 'bg-red-900/40 text-red-400';
      case 'Completed': return 'bg-gray-900/40 text-gray-400';
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

  const totalPending = mockChangeOrders.filter(o => o.status === 'Pending Approval').length;
  const totalApproved = mockChangeOrders.filter(o => o.status === 'Approved').length;
  const totalCost = mockChangeOrders.filter(o => o.status === 'Approved').reduce((sum, o) => sum + o.estimatedCost, 0);

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Change Orders & Approvals</h1>
            <p className="text-muted-foreground">Manage project changes, modifications, and approval workflows</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Change Order
          </Button>
        </div>

        {/* Change Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockChangeOrders.length}</div>
                <div className="text-muted-foreground text-sm">Total Change Orders</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{totalPending}</div>
                <div className="text-muted-foreground text-sm">Pending Approval</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">{totalApproved}</div>
                <div className="text-muted-foreground text-sm">Approved</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">${totalCost.toLocaleString()}</div>
                <div className="text-muted-foreground text-sm">Total Approved Cost</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#141414] p-6 rounded-xl border border-border/40 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Search</label>
              <input
                type="text"
                placeholder="Search change orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {changeOrderTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
        </div>

        {/* Change Orders */}
        <div className="space-y-6">
          {filteredChangeOrders.map((order) => (
            <div key={order.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{order.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                      {getPriorityIcon(order.priority)}
                      {order.priority}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    Project: <span className="text-white">{order.project}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{order.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Cost: ${order.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Time: {order.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Type: {order.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Requested: {order.requestedDate}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Impact:</div>
                    <p className="text-white text-sm">{order.impact}</p>
                  </div>

                  {/* Documents */}
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Documents:</div>
                    <div className="flex flex-wrap gap-2">
                      {order.documents.map((doc, index) => (
                        <span key={index} className="px-2 py-1 bg-[#232323] rounded-full text-xs text-white">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Approval Required */}
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Approval Required:</div>
                    <div className="flex flex-wrap gap-2">
                      {order.approvalRequired.map((approver, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-900/40 rounded-full text-xs text-blue-400">
                          {approver}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Requested by: <span className="text-white">{order.requestedBy}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:ml-6">
                  <Button variant="outline" className="w-full lg:w-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {order.status === 'Pending Approval' && (
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto">
                      <Edit className="h-4 w-4 mr-2" />
                      Review & Approve
                    </Button>
                  )}
                  {order.status === 'Under Review' && (
                    <Button variant="outline" className="w-full lg:w-auto">
                      Update Status
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChangeOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No change orders found with the selected criteria.</div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Create Your First Change Order
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Plus className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Create Change Order</h3>
            <p className="text-muted-foreground mb-4">Submit a new change order for project modifications</p>
            <Button variant="outline" className="w-full">Create New</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Review Pending</h3>
            <p className="text-muted-foreground mb-4">Review and approve pending change orders</p>
            <Button variant="outline" className="w-full">Review Now</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Change Order History</h3>
            <p className="text-muted-foreground mb-4">View all approved and completed change orders</p>
            <Button variant="outline" className="w-full">View History</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 