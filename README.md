# AT/SP Curriculum Map

Courses mapped to the department's thematic areas, in three views:

- **Art & Technology / Sound Practices** (default): current courses — [`data/atsp.js`](data/atsp.js).
  A switch organizes them either by **Themes** (Generative Systems at the center) or by
  media-specific **Practice areas**. Every course lists both.
- **26/27 (draft)**: just the courses scheduled for Fall 2026 and Spring 2027 in the
  Curriculum Committee deck — [`data/atsp-2026-27.js`](data/atsp-2026-27.js). It reuses
  the AT/SP themes, areas and course tags, so it only lists course names.
- **AT/SP (prior assessment draft)**: the earlier curriculum and
  themes — [`data/atsp-old.js`](data/atsp-old.js)

Live: https://saic-ats.github.io/ATSP_Venn_Areas/

## Updating courses or themes

Edit the view's file in `data/` — nothing else needs to change. The comment at the top of
`data/atsp.js` explains every field.

- Add a course: add a line to `COURSES` with its name and a list of theme ids.
- Add a theme: add an entry to `THEMES` with an `id`, `name`, `short` label and `description`.
  It gets a color automatically; set `color: "#hex"` to choose one. Set `core: true` to put it
  in the center of the map instead of on the ring.
- Add a whole new view: copy a data file, give it a new `id`, and add a `<script>` line for it
  in `index.html`. The first data file listed there is the default view.

If a course uses a theme id that doesn't exist, the page shows a yellow warning at the top.

## How the map works

- Themes sit on a ring. Themes that share many courses are placed next to each other.
- Each course is a dot placed between the themes it belongs to. The dot is split into those themes' colors.
- Each theme's colored area reaches out to every one of its courses, so overlaps show real shared courses.
- **Matrix** view shows the same data as a course × theme grid. Use it to check tagging.

Clicking a course or theme updates the URL, so you can share links like
`#course=holography`, `#themes=embodied,misplay`, `#by=areas&themes=sonic,immersive`,
or `#set=atsp-old&themes=sensory,immersive`.

## Running locally

Open `index.html` directly, or run `python3 -m http.server` and visit http://localhost:8000.
No build step; [d3](https://d3js.org) loads from a CDN.
