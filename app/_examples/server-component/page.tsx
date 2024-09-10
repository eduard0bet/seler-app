import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ServerComponent() {
  // Create a Supabase client configured to use cookies
  const supabase = createServerComponentClient({ cookies })

  // Query the "products" table in Supabase
  const { data: products } = await supabase.from('products').select()

  return <pre>{JSON.stringify(products, null, 2)}</pre>
}