import { Button } from "@/components/ui/button";
import { FieldError, Form, PasswordInput, Label } from "@/components/ui/form";
import { useToast } from "@/hooks/toast.hook";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { DashboardLayout } from "@/layouts/dashboard.layout";
import { ProfileLayout } from "@/layouts/sub-layout/profile.layout";
import { $http } from "@/plugins/http";
import { useState } from "react";
import { $errorActions } from "@/store/error.store";
import { useStore } from "effector-react";
import { $user } from "@/store/auth.store";

const ProfilePasswordPage: NextPageWithLayout = () => {
  const user = useStore($user);
  const toast = useToast();

  const [current_password, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const updatePassword = async() => {
    setLoading(true);

    try {
      await $http.patch("/auth/password", {
        current_password,
        password,
      });

      toast.show({message: "Password Changed!"});

      $errorActions.setErrors({});

      setCurrentPassword("")
      setPassword("")
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section>
        <Form className="bg-white shadow-sm rounded-md" onSubmitPrevent={updatePassword}>
          <div className="px-4 py-2 space-y-4">
            {user?.hasPassword && (
              <div>
                <Label>Current Password</Label>

                <div className="lg:max-w-lg">
                  <PasswordInput onChangeText={setCurrentPassword} value={current_password} placeholder="Your Current Password" />
                </div>

                <FieldError name="current_password" />
              </div>
            )}

            <div>
              <Label>New Password</Label>

              <div className="lg:max-w-lg">
                <PasswordInput onChangeText={setPassword} value={password} placeholder="New Password" />
              </div>

              <FieldError name="password" />
            </div>
          </div>

          <div className="border-t px-4 py-2">
            <Button type="submit" isLoading={loading}>
              Update Password
            </Button>
          </div>
        </Form>
      </section>
    </>
  )
}

ProfilePasswordPage.getLayout = page => (
  <DashboardLayout title="Court - Change Password">
    <ProfileLayout>
      {page}
    </ProfileLayout>
  </DashboardLayout>
)

export default ProfilePasswordPage;
