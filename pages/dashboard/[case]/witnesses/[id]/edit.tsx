import { NextPage } from "next";
import React from "react";
import { useRouter } from "next/router";
import { $gql, $http } from "@/plugins/http";
import { WitnessForm } from "@/components/witness/WitnessForm";
import { useToast } from "@/hooks/toast.hook";
import { withDashboardLayout } from "@/hoc/layout";
import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";
import { useCaseRouter } from "@/hooks/case.hook";

const FIND_WITNESS = `
  query($id: ID!) {
    witness: my_witness(id: $id) {
      id
      name
      first_name
      last_name
      address
      phone_number
      email
      phone
      type
      relation
      status
      organization
      address
      main_points
      label
      credibility_issue
      created_at
      files {
        ${DEFAULT_FILE_QUERY}
      }
    }
  }
`

const EditWitnessPage: NextPage = () => {
  const caseRouter = useCaseRouter();
  const router = useRouter();
  const toast = useToast();

  const [witness, setWitness] = React.useState<any>(null);

  const [loading, setLoading] = React.useState(false);

  const updateWitness = async(data: any) => {
    setLoading(true);

    try {
      await $http.patch(`/witnesses/${router.query.id}`, data);

      toast.show({message: "Witness Updated"});
      caseRouter.replace("witnesses")
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const findWitness = async() => {
      try {
        const data = await $gql({
          query: FIND_WITNESS,
          variables: {
            id: router.query.id
          }
        });

        setWitness(data.witness);
      } catch (error) {

      }
    }

    if (router.query.id) {
      findWitness()
    }
  }, [router.query.id]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex mb-4">
          <h1 className="text-2xl text-natural-13 font-medium">Edit Witness</h1>
        </div>

        <div className="grid grid-cols lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            {!!witness && (
              <WitnessForm loading={loading} onSubmit={updateWitness} witness={witness} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withDashboardLayout(EditWitnessPage, "Court - Edit Witness");
