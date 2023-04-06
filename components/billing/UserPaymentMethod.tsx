import React from "react";

import MasterCardIcon from "@/components/icons/MasterCardIcon";
import { useCaseDashboard } from "@/hooks/case.hook";
import Link from "next/link";
import { $date } from "@/plugins/date";

interface IUserPaymentMethod {
  paymentMethod: any;
  subscription?: any;
}

export const UserPaymentMethod: React.FC<IUserPaymentMethod> = ({paymentMethod, subscription}) => {
  const [courtCase] = useCaseDashboard();

  return (
    <div className="w-2.9/5 px-10 py-8 bg-[#6200EE] rounded-lg">
      <div className="flex items-center justify-between mb-9">
        <p className="text-white text-base">
          Payment Details
        </p>
        <Link
          href={`/dashboard/${courtCase.id}/profile/billing/payment`}
        >
          <a className="text-white text-base cursor-pointer">
            Edit
          </a>
        </Link>
      </div>
      <div className="flex items-center justify-start mb-9">
        <MasterCardIcon />
        <div className="ml-4">
          <p className="text-white text-base font-semibold mb-3">
            <span className="mr-3.5">
              ...
            </span>
            <span className="mr-3.5">
              ...
            </span>
            <span className="mr-3.5">
              ...
            </span>
            <span>
              {paymentMethod.card.last4}
            </span>
          </p>
          <p className="text-white text-base font-medium">
            {`${paymentMethod.card.brand} - Expires ${("0" + paymentMethod.card.exp_month.toString()).slice(-2)}/${paymentMethod.card.exp_year % 100}`}
          </p>
        </div>
      </div>

      {!!subscription && (
        <div>
          <p className="text-lg text-white">
            Next billing on
            <span className="font-semibold ml-2">
              {$date(subscription.next_billing_at).format("MMM DD, YYYY")}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
