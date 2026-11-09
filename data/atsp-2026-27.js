/*
 * 26/27 (draft): the AT/SP courses scheduled in the "Art & Technology / Sound Practices:
 * Curriculum Committee Spring 26" deck (Fall 2026 and Spring 2027).
 *
 * This view reuses everything from data/atsp.js: the themes, the practice areas, and each
 * course's tags. This file only lists WHICH courses to show, so edit tags in atsp.js and
 * they update here too. Names must match atsp.js exactly; a name that doesn't match
 * shows up in the yellow warning at the top of the page.
 *
 * Must load after data/atsp.js in index.html.
 */
window.DATASETS = window.DATASETS || [];
(() => {
const COURSE_NAMES = [
  // ---- Fall 2026 ----
  "Introduction to Sound Practices",
  "Introduction to Games & Immersive Media",
  "Art and Technology Practices",
  "Light Experiments",
  "Analog Sound Studio",
  "Digital Audio Production",
  "Mixing & Mastering",
  "New Realities: Simulations of Future Worlds",
  "Hacking the Object",
  "Digital Light Projections",
  "Playable Texts",
  "Bio Art Studio",
  "Sound & the Sensorium",
  "Retro Sound: Ghost in the Machine",
  "Robotics",
  "Artificial Intelligence",
  "Graduate Neon Workshop",
  "Interdisciplinary Seminar: AT/SP",
  "Interactive Art & Creative Coding",
  "Fabrication for Motion",
  "Women in Cyberspace",
  "Radical Networks",
  "Sound Installation",
  "Retro Tech: Programming",
  "Chaosmotic Systems: Culture, Cosmology, and Computation",

  // ---- Spring 2027 (in progress) ----
  // Introduction to Sound Practices also runs in Spring (x3); listed once above.
  "Introduction to Art & Technology",
  "Mechanisms, Movement & Meaning",
  "Neon Techniques",
  "Free Radio SAIC",
  "Spatial Audio",
  "Digital Music: Concepts, Structures, Materials",
  "Sound & Image",
  "Hardware Hacking",
  "Analog Synthesis",
  "Public Sound & Space",
  "Olfactory Art",
  "Neon Light & Ceramics",
  "Experimental Mixed Reality",
  "Electronic Textiles & the Body",
  "Chromatic Explorations",
  "Hybrid Ecologies",
  "Air, Fluid, and Actuators",
  "Introduction to Computer Vision",
  "Noise",
  "Drawing Machines",
  "Retro Tech: Restoration and Preservation",
  "Public Light & Space",
  "Experimental Game Lab",
  "Brave N3w B0d1es: Posthuman Practices",
  "Art & Technology: 1900 to Now",
  "Graduate Kinetics & Robotics Workshop",
  "AT/SP Exhibition Practices Seminar",
  "Art & Biotechnology",
  "Out-Voicing",
  // New & in-progress offerings
  "Neural Media",
  "Live Media",
];

const base = window.DATASETS.find((d) => d.id === "atsp");
if (!base) {
  console.warn("data/atsp-2026-27.js needs data/atsp.js to load first.");
  return;
}
const byName = new Map(base.courses.map((c) => [c.name, c]));

window.DATASETS.push({
  id: "atsp-2026-27",
  tab: "26/27 (draft)",
  title: "26/27 (draft)",
  themes: base.themes,
  lenses: base.lenses,
  // Unknown names come through with no tags, so the page flags them.
  courses: COURSE_NAMES.map((name) => byName.get(name) || { name, themes: [], areas: [] }),
});
})();
