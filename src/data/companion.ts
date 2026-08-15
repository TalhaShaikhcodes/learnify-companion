export type GrowthStage = 1 | 2 | 3;
export type CompanionId = "nova" | "ember" | "moss";

export type CompanionState = {
  id: CompanionId;
  name: string;
  xp: number;
  maxXp: number;
  stage: GrowthStage;
};

// ── Catalog ────────────────────────────────────────────────────

export type CompanionDefinition = {
  id: CompanionId;
  name: string;
  trait: string;
  color: string;       // primary accent for selection ring / bg
  colorBg: string;     // light tint background
  stages: Record<GrowthStage, { form: string; image: string }>;
  abilities: Record<GrowthStage, { name: string; description: string }>;
};

export const companionCatalog: Record<CompanionId, CompanionDefinition> = {
  nova: {
    id: "nova",
    name: "Nova",
    trait: "Curious",
    color: "#5B4BDB",
    colorBg: "#F3F0FF",
    stages: {
      1: { form: "Hatchling",      image: "/companions/nova-stage-1.png" },
      2: { form: "Growing",        image: "/companions/nova-stage-2.png" },
      3: { form: "Evolved",        image: "/companions/nova-stage-3.png" },
    },
    abilities: {
      1: { name: "✦ Spark",     description: "Nova glows with curiosity, ready to learn." },
      2: { name: "✦ Radiance",  description: "Nova pulses with energy, growing stronger." },
      3: { name: "✦ Starlight", description: "Nova can now light up your world." },
    },
  },
  ember: {
    id: "ember",
    name: "Ember",
    trait: "Bold",
    color: "#D4520A",
    colorBg: "#FFF4EC",
    stages: {
      // Only stage-1 artwork exists; reuse it for all stages.
      // Visual growth is communicated through scale in the Companion component.
      1: { form: "Spark",   image: "/companions/ember-stage-1.png" },
      2: { form: "Flame",   image: "/companions/ember-stage-1.png" },
      3: { form: "Inferno", image: "/companions/ember-stage-1.png" },
    },
    abilities: {
      1: { name: "✦ Ignite",   description: "Ember blazes forward with bold determination." },
      2: { name: "✦ Flare",    description: "Ember's fire grows hotter with every lesson." },
      3: { name: "✦ Wildfire", description: "Ember's full power is unleashed." },
    },
  },
  moss: {
    id: "moss",
    name: "Moss",
    trait: "Creative",
    color: "#2A7A4B",
    colorBg: "#E8F7EE",
    stages: {
      // Only stage-1 artwork exists; reuse it for all stages.
      1: { form: "Seedling",  image: "/companions/moss-stage-1.png" },
      2: { form: "Sprouting", image: "/companions/moss-stage-1.png" },
      3: { form: "Blooming",  image: "/companions/moss-stage-1.png" },
    },
    abilities: {
      1: { name: "✦ Sprout",  description: "Moss roots quietly, ready to grow." },
      2: { name: "✦ Bloom",   description: "Moss flourishes with creative energy." },
      3: { name: "✦ Canopy",  description: "Moss shelters the world with wisdom." },
    },
  },
};

// ── Helpers ────────────────────────────────────────────────────

export function stageFromXp(xp: number): GrowthStage {
  if (xp >= 100) return 3;
  if (xp >= 80) return 2;
  return 1;
}

export function makeInitialCompanion(id: CompanionId): CompanionState {
  return {
    id,
    name: companionCatalog[id].name,
    xp: 60,
    maxXp: 100,
    stage: 1,
  };
}

// Default for screens that don't need full catalog (keeps existing usage working)
export const initialCompanion: CompanionState = makeInitialCompanion("nova");

// ── Per-companion derived data (used by existing screens) ──────

export function evolutionDataForCompanion(
  id: CompanionId,
  stage: GrowthStage
): { name: string; form: string; image: string } {
  const def = companionCatalog[id];
  const s = def.stages[stage];
  // For stage 3 use the evolved name convention
  const name = stage === 3 ? `Starlight ${def.name}` : def.name;
  return { name, form: s.form, image: s.image };
}

// Legacy shape kept for backward compat with existing screens
export const evolutionData: Record<GrowthStage, { name: string; form: string; image: string }> =
  {
    1: evolutionDataForCompanion("nova", 1),
    2: evolutionDataForCompanion("nova", 2),
    3: evolutionDataForCompanion("nova", 3),
  };

export const stageAbilities: Record<GrowthStage, { name: string; description: string }> =
  companionCatalog.nova.abilities;
