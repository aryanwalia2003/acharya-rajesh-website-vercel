import { isAdmin } from "@/lib/auth-utils";
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import EditorComponent from './EditorComponent';

export default async function AdminWritePage() {
  // Server-side authorization check
  const authorized = await isAdmin();
  
  if (!authorized) {
    redirect('/unauthorized');
  }

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-brand-paper text-brand-navy font-bold">Loading Editor...</div>}>
      <EditorComponent />
    </Suspense>
  );
}