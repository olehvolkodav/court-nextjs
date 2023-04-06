import React, { useState } from "react"
import { withAdminLayout } from "@/hoc/layout";
import { useRouter } from "next/router";
import { $http } from "@/plugins/http";
import { useToast } from "@/hooks/toast.hook";
import { ProductForm } from "@/components/product/ProductForm";
import { GetServerSideProps } from "next";

const CreateProductPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const saveProduct = async(fieldObj: any) => {
    setLoading(true);
    try {
      await $http.post("/admin/products", fieldObj);
      toast.show({message: "Product created!"});
      router.replace(`/super-admin/products`);
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex mb-4">
          <h1 className="font-medium text-2xl text-gray-800">Add Product</h1>
        </div>
        <div className="grid grid-cols lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <ProductForm loading={loading} onSubmit={saveProduct} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async() => {
  return {
    notFound: true,
  }
}

export default withAdminLayout(CreateProductPage, "Court - Create Product");
