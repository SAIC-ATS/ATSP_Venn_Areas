/*
 * AT/SP (prior assessment draft): the earlier curriculum and thematic areas.
 * Same format as data/atsp.js — see the comment at the top of that file.
 */
window.DATASETS = window.DATASETS || [];
(() => {
const THEMES = [
  {
    id: "play",
    name: "Interactive and Tactical Play Systems",
    short: "Play",
    description:
      "Game mechanics, compositional systems, and focused improvisation generate transformative environments, unexpected encounters, and new social configurations. They often foreground the immediate experience of the artist in the moment of making a work. Whether creating live or real-time improvisations with human or non-human collaborators, or crafting role-playing performances, art games, virtual simulations, or spatialized soundscapes, our coding and disruption of rules and conventions stimulate unanticipated outcomes and imagine new realms of experience.",
  },
  {
    id: "sensory",
    name: "Embodied and Sensory Systems",
    short: "Embodied & Sensory",
    description:
      "Our bodies and their senses are the starting point for our reciprocal development with technology and the artistic practices that ensue. In AT/SP, we focus on how our bodies adjust to and influence ever-changing sonic and technological landscapes. Sound as a practice is perhaps unique in that it defines itself through a particular bodily sense, and immersive practices in art and technology often go beyond the visual to engage kinesthetic, olfactory, and tactile experiences. Improvisation and live performance foreground bodies in the present, collapsing immediacy and reflection into a decentralized yet focused flow. These embodied practices augment perception, extend awareness, and promote Five senses + extension through technology, non-human sense?, embodied performance, enhanced/extended awareness, proprioceptive, augmented perception, prosthetic, surrogate, reciprocal -- art + medical design?",
  },
  {
    id: "retro",
    name: "Retrofuturistic Systems",
    short: "Retrofuturistic",
    description:
      "In a rapidly evolving technoculture, our tools, environments, and artworks partake of both the durability of information and the ephemerality of media that are always obsolescing. How do we grapple - conceptually and practically - with the unique forms of transience that our practices encounter and create? In AT/SP, we continually adapt to the risks and potentialities of fluidly changing media and cultural conditions. For us, technology does not develop in a linear fashion that discards continuously previous manifestations; rather, we constantly revisit earlier technologies and cycle them through the current moment in a continuous interchange with history aimed at the indeterminate future. In doing so, we become stewards of history indexly0ging and honoring creative possibilities and alternative traditions as they continuously emerge, recede, and resurface.",
  },
  {
    id: "poetic",
    name: "Linguistic and Poetic Systems",
    short: "Linguistic & Poetic",
    description:
      "Experimentations with language, speech, and symbolic systems invite hybrid practices of interrogation and expression as well as a critique of the power dynamics underlying these systems. While any work can have poetic dimensions, linguistic systems offer rich artistic potential in their inherently complex collision of definition, arbitrariness, hierarchy, and community. AT/SP has a long legacy in the history of language and text-based art that includes innovative forms of media poetry, electronic writing, poetic computation, bio-poetics, transmission arts, and text-sound composition.",
  },
  {
    id: "eco",
    name: "Ecological and Biological Systems",
    short: "Ecological & Biological",
    description:
      "Elements of ecological and biological systems offer artists materials for interrogating some of our most fundamental, intertwined relationships with the human and non-human. In AT/SP, we produce works that engage with light, air, sound, DNA, and living organisms through practices such as acoustic ecology, bio art, and purpose-built kinetic systems to explore the organic environment. Often these practices intentionally blur the boundaries between subjects and environments, requiring us to understand ourselves as inseparable participants in the world around us and to explore the implications of that interconnectedness.",
  },
  {
    id: "hacked",
    name: "Handmade and Hacked Systems",
    short: "Handmade & Hacked",
    description:
      "Artists can sometimes approach materiality at a fundamental level by engaging basic materials, including electricity itself, through DIY approaches to electronics, mechanics, prototyping, and fabrication. This can take a purpose-built form through circuit building, sound synthesis, instrument invention, or interface design; or it can take an interventionist approach through hardware hacking, circuit bending, noise, or intentional mis-uses of technological devices and systems.",
  },
  {
    id: "immersive",
    name: "Immersive and Extensive Systems",
    short: "Immersive & Extensive",
    description:
      "Direct technological interventions into our perceptual frameworks – neural, physiological, or social – present us with the potential to expand and critique our relationships to our environments and each other. Game mechanics, virtual and immersive environments, robotics, kinetics, and spatialized soundscapes take the attributes of the physical, social, perceptual, and environmental systems of our world and reconfigure them into newly imagined realities. Artworks in these realms amplify our (real or imagined) bodies, question our preconditioned codes of engagement, and revise the possibilities of how we might reimagine ourselves and make space for human and non-human others.",
  },
  {
    id: "bio",
    name: "Light, Bio Art, and Ecology",
    short: "Light & Bio Art",
    description:
      "When working with light, biological materials, and environmental conditions, artists and composers create or manipulate life and life-like behaviors both at the macroscopic and microscopic levels. In AT/SP, we produce works that engage with light, air, dna, acoustic and ecologies, living organisms, and purpose built mechanical systems to explore the organic environment.",
  },
  {
    id: "code",
    name: "Programmed and Scored Systems",
    short: "Programmed & Scored",
    description: "", // TODO: description still to be written
  },
  {
    id: "history",
    name: "Archival and Media History Systems",
    short: "Archival & Media History",
    description: "", // TODO: description still to be written
  },
];

const COURSES = [
  { name: "Introduction to Sound Practices", themes: ["immersive", "sensory"] },
  { name: "Mechanisms, Movement & Meaning", themes: ["sensory", "code"] },
  { name: "Art and Technology Practices", themes: ["hacked", "code", "history"] },
  // Was listed twice in the old data (once "sensory", once "immersive"); merged here.
  { name: "Digital Audio Production", themes: ["sensory", "immersive"] },
  { name: "Digital Music: Concepts, Structures, Materials", themes: ["sensory"] },
  { name: "Acoustic Ecology and Phonography", themes: ["sensory"] },
  { name: "Analog Electronics", themes: ["retro", "hacked", "code"] },
  { name: "Olfactory Art", themes: ["sensory", "eco", "bio"] },
  { name: "Sound and Image", themes: ["sensory"] },
  { name: "Sound Now: Improvisation", themes: ["play", "sensory"] },
  { name: "Women Artists in Cyberspace", themes: ["code", "history"] },
  { name: "Analog Synthesis", themes: ["retro", "immersive"] },
  { name: "Electronic Textiles and the Body", themes: ["sensory", "immersive"] },
  { name: "Air, Fluid and Actuators", themes: ["sensory", "code"] },
  { name: "Introduction to Computer Vision", themes: ["sensory", "code"] },
  { name: "Hacking the Object", themes: ["play", "retro", "hacked", "code"] },
  { name: "Shaping Light", themes: ["sensory", "eco", "immersive", "bio"] },
  { name: "Programming for Sound: Max for Live", themes: ["immersive", "code"] },
  { name: "Alternative Image Capture", themes: ["hacked"] },
  { name: "Synthetic Futures: Biodesign Challenge", themes: ["sensory", "eco", "bio"] },
  { name: "Holography", themes: ["sensory", "retro", "eco", "bio"] },
  { name: "Soft Bulletins: Biological Communications", themes: ["hacked", "eco", "bio", "code"] },
  { name: "Advanced Neon", themes: ["sensory", "eco", "bio"] },
  { name: "Physical Computing: Outside the Box", themes: ["retro", "hacked", "code"] },
  { name: "Virtual Reality", themes: ["play", "sensory", "code"] },
  { name: "Sound Projects", themes: ["sensory", "immersive"] },
  { name: "Brave N3w B0d1es: Posthuman Practices", themes: ["sensory", "hacked"] },
  { name: "Retro Tech: Restoration and Preservation", themes: ["retro", "code", "history"] },
  { name: "Virtual Sound", themes: ["play", "sensory", "immersive", "code"] },
  { name: "Public Light and Space", themes: ["sensory", "eco", "immersive", "bio"] },
  { name: "Experimental Game Lab", themes: ["play", "code"] },
  { name: "Poetic Systems", themes: ["poetic", "immersive", "code"] },
  { name: "Sound Toolbox for MFA Students", themes: ["sensory"] },
  { name: "Neon Techniques", themes: ["sensory", "eco", "bio"] },
  { name: "Activated Objects: Coding Hardware", themes: ["hacked", "code"] },
  { name: "Code Sourcery: Algorithmic Practices", themes: ["code"] },
  { name: "Light Experiments", themes: ["sensory", "eco", "bio"] },
  { name: "Analog Sound Techniques & Materials", themes: ["sensory", "immersive", "history"] },
  { name: "Noise", themes: ["sensory", "immersive"] },
  { name: "Tactical Media", themes: ["retro", "hacked", "code", "history"] },
  { name: "New Realities: Simulations of Future Worlds", themes: ["play", "immersive", "code"] },
  { name: "Sound Installation", themes: ["sensory", "immersive"] },
  { name: "Astrobiology and Speculative Futurism", themes: ["play", "eco", "bio"] },
  { name: "Electronics as an Art Material", themes: ["retro", "code"] },
  { name: "Electronic Writing", themes: ["poetic", "code"] },
  { name: "Interactive Art and Creative Coding", themes: ["play", "code"] },
  { name: "BioArt Studio", themes: ["sensory", "eco", "hacked", "bio"] },
  { name: "Social Media Narratives", themes: ["poetic", "code", "history"] },
  { name: "Public Sound and Space", themes: ["sensory", "immersive"] },
  { name: "Robotics", themes: ["immersive", "code"] },
  { name: "Retro Tech: Programming", themes: ["retro", "hacked", "history"] },
  { name: "Artificial Intelligence", themes: ["code"] },
  { name: "Video Game Music Composition", themes: ["play", "code"] },
  { name: "Blockchain: The New Internet", themes: ["code"] },
  { name: "Seminar in Art and Technology Studies", themes: ["retro", "history"] },
  { name: "Digital Light Projections", themes: ["sensory", "eco", "immersive", "bio"] },
];

window.DATASETS.push({
  id: "atsp-old",
  tab: "AT/SP (prior assessment draft)",
  title: "AT/SP (prior assessment draft)",
  subtitle: "Earlier draft of the curriculum, mapped to its thematic areas",
  themes: THEMES,
  courses: COURSES,
});
})();
