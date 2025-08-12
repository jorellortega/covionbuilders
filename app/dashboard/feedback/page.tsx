"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

const mockFeedback = [
  {
    id: 1,
    project: 'Tech Innovation Hub',
    type: 'Review',
    rating: 5,
    title: 'Exceptional Quality and Professionalism',
    content: 'The team delivered an outstanding project that exceeded our expectations. The attention to detail, communication throughout the process, and final quality were all exceptional. Highly recommend!',
    author: 'Sarah Johnson',
    date: '2024-05-15',
    status: 'Published',
    category: 'Project Completion',
    tags: ['quality', 'professionalism', 'communication'],
    response: 'Thank you Sarah! We\'re thrilled you\'re happy with the final result. It was a pleasure working with your team.',
    responseDate: '2024-05-16',
    responseBy: 'Project Manager'
  },
  {
    id: 2,
    project: 'Riverside Apartments',
    type: 'Feedback',
    rating: 4,
    title: 'Great Progress, Minor Communication Issues',
    content: 'Overall very satisfied with the construction progress. The quality of work is excellent and the timeline is being met. Would appreciate more frequent updates on schedule changes.',
    author: 'Michael Chen',
    date: '2024-08-10',
    status: 'Under Review',
    category: 'Construction Progress',
    tags: ['progress', 'quality', 'communication'],
    response: null,
    responseDate: null,
    responseBy: null
  },
  {
    id: 3,
    project: 'Heritage Home Renovation',
    type: 'Review',
    rating: 5,
    title: 'Perfect Historical Preservation',
    content: 'The team did an incredible job preserving the historical character while modernizing the home. Their expertise in historical restoration is unmatched. The attention to period details is remarkable.',
    author: 'Emily Rodriguez',
    date: '2024-07-20',
    status: 'Published',
    category: 'Historical Restoration',
    tags: ['historical', 'preservation', 'expertise'],
    response: 'Emily, thank you for your kind words! Historical preservation is our passion and we\'re so glad you appreciate the attention to detail.',
    responseDate: '2024-07-21',
    responseBy: 'Heritage Specialist'
  },
  {
    id: 4,
    project: 'Sunset Plaza Retail Center',
    type: 'Suggestion',
    rating: null,
    title: 'Sustainability Features Recommendation',
    content: 'Consider adding more sustainable features like solar panels and rainwater harvesting. This would align with current market trends and potentially increase property value.',
    author: 'David Thompson',
    date: '2024-09-05',
    status: 'Under Review',
    category: 'Sustainability',
    tags: ['sustainability', 'solar', 'rainwater'],
    response: null,
    responseDate: null,
    responseBy: null
  },
  {
    id: 5,
    project: 'Tech Innovation Hub',
    type: 'Complaint',
    rating: 2,
    title: 'Delayed Material Delivery',
    content: 'The project has been delayed due to late material deliveries. While the quality is good, the timeline impact is concerning for our business operations.',
    author: 'Lisa Wang',
    date: '2024-06-25',
    status: 'Resolved',
    category: 'Timeline',
    tags: ['delay', 'materials', 'timeline'],
    response: 'Lisa, we sincerely apologize for the delays. We\'ve implemented new supplier management protocols to prevent future issues. Thank you for your patience.',
    responseDate: '2024-06-28',
    responseBy: 'Operations Manager'
  }
];

const feedbackTypes = ['All', 'Review', 'Feedback', 'Suggestion', 'Complaint'];
const categories = ['All', 'Project Completion', 'Construction Progress', 'Historical Restoration', 'Sustainability', 'Timeline', 'Quality'];
const statuses = ['All', 'Published', 'Under Review', 'Resolved', 'Pending Response'];

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeedback = mockFeedback.filter(feedback => {
    const typeMatch = selectedType === 'All' || feedback.type === selectedType;
    const categoryMatch = selectedCategory === 'All' || feedback.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || feedback.status === selectedStatus;
    const searchMatch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       feedback.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && categoryMatch && statusMatch && searchMatch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Review': return 'bg-emerald-900/40 text-emerald-400';
      case 'Feedback': return 'bg-blue-900/40 text-blue-400';
      case 'Suggestion': return 'bg-purple-900/40 text-purple-400';
      case 'Complaint': return 'bg-red-900/40 text-red-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-900/40 text-emerald-400';
      case 'Under Review': return 'bg-yellow-900/40 text-yellow-400';
      case 'Resolved': return 'bg-blue-900/40 text-blue-400';
      case 'Pending Response': return 'bg-red-900/40 text-red-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const renderStars = (rating: number | null) => {
    if (rating === null) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
          />
        ))}
      </div>
    );
  };

  const totalFeedback = mockFeedback.length;
  const publishedFeedback = mockFeedback.filter(f => f.status === 'Published').length;
  const pendingResponse = mockFeedback.filter(f => f.response === null).length;
  const averageRating = mockFeedback.filter(f => f.rating !== null).reduce((sum, f) => sum + (f.rating || 0), 0) / mockFeedback.filter(f => f.rating !== null).length;

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Feedback & Reviews</h1>
            <p className="text-muted-foreground">View client feedback, respond to reviews, and track satisfaction metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Request Feedback
            </Button>
          </div>
        </div>

        {/* Feedback Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{totalFeedback}</div>
                <div className="text-muted-foreground text-sm">Total Feedback</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</div>
                <div className="text-muted-foreground text-sm">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <ThumbsUp className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">{publishedFeedback}</div>
                <div className="text-muted-foreground text-sm">Published</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-white">{pendingResponse}</div>
                <div className="text-muted-foreground text-sm">Pending Response</div>
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
                placeholder="Search feedback..."
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
                {feedbackTypes.map(type => (
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
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Feedback
              </Button>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {filteredFeedback.map((feedback) => (
            <div key={feedback.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{feedback.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(feedback.type)}`}>
                      {feedback.type}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    Project: <span className="text-white">{feedback.project}</span> • 
                    Category: <span className="text-white">{feedback.category}</span> • 
                    Author: <span className="text-white">{feedback.author}</span> • 
                    Date: <span className="text-white">{feedback.date}</span>
                  </div>
                  
                  {feedback.rating && (
                    <div className="mb-3">
                      {renderStars(feedback.rating)}
                    </div>
                  )}
                  
                  <p className="text-muted-foreground mb-4">{feedback.content}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feedback.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-[#232323] rounded-full text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Response */}
                  {feedback.response && (
                    <div className="bg-black/30 p-4 rounded-lg border border-border/40 mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Response by {feedback.responseBy} on {feedback.responseDate}:
                      </div>
                      <p className="text-white">{feedback.response}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:ml-6">
                  <Button variant="outline" className="w-full lg:w-auto">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {feedback.response === null && (
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto">
                      <Send className="h-4 w-4 mr-2" />
                      Respond
                    </Button>
                  )}
                  {feedback.status === 'Under Review' && (
                    <Button variant="outline" className="w-full lg:w-auto">
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No feedback found with the selected criteria.</div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Request Your First Feedback
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Request Feedback</h3>
            <p className="text-muted-foreground mb-4">Send feedback requests to your clients</p>
            <Button variant="outline" className="w-full">Request Now</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <ThumbsUp className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Respond to Reviews</h3>
            <p className="text-muted-foreground mb-4">Reply to client feedback and reviews</p>
            <Button variant="outline" className="w-full">Respond</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Satisfaction Report</h3>
            <p className="text-muted-foreground mb-4">Generate satisfaction and feedback reports</p>
            <Button variant="outline" className="w-full">Generate Report</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 