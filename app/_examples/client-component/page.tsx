'use client'

// TODO: Duplicate or move this file outside the _examples folder to make it a route

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
const [products, setProducts] = useState<any[]>([])

// Create a Supabase client configured to use cookies
const supabase = createClientComponentClient()

useEffect(() => {
const getProducts = async () => {
// This assumes you have a products table in Supabase. Check out
// the Create Table and seed with data section of the README 👇
// https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
const { data } = await supabase.from('products').select()
if (data) {
setProducts(data)
}
}

getProducts()
}, [supabase, setProducts])

return <pre>{JSON.stringify(products, null, 2)}</pre>
}