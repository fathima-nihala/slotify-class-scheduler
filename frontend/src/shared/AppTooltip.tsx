import * as Tooltip from "@radix-ui/react-tooltip";

type AppTooltipProps = {
  text: string;
};

const AppTooltip: React.FC<AppTooltipProps> = ({ text }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span className="text-gray-400 cursor-pointer">ⓘ</span>
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          className="bg-black text-white text-xs px-3 py-1 rounded-md shadow-md"
        >
          {text}
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export default AppTooltip;
