import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

export async function loader({context: {storefront}}: LoaderFunctionArgs) {
  const {products} = await storefront.query<{products: {nodes: Product[]}}>(
    `#graphql
      query Products {
        products(first: 10) {
          nodes { id title handle }
        }
      }
    `,
  );

  return json({products: products.nodes || []});
}

export default function Index() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">All Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500 text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
                {product.title}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}