import talks from "./talks.json" with { type: "json" };
import { renderToString } from "preact-render-to-string";
import { TbPresentationFilled, TbVideoFilled } from "tb-icons";

interface Talk {
  date: string;
  conference: {
    name: string;
    website: string;
  };
  title: string;
  recording?: string;
  kind: "slidev" | "google" | "talk-only";
  href?: string;
  duration?: number; // Duration in minutes
}

function Index() {
  const groupedTalks: Record<number, Talk[]> = {};
  for (const talk of talks) {
    const year = new Date(talk.date).getFullYear();
    groupedTalks[year] ??= [];
    groupedTalks[year].push(talk as Talk);
  }

  return (
    <html>
      <head>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
        <div class="px-32 space-y-16">
          {Object.entries(groupedTalks).toSorted(([a], [b]) =>
            b.localeCompare(a)
          ).map(([year, talks]) => (
            <Year
              key={year}
              year={year}
              talks={talks}
            />
          ))}
        </div>
      </body>
    </html>
  );
}

function Year({ year, talks }: { year: string; talks: Talk[] }) {
  return (
    <div>
      <h2 class="font-bold text-3xl">{year}</h2>

      <div class="grid gap-20 md:grid-cols-3 mt-4">
        {talks.map((talk) => <Talk key={talk.date} talk={talk} />)}
      </div>
    </div>
  );
}

function Talk({ talk }: { talk: Talk }) {
  const date = new Date(talk.date);

  let slidesLink = null;

  if (talk.kind === "slidev") {
    slidesLink = `/${date.getFullYear()}/${
      talk.conference.name.toLowerCase().replaceAll(" ", "")
    }`;
  } else if (talk.kind === "google") {
    slidesLink = talk.href!;
  }

  return (
    <div class="flex flex-col h-full">
      <div class="mb-3">
        <div class="flex justify-between gap-3">
          <img
            src="covers/2025_jsnation.png"
            class="rounded-2xl shadow w-9/10"
          />

          <div class="mt-5">
            {slidesLink && (
              <a href={slidesLink}>
                <TbPresentationFilled class="size-5" />
              </a>
            )}
            {talk.recording && (
              <a href={talk.recording}>
                <TbVideoFilled class="size-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div class="flex-grow flex flex-col min-h-[4.5rem]">
        <h3 class="font-semibold mt-1">
          <span class="bg-[#272727] px-1 py-0.5 leading-relaxed">
            {talk.title}
          </span>
        </h3>
        <div class="flex justify-between items-end gap-4 text-sm mt-auto">
          <a
            href={talk.conference.website}
            class="transition-all duration-300 hover:text-amber-500 underline underline-offset-4 decoration-dashed hover:decoration-solid truncate max-w-[50%]"
          >
            {talk.conference.name}
          </a>
          <div class="flex items-center gap-2 whitespace-nowrap">
            {talk.duration && <span>{talk.duration} min</span>}
            <time datetime={talk.date}>
              {date.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}

await Deno.writeTextFile("./dist/index.html", renderToString(<Index />));
