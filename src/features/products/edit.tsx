// src/pages/products/edit.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "@/hooks/use-toast"
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
import { Product } from '@/features/products/data/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Link } from '@tanstack/react-router'

const editProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  stock: z.string().min(1, 'Stock is required'),
  image: z.custom<File>((v) => v instanceof File, {
    message: "Please upload an image",
  }).optional(),
})

type EditProductForm = z.infer<typeof editProductSchema>

export default function EditProduct() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const navigate = useNavigate()
  const { slug } = useParams({ from: '/_authenticated/products/$slug/edit' })

  const form = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      price: '',
      stock: '',
      image: undefined,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          productService.getProductBySlug(slug),
          categoryService.getCategory()
        ])
        
        // Handle the array response 
        const productItem = Array.isArray(productData) ? productData[0] : productData;
        setProduct(productItem)
        setCategories(categoriesData)
        
        // Set form values
        form.reset({
          name: productItem.name,
          description: productItem.description,
          category_id: productItem.category_id.toString(),
          price: productItem.price.toString(),
          stock: productItem.stock.toString(),
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to fetch product data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [slug])

  const onSubmit = async (data: EditProductForm) => {
    try {
        setLoading(true)
        
        const formData = new FormData()
        
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', data.price.toString())
        formData.append('stock', data.stock.toString())
        formData.append('category_id', data.category_id)
        
        // Keep the existing discount value from the product
        if (product) {
            formData.append('discount', product.discount.toString())
        }
        
        if (data.image) {
            formData.append('image', data.image)
        }
        
        await productService.updateProduct(slug, formData)
        
        toast({
            title: "Success",
            description: "Product has been updated successfully.",
        })
        
        navigate({ to: '/products' })
    } catch (error) {
        console.error('Error updating product:', error)
        toast({
            title: "Error",
            description: "Failed to update product. Please try again.",
            variant: "destructive",
        })
    } finally {
        setLoading(false)
    }
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-4'>
          <Link to="/products">
            <Button variant="ghost" size="icon">
              <IconArrowLeft size={18} />
            </Button>
          </Link>
          <h1 className='text-xl font-semibold'>Edit Product</h1>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                {loading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </Form>
      </Main>
    </>
  )
}