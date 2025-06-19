'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SubmitBtn from '@/hooks/submitBtn'
import { useActionState } from 'react'
import { OnboardUser } from '../action'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { OnboardingSchema } from '@/utils/zodSchema'

export default function Onboarding() {
  const [lastResult, action] = useActionState(OnboardUser)

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      console.log(formData, form)
      return parseWithZod(formData, {
        schema: OnboardingSchema,
      })
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  return (
    <div className=' w-screen h-screen flex items-center justify-center '>
      <Card className=' max-w-sm mx-auto'>
        <CardHeader className=' '>
          <CardTitle className='text-xl'>You are almost Finished</CardTitle>
          <CardDescription>
            Enter you infomation to create account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={action}
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
            className='gap-2.5 flex flex-col'
          >
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <Label>First Name</Label>
                <Input
                  type='text'
                  defaultValue={fields.fname.initialValue}
                  key={fields.fname.key}
                  name={fields.fname.name}
                  placeholder='First Name'
                  className='placeholder:text-gray-400'
                />
                <p className=' text-destructive'>{fields.fname.errors}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Last Name</Label>
                <Input
                  type='text'
                  defaultValue={fields.lname.initialValue}
                  key={fields.lname.key}
                  name={fields.lname.name}
                  placeholder='Last Name'
                  className='placeholder:text-gray-400'
                />
                <p className=' text-destructive'>{fields.lname.errors}</p>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Address</Label>
              <Input
                name={fields.address.name}
                type='text'
                defaultValue={fields.address.initialValue}
                key={fields.address.key}
                placeholder='Your name'
                className='placeholder:text-gray-400'
              />
              <p className=' text-destructive'>{fields.address.errors}</p>
            </div>
            <SubmitBtn text={'Finish Onboarding'} />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
