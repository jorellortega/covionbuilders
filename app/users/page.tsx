"use client";
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Client' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Client' },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);

  function handleDelete(id: number) {
    setUsers(users.filter(user => user.id !== id));
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-4xl rounded-xl border border-border/40 bg-[#141414] p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-white text-center">Manage Users</h1>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-4 border border-border/40 rounded-md">
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email} - {user.role}</p>
                </div>
                <div className="space-x-2">
                  <Button className="bg-blue-600 text-white">Edit</Button>
                  <Button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white">Delete</Button>
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