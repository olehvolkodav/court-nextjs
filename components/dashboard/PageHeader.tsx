import { classNames } from "@/utils/classname"
import { ArrowLeftIcon } from "@heroicons/react/outline"
import { useRouter } from "next/router"

interface IPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

/**
 * Page Header oftenly use inside create/edit page with back button
 */
export const PageHeader: React.FC<IPageHeaderProps> = ({title, ...rest}) => {
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <div {...rest} className={
      classNames(
        "flex items-center",
        rest.className,
      )
    }>
      <button type="button" onClick={goBack} className="mr-2">
        <ArrowLeftIcon className="h-5 w-5" />
      </button>

      <h1 className="text-2xl font-medium text-natural-13">
        {title}
      </h1>
    </div>
  )
}

PageHeader.defaultProps = {
  title: "New Page"
}