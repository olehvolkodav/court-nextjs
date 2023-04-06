import { RecipientModal } from "@/components/super-admin/recipient/RecipientModal";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading/Loading";
import { withCampaignLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { classNames } from "@/utils/classname";
import { debounce } from "@/utils/debounce";
import { Combobox } from "@headlessui/react";
import { ChangeEvent, useState } from "react";

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

const CampaignRecipientsPage: NextPageWithLayout = () => {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recipientOptions, setRecipientOptions] = useState<any[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const selectOption = (option: any) => {

  }

  const searchRecipients = debounce(async(e: ChangeEvent<HTMLInputElement>) => {
    if (!!e.target.value) {
      setIsSearching(true);

      try {

      } catch (error) {

      } finally {
        setIsSearching(false);
      }
    }
  })

  return (
    <div>
      <div className="max-w-screen-md mx-auto mb-4">
        <div className="text-center mb-4">
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
            <Button color="default" onClick={() => setModalOpen(true)} className="bg-white">
              + New Recipient
            </Button>
          </div>
        </div>
      </div>

      <RecipientModal isOpen={modalOpen} onClose={setModalOpen} />
    </div>
  )
}

export default withCampaignLayout(CampaignRecipientsPage, "Campaign - Recipients");
