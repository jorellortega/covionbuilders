import Header from '@/components/header';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ProjectMainImage, ProjectGallery } from '@/components/ProjectGallery';

export default async function ViewProjectPage({ params }: { params: { id: string } }) {
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
          <h1 className="mb-4 text-4xl font-bold text-white">{project.title}</h1>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mr-2">
              {project.category}
            </span>
            <span className="text-xs text-muted-foreground">{project.location}</span>
          </div>
          <div className="mb-4 text-muted-foreground">Completed: {project.year}</div>
          <div className="mb-8 text-lg text-muted-foreground">{project.description}</div>
          <ProjectMainImage project={{ ...project, isCeo: false }} />
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-2">Estimated Price</h2>
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {project.estimated_price ? `$${Number(project.estimated_price).toLocaleString()}` : <span className="italic text-muted-foreground">(empty)</span>}
            </div>
            <div className="text-muted-foreground text-sm mb-4">Contact us for a custom quote for your project.</div>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Project Highlights</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              {project.highlights && typeof project.highlights === 'string'
                ? project.highlights.split(/\r?\n/).filter(Boolean).map((item: string, idx: number) => <li key={idx}>{item}</li>)
                : <li className="italic text-muted-foreground">(empty)</li>}
            </ul>
          </div>
          <ProjectGallery project={{ ...project, isCeo: false }} />
        </div>
      </section>
      <Footer />
    </div>
  );
} 