import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from "@/components/ui/file-upload"
import axios from 'axios';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { productService, categoryService } from '@/services/api'
import { Category } from '@/features/category/data/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Link } from '@tanstack/react-router'

import { useAuthStore } from '@/stores/authStore'

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  stock: z.string().min(1, 'Stock is required'),
  image: z.custom<File>((v) => v instanceof File, {
    message: "Please upload an image",
  }).optional(),
})

type CreateProductForm = z.infer<typeof createProductSchema>

export default function CreateProduct() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

const form = useForm<CreateProductForm>({
  resolver: zodResolver(createProductSchema),
  defaultValues: {
    name: '',
    description: '',
    category_id: '',
    price: '',
    stock: '0',
    discount: '0',
    image: 'null,'
  },
})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategory()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (data: CreateProductForm) => {
    try {
      setLoading(true);
      
      // Create FormData
      const formData = new FormData();
      
      // Add all the product data
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock || '0');
      formData.append('discount', '0'); // Always 0 for new products
      formData.append('category_id', data.category_id);
      
      // Add the image if it exists
      if (data.image) {
        formData.append('image', data.image);
      }
      
      // Send the FormData to your API
await axios.post(`${import.meta.env.VITE_API_URL}/product`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${useAuthStore.getState().auth.staff.accessToken}`
  }
});
      
      navigate({ to: '/products' });
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>
        <div className='flex items-center gap-4'>
          <Link to="/products">
            <Button variant="ghost" size="icon">
              <IconArrowLeft size={18} />
            </Button>
          </Link>
          <h1 className='text-xl font-semibold'>Create New Product</h1>
        </div>
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                    <FileUpload
                    onChange={(file) => field.onChange(file)}
                    error={!!form.formState.errors.image}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="flex justify-end gap-4">
              <Link to="/products">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </Main>
    </>
  )
}