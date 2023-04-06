import { NextPage } from "next";
import React, { useState } from "react";
import { $http } from "@/plugins/http";
import { useToast } from "@/hooks/toast.hook";
import { WitnessForm } from "@/components/witness/WitnessForm";
import { withDashboardLayout } from "@/hoc/layout";
import { useCaseRouter } from "@/hooks/case.hook";

const CreateWitnessPage: NextPage = () => {
  const caseRouter = useCaseRouter();
  const toast = useToast();

  const [ loading, setLoading] = useState(false);

  const addWitness = async(data: any) => {
    setLoading(true);

    try {
      await $http.post("/witnesses", data);

      toast.show({message: "Witness created!"});

      caseRouter.replace("witnesses")
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex mb-4">
          <h1 className="font-semibold text-2xl">
            Add New Witness
          </h1>
        </div>

        <div className="grid grid-cols lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <WitnessForm loading={loading} onSubmit={addWitness} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withDashboardLayout(CreateWitnessPage, "Court - New Witness");
