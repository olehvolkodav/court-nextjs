import React, { useState } from "react"
import { withAdminLayout } from "@/hoc/layout";
import { useRouter } from "next/router";
import { $http } from "@/plugins/http";
import { useToast } from "@/hooks/toast.hook";
import { $gql } from "@/plugins/http";

import { ProductForm } from "@/components/product/ProductForm";

const PRODUCT_QUERY = `
  query($id: ID!) {
    admin_product(id: $id) {
      id
      name
      slug
      description
      is_private
      created_at
      content
      images {
        id
        name
        size
        status
      }
    }
  }
`

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = React.useState<any>(null);

  const updateProduct = async(payload: FormData) => {
    setLoading(true);

    try {
      payload.append("_method", "put")
      await $http.post(`/admin/products/${product.id}`, payload)
      toast.show({message: "Product updated!"});
      router.replace(`/super-admin/products`);
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const getProduct = async() => {
      const id = router.query.id;

      const data = await $gql({
        query: PRODUCT_QUERY,
        variables: { id }
      });

      setProduct(data.admin_product)
    }

    getProduct();
  }, [router.query.id]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex mb-4">
          <h1 className="font-medium text-2xl text-gray-800">Edit Product</h1>
        </div>
        <div className="grid grid-cols lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            {!!product && (
              <ProductForm loading={loading} onSubmit={updateProduct} product={product} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default withAdminLayout(EditProductPage, "Court - Edit Product");
