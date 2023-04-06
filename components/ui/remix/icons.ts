interface IconPath {
  fill?: string;
  d: string;
  [key: string]: any;
}

interface RemixIcon {
  name: string;
  path: IconPath[];
}

const defaultFirstPath: IconPath = {
  d: "M0 0h24v24H0z", fill: "none",
}

function withCurrentColor(d: string): IconPath {
  return {
    d,
    fill: "currentColor"
  }
}

export const remixIcons: RemixIcon[] = [
  {
    name: "bold",
    path: [
      defaultFirstPath,
      withCurrentColor("M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z")
    ]
  },
  {
    name: "italic",
    path: [
      defaultFirstPath,
      withCurrentColor("M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z")
    ]
  },
  {
    name: "order-list",
    path: [
      defaultFirstPath,
      withCurrentColor("M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z")
    ]
  },
  {
    name: "unorder-list",
    path: [
      defaultFirstPath,
      withCurrentColor(
        "M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
      )
    ]
  }
]
