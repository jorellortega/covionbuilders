"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  function handleDelete(id: string) {
    setProjects(projects.filter(project => project.id !== id));
  }

  function handleArchive(id: string) {
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
                  <h2 className="text-xl font-bold text-white">{project.project_type || project.name || 'No Name'}</h2>
                  <p className="text-muted-foreground">Status: {project.status} | Budget: ${project.budget} | Manager: {project.manager || project.first_name + ' ' + project.last_name}</p>
                </div>
                <div className="space-x-2 flex">
                  <Button className="bg-blue-600 text-white">Edit</Button>
                  <Button onClick={() => handleArchive(project.id)} className="bg-yellow-600 text-white">Archive</Button>
                  <Button onClick={() => handleDelete(project.id)} className="bg-red-600 text-white">Delete</Button>
                  <a href={`/status/${project.id}`} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-emerald-600 text-white">View Status</Button>
                  </a>
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