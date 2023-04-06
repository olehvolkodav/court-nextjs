import { useToast } from "@/hooks/toast.hook"
import { $date } from "@/plugins/date"
import { $http } from "@/plugins/http"
import Link from "next/link"
import { Badge } from "../ui/Badge"
import { NextLink } from "../ui/link"

interface Props {
  onProductUpdate?: (product: any) => void
  product: any;
}

export const ProductList: React.FC<Props> = ({product, onProductUpdate}) => {
  const toast = useToast();

  const removeProduct = async() => {
    try {
      await $http.delete(`/admin/products/${product.id}`);

      toast.show({message: "Product deleted!"});

      if (onProductUpdate) {
        onProductUpdate(product);
      }
    } catch (error) {

    }
  }

  const publishProduct = async() => {
    try {
      await $http.patch(`/admin/products/${product.id}/publish`);

      toast.show({message: "Product published!"});
      if (onProductUpdate) {
        onProductUpdate(product);
      }
    } catch (error) {
    }
  }

  return (
    <tr>
      <td>
        <Link href={`/super-admin/products/${product.id}`}>
          <a className="text-primary-1 font-medium">{product.name}</a>
        </Link>
      </td>
      <td>
        {!product.prices.length ? "No prices" : `${product.prices.length} Prices`}
      </td>
      <td>
        <Badge className="capitalize">
          {product.status}
        </Badge>
      </td>
      <td>
        {$date(product.created_at).format("YYYY-MM-DD hh:mm A")}
      </td>
      <td>
        <NextLink href={`/super-admin/products/${product.id}/edit`}>
          <a className="text-primary-1 font-medium">Edit</a>
        </NextLink>
        {
          product.status === "draft" && (
          <>
            <button
              type="button"
              onClick={publishProduct}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Publish
            </button>

            <button
              type="button"
              onClick={removeProduct}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >Delete
            </button>
          </>
          )
        }
      </td>
    </tr>
  )
}
