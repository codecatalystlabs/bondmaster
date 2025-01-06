'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

import { GoogleCircleFilled, FacebookFilled, TwitterCircleFilled } from '@ant-design/icons'

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex  items-center w-[90%] md:w-[60%]  lg:w-[30%] justify-center shadow-black shadow-xl rounded-md bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-200" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Sign In</h2>

        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="w-full max-w-[120px]">
            <GoogleCircleFilled className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" size="icon" className="w-10">
            <FacebookFilled className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-10">
            <TwitterCircleFilled className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-2 text-gray-500">OR</span>
          </div>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/90">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="text-gray-500">Hide</span>
                  ) : (
                    <span className="text-gray-500">Show</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox id="remember" className="h-4 w-4" />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember password?
            </label>
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-primary/90">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

