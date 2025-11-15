window.MOOD_DATA = window.MOOD_DATA || {};

MOOD_DATA.families = [
  "Serenity","Tension","Sorrow","Joy","Anger",
  "Memory","Aspiration","Fear","Apathy","Ecstasy"
];

/**
 * Legacy single drawing palettes (kept as fallback).
 * Order: [highlight, mid, deep, accent]
 */
// MOOD_DATA.palettes = {
//   Serenity:  [[170,214,255],[114,172,219],[30,56,84],[214,233,248]],
//   Tension:   [[255,120,96],[225,70,60],[36,33,46],[255,196,94]],
//   Sorrow:    [[156,173,189],[108,128,149],[35,43,56],[206,214,222]],
//   Joy:       [[255,86,110],[255,201,76],[65,207,160],[40,86,255]],
//   Anger:     [[255,75,64],[196,36,36],[32,22,24],[255,140,90]],
//   Memory:    [[216,185,146],[165,135,112],[84,71,60],[233,214,189]],
//   Aspiration:[[117,214,185],[80,157,238],[255,181,77],[25,44,86]],
//   Fear:      [[210,224,238],[94,116,140],[13,19,27],[255,96,96]],
//   Apathy:    [[190,196,202],[148,155,162],[70,78,86],[214,220,226]],
//   Ecstasy:   [[255,105,180],[255,222,89],[100,220,255],[50,60,255]]
// };

/**
 * NEW: multiple drawing palette sets per family.
 * Each entry is an array of 4-colour palettes.
 * We’ll pick one set deterministically from the seed.
 */
MOOD_DATA.drawPalettes = {
  Serenity: [
    [[170,214,255],[114,172,219],[30,56,84],[214,233,248]],
    [[186,226,240],[118,187,206],[46,82,110],[228,244,252]],
    [[214,239,246],[148,196,224],[60,96,128],[238,248,255]]
  ],
  Tension: [
    [[255,120,96],[225,70,60],[36,33,46],[255,196,94]],
    [[255,142,92],[228,84,76],[40,30,42],[255,220,132]],
    [[244,88,88],[198,52,52],[44,38,54],[255,176,96]]
  ],
  Sorrow: [
    [[156,173,189],[108,128,149],[35,43,56],[206,214,222]],
    [[178,192,206],[124,141,159],[40,50,66],[214,224,232]],
    [[142,162,182],[96,117,138],[30,38,52],[196,207,218]]
  ],
  Joy: [
    [[255,86,110],[255,201,76],[65,207,160],[40,86,255]],
    [[255,104,148],[255,222,100],[80,216,152],[72,96,255]],
    [[252,114,96],[255,210,120],[100,220,190],[78,110,255]]
  ],
  // Anger: [
  //   [[255,75,64],[196,36,36],[32,22,24],[255,140,90]],
  //   [[255,100,76],[210,52,48],[40,22,26],[255,172,112]],
  //   [[242,60,60],[186,32,36],[26,18,22],[255,132,80]]
  // ],
  Anger: [
    [[255,75,64],[196,36,36],[32,22,24],[255,140,90]],
    [[50,50,50],[50,52,48],[40,50,56],[55,50,52]],
    [[242,60,60],[186,32,36],[26,18,22],[255,132,80]]
  ],
  Memory: [
    [[216,185,146],[165,135,112],[84,71,60],[233,214,189]],
    [[228,198,162],[176,145,118],[90,74,62],[244,225,200]],
    [[210,178,144],[158,128,104],[80,68,58],[228,208,184]]
  ],
  Aspiration: [
    [[117,214,185],[80,157,238],[255,181,77],[25,44,86]],
    [[126,222,190],[92,170,244],[255,199,104],[26,52,96]],
    [[110,214,214],[90,168,238],[252,188,96],[26,54,104]]
  ],
  Fear: [
    [[210,224,238],[94,116,140],[13,19,27],[255,96,96]],
    [[192,210,230],[104,130,154],[16,22,30],[232,116,116]],
    [[220,228,238],[112,132,150],[14,18,26],[255,134,132]]
  ],
  Apathy: [
    [[190,196,202],[148,155,162],[70,78,86],[214,220,226]],
    [[204,210,216],[156,164,172],[76,84,92],[224,230,236]],
    [[184,190,196],[142,150,158],[66,74,82],[210,216,224]]
  ],
  Ecstasy: [
    [[255,105,180],[255,222,89],[100,220,255],[50,60,255]],
    [[255,124,196],[255,236,120],[112,228,255],[80,72,255]],
    [[252,96,180],[255,216,104],[118,228,246],[96,84,255]]
  ]
};

/**
 * Background palette sets per family (already added earlier).
 */
MOOD_DATA.bgPalettes = {
  Serenity: [
    [[18,30,45],[46,80,110],[180,215,240]],
    [[10,22,30],[40,74,92],[185,224,245]],
    [[18,26,42],[72,118,158],[212,234,246]]
  ],
  Tension: [
    [[26,10,14],[70,20,26],[255,120,96]],
    [[32,18,22],[88,30,34],[255,196,94]],
    [[18,14,20],[70,40,50],[230,70,70]]
  ],
  Sorrow: [
    [[14,18,26],[38,52,70],[156,173,189]],
    [[18,24,34],[50,68,88],[188,202,216]],
    [[10,16,26],[34,46,60],[140,158,176]]
  ],
  Joy: [
    [[30,16,26],[88,40,76],[255,201,76]],
    [[26,18,34],[90,40,104],[255,86,110]],
    [[26,22,40],[78,52,120],[65,207,160]]
  ],
  Anger: [
    [[16,8,8],[70,16,16],[255,75,64]],
    [[18,10,12],[80,24,30],[255,140,90]],
    [[22,12,16],[92,26,32],[225,70,60]]
  ],
  Memory: [
    [[22,18,16],[62,46,36],[216,185,146]],
    [[20,18,14],[70,52,40],[233,214,189]],
    [[24,20,18],[72,54,44],[198,166,132]]
  ],
  Aspiration: [
    [[10,18,28],[32,60,92],[117,214,185]],
    [[12,20,32],[42,70,120],[255,181,77]],
    [[12,18,30],[32,62,104],[80,157,238]]
  ],
  Fear: [
    [[6,8,14],[20,26,36],[94,116,140]],
    [[8,10,16],[26,30,46],[210,224,238]],
    [[8,10,14],[24,30,40],[255,96,96]]
  ],
  Apathy: [
    [[14,16,20],[32,38,48],[190,196,202]],
    [[16,18,22],[40,46,56],[214,220,226]],
    [[18,20,24],[44,50,60],[148,155,162]]
  ],
  Ecstasy: [
    [[20,10,30],[70,30,90],[255,105,180]],
    [[22,12,34],[72,30,96],[255,222,89]],
    [[20,10,32],[50,30,100],[100,220,255]]
  ]
};

/**
 * Background vibes kept as a backup (not heavily used now).
 */
MOOD_DATA.bgVibes = {
  Serenity:  {dark:[10,18,26], light:[26,48,64]},
  Tension:   {dark:[22,14,18], light:[60,28,36]},
  Sorrow:    {dark:[15,20,28], light:[34,46,60]},
  Joy:       {dark:[30,18,28], light:[64,44,72]},
  Anger:     {dark:[20,10,10], light:[58,22,20]},
  Memory:    {dark:[24,20,16], light:[56,46,36]},
  Aspiration:{dark:[12,18,28], light:[28,42,64]},
  Fear:      {dark:[8,10,14],  light:[20,26,34]},
  Apathy:    {dark:[16,18,22], light:[32,36,44]},
  Ecstasy:   {dark:[18,10,28], light:[60,30,90]}
};

/**
 * Style archetypes per family (unchanged).
 */
MOOD_DATA.familyStyles = {
  Serenity:  ["serenity_horizon","serenity_center","serenity_drift"],
  Tension:   ["tension_knots","tension_burst","tension_grid"],
  Sorrow:    ["sorrow_vertical","sorrow_mist","sorrow_pool"],
  Joy:       ["joy_radial","joy_ribbons","joy_confetti"],
  Anger:     ["anger_slash","anger_explosion","anger_shatter"],
  Memory:    ["memory_patina","memory_blocks","memory_tape"],
  Aspiration:["aspiration_rise","aspiration_arc","aspiration_beam"],
  Fear:      ["fear_vortex","fear_echo","fear_frag"],
  Apathy:    ["apathy_flat","apathy_blocks","apathy_fade"],
  Ecstasy:   ["ecstasy_bloom","ecstasy_comet","ecstasy_overload"]
};

/* Keep your existing familyLexicon, sentiment, modifiers, arousalCues
   definitions below this, unchanged. */
MOOD_DATA.familyLexicon ={
        Serenity:[{k:"calm",w:1.2},{k:"peaceful",w:1.2},{k:"serene",w:1.2},{k:"tranquil",w:1.2},{k:"placid",w:1.0},{k:"composed",w:1.0},{k:"untroubled",w:1.0},{k:"restful",w:1.0},{k:"relaxed",w:1.0},{k:"at ease",w:1.0},{k:"soothing",w:0.8},{k:"soothed",w:0.8},{k:"balanced",w:0.8},{k:"centered",w:0.8},{k:"grounded",w:0.8},{k:"harmonious",w:0.8},{k:"gentle",w:0.8},{k:"soft",w:0.8},{k:"still",w:0.8},{k:"quiet",w:1.0},{k:"hushed",w:0.8},{k:"breezy",w:0.6},{k:"easygoing",w:0.8},{k:"cozy",w:0.8},{k:"comforting",w:0.8},{k:"secure",w:0.8},{k:"safe",w:0.8},{k:"stable",w:0.8},{k:"steady",w:0.8},{k:"clarity",w:0.8},{k:"mindful",w:0.8},{k:"equanimity",w:1.0},{k:"acceptance",w:0.8},{k:"surrender",w:0.6},{k:"flow",w:0.8},{k:"weightless",w:0.8},{k:"airy",w:0.6},{k:"meditative",w:1.0},{k:"prayerful",w:0.8},{k:"contemplative",w:1.0},{k:"introspective",w:0.8},{k:"undisturbed",w:0.8},{k:"low-key",w:0.6},{k:"pastel",w:0.6},{k:"muted",w:0.6},{k:"subdued",w:0.6},{k:"smooth",w:0.8},{k:"seamless",w:0.6},{k:"fluid",w:0.8},{k:"limpid",w:0.8},{k:"halcyon",w:1.0},{k:"idyllic",w:0.8},{k:"sylvan",w:0.8},{k:"velvety",w:0.8},{k:"glassy",w:0.6},{k:"dewy",w:0.6},{k:"dawn",w:0.6},{k:"twilight",w:0.6},{k:"golden hour",w:0.8},{k:"sun-dappled",w:0.8},{k:"moonlit",w:0.8},{k:"gentle rain",w:0.8},{k:"zen",w:1.0},{k:"chill",w:0.3},{k:"chill af",w:0.3},{k:"vibing",w:0.3},{k:"in my zone",w:0.3},{k:"all good",w:0.3},{k:"unbothered",w:0.6}],
        Tension:[{k:"tense",w:1.2},{k:"tension",w:1.2},{k:"stressed",w:1.2},{k:"strain",w:1.0},{k:"pressure",w:1.0},{k:"uptight",w:1.0},{k:"taut",w:1.0},{k:"edgy",w:1.0},{k:"on edge",w:1.0},{k:"wired",w:1.0},{k:"jittery",w:1.0},{k:"jumpy",w:0.8},{k:"fidgety",w:0.8},{k:"uneasy",w:1.0},{k:"apprehensive",w:0.8},{k:"clenched",w:1.0},{k:"knotted",w:1.0},{k:"braced",w:0.8},{k:"grinding",w:0.8},{k:"gritted teeth",w:1.0},{k:"bristling",w:0.8},{k:"testy",w:0.8},{k:"short-tempered",w:1.0},{k:"worked up",w:0.8},{k:"high-strung",w:1.0},{k:"frazzled",w:1.0},{k:"overwhelmed",w:1.0},{k:"conflict",w:1.0},{k:"friction",w:1.0},{k:"hair-trigger",w:1.0},{k:"knife-edge",w:1.0},{k:"thin ice",w:0.8},{k:"stormy",w:0.8},{k:"brewing",w:0.8},{k:"simmering",w:0.8},{k:"coiled",w:1.0},{k:"wound up",w:1.0},{k:"strained",w:1.0},{k:"vigilant",w:0.8},{k:"alert",w:0.8},{k:"guarded",w:0.8},{k:"pinched",w:0.8},{k:"tight-chested",w:0.8},{k:"stiff",w:0.8},{k:"rigid",w:0.8},{k:"fault line",w:0.8},{k:"charged",w:1.0},{k:"crackling",w:0.8},{k:"static",w:0.8},{k:"tug-of-war",w:0.8},{k:"wary",w:0.8},{k:"can’t relax",w:0.3},{k:"low-key stressed",w:0.3},{k:"not okay",w:0.3},{k:"under pressure",w:0.6},{k:"stuck on edge",w:0.3}],
        Sorrow:[{k:"sad",w:1.2},{k:"sorrow",w:1.2},{k:"grief",w:1.2},{k:"heartbroken",w:1.2},{k:"devastated",w:1.2},{k:"forlorn",w:1.0},{k:"dejected",w:1.0},{k:"gloomy",w:1.0},{k:"somber",w:1.0},{k:"melancholy",w:1.0},{k:"down",w:1.0},{k:"blue",w:0.8},{k:"tearful",w:1.0},{k:"weeping",w:1.0},{k:"lonely",w:1.0},{k:"empty",w:1.0},{k:"desolate",w:1.0},{k:"aching",w:0.8},{k:"hurt",w:0.8},{k:"wounded",w:0.8},{k:"hollow",w:1.0},{k:"void",w:0.8},{k:"rejected",w:1.0},{k:"unloved",w:0.8},{k:"hopeless",w:1.0},{k:"despair",w:1.2},{k:"resigned",w:0.8},{k:"withered",w:0.8},{k:"faded",w:0.8},{k:"overcast",w:0.8},{k:"drizzle",w:0.6},{k:"barren",w:0.8},{k:"wintering",w:0.8},{k:"dusk",w:0.6},{k:"dim",w:0.6},{k:"elegy",w:0.8},{k:"threnody",w:0.8},{k:"plaintive",w:0.8},{k:"dolorous",w:0.8},{k:"rueful",w:0.8},{k:"wistful",w:0.8},{k:"mourning",w:1.0},{k:"lament",w:1.0},{k:"discouraged",w:0.8},{k:"miserable",w:1.0},{k:"down bad",w:0.3},{k:"feeling low",w:0.3},{k:"heart hurts",w:0.3},{k:"burnt out",w:0.3},{k:"alone af",w:0.3},{k:"dead inside",w:0.3}],
        Joy:[{k:"joy",w:1.2},{k:"joyful",w:1.2},{k:"happy",w:1.2},{k:"delighted",w:1.2},{k:"cheerful",w:1.0},{k:"excited",w:1.0},{k:"thrilled",w:1.0},{k:"gleeful",w:1.0},{k:"radiant",w:1.0},{k:"beaming",w:1.0},{k:"smiling",w:0.8},{k:"laughing",w:0.8},{k:"playful",w:0.8},{k:"buoyant",w:1.0},{k:"upbeat",w:1.0},{k:"sunny",w:0.8},{k:"bright",w:1.0},{k:"ecstatic",w:1.2},{k:"euphoric",w:1.2},{k:"elated",w:1.0},{k:"exhilarated",w:1.0},{k:"grateful",w:1.0},{k:"proud",w:0.8},{k:"satisfied",w:0.8},{k:"fulfilled",w:0.8},{k:"vibrant",w:0.8},{k:"bubbly",w:0.8},{k:"sparkling",w:0.8},{k:"glittering",w:0.8},{k:"glowing",w:0.8},{k:"kaleidoscopic",w:0.8},{k:"confetti",w:0.6},{k:"festival",w:0.8},{k:"fiesta",w:0.8},{k:"carnival",w:0.8},{k:"bliss",w:1.0},{k:"blissful",w:1.0},{k:"over the moon",w:1.0},{k:"on cloud nine",w:1.0},{k:"stoked",w:0.3},{k:"hyped",w:0.3},{k:"lit",w:0.3},{k:"slay",w:0.3},{k:"big w",w:0.3},{k:"goated",w:0.3},{k:"chef's kiss",w:0.3},{k:"wholesome",w:0.3}],
        Anger:[{k:"anger",w:1.2},{k:"angry",w:1.2},{k:"furious",w:1.2},{k:"rage",w:1.2},{k:"enraged",w:1.2},{k:"livid",w:1.2},{k:"irate",w:1.0},{k:"wrath",w:1.0},{k:"fuming",w:1.0},{k:"seething",w:1.0},{k:"boiling",w:1.0},{k:"incensed",w:1.0},{k:"outraged",w:1.0},{k:"indignant",w:1.0},{k:"resentful",w:1.0},{k:"hostile",w:1.0},{k:"spiteful",w:0.8},{k:"vengeful",w:1.0},{k:"scathing",w:1.0},{k:"cutting",w:0.8},{k:"abrasive",w:0.8},{k:"harsh",w:0.8},{k:"savage",w:0.8},{k:"volatile",w:1.0},{k:"explosive",w:1.0},{k:"combustible",w:1.0},{k:"short-tempered",w:1.0},{k:"short-fused",w:1.0},{k:"grudge",w:0.8},{k:"grievance",w:0.8},{k:"vitriolic",w:1.0},{k:"caustic",w:1.0},{k:"acrimonious",w:1.0},{k:"mordant",w:0.8},{k:"scalding",w:1.0},{k:"lacerating",w:0.8},{k:"apoplectic",w:1.0},{k:"truculent",w:1.0},{k:"belligerent",w:1.0},{k:"combative",w:1.0},{k:"pissed",w:1.0},{k:"pissed off",w:1.0},{k:"mad",w:1.0},{k:"fed up",w:1.0},{k:"so done",w:0.3},{k:"heated",w:0.3},{k:"tilted",w:0.3},{k:"malding",w:0.3},{k:"clapback",w:0.3},{k:"callout",w:0.3},{k:"pressed",w:0.3},{k:"salty",w:0.3},{k:"triggered",w:0.3},{k:"square up",w:0.3}],
        Memory:[{k:"memory",w:1.0},{k:"memories",w:1.0},{k:"remember",w:1.0},{k:"recall",w:1.0},{k:"reminisce",w:1.0},{k:"reminiscing",w:1.0},{k:"nostalgia",w:1.2},{k:"nostalgic",w:1.2},{k:"homesick",w:1.0},{k:"longing",w:1.0},{k:"yearning",w:1.0},{k:"throwback",w:1.0},{k:"flashback",w:1.0},{k:"time capsule",w:0.8},{k:"keepsake",w:0.8},{k:"memento",w:0.8},{k:"relic",w:0.8},{k:"heirloom",w:0.8},{k:"patina",w:0.8},{k:"vintage",w:0.8},{k:"retro",w:0.8},{k:"sepia",w:0.8},{k:"weathered",w:0.8},{k:"faded",w:0.8},{k:"yesteryear",w:0.8},{k:"bygone",w:0.8},{k:"days of old",w:0.8},{k:"archive",w:0.8},{k:"diary",w:0.6},{k:"journal",w:0.6},{k:"letters",w:0.6},{k:"postcards",w:0.6},{k:"polaroid",w:0.8},{k:"cassette",w:0.6},{k:"mixtape",w:0.6},{k:"afterimage",w:0.8},{k:"afterglow",w:0.8},{k:"palimpsest",w:0.8},{k:"hiraeth",w:1.0},{k:"saudade",w:1.0},{k:"anemoia",w:0.8},{k:"soft focus",w:0.8},{k:"sun-bleached",w:0.8},{k:"timeworn",w:0.8},{k:"moss-grown",w:0.6},{k:"crackled lacquer",w:0.6},{k:"old school",w:0.6},{k:"back in the day",w:0.8},{k:"childhood",w:0.8},{k:"simpler times",w:0.8},{k:"remember when",w:0.8},{k:"memory lane",w:0.8},{k:"core memory",w:0.8}],
        Aspiration:[{k:"aspire",w:1.2},{k:"aspiration",w:1.0},{k:"ambition",w:1.0},{k:"ambitious",w:1.0},{k:"goal",w:1.0},{k:"goals",w:1.0},{k:"objective",w:1.0},{k:"vision",w:1.0},{k:"mission",w:1.0},{k:"purpose",w:1.0},{k:"north star",w:1.0},{k:"dream",w:1.0},{k:"dreams",w:1.0},{k:"intention",w:0.8},{k:"plan",w:0.8},{k:"roadmap",w:0.8},{k:"journey",w:0.8},{k:"climb",w:1.0},{k:"rise",w:1.0},{k:"ascend",w:1.0},{k:"uplift",w:1.0},{k:"elevate",w:1.0},{k:"grow",w:1.0},{k:"progress",w:1.0},{k:"improve",w:1.0},{k:"advance",w:1.0},{k:"breakthrough",w:1.0},{k:"next level",w:1.0},{k:"step up",w:1.0},{k:"strive",w:1.0},{k:"grit",w:1.0},{k:"resilience",w:1.0},{k:"determined",w:1.0},{k:"resolve",w:1.0},{k:"willpower",w:1.0},{k:"courage",w:1.0},{k:"bold",w:0.8},{k:"daring",w:0.8},{k:"pursue",w:1.0},{k:"trajectory",w:0.8},{k:"momentum",w:0.8},{k:"zenith",w:0.8},{k:"apex",w:0.8},{k:"pinnacle",w:0.8},{k:"summit",w:0.8},{k:"horizon",w:0.8},{k:"beacon",w:0.8},{k:"lodestar",w:0.8},{k:"flourishing",w:0.8},{k:"level up",w:0.3},{k:"glow up",w:0.3},{k:"boss up",w:0.3},{k:"manifest",w:0.3},{k:"locked in",w:0.3},{k:"dialed in",w:0.3},{k:"keep pushing",w:0.6},{k:"keep going",w:0.6},{k:"next chapter",w:0.6}],
        Fear:[{k:"fear",w:1.2},{k:"afraid",w:1.2},{k:"scared",w:1.2},{k:"terrified",w:1.2},{k:"petrified",w:1.2},{k:"horrified",w:1.2},{k:"panic",w:1.2},{k:"panicky",w:1.0},{k:"dread",w:1.2},{k:"anxious",w:1.2},{k:"anxiety",w:1.0},{k:"worried",w:1.0},{k:"nervous",w:1.0},{k:"uneasy",w:1.0},{k:"startled",w:0.8},{k:"spooked",w:0.8},{k:"ominous",w:1.0},{k:"foreboding",w:1.0},{k:"menacing",w:1.0},{k:"threatened",w:1.0},{k:"unsafe",w:1.0},{k:"vulnerable",w:1.0},{k:"shaky",w:0.8},{k:"trembling",w:0.8},{k:"quivering",w:0.8},{k:"shivering",w:0.8},{k:"cold sweat",w:1.0},{k:"tight throat",w:0.8},{k:"claustrophobic",w:1.0},{k:"phobia",w:1.0},{k:"paranoid",w:1.0},{k:"nightmare",w:1.0},{k:"haunted",w:1.0},{k:"creaking",w:0.8},{k:"shadowy",w:0.8},{k:"dark alley",w:1.0},{k:"doomsday",w:1.0},{k:"danger",w:1.0},{k:"peril",w:1.0},{k:"hazard",w:0.8},{k:"trap",w:0.8},{k:"macabre",w:0.8},{k:"eldritch",w:0.8},{k:"uncanny",w:0.8},{k:"eerie",w:0.8},{k:"wraith",w:0.8},{k:"sepulchral",w:0.8},{k:"tenebrous",w:0.8},{k:"abyssal",w:0.8},{k:"stygian",w:0.8},{k:"penumbral",w:0.8},{k:"low-key scared",w:0.3},{k:"spiraling",w:0.3},{k:"doomscrolling",w:0.3},{k:"bad vibes",w:0.3},{k:"the ick",w:0.3}],
        Apathy:[{k:"apathy",w:1.2},{k:"apathetic",w:1.2},{k:"indifferent",w:1.2},{k:"numb",w:1.2},{k:"blank",w:1.0},{k:"empty",w:1.0},{k:"meh",w:1.0},{k:"bored",w:1.0},{k:"listless",w:1.0},{k:"languid",w:0.8},{k:"lethargic",w:1.0},{k:"sluggish",w:1.0},{k:"tired",w:0.8},{k:"fatigued",w:1.0},{k:"weary",w:1.0},{k:"drained",w:0.8},{k:"burned out",w:1.0},{k:"checked out",w:1.0},{k:"detached",w:1.0},{k:"disinterested",w:1.0},{k:"unmotivated",w:1.0},{k:"spiritless",w:0.8},{k:"lifeless",w:0.8},{k:"dull",w:0.8},{k:"flat",w:0.8},{k:"flatline",w:0.8},{k:"monotone",w:0.8},{k:"monotony",w:0.8},{k:"gray",w:0.6},{k:"aimless",w:0.8},{k:"autopilot",w:0.8},{k:"going through the motions",w:0.8},{k:"vacant",w:0.8},{k:"glazed over",w:0.8},{k:"whatever",w:0.8},{k:"couldn’t care less",w:1.0},{k:"over it",w:1.0},{k:"ennui",w:1.0},{k:"torpor",w:0.8},{k:"acedia",w:0.8},{k:"soporific",w:0.8},{k:"anhedonia",w:1.0},{k:"impassive",w:1.0},{k:"stolid",w:0.8},{k:"mid",w:0.3},{k:"idc",w:0.3},{k:"idgaf",w:0.3},{k:"low energy",w:0.3},{k:"no spoons",w:0.3},{k:"can’t be bothered",w:0.3}],
        Ecstasy:[{k:"ecstasy",w:1.2},{k:"ecstatic",w:1.2},{k:"euphoria",w:1.2},{k:"euphoric",w:1.2},{k:"bliss",w:1.2},{k:"blissful",w:1.2},{k:"rapture",w:1.0},{k:"rapturous",w:1.0},{k:"exalted",w:1.0},{k:"exultant",w:1.0},{k:"transcendent",w:1.0},{k:"sublime",w:1.0},{k:"overjoyed",w:1.2},{k:"radiant",w:1.0},{k:"incandescent",w:1.0},{k:"scintillating",w:0.8},{k:"dazzling",w:0.8},{k:"breathtaking",w:1.0},{k:"awestruck",w:1.0},{k:"mind-blown",w:1.0},{k:"delirious",w:1.0},{k:"intoxicated",w:1.0},{k:"high on life",w:1.0},{k:"buzzing",w:1.0},{k:"electric",w:1.0},{k:"surge",w:0.8},{k:"rush",w:1.0},{k:"giddy",w:0.8},{k:"soaring",w:1.0},{k:"lift-off",w:0.8},{k:"numinous",w:0.8},{k:"ineffable",w:0.8},{k:"apotheosis",w:0.8},{k:"epiphany",w:0.8},{k:"empyrean",w:0.8},{k:"auroral",w:0.8},{k:"iridescent",w:0.8},{k:"kaleidoscopic",w:0.8},{k:"synesthetic",w:0.8},{k:"phosphorescent",w:0.8},{k:"bioluminescent",w:0.8},{k:"oneiric",w:0.8},{k:"hyperreal",w:0.8},{k:"supernal",w:0.8},{k:"god tier",w:0.3},{k:"chef’s kiss",w:0.3},{k:"insane energy",w:0.3},{k:"main character energy",w:0.3},{k:"banger",w:0.3},{k:"serotonin hit",w:0.3},{k:"dopamine rush",w:0.3},{k:"euphoric af",w:0.3}]
};

MOOD_DATA.sentiment = {
  // Words/phrases that usually indicate positive affect or appraisal.
        positive: [
            "joy","joyful","delight","delighted","delightful","happy","happiness","cheerful","cheery","merry","jolly",
            "elated","elation","ecstatic","euphoric","euphoria","thrilled","thrilling","excited","exhilarated","buoyant",
            "upbeat","sunny","bright","radiant","glowing","beaming","grinning","smiling","playful","lighthearted",
            "grateful","gratitude","thankful","blessed","content","contented","satisfied","fulfilled","proud","pride",
            "love","loving","adored","adore","fond","affection","affectionate","care","cared for","treasured","valued",
            "peace","peaceful","serene","serenity","calm","tranquil","soothed","safe","secure","cozy","comforted",
            "hope","hopeful","optimistic","confident","relief","relieved","assured","encouraged","inspired","inspiring",
            "meaningful","purposeful","aligned","harmonious","balanced","centered","grounded","flow","glad","glee","bliss",
            "wholesome","warm","warmth","heartening","life-giving","uplifted","sparkling","vibrant","alive","thriving","flourishing"
        ],

        // Words/phrases that usually indicate negative affect or appraisal.
        negative: [
            "sad","sorrow","sorrowful","grief","grieving","heartbroken","miserable","devastated","depressed","melancholy",
            "down","downcast","blue","gloomy","somber","bleak","hopeless","despair","despairing","forlorn","empty","hollow",
            "lonely","lonesome","isolated","abandoned","rejected","unloved","hurt","wounded","aching","regret","remorse",
            "anger","angry","furious","rage","enraged","livid","irate","annoyed","irritated","frustrated","resentful","spiteful",
            "fear","afraid","scared","terrified","petrified","panic","panicky","anxious","anxiety","worried","uneasy","dread",
            "tense","tension","stressed","overwhelmed","frazzled","jittery","on edge","wired","drained","burned out","tired",
            "bored","apathy","apathetic","indifferent","numb","numbness","listless","lethargic","sluggish","weary","gray",
            "worthless","pointless","useless","ashamed","shame","guilty","guilt","disgust","disgusted","repulsed","sick of",
            "irritating","annoying","painful","heavy","burdened","stuck","trapped","lost","broken","empty inside"
        ]
};

MOOD_DATA.modifiers = {
        // These increase perceived intensity. Keep short, common forms first.
        intensifiers: [
            "very","so","too","really","super","extremely","incredibly","highly","utterly","totally",
            "absolutely","deeply","profoundly","truly","intensely","wildly","insanely","immensely","awfully","terribly",
            "ridiculously","crazy","crazy-","mad","madly","mega","ultra","hyper","extra","beyond","overly",
            "so much","so very","so damn","so freaking","so fricking","so bloody","so flipping","so so",
            "quite","rather","ever so","all kinds of","way","way too","by a lot","to the max","through the roof"
        ],

        // These soften/attenuate perceived intensity.
        diminishers: [
            "slightly","a bit","a little","kinda","sort of","somewhat","barely","hardly","mildly","faintly",
            "softly","gently","lightly","not really","not very","not that","a touch","a tad","a smidge","a smidgen",
            "moderately","fairly","pretty","relatively","more or less","sorta","kinda-sorta","low-key","low key",
            "kinda low","just a little","only a little","only somewhat","just somewhat","not much","not too much","not too",
            "a hair","a shade","a fraction","to a degree"
        ]
};

MOOD_DATA.arousalCues = {
        // Words/phrases that correlate with high physiological/mental activation.
        high: [
            "wired","buzzing","hyped","hype","restless","energized","energised","racing","panicky","furious","electric","amped",
            "keyed up","worked up","on edge","on-edge","jittery","jumpy","fidgety","antsy","charged","crackling","vibrating",
            "thrilled","excited","exhilarated","ecstatic","euphoric","giddy","surging","pumped","fired up","adrenaline","rush",
            "breathless","short of breath","heart racing","can’t sit still","can’t stop","amped up","stirred","inflamed","heated",
            "volatile","explosive","urgent","pressed","intense","overclocked","wired-tired","spiraling","frazzled","alert","vigilant",
            "fight or flight","fight-or-flight"
        ],

        // Words/phrases that correlate with low activation/calm.
        low: [
            "tired","exhausted","lethargic","sleepy","drowsy","slow","calm","serene","tranquil","relaxed","at ease","soothed",
            "chill","laid-back","unhurried","restful","peaceful","sedate","settled","quiet","still","sluggish","drained","fatigued",
            "spent","burned out","burnt out","heavy-limbed","low energy","worn out","dozy","soporific","lulled","cozy","cozied",
            "comfy","comforted","mellow","easygoing","loose","unwound","centered","grounded","balanced","collected","composed",
            "sleep-soft","languid","listless","passive"
        ]
    };

MOOD_DATA.familyBias ={
    arousal:{
      Serenity:-0.20, Tension:+0.20, Sorrow:-0.10, Joy:+0.20, Anger:+0.35,
      Memory:-0.05, Aspiration:+0.15, Fear:+0.25, Apathy:-0.25, Ecstasy:+0.45
    }
  };
