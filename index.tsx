import talks from "./talks.json" with { type: "json" };
import { renderToString } from "preact-render-to-string";
import { TbClockHour1, TbPresentationFilled, TbVideoFilled } from "tb-icons";

interface Talk {
  date: string;
  conference: {
    name: string;
    website: string;
  };
  title: string;
  recording?: string;
  slides: "slidev" | string | null;
  kind?: "talk" | "session";
  duration: number; // Duration in minutes
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
        <div class="px-32 divide-y-1 divide-gray-600">
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

      <div class="grid gap-20 md:grid-cols-3 mt-4">
        {talks.map((talk) => <Talk key={talk.date} talk={talk} />)}
      </div>
    </div>
  );
}

function Talk({ talk }: { talk: Talk }) {
  const date = new Date(talk.date);

  let slidesLink = null;

  const talkId = talk.conference.name.toLowerCase().replaceAll(" ", "");

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
      <div class="mb-3">
        <div class="flex justify-between gap-3">
          <img
            src={imgPath}
            class={`rounded-2xl shadow w-9/10 bg-gray-800/30 min-h-32 box-content flex items-center justify-center ${
              hasImage ? "" : "p-6"
            }`}
            alt={talk.title}
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
            {talk.title}{" "}
            {talk.kind == "session" && <span>(discussion session)</span>}
          </span>
        </h3>
        <div class="flex justify-between items-end gap-4 text-sm mt-auto">
          <a
            href={talk.conference.website}
            class="transition-all duration-300 hover:text-amber-500 underline underline-offset-4 decoration-dashed hover:decoration-solid truncate max-w-[50%]"
          >
            {talk.conference.name}
          </a>
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
