import Header from '@/components/header';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ProjectMainImage } from '@/components/ProjectGallery';
import UploadFilesClient from '@/components/UploadFilesClient';

export default async function UploadFilesPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createSupabaseBrowserClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false });
  if (error || !projects) return notFound();
  const project = projects.find((p: any) => String(p.id) === id);
  if (!project) return notFound();

  // This will be hydrated client-side for uploads
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold text-white">{project.title}</h1>
          <div className="mb-8 text-lg text-muted-foreground">{project.description}</div>
          <ProjectMainImage project={project} />
          {/* Client-side upload form and gallery will go here */}
          <UploadFilesClient projectId={project.id} existingFiles={project.additional_files || []} />
        </div>
      </section>
      <Footer />
    </div>
  );
} 