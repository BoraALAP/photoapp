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
}

const genericStyle = "The person is in a Canadian setting, natural composition, friendly atmosphere, realistic photo, even lighting preserving all facial features, looking natural and confident";

export const PRESETS: Record<string, Preset> = {
  toronto: {
    id: "toronto",
    name: "Toronto",
    description: "Fun CN Tower compositions",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person standing in front of the iconic CN Tower at sunset, Toronto skyline in the background, realistic photo, professional composition`,
      `${genericStyle}. A person enjoying the Toronto waterfront with the CN Tower visible, blue hour lighting, modern urban setting`,
      `${genericStyle}. A person at Nathan Phillips Square with Toronto's City Hall, winter scene, natural lighting`,
      `${genericStyle}. A person walking through Distillery District, Toronto, vintage brick buildings, warm afternoon light`,
    ],
  },
  vancouver: {
    id: "vancouver",
    name: "Vancouver",
    description: "Coastal & mountain settings",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person at Vancouver's Stanley Park Seawall, mountains in the background, golden hour, pacific northwest atmosphere`,
      `${genericStyle}. A person at Granville Island with False Creek and city skyline, cloudy Vancouver weather, realistic photo`,
      `${genericStyle}. A person near Vancouver Harbour with seaplanes and North Shore mountains, crisp clear day`,
      `${genericStyle}. A person at English Bay Beach during sunset, Vancouver's West End visible, warm evening light`,
    ],
  },
  banff: {
    id: "banff",
    name: "Banff / Lake Louise",
    description: "Alpine & lakeside scenes",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person standing by Lake Louise with turquoise water and Victoria Glacier, Canadian Rockies, bright daylight`,
      `${genericStyle}. A person at Moraine Lake viewpoint, Valley of the Ten Peaks behind, stunning mountain landscape`,
      `${genericStyle}. A person on Banff Avenue with Cascade Mountain in the background, charming mountain town atmosphere`,
      `${genericStyle}. A person at Peyto Lake overlook, brilliant blue water, alpine forest, dramatic mountain scenery`,
    ],
  },
  montreal: {
    id: "montreal",
    name: "Montreal",
    description: "Old-town cobblestone & café shots",
    requiresRefs: false,
    prompts: [
      `${genericStyle}. A person in Old Montreal's cobblestone streets, historic architecture, European charm, soft daylight`,
      `${genericStyle}. A person at a Montreal café terrace, French-inspired atmosphere, vibrant Plateau neighborhood`,
      `${genericStyle}. A person near Notre-Dame Basilica, Gothic Revival architecture, Old Port area, atmospheric lighting`,
      `${genericStyle}. A person at Mount Royal lookout with Montreal cityscape below, autumn foliage, panoramic view`,
    ],
  },
  withus: {
    id: "withus",
    name: "With Us",
    description: "User appears with two reference hosts in Canadian settings",
    requiresRefs: true,
    prompts: [
      `${genericStyle}. Three people together at a scenic Canadian location, natural group composition, friendly atmosphere, realistic photo, even lighting preserving all facial features`,
      `${genericStyle}. Three friends enjoying a Canadian landmark, candid group shot, authentic expressions, professional photo quality`,
      `${genericStyle}. Three people posing together at an iconic Canadian spot, balanced composition, all faces clearly visible, natural outdoor lighting`,
      `${genericStyle}. Three people in a fun Canadian setting, natural group interaction, realistic proportions, high-quality photograph`,
    ],
  },
};

export const PRESET_ORDER = ["toronto", "vancouver", "banff", "montreal", "withus"];

export function getPreset(id: string): Preset | undefined {
  return PRESETS[id];
}

export function getAllPresets(): Preset[] {
  return PRESET_ORDER.map((id) => PRESETS[id]);
}
