import React, { useState } from "react";
import { $date } from "@/plugins/date";

import ReplyIcon from "@/components/icons/ReplyIcon";
import { FileCommentList } from "./FileCommentList";

import { Button } from "@/components/ui/button";
import { classNames } from "@/utils/classname";
import { Form } from "@/components/ui/form";
import { $http } from "@/plugins/http";
import { useStore } from "effector-react";
import { $slideFile } from "@/store/file.store";
import { swapTags } from "@/components/file/utilities";
import { OnChangeHandlerFunc } from "react-mentions";
import { MentionInputWrapper } from "@/components/file/MentionInputWrapper";

interface Props {
  count: number;
  comment: any;
  isSubComment: boolean;
  onCommentAdded?: () => any;
  parentId?: number;
}

const FileComment: React.FC<Props> = ({
  count,
  comment,
  isSubComment,
  parentId,
  onCommentAdded,
}) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const file = useStore($slideFile);

  const handleChange: OnChangeHandlerFunc = (e, newValue) => {
    setBody(newValue);
  };

  const addComment = async () => {
    setLoading(true);

    try {
      const commentBody: any = {
        body,
        commentable_type: "file",
        commentable_id: file?.id,
      };

      if (parentId) {
        commentBody.parent_id = parentId;
      }
      await $http.post("/comments", commentBody);

      setBody("");

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setShowReply(false);
    }
  };

  return (
    <>
      <li
        className={classNames(
          "pt-4 pb-6",
          isSubComment && "border-b border-natural-5"
        )}
      >
        <div className="relative">
          <div className="relative flex items-start space-x-2">
            <div className="relative">
              <img
                className="h-7 w-7 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1 mt-1">
              <div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {comment.user?.name}
                  </span>
                  <span className="text-[10px] font-medium text-natural-7 ml-2">
                    {$date().from(comment.created_at)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-700 py-2">
                <p>{swapTags(comment.body)}</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setShowReply(true);
                }}
              >
                <ReplyIcon />
                <span className="text-natural-7 text-sm font-normal">
                  Reply
                </span>
              </div>
            </div>
          </div>
        </div>
        {showReply && (
          <Form className="relative" onSubmitPrevent={addComment}>
            <div className="mt-4 flex space-x-4">
              <MentionInputWrapper onChange={handleChange} value={body} />
              <Button
                className="py-1 px-9 rounded-lg text-base h-full items-end"
                color="primary"
                type="submit"
                isLoading={loading}
              >
                Add
              </Button>
            </div>
          </Form>
        )}
      </li>

      <FileCommentList
        count={count}
        comments={comment.children}
        isSubComment
        onCommentAdded={onCommentAdded}
      />
    </>
  );
};

export default FileComment;
