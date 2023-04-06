import { $date } from "@/plugins/date"
import Link from "next/link"

export const Footer: React.FC = () => {
  return (
    <div className="bg-white">
      <footer className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
        <div className="border-t border-slate-900/5 py-4 lg:py-6">
          <p className="mt-5 text-center text-sm leading-6 text-slate-500">© {$date().format("YYYY")} MyCourtClerk. All rights reserved.</p>

          <div className="mt-16 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700">
            <Link href="/privacy-policy">
              <a>Privacy policy</a>
            </Link>
            <div className="h-4 w-px bg-slate-500/20" />
            <Link href="/terms-of-service">
              <a>Terms of Service</a>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
