import { headers } from 'next/headers';

export async function getServerSession() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/get-session`,
    {
      headers: await headers(),
      cache: 'no-store',
    },
  );
  if (!res.ok) return null;
  return res.json();
}
