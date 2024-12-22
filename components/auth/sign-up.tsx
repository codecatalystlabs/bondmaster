'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { GoogleCircleFilled, FacebookFilled, TwitterCircleFilled } from '@ant-design/icons'

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-200" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-500">
            Welcome & join us by creating a free account!
          </p>
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
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                id="first-name"
                name="firstName"
                type="text"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                id="last-name"
                name="lastName"
                type="text"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
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

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <span className="text-gray-500">Hide</span>
                  ) : (
                    <span className="text-gray-500">Show</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox id="terms" className="h-4 w-4" />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              By creating a account you agree to our{' '}
              <Link href="/terms" className="text-primary hover:text-primary/90">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:text-primary/90">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/signin" className="text-primary hover:text-primary/90">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

