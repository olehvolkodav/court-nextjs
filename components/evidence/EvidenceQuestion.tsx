import { $gql } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

const QUESTIONS_QUERY = `
  query {
    questions(place: "evidence_form") {
      data {
        id
        title
        body
      }
    }
  }
`

export const EvidenceQuestion: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  React.useEffect(() => {
    const getQuestions = async() => {
      try {
        const data = await $gql({
          query: QUESTIONS_QUERY
        });

        setQuestions(data.questions.data);
      } catch (error) {

      }
    }

    getQuestions();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 py-2 border-b">
        <h2 className="text-xl font-bold">Frequently asked questions</h2>
      </div>

      <dl className="divide-y divide-gray-200">
        {questions.map((question) => (
          <Disclosure as="div" key={question.id} className="px-4 py-2">
            {({ open }) => (
              <>
                <dt className="text-lg">
                  <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                    <span className="font-medium text-gray-900">{question.title}</span>
                    <span className="ml-6 h-7 flex items-center">
                      <ChevronDownIcon
                        className={classNames(open ? "-rotate-180" : "rotate-0", "h-6 w-6 transform")}
                        aria-hidden="true"
                      />
                    </span>
                  </Disclosure.Button>
                </dt>
                <Disclosure.Panel as="dd" className="mt-2 pr-12">
                  <p className="text-base text-gray-500">{question.body}</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </dl>
    </div>
  )
}
