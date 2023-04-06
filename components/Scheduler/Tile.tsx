import { getTileData } from "./helpers";
interface Props {
  Type: Type;
  Subject: any;
}
type Type = {
  __typename: string;
};

export const Tile: any = (props: Props) => {
  return (
    <div
      style={{ background: getTileData("color", props.Type.__typename) }}
      className="rounded-[2px] text-white tile p-1"
    >
      <h3 className="font-medium text-[0.78rem] tracking-wide">
        {props.Subject}
      </h3>
    </div>
  );
};
