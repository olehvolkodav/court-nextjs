import { $http } from "@/plugins/http"
import { createRadioOptions } from "@/utils/options"
import { useRouter } from "next/router";
import { useState } from "react"
import { Button } from "../ui/button";
import { FieldError, Form, Input, Label } from "../ui/form"
import { RadioSelection } from "../ui/radio/RadioSelection";

const durationOptions = createRadioOptions(["forever", "once"]);

interface Props {
  coupon?: any;
}

export const CouponForm: React.FC<Props> = ({coupon}) => {
  const router = useRouter();

  const [name, setName] = useState(coupon?.name || "");
  const [code, setCode] = useState(coupon?.code || "");
  const [type, setType] = useState(coupon?.type || "percent");
  const [percent_off, setPercentOff] = useState(coupon?.percent_off || "");
  const [duration, setDuration] = useState(coupon?.duration || "forever");

  const [loading, setLoading] = useState(false)

  const saveCoupon = async() => {
    setLoading(true)

    try {
      await $http.post("/admin/coupons", {
        name,
        code,
        percent_off,
        type,
        duration
      })

      router.replace("/super-admin/coupons")
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Form onSubmitPrevent={saveCoupon}>
        <div className="px-4 py-2 space-y-4">
          <div>
            <Label>Name</Label>
            <Input placeholder="Coupon Name" value={name} onChangeText={setName} />
            <FieldError name="name" />
          </div>

          <div>
            <Label>Code (optional)</Label>
            <Input placeholder="Coupon Code" value={code} onChangeText={setCode} />
            <FieldError name="code" />

            <p className="text-xs mt-1 text-gray-500">
              Unique Coupon Code, leave blank to autogenerate code
            </p>
          </div>

          <div>
            <Label>Percentage off</Label>
            <div className="lg:max-w-sm w-full">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  onChange={(e) => setPercentOff(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-600">%</span>
                </div>
              </div>
            </div>
            <FieldError name="percent_off" />
          </div>

          <div>
            <Label>Duration</Label>
            <RadioSelection options={durationOptions} value={duration} onChange={setDuration} />
            <FieldError name="duration" />
          </div>
        </div>

        <div className="px-4 py-2 border-t flex space-x-2">
          <Button type="submit" isLoading={loading}>Save Coupon</Button>
          <Button color="default" onClick={router.back}>Cancel</Button>
        </div>
      </Form>
    </div>
  )
}
