import { signIn } from "next-auth/react"
import AppleIcon from "../icons/AppleIcon"
import GoogleIcon from "../icons/GoogleIcon"
import MicrosoftIcon from "../icons/MicrosoftIcon"

const BUTTON_CLASS = "inline-flex justify-center items-center py-[10px] hover:bg-gray-50 relative shadow w-full px-4 bg-white rounded-md"

export const OAuthButtons: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <button onClick={() => signIn("google")} type="button" className={BUTTON_CLASS}>
        <GoogleIcon />
        <span className="sr-only">
          Sign in with Google
        </span>
      </button>
      <button onClick={() => signIn("azure-ad")} type="button" className={BUTTON_CLASS}>
        <MicrosoftIcon />
        <span className="sr-only">
          Sign in with Microsoft
        </span>
      </button>
      <button onClick={() => signIn("apple")} type="button" className={BUTTON_CLASS}>
        <AppleIcon />
        <span className="sr-only">
          Sign in with Apple
        </span>
      </button>
    </div>
  )
}
