import {
  BookmarkAltIcon, CalendarIcon, CollectionIcon, DocumentAddIcon, EyeIcon, HomeIcon, NewspaperIcon,
  ScaleIcon, ShoppingBagIcon, UsersIcon, ViewListIcon, AcademicCapIcon, ClipboardListIcon, BriefcaseIcon, QuestionMarkCircleIcon,
  ClipboardCheckIcon, PresentationChartBarIcon, PresentationChartLineIcon, DocumentIcon, DocumentDuplicateIcon, PhotographIcon, PaperClipIcon, CogIcon, MicrophoneIcon, TagIcon, LocationMarkerIcon
}
from "@heroicons/react/outline";
import { SVGProps } from "react";

export interface NavigationMenu {
  id?: string;
  name: string;
  href: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  subMenus: Omit<NavigationMenu, "id" | "subMenus">[];
  caseNeeded?: boolean;
}

export const navigations: NavigationMenu[] = [
  {
    id: "home",
    name: "Home",
    href: "/",
    icon: HomeIcon,
    subMenus: []
  },
  {
    id: "cases",
    name: "My Case",
    href: "/cases",
    icon: BriefcaseIcon,
    subMenus: [],
  },
  {
    id: "evidence",
    name: "Evidence",
    href: "/evidence",
    icon: ScaleIcon,
    caseNeeded: true,
    subMenus: []
  },
  {
    id: "witnesses",
    name: "Witnesses",
    href: "/witnesses",
    icon: EyeIcon,
    caseNeeded: true,
    subMenus: []
  },
  {
    name: "Court Documents",
    href: "/court-documents",
    icon: DocumentAddIcon,
    subMenus: [],
    caseNeeded: true,
  },
  {
    name: "To Do",
    href: "/tasks",
    icon: ClipboardCheckIcon,
    subMenus: [],
    caseNeeded: true,
  },
  {
    id: "education",
    name: "Education",
    href: "/",
    icon: BookmarkAltIcon,
    subMenus:[
      {
        name: "Mindset",
        href: "/",
        icon: DocumentAddIcon,
      },
      {
        name: "Communication",
        href: "/",
        icon: DocumentAddIcon,
      },
      {
        name: "Presentation",
        href: "/",
        icon: DocumentAddIcon,
      },
      {
        name: "Preparation",
        href: "/",
        icon: DocumentAddIcon,
      }
    ]
  },
  {
    name: "Journal",
    href: "/daily-journal",
    icon: CalendarIcon,
    subMenus:[
      {
        name: "Journal",
        href: "/daily-journal",
        icon: CalendarIcon,
      },
      {
        name: "Voice memo's",
        href: "/voice-memo",
        icon: MicrophoneIcon,
      },
      {
        name: "Visitations",
        href: "/visitations",
        icon: LocationMarkerIcon
      }
    ],
    caseNeeded: true,
  },
  {
    name: "Files",
    href: "/files",
    icon: DocumentIcon,
    subMenus:[],
    caseNeeded: true,
  },
  {
    name: "Timeline",
    href: "/timeline",
    icon: PresentationChartBarIcon,
    caseNeeded: true,
    subMenus: [
      {
        name: "My Timeline",
        href: "/timeline",
        icon: PresentationChartLineIcon,
      },
      {
        name: "Evidence",
        href: "/timeline/evidence",
        icon: ScaleIcon,
      },
      {
        name: "Court Procedure",
        href: "/timeline/court-procedure",
        icon: BriefcaseIcon,
      },
      {
        name: "Full Picture",
        href: "/timeline/full-picture",
        icon: PhotographIcon,
      }
    ]
  }
]

export const adminNavigations: NavigationMenu[] = [
  {
    name: "Home",
    href: "/super-admin",
    icon: HomeIcon,
    subMenus: [],
  },
  {
    name: "Users",
    href: "/super-admin/users",
    icon: UsersIcon,
    subMenus: [],
  },
  {
    name: "Products",
    href: "/super-admin/products",
    icon: CollectionIcon,
    subMenus: [
      {
        name: "Products",
        href: "/super-admin/products",
        icon: CollectionIcon,
      },
      {
        name: "Orders",
        href: "/super-admin/orders",
        icon: ShoppingBagIcon,
      },
      {
        name: "Coupons",
        href: "/super-admin/coupons",
        icon: TagIcon,
      }
    ],
  },
  {
    name: "Campaigns",
    href: "/super-admin/campaigns",
    icon: AcademicCapIcon,
    subMenus: [
      {
        name: "All Campaigns",
        href: "/super-admin/campaigns",
        icon: ClipboardListIcon,
      },
      {
        name: "Templates",
        href: "/super-admin/templates",
        icon: ViewListIcon,
      },
      {
        name: "Recipients",
        href: "/super-admin/recipients",
        icon: UsersIcon,
      }
    ],
  },
  {
    name: "Content",
    href: "/super-admin/content-pages",
    icon: NewspaperIcon,
    subMenus: [
      {
        name: "Content Pages",
        href: "/super-admin/content-pages",
        icon: NewspaperIcon,
      },
      {
        name: "Questions",
        href: "/super-admin/questions",
        icon: QuestionMarkCircleIcon,
      }
    ],
  },
  {
    name: "Files",
    href: "/super-admin/files",
    icon: PaperClipIcon,
    subMenus: [
      {
        name: "Share Files",
        href: "/super-admin/share-files",
        icon: DocumentDuplicateIcon,
      }
    ]
  },
]
