/*
 * Art & Technology / Sound Practices (AT/SP): current curriculum.
 * ---------------------------------------------------------------
 * Each data/*.js file adds one view to the page. To change a view, edit only its file.
 *
 * This view can be organized two ways (a switch on the page): by THEMES, which
 * "span the slash" across the department, or by practice AREAS, which are media-specific.
 * Every course lists both.
 *
 * THEMES and AREAS: each entry has
 *   id          short code used in COURSES below (lowercase, no spaces)
 *   name        full name, shown in the detail panel
 *   short       short label, shown on the map
 *   summary     optional one-line summary, shown above the description
 *   description paragraph shown when the theme/area is selected
 *   core        optional; true puts it at the center of the map instead of on the ring
 *   badge       optional small tag shown next to the name (e.g. "exploratory")
 *   color       optional "#hex"; otherwise a color is picked automatically
 *
 * COURSES: each course with its theme ids (`themes`) and practice area ids (`areas`).
 * Order doesn't matter. If a course uses an id that doesn't exist, the page shows a
 * warning at the top.
 *
 * Sources: themes and areas from the department's "Curricular Areas" and "AT/SP
 * Curricular Themes" text (Oct 2025). Courses from the Curricular Areas lists, plus
 * "Spring 2026 – courses by area" and the 2026–27 Curriculum Committee deck.
 * Open-topic seminars and project courses (Interdisciplinary Seminar, Exhibition
 * Practices Seminar, Advanced Art & Tech / Sound Projects) are tagged with every theme
 * and every area (ALL_THEMES / ALL_AREAS), so they sit at the center of both maps.
 *
 * Practice areas come from those lists; a few new courses not in any list are marked
 * "area proposed".
 *
 * DRAFT THEME TAGGING — please review. Each course is marked with where its theme
 * tags came from:
 *   [atsp-draft] translated from its tags in the prior assessment draft
 *                (data/atsp-old.js): sensory→embodied, play/immersive→misplay,
 *                retro/history→retro, poetic→poetic, hacked→hacked,
 *                eco/bio→radiant, code→generative
 *   [doc]        named as an example course in the Curricular Themes text
 *   [proposed]   new course; tags guessed from its title/description
 */
window.DATASETS = window.DATASETS || [];
(() => {
const THEMES = [
  {
    id: "generative",
    name: "Generative Systems",
    short: "Generative",
    core: true,
    color: "#4e79a7",
    summary:
      "Emergent, algorithmic, and systemic logics as creative material. Artists both critique and reconfigure infrastructures of power, revealing hidden potentials in code, networks, and AI while opening space for new collectivities and experiences.",
    description:
      "Complex technological systems comprise much of the support structure and communications environment we rely on in daily life. We artists are relentlessly appropriating, repurposing, and subverting these systems in order to critique their provenance, reveal their hidden potentials, unlock experiential potentials, or suggest alternative social frameworks. Often the seeds of new creative behaviors are hidden within the very complexity and instability of modern technological systems, waiting to be released.",
  },
  {
    id: "embodied",
    name: "Embodied & Sensory Systems",
    short: "Embodied & Sensory",
    color: "#f28e2b",
    summary:
      "Bodies and senses as sites of reciprocity with technology. Practices amplify perception, extend awareness, and foreground performance, sound, tactility, and non-human sensing.",
    description:
      "Our bodies and their senses are the starting point for our reciprocal development with technology and the artistic practices that ensue. In AT/SP, we focus on how our bodies adjust to and influence ever-changing sonic and technological landscapes. Sound as a practice is perhaps unique in that it defines itself through a particular bodily sense, and immersive practices in art and technology often go beyond the visual to engage kinesthetic, olfactory, and tactile experiences. Improvisation and live performance foreground bodies in the present, collapsing immediacy and reflection into a decentralized yet focused flow. These embodied practices augment perception, extend awareness, and promote Five senses + extension through technology, non-human sense?, embodied performance, enhanced/extended awareness, proprioceptive, augmented perception, prosthetic, surrogate, reciprocal -- art + medical design?",
  },
  {
    id: "misplay",
    name: "Immersion & Mis/Play",
    short: "Immersion & Mis/Play",
    color: "#e15759",
    summary:
      "Rules, games, improvisations, and immersive environments reconfigure perception and social space. Through play and mis/use, artists imagine new realms of relation.",
    description:
      "Game mechanics, compositional systems, and focused improvisation generate transformative environments, unexpected encounters, and new social configurations. Our coding and disruption of rules and conventions stimulate unanticipated outcomes and imagine new realms of experience.",
  },
  {
    id: "retro",
    name: "Retrofuturistic Systems",
    short: "Retrofuturistic",
    color: "#b07aa1",
    summary:
      "Technology is cyclical, not linear. Media archaeology, obsolescence, and speculative futures intertwine to keep history in circulation with indeterminate horizons.",
    description:
      "In a rapidly evolving technoculture, our tools, environments, and artworks partake of both the durability of information and the ephemerality of media that are always obsolescing. How do we grapple - conceptually and practically - with the unique forms of transience that our practices encounter and create? In AT/SP, we continually adapt to the risks and potentialities of fluidly changing media and cultural conditions. For us, technology does not develop in a linear fashion that discards continuously previous manifestations; rather, we constantly revisit earlier technologies and cycle them through the current moment in a continuous interchange with history aimed at the indeterminate future.",
  },
  {
    id: "poetic",
    name: "Poetic, Linguistic & Narrative Systems",
    short: "Poetic & Linguistic",
    color: "#9c755f",
    summary:
      "Language, code, and symbolic structures as media for expression and critique. Text, sound, and computation converge in poetic, narrative, and speculative experiments.",
    description:
      "Experimentations with language, speech, and symbolic systems invite hybrid practices of interrogation and expression as well as a critique of the power dynamics underlying these systems. While any work can have poetic dimensions, linguistic systems offer rich artistic potential in their inherently complex collision of definition, arbitrariness, hierarchy, and community. AT/SP has a long legacy in the history of language and text-based art that includes innovative forms of media poetry, electronic writing, poetic computation, holo-poetry, bio-poetry, transmission arts, and text-sound composition.",
  },
  {
    id: "hacked",
    name: "Handmade & Hacked Systems",
    short: "Handmade & Hacked",
    color: "#edc948",
    summary:
      "Material, tactile, and interventionist practices. Artists invent instruments, bend circuits, prototype interfaces, and misuse devices to expose and reimagine their potential.",
    description:
      "Artists can sometimes approach materiality at a fundamental level by engaging basic materials, including electricity itself, through DIY approaches to electronics, mechanics, prototyping, and fabrication. This can take a purpose-built form through circuit building, sound synthesis, instrument invention, or interface design; or it can take an interventionist approach through hardware hacking, circuit bending, noise, or intentional mis-uses of technological devices and systems.",
  },
  {
    id: "radiant",
    name: "Radiant & Organic Systems",
    short: "Radiant & Organic",
    color: "#59a14f",
    summary:
      "Art entangled with ecology, biology, and the elemental. Practices blur subject/environment boundaries, exploring light, sound, air, living systems, and synthetic surrogates.",
    description:
      "Elements of ecological and biological systems offer artists materials for interrogating some of our most fundamental, intertwined relationships with the human and non-human. In AT/SP, we produce works that engage with light, air, sound, and living organisms through practices such as acoustic ecology, bio art, and purpose-built kinetic systems to explore the organic environment or model surrogate synthetic systems. Often these practices intentionally blur the boundaries between subjects and environments, requiring us to understand ourselves as inseparable participants in the world around us and to explore the implications of that interconnectedness.",
  },
];

const AREAS = [
  {
    id: "sonic",
    name: "Sonic Arts",
    short: "Sonic Arts",
    color: "#f28e2b",
    description:
      "The Sound Practices area in AT/SP is a unique environment where students study sound in a rigorous, exploratory, and interdisciplinary context. Its extensive sonic arts pedagogy embraces a wide range of approaches to sound art and music that challenges conventional music and media arts approaches.",
  },
  {
    id: "coding",
    name: "Creative Coding & AI",
    short: "Creative Coding & AI",
    color: "#4e79a7",
    description:
      "Learning to code fosters a capacity for computational thinking, which is a skill that intersects with all manner of software and hardware applications explored across the department's curriculum. Code is a tool that empowers students to bridge technological and creative contexts, as well as a creative medium unto itself. Students are exposed to a variety of coding languages, including JavaScript, p5.js, Processing, Arduino, and Python, as well as visual scripting languages like Max/MSP, TouchDesigner and ComfyUI that enable the creation of interactive installations, real-time performance, web-based and embedded software applications, generative animations, data visualization and more.",
  },
  {
    id: "immersive",
    name: "Immersive Media: Virtual Reality, Augmented Reality, and Games",
    short: "Immersive Media",
    color: "#e15759",
    description:
      "Students can explore real time simulation, virtual or augmented reality, and games, contributing to the evolving cultural and art-world manifestations of these forms. Areas of experimentation might include speculative world-building, empathy machines, role-playing and tactical mis/play, or immersively embodied performance and installations.",
  },
  {
    id: "electronics",
    name: "Electronics, Kinetics, and Robotics",
    short: "Electronics & Robotics",
    color: "#edc948",
    description:
      "Students generate original prototypes and hack existing technologies to create electronic objects and experiences. Code is essential for controlling the behavior of the surrogates, cyborgs, and simulated bodies we create. Our specific focus on electro-mechanical fabrication in AT/SP gives form and motion to robotic objects and installations. Electronics, programming and mechanical fabrication all come together to create mechatronic systems.",
  },
  {
    id: "light",
    name: "Light",
    short: "Light",
    color: "#d37295",
    description:
      "Artists understand the vital role of light, and it’s rare to find art untouched by its influence. In AT/SP, we engage directly with light across diverse contexts, exploring its potential through a wide array of sources.",
  },
  {
    id: "bio",
    name: "Bio Art",
    short: "Bio Art",
    color: "#59a14f",
    description:
      "When working with Bioart, artists literally create or manipulate life both at the macroscopic and microscopic levels. In Art and Technology Studies, we produce works that are (or incorporate) living organisms or systems in which the living and the non-living are intertwined.",
  },
  {
    id: "history",
    name: "History and Theory",
    short: "History & Theory",
    color: "#79706e",
    description:
      "The AT/SP area contributes significantly to the SAIC community by teaching both the history and the theory of art, technology, and sound. This occurs not only in the context of the studio classes but also in a group of focused graduate seminars and undergraduate lecture courses infused and enriched by the work of international artists and theoreticians. History courses underscore the fertile, complementary, and long-standing relationship between artists and technology.",
  },
  {
    id: "poetic",
    name: "Poetic Systems",
    short: "Poetic Systems",
    badge: "exploratory",
    color: "#9c755f",
    description:
      "The Art & Technology / Sound Practices department has a long legacy of contributions to the history of technological and sonically embodied poetic and narrative practices including innovative and invented forms of media poetry, electronic writing, embodied poetics, and text-sound composition.",
  },
  {
    id: "retro",
    name: "Retro Tech: Vintage Computing + Audio Technologies",
    short: "Retro Tech",
    badge: "exploratory",
    color: "#b07aa1",
    description:
      "Students may not remember working with clunky computers, whirring floppy disks, vintage synths, and image processors, but they are increasingly exposed to the possibilities they offer through art exhibitions and loyal online fanbases. Working with these older systems is an invitation to transform \"obsolescence\" and \"inefficiency\" into critically engaged strategies that interrogate false narratives of technological progress. Studio courses explore vintage programming languages, historic interfaces, and creative techniques within the context of platform studies. Seminar lectures introduce students to strategies for preservation and conservation, allowing them to consider the care required for the longevity of their artworks.",
  },
];

// For open-topic courses that span the whole department.
const ALL_THEMES = THEMES.map((t) => t.id);
const ALL_AREAS = AREAS.map((a) => a.id);

// Theme-tag sources are noted at the end of each line (see the key at the top).
// "area proposed" = the course isn't in any area list; its area is a guess.
const COURSES = [
  // ---- Intro / core ----
  { name: "Introduction to Sound Practices", areas: ["sonic"], themes: ["embodied", "misplay"] }, // [atsp-draft]
  { name: "Art and Technology Practices", areas: ["coding", "electronics"], themes: ["generative", "hacked", "retro"] }, // [atsp-draft]
  { name: "Introduction to Art & Technology", areas: ["coding", "electronics"], themes: ["generative", "hacked"] }, // [proposed]; area proposed
  { name: "Introduction to Games & Immersive Media", areas: ["immersive"], themes: ["misplay", "generative"] }, // [proposed]; area proposed

  // ---- Open-topic seminars & projects (span every theme and area) ----
  { name: "Advanced Art and Tech / Sound Projects", areas: ALL_AREAS, themes: ALL_THEMES },
  { name: "Interdisciplinary Seminar: AT/SP", areas: ALL_AREAS, themes: ALL_THEMES },
  { name: "AT/SP Exhibition Practices Seminar", areas: ALL_AREAS, themes: ALL_THEMES },

  // ---- Sonic Arts ----
  { name: "Sound Installation", areas: ["sonic"], themes: ["embodied", "misplay"] }, // [atsp-draft]
  { name: "Sound Now: Improvisation", areas: ["sonic"], themes: ["misplay", "embodied"] }, // [atsp-draft]
  { name: "Analog Synthesis", areas: ["sonic"], themes: ["retro", "misplay", "hacked"] }, // [atsp-draft] + [doc] hacked
  { name: "Digital Music: Concepts, Structures, Materials", areas: ["sonic"], themes: ["embodied"] }, // [atsp-draft]
  { name: "Noise", areas: ["sonic"], themes: ["embodied", "misplay", "hacked"] }, // [atsp-draft]
  { name: "Sound Performance and Sensory Systems", areas: ["sonic"], themes: ["embodied"] }, // [proposed]
  { name: "Text-Sound-Transmission", areas: ["sonic", "poetic"], themes: ["poetic", "embodied"] }, // [doc] text-sound / transmission arts
  { name: "Acoustic Ecology & Phonography", areas: ["sonic"], themes: ["embodied", "radiant"] }, // [atsp-draft] + [doc] radiant
  { name: "Analog Sound Studio", areas: ["sonic"], themes: ["embodied", "retro"] }, // [proposed]; area proposed
  { name: "Digital Audio Production", areas: ["sonic"], themes: ["embodied", "misplay"] }, // [atsp-draft]
  { name: "Mixing & Mastering", areas: ["sonic"], themes: ["embodied"] }, // [proposed]; area proposed
  { name: "Sound & Image", areas: ["sonic"], themes: ["embodied"] }, // [atsp-draft]
  { name: "Hardware Hacking", areas: ["sonic", "electronics"], themes: ["hacked", "embodied"] }, // [proposed]
  { name: "Selected Topics: Doubles", areas: ["sonic"], themes: ["embodied"] }, // [proposed]
  { name: "Spatial Audio", areas: ["sonic", "immersive"], themes: ["embodied"] }, // [proposed]; area proposed
  { name: "Sound & the Sensorium", areas: ["sonic"], themes: ["embodied"] }, // [proposed]; area proposed
  { name: "Retro Sound: Ghost in the Machine", areas: ["sonic", "retro"], themes: ["retro", "embodied"] }, // [proposed]; area proposed
  { name: "Public Sound & Space", areas: ["sonic"], themes: ["embodied", "misplay"] }, // [atsp-draft]
  { name: "Feminist Sonic Memory Practice", areas: ["sonic"], themes: ["embodied"] }, // [doc]
  { name: "Instrument Construction", areas: ["sonic", "electronics"], themes: ["hacked", "embodied"] }, // [doc]
  { name: "Free Radio SAIC", areas: ["sonic", "poetic"], themes: ["poetic", "embodied"] }, // [proposed]; area proposed
  { name: "Out-Voicing", areas: ["sonic"], themes: ["embodied", "poetic"] }, // [proposed]; area proposed

  // ---- Creative Coding & AI ----
  { name: "Interactive Art & Creative Coding", areas: ["coding"], themes: ["generative", "misplay"] }, // [atsp-draft] + [doc]
  { name: "Code Sourcery: Algorithmic Practices", areas: ["coding"], themes: ["generative"] }, // [atsp-draft]
  { name: "Programming for Sound: Max/MSP", areas: ["coding", "sonic"], themes: ["generative", "misplay"] }, // [atsp-draft] (was Max for Live)
  { name: "Introduction to Computer Vision", areas: ["coding"], themes: ["embodied", "generative"] }, // [atsp-draft]
  { name: "Blockchain: The New Internet", areas: ["coding"], themes: ["generative"] }, // [atsp-draft]
  { name: "Artificial Intelligence", areas: ["coding"], themes: ["generative"] }, // [atsp-draft]
  { name: "Drawing Machines", areas: ["coding"], themes: ["generative", "hacked"] }, // [proposed]
  { name: "Neural Media", areas: ["coding"], themes: ["generative", "poetic"] }, // [proposed]; area proposed
  { name: "Language Games: Dialoguing with AI", areas: ["coding", "poetic"], themes: ["poetic", "generative"] }, // [proposed]
  { name: "Radical Networks", areas: ["coding"], themes: ["generative", "hacked"] }, // [proposed]; area proposed
  { name: "Live Media", areas: ["coding", "immersive"], themes: ["generative", "misplay"] }, // [proposed]; area proposed 

  // ---- Immersive Media ----
  { name: "New Realities: Simulations of Future Worlds", areas: ["immersive"], themes: ["misplay", "generative"] }, // [atsp-draft]
  { name: "Virtual Reality", areas: ["immersive"], themes: ["misplay", "embodied", "generative"] }, // [atsp-draft]
  { name: "Advanced Virtual Reality", areas: ["immersive"], themes: ["misplay", "embodied", "generative"] }, // [proposed] same as Virtual Reality
  { name: "Virtual Sound", areas: ["immersive", "sonic"], themes: ["misplay", "embodied", "generative"] }, // [atsp-draft]
  { name: "Experimental Game Lab", areas: ["immersive"], themes: ["misplay", "generative"] }, // [atsp-draft] + [doc]
  { name: "Video Game Music Composition", areas: ["immersive", "sonic"], themes: ["misplay", "generative"] }, // [atsp-draft]
  { name: "Mixed Reality Performance", areas: ["immersive"], themes: ["misplay", "embodied"] }, // [proposed]
  { name: "Augmented Sites", areas: ["immersive"], themes: ["misplay"] }, // [proposed]
  { name: "Experimental Mixed Reality", areas: ["immersive"], themes: ["misplay", "embodied"] }, // [proposed]; area proposed
  { name: "Futurecraft: Speculative Worlds & Narrative Game Design", areas: ["immersive"], themes: ["misplay", "poetic"] }, // [proposed]
  { name: "Playable Texts", areas: ["poetic", "immersive"], themes: ["poetic", "misplay"] }, // [proposed]; area proposed

  // ---- Electronics, Kinetics, and Robotics ----
  { name: "Mechanisms, Movement & Meaning", areas: ["electronics"], themes: ["embodied", "generative"] }, // [atsp-draft]
  { name: "Fabrication for Motion", areas: ["electronics"], themes: ["hacked"] }, // [proposed]
  { name: "Robotics", areas: ["electronics"], themes: ["hacked", "generative"] }, // [atsp-draft]
  { name: "Air, Fluid, and Actuators", areas: ["electronics"], themes: ["embodied", "generative"] }, // [atsp-draft]
  { name: "Hacking the Object", areas: ["electronics"], themes: ["retro", "hacked", "generative"] }, // [atsp-draft]; area proposed
  { name: "Graduate Kinetics & Robotics Workshop", areas: ["electronics"], themes: ["hacked", "generative"] }, // [proposed]; area proposed
  { name: "Electronic Textiles & the Body", areas: ["electronics"], themes: ["embodied", "misplay"] }, // [atsp-draft]; area proposed
  { name: "Brave N3w B0d1es: Posthuman Practices", areas: ["electronics", "bio"], themes: ["embodied", "hacked"] }, // [atsp-draft]; area proposed
  { name: "Hybrid Ecologies", areas: ["electronics", "bio"], themes: ["radiant", "hacked"] }, // [proposed]

  // ---- Light ----
  { name: "Neon Techniques", areas: ["light"], themes: ["embodied", "radiant"] }, // [atsp-draft]
  { name: "Advanced Neon", areas: ["light"], themes: ["embodied", "radiant"] }, // [atsp-draft]
  { name: "Light Experiments", areas: ["light"], themes: ["embodied", "radiant"] }, // [atsp-draft]
  { name: "Digital Light Projections", areas: ["light"], themes: ["embodied", "radiant", "misplay"] }, // [atsp-draft]
  { name: "Public Light & Space", areas: ["light"], themes: ["embodied", "radiant", "misplay"] }, // [atsp-draft]
  { name: "Holography", areas: ["light"], themes: ["embodied", "retro", "radiant"] }, // [atsp-draft]
  { name: "Shaping Light", areas: ["light"], themes: ["embodied", "radiant", "misplay"] }, // [atsp-draft]
  { name: "Graduate Neon Workshop", areas: ["light"], themes: ["radiant"] }, // [proposed]; area proposed
  { name: "Neon Light & Ceramics", areas: ["light"], themes: ["radiant", "hacked"] }, // [proposed]; area proposed
  { name: "Chromatic Explorations", areas: ["light"], themes: ["radiant", "embodied"] }, // [proposed]; area proposed

  // ---- Bio Art ----
  { name: "Bio Art Studio", areas: ["bio"], themes: ["embodied", "radiant", "hacked"] }, // [atsp-draft]
  { name: "Synthetic Futures: Biodesign Challenge", areas: ["bio"], themes: ["embodied", "radiant"] }, // [atsp-draft]
  { name: "Astrobiology and Speculative Futurism", areas: ["bio"], themes: ["misplay", "radiant"] }, // [atsp-draft]
  { name: "Soft Bulletins: Biological Communication", areas: ["bio"], themes: ["hacked", "radiant", "generative"] }, // [atsp-draft]
  { name: "Olfactory Art", areas: ["bio"], themes: ["embodied", "radiant"] }, // [atsp-draft]

  // ---- History and Theory ----
  { name: "Art & Biotechnology", areas: ["history", "bio"], themes: ["radiant"] }, // [proposed]
  { name: "Art & Technology: 1900 to Now", areas: ["history"], themes: ["retro"] }, // [proposed]
  { name: "Women in Cyberspace", areas: ["history"], themes: ["generative", "retro"] }, // [atsp-draft]
  { name: "Philosophy of Art & Technology", areas: ["history"], themes: ["generative", "retro"] }, // [proposed]
  { name: "Chaosmotic Systems: Culture, Cosmology, and Computation", areas: ["history"], themes: ["generative"] }, // [proposed]

  // ---- Poetic Systems (exploratory) ----
  { name: "Electronic Writing", areas: ["poetic"], themes: ["poetic", "generative"] }, // [atsp-draft] + [doc]
  { name: "Poetic Systems", areas: ["poetic", "coding"], themes: ["poetic", "generative", "misplay"] }, // [atsp-draft] + [doc]; listed as "Poetic Systems Lab" under Poetic Systems
  { name: "The Electronic Manuscript", areas: ["poetic"], themes: ["poetic", "retro"] }, // [proposed]
  { name: "Social Media Narratives", areas: ["poetic"], themes: ["poetic", "generative", "retro"] }, // [atsp-draft]
  { name: "Suspended Language", areas: ["poetic", "sonic"], themes: ["poetic", "embodied"] }, // [proposed]

  // ---- Retro Tech (exploratory) ----
  { name: "Retro Tech: Programming", areas: ["retro"], themes: ["retro", "hacked"] }, // [atsp-draft]
  { name: "Retro Tech: Restoration and Preservation", areas: ["retro"], themes: ["retro", "generative"] }, // [atsp-draft]
  { name: "Retro Tech: Mixed Signals", areas: ["retro"], themes: ["retro", "hacked"] }, // [proposed]
  { name: "Anachronistic Sound", areas: ["retro", "sonic"], themes: ["retro", "embodied"] }, // [proposed]
];

window.DATASETS.push({
  id: "atsp",
  tab: "Art & Technology / Sound Practices",
  title: "Art & Technology / Sound Practices",
  themes: THEMES,
  courses: COURSES,
  // Second way to organize this view; adds the Themes / Practice areas switch.
  lenses: {
    themes: { label: "Themes", noun: "thematic areas" },
    areas: { label: "Practice areas", noun: "practice areas", list: AREAS },
  },
});
})();
