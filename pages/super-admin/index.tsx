import React, { useState } from "react";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { withAdminLayout } from "@/hoc/layout";
import { CollectionIcon, DocumentIcon, MusicNoteIcon, PhotographIcon, UsersIcon, VideoCameraIcon } from "@heroicons/react/outline";
import { Progress } from "@/components/ui/Progress";
import { FileStat } from "@/components/dashboard/FileStat";
import { $gql } from "@/plugins/http";
import { formatPrice } from "@/utils/mix";
import { formatBytes } from "@/utils/file";

const ACTIVITY_STAT = `
{
  stat: statistic {
    files_count
    images_count
    docs_count
    case_parties_count
    editors_count
    viewers_count
    audios_count
    videos_count
    others_count
    images_size
    docs_size
    audios_size
    videos_size
    others_size

    total_login
    users_count
    total_revenue
    owners_count
    witnesses_count
    all_evidence_count

    files_size
  }
}
`

const SuperAdminPage: NextPageWithLayout = () => {
  const [statistic, setStatistic] = useState({
    images_count: 0,
    docs_count: 0,
    case_parties_count: 0,
    editors_count: 0,
    viewers_count: 0,
    files_count: 0,
    audios_count: 0,
    videos_count: 0,
    others_count: 0,
    images_size: 0,
    docs_size: 0,
    audios_size: 0,
    videos_size: 0,
    others_size: 0,

    users_count: 0,
    total_login: 0,
    total_revenue: 0,
    owners_count: 0,
    witnesses_count: 0,
    all_evidence_count: 0,
    files_size: 0,
  });

  React.useEffect(() => {
    const getstatistic = async () => {
      try {
        const { stat } = await $gql(ACTIVITY_STAT);
        setStatistic(stat)
      } catch (error) {

      }
    }

    getstatistic()
  }, []);

  /**
   * If later we fetch activity stat partially.
   * Deps should only contains used properties
   */
  const percentage = React.useMemo(() => {
    const total = statistic.case_parties_count;

    return {
      editor: total ? (statistic.editors_count * 100) / total : 0,
      viewer: total ? (statistic.viewers_count * 100) / total : 0,
      owner: total ? (statistic.owners_count * 100) / total : 0
    }
  }, [statistic])

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-medium text-natural-13">Dashboard</h1>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 mb-4">
          <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{statistic.users_count}</dd>
          </div>

          <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Logins</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{statistic.total_login}</dd>
          </div>

          <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${formatPrice(statistic.total_revenue)}</dd>
          </div>
        </dl>

        {/*  use flex later */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-medium">{statistic.case_parties_count}</span>
                <h2 className="text-sm text-gray-600">
                  Total Parties
                </h2>
              </div>

              <div>
                <span className="bg-[#F7F2FD] h-14 w-14 rounded-full flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-[#6200EE]" />
                </span>
              </div>
            </div>

            <hr className="mt-5 mb-4" />

            <div>
              <h2 className="font-medium mb-2">User by case role</h2>

              <div className="space-y-4">
                <div>
                  <Progress label="Case Owner" value={percentage.owner.toFixed(2)} />
                </div>

                <div>
                  <Progress label="Editor" value={percentage.editor.toFixed(2)} />
                </div>

                <div>
                  <Progress label="Viewer" value={percentage.viewer.toFixed(2)} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg p-4 lg:p-6 mb-4">
              <h2>Evidence</h2>
              <span className="text-3xl font-semibold text-gray-900">
                {statistic.all_evidence_count}
              </span>
            </div>

            <div className="bg-white rounded-lg p-4 lg:p-6">
              <h2>Witnesses</h2>
              <span className="text-3xl font-semibold text-gray-900">
                {statistic.witnesses_count}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-[#F7F2FD] h-14 w-14 rounded-full flex items-center justify-center mr-4">
                  <CollectionIcon className="h-6 w-6 text-[#6200EE]" />
                </span>

                <div className="flex flex-col">
                  <span className="text-gray-600">
                    Storage
                  </span>
                  <span className="text-xs">{statistic.files_count} files</span>
                </div>
              </div>

              <div>
                <span className="block text-2xl font-medium text-natural-13">
                  {formatBytes(statistic.files_size)}
                </span>
              </div>
            </div>

            <hr className="mt-5 mb-4" />

            <dl className="space-y-4">
              <FileStat icon={PhotographIcon} count={statistic.images_count} size={statistic.images_size ?? 0} label="Image" />

              <FileStat count={statistic.docs_count} size={statistic.docs_size ?? 0} label="PDF / Docs" />

              <FileStat icon={MusicNoteIcon} count={statistic.audios_count} size={statistic.audios_size} label="Audio" />

              <FileStat icon={VideoCameraIcon} count={statistic.videos_count} size={statistic.videos_size} label="Video" />

              <FileStat icon={DocumentIcon} count={statistic.others_count} size={statistic.others_size} label="Others" />
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAdminLayout(SuperAdminPage, "Court - My Dashboard");
