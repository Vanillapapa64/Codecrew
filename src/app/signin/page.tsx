import { Suspense } from 'react'
import { SignInForm } from '../components/signinfrom'

export default function SignInPage() {
    
  return (
    <Suspense>
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 -translate-y-10">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{' '}
            <a href="/dashboard" className="font-medium text-indigo-400 hover:text-indigo-300">
              create a new account
            </a>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
    </Suspense>
  )
}

