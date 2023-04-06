import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { DocumentTextIcon, PencilIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { SortableContainer, SortableContainerProps, SortableElement, SortableElementProps, SortableHandle } from "react-sortable-hoc";

import { Badge } from "../ui/Badge";

import { useCaseRouter } from "@/hooks/case.hook";
import { useToast } from "@/hooks/toast.hook";
import { $date } from "@/plugins/date";
import { $gql } from "@/plugins/http";
import { $fileActions } from "@/store/file.store";

interface Props {
  evidence: any;
  courtCase?: any;
  isBorderLess?:boolean
}

const UPDATE_EVIDENCE_MUTATION = `
  mutation($id: ID!, $title: String) {
    updateEvidence(id: $id, title: $title) {
      id
      title
    }
  }
`;

interface IChildren {
  children: any;
}

const DraggableContainer = SortableContainer<IChildren & SortableContainerProps>(({ children }) => children);
const DraggableItem = SortableElement<IChildren & SortableElementProps>(({ children }) => children);
const DraggableHandle = SortableHandle<IChildren>(({ children }) => children);

export const EvidenceList: React.FC<Props> = ({ evidence,isBorderLess }) => {
  const caseRouter = useCaseRouter();
  const router = useRouter();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(evidence.title ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  const toEvidenceFiles = () => {
    caseRouter.push(`evidence/${evidence.id}/edit?type=files-only`);
  };

  const handleUpdateEvidence: React.KeyboardEventHandler = async (e) => {
    if (e.key !== "Enter" || !inputRef.current) {
      return;
    }

    setLoading(true);

    try {
      await $gql({
        query: UPDATE_EVIDENCE_MUTATION,
        variables: {
          id: evidence.id,
          title: inputRef.current.value,
        },
      });

      setTitle(inputRef.current.value);
      setIsEditing(false);
    } catch (error) {
      toast.show({
        message: "Something went wrong when updating title",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);
  const setFile = (file: any) => () => $fileActions.setSlideFile(file);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, evidence.title]);

  useEffect(() => {
    setFiles(evidence.files);
  }, [evidence.files]);

  const toEvidenceEdit = () => {
    router.push(`/dashboard/${router.query.case}/evidence/${evidence.id}/edit`);
  }

  const onSortEnd = async ({oldIndex /*drag index*/, newIndex /*drop index*/}) => {
    const data = [...files];
    const [removed] = data.splice(oldIndex, 1);
    data.splice(newIndex, 0, removed);
    setFiles(data);
  };

  return (
    <div className={`${isBorderLess?"":"bg-white shadow overflow-hidden sm:rounded-lg"}`}>
      <div className="px-4 py-5 sm:px-6">
        <div className="flex mb-4 justify-between items-center mb-4">
          {isEditing ? (
            <input
              type="text"
              ref={inputRef}
              onKeyUp={handleUpdateEvidence}
              onBlur={toggleEdit}
              defaultValue={title}
              className="w-full text-xl px-1 rounded leading-6 font-medium text-gray-900 disabled:bg-gray-50"
              disabled={loading}
            />
          ) : (
            <h3
              className="text-xl leading-6 font-medium text-gray-900 cursor-pointer"
              onClick={toggleEdit}
            >
              {title}
            </h3>
          )}

          <div>
            <button
              type="button"
              className="flex flex-1 justify-center font-medium text-gray-700"
              onClick={toEvidenceEdit}
            >
              <PencilIcon className="h-6 w-6 pointer-events-none" />
            </button>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-700">Witnesses</dt>
          </div>

          <div className="sm:col-span-2">
            {evidence.witnesses.length ? (
              <div className="grid grid-cols-2 gap-2">
                {evidence.witnesses.map((witness: any) => (
                  <div key={witness.id}>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={{
                          pathname: "/dashboard/[case]/witnesses/",
                          query: {
                            case: router.query.case,
                          },
                          hash: `#witness-${witness.id}`,
                        }}
                      >
                        <a className="text-natural-13">
                          {witness.name}
                        </a>
                      </Link>
                      {!!witness.label && (
                        <Badge color="primary" size="xs">
                          {witness.label}
                        </Badge>
                      )}
                    </div>

                    <span className="text-sm text-natural-7 capitalize">
                      {witness.relation} Witness
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <dd className="text-sm text-gray-900">No Witnesses</dd>
            )}
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-700">Date Occurred</dt>
          </div>

          <div className="sm:col-span-2">
            <dd className="text-sm text-gray-900">
              <Badge>
                {$date(evidence.date_occurred).format("DD MMMM YYYY")}
              </Badge>
            </dd>
          </div>

          {!!evidence.who_was_present && (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-700">Who Was Present</dt>
              </div>

              <div className="sm:col-span-2">
                <dd className="text-sm text-gray-900">
                  {evidence.who_was_present}
                </dd>
              </div>
            </>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-700">Description</dt>
          </div>

          <div className="sm:col-span-2">
            <dd dangerouslySetInnerHTML={{ __html: evidence.main_points }}></dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-700">
              What Does It Prove
            </dt>
          </div>

          <div className="sm:col-span-2">
            <dd
              dangerouslySetInnerHTML={{ __html: evidence.prove_explanation }}
            ></dd>
          </div>
        </dl>

        {!!files.length && (
          <div className="mt-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </span>
            </div>

            <DraggableContainer
              onSortEnd={onSortEnd}
            >
              <nav
                role="list"
                className="space-y-2 flex flex-col overflow-hidden"
              >
                {files.map((file: any, index: number) => (
                  <DraggableItem
                    key={`item-${index}-${file?.id || "id"}`}
                    index={index}
                  >
                    <div className="flex items-center">
                      <DraggableHandle>
                        <DotsVerticalIcon className="w-4 h-4 cursor-pointer mr-2" />
                      </DraggableHandle>
                      <div className="relative w-[calc(100%-30px)]">
                        <div
                          className="w-full border border-natural-3 rounded-md relative inline-flex pl-3 pr-4 py-3 flex items-center justify-between text-left text-sm bg-natural-3"
                        >
                          <DocumentTextIcon className="h-6 w-6 text-natural-13" />

                          <div className="flex-1 ml-2">
                            <span className="block truncate text-natural-13">
                              {file.name}
                            </span>
                            <span className="text-gray-600">
                              Added {$date(file.created_at).format("DD MMM hh:mm A")}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          data-file-id={file.id}
                          className="absolute inset-0 focus:outline-none"
                          onClick={setFile(file)}
                        >
                          <span className="sr-only">
                            View details for {file.name}
                          </span>
                        </button>                           
                      </div>
                    </div>
                  </DraggableItem>
                ))}
              </nav>
            </DraggableContainer>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={toEvidenceFiles}
            type="button"
            className="text-primary-1 text-sm font-medium rounded-md border-2 border-dashed border-primary-1 px-3 py-2 "
          >
            + Add More Evidence Files
          </button>
        </div>
      </div>
    </div>
  );
};
