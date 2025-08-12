"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, CheckCircle, AlertTriangle, Clock, DollarSign, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

const mockProjects = [
  {
    id: 1,
    name: 'Riverside Apartments',
    status: 'In Progress',
    progress: 65,
    dueDate: '2024-09-15',
    budget: '$450,000',
    location: 'Downtown Riverside',
    description: 'Modern 3-story apartment complex with 24 units, featuring contemporary design and sustainable building practices.',
    paymentStatus: 'Partial Payment',
    lastUpdate: '2024-08-10'
  },
  {
    id: 2,
    name: 'Tech Innovation Hub',
    status: 'Completed',
    progress: 100,
    dueDate: '2024-05-01',
    budget: '$1,200,000',
    location: 'Business District',
    description: 'State-of-the-art office building with smart technology integration, green roof, and modern amenities.',
    paymentStatus: 'Fully Paid',
    lastUpdate: '2024-05-01'
  },
  {
    id: 3,
    name: 'Sunset Plaza Retail Center',
    status: 'Planning',
    progress: 15,
    dueDate: '2025-03-20',
    budget: '$800,000',
    location: 'Suburban Area',
    description: 'Mixed-use retail and office complex with parking garage and outdoor plaza.',
    paymentStatus: 'Deposit Paid',
    lastUpdate: '2024-08-05'
  },
  {
    id: 4,
    name: 'Heritage Home Renovation',
    status: 'On Hold',
    progress: 30,
    dueDate: '2024-12-01',
    budget: '$350,000',
    location: 'Historic District',
    description: 'Complete restoration of a 1920s heritage home, including structural repairs and period-accurate finishes.',
    paymentStatus: 'Payment Pending',
    lastUpdate: '2024-07-20'
  }
];

export default function ProjectsOverview() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredProjects = selectedStatus === 'all' 
    ? mockProjects 
    : mockProjects.filter(project => project.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-900/40 text-emerald-400';
      case 'In Progress': return 'bg-blue-900/40 text-blue-400';
      case 'Planning': return 'bg-yellow-900/40 text-yellow-400';
      case 'On Hold': return 'bg-red-900/40 text-red-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Planning': return <Briefcase className="h-4 w-4" />;
      case 'On Hold': return <AlertTriangle className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Project Overview</h1>
            <p className="text-muted-foreground">Track the progress of all your construction projects</p>
          </div>
          <Link href="/quote">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Start New Project
            </Button>
          </Link>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockProjects.length}</div>
                <div className="text-muted-foreground text-sm">Total Projects</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockProjects.filter(p => p.status === 'In Progress').length}
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
                  {mockProjects.filter(p => p.status === 'Completed').length}
                </div>
                <div className="text-muted-foreground text-sm">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">$2.8M</div>
                <div className="text-muted-foreground text-sm">Total Value</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'In Progress', 'Planning', 'Completed', 'On Hold'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#232323] text-muted-foreground hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Projects' : status}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Due: {project.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Updated: {project.lastUpdate}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#232323] rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Payment Status: <span className="text-white">{project.paymentStatus}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:ml-6">
                  <Button variant="outline" className="w-full lg:w-auto">
                    View Details
                  </Button>
                  {project.status === 'In Progress' && (
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto">
                      View Progress
                    </Button>
                  )}
                  {project.status === 'Completed' && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 w-full lg:w-auto">
                      View Photos
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No projects found with the selected status.</div>
            <Link href="/quote">
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                Start Your First Project
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 