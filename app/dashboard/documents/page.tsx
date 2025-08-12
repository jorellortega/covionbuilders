"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Download, Eye, Search, Filter, Calendar, Folder, File } from 'lucide-react';
import { useState } from 'react';

const mockDocuments = [
  {
    id: 1,
    name: 'Riverside Apartments - Building Permit',
    type: 'Permit',
    project: 'Riverside Apartments',
    category: 'Legal',
    uploadDate: '2024-06-01',
    size: '2.4 MB',
    status: 'Active',
    description: 'Official building permit issued by the city for the Riverside Apartments project.',
    fileUrl: '#',
    tags: ['permit', 'legal', 'approved']
  },
  {
    id: 2,
    name: 'Tech Innovation Hub - Architectural Plans',
    type: 'Drawing',
    project: 'Tech Innovation Hub',
    category: 'Design',
    uploadDate: '2024-03-15',
    size: '15.7 MB',
    status: 'Active',
    description: 'Complete architectural blueprints and design specifications for the Tech Innovation Hub.',
    fileUrl: '#',
    tags: ['blueprint', 'design', 'architectural']
  },
  {
    id: 3,
    name: 'Sunset Plaza - Soil Test Report',
    type: 'Report',
    project: 'Sunset Plaza Retail Center',
    category: 'Engineering',
    uploadDate: '2024-09-20',
    size: '8.2 MB',
    status: 'Active',
    description: 'Comprehensive soil testing and analysis report for the Sunset Plaza construction site.',
    fileUrl: '#',
    tags: ['soil', 'testing', 'engineering']
  },
  {
    id: 4,
    name: 'Heritage Home - Historical Survey',
    type: 'Report',
    project: 'Heritage Home Renovation',
    category: 'Research',
    uploadDate: '2024-07-10',
    size: '3.1 MB',
    status: 'Active',
    description: 'Historical survey and documentation of the heritage home before renovation work.',
    fileUrl: '#',
    tags: ['historical', 'survey', 'heritage']
  },
  {
    id: 5,
    name: 'Riverside Apartments - Contract Agreement',
    type: 'Contract',
    project: 'Riverside Apartments',
    category: 'Legal',
    uploadDate: '2024-05-20',
    size: '1.8 MB',
    status: 'Active',
    description: 'Signed contract agreement between client and construction company.',
    fileUrl: '#',
    tags: ['contract', 'legal', 'signed']
  },
  {
    id: 6,
    name: 'Tech Innovation Hub - Safety Inspection',
    type: 'Report',
    project: 'Tech Innovation Hub',
    category: 'Safety',
    uploadDate: '2024-04-15',
    size: '4.5 MB',
    status: 'Archived',
    description: 'Safety inspection report completed during the construction phase.',
    fileUrl: '#',
    tags: ['safety', 'inspection', 'completed']
  }
];

const documentTypes = ['All', 'Permit', 'Drawing', 'Report', 'Contract', 'Invoice', 'Photo'];
const categories = ['All', 'Legal', 'Design', 'Engineering', 'Research', 'Safety', 'Financial'];
const projects = ['All', 'Riverside Apartments', 'Tech Innovation Hub', 'Sunset Plaza Retail Center', 'Heritage Home Renovation'];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'All' || doc.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesProject = selectedProject === 'All' || doc.project === selectedProject;
    
    return matchesSearch && matchesType && matchesCategory && matchesProject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Permit': return <FileText className="h-5 w-5 text-blue-400" />;
      case 'Drawing': return <FileText className="h-5 w-5 text-green-400" />;
      case 'Report': return <FileText className="h-5 w-5 text-yellow-400" />;
      case 'Contract': return <FileText className="h-5 w-5 text-purple-400" />;
      case 'Invoice': return <FileText className="h-5 w-5 text-emerald-400" />;
      case 'Photo': return <FileText className="h-5 w-5 text-red-400" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Permit': return 'bg-blue-900/40 text-blue-400';
      case 'Drawing': return 'bg-green-900/40 text-green-400';
      case 'Report': return 'bg-yellow-900/40 text-yellow-400';
      case 'Contract': return 'bg-purple-900/40 text-purple-400';
      case 'Invoice': return 'bg-emerald-900/40 text-emerald-400';
      case 'Photo': return 'bg-red-900/40 text-red-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Documents</h1>
            <p className="text-muted-foreground">Access and manage all your project documents, permits, and files</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
            Upload Document
          </Button>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockDocuments.length}</div>
                <div className="text-muted-foreground text-sm">Total Documents</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Folder className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockDocuments.filter(d => d.status === 'Active').length}
                </div>
                <div className="text-muted-foreground text-sm">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockDocuments.filter(d => d.type === 'Report').length}
                </div>
                <div className="text-muted-foreground text-sm">Reports</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockDocuments.filter(d => new Date(d.uploadDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-muted-foreground text-sm">This Month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#141414] p-6 rounded-xl border border-border/40 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Document Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    {getTypeIcon(doc.type)}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{doc.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                          {doc.type}
                        </span>
                        <span className="text-sm text-muted-foreground">{doc.category}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{doc.project}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{doc.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Uploaded: {doc.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Size: {doc.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Status: {doc.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">ID: {doc.id}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {doc.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-[#232323] rounded-full text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:ml-6">
                  <Button variant="outline" className="w-full lg:w-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" className="w-full lg:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No documents found with the selected criteria.</div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Upload Your First Document
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Upload Documents</h3>
            <p className="text-muted-foreground mb-4">Upload new project documents, permits, or reports</p>
            <Button variant="outline" className="w-full">Upload Now</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Download className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Bulk Download</h3>
            <p className="text-muted-foreground mb-4">Download multiple documents as a zip file</p>
            <Button variant="outline" className="w-full">Download All</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Search className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Advanced Search</h3>
            <p className="text-muted-foreground mb-4">Use advanced filters to find specific documents</p>
            <Button variant="outline" className="w-full">Search</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 