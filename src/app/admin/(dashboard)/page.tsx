import { redirect } from 'next/navigation'

// Redirect /  →  /dashboard
export default function RootDashboard() {
  redirect('/admin/dashboard')
}
