"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Download, Eye, Calendar, TrendingUp, DollarSign, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

const mockReports = [
  {
    id: 1,
    title: 'Monthly Project Progress Report',
    type: 'Progress',
    project: 'Riverside Apartments',
    generatedDate: '2024-08-01',
    period: 'July 2024',
    status: 'Available',
    description: 'Comprehensive monthly progress report including milestones, delays, and budget status.',
    fileSize: '2.8 MB',
    format: 'PDF',
    sections: ['Progress Summary', 'Budget Analysis', 'Timeline Updates', 'Risk Assessment'],
    generatedBy: 'Project Manager'
  },
  {
    id: 2,
    title: 'Quarterly Financial Summary',
    type: 'Financial',
    project: 'All Projects',
    generatedDate: '2024-07-01',
    period: 'Q2 2024',
    status: 'Available',
    description: 'Quarterly financial overview including costs, payments, and budget variances across all projects.',
    fileSize: '1.5 MB',
    format: 'Excel',
    sections: ['Revenue Summary', 'Cost Analysis', 'Payment Status', 'Budget Variances'],
    generatedBy: 'Finance Team'
  },
  {
    id: 3,
    title: 'Safety Inspection Report',
    type: 'Safety',
    project: 'Tech Innovation Hub',
    generatedDate: '2024-08-10',
    period: 'August 2024',
    status: 'Available',
    description: 'Monthly safety inspection report documenting compliance, incidents, and recommendations.',
    fileSize: '3.2 MB',
    format: 'PDF',
    sections: ['Safety Compliance', 'Incident Report', 'Recommendations', 'Action Items'],
    generatedBy: 'Safety Officer'
  },
  {
    id: 4,
    title: 'Quality Control Assessment',
    type: 'Quality',
    project: 'Sunset Plaza Retail Center',
    generatedDate: '2024-08-05',
    period: 'August 2024',
    status: 'In Progress',
    description: 'Quality control assessment for foundation and structural work completed this month.',
    fileSize: '4.1 MB',
    format: 'PDF',
    sections: ['Quality Metrics', 'Defect Analysis', 'Corrective Actions', 'Standards Compliance'],
    generatedBy: 'Quality Manager'
  },
  {
    id: 5,
    title: 'Environmental Impact Report',
    type: 'Environmental',
    project: 'Heritage Home Renovation',
    generatedDate: '2024-07-25',
    period: 'July 2024',
    status: 'Available',
    description: 'Environmental impact assessment for historical preservation work and material disposal.',
    fileSize: '2.1 MB',
    format: 'PDF',
    sections: ['Environmental Impact', 'Material Disposal', 'Compliance Status', 'Recommendations'],
    generatedBy: 'Environmental Consultant'
  },
  {
    id: 6,
    title: 'Weekly Site Progress Update',
    type: 'Progress',
    project: 'Riverside Apartments',
    generatedDate: '2024-08-12',
    period: 'Week 32',
    status: 'Scheduled',
    description: 'Weekly progress update including daily activities, manpower, and equipment utilization.',
    fileSize: 'N/A',
    format: 'PDF',
    sections: ['Daily Activities', 'Manpower Report', 'Equipment Status', 'Next Week Plan'],
    generatedBy: 'Site Supervisor'
  }
];

const reportTypes = ['All', 'Progress', 'Financial', 'Safety', 'Quality', 'Environmental', 'Schedule'];
const statuses = ['All', 'Available', 'In Progress', 'Scheduled', 'Archived'];
const projects = ['All', 'Riverside Apartments', 'Tech Innovation Hub', 'Sunset Plaza Retail Center', 'Heritage Home Renovation'];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = mockReports.filter(report => {
    const typeMatch = selectedType === 'All' || report.type === selectedType;
    const statusMatch = selectedStatus === 'All' || report.status === selectedStatus;
    const projectMatch = selectedProject === 'All' || report.project === selectedProject;
    const searchMatch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && statusMatch && projectMatch && searchMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Progress': return <TrendingUp className="h-5 w-5 text-blue-400" />;
      case 'Financial': return <DollarSign className="h-5 w-5 text-emerald-400" />;
      case 'Safety': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'Quality': return <CheckCircle className="h-5 w-5 text-purple-400" />;
      case 'Environmental': return <Leaf className="h-5 w-5 text-green-400" />;
      case 'Schedule': return <Calendar className="h-5 w-5 text-yellow-400" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Progress': return 'bg-blue-900/40 text-blue-400';
      case 'Financial': return 'bg-emerald-900/40 text-emerald-400';
      case 'Safety': return 'bg-red-900/40 text-red-400';
      case 'Quality': return 'bg-purple-900/40 text-purple-400';
      case 'Environmental': return 'bg-green-900/40 text-green-400';
      case 'Schedule': return 'bg-yellow-900/40 text-yellow-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-900/40 text-emerald-400';
      case 'In Progress': return 'bg-yellow-900/40 text-yellow-400';
      case 'Scheduled': return 'bg-blue-900/40 text-blue-400';
      case 'Archived': return 'bg-gray-900/40 text-gray-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const totalReports = mockReports.length;
  const availableReports = mockReports.filter(r => r.status === 'Available').length;
  const scheduledReports = mockReports.filter(r => r.status === 'Scheduled').length;

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">Access comprehensive project reports, analytics, and insights</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Report Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{totalReports}</div>
                <div className="text-muted-foreground text-sm">Total Reports</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">{availableReports}</div>
                <div className="text-muted-foreground text-sm">Available</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{scheduledReports}</div>
                <div className="text-muted-foreground text-sm">Scheduled</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-muted-foreground text-sm">Report Types</div>
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
                placeholder="Search reports..."
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
                {reportTypes.map(type => (
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
              <label className="block text-sm font-medium text-muted-foreground mb-2">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Custom Report
              </Button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getTypeIcon(report.type)}
                    <h3 className="text-xl font-bold text-white">{report.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    Project: <span className="text-white">{report.project}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Generated: {report.generatedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Period: {report.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Format: {report.format}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Size: {report.fileSize}</span>
                    </div>
                  </div>

                  {/* Report Sections */}
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Report Sections:</div>
                    <div className="flex flex-wrap gap-2">
                      {report.sections.map((section, index) => (
                        <span key={index} className="px-2 py-1 bg-[#232323] rounded-full text-xs text-muted-foreground">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Generated by: <span className="text-white">{report.generatedBy}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:ml-6">
                  {report.status === 'Available' ? (
                    <>
                      <Button variant="outline" className="w-full lg:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button variant="outline" className="w-full lg:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </>
                  ) : report.status === 'In Progress' ? (
                    <Button variant="outline" className="w-full lg:w-auto">
                      <Clock className="h-4 w-4 mr-2" />
                      In Progress
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full lg:w-auto">
                      <Calendar className="h-4 w-4 mr-2" />
                      Scheduled
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No reports found with the selected criteria.</div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Generate Your First Report
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Generate Report</h3>
            <p className="text-muted-foreground mb-4">Create custom reports with specific criteria and data</p>
            <Button variant="outline" className="w-full">Generate Now</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Calendar className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Schedule Reports</h3>
            <p className="text-muted-foreground mb-4">Set up automated report generation on a schedule</p>
            <Button variant="outline" className="w-full">Schedule</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Download className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Bulk Download</h3>
            <p className="text-muted-foreground mb-4">Download multiple reports as a zip file</p>
            <Button variant="outline" className="w-full">Download All</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Missing icon component
const Leaf = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
  </svg>
);

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
); 