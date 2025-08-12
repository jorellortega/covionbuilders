"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, CheckCircle, Clock, AlertTriangle, MapPin, Users, FileText } from 'lucide-react';
import { useState } from 'react';

const mockTimeline = [
  {
    id: 1,
    project: 'Riverside Apartments',
    phase: 'Foundation & Structural',
    status: 'Completed',
    startDate: '2024-06-01',
    endDate: '2024-07-15',
    progress: 100,
    description: 'Site preparation, foundation pouring, and structural framework installation completed successfully.',
    milestones: [
      { name: 'Site Survey', date: '2024-06-01', status: 'completed' },
      { name: 'Excavation', date: '2024-06-05', status: 'completed' },
      { name: 'Foundation Pour', date: '2024-06-20', status: 'completed' },
      { name: 'Structural Steel', date: '2024-07-15', status: 'completed' }
    ],
    team: ['John Smith (Foreman)', 'Mike Johnson (Crane Operator)', 'Sarah Wilson (Concrete Specialist)'],
    notes: 'All inspections passed. Ready for next phase.'
  },
  {
    id: 2,
    project: 'Riverside Apartments',
    phase: 'Framing & Electrical',
    status: 'In Progress',
    startDate: '2024-07-20',
    endDate: '2024-09-15',
    progress: 65,
    description: 'Currently installing wooden framework, electrical wiring, and plumbing systems throughout the building.',
    milestones: [
      { name: 'Wood Framing', date: '2024-07-20', status: 'completed' },
      { name: 'Electrical Rough-in', date: '2024-08-10', status: 'completed' },
      { name: 'Plumbing Rough-in', date: '2024-08-25', status: 'in-progress' },
      { name: 'HVAC Installation', date: '2024-09-01', status: 'pending' },
      { name: 'Final Inspection', date: '2024-09-15', status: 'pending' }
    ],
    team: ['David Brown (Framer)', 'Lisa Chen (Electrician)', 'Tom Davis (Plumber)'],
    notes: 'Plumbing installation running 3 days behind schedule due to material delays.'
  },
  {
    id: 3,
    project: 'Tech Innovation Hub',
    phase: 'Interior Finishing',
    status: 'Completed',
    startDate: '2024-03-01',
    endDate: '2024-05-01',
    progress: 100,
    description: 'Final interior work including drywall, painting, flooring, and fixture installation completed.',
    milestones: [
      { name: 'Drywall Installation', date: '2024-03-01', status: 'completed' },
      { name: 'Painting', date: '2024-03-20', status: 'completed' },
      { name: 'Flooring', date: '2024-04-10', status: 'completed' },
      { name: 'Fixtures & Final Touches', date: '2024-05-01', status: 'completed' }
    ],
    team: ['Maria Garcia (Interior Designer)', 'James Wilson (Painter)', 'Alex Thompson (Flooring Specialist)'],
    notes: 'Project completed on time and under budget. Client very satisfied with results.'
  },
  {
    id: 4,
    project: 'Sunset Plaza Retail Center',
    phase: 'Site Preparation',
    status: 'Planning',
    startDate: '2024-10-01',
    endDate: '2024-11-15',
    progress: 15,
    description: 'Preparing site for construction including permits, soil testing, and initial site work.',
    milestones: [
      { name: 'Permit Approval', date: '2024-09-15', status: 'completed' },
      { name: 'Soil Testing', date: '2024-09-25', status: 'completed' },
      { name: 'Site Clearing', date: '2024-10-01', status: 'pending' },
      { name: 'Utility Marking', date: '2024-10-10', status: 'pending' },
      { name: 'Excavation Prep', date: '2024-11-01', status: 'pending' }
    ],
    team: ['Robert Lee (Site Manager)', 'Jennifer Park (Permit Specialist)', 'Carlos Rodriguez (Surveyor)'],
    notes: 'Waiting for final soil test results before proceeding with site clearing.'
  }
];

export default function TimelinePage() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const projects = [...new Set(mockTimeline.map(item => item.project))];
  
  const filteredTimeline = mockTimeline.filter(item => {
    const projectMatch = selectedProject === 'all' || item.project === selectedProject;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return projectMatch && statusMatch;
  });

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
      case 'Planning': return <Calendar className="h-4 w-4" />;
      case 'On Hold': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-600';
      case 'in-progress': return 'bg-blue-600';
      case 'pending': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Project Timeline</h1>
            <p className="text-muted-foreground">Track the progress and milestones of all your construction projects</p>
          </div>
          <Link href="/projects">
            <Button variant="outline" className="font-semibold">View All Projects</Button>
          </Link>
        </div>

        {/* Timeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockTimeline.length}</div>
                <div className="text-muted-foreground text-sm">Total Phases</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockTimeline.filter(p => p.status === 'Completed').length}
                </div>
                <div className="text-muted-foreground text-sm">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockTimeline.filter(p => p.status === 'In Progress').length}
                </div>
                <div className="text-muted-foreground text-sm">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockTimeline.filter(p => p.status === 'Planning').length}
                </div>
                <div className="text-muted-foreground text-sm">Planning</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-[#232323] border border-border/40 text-white rounded-lg px-3 py-2"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#232323] border border-border/40 text-white rounded-lg px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {filteredTimeline.map((item) => (
            <div key={item.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{item.project}</h3>
                    <span className="text-lg text-muted-foreground">-</span>
                    <h4 className="text-lg font-semibold text-blue-400">{item.phase}</h4>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Start: {item.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">End: {item.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Progress: {item.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.team.length} team members</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Phase Progress</span>
                      <span className="text-white">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-[#232323] rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="lg:ml-6">
                  <Button variant="outline" className="w-full lg:w-auto">
                    View Details
                  </Button>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-white mb-4">Milestones</h5>
                <div className="space-y-3">
                  {item.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getMilestoneStatusColor(milestone.status)}`}></div>
                      <span className="text-white font-medium">{milestone.name}</span>
                      <span className="text-muted-foreground text-sm">{milestone.date}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        milestone.status === 'completed' ? 'bg-emerald-900/40 text-emerald-400' :
                        milestone.status === 'in-progress' ? 'bg-blue-900/40 text-blue-400' :
                        'bg-gray-900/40 text-gray-400'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-white mb-3">Team Members</h5>
                <div className="flex flex-wrap gap-2">
                  {item.team.map((member, index) => (
                    <span key={index} className="px-3 py-1 bg-[#232323] rounded-full text-sm text-white">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="p-4 bg-black/30 rounded-lg border border-border/40">
                  <h5 className="text-sm font-semibold text-white mb-2">Notes</h5>
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTimeline.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No timeline items found with the selected filters.</div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 