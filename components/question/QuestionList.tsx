import { $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { PencilIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { FieldError, Input, Label, Select, Textarea } from "../ui/form";

interface IQuestionListProps {
  question: any;
  onUpdate?: (question: any) => any;
}

const placeOptions = ["evidence_form", "witness_form"];

export const QuestionList: React.FC<IQuestionListProps> = ({question, onUpdate}) => {
  const [title, setTitle] = useState(question?.title ?? "");
  const [body, setBody] = useState(question?.body ?? "");
  const [place, setPlace] = useState(question?.place ?? "");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const editQuestion = () => setIsEditing(true);

  const cancelEditing = () => {
    setIsEditing(false);
  }

  const updateQuestion = async() => {
    setLoading(true);

    try {
      const { data } = await $http.patch(`/admin/questions/${question.id}`, {
        title, body, place
      });

      if (onUpdate) {
        onUpdate(data)
      }

      setIsEditing(false)
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={
      classNames(
        "bg-white shadow-sm rounded-lg px-4 py-6",
        isEditing && "space-y-4"
      )
    }>
      {
        !isEditing ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-natural-13 truncate">
                {question.title}
              </h2>

              <div>
                <button type="button" className="h-6 w-6 text-gray-600" onClick={editQuestion}>
                  <PencilIcon />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {question.body}
            </p>

            {!!question.place && (
              <div className="flex justify-center mt-4">
                <span className="border border-natural-10 rounded-full px-3 py-1.5 text-[#2F275D] capitalize">
                  {question.place.replace("_", " ")}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <Label>Edit Question</Label>
              <Input placeholder="Edit Question" value={title} onChangeText={setTitle} />

              <FieldError name="title" />
            </div>

            <div>
              <Label>Put this question on</Label>
              <Select appendClassName="capitalize" onChangeValue={setPlace} value={place}>
                <option value="">Don&apos;t put anywhere</option>
                {placeOptions.map(option => (
                  <option key={option} className="capitalize" value={option}>
                    {option.replace("_"," ")}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Edit Answer</Label>
              <Textarea value={body} onChangeText={setBody} />

              <FieldError name="body" />
            </div>

            <div className="flex space-x-2">
              <Button onClick={updateQuestion} isLoading={loading}>
                Update Question
              </Button>

              <Button color="default" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </>
        )
      }
    </div>
  )
}
