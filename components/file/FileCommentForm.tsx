import React, { useState } from "react";
import { OnChangeHandlerFunc } from "react-mentions";
import { Form } from "@/components/ui/form";
import { $http } from "@/plugins/http";
import { Button } from "@/components/ui/button";
import { useStore } from "effector-react";
import { $slideFile } from "@/store/file.store";
import { MentionInputWrapper } from "@/components/file/MentionInputWrapper";
interface Props {
  onCommentAdded?: () => any;
}

export const FileCommentForm: React.FC<Props> = ({ onCommentAdded }) => {
  const file = useStore($slideFile);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange: OnChangeHandlerFunc = (e, newValue) => {
    setBody(newValue);
  };

  const addComment = async () => {
    setLoading(true);

    try {
      await $http.post("/comments", {
        body,
        commentable_type: "file",
        commentable_id: file?.id,
      });

      setBody("");

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start space-x-4 my-6">
      <div className="min-w-0 flex-1">
        <Form className="relative" onSubmitPrevent={addComment}>
          <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <MentionInputWrapper onChange={handleChange} value={body} />
          </div>
          <div className="flex justify-end w-full mt-6">
            <Button
              className="py-3.5 px-9 rounded-lg text-base"
              color="primary"
              type="submit"
              isLoading={loading}
              disabled={!body}
            >
              Add Comment
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
