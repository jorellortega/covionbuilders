import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const jobs = [
  {
    title: "Project Manager",
    description: "Lead construction projects from planning to completion. Requires 5+ years experience in project management.",
  },
  {
    title: "Site Supervisor",
    description: "Oversee daily operations on construction sites. Ensure safety and quality standards are met.",
  },
  {
    title: "Civil Engineer",
    description: "Design, develop, and supervise construction projects. Bachelor's degree in Civil Engineering required.",
  },
  {
    title: "General Laborer",
    description: "Assist with various tasks on site. No experience required, training provided.",
  },
  {
    title: "Estimator",
    description: "Prepare cost estimates for construction projects. Strong analytical skills needed.",
  },
];

export default function CareersPage() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl text-white">Careers</h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Join our team and help build the future!<br />
            We are always looking for talented professionals passionate about construction, design, and innovation.
          </p>
          <h2 className="mb-8 text-2xl font-semibold text-white">Current Openings</h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {jobs.map((job, idx) => (
              <div key={idx} className="flex flex-col justify-between min-h-[220px] rounded-lg p-8 border border-border/30 shadow-lg" style={{ backgroundColor: '#141414' }}>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">{job.title}</h3>
                  <p className="text-muted-foreground mb-6 text-base">{job.description}</p>
                </div>
                <Link href={{ pathname: "/careers/apply", query: { position: job.title } }}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white mt-2">Apply</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 