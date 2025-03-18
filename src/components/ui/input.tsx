import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const isSearch = type === "search";
  return (
    <div data-slot="input-container" className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "peer border-zinc-200 file:text-zinc-950 placeholder:text-zinc-500 selection:bg-zinc-900 selection:text-zinc-50 ring-zinc-950/10 dark:ring-zinc-950/20 dark:outline-ring/40 outline-ring/50 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-red-500/40 aria-invalid:ring-red-500/20 aria-invalid:border-red-500/60 dark:aria-invalid:border-red-500 flex h-10 w-full min-w-0 rounded-md border bg-white pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none md:text-sm dark:aria-invalid:focus-visible:ring-4 dark:border-zinc-800 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:selection:bg-zinc-50 dark:selection:text-zinc-900 dark:ring-zinc-300/10 dark:dark:ring-zinc-300/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:ring-red-900/20 dark:aria-invalid:border-red-900/60 dark:dark:aria-invalid:border-red-900 dark:bg-zinc-950",
          isSearch ? "pl-10" : "pl-3",
          className
        )}
        {...props}
      />
      {isSearch && (
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 bg-white peer-focus:text-zinc-950 dark:text-zinc-400 dark:bg-zinc-950 dark:peer-focus:text-zinc-50"
        />
      )}
    </div>
  );
}

export { Input };
