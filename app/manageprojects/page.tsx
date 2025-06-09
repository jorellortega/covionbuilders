"use client";
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

const mockProjects = [
  { id: 1, name: 'Riverside Apartments', status: 'Active', budget: 100000, manager: 'John Doe' },
  { id: 2, name: 'Tech Innovation Hub', status: 'Completed', budget: 200000, manager: 'Jane Smith' },
  { id: 3, name: 'Sunset Plaza', status: 'Active', budget: 150000, manager: 'Bob Johnson' },
];

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState(mockProjects);

  function handleDelete(id: number) {
    setProjects(projects.filter(project => project.id !== id));
  }

  function handleArchive(id: number) {
    setProjects(projects.map(project => project.id === id ? { ...project, status: 'Archived' } : project));
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-4xl rounded-xl border border-border/40 bg-[#141414] p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-white text-center">Manage Projects</h1>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-border/40 rounded-md bg-black/30">
                <div className="mb-2 md:mb-0">
                  <h2 className="text-xl font-bold text-white">{project.name}</h2>
                  <p className="text-muted-foreground">Status: {project.status} | Budget: ${project.budget} | Manager: {project.manager}</p>
                </div>
                <div className="space-x-2 flex">
                  <Button className="bg-blue-600 text-white">Edit</Button>
                  <Button onClick={() => handleArchive(project.id)} className="bg-yellow-600 text-white">Archive</Button>
                  <Button onClick={() => handleDelete(project.id)} className="bg-red-600 text-white">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 