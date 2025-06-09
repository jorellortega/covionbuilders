import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CeoDashboardPage() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-4xl font-bold text-white text-center">CEO Dashboard</h1>
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white">Total Projects</h2>
              <p className="text-3xl font-bold text-emerald-400">12</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white">Total Users</h2>
              <p className="text-3xl font-bold text-emerald-400">45</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white">Total Payments</h2>
              <p className="text-3xl font-bold text-emerald-400">$50,000</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Update Placeholder Images</h2>
              <p className="mb-4 text-muted-foreground">Select a page and update placeholder images.</p>
              <Link href="/updatepix">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Go to Update Images</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Manage Projects</h2>
              <p className="mb-4 text-muted-foreground">View and manage all projects.</p>
              <Link href="/manageprojects">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Projects</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Manage Users</h2>
              <p className="mb-4 text-muted-foreground">View and manage user accounts.</p>
              <Link href="/users">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Users</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Manage Payments</h2>
              <p className="mb-4 text-muted-foreground">View and manage payment records.</p>
              <Link href="/payments">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Payments</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 