import { CouponForm } from "@/components/coupon/CouponForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { withAdminLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";

const CreateCouponPage: NextPageWithLayout = () => {
  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <PageHeader title="Create Coupon" className="mb-4" />

        <CouponForm />
      </div>
    </div>
  )
}

export default withAdminLayout(CreateCouponPage, "Court - Coupons");
