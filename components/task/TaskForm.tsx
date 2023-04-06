import { useCaseDashboard } from "@/hooks/case.hook";
import { useToast } from "@/hooks/toast.hook";
import { $date } from "@/plugins/date";
import { $gql, $http } from "@/plugins/http";
import { $user } from "@/store/auth.store";
import { classNames } from "@/utils/classname";
import { debounce } from "@/utils/debounce";
import { useStore } from "effector-react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Editor } from "../ui/editor/Editor";
import { FieldError, Form, Input, Label, Select } from "../ui/form";
import { MultiSelect } from "../ui/multi-select/MultiSelect";
import { PRIORITY_OPTIONS, TAG_OPTIONS } from "./utilities";

interface ITaskFormProps {
  task?: any;
  onSaved?: (task: any) => any;
}

const categoryOptions = ["journal", "hearing", "trial", "meeting"];

const SEARCH_USERS_QUERY = `
  query($search: String, $exceptUsers: [ID!]) {
    users:search_users(search: $search, exceptUsers: $exceptUsers) {
      data {
        id
        name
        email
      }
    }
  }
`

export const TaskForm: React.FC<ITaskFormProps> = ({ task, onSaved }) => {
  const [courtCase] = useCaseDashboard();

  const router = useRouter();
  const toast = useToast();
  const user = useStore($user);

  const [name, setName] = useState(task?.name ?? "");
  const [due_date, setDueDate] = useState(() => {
    return $date(task?.due_date).format("YYYY-MM-DD") ?? ""
  });
  const [category, setCategory] = useState(task?.category ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [tags, setTags] = useState<string[]>(() => {
    if (task?.tags) {
      return task.tags.map((tag: any) => tag.name)
    }

    return []
  });
  const [time, setTime] = useState(task?.time ?? "");
  const [location, setLocation] = useState(task?.location ?? "");

  const [users, setUsers] = useState<any[]>([]);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const isTagSelected = useCallback((option: string) => {
    return tags.includes(option);
  }, [tags]);

  const handleTagChange = (option: string) => () => {
    setTags(prev => {
      if (prev.includes(option)) {
        return prev.filter(prevTag => prevTag !== option);
      }

      return [...prev, option];
    })
  }

  /** Create or update task depend on task props */
  const saveTask = async () => {
    setLoading(true);
    const method = !!task ? "patch" : "post";
    const url = !!task ? `/tasks/${task.id}` : "/tasks";

    try {
      const data = await $http({
        method,
        url,
        data: {
          name,
          due_date,
          category,
          priority,
          description,
          tags,
          location,
          time,
          users: users.map(user => user.id),
          court_case_id: courtCase?.id
        }
      })

      if (onSaved) {
        onSaved(data);
      }

      toast.show({
        message: `Task ${!!task ? "Updated" : "Created"}`
      });

      router.back();
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const searchUsers = debounce(async (search: string) => {
    if (!!search) {
      try {
        const data = await $gql({
          query: SEARCH_USERS_QUERY,
          variables: {
            search: `%${search}%`,
            exceptUsers: [user.id]
          }
        });

        setUserOptions(data.users.data)
      } catch (error) {

      }
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-8">
      <h2 className="text-xl font-medium text-natural-13 mb-4">To Do Information</h2>

      <Form className="space-y-4" onSubmitPrevent={saveTask}>
        <div className="grid grid-cols lg:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input onChangeText={setName} value={name} />

            <FieldError name="name" />
          </div>

          <div>
            <Label>Due Date</Label>
            <Input type="date" onChangeText={setDueDate} value={due_date} />

            <FieldError name="due_date" />
          </div>
        </div>

        <div className="grid grid-cols lg:grid-cols-2 gap-4">
          <div>
            <Label>Tags</Label>

            <div className="space-x-2">
              {TAG_OPTIONS.map(option => (
                <button
                  type="button"
                  key={option.value}
                  className={
                    classNames(
                      "capitalize rounded-full px-6 py-1.5 text-sm",
                      isTagSelected(option.value) ? "bg-natural-10 text-white" : "border border-natural-10"
                    )
                  }
                  onClick={handleTagChange(option.value)}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols lg:grid-cols-2 gap-4">
          <div>
            <Label>Time</Label>

            <Input type="time" onChangeText={setTime} value={time} />

            <FieldError name="time" />
          </div>

          <div>
            <Label>Location</Label>

            <Input onChangeText={setLocation} value={location} />

            <FieldError name="location" />
          </div>
        </div>

        <div className="grid grid-cols lg:grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select appendClassName="capitalize" onChangeValue={setCategory} value={category}>
              <option value="">Select Category</option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>

            <FieldError name="category" />
          </div>

          <div>
            <Label>Priority</Label>
            <Select appendClassName="capitalize" onChangeValue={setPriority} value={priority}>
              <option value="">Select Priority</option>
              {PRIORITY_OPTIONS.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.name}</option>
              ))}
            </Select>

            <FieldError name="priority" />
          </div>
        </div>

        {!task && (
          <div>
            <Label>Assign Users</Label>
            <MultiSelect
              keyBy="id"
              labelBy="name"
              placeholder="Search users to assign"
              onInput={searchUsers}
              options={userOptions}
              onValueChange={setUsers}
            />
          </div>
        )}

        <div>
          <Label>Description</Label>
          <Editor onHTMLChange={setDescription} content={description} />

          <FieldError name="description" />
        </div>

        <div>
          <Button type="submit" isLoading={loading}>
            {!!task ? "Update To Do" : "Save To Do"}
          </Button>
        </div>
      </Form>
    </div>
  )
}
