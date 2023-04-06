import { CASE_ROLE } from "@/constants/role";
import { $user } from "@/store/auth.store";
import { useStore } from "effector-react";
import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { AddPartyModal } from "./AddPartyModal";

export const CaseParty: React.FC<{courtCase: any}> = ({courtCase}) => {
  const user = useStore($user);
  const [open, setOpen] = useState(false);

  const myUser = React.useMemo(() => {
    return courtCase?.users.find((courtUser: any) => courtUser.id == user?.id)
  }, [courtCase, user?.id]);

  const hasPermission = React.useMemo(() => {
    if (courtCase?.status !== "in_progress") {
      return false;
    }

    return myUser?.party.role === CASE_ROLE.OWNER;
  }, [myUser?.party.role, courtCase?.status]);

  const openAddParty = () => setOpen(true);

  return (
    <>
      <div className="bg-white shadow-sm rounded-md px-4 py-2">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-gray-500">Case Parties</h2>

            {hasPermission && (
              <Button onClick={openAddParty}>
                + Add Party
              </Button>
            )}
          </div>

          <div className="grid grid-cols lg:grid-cols-3 gap-4">
            {courtCase?.users.map((person: any) => (
              <div
                key={person.id}
                className="p-4 lg:p-6 border border-natural-4 text-natural-13 rounded-lg"
              >
                <div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">{person.name}</p>
                    {user.id === person.id && (
                      <Badge size="sm">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate capitalize">{person.party.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!!courtCase && <AddPartyModal isOpen={open} courtCase={courtCase} onClose={setOpen} />}
    </>
  )
}
