import { Button } from "@/components/ui/button";
import { FieldError, Form, Input, Label, Select } from "@/components/ui/form";
import { BILLING_INFO_QUERY } from "@/graphql/query/user";
import { useToast } from "@/hooks/toast.hook";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { DashboardLayout } from "@/layouts/dashboard.layout";
import { ProfileLayout } from "@/layouts/sub-layout/profile.layout";
import { $gql, $http } from "@/plugins/http";
import { $user } from "@/store/auth.store";
import { useStore } from "effector-react";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CustomerPage: NextPageWithLayout = () => {
  const router = useRouter();
  const user = useStore($user);
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal_code, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");

  const [loading, setLoading] = useState(false);

  const toBillingPage = () => {
    Router.replace(`/dashboard/${router.query.case}/profile/billing`);
  }

  /** Save Billing using api */
  const saveBillingInformation = async() => {
    setLoading(true);

    try {
      await $http.patch("/auth/billing", {
        name,
        email,
        address: {
          line1,
          line2,
          city,
          state,
          postal_code,
          country,
        }
      })

      setLoading(false);

      toast.show({message: "Billing Information Updated!"});

      toBillingPage();
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getBillingInfo = async() => {
      try {
        const data = await $gql(BILLING_INFO_QUERY);

        const customer = data.me.customer_metadata;

        setName(customer.name);
        setEmail(customer.email ?? user.email);

        if (customer.address) {
          setLine1(customer.address.line1);
          setLine2(customer.address.line2);
          setCity(customer.address.city);
          setState(customer.address.state);
          setPostalCode(customer.address.postal_code);
        }
      } catch (error) {

      }
    }

    getBillingInfo();
  }, [user.email])

  return (
    <>
      <h1 className="sr-only">Court Billing</h1>

      <Form className="bg-white shadow-sm rounded-lg" onSubmitPrevent={saveBillingInformation}>
        <div className="px-4 py-2 space-y-4">
          <div>
            <Label>Name</Label>
            <Input placeholder="name" onChangeText={setName} value={name} />

            <FieldError name="name" />
          </div>

          <div>
            <Label>Email</Label>
            <Input placeholder="email" type="email" onChangeText={setEmail} value={email} />

            <FieldError name="email" />
          </div>

          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            <div>
              <Label>Address Line 1 (P.O. box, company name, c/o)</Label>
              <Input placeholder="Line 1" onChangeText={setLine1} value={line1} />

              <FieldError name="address.line1" />
            </div>

            <div>
              <Label>Address Line 2 (Apartment, suite, unit) optional</Label>
              <Input placeholder="Line 2" onChangeText={setLine2} value={line2} />

              <FieldError name="address.line2" />
            </div>
          </div>

          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input placeholder="city" onChangeText={setCity} value={city} />

              <FieldError name="address.city" />
            </div>

            <div>
              <Label>State</Label>
              <Input placeholder="state" onChangeText={setState} value={state} />

              <FieldError name="address.state" />
            </div>
          </div>

          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            <div>
              <Label>Country</Label>
              <Select value={country} onChangeValue={setCountry}>
                <option value="US">United States</option>
              </Select>

              <FieldError name="address.country" />
            </div>

            <div>
              <Label>Postal/Zip Code</Label>
              <Input placeholder="postal code" onChangeText={setPostalCode} value={postal_code} />

              <FieldError name="address.postal_code" />
            </div>
          </div>
        </div>

        <div className="border-t px-4 py-2 space-x-2 flex">
          <Button type="submit" isLoading={loading}>
            Save Billing Information
          </Button>

          <Button color="default" onClick={toBillingPage}>
            Cancel
          </Button>
        </div>
      </Form>
    </>
  )
}

CustomerPage.getLayout = page => (
  <DashboardLayout title="Court - Billing Information">
    <ProfileLayout>
      {page}
    </ProfileLayout>
  </DashboardLayout>
)

export default CustomerPage;
