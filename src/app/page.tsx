import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          RamadhanHub AI
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-bold">{user.email}</span>
              <form action="/auth/signout" method="post">
                <Button variant="outline">Sign Out</Button>
                {/* Note: We need to implement signout logic or handle it client side. 
                     For now, let's keep it simple or just show the email. 
                     We can add a Sign Out button that uses a server action or client handler later.
                     Since this is a server component, we can't easily attach onClick handlers without a client component.
                  */}
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-32 text-center">
        {user ? (
          <h1 className="text-4xl font-bold">Welcome back, {user.email}!</h1>
        ) : (
          <h1 className="text-4xl font-bold">Welcome to RamadhanHub AI</h1>
        )}
      </div>
    </div>
  )
}
