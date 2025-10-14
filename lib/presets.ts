/**
 * Preset definitions for AI image generation.
 * Each preset contains prompt variants for generating creative scene-based images.
 */

export interface Preset {
  id: string;
  name: string;
  description: string;
  prompts: string[];
  requiresRefs: boolean;
  rainbowBorder?: boolean;
}

const genericStyle = "The person is in a Canadian setting, natural composition, make the person look happy and relaxed, friendly atmosphere, realistic photo, high-resolution, cinematic detail, even lighting preserving all facial features, natural confident expression, photorealistic portrait quality, be creative. Do not just place the persons face to the picture. Blend the person into the picture with right proportions.";

export const PRESETS: Record<string, Preset> = {
  mapleAutumn: {
    id: "mapleAutumn",
    name: "Maple Autumn",
    description: "Golden fall leaves and cozy Canadian atmosphere",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person surrounded by red and orange maple leaves, autumn park in Canada, warm sunlight filtering through the trees, cozy flannel outfit`,
      `${genericStyle}. A person walking through a forest trail covered in colorful fall foliage, holding a hot coffee cup, misty morning light`,
      `${genericStyle}. A person sitting on a bench by a lake with reflections of autumn trees, peaceful mood, golden hour light`,
      `${genericStyle}. A person throwing maple leaves in the air, joyful candid shot, natural laughter, rustic Canadian fall vibes`,
    ],
  },
  winterWonderland: {
    id: "winterWonderland",
    name: "Winter Wonderland",
    description: "Snowy Canadian winter moments",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person bundled up in winter coat and toque, standing in a snowy forest, gentle snowfall, serene atmosphere`,
      `${genericStyle}. A person ice skating on a frozen lake surrounded by pine trees, distant mountains, soft winter light`,
      `${genericStyle}. A person holding a mug of hot chocolate by a snowy cabin, smoke rising from chimney, cozy winter vibes`,
      `${genericStyle}. A person walking in a small Canadian town street decorated with Christmas lights, snow gently falling`,
    ],
  },
  northernLights: {
    id: "northernLights",
    name: "Northern Lights",
    description: "Magical aurora and night sky filters",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person standing under the Northern Lights, vibrant green and purple aurora dancing across the sky, reflective snowfield foreground`,
      `${genericStyle}. A person gazing at aurora borealis over a frozen lake in Yukon, stars clearly visible, dark blue night sky`,
      `${genericStyle}. A person sitting by a campfire under Northern Lights, warm light on face, peaceful wilderness setting`,
      `${genericStyle}. A person captured in silhouette with aurora glowing overhead, serene Arctic landscape, photorealistic clarity`,
    ],
  },
  cottageLife: {
    id: "cottageLife",
    name: "Cottage Life",
    description: "Peaceful lakefront and cozy cabin filters",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person sitting on a wooden dock by a calm Canadian lake, surrounded by forest, golden sunrise light`,
      `${genericStyle}. A person reading a book by a campfire near a rustic log cabin, twilight setting, gentle smoke rising`,
      `${genericStyle}. A person canoeing on a misty lake at dawn, ripples in the water, serene reflective atmosphere`,
      `${genericStyle}. A person relaxing in a Muskoka chair with a plaid blanket, lake and pine trees in the background, cozy cottage moment`,
    ],
  },
  urbanCanada: {
    id: "urbanCanada",
    name: "Urban Canada",
    description: "Modern Canadian city life filter",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person crossing a downtown street with modern glass towers, Canada flag visible, lively urban atmosphere`,
      `${genericStyle}. A person having coffee at a trendy café with street art murals behind, city life vibe, soft daylight`,
      `${genericStyle}. A person walking through a vibrant city market, colorful stalls, multicultural atmosphere, natural lighting`,
      `${genericStyle}. A person at a rooftop patio overlooking a Canadian skyline at sunset, warm city light reflections`,
    ],
  },
  ilacSceneMatch: {
    id: "ilacSceneMatch",
    name: "ILAC Campus (Toronto)",
    description: "Places the person naturally into ILAC Toronto school interiors: lobby, corridors, and themed halls.",
    requiresRefs: true, // expects the 4 ILAC photos as reference backgrounds
    rainbowBorder: true,
    prompts: [
      // 1. Lobby with ILAC branding and colorful seating
      `${genericStyle}. Use the ILAC LOBBY background plate (colorful couches, blue walls, ILAC logo columns). Place the person casually standing or sitting within the lobby area, well-integrated with reflections on the floor. Match warm indoor lighting and soft ceiling lights; maintain perspective and correct shadowing on the floor; keep ILAC signage visible and crisp.`,
      // 2. "The 6" hallway area
      `${genericStyle}. Use the ILAC HALLWAY background plate with 'THE 6' installation. Position the person walking or leaning near the glass or doorway; align body angle with corridor lines; match warm indoor light temperature and gentle shadow under feet; preserve clean reflections on shiny surfaces.`,
      // 3. Curved wall with world map graphic
      `${genericStyle}. Use the ILAC WORLD MAP corridor plate. Place the person walking along or pointing toward the world map, aligning posture to the curve of the wall; match even overhead lighting and natural skin tones; add a faint contact shadow on the polished floor; keep map text clearly visible.`,
      // 4. LOVE hallway with art and geometric lights
      `${genericStyle}. Use the ILAC LOVE HALLWAY plate. Place the person mid-hall or near the mosaic artwork; match warm light tones and perspective depth; cast a natural soft floor shadow; maintain balanced exposure and realistic scale; ensure colorful artwork remains unobstructed.`,
    ],
  },
  wildernessExplorer: {
    id: "wildernessExplorer",
    name: "Wilderness Explorer",
    description: "Wild landscapes and adventure scenes",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person hiking on a rocky trail overlooking a vast Canadian mountain valley, dramatic clouds, adventure tone`,
      `${genericStyle}. A person near a waterfall surrounded by evergreen forest, mist in the air, vibrant natural colors`,
      `${genericStyle}. A person standing on a wooden bridge in a national park, rushing river below, overcast mood`,
      `${genericStyle}. A person camping under tall pine trees with a tent and campfire, early morning light`,
    ],
  },
  editorialCanada: {
    id: "editorialCanada",
    name: "Editorial Canada",
    description: "Stylish portrait filters inspired by Canadian fashion & culture",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person posing confidently in a modern winter coat with urban skyline backdrop, soft studio-style outdoor lighting`,
      `${genericStyle}. A person in an editorial-style portrait shot against minimalist Canadian architectural background, muted tones`,
      `${genericStyle}. A person wearing a red plaid jacket in a fashion-inspired outdoor scene, shallow depth of field, cinematic feel`,
      `${genericStyle}. A person leaning on a rustic fence, editorial lighting, balanced tones, authentic expression`,
    ],
  },
  canadianWildlifeParty: {
    id: "canadianWildlifeParty",
    name: "Canadian Wildlife Party",
    description: "Funny and surreal wildlife interactions in Canadian settings",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person relaxing in an outdoor hot tub surrounded by friendly cartoonish beavers wearing sunglasses, steam rising, Canadian forest background, humorous yet photorealistic style`,
      `${genericStyle}. A person hanging out with two moose by a lakeside picnic table, sharing pancakes and maple syrup, morning sunlight, playful and realistic photo quality`,
      `${genericStyle}. A person playing ice hockey with a group of raccoons wearing small helmets, frozen lake setting, fun candid shot`,
      `${genericStyle}. A person camping with a curious black bear roasting marshmallows beside them, cozy night lighting, humorous yet heartwarming tone`,
    ],
  },
  ehEdition: {
    id: "ehEdition",
    name: "Eh Edition",
    description: "Lighthearted and comedic takes on Canadian stereotypes",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person dressed as a Mountie sharing a coffee with a moose at a Tim Hortons patio, fun and friendly vibe, photorealistic humor`,
      `${genericStyle}. A person holding an oversized bottle of maple syrup like a trophy, surrounded by Canadian flags, proud and silly pose`,
      `${genericStyle}. A person wearing hockey gear grocery shopping, pushing a cart down a snowy street, fun candid humor`,
      `${genericStyle}. A person sitting on a couch in a frozen lake ice-fishing hut, watching hockey on TV with a beaver, cozy and funny photo`,
    ],
  },
  withus: {
    id: "withus",
    name: "With Us",
    description: "User appears with two reference hosts in Canadian settings",
    requiresRefs: true,
    prompts: [
      `${genericStyle}. Three people together in a scenic Canadian outdoor setting, natural group composition, friendly atmosphere, realistic proportions, high-quality photograph`,
      `${genericStyle}. Three friends posing at a cozy lakeside cabin, autumn foliage, balanced composition, all faces clearly visible`,
      `${genericStyle}. Three people enjoying a snowy Canadian landscape, candid laughter, soft daylight, natural color tones`,
      `${genericStyle}. Three people walking through a downtown Canadian street with flags and cafés, relaxed group photo, realistic photo quality`,
    ],
  },
};

export const PRESET_ORDER = ["mapleAutumn", "winterWonderland", "northernLights", "cottageLife", "urbanCanada", "ilacSceneMatch","wildernessExplorer", "editorialCanada", "canadianWildlifeParty", "ehEdition", "withus"];

export function getPreset(id: string): Preset | undefined {
  return PRESETS[id];
}

export function getAllPresets(): Preset[] {
  return PRESET_ORDER.map((id) => PRESETS[id]);
}
