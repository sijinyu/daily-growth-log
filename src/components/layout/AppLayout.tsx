import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
      <main className="flex flex-1 flex-col pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
