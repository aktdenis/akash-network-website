import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function GpuCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group/code relative">
      <div className="max-h-[340px] overflow-y-auto rounded-lg border bg-background2 p-5 text-xs leading-relaxed [scrollbar-width:thin]">
        <pre className="font-jetBrainsMono">{code}</pre>
      </div>
      {/* Bottom fade to indicate more content */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-b-lg bg-gradient-to-t from-background2 to-transparent" />
      {/* Copy button — visible on hover */}
      <button
        onClick={handleCopy}
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded border bg-background text-foreground opacity-0 shadow-sm transition-all group-hover/code:opacity-100 hover:bg-background2"
        aria-label="Copy SDL"
      >
        {copied ? (
          <Check className="size-3.5 text-foreground" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
}
