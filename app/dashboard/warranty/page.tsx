"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, Wrench, Clock, CheckCircle, AlertTriangle, Calendar, MapPin, Phone, Eye } from 'lucide-react';
import { useState } from 'react';

const mockWarranties = [
  {
    id: 1,
    project: 'Tech Innovation Hub',
    component: 'HVAC System',
    warrantyType: 'Manufacturer',
    startDate: '2024-05-01',
    endDate: '2027-05-01',
    duration: '3 years',
    status: 'Active',
    description: 'Full manufacturer warranty covering parts and labor for the smart HVAC system.',
    coverage: ['Parts', 'Labor', 'Emergency Service'],
    terms: '24/7 emergency service, next-day parts delivery',
    contact: 'HVAC Pro Services',
    phone: '+1-555-0123'
  },
  {
    id: 2,
    project: 'Riverside Apartments',
    component: 'Foundation & Structure',
    warrantyType: 'Structural',
    startDate: '2024-07-15',
    endDate: '2034-07-15',
    duration: '10 years',
    status: 'Active',
    description: 'Structural warranty covering foundation, load-bearing walls, and structural integrity.',
    coverage: ['Foundation', 'Structural Elements', 'Load-Bearing Walls'],
    terms: 'Comprehensive coverage for structural defects and settlement issues',
    contact: 'Structural Warranty Corp',
    phone: '+1-555-0456'
  },
  {
    id: 3,
    project: 'Heritage Home Renovation',
    component: 'Roof System',
    warrantyType: 'Contractor',
    startDate: '2024-06-20',
    endDate: '2029-06-20',
    duration: '5 years',
    status: 'Active',
    description: 'Contractor warranty covering roof installation, materials, and workmanship.',
    coverage: ['Materials', 'Workmanship', 'Leak Protection'],
    terms: 'Annual inspection included, immediate response to leaks',
    contact: 'Heritage Roofing Co',
    phone: '+1-555-0789'
  },
  {
    id: 4,
    project: 'Sunset Plaza Retail Center',
    component: 'Electrical Systems',
    warrantyType: 'Manufacturer',
    startDate: '2024-10-01',
    endDate: '2026-10-01',
    duration: '2 years',
    status: 'Pending',
    description: 'Manufacturer warranty for electrical panels, wiring, and smart building systems.',
    coverage: ['Electrical Panels', 'Wiring', 'Smart Systems'],
    terms: 'Standard manufacturer coverage, business hours support',
    contact: 'ElectroTech Solutions',
    phone: '+1-555-0321'
  }
];

const mockMaintenance = [
  {
    id: 1,
    project: 'Tech Innovation Hub',
    component: 'HVAC System',
    type: 'Preventive',
    status: 'Scheduled',
    dueDate: '2024-09-15',
    lastPerformed: '2024-06-15',
    frequency: 'Quarterly',
    description: 'Quarterly HVAC system inspection and filter replacement.',
    technician: 'HVAC Pro Services',
    estimatedCost: 250,
    priority: 'Medium'
  },
  {
    id: 2,
    project: 'Riverside Apartments',
    component: 'Fire Safety Systems',
    type: 'Inspection',
    status: 'Overdue',
    dueDate: '2024-08-01',
    lastPerformed: '2024-05-01',
    frequency: 'Monthly',
    description: 'Monthly fire alarm and sprinkler system inspection.',
    technician: 'Fire Safety Plus',
    estimatedCost: 150,
    priority: 'High'
  },
  {
    id: 3,
    project: 'Heritage Home Renovation',
    component: 'Gutters & Drainage',
    type: 'Preventive',
    status: 'Completed',
    dueDate: '2024-08-10',
    lastPerformed: '2024-08-10',
    frequency: 'Semi-annually',
    description: 'Gutter cleaning and drainage system inspection.',
    technician: 'Heritage Roofing Co',
    estimatedCost: 200,
    priority: 'Low'
  }
];

const warrantyTypes = ['All', 'Manufacturer', 'Structural', 'Contractor', 'Extended'];
const statuses = ['All', 'Active', 'Pending', 'Expired', 'Void'];
const maintenanceTypes = ['All', 'Preventive', 'Inspection', 'Repair', 'Emergency'];

export default function WarrantyPage() {
  const [selectedWarrantyType, setSelectedWarrantyType] = useState('All');
  const [selectedWarrantyStatus, setSelectedWarrantyStatus] = useState('All');
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWarranties = mockWarranties.filter(warranty => {
    const typeMatch = selectedWarrantyType === 'All' || warranty.warrantyType === selectedWarrantyType;
    const statusMatch = selectedWarrantyStatus === 'All' || warranty.status === selectedWarrantyStatus;
    const searchMatch = warranty.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       warranty.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && statusMatch && searchMatch;
  });

  const filteredMaintenance = mockMaintenance.filter(maintenance => {
    const typeMatch = selectedMaintenanceType === 'All' || maintenance.type === selectedMaintenanceType;
    const searchMatch = maintenance.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       maintenance.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  const getWarrantyStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-900/40 text-emerald-400';
      case 'Pending': return 'bg-yellow-900/40 text-yellow-400';
      case 'Expired': return 'bg-red-900/40 text-red-400';
      case 'Void': return 'bg-gray-900/40 text-gray-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-900/40 text-emerald-400';
      case 'Scheduled': return 'bg-blue-900/40 text-blue-400';
      case 'Overdue': return 'bg-red-900/40 text-red-400';
      case 'In Progress': return 'bg-yellow-900/40 text-yellow-400';
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

  const activeWarranties = mockWarranties.filter(w => w.status === 'Active').length;
  const upcomingMaintenance = mockMaintenance.filter(m => m.status === 'Scheduled').length;
  const overdueMaintenance = mockMaintenance.filter(m => m.status === 'Overdue').length;

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Warranty & Maintenance</h1>
            <p className="text-muted-foreground">Track warranties, schedule maintenance, and manage service requests</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              <Phone className="h-4 w-4 mr-2" />
              Service Request
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockWarranties.length}</div>
                <div className="text-muted-foreground text-sm">Total Warranties</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">{activeWarranties}</div>
                <div className="text-muted-foreground text-sm">Active Warranties</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Wrench className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{upcomingMaintenance}</div>
                <div className="text-muted-foreground text-sm">Scheduled</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-white">{overdueMaintenance}</div>
                <div className="text-muted-foreground text-sm">Overdue</div>
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
                placeholder="Search warranties or maintenance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Warranty Type</label>
              <select
                value={selectedWarrantyType}
                onChange={(e) => setSelectedWarrantyType(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {warrantyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Warranty Status</label>
              <select
                value={selectedWarrantyStatus}
                onChange={(e) => setSelectedWarrantyStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Maintenance Type</label>
              <select
                value={selectedMaintenanceType}
                onChange={(e) => setSelectedMaintenanceType(e.target.value)}
                className="w-full px-3 py-2 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {maintenanceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Warranties */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Warranties</h2>
          <div className="space-y-4">
            {filteredWarranties.map((warranty) => (
              <div key={warranty.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">{warranty.component}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getWarrantyStatusColor(warranty.status)}`}>
                        {warranty.status}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/40 text-blue-400">
                        {warranty.warrantyType}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      Project: <span className="text-white">{warranty.project}</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{warranty.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Start: {warranty.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">End: {warranty.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Duration: {warranty.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{warranty.contact}</span>
                      </div>
                    </div>

                    {/* Coverage */}
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Coverage:</div>
                      <div className="flex flex-wrap gap-2">
                        {warranty.coverage.map((item, index) => (
                          <span key={index} className="px-2 py-1 bg-[#232323] rounded-full text-xs text-white">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Terms: <span className="text-white">{warranty.terms}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:ml-6">
                    <Button variant="outline" className="w-full lg:w-auto">
                      <Shield className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" className="w-full lg:w-auto">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Maintenance Schedule</h2>
          <div className="space-y-4">
            {filteredMaintenance.map((maintenance) => (
              <div key={maintenance.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">{maintenance.component}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMaintenanceStatusColor(maintenance.status)}`}>
                        {maintenance.status}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/40 text-blue-400">
                        {maintenance.type}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(maintenance.priority)}`}>
                        {maintenance.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      Project: <span className="text-white">{maintenance.project}</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{maintenance.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Due: {maintenance.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Last: {maintenance.lastPerformed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Frequency: {maintenance.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Cost: ${maintenance.estimatedCost}</span>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Technician: <span className="text-white">{maintenance.technician}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:ml-6">
                    <Button variant="outline" className="w-full lg:w-auto">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {maintenance.status === 'Scheduled' && (
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto">
                        <Wrench className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    )}
                    {maintenance.status === 'Overdue' && (
                      <Button className="bg-red-600 hover:bg-red-700 w-full lg:w-auto">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Urgent
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredWarranties.length === 0 && filteredMaintenance.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No warranties or maintenance found with the selected criteria.</div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Add Your First Warranty
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Add Warranty</h3>
            <p className="text-muted-foreground mb-4">Register new warranties for your projects</p>
            <Button variant="outline" className="w-full">Add New</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Wrench className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Schedule Maintenance</h3>
            <p className="text-muted-foreground mb-4">Schedule preventive maintenance tasks</p>
            <Button variant="outline" className="w-full">Schedule Now</Button>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-center">
            <Phone className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Service Request</h3>
            <p className="text-muted-foreground mb-4">Submit a new service or repair request</p>
            <Button variant="outline" className="w-full">Submit Request</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 