'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Category } from '../data/schema'
import { categoryService } from '@/services/api'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  isEdit: z.boolean(),
});

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CategoryActionDialog({ currentRow, open, onOpenChange, onSuccess }: Props) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          name: '',
          description: '',
          isEdit,
        },
  })


const onSubmit = async (values: UserForm) => {
  try {
    setIsSubmitting(true)
    
    const categoryData = {
      name: values.name,
      description: values.description,
    }

    if (isEdit) {
      await categoryService.updateCategory(currentRow!.id.toString(), categoryData)
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      })
    } else {
    await categoryService.createCategory(categoryData as Category)
      toast({
        title: 'Success', 
        description: 'Category created successfully',
      })
    }
    
    form.reset()
    onSuccess?.()
    onOpenChange(false)
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Something went wrong',
      variant: 'destructive',
    })
    console.error('Error:', error)
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!isSubmitting) {
          form.reset()
          onOpenChange(state)
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the category here. ' : 'Create category here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='category-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

        {/* description Form using textarea */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                      <FormLabel className='col-span-2 text-right'>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter description'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button 
            type='submit' 
            form='category-form'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}