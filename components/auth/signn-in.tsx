'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as z from "zod";
import { parseCookies, setCookie, destroyCookie } from 'nookies'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginUser } from '@/types/user';
import { login } from '@/apis';
import { BASE_URL } from '@/constants/baseUrl';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  identity: z.string().min(2, {
		message: "identity must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
})


export function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
   resolver: zodResolver(formSchema),
    defaultValues: {
      identity: "",
      password: "",
    },
    
  })


  async function submit(values: z.infer<typeof formSchema>) {
    const userPayload: LoginUser = {
      ...values
    }


    const response = await login({
					url: `${BASE_URL}/auth/login`,
					userData: userPayload,
    });

    if (response.status == 'success') {
      redirect('/');
      const token = response.token;
      setCookie(null, 'token', token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      })
    }
    
   

  }

  return (
    <div className="flex  items-center w-[90%] md:w-[60%]  lg:w-[30%] justify-center shadow-black shadow-xl rounded-md bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
         <div className='w-full justify-center flex' >
					<Image width={120} height={50} src="/logo.png" alt="logo" objectFit="cover" />
				</div>

        </div>

   

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-2 text-gray-500">LOGIN</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(submit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="identity"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <Input
                id="identity"
                type="text"
                {...form.register('identity')} 
                className="mt-1"
              />
              {form.formState.errors.identity && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.identity.message}
                </p>
              )}
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
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')} 
                  className="mt-1"
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
            Developed By  
            <Link href="/signup" className="text-primary ml-2 hover:text-primary/90">
              CodeCatalystLabsUg
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

