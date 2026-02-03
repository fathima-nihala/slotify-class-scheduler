import * as Tooltip from "@radix-ui/react-tooltip";

export const Label = ({ text, tooltip }: { text: string; tooltip: string }) => (
  <label className="flex items-center gap-2 text-sm font-medium mb-2">
    {text}
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span className="text-gray-400 cursor-pointer">ⓘ</span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          className="bg-black text-white text-xs px-3 py-1 rounded-md"
        >
          {tooltip}
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </label>
);