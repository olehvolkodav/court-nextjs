import React, { useMemo } from "react";
import FileComment from "@/components/file/FileComment";
import { useFile } from "@/swr/file.swr";
import { useStore } from "effector-react";
import { $slideFile } from "@/store/file.store";

export const FileCommentList: React.FC<{
  count?: number;
  comments: any[];
  isSubComment?: boolean;
  onCommentAdded?: () => any;
}> = ({ count = 0, isSubComment, onCommentAdded, comments }) => {
  const file = useStore($slideFile);
  const [fetchFile] = useFile(file?.id);

  const fileComments = useMemo(() => {
    return fetchFile?.comments?.data || [];
  }, [fetchFile?.comments?.data]);

  const filteredComments = useMemo(() => {
    return fileComments.filter((comment) => !comment.parent);
  }, [fileComments]);

  const commentsToRender = isSubComment ? comments : filteredComments;

  return (
    <div className="flow-root">
      <ul role="list" style={{ paddingLeft: `${count * 36}px` }}>
        {commentsToRender.map((comment) => {
          const childrenComments = fileComments.filter(
            (c) => comment.id === c.parent?.id
          );
          return (
            <FileComment
              key={comment.id}
              count={childrenComments.length}
              comment={{ ...comment, children: childrenComments }}
              parentId={+comment.id}
              isSubComment={!!childrenComments.length}
              onCommentAdded={onCommentAdded}
            />
          );
        })}
        {!commentsToRender.length && !isSubComment && (
          <li>
            <p className="text-center text-gray-700">
              No Comments found in this file
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};
