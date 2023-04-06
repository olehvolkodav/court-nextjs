import React, { useMemo } from "react";
import { MentionInput } from "@/components/file/MentionInput";
import { useCaseDashboard } from "@/hooks/case.hook";
import { OnChangeHandlerFunc } from "react-mentions";
import { useStore } from "effector-react";
import { $user } from "@/store/auth.store";

interface Props {
  onChange: OnChangeHandlerFunc;
  value: string;
}

export const MentionInputWrapper: React.FC<Props> = ({ value, onChange }) => {
  const [courtCase] = useCaseDashboard();
  const { users } = courtCase;
  const user = useStore($user);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.id != user.id);
  }, [users, user?.id]);

  return (
    <MentionInput users={filteredUsers} value={value} onChange={onChange} />
  );
};
