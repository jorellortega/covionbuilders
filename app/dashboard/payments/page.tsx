"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/payments-invoices');
  }, [router]);

  return null;
} 