import Header from '@/components/header';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ProjectInlineEditor, ProjectTitleAndDescription, ProjectEstimatedPrice, ProjectHighlights, ProjectCategoryLocation } from '@/components/ProjectInlineEditor';
import { ProjectGallery, ProjectMainImage } from '@/components/ProjectGallery';

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createSupabaseBrowserClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false });
  if (error || !projects) return notFound();
  const project = projects.find((p: any) => String(p.id) === id);
  if (!project) return notFound();

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-2xl">
          <ProjectTitleAndDescription project={project} />
          <div className="mb-8 flex items-center justify-between">
            <Link href="/projects">
              <Button variant="outline">&larr; Back to Projects</Button>
            </Link>
          </div>
          <ProjectMainImage project={project} />
          <ProjectCategoryLocation project={project} />
          <ProjectEstimatedPrice project={project} />
          <ProjectHighlights project={project} />
          <ProjectGallery project={project} />
        </div>
      </section>
      <Footer />
    </div>
  );
} 