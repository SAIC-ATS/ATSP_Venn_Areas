/*
 * AT/SP curriculum map.
 *
 * Each thematic area is anchored on a ring. Themes that share many courses are
 * placed next to each other. Each course sits at the average of its themes'
 * anchors, then a small force layout nudges dots apart so none overlap.
 * Each theme's "area" is a soft blob that joins its anchor to every one of its
 * courses, so the overlaps you see are real shared courses rather than
 * arbitrary circle placement.
 */
(() => {
  "use strict";

  // Used for themes that don't set their own `color`, in THEMES order.
  const PALETTE = [
    "#e15759", "#f28e2b", "#b07aa1", "#9c755f", "#59a14f",
    "#edc948", "#76b7b2", "#d37295", "#4e79a7", "#79706e",
    "#8cd17d", "#ff9d9a", "#86bcb6", "#f1ce63", "#a0cbe8",
  ];

  // Views come from data/*.js; each pushes one entry onto window.DATASETS.
  const DATASETS = window.DATASETS || [];
  const DEFAULT_SET = DATASETS[0] && DATASETS[0].id;

  // ---------- data prep (re-run whenever the dataset changes) ----------
  let ds, themes, themeById, courses, courseBySlug, warnings;
  let ring, core, orderIndex, orderedThemes, sortedCourses;

  // A dataset can be organized more than one way ("lenses"): by `themes` (always),
  // and optionally by another list such as practice `areas`. The rest of the app
  // just sees "themes": whichever list the current lens uses.
  function lensesOf(set) {
    return set.lenses || { themes: { label: "Themes", noun: "thematic areas" } };
  }
  function lens() {
    return lensesOf(ds)[state.lens] || lensesOf(ds).themes;
  }
  function prepare(set, lensId = "themes") {
    ds = set;
    state.lens = lensesOf(set)[lensId] ? lensId : "themes";
    const list = state.lens === "themes" ? set.themes : lensesOf(set)[state.lens].list;
    themes = list.map((t, i) => ({ ...t, color: t.color || PALETTE[i % PALETTE.length] }));
    themeById = new Map(themes.map((t) => [t.id, t]));
    warnings = [];
    courses = set.courses.map((c, i) => {
      const name = c.name.trim();
      const ids = [...new Set(c[state.lens] || [])];
      const unknown = ids.filter((id) => !themeById.has(id));
      if (unknown.length) warnings.push(`“${name}” uses unknown theme id(s): ${unknown.join(", ")}`);
      if (!ids.length) warnings.push(`“${name}” has no themes.`);
      return { i, name, slug: slugify(name), themes: ids.filter((id) => themeById.has(id)) };
    });
    courseBySlug = new Map();
    courses.forEach((c) => {
      if (courseBySlug.has(c.slug)) warnings.push(`“${c.name}” is listed more than once.`);
      courseBySlug.set(c.slug, c);
    });
    themes.forEach((t) => {
      t.courses = courses.filter((c) => c.themes.includes(t.id));
      if (!t.courses.length) warnings.push(`Theme “${t.name}” has no courses.`);
    });

    // Core themes sit in the middle; the rest go on a ring, ordered so themes
    // that share courses are neighbours.
    core = themes.filter((t) => t.core).map((t) => t.id);
    ring = circularOrder(themes.filter((t) => !t.core).map((t) => t.id), themeSimilarity);
    const order = [...core, ...ring];
    orderIndex = new Map(order.map((id, i) => [id, i]));
    courses.forEach((c) => c.themes.sort((a, b) => orderIndex.get(a) - orderIndex.get(b)));
    orderedThemes = order.map((id) => themeById.get(id));
    sortedCourses = [...courses].sort((a, b) => a.name.localeCompare(b.name));
  }

  // ---------- state ----------
  const state = {
    view: "map",
    lens: "themes", // which list the courses are organized by (see prepare)
    themes: new Set(), // selected theme ids
    match: "all", // "all" = intersection, "any" = union
    query: "",
    course: null, // selected course
    hoverCourse: null,
    hoverTheme: null,
  };

  // ---------- DOM refs ----------
  const $ = (sel) => document.querySelector(sel);
  const el = {
    legend: $("#legend"),
    matchToggle: $("#match-toggle"),
    clear: $("#clear"),
    search: $("#search"),
    list: $("#course-list"),
    count: $("#course-count"),
    map: $("#map"),
    matrix: $("#matrix"),
    details: $("#details"),
    warnings: $("#warnings"),
    setTabs: $("#set-tabs"),
    lensToggle: $("#lens-toggle"),
    title: $("#ds-title"),
    subtitle: $("#ds-sub"),
    note: $("#ds-note"),
  };

  // ---------- derived ----------
  function filterActive() {
    return state.themes.size > 0 || state.query.trim() !== "";
  }
  function matches(course) {
    const q = state.query.trim().toLowerCase();
    if (q && !course.name.toLowerCase().includes(q)) return false;
    if (!state.themes.size) return true;
    const sel = [...state.themes];
    return state.match === "all"
      ? sel.every((id) => course.themes.includes(id))
      : sel.some((id) => course.themes.includes(id));
  }
  function activeCourse() {
    return state.hoverCourse || state.course;
  }
  function focusThemes() {
    const c = activeCourse();
    if (c) return new Set(c.themes);
    const f = new Set(state.themes);
    if (state.hoverTheme) f.add(state.hoverTheme);
    return f;
  }
  function related(course, n = 6) {
    return courses
      .filter((c) => c !== course)
      .map((c) => {
        const shared = c.themes.filter((id) => course.themes.includes(id));
        const union = new Set([...c.themes, ...course.themes]).size;
        return { c, shared, score: shared.length / union };
      })
      .filter((r) => r.shared.length)
      .sort((a, b) => b.score - a.score || b.shared.length - a.shared.length || a.c.name.localeCompare(b.c.name))
      .slice(0, n);
  }

  // ---------- legend ----------
  function buildLegend() {
    el.legend.innerHTML = orderedThemes
      .map(
        (t) => `<button class="chip" data-theme="${t.id}" style="--c:${t.color}" aria-pressed="false" title="${esc(t.name)}">
          <span class="sw"></span>${esc(t.short || t.name)} <span class="n">${t.courses.length}</span></button>`
      )
      .join("");
  }
  function updateLegend() {
    el.legend.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", state.themes.has(b.dataset.theme)));
    el.matchToggle.toggleAttribute("data-off", state.themes.size < 2);
    el.matchToggle.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.match === state.match));
    el.clear.toggleAttribute("data-off", !(state.themes.size || state.course || state.query));
  }

  // ---------- course list ----------
  function buildList() {
    el.list.innerHTML = sortedCourses
      .map(
        (c) => `<li data-li="${c.i}"><button data-course="${c.i}">
          <span>${esc(c.name)}</span>${dotsHTML(c)}</button></li>`
      )
      .join("");
  }
  function updateList() {
    let shown = 0;
    el.list.querySelectorAll("li").forEach((li) => {
      const c = courses[li.dataset.li];
      const ok = matches(c);
      li.hidden = !ok;
      if (ok) shown++;
      li.firstElementChild.setAttribute("aria-current", c === state.course);
    });
    el.count.textContent = filterActive()
      ? `${shown} of ${courses.length} courses`
      : `${courses.length} courses`;
  }

  // ---------- map ----------
  let mapSel = null; // d3 selections built by buildMap
  let layout = null;

  function computeLayout(w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const r = nodeRadius(w, h);
    // Theme labels are small caps; leave room outside the ring for the widest one.
    const small = w < 560;
    const font = small ? 9.5 : 11;
    const maxChars = small ? 11 : 14;
    const labelLines = new Map(themes.map((t) => [t.id, wrapLabel((t.short || t.name).toUpperCase(), maxChars)]));
    const widest = d3.max(themes, (t) => {
      const ls = labelLines.get(t.id);
      return d3.max(ls, (l, k) =>
        measure(l, font, 600, THEME_TRACKING) + (k === ls.length - 1 ? measure(`  ${t.courses.length}`, font, 400) : 0)
      );
    });
    const gap = r * 3.6 + 10;
    const R = Math.max(80, Math.min(w / 2 - gap - widest - 10, h / 2 - gap - 34));
    const anchors = new Map();
    ring.forEach((id, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length;
      anchors.set(id, { id, a, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
    });
    // One core theme sits dead center; several share a small inner circle.
    const cr = core.length > 1 ? R * 0.22 : 0;
    core.forEach((id, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / core.length;
      anchors.set(id, { id, a, core: true, x: cx + cr * Math.cos(a), y: cy + cr * Math.sin(a) });
    });

    const nodes = courses.map((c, i) => {
      let mx = 0, my = 0;
      c.themes.forEach((id) => { mx += anchors.get(id).x; my += anchors.get(id).y; });
      const k = c.themes.length || 1;
      mx = c.themes.length ? mx / k : cx;
      my = c.themes.length ? my / k : cy;
      // Pull inward a bit so single-theme courses sit inside the ring.
      const tx = cx + (mx - cx) * 0.8;
      const ty = cy + (my - cy) * 0.8;
      const j = (i * 2.399963) % (2 * Math.PI); // golden-angle jitter, deterministic
      return { c, tx, ty, x: tx + Math.cos(j) * 3, y: ty + Math.sin(j) * 3 };
    });

    const sim = d3
      .forceSimulation(nodes)
      .randomSource(seeded(7))
      .force("x", d3.forceX((d) => d.tx).strength(0.22))
      .force("y", d3.forceY((d) => d.ty).strength(0.22))
      .force("collide", d3.forceCollide(r + 3.5).iterations(3))
      .stop();
    for (let t = 0; t < 320; t++) sim.tick();
    nodes.forEach((n) => {
      n.c.x = n.x;
      n.c.y = n.y;
    });
    return { w, h, cx, cy, R, anchors, r, font, labelLines };
  }

  function nodeRadius(w, h) {
    const m = Math.min(w, h);
    return m < 560 ? 4.5 : m < 700 ? 6 : 7;
  }

  function buildMap() {
    const { width: w, height: h } = el.map.getBoundingClientRect();
    if (w < 50 || h < 50) return;
    layout = computeLayout(w, h);
    const { anchors, r } = layout;

    el.map.innerHTML = "";
    // No fade animations while drawing, or new shapes would fade in from full opacity.
    el.map.classList.add("building");
    const svg = d3.select(el.map).append("svg").attr("viewBox", `0 0 ${w} ${h}`).attr("role", "img")
      .attr("aria-label", "Map of courses and the thematic areas they belong to");

    // "Goo" filter: blur then sharpen alpha so circles and spokes melt into one blob.
    const blur = Math.max(6, r * 1.2);
    const f = svg.append("defs").append("filter").attr("id", "goo")
      .attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
    f.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", blur).attr("result", "b");
    f.append("feColorMatrix").attr("in", "b").attr("mode", "matrix")
      .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9");

    // Click on empty space clears the selected course.
    svg.append("rect").attr("width", w).attr("height", h).attr("fill", "transparent")
      .on("click", () => { if (state.course) setCourse(null); });

    const blobs = svg.append("g").selectAll("g.blob").data(orderedThemes).join("g").attr("class", "blob");
    const goo = blobs.append("g").attr("filter", "url(#goo)").attr("fill", (t) => t.color).attr("stroke", (t) => t.color);
    goo.each(function (t) {
      const g = d3.select(this);
      const A = anchors.get(t.id);
      g.append("circle").attr("cx", A.x).attr("cy", A.y).attr("r", r * 3.6).attr("stroke", "none");
      t.courses.forEach((c) => {
        g.append("line").attr("x1", A.x).attr("y1", A.y).attr("x2", c.x).attr("y2", c.y).attr("stroke-width", r * 2.2);
        g.append("circle").attr("cx", c.x).attr("cy", c.y).attr("r", r * 2.6).attr("stroke", "none");
      });
    });

    const spokes = svg.append("g");

    // Theme labels around the ring.
    const labels = svg.append("g").selectAll("g.theme-label").data(orderedThemes.filter((t) => !t.core)).join("g")
      .attr("class", "theme-label")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (t) => `${t.name}, ${t.courses.length} courses`)
      .attr("transform", (t) => {
        const A = anchors.get(t.id);
        const d = r * 3.6 + 10;
        return `translate(${A.x + Math.cos(A.a) * d},${A.y + Math.sin(A.a) * d})`;
      })
      .on("click", (e, t) => toggleTheme(t.id))
      .on("keydown", (e, t) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTheme(t.id); } })
      .on("mouseenter", (e, t) => { state.hoverTheme = t.id; updateMap(); })
      .on("mouseleave", () => { state.hoverTheme = null; updateMap(); });
    labels.each(function (t) {
      const A = anchors.get(t.id);
      const cos = Math.cos(A.a);
      const sin = Math.sin(A.a);
      const anchor = Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end";
      const lines = layout.labelLines.get(t.id);
      const lh = Math.round(layout.font * 1.4);
      // Shift the block so it grows away from the ring.
      const y0 = sin < -0.3 ? -(lines.length - 1) * lh - 2 : sin > 0.3 ? 10 : -((lines.length - 1) * lh) / 2 + 4;
      const g = d3.select(this);
      const text = g.append("text").attr("text-anchor", anchor).attr("fill", "var(--ink)").style("font-size", `${layout.font}px`);
      lines.forEach((ln, k) => {
        const ts = text.append("tspan").attr("x", 0).attr("y", y0 + k * lh).text(ln);
        if (k === lines.length - 1) ts.append("tspan").attr("class", "n").text(`  ${t.courses.length}`);
      });
    });

    // Course dots: tiny pie of their theme colors.
    const pie = d3.pie().value(1).sort(null);
    const arc = d3.arc().innerRadius(0).outerRadius(r);
    const dots = svg.append("g").selectAll("g.course").data(courses).join("g")
      .attr("class", "course")
      .attr("transform", (c) => `translate(${c.x},${c.y})`)
      .on("click", (e, c) => { e.stopPropagation(); setCourse(state.course === c ? null : c); })
      .on("mouseenter", (e, c) => { state.hoverCourse = c; updateMap(); updateMatrix(); })
      .on("mouseleave", () => { state.hoverCourse = null; updateMap(); updateMatrix(); });
    dots.append("circle").attr("r", r + 5).attr("fill", "transparent");
    dots.append("circle").attr("r", r + 0.75).attr("fill", "var(--halo)");
    dots.selectAll("path").data((c) => pie(c.themes.map((id) => themeById.get(id)))).join("path")
      .attr("d", arc).attr("fill", (d) => d.data.color);
    dots.append("circle").attr("class", "ring").attr("r", r + 3.5);
    dots.append("title").text((c) => c.name);

    // Core theme labels sit on top of the dots in the middle, but let clicks through.
    const coreLabels = svg.append("g").selectAll("text.core-label").data(orderedThemes.filter((t) => t.core)).join("text")
      .attr("class", "core-label")
      .attr("text-anchor", "middle")
      .attr("x", (t) => anchors.get(t.id).x)
      .attr("y", (t) => anchors.get(t.id).y + 5)
      .style("font-size", `${layout.font + 1.5}px`);
    coreLabels.append("tspan").text((t) => (t.short || t.name).toUpperCase());
    coreLabels.append("tspan").attr("class", "n").text((t) => `  ${t.courses.length}`);

    const courseLabels = svg.append("g").attr("aria-hidden", "true");

    // Remember where theme labels landed so course pills can steer around them.
    // The SVG is drawn 1:1 with the page, so screen boxes map straight to SVG units.
    const origin = svg.node().getBoundingClientRect();
    const boxOf = (node) => {
      const b = node.getBoundingClientRect();
      return { x0: b.left - origin.left - 3, x1: b.right - origin.left + 3, y0: b.top - origin.top - 2, y1: b.bottom - origin.top + 2 };
    };
    layout.themeBoxes = labels.nodes().map(boxOf);
    layout.coreBoxes = coreLabels.nodes().map(boxOf);

    mapSel = { svg, blobs, labels, coreLabels, dots, spokes, courseLabels };
    updateMap();
    svg.node().getBoundingClientRect(); // apply the starting styles before re-enabling animation
    el.map.classList.remove("building");
  }

  function updateMap() {
    if (!mapSel || state.view !== "map") return;
    const { blobs, labels, coreLabels, dots, spokes, courseLabels } = mapSel;
    const focus = focusThemes();
    const hasFocus = focus.size > 0;
    const ac = activeCourse();

    blobs.style("opacity", (t) => (!hasFocus ? 0.17 : focus.has(t.id) ? 0.36 : 0.045));
    labels.style("opacity", (t) => (!hasFocus || focus.has(t.id) ? 1 : 0.4));
    // Hide the core label while a course is active so it doesn't cover the course's label.
    coreLabels.style("opacity", (t) => (ac ? 0 : !hasFocus || focus.has(t.id) ? 1 : 0.35));

    const filt = filterActive();
    dots
      .classed("on", (c) => c === ac || c === state.course)
      .style("opacity", (c) => {
        if (c === ac || c === state.course) return 1;
        const ok = matches(c);
        if (ac) return ok ? (c.themes.some((id) => ac.themes.includes(id)) ? 0.5 : 0.2) : 0.1;
        return ok ? 1 : 0.12;
      });
    // Keep the active dot on top.
    if (ac) dots.filter((c) => c === ac).raise();

    // Spokes from the active course to each of its themes.
    const sp = ac ? ac.themes.map((id) => ({ c: ac, t: themeById.get(id), A: layout.anchors.get(id) })) : [];
    spokes.selectAll("line").data(sp).join("line").attr("class", "spoke")
      .attr("x1", (d) => d.c.x).attr("y1", (d) => d.c.y).attr("x2", (d) => d.A.x).attr("y2", (d) => d.A.y)
      .attr("stroke", (d) => d.t.color);

    // Labels: the active course always; matching courses when a filter narrows things
    // down, skipping any label that would collide with one already placed.
    const { w, r } = layout;
    const candidates = [];
    if (ac) candidates.push(ac);
    if (state.course && state.course !== ac) candidates.push(state.course);
    if (filt && !ac) {
      const m = courses.filter(matches);
      if (m.length <= 20) candidates.push(...m.filter((c) => !candidates.includes(c)));
    }
    // Each label sits on a small pill next to its dot, flipped to the left near the right edge.
    const size = layout.w < 560 ? 11.5 : 12.5;
    const padX = 7;
    const pillH = Math.round(size * 1.75);
    // Theme labels (and the core label, unless it's hidden) count as already placed.
    const placed = [...layout.themeBoxes, ...(ac ? [] : layout.coreBoxes)];
    const items = [];
    const boxAt = (x0, pw, y) => ({ x0: x0 - 2, x1: x0 + pw + 2, y0: y - pillH / 2 - 2, y1: y + pillH / 2 + 2 });
    const free = (b) =>
      b.x0 >= 0 && b.x1 <= w &&
      !placed.some((p) => p.x0 < b.x1 && b.x0 < p.x1 && p.y0 < b.y1 && b.y0 < p.y1);
    for (const c of candidates) {
      const strong = c === ac || c === state.course;
      const pw = measure(c.name, size, strong ? 600 : 500) + padX * 2;
      const leftX = c.x - r - 5 - pw;
      const rightX = c.x + r + 5;
      // Preferred side first (left near the right edge), then the other side.
      const sides = c.x > w * 0.6 ? [leftX, rightX] : [rightX, leftX];
      let x0 = sides.find((x) => free(boxAt(x, pw, c.y)));
      if (x0 === undefined) {
        if (!strong) continue; // the selected/hovered course always gets its label
        x0 = sides[0];
      }
      placed.push(boxAt(x0, pw, c.y));
      items.push({ c, x0, pw, strong });
    }
    const tags = courseLabels.selectAll("g.course-tag").data(items, (d) => d.c.i).join((enter) => {
      const g = enter.append("g").attr("class", "course-tag");
      g.append("rect");
      g.append("text");
      return g;
    });
    tags.classed("strong", (d) => d.strong).attr("transform", (d) => `translate(${d.x0},${d.c.y - pillH / 2})`);
    tags.select("rect").attr("width", (d) => d.pw).attr("height", pillH).attr("rx", pillH / 2);
    tags.select("text")
      .attr("x", padX)
      .attr("y", pillH / 2)
      .attr("dy", "0.36em")
      .style("font-size", `${size}px`)
      .text((d) => d.c.name);
  }

  // ---------- matrix ----------
  function buildMatrix() {
    const rows = [...courses].sort((a, b) => {
      const pa = a.themes.map((id) => orderIndex.get(id));
      const pb = b.themes.map((id) => orderIndex.get(id));
      for (let k = 0; k < Math.min(pa.length, pb.length); k++) if (pa[k] !== pb[k]) return pa[k] - pb[k];
      return pa.length - pb.length || a.name.localeCompare(b.name);
    });
    el.matrix.innerHTML = `<table>
      <thead><tr><th class="corner"></th>${orderedThemes
        .map((t) => `<th data-theme="${t.id}" style="--c:${t.color}" title="${esc(t.name)}" aria-pressed="false"><div>${esc(t.short || t.name)}</div></th>`)
        .join("")}</tr></thead>
      <tbody>${rows
        .map(
          (c) => `<tr data-row="${c.i}"><th data-course="${c.i}">${esc(c.name)}</th>${orderedThemes
            .map((t) => `<td>${c.themes.includes(t.id) ? `<span style="--c:${t.color}" title="${esc(t.name)}"></span>` : ""}</td>`)
            .join("")}</tr>`
        )
        .join("")}</tbody>
      <tfoot><tr><td></td>${orderedThemes.map((t) => `<td>${t.courses.length}</td>`).join("")}</tr></tfoot>
    </table>`;
    el.matrix.querySelectorAll("tbody tr").forEach((tr) => {
      const c = courses[tr.dataset.row];
      tr.addEventListener("mouseenter", () => { state.hoverCourse = c; updateMatrix(); });
      tr.addEventListener("mouseleave", () => { state.hoverCourse = null; updateMatrix(); });
    });
  }
  function updateMatrix() {
    if (state.view !== "matrix") return;
    const ac = activeCourse();
    el.matrix.querySelectorAll("tbody tr").forEach((tr) => {
      const c = courses[tr.dataset.row];
      tr.classList.toggle("dim", !matches(c) && c !== state.course);
      tr.classList.toggle("on", c === ac || c === state.course);
    });
    el.matrix.querySelectorAll("thead th[data-theme]").forEach((th) => th.setAttribute("aria-pressed", state.themes.has(th.dataset.theme)));
  }

  // ---------- details panel ----------
  function renderDetails() {
    const c = state.course;
    if (c) {
      const rel = related(c);
      el.details.innerHTML = `
        <p class="eyebrow">Course</p>
        <h2>${esc(c.name)}</h2>
        <div class="chips">${c.themes.map(chipHTML).join("")}</div>
        <h3>${esc(cap(lens().noun))}</h3>
        ${c.themes.map((id) => themeBlockHTML(themeById.get(id))).join("")}
        ${rel.length ? `<h3>Related courses</h3><ul class="mini-list">${rel
          .map((r) => `<li><button data-course="${r.c.i}"><span>${esc(r.c.name)}</span>${dotsHTML(r.c, r.shared)}</button></li>`)
          .join("")}</ul>` : ""}`;
      return;
    }
    if (state.themes.size) {
      const sel = orderedThemes.filter((t) => state.themes.has(t.id));
      const m = sortedCourses.filter(matches);
      const joiner = state.match === "all" ? " + " : " or ";
      el.details.innerHTML = `
        <p class="eyebrow">${sel.length > 1 ? (state.match === "all" ? "Overlap" : "Any of") : esc(cap(singular(lens().noun)))}</p>
        <h2>${sel.map((t) => esc(t.short || t.name)).join(joiner)}</h2>
        <p class="hint">${m.length} course${m.length === 1 ? "" : "s"}${sel.length > 1 ? (state.match === "all" ? " in all of these" : " in at least one") : ""}${state.query ? ` matching “${esc(state.query)}”` : ""}.</p>
        ${m.length ? `<ul class="mini-list">${m
          .map((x) => `<li><button data-course="${x.i}"><span>${esc(x.name)}</span>${dotsHTML(x)}</button></li>`)
          .join("")}</ul>` : `<p class="hint">No course is tagged with all of these yet. Try “any”.</p>`}
        <h3>About</h3>
        ${sel.map(themeBlockHTML).join("")}`;
      return;
    }
    el.details.innerHTML = `
      <p class="eyebrow">How to read this</p>
      <p class="hint">Click a course to see its areas and related courses. Click one or more ${esc(lens().noun)} to find the courses where they overlap.${
        el.lensToggle.hidden ? "" : ` Use the switch at the top to organize the same courses by ${esc(Object.values(lensesOf(ds)).filter((l) => l !== lens()).map((l) => l.noun).join(" or "))} instead.`
      }</p>
      <h3>${esc(cap(lens().noun))}</h3>
      <ul class="mini-list">${orderedThemes
        .map((t) => `<li><button data-theme="${t.id}"><span><span class="dots"><i style="--c:${t.color}"></i></span> ${esc(t.name)}</span><span class="hint">${t.courses.length}</span></button></li>`)
        .join("")}</ul>`;
  }

  function themeBlockHTML(t) {
    return `<div class="theme-block" style="--c:${t.color}">
      <h4>${esc(t.name)}${t.core || t.badge ? ` <span class="core-tag">${esc(t.badge || "core")}</span>` : ""}</h4>
      ${t.summary ? `<p class="summary">${esc(t.summary)}</p>` : ""}
      ${t.description && t.description.trim() ? `<p>${esc(t.description)}</p>` : t.summary ? "" : `<p class="todo">Description coming soon.</p>`}
    </div>`;
  }
  function chipHTML(id) {
    const t = themeById.get(id);
    return `<button class="chip" data-theme="${t.id}" style="--c:${t.color}" aria-pressed="${state.themes.has(t.id)}"><span class="sw"></span>${esc(t.short || t.name)}</button>`;
  }
  function dotsHTML(c, only) {
    const ids = only || c.themes;
    return `<span class="dots" aria-hidden="true">${ids.map((id) => `<i style="--c:${themeById.get(id).color}"></i>`).join("")}</span>`;
  }

  // ---------- actions ----------
  function setCourse(c) {
    state.course = c;
    state.hoverCourse = null;
    update();
    if (c) {
      const li = el.list.querySelector(`[data-li="${c.i}"]`);
      if (li && !li.hidden) li.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
  function toggleTheme(id) {
    state.themes.has(id) ? state.themes.delete(id) : state.themes.add(id);
    state.course = null;
    update();
  }
  function setView(v) {
    state.view = v;
    document.querySelectorAll(".view-toggle button").forEach((b) => b.setAttribute("aria-selected", b.dataset.view === v));
    el.map.hidden = v !== "map";
    el.matrix.hidden = v !== "matrix";
    if (v === "map") buildMap(); // size may have changed while hidden
    update();
  }
  function clearAll() {
    state.themes.clear();
    state.match = "all";
    state.course = null;
    state.query = "";
    el.search.value = "";
    update();
  }
  function update() {
    updateLegend();
    updateList();
    updateMap();
    updateMatrix();
    renderDetails();
    writeHash();
  }

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-theme]");
    const c = e.target.closest("[data-course]");
    if (c) setCourse(courses[c.dataset.course] === state.course && !e.target.closest("#details") ? null : courses[c.dataset.course]);
    else if (t) toggleTheme(t.dataset.theme);
  });
  el.list.addEventListener("mouseover", (e) => {
    const b = e.target.closest("[data-course]");
    const c = b ? courses[b.dataset.course] : null;
    if (c !== state.hoverCourse) { state.hoverCourse = c; updateMap(); }
  });
  el.list.addEventListener("mouseleave", () => { state.hoverCourse = null; updateMap(); });
  el.matchToggle.addEventListener("click", (e) => {
    const b = e.target.closest("[data-match]");
    if (b) { state.match = b.dataset.match; update(); }
  });
  el.clear.addEventListener("click", clearAll);
  el.search.addEventListener("input", () => {
    state.query = el.search.value;
    if (state.course && !matches(state.course)) state.course = null;
    update();
  });
  document.querySelectorAll(".view-toggle button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.course) setCourse(null);
      else if (state.themes.size) { state.themes.clear(); update(); }
    }
  });
  let rt;
  new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(buildMap, 120); }).observe(el.map);

  // ---------- switching datasets ----------
  function buildSetTabs() {
    el.setTabs.hidden = DATASETS.length < 2;
    el.setTabs.innerHTML = DATASETS.map(
      (d) => `<button role="tab" data-set="${d.id}" aria-selected="false">${esc(d.tab || d.title)}</button>`
    ).join("");
    el.setTabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-set]");
      if (b && b.dataset.set !== ds.id) {
        loadDataset(b.dataset.set);
        setView(state.view);
      }
    });
    el.lensToggle.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lens]");
      if (b && b.dataset.lens !== state.lens) {
        // Keep the selected course so it can be compared across both organizations.
        const keep = state.course && state.course.slug;
        loadDataset(ds.id, b.dataset.lens);
        state.course = (keep && courseBySlug.get(keep)) || null;
        setView(state.view);
      }
    });
  }
  function loadDataset(id, lensId = "themes") {
    prepare(DATASETS.find((d) => d.id === id) || DATASETS[0], lensId);
    state.themes = new Set();
    state.match = "all";
    state.course = null;
    state.hoverCourse = null;
    state.hoverTheme = null;
    state.query = "";
    el.search.value = "";

    el.setTabs.querySelectorAll("[data-set]").forEach((b) => b.setAttribute("aria-selected", b.dataset.set === ds.id));
    el.title.textContent = ds.title;
    el.subtitle.textContent = ds.subtitle || "";
    el.note.textContent = ds.note || "";
    el.note.hidden = !ds.note;
    el.subtitle.parentElement.hidden = !ds.subtitle && !ds.note; // drop the empty line
    document.title = `${ds.title} · Curriculum Map`;

    // Themes / Practice areas switch: only for datasets with more than one lens.
    const lenses = Object.entries(lensesOf(ds));
    el.lensToggle.hidden = lenses.length < 2;
    el.lensToggle.innerHTML = lenses
      .map(([k, l]) => `<button role="tab" data-lens="${k}" aria-selected="${k === state.lens}">${esc(l.label)}</button>`)
      .join("");

    el.warnings.hidden = !warnings.length;
    el.warnings.innerHTML = warnings.length
      ? `<strong>Check data/${esc(ds.id)}.js:</strong> ${warnings.map(esc).join(" · ")}`
      : "";
    warnings.forEach((w) => console.warn(w));

    buildLegend();
    buildList();
    buildMatrix();
  }

  // ---------- shareable URL (#set=atsp-old&course=… or #themes=a,b&match=any&view=matrix) ----------
  function writeHash() {
    // Ids and slugs are already URL-safe, so build the string by hand to keep commas readable.
    const p = [];
    if (ds.id !== DEFAULT_SET) p.push(`set=${ds.id}`);
    if (state.lens !== "themes") p.push(`by=${state.lens}`);
    if (state.course) p.push(`course=${state.course.slug}`);
    else if (state.themes.size) {
      p.push(`themes=${[...state.themes].join(",")}`);
      if (state.match !== "all") p.push(`match=${state.match}`);
    }
    if (state.view !== "map") p.push(`view=${state.view}`);
    const h = p.join("&");
    const target = h ? `#${h}` : location.pathname + location.search;
    if (location.hash.slice(1) !== h) history.replaceState(null, "", target);
  }
  function readHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    const set = DATASETS.some((d) => d.id === p.get("set")) ? p.get("set") : DEFAULT_SET;
    const by = p.get("by") || "themes";
    if (!ds || ds.id !== set || state.lens !== by) loadDataset(set, by);
    state.course = courseBySlug.get(p.get("course")) || null;
    state.themes = new Set((p.get("themes") || "").split(",").filter((id) => themeById.has(id)));
    state.match = p.get("match") === "any" ? "any" : "all";
    return p.get("view") === "matrix" ? "matrix" : "map";
  }
  window.addEventListener("hashchange", () => setView(readHash()));

  // ---------- helpers ----------
  function themeSimilarity(a, b) {
    const A = themeById.get(a).courses;
    const B = themeById.get(b).courses;
    if (!A.length || !B.length) return 0;
    const shared = A.filter((c) => B.includes(c)).length;
    return shared / Math.sqrt(A.length * B.length);
  }
  // Order ids on a ring to maximise similarity between neighbours (greedy + 2-opt).
  function circularOrder(ids, sim) {
    const n = ids.length;
    if (n < 4) return ids.slice();
    const score = (o) => o.reduce((s, id, i) => s + sim(id, o[(i + 1) % n]), 0);
    let best = null;
    let bestScore = -Infinity;
    for (const start of ids) {
      let o = [start];
      const left = ids.filter((id) => id !== start);
      while (left.length) {
        const last = o[o.length - 1];
        let bi = 0;
        left.forEach((id, k) => { if (sim(last, id) > sim(last, left[bi])) bi = k; });
        o.push(left.splice(bi, 1)[0]);
      }
      let improved = true;
      while (improved) {
        improved = false;
        for (let i = 1; i < n - 1; i++)
          for (let j = i + 1; j < n; j++) {
            const cand = o.slice(0, i).concat(o.slice(i, j + 1).reverse(), o.slice(j + 1));
            if (score(cand) > score(o) + 1e-9) { o = cand; improved = true; }
          }
      }
      const s = score(o);
      if (s > bestScore + 1e-9) { bestScore = s; best = o; }
    }
    return best;
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const singular = (s) => s.replace(/s$/, "");
  // Text width in px, measured with the page font so labels and pills fit exactly.
  // `tracking` is letter-spacing in em, to match the CSS on small-caps labels.
  const THEME_TRACKING = 0.08;
  let measureCtx;
  function measure(text, size, weight = 400, tracking = 0) {
    measureCtx = measureCtx || document.createElement("canvas").getContext("2d");
    measureCtx.font = `${weight} ${size}px Inter, ui-sans-serif, system-ui, sans-serif`;
    return measureCtx.measureText(text).width + tracking * size * text.length;
  }
  // Greedy word wrap; never leaves "&" at the start of a line.
  function wrapLabel(s, max) {
    const lines = [];
    let cur = "";
    for (const word of s.split(/\s+/)) {
      const next = cur ? `${cur} ${word}` : word;
      if (cur && next.length > max && word !== "&") {
        lines.push(cur);
        cur = word;
      } else cur = next;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function seeded(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  }

  // ---------- go ----------
  if (!DATASETS.length) {
    el.warnings.hidden = false;
    el.warnings.textContent = "No data loaded. Check that the data/*.js files are listed in index.html.";
    return;
  }
  buildSetTabs();
  setView(readHash());
  // Re-measure and redraw once Inter has loaded (the first draw may use a fallback font).
  if (document.fonts) document.fonts.ready.then(() => { if (state.view === "map") buildMap(); });
})();
