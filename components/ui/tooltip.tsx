import * as React from "react";
import { Info } from "lucide-react";

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-block align-middle">
      <Info className="inline w-5 h-5 ml-2 text-gray-400 group-hover:text-blue-600 cursor-pointer" />
      <span className="absolute left-1/2 font-medium z-10 hidden w-64 -translate-x-1/2 rounded bg-gray-900 px-3 py-2 text-xs text-white group-hover:block group-hover:animate-fade-in pointer-events-none mt-2 shadow-lg">
        {text}
      </span>
    </span>
  );
}

export { Tooltip };
