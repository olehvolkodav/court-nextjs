import React, { ChangeEvent, useState } from "react";
import { Form } from "@/components/ui/form";
import { useCampaign } from "@/context/campaign.context";
import { Button } from "@/components/ui/button";
import { RecipientModal } from "../recipient/RecipientModal";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/outline";
import { Combobox } from "@headlessui/react";
import { classNames } from "@/utils/classname";
import { debounce } from "@/utils/debounce";
import { $gql } from "@/plugins/http";
import { Loading } from "@/components/ui/loading/Loading";

const SEARCH_RECIPIENTS_QUERY = `
  query($search: String) {
    recipients(search: $search, first: 10) {
      data {
        id
        name
        email
      }
    }
    tags(type: "recipient", search: $search, first: 10) {
      data {
        id
        name
        recipients_count
      }
    }
  }
`

export const RecipientsForm: React.FC = () => {
  const {state, dispatch} = useCampaign();

  const [recipientOptions, setRecipientOptions] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = () => {
    dispatch({
      type: "step",
      value: "summary"
    })
  }

  const handleBack = () => {
    dispatch({
      type: "step",
      value: "sequence"
    })
  }

  const handleRecipientAdded = (payload: Record<string, any>) => {
    dispatch({
      type: "recipients",
      value: payload,
    })

    setModalOpen(false)
  }

  const searchRecipients = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    if (!!e.target.value) {
      setIsSearching(true);

      try {
        const data = await $gql({
          query: SEARCH_RECIPIENTS_QUERY,
          variables: {
            search: `%${e.target.value}%`
          }
        });

        setRecipientOptions(
          [
            ...data?.recipients.data.map((recipient: any) => ({
              ...recipient,
              type: "recipient"
            })),
            ...data?.tags.data.map((tag: any) => ({
              ...tag,
              type: "tag",
            }))
          ]
        );
      } catch (error) {

      } finally {
        setIsSearching(false);
      }
    }
  });

  const selectOption = (option: any) => {
    dispatch({
      type:  option.type === "recipient" ? "recipients" : "tags",
      value: option
    })
  }

  const removeOption = (option: any) => () => {
    dispatch({
      type:  option.type === "recipient" ? "recipients" : "tags",
      value: option.id,
    })
  }

  return (
    <div>
      <Form onSubmitPrevent={handleSubmit}>
        <div className="space-y-4 max-w-screen-md mx-auto mb-4">
          <div className="text-center">
            <h2 className="mt-2 text-lg font-medium text-gray-900">Add Recipients</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add recipients, this will only apply on Instant sequences
            </p>
          </div>

          <div className="flex items-center">
            <Combobox value={search} onChange={selectOption} as="div" className="flex-1">
              <div className="relative">
                <Combobox.Input
                  onChange={searchRecipients}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md read-only:bg-gray-50"
                  placeholder="Search recipient name, email, or tags"
                />

                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {isSearching && (
                    <div className="flex justify-center py-2 px-3">
                      <Loading />
                    </div>
                  )}

                  {!recipientOptions.length && (
                    <div className="flex justify-center py-2 px-3">
                      <p>
                        No Recipients found, try to change your search input
                      </p>
                    </div>
                  )}

                  {recipientOptions.map((recipient) => (
                    <Combobox.Option
                      key={`${recipient.type}-${recipient.id}`}
                      value={recipient}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-indigo-600 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <span className={classNames("block truncate", selected && "font-semibold")}>{recipient.name}</span>

                          <span
                            className={classNames(
                              "absolute inset-y-0 right-0 flex items-center pr-4 capitalize",
                              active ? "text-white" : "text-gray-700"
                            )}
                          >
                            {recipient.type}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>

            <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
              <Button color="default" onClick={() => setModalOpen(true)}>
                + New Recipient
              </Button>
            </div>
          </div>

          <ul role="list" className="mt-4 border-b border-gray-200 divide-y divide-gray-200">
            {state?.recipients.map((recipient) => (
              <li key={recipient.id} className="py-4 flex items-center justify-between space-x-3">
                <div className="min-w-0 flex-1 flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{recipient.name}</p>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {recipient.email}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button type="button" className="text-red-500" onClick={removeOption(recipient)}>
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}

            {state?.tags.map((tag) => (
              <li key={tag.id} className="py-4 flex items-center justify-between space-x-3">
                <div className="min-w-0 flex-1 flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{tag.name}</p>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {tag.recipients_count} Recipients
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button type="button" className="text-red-500" onClick={removeOption(tag)}>
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-x-4 flex items-center">
          <button type="button" className="text-gray-700 inline-flex items-center" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>

          <Button type="submit" disabled={!state?.recipients.length}>Review Campaign</Button>
        </div>
      </Form>
      <RecipientModal isOpen={modalOpen} onRecipientAdded={handleRecipientAdded} onClose={setModalOpen} />
    </div>
  )
}
