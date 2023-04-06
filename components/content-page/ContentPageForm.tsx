import React, {ChangeEventHandler, useEffect, useState} from "react";
import {FieldError, Form, Input, Label} from "@/components/ui/form";
import Tiptap from "@/components/content-page/Tiptap";
import Link from "next/link";
import {$gql} from "@/plugins/http";
import { Button } from "../ui/button";

interface Props {
  handleSubmit: (value: any) => void
  contentPage?: any;
}

const GET_NAVIGATION_QUERY = `
  {
    navigations {
      id
      title
      path
      identifier
    }
  }
`

const ContentPageForm: React.FC<Props> = ({handleSubmit, contentPage}) => {
  const [navigations, setNavigations] = useState<any[]>([]);

  const [content, setContent] = useState(contentPage?.content ?? "");
  const [title, setTitle] = useState(contentPage?.title ?? "");
  const [description, setDescription] = useState(contentPage?.description ?? "");
  const [navigation_id, setNavigation] = useState(contentPage?.navigation_id ?? "");

  const onSubmit = () => {
    handleSubmit({
      content,
      title,
      description,
      navigation_id
    })
  }

  const handleNavigationChange: ChangeEventHandler<HTMLSelectElement> = (e) => setNavigation(e.target.value)

  useEffect(() => {
    const getNavigations = async () => {
      try {
        const data = await $gql({
          query: GET_NAVIGATION_QUERY,
        });

        setNavigations(prev => [...prev, ...data?.navigations]);
      } catch (error) {
      }
    }

    getNavigations();
  }, []);

  return (
    <Form className="bg-white rounded-md content-page-form h-full" onSubmitPrevent={onSubmit}>
      <div className="relative flex relative">
        <div className="fixed bottom-0 border-t inset-x-0 pr-80 bg-white z-10 md:pl-64">
          <div className="flex items-center justify-end px-4 py-2">
            <div className="space-x-2">
              <Link href="/super-admin/content-pages">
                <a
                  className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                  Cancel
                </a>
              </Link>
              <Button
                type="submit"
                onSubmit={onSubmit}
              >
                Save Content
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="pr-64 flex sm:w-auto flex-col flex-1 bg-white py-4 pb-12">
            <div className="border-b mb-8">
              <div className="mb-4">
                <Input
                  placeholder="Title"
                  name="title"
                  id="title"
                  value={title}
                  onChangeText={setTitle}
                  className="border-none p-0 appearance-none w-full text-3xl font-bold focus:outline-none focus:ring-0"
                />
                <FieldError name="title" />
              </div>
              <div className="mb-4">
                <Input
                  placeholder="Page description"
                  name="description"
                  id="description"
                  value={description}
                  onChangeText={setDescription}
                  className="border-0 p-0 appearance-none w-full focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <Tiptap onUpdate={setContent} content={content}/>
            <FieldError name="content" />
          </div>
        </div>

        <div className="flex mt-16 pt-4 fixed z-5 inset-y-0 border-l border-t bg-white right-0 w-64">
          <div className="mb-10 px-4 pr-7">
            <Label htmlFor="navigation_id">
              Add To
            </Label>
            <select
              id="navigation_id"
              name="navigation_id"
              value={navigation_id}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={handleNavigationChange}
            >
              <option value="">Select Any Location</option>
              {
                navigations && navigations.map((navigation, key) => (
                  <option key={key} value={navigation?.id}>{navigation?.title}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default ContentPageForm;