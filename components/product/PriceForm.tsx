import React, {useState} from "react";
import { CurrencyInput, FieldError, Form, Input, Label, Textarea } from "@/components/ui/form";
import { RadioOptions, RadioSelection } from "../ui/radio/RadioSelection";
import { Button } from "@/components/ui/button";
import { createRadioOptions } from "@/utils/options";

interface Props {
  onSubmit: (value: any) => void
  loading?: boolean;
  product?: any,
}

const billingOptions: RadioOptions[] = [
  {
    name: "One Time",
    value: "one-time"
  },
  {
    name: "Recurring",
    value: "recurring"
  },
];
const recurringIntervalOptions = createRadioOptions(["day", "month", "year"]);

const visibilityOptions: RadioOptions[] = [
  {
    name: "Public",
    value: false
  },
  {
    name: "Private",
    value: true
  }
];

export const PriceForm: React.FC<Props> = ({onSubmit, loading, product}) => {
  const [billing, setBilling] = useState(product?.type || "one-time")
  const [recurringInterval, setRecurringInterval] = useState(product?.recurring?.interval || "day")
  const [intervalCount, setIntervalCount] = useState<string>(product?.recurring?.interval_count || 1);

  const [visibility, setVisibility] = useState<boolean>(product?.is_private || false)

  const [name, setName] = useState<string>(product?.name ?? "");
  const [description, setDescription] = useState<string>(product?.description ?? "");
  const [price, setPrice] = useState<string>(product?.price ?? "");

  const [image, setImage] = useState<File>();

  const [preview, setPreview] = useState<string>();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  }

  const priceInCent = React.useMemo(() => {
    if (isNaN(parseInt(price))) {
      return undefined;
    }

    return parseInt(price) * 100;
  }, [price]);

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);

    formData.append("is_private", visibility ? "1" : "0");

    if (image) {
      formData.append("image", image)
    }

    onSubmit(formData);
  };

  return (
    <div className="divide-y divide-gray-200 lg:col-span-9">
      <Form className="bg-white shadow-sm rounded-md" onSubmitPrevent={handleSubmit}>
        <div className="px-4 py-2 space-y-4">
          <div>
            <Label>Name</Label>
            <Input onChangeText={setName} defaultValue={name} placeholder="Product Name" />

            <FieldError name="name" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea onChangeText={setDescription} value={description} placeholder="Product Description" />

            <FieldError name="description" />
          </div>

          <div>
            <Label>Billing Type</Label>
            <RadioSelection label="Billing Time" value={billing} options={billingOptions} onChange={setBilling} />
            <FieldError name="type" />
          </div>

          {
            billing === "recurring" && (
              <>
                <div>
                  <Label>Recurring Interval</Label>
                  <RadioSelection label="Recurring Interval" value={recurringInterval} options={recurringIntervalOptions} onChange={setRecurringInterval} />
                  <FieldError name="recurring.interval" />
                </div>

                <div>
                  <Label>Recurring Interval Count</Label>
                  <Input onChangeText={setIntervalCount}  defaultValue={intervalCount} placeholder="Recurring Interval Count" />
                  <FieldError name="recurring.interval_count" />
                </div>
              </>
            )
          }

          <div>
            <Label>Visibility</Label>
            <RadioSelection label="Visibility" value={visibility} options={visibilityOptions} onChange={setVisibility} />
            <FieldError name="is_private" />
          </div>

          <div>
            <Label>Image</Label>

            <div className="sm:grid sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <div className="mt-1 sm:mt-0">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="product-file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input onChange={handleFileChange} id="product-file-upload" name="product-file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            {!!preview &&  <img className='h-24' src={preview} alt="Product Image Preview" /> }
            {!!product?.images.length && <p className='text-xs text-indigo-500 '>{product?.images[0].name}</p>}
          </div>

        </div>

        <div className="px-4 py-2 border-t flex justify-start space-x-2">
          <Button isLoading={loading} type="submit" className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {!!product ? "Update" : "Save"} Product
          </Button>
        </div>
      </Form>
    </div>
  )
}
