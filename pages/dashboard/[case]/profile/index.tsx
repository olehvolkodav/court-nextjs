import { Button } from "@/components/ui/button";
import { FieldError, Form, Input, Label, Select } from "@/components/ui/form";
import { useToast } from "@/hooks/toast.hook";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { DashboardLayout } from "@/layouts/dashboard.layout";
import { ProfileLayout } from "@/layouts/sub-layout/profile.layout";
import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { $user, updateUser } from "@/store/auth.store";
import { useStore } from "effector-react";
import { useRef, useState } from "react";
import timezones from "@/timezones.json";

const ProfilePage: NextPageWithLayout = () => {
  const toast = useToast();
  const user = useStore($user);

  const avatarRef = useRef<HTMLInputElement>(null);

  const [first_name, setFirstName] = useState(user?.first_name);
  const [last_name, setLastName] = useState(user?.last_name ?? "");
  const [timezone, setTimezone] = useState(user?.timezone ?? $date.tz.guess);

  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    setLoading(true);

    try {
      await $http.patch("/auth", {
        first_name,
        last_name,
        timezone
      });

      toast.show({ message: "Profile Updated!" });

      updateUser({ first_name, last_name, timezone })
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const openFile = () => {
    if (avatarRef.current) {
      avatarRef.current.click();
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!!file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const { data } = await $http.post("/auth/avatar", formData);

        updateUser({
          avatar: {
            ...user?.avatar,
            url: data.url,
          }
        })

        toast.show({
          message: "Avatar Updated"
        })
      } catch (error) {

      }
    }
  }

  return (
    <>
      <section>
        <input
          type="file"
          className="sr-only"
          ref={avatarRef}
          accept=".jpg,.jpeg,.png"
          onChange={onFileChange}
        />

        <Form className="bg-white shadow-sm rounded-md" onSubmitPrevent={updateProfile}>
          <div className="px-4 py-2 space-y-4">
            <div className="grid grid-cols lg:grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input placeholder="Name" value={first_name} onChangeText={setFirstName} />
                <FieldError name="first_name" />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input placeholder="Name" value={last_name} onChangeText={setLastName} />
                <FieldError name="name" />
              </div>
            </div>

            <div>
              <Label>Timezone</Label>

              <div className="lg max-w-xl">
                <Select value={timezone} onChangeValue={setTimezone}>
                  {timezones.map(group => (
                    <optgroup key={group.value} label={group.value}>
                      {!!group.utc.length && group.utc.map(tz => (
                        <option value={tz} key={tz}>{tz}</option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </div>
              <FieldError name="timezone" />
            </div>

            <div>
              <Label>Avatar</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  {user?.avatar?.url ? (
                    <img className="h-16 w-16 rounded-full" src={user.avatar.url} alt="User Avatar" />
                  ) : (
                    <span className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}

                  <button
                    type="button"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={openFile}
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-4 py-2">
            <Button type="submit" isLoading={loading}>
              Update Profile
            </Button>
          </div>
        </Form>
      </section>
    </>
  )
}

ProfilePage.getLayout = page => (
  <DashboardLayout title="Court - Profile">
    <ProfileLayout>
      {page}
    </ProfileLayout>
  </DashboardLayout>
)

export default ProfilePage;
