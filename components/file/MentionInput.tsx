import React, { useMemo } from "react";
import { MentionsInput, Mention, OnChangeHandlerFunc } from "react-mentions";
import { defaultMentionInputStyle } from "./defaultStyle";

interface Props {
  users: any;
  value: string;
  onChange: OnChangeHandlerFunc;
}

export const MentionInput: React.FC<Props> = ({ users, onChange, value }) => {
  const data = useMemo(() => {
    return users.map((user) => ({ id: user.username, display: user.name }));
  }, [users]);
  return (
    <MentionsInput
      value={value}
      onChange={onChange}
      singleLine={false}
      rows={10}
      name="comment"
      id="comment"
      className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm z-10"
      placeholder="Add your comment..."
      style={defaultMentionInputStyle}
    >
      <Mention
        trigger="@"
        markup="@{{__type__||__id__||__display__}}"
        data={data}
      />
    </MentionsInput>
  );
};
