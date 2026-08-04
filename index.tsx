import talks from "./talks.json" with { type: "json" };
import { renderToString } from "preact-render-to-string";
import { TbClockHour1, TbPresentationFilled, TbVideoFilled } from "tb-icons";

interface Talk {
  date: string;
  conference: {
    name: string;
    website: string;
  };
  location?: string; // "City, Country"; absent for remote-only appearances
  copresenters?: { name: string; website?: string }[];
  title: string;
  recording?: string;
  slides: "slidev" | string | null;
  kind: "talk" | "session" | "podcast";
  duration: number; // Duration in minutes
}

const KIND_LABELS: Record<Talk["kind"], string> = {
  talk: "Talk",
  session: "Session",
  podcast: "Podcast",
};

function Index() {
  const groupedTalks: Record<number, Talk[]> = {};
  for (const talk of talks) {
    const year = new Date(talk.date).getFullYear();
    groupedTalks[year] ??= [];
    groupedTalks[year].push(talk as Talk);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Talks — Leo Kettmeir</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
        <div class="px-6 sm:px-10 lg:px-20 xl:px-32 divide-y-1 divide-gray-600">
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
    <div class="pt-8 pb-16">
      <h2 class="font-bold text-3xl">{year}</h2>

      <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {talks.map((talk) => <Talk key={talk.date} talk={talk} />)}
      </div>
    </div>
  );
}

function Talk({ talk }: { talk: Talk }) {
  const date = new Date(talk.date);

  let slidesLink = null;

  // Strip everything that would need escaping in a URL, so names like
  // "toranoana.deno #20" still map to a usable path.
  const talkId = talk.conference.name.toLowerCase().replaceAll(
    /[^a-z0-9.-]/g,
    "",
  );

  if (talk.slides === "slidev") {
    slidesLink = `/${date.getFullYear()}/${talkId}`;
  } else if (typeof talk.slides === "string") {
    slidesLink = talk.slides;
  }

  const imgPath = `/covers/${date.getFullYear()}/${talkId}.png`;
  let hasImage = true;
  try {
    Deno.readFileSync(`.${imgPath}`);
  } catch (_) {
    hasImage = false;
  }

  return (
    <div class="flex flex-col h-full">
      {
        /* Fixed aspect ratio, so cards line up across a row no matter what the
          cover's own proportions are — or whether it has one at all. */
      }
      <div class="relative aspect-video mb-3">
        {hasImage
          ? (
            <img
              src={imgPath}
              class="absolute inset-0 size-full rounded-2xl shadow object-cover bg-gray-800/30"
              alt=""
            />
          )
          : (
            <div class="absolute inset-0 size-full rounded-2xl shadow bg-gray-800/30 border border-gray-700/60 flex items-center justify-center px-6 pt-6 pb-12">
              <span class="text-gray-500 text-center select-none">
                {talk.title}
              </span>
            </div>
          )}

        <span class="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-gray-300 backdrop-blur-sm select-none">
          {KIND_LABELS[talk.kind]}
        </span>

        {(slidesLink || talk.recording) && (
          <div class="absolute top-2 right-2 flex gap-1.5">
            {slidesLink && (
              <a
                href={slidesLink}
                title="Slides"
                aria-label="Slides"
                class="rounded-full bg-black/60 p-1.5 backdrop-blur-sm transition-colors duration-300 hover:text-amber-500"
              >
                <TbPresentationFilled class="size-5" />
              </a>
            )}
            {talk.recording && (
              <a
                href={talk.recording}
                title="Recording"
                aria-label="Recording"
                class="rounded-full bg-black/60 p-1.5 backdrop-blur-sm transition-colors duration-300 hover:text-amber-500"
              >
                <TbVideoFilled class="size-5" />
              </a>
            )}
          </div>
        )}
      </div>

      <div class="flex-grow flex flex-col min-h-[4.5rem]">
        <h3 class="font-semibold mt-1">{talk.title}</h3>
        {talk.copresenters && (
          <div class="text-sm text-gray-400 mt-1">
            with{" "}
            {talk.copresenters.map((copresenter, i) => (
              <span key={copresenter.name}>
                {i > 0 && ", "}
                {copresenter.website
                  ? (
                    <a
                      href={copresenter.website}
                      class="transition-all duration-300 hover:text-amber-500 underline underline-offset-4 decoration-dashed hover:decoration-solid"
                    >
                      {copresenter.name}
                    </a>
                  )
                  : copresenter.name}
              </span>
            ))}
          </div>
        )}
        <div class="flex justify-between items-end gap-4 text-sm mt-auto">
          <div class="flex flex-col min-w-0 max-w-[50%]">
            <a
              href={talk.conference.website}
              class="transition-all duration-300 hover:text-amber-500 underline underline-offset-4 decoration-dashed hover:decoration-solid truncate"
            >
              {talk.conference.name}
            </a>
            {talk.location && (
              <span class="text-xs text-gray-400 truncate">
                {talk.location}
              </span>
            )}
          </div>
          <div class="flex items-center gap-4 whitespace-nowrap">
            <span class="flex items-center gap-1">
              <TbClockHour1 /> <span>{talk.duration} min</span>
            </span>
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
