import { useCaseDashboard } from "@/hooks/case.hook"
import { useToast } from "@/hooks/toast.hook"
import { $date } from "@/plugins/date"
import { $http } from "@/plugins/http"
import { createRadioOptions } from "@/utils/options"
import { useRouter } from "next/router"
import { useState } from "react"
import { Button } from "../ui/button"
import { Editor } from "../ui/editor"
import { FileUpload } from "../ui/file-upload/FileUpload"
import { FieldError, Form, Input, Label } from "../ui/form"
import { TagInput } from "../ui/multi-select/TagInput"
import { RadioSelection } from "../ui/radio/RadioSelection"

const categoryOptions = createRadioOptions(["my_pleadings", "opposition_pleadings", "court_orders"]);

export const CourtDocumentForm: React.FC<{ courtDocument?: any }> = ({ courtDocument }) => {
  const [courtCase] = useCaseDashboard()

  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState(courtDocument?.title || "");
  const [description, setDescription] = useState(courtDocument?.description || "");
  const [category, setCategory] = useState(courtDocument?.category || "my_pleadings");
  const [tags, setTags] = useState<string[]>(courtDocument?.tags.map((tag: any) => tag.name) || []);
  const [files, setFiles] = useState<any[]>(courtDocument?.files || []);
  const [date, setDate] = useState(() => {
    return $date(courtDocument?.date).format("YYYY-MM-DD") ?? ""
  });

  const goBack = () => router.back();

  const [loading, setLoading] = useState(false);

  const handleUpload = (file: File) => {
    setFiles(prev => [...prev, file]);
  }

  const removeFile = (file: any) => {
    setFiles(prev => prev.filter(prevFile => prevFile.id != file.id));
  }

  /** Save document to api */
  const saveDocument = async () => {
    setLoading(true);

    const method = courtDocument?.id ? "PATCH" : "POST";
    const url = courtDocument?.id ? `/court-documents/${courtDocument.id}` : "/court-documents";

    try {
      await $http({
        method,
        url,
        data: {
          title,
          description,
          category,
          tags,
          date,
          files: files.map(file => file.id),
          court_case_id: courtCase.id,
        }
      });

      // toast and go back
      toast.show({ message: "Document saved!" });
      goBack();
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmitPrevent={saveDocument}>
      <div className="grid grid-cols lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 space-y-4">
            <div>
              <h2 className="text-xl font-medium text-natural-13">Document Information</h2>
            </div>

            <div>
              <Label>Document Title</Label>
              <Input value={title} onChangeText={setTitle} />

              <FieldError name="title" />
            </div>

            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChangeText={setDate} />

              <FieldError name="date" />
            </div>

            <div>
              <Label>Document Description</Label>

              <Editor onHTMLChange={setDescription} content={description} limit={500}>
                {({ characters }) => (
                  <>
                    <FieldError name="main_points" />

                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <p>Maximum 500 characters</p>

                      <p>{characters} / 500</p>
                    </div>
                  </>
                )}
              </Editor>
            </div>

            <div>
              <Label>Category</Label>

              <RadioSelection options={categoryOptions} value={category} onChange={setCategory} />

              <FieldError name="category" />
            </div>

            <div>
              <Label>Tags</Label>

              <TagInput onChange={setTags} maxTag={5} value={tags} />
            </div>

            <div>
              <FileUpload
                files={files}
                onUploaded={handleUpload}
                onFileDeleted={removeFile}
              />

              <FieldError name="files" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t flex justify-end space-x-2 px-4 py-2 mt-4">
        <Button color="default" className="bg-white" onClick={goBack}>
          Cancel
        </Button>

        <Button type="submit" isLoading={loading}>Save Document</Button>
      </div>
    </Form>
  )
}
