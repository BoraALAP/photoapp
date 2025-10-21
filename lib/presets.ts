/**
 * Preset definitions for AI image generation.
 * Each preset contains prompt variants for generating creative scene-based images.
 */

import { PhotoStyleId } from './photo-styles';

export interface Preset {
  id: string;
  name: string;
  description: string;
  prompts: string[];
  requiresRefs: boolean;
  rainbowBorder?: boolean;
  type: 'image' | 'video';
}

const photoRealisticStyle = "The person is in a Canadian setting, natural composition, make the person look happy and relaxed, friendly atmosphere, realistic photo, high-resolution, cinematic detail, even lighting preserving all facial features, natural confident expression, photorealistic portrait quality, be creative. Do not just place the persons face to the picture. Blend the person into the picture with right proportions.";

const cartoonStyle = "The person is in a Canadian setting, vibrant cartoon illustration style, animated character design, make the person look happy and cheerful, friendly atmosphere, colorful and expressive, high-quality digital art, even lighting preserving all facial features, natural confident expression, cartoon portrait quality with clean lines and bold colors, be creative. Do not just place the persons face to the picture. Blend the person into the cartoon scene with right proportions and consistent art style.";

const vintage50sStyle = "The person is in a Canadian setting with authentic 1950s vintage aesthetic, retro color grading with slightly faded warm tones, subtle film grain and vignette, period-appropriate styling, nostalgic atmosphere, vintage photo quality resembling old photographs from the era, natural happy expression, friendly atmosphere, be creative. Do not just place the persons face to the picture. Blend the person into the vintage scene with right proportions and authentic period feel.";

const cinematicStyle = "The person is in a Canadian setting with dramatic cinematic look, moody atmospheric lighting, rich color grading with deep shadows and highlights, film-like quality with shallow depth of field, epic composition, movie poster aesthetic, professional color correction, natural confident expression, friendly atmosphere, be creative. Do not just place the persons face to the picture. Blend the person into the cinematic scene with right proportions and dramatic impact.";

const oilPaintingStyle = "The person is in a Canadian setting rendered as a classical oil painting, visible brush strokes and rich texture, traditional painting techniques, warm color palette with depth, artistic interpretation while maintaining likeness, museum-quality portrait style, natural happy expression, friendly atmosphere, fine art quality, be creative. Do not just place the persons face to the picture. Blend the person into the painted scene with right proportions and artistic style.";

const watercolorStyle = "The person is in a Canadian setting painted in soft watercolor technique, delicate color washes and gentle blending, translucent layers with artistic flow, light and airy atmosphere, painterly edges and soft details, natural happy expression, friendly atmosphere, fine watercolor art quality, be creative. Do not just place the persons face to the picture. Blend the person into the watercolor scene with right proportions and artistic style.";

const genericStyle = photoRealisticStyle;

export const PRESETS: Record<string, Preset> = {
  mapleAutumn: {
    id: "mapleAutumn",
    name: "Maple Autumn",
    description: "Golden fall leaves and cozy Canadian atmosphere",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a vibrant autumn scene in Canada with the person enjoying fall activities. Use warm orange, red, and golden tones. Include elements like maple leaves, cozy clothing, and seasonal atmosphere. Be creative with the composition - perhaps near a lake, in a forest, at a park, or in a charming town. Capture the essence of Canadian fall.`,
      `${genericStyle}. Design an artistic autumn portrait with the person in a creative Canadian fall setting. Incorporate rich autumn colors, interesting lighting (golden hour, misty morning, or soft overcast), and seasonal details. Vary the activity - walking, sitting, enjoying nature, or candid moments. Make it feel authentic and warm.`,
      `${genericStyle}. Compose an imaginative fall scene featuring the person in a unique Canadian autumn environment. Play with perspective and framing. Include creative seasonal elements like falling leaves, reflections, or interesting natural backdrops. Focus on capturing joy and the beauty of the season in an unexpected way.`,
      `${genericStyle}. Generate a creative and dynamic autumn photo with the person experiencing Canadian fall in an original way. Use cinematic lighting and interesting angles. Incorporate seasonal activities, nature elements, or urban fall scenes. Make each image distinctly different with varied moods - cozy, adventurous, peaceful, or joyful.`,
    ],
  },
  winterWonderland: {
    id: "winterWonderland",
    name: "Winter Wonderland",
    description: "Snowy Canadian winter moments",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a magical winter scene in Canada with the person in a snowy setting. Use soft whites, cool blues, and warm accent colors. Include creative winter elements like snowfall, frosted trees, or winter activities. Vary the setting - forest, lakeside, mountain, or charming town. Capture the serene beauty and coziness of Canadian winter.`,
      `${genericStyle}. Design an artistic winter portrait with the person experiencing Canadian winter in a creative way. Incorporate interesting winter lighting, cozy winter clothing, and seasonal atmosphere. Be imaginative with activities - outdoor adventures, peaceful moments, or festive scenes. Make it feel authentic and inviting.`,
      `${genericStyle}. Compose a unique winter scene featuring the person in an original Canadian winter environment. Play with winter light, snow textures, and creative compositions. Include varied elements like ice, evergreens, cabins, or winter sports. Focus on capturing the wonder and beauty of the season in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative winter photo with the person enjoying Canadian winter uniquely. Use cinematic winter lighting and interesting perspectives. Incorporate diverse winter settings - wilderness, urban, or recreational. Make each image distinctly different with varied moods - adventurous, cozy, serene, or joyful.`,
    ],
  },
  northernLights: {
    id: "northernLights",
    name: "Northern Lights",
    description: "Magical aurora and night sky filters",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a breathtaking Northern Lights scene in Canada with the person under the aurora. Use vibrant greens, purples, and blues in the sky. Include creative night elements like stars, reflections, snow, or wilderness. Vary the setting and perspective. Capture the magical and awe-inspiring atmosphere of the aurora borealis.`,
      `${genericStyle}. Design an artistic aurora portrait with the person experiencing the Northern Lights in a unique way. Incorporate dramatic night sky colors, interesting lighting contrasts between aurora and ambient light. Be creative with composition - silhouettes, close-ups, or wide landscapes. Make it feel ethereal and mesmerizing.`,
      `${genericStyle}. Compose an imaginative Northern Lights scene featuring the person in an original Canadian arctic setting. Play with aurora movement, reflections on ice or water, and creative foreground elements. Include varied activities or poses. Focus on capturing the wonder and beauty of this natural phenomenon in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative aurora photo with the person experiencing the Northern Lights from a unique perspective. Use cinematic lighting with aurora glow, interesting angles, and varied Canadian wilderness backdrops. Make each image distinctly different with varied moods - peaceful, adventurous, contemplative, or magical.`,
    ],
  },
  cottageLife: {
    id: "cottageLife",
    name: "Cottage Life",
    description: "Peaceful lakefront and cozy cabin filters",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a peaceful Canadian cottage scene with the person enjoying lakefront life. Use natural greens, blues, and warm wood tones. Include creative cottage elements like docks, canoes, cabins, or Muskoka chairs. Vary the setting and time of day. Capture the relaxed and serene atmosphere of cottage country.`,
      `${genericStyle}. Design an artistic cottage portrait with the person experiencing Canadian lakeside living in a creative way. Incorporate beautiful natural lighting (sunrise, golden hour, or misty dawn), water reflections, and peaceful activities. Be imaginative with the setting - on the water, by a fire, or in nature. Make it feel tranquil and authentic.`,
      `${genericStyle}. Compose a unique cottage life scene featuring the person in an original Canadian lakefront environment. Play with water reflections, forest backdrops, and creative cottage elements. Include varied activities like paddling, relaxing, reading, or enjoying nature. Focus on capturing the peaceful beauty of cottage living in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative cottage photo with the person experiencing Canadian lake life from a unique perspective. Use cinematic natural lighting and interesting angles. Incorporate diverse settings - docks, cabins, forests, or water. Make each image distinctly different with varied moods - peaceful, adventurous, cozy, or contemplative.`,
    ],
  },
  urbanCanada: {
    id: "urbanCanada",
    name: "Urban Canada",
    description: "Modern Canadian city life filter",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a vibrant urban Canadian scene with the person in a modern city setting. Use contemporary architecture, city lights, and urban elements. Include creative city features like street art, cafés, markets, or iconic buildings. Vary the location and atmosphere. Capture the energy and diversity of Canadian city life.`,
      `${genericStyle}. Design an artistic urban portrait with the person experiencing Canadian city culture in a creative way. Incorporate interesting urban lighting, multicultural elements, and modern aesthetics. Be imaginative with settings - downtown streets, rooftops, markets, or trendy neighborhoods. Make it feel dynamic and authentic.`,
      `${genericStyle}. Compose a unique urban scene featuring the person in an original Canadian city environment. Play with reflections, city skylines, and creative urban compositions. Include varied activities or moments - exploring, dining, walking, or enjoying city views. Focus on capturing the cosmopolitan beauty of Canadian cities in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative urban photo with the person experiencing Canadian city life from a unique perspective. Use cinematic city lighting and interesting angles. Incorporate diverse urban settings - markets, cafés, downtown, or waterfronts. Make each image distinctly different with varied moods - energetic, sophisticated, casual, or inspiring.`,
    ],
  },

  wildernessExplorer: {
    id: "wildernessExplorer",
    name: "Wilderness Explorer",
    description: "Wild landscapes and adventure scenes",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create an adventurous Canadian wilderness scene with the person exploring nature. Use dramatic landscapes, natural colors, and outdoor elements. Include creative wilderness features like mountains, forests, waterfalls, or trails. Vary the setting and weather. Capture the majesty and adventure of Canadian wild spaces.`,
      `${genericStyle}. Design an artistic wilderness portrait with the person experiencing Canadian nature in a creative way. Incorporate stunning natural lighting, dramatic landscapes, and outdoor activities. Be imaginative with settings - mountain peaks, deep forests, rushing rivers, or remote trails. Make it feel epic and authentic.`,
      `${genericStyle}. Compose a unique wilderness scene featuring the person in an original Canadian outdoor environment. Play with scale, perspective, and natural elements. Include varied activities like hiking, camping, exploring, or contemplating nature. Focus on capturing the raw beauty and adventure of the wilderness in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative wilderness photo with the person experiencing Canadian nature from a unique perspective. Use cinematic natural lighting and interesting angles. Incorporate diverse landscapes - mountains, forests, rivers, or national parks. Make each image distinctly different with varied moods - adventurous, peaceful, dramatic, or inspiring.`,
    ],
  },
  editorialCanada: {
    id: "editorialCanada",
    name: "Editorial Canada",
    description: "Stylish portrait filters inspired by Canadian fashion & culture",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a stylish editorial-style scene with the person in a fashionable Canadian setting. Use sophisticated lighting, modern aesthetics, and elegant compositions. Include creative fashion elements, architectural backgrounds, or natural settings with editorial flair. Vary the style and mood. Capture the refined and contemporary side of Canadian culture.`,
      `${genericStyle}. Design an artistic editorial portrait with the person styled in a creative Canadian-inspired way. Incorporate professional lighting, fashion-forward clothing, and sophisticated backdrops. Be imaginative with settings - urban architecture, minimalist nature, or cultural landmarks. Make it feel polished and magazine-worthy.`,
      `${genericStyle}. Compose a unique editorial scene featuring the person in an original Canadian fashion context. Play with depth of field, lighting techniques, and creative styling. Include varied looks - modern, rustic, elegant, or bold. Focus on capturing the intersection of Canadian culture and contemporary fashion in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative editorial photo with the person showcasing Canadian style from a unique perspective. Use cinematic lighting and interesting angles. Incorporate diverse settings - urban, natural, or architectural. Make each image distinctly different with varied moods - confident, sophisticated, casual-chic, or bold.`,
    ],
  },
  canadianWildlifeParty: {
    id: "canadianWildlifeParty",
    name: "Canadian Wildlife Party",
    description: "Funny and surreal wildlife interactions in Canadian settings",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a fun and surreal scene with the person interacting with Canadian wildlife in a humorous way. Use photorealistic style with playful elements. Include creative wildlife like moose, beavers, bears, or raccoons in unexpected situations. Vary the setting and activity. Capture the whimsy and humor while maintaining quality and realism.`,
      `${genericStyle}. Design an artistic and comedic wildlife portrait with the person in an absurd but charming Canadian animal encounter. Incorporate realistic wildlife with humorous scenarios, natural settings, and playful interactions. Be imaginative with activities - sports, dining, relaxing, or adventuring together. Make it feel funny yet heartwarming.`,
      `${genericStyle}. Compose a unique and humorous wildlife scene featuring the person with Canadian animals in an original funny situation. Play with unexpected combinations, creative scenarios, and charming details. Include varied wildlife encounters and settings. Focus on capturing joy, surprise, and Canadian humor in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative wildlife comedy photo with the person experiencing a surreal Canadian animal moment. Use good lighting and interesting perspectives while maintaining the humor. Incorporate diverse animals and scenarios - wilderness, urban, or recreational. Make each image distinctly different with varied comedic moods - silly, absurd, charming, or playful.`,
    ],
  },
  ehEdition: {
    id: "ehEdition",
    name: "Eh Edition",
    description: "Lighthearted and comedic takes on Canadian stereotypes",
    requiresRefs: false,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a fun and comedic scene celebrating Canadian stereotypes with the person in a humorous situation. Use photorealistic style with playful elements. Include creative Canadian clichés like maple syrup, hockey, Tim Hortons, or Mounties. Vary the setting and scenario. Capture the lighthearted national pride and humor.`,
      `${genericStyle}. Design an artistic and funny portrait with the person embracing Canadian stereotypes in an absurd but charming way. Incorporate iconic Canadian elements, humorous scenarios, and playful situations. Be imaginative with activities - everyday life with excessive Canadiana, polite extremes, or winter obsessions. Make it feel funny yet affectionate.`,
      `${genericStyle}. Compose a unique and humorous stereotype scene featuring the person in an original funny Canadian situation. Play with exaggerated national pride, creative clichés, and charming details. Include varied activities and settings mixing everyday life with Canadian icons. Focus on capturing good-natured humor and cultural pride in unexpected ways.`,
      `${genericStyle}. Generate a dynamic and creative comedy photo with the person experiencing an over-the-top Canadian moment. Use good lighting and interesting perspectives while maintaining the humor. Incorporate diverse Canadian stereotypes - hockey, apologizing, winter, or politeness. Make each image distinctly different with varied comedic moods - silly, proud, absurd, or wholesome.`,
    ],
  },
  withus: {
    id: "withus",
    name: "With Eray and Evren",
    description: "User appears with two reference hosts in Canadian settings",
    requiresRefs: true,
    type: 'image',
    prompts: [
      `${genericStyle}. Create a natural group photo with three people together in a beautiful Canadian setting. Use balanced composition with all faces clearly visible. Include creative Canadian backdrops - nature, urban, or cultural locations. Vary the setting and activity. Capture the friendly and authentic atmosphere of friends exploring Canada together.`,
      `${genericStyle}. Design an artistic group portrait with three people enjoying a Canadian experience together. Incorporate natural group dynamics, good lighting, and scenic backdrops. Be imaginative with settings - outdoor adventures, city exploration, or relaxed moments. Make it feel genuine and candid with everyone naturally integrated.`,
      `${genericStyle}. Compose a unique group scene with three people in an original Canadian environment. Play with group positioning, interesting locations, and creative compositions. Include varied activities - exploring, laughing, walking, or experiencing something together. Focus on capturing authentic friendship and shared moments in unexpected Canadian settings.`,
      `${genericStyle}. Generate a dynamic and creative group photo with three people experiencing Canada from a unique perspective. Use natural lighting and interesting angles. Incorporate diverse Canadian settings - wilderness, cities, landmarks, or cultural spots. Make each image distinctly different with varied moods - adventurous, relaxed, joyful, or contemplative while keeping realistic proportions.`,
    ],
  },
  // ilacSceneMatch: {
  //   id: "ilacSceneMatch",
  //   name: "ILAC Campus (Toronto)",
  //   description: "Places the person naturally into ILAC Toronto school interiors: lobby, corridors, and themed halls.",
  //   requiresRefs: true, // expects the 4 ILAC photos as reference backgrounds
  //   rainbowBorder: true,
  //   type: 'image',
  //   prompts: [
  //     // 1. Lobby with ILAC branding and colorful seating
  //     `${genericStyle}. Use the ILAC LOBBY background plate (colorful couches, blue walls, ILAC logo columns). Place the person casually standing or sitting within the lobby area, well-integrated with reflections on the floor. Match warm indoor lighting and soft ceiling lights; maintain perspective and correct shadowing on the floor; keep ILAC signage visible and crisp.`,
  //     // 2. "The 6" hallway area
  //     `${genericStyle}. Use the ILAC HALLWAY background plate with 'THE 6' installation. Position the person walking or leaning near the glass or doorway; align body angle with corridor lines; match warm indoor light temperature and gentle shadow under feet; preserve clean reflections on shiny surfaces.`,
  //     // 3. Curved wall with world map graphic
  //     `${genericStyle}. Use the ILAC WORLD MAP corridor plate. Place the person walking along or pointing toward the world map, aligning posture to the curve of the wall; match even overhead lighting and natural skin tones; add a faint contact shadow on the polished floor; keep map text clearly visible.`,
  //     // 4. LOVE hallway with art and geometric lights
  //     `${genericStyle}. Use the ILAC LOVE HALLWAY plate. Place the person mid-hall or near the mosaic artwork; match warm light tones and perspective depth; cast a natural soft floor shadow; maintain balanced exposure and realistic scale; ensure colorful artwork remains unobstructed.`,
  //   ],
  // },
};

export const PRESET_ORDER = ["mapleAutumn", "winterWonderland", "northernLights", "cottageLife", "urbanCanada", "wildernessExplorer", "editorialCanada", "canadianWildlifeParty", "ehEdition", "withus"];

export function getPreset(id: string): Preset | undefined {
  return PRESETS[id];
}

export function getAllPresets(): Preset[] {
  return PRESET_ORDER.map((id) => PRESETS[id]);
}

/**
 * Get preset prompts with a specific photo style
 */
export function getPresetPromptsWithStyle(presetId: string, styleId: PhotoStyleId = 'photorealistic'): string[] {
  const preset = PRESETS[presetId];
  if (!preset) {
    return [];
  }

  // Map style IDs to their corresponding style strings
  const styleMap: Record<PhotoStyleId, string> = {
    'photorealistic': photoRealisticStyle,
    'cartoon': cartoonStyle,
    'vintage50s': vintage50sStyle,
    'cinematic': cinematicStyle,
    'oil-painting': oilPaintingStyle,
    'watercolor': watercolorStyle,
  };

  const selectedStyle = styleMap[styleId] || photoRealisticStyle;

  // Replace the genericStyle in each prompt with the selected style
  return preset.prompts.map(prompt =>
    prompt.replace(photoRealisticStyle, selectedStyle)
  );
}
