import { useToast } from "@/hooks/toast.hook";
import { $http } from "@/plugins/http";
import { useSearchTemplateSWR } from "@/swr/campaign.swr";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Editor } from "../ui/editor";
import { FieldError, Form, Input, Label } from "../ui/form";

export const TemplateForm: React.FC<{ template?: any }> = ({ template }) => {
  const toast = useToast();
  const router = useRouter();

  const [,,, mutate] = useSearchTemplateSWR({load: true});

  const [name, setName] = useState(template?.name ?? "");
  const [body, setBody] = useState(template?.body ?? "");
  const [subject, setSubject] = useState(template?.subject ?? "");

  const [loading, setLoading] = useState(false);

  const saveTemplate = async() => {
    setLoading(true);

    try {
      await $http({
        method: template ? "PATCH" : "POST",
        url: template ? `/admin/templates/${template.id}` : "/admin/templates",
        data: { name, body, subject }
      });

      await mutate()

      toast.show({message: "Template created"});

      router.replace("/super-admin/templates")
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="px-4 py-2 space-y-4 border border-indigo-300 mb-4 rounded-lg">
        <p>
          Available Directive<br />
          Replace <b>`:`</b> prefix to recipient list column, only available on body<br />

          :name - Recipient name<br />
          :email - Recipient email<br />
        </p>
      </div>

      <Form className="bg-white shadow-sm rounded-md" onSubmitPrevent={saveTemplate}>
        <div className="px-4 py-2 space-y-4">
          <div>
            <Label>Name</Label>
            <Input placeholder="Template Name" value={name} onChangeText={setName} />

            <FieldError name="name" />
          </div>

          <div>
            <Label>Subject</Label>
            <Input placeholder="Subject for email subject" value={subject} onChangeText={setSubject} />

            <FieldError name="subject" />
          </div>

          <div>
            <Label>Body</Label>
            <div>
              <Editor content={body} onHTMLChange={setBody} />
            </div>

            <FieldError name="body" />
          </div>
        </div>

        <div className="px-4 py-2 border-t flex justify-start space-x-2">
          <Button type="submit" isLoading={loading}>
            Save Template
          </Button>
        </div>
      </Form>
    </>
  )
}
