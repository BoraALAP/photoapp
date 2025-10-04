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

const GenericPrompts = [
  "The person is in a Canadian setting, natural group composition, friendly atmosphere, realistic photo, even lighting preserving all facial features",
  "The person should be smiling and looking natural",
  "The person should look little bit slimmer"
];

export const PRESETS: Record<string, Preset> = {
  toronto: {
    id: "toronto",
    name: "Toronto",
    description: "Fun CN Tower compositions",
    requiresRefs: false,
    prompts: GenericPrompts.concat([
      "A person standing in front of the iconic CN Tower at sunset, Toronto skyline in the background, realistic photo, professional composition",
      "A person enjoying the Toronto waterfront with the CN Tower visible, blue hour lighting, modern urban setting",
      "A person at Nathan Phillips Square with Toronto's City Hall, winter scene, natural lighting",
      "A person walking through Distillery District, Toronto, vintage brick buildings, warm afternoon light",
    ]),
  },
  vancouver: {
    id: "vancouver",
    name: "Vancouver",
    description: "Coastal & mountain settings",
    requiresRefs: false,
    prompts: GenericPrompts.concat([
      "A person at Vancouver's Stanley Park Seawall, mountains in the background, golden hour, pacific northwest atmosphere",
      "A person at Granville Island with False Creek and city skyline, cloudy Vancouver weather, realistic photo",
      "A person near Vancouver Harbour with seaplanes and North Shore mountains, crisp clear day",
      "A person at English Bay Beach during sunset, Vancouver's West End visible, warm evening light",
    ]),
  },
  banff: {
    id: "banff",
    name: "Banff / Lake Louise",
    description: "Alpine & lakeside scenes",
    requiresRefs: false,
    prompts: GenericPrompts.concat([
      "A person standing by Lake Louise with turquoise water and Victoria Glacier, Canadian Rockies, bright daylight",
      "A person at Moraine Lake viewpoint, Valley of the Ten Peaks behind, stunning mountain landscape",
      "A person on Banff Avenue with Cascade Mountain in the background, charming mountain town atmosphere",
      "A person at Peyto Lake overlook, brilliant blue water, alpine forest, dramatic mountain scenery",
    ]),
  },  
  montreal: {
    id: "montreal",
    name: "Montreal",
    description: "Old-town cobblestone & café shots",
    requiresRefs: false,
    prompts: GenericPrompts.concat([
      "A person in Old Montreal's cobblestone streets, historic architecture, European charm, soft daylight",
      "A person at a Montreal café terrace, French-inspired atmosphere, vibrant Plateau neighborhood",
      "A person near Notre-Dame Basilica, Gothic Revival architecture, Old Port area, atmospheric lighting",
      "A person at Mount Royal lookout with Montreal cityscape below, autumn foliage, panoramic view",
    ]),
  },
  withus: {
    id: "withus",
    name: "With Us",
    description: "User appears with two reference hosts in Canadian settings",
    requiresRefs: true,
    prompts: GenericPrompts.concat([
      "Three people together at a scenic Canadian location, natural group composition, friendly atmosphere, realistic photo, even lighting preserving all facial features",
      "Three friends enjoying a Canadian landmark, candid group shot, authentic expressions, professional photo quality",
      "Three people posing together at an iconic Canadian spot, balanced composition, all faces clearly visible, natural outdoor lighting",
      "Three people in a fun Canadian setting, natural group interaction, realistic proportions, high-quality photograph",
    ]),
  },
};

export const PRESET_ORDER = ["toronto", "vancouver", "banff", "montreal", "withus"];

export function getPreset(id: string): Preset | undefined {
  return PRESETS[id];
}

export function getAllPresets(): Preset[] {
  return PRESET_ORDER.map((id) => PRESETS[id]);
}
