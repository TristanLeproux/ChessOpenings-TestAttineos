import { Link, Outlet } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-3">
          <Link to="/openings" className="text-lg font-semibold hover:opacity-80">
            ♟ Chess Openings
          </Link>
          <Link to="/openings/new" className={buttonVariants({ size: 'sm' })}>
            + Nouvelle ouverture
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
