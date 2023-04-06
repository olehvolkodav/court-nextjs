import { useAuth } from "@/hooks/auth.hook";
import { useToast } from "@/hooks/toast.hook";
import { $http } from "@/plugins/http";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FieldError, Form, Input } from "../ui/form"
import OtpInput from "react-otp-input";
interface Props {
  email: string;
  onVerifySuccess?: () => any
}

export const VerifyForm: React.FC<Props> = ({email, onVerifySuccess}) => {
  const toast = useToast();
  const { verify } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [otpCode, setOtpCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [timeRemainingToResend, setTimeRemainingToResend] = useState<number>(60);
  const [resendLoading, setResendLoading] = useState(false);

  const verifyOtp = async() => {
    setLoading(true);

    try {
      await verify({email, code: otpCode});

      if (onVerifySuccess) {
        onVerifySuccess()
      }
    } catch (err: any) {
      if (err?.response.status == 400) {
        setErrorMessage("Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  }

  const resendOtp = async() => {
    setResendLoading(true);

    try {
      await $http.post("/auth/resend-otp", {email});
      setTimeRemainingToResend(60);
      toast.show({message: "OTP resent"});
    } catch (err: any) {
      toast.show({message: "Failed to resend OTP"});
    } finally {
      setResendLoading(false);
    }
  }

  useEffect(() => {
    const countDown = setInterval(() => {
      if (timeRemainingToResend <= 0) {
        return
      } else {
        setTimeRemainingToResend(timeRemainingToResend - 1);
      }
    }, 1000);

    return () => clearInterval(countDown);
  }, [timeRemainingToResend])

  return (
    <Form className="space-y-4" onSubmitPrevent={verifyOtp}>
      <div className="flex justify-left">
        <p className="text-sm  mb-0 pb-0 text-gray-700 text-opacity-70 mr-1">Didn&apos;t receive a code? </p>
        <button
          type="button"
          className="text-primary-1 font-medium text-sm disabled:opacity-50"
          disabled={!!timeRemainingToResend || resendLoading}
          onClick={resendOtp}
        >
          <span>
            Resend
          </span>
          {!!timeRemainingToResend && (
            <span> in {timeRemainingToResend} seconds</span>
          )}
        </button>
      </div>
      <div className="flex justify-center pt-6 pb-4">
        <OtpInput
          value={otpCode}
          onChange={(otp) => setOtpCode(otp)}
          numInputs={6}
          isInputNum={true}
          containerStyle="otp-container"
          inputStyle={`otp`}
          focusStyle={"outline-none border-none"}
        />

        <FieldError name="code" />

        {!!errorMessage && (
          <span className="text-xs text-red-600 mt-1 block">
            {errorMessage}
          </span>
        )}
      </div>

      <div>
        <Button type="submit" isLoading={loading} className="w-full">
          Verify Account
        </Button>
      </div>
    </Form>
  )
}
