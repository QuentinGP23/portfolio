import { ExternalLink } from "@/components/ui/external-link";
import { site } from "@/lib/site";

const linkClassName =
  "underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

/** Provisional home page (phase 1). The real design comes in phase 2. */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-6 py-24">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-muted uppercase">
          {site.jobTitle}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {site.name}
        </h1>
        <p className="text-lg text-muted">
          Mon portfolio est en construction. En attendant, vous pouvez me
          retrouver ici :
        </p>
      </div>
      <ul className="flex flex-wrap gap-x-8 gap-y-4 text-lg">
        <li>
          <ExternalLink href={site.links.github} className={linkClassName}>
            GitHub
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={site.links.linkedin} className={linkClassName}>
            LinkedIn
          </ExternalLink>
        </li>
        <li>
          <a href={`mailto:${site.email}`} className={linkClassName}>
            {site.email}
          </a>
        </li>
      </ul>
    </main>
  );
}
