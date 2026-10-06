import { existsSync } from "node:fs";
import { join } from "node:path";
import { buttonClass } from "@/components/ui";

interface DownloadLinkProps {
  label: string;
  /** Path under `public/`, e.g. "/downloads/file.xlsx". */
  path: string;
  fileName: string;
}

/**
 * Link styled as a button that downloads a file from `public/`. Renders
 * disabled when the file isn't there, so it never leads to a 404.
 */
export function DownloadLink({ label, path, fileName }: DownloadLinkProps) {
  const available = existsSync(join(process.cwd(), "public", path));
  const content = (
    <>
      <svg
        aria-hidden
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </svg>
      {/* Icon-only on small screens; the label stays available to screen readers. */}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </>
  );

  if (!available) {
    return (
      <span
        role="link"
        aria-disabled
        title={`Add the file at public${path} to enable this download`}
        className={buttonClass("secondary", "cursor-not-allowed")}
      >
        {content}
      </span>
    );
  }

  return (
    <a href={path} download={fileName} title={`Download ${fileName}`} className={buttonClass("secondary")}>
      {content}
    </a>
  );
}
