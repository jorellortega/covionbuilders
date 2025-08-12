"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Camera, Video, Upload, Download, Eye, Calendar, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

const mockMedia = [
  {
    id: 1,
    project: 'Riverside Apartments',
    type: 'photo',
    title: 'Foundation Pour - Day 1',
    description: 'Initial concrete pour for the main foundation structure. All forms properly set and reinforced.',
    date: '2024-06-20',
    location: 'Foundation Area A',
    photographer: 'John Smith',
    tags: ['foundation', 'concrete', 'structural'],
    imageUrl: '/placeholder.jpg',
    thumbnailUrl: '/placeholder.jpg',
    fileSize: '2.4 MB',
    dimensions: '4032 x 3024'
  },
  {
    id: 2,
    project: 'Riverside Apartments',
    type: 'video',
    title: 'Steel Framework Installation',
    description: 'Time-lapse video of the steel framework being installed. Shows the precision and coordination of the team.',
    date: '2024-07-15',
    location: 'Main Building Structure',
    photographer: 'Mike Johnson',
    tags: ['steel', 'framework', 'installation', 'timelapse'],
    imageUrl: '/placeholder.jpg',
    thumbnailUrl: '/placeholder.jpg',
    fileSize: '45.7 MB',
    dimensions: '1920 x 1080',
    duration: '2:34'
  },
  {
    id: 3,
    project: 'Tech Innovation Hub',
    type: 'photo',
    title: 'Interior Finishing - Lobby',
    description: 'Completed lobby area with modern finishes, lighting, and furniture installation.',
    date: '2024-04-25',
    location: 'Main Lobby',
    photographer: 'Maria Garcia',
    tags: ['interior', 'finishing', 'lobby', 'completed'],
    imageUrl: '/placeholder.jpg',
    thumbnailUrl: '/placeholder.jpg',
    fileSize: '3.1 MB',
    dimensions: '4032 x 3024'
  },
  {
    id: 4,
    project: 'Sunset Plaza Retail Center',
    type: 'photo',
    title: 'Site Survey and Marking',
    description: 'Initial site survey with utility marking and boundary establishment.',
    date: '2024-09-20',
    location: 'Site Perimeter',
    photographer: 'Carlos Rodriguez',
    tags: ['survey', 'site-prep', 'utilities'],
    imageUrl: '/placeholder.jpg',
    thumbnailUrl: '/placeholder.jpg',
    fileSize: '1.8 MB',
    dimensions: '4032 x 3024'
  },
  {
    id: 5,
    project: 'Heritage Home Renovation',
    type: 'photo',
    title: 'Historical Features Preservation',
    description: 'Documentation of original architectural features before restoration work begins.',
    date: '2024-07-10',
    location: 'Main Living Area',
    photographer: 'Alex Thompson',
    tags: ['historical', 'preservation', 'documentation'],
    imageUrl: '/placeholder.jpg',
    thumbnailUrl: '/placeholder.jpg',
    fileSize: '2.9 MB',
    dimensions: '4032 x 3024'
  },
  {
    id: 6,
    project: 'Riverside Apartments',
    type: 'video',
    title: 'Crane Operation - Beam Placement',
    description: 'Detailed video showing the careful placement of structural beams using the tower crane.',
    date: '2024-07-18',
    location: 'North Building Section',
    photographer: 'David Brown',
    tags: ['crane', 'beams', 'structural', 'safety'],
    imageUrl: '/placeholder.jpg',
    thumbnailUrl: '/placeholder.jpg',
    fileSize: '67.2 MB',
    dimensions: '1920 x 1080',
    duration: '4:12'
  }
];

const projects = ['All', 'Riverside Apartments', 'Tech Innovation Hub', 'Sunset Plaza Retail Center', 'Heritage Home Renovation'];
const mediaTypes = ['All', 'photo', 'video'];
const dateRanges = ['All Time', 'This Week', 'This Month', 'Last 3 Months', 'This Year'];

export default function PhotosPage() {
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredMedia = mockMedia.filter(media => {
    const projectMatch = selectedProject === 'All' || media.project === selectedProject;
    const typeMatch = selectedType === 'All' || media.type === selectedType;
    const searchMatch = media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       media.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       media.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return projectMatch && typeMatch && searchMatch;
  });

  const getDateRangeFilter = (dateRange: string) => {
    const now = new Date();
    switch (dateRange) {
      case 'This Week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return (date: string) => new Date(date) >= weekAgo;
      case 'This Month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return (date: string) => new Date(date) >= monthAgo;
      case 'Last 3 Months':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return (date: string) => new Date(date) >= threeMonthsAgo;
      case 'This Year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return (date: string) => new Date(date) >= yearStart;
      default:
        return () => true;
    }
  };

  const dateFilteredMedia = filteredMedia.filter(media => getDateRangeFilter(selectedDateRange)(media.date));

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Progress Photos & Videos</h1>
            <p className="text-muted-foreground">Track your project progress through visual documentation</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>
        </div>

        {/* Media Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Camera className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockMedia.length}</div>
                <div className="text-muted-foreground text-sm">Total Media</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Camera className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockMedia.filter(m => m.type === 'photo').length}
                </div>
                <div className="text-muted-foreground text-sm">Photos</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockMedia.filter(m => m.type === 'video').length}
                </div>
                <div className="text-muted-foreground text-sm">Videos</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {mockMedia.filter(m => new Date(m.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-muted-foreground text-sm">This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-[#141414] p-6 rounded-xl border border-border/40 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Search</label>
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mediaTypes.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Types' : type === 'photo' ? 'Photos' : 'Videos'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Date Range</label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="flex border border-border/40 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#232323] text-muted-foreground hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#232323] text-muted-foreground hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dateFilteredMedia.map((media) => (
              <div key={media.id} className="bg-[#141414] rounded-xl border border-border/40 overflow-hidden">
                <div className="relative">
                  <img
                    src={media.thumbnailUrl}
                    alt={media.title}
                    className="w-full h-48 object-cover"
                  />
                  {media.type === 'video' && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {media.duration}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      media.type === 'photo' ? 'bg-blue-900/40 text-blue-400' : 'bg-purple-900/40 text-purple-400'
                    }`}>
                      {media.type === 'photo' ? <Camera className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                      {media.type === 'photo' ? 'Photo' : 'Video'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{media.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{media.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {media.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {media.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {media.photographer}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {media.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-[#232323] rounded-full text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {dateFilteredMedia.map((media) => (
              <div key={media.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="relative">
                    <img
                      src={media.thumbnailUrl}
                      alt={media.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    {media.type === 'video' && (
                      <div className="absolute top-1 right-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {media.duration}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{media.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        media.type === 'photo' ? 'bg-blue-900/40 text-blue-400' : 'bg-purple-900/40 text-purple-400'
                      }`}>
                        {media.type === 'photo' ? <Camera className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                        {media.type === 'photo' ? 'Photo' : 'Video'}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{media.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{media.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{media.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{media.photographer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{media.fileSize}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {media.tags.map((tag, index) => (
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
        )}

        {dateFilteredMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No media found with the selected criteria.</div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Upload Your First Media
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Camera className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Upload Photos</h3>
            <p className="text-muted-foreground mb-4">Upload progress photos from your projects</p>
            <Button variant="outline" className="w-full">Upload Now</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Video className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Upload Videos</h3>
            <p className="text-muted-foreground mb-4">Share video updates and time-lapses</p>
            <Button variant="outline" className="w-full">Upload Now</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Download className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Download All</h3>
            <p className="text-muted-foreground mb-4">Download all media as a zip file</p>
            <Button variant="outline" className="w-full">Download</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 