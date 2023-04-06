import { useState } from "react"

import { Button } from "../ui/button";
import { Editor } from "../ui/editor";
import { FieldError, Form, Input, Label, Select } from "../ui/form"
import { FileUpload } from "../ui/file-upload/FileUpload";

import { EVENT_CATEGORY_TYPES } from "@/constants/event-category";
import { useCaseDashboard, useCaseRouter } from "@/hooks/case.hook";
import { useTagsButton } from "@/hooks/tags-button.hook";
import { $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { useUpload } from "@/hooks/upload.hook";

const tagOptions = ["personal", "kids", "meeting", "activity"];

export const EventForm: React.FC<{event?: any}> = ({event}) => {
  const [courtCase] = useCaseDashboard();
  const {tags, isTagSelected, handleTagChange} = useTagsButton();
  const caseRouter = useCaseRouter();
  const { files, appendFile, removeFile } = useUpload();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);

  const saveEvent = async() => {
    setLoading(true);

    try {
      const payload = {
        name,
        date,
        time,
        location,
        notes,
        tags,
        category,
        files: files.map(file => file.id),
        court_case_id: courtCase.id
      }

      const url = !!event ? `/court-events/${event.id}` : "/court-events";
      const method = !!event ? "PATCH" : "POST";

      await $http({
        method,
        url,
        data: payload,
      })

      caseRouter.replace("daily-journal")
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Form onSubmitPrevent={saveEvent}>
        <div className="bg-white rounded-lg shadow-sm px-6 py-4 space-y-4">
          <h3 className="text-natural-13 font-medium text-2xl mb-[26px]">Event Information</h3>
          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            <div>
              <Label className="text-natural-13 text-sm mb-1">Event Name</Label>
              <Input placeholder="Event Name" value={name} onChangeText={setName} />

              <FieldError name="name" />
            </div>

            <div>
              <Label className="text-natural-13 text-sm mb-1">Event Date</Label>
              <Input type="date" placeholder="Event Date" value={date} onChangeText={setDate} />

              <FieldError name="date" />
            </div>
          </div>

          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            <div>
              <Label className="text-natural-13 text-sm">Time</Label>
              <Input type="time" placeholder="Event Time" value={time} onChangeText={setTime} />

              <FieldError name="time" />
            </div>

            <div>
              <Label className="text-natural-13 text-sm mb-1">Location</Label>
              <Input placeholder="Event Location" value={location} onChangeText={setLocation} />

              <FieldError name="location" />
            </div>
          </div>

          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            <div>
              <Label className="text-natural-13 text-sm mb-1">Tags</Label>

              <div className="space-x-2">
                {tagOptions.map(option => (
                  <button
                    type="button"
                    key={option}
                    className={
                      classNames(
                        "capitalize rounded-full px-6 py-1.5 text-sm border border-natural-10",
                        isTagSelected(option) ? "bg-natural-10 text-white" : ""
                      )
                    }
                    onClick={handleTagChange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-natural-13 text-sm mb-1">Category</Label>
              <Select value={category} onChangeValue={setCategory}>
                <option value="">Select Category</option>
                {EVENT_CATEGORY_TYPES.map((eventCategory) => (
                  <option value={eventCategory.value} key={eventCategory.value}>
                    {eventCategory.name}
                  </option>
                ))}
              </Select>

              <FieldError name="category" />
            </div>
          </div>

          <div>
            <Label className="text-natural-13 text-sm mb-1">Add File</Label>

            <FileUpload
              extraDescription="SVG, PNG, JPG or GIF (max 400 x 400px)"
              files={files}
              onUploaded={appendFile}
              onFileDeleted={removeFile}
            />
          </div>

          <div>
            <Label className="text-natural-13 text-sm mb-1">Notes</Label>
            <Editor content={notes} onHTMLChange={setNotes} limit={500}>
              {({characters}) => (
                <>
                  <FieldError name="main_points" />

                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <p>Maximum 1200 characters</p>

                    <p>{characters} / 1200</p>
                  </div>
                </>
              )}
            </Editor>

            <FieldError name="notes" />
          </div>

          <div>
            <Button type="submit" className="min-w-[100px]" isLoading={loading}>
              Save
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
