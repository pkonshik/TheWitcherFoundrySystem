export const witcher = {}

/**
 * @enum {string}
 */
witcher.rollFormulas = {
    default: `1d10`,
    critRoll: `1d10x10`
}

/**
 * @typedef {object} Modifier
 * @property {string} formula
 * @property {string} formulaExtraRef
 * @property {string} staCost
 * @property {string} staCostDisplay
 * @property {string} staCostDisplayExtraRef
 */

/**
 * @enum {Modifier}
 */
witcher.modifiers = {
    extraAttack: {
        formula: " -3",
        formulaExtraRef: "WITCHER.Dialog.attackExtra",
        staCost: 3,
        staCostDisplay: " +3",
        staCostDisplayExtraRef: "WITCHER.Dialog.attackExtra"
    },
}

witcher.healModifiers = {
    fluid: 2,
    healingHands: 3,
    healingTent: 2
}

/**
 * @typedef {object} ItemType
 * @property {string} name
 * @property {boolean} isItem
 * @property {boolean} isSystem
 */

/**
 * @enum {ItemType}
 */
witcher.itemTypes = {
    // ItemType && SystemType
    alchemical: {name: "alchemical", isItem: true, isSystem: true},
    animalParts: {name: "animal-parts", isItem: true, isSystem: true},
    armor: {name: "armor", isItem: true, isSystem: true},
    component: {name: "component", isItem: true, isSystem: true},
    craftingMaterial: {name: "crafting-material", isItem: true, isSystem: true},
    weapon: {name: "weapon", isItem: true, isSystem: true},

    // SystemType
    alchemicalItem: {name: "alchemical-item", isItem: false, isSystem: true},
    ammunition: {name: "ammunition", isItem: false, isSystem: true},
    armorEnhancement: {name: "armor-enhancement", isItem: false, isSystem: true},
    bomb: {name: "bomb", isItem: false, isSystem: true},
    clothing: {name: "clothing", isItem: false, isSystem: true},
    containers: {name: "containers", isItem: false, isSystem: true},
    decoction: {name: "decoction", isItem: false, isSystem: true},
    elderfolkWeapon: {name: "elderfolk-weapon", isItem: false, isSystem: true},
    foodDrink: {name: "food-drink", isItem: false, isSystem: true},
    genera: {name: "genera", isItem: false, isSystem: true},
    glyph: {name: "glyph", isItem: false, isSystem: true},
    ingredients: {name: "ingredients", isItem: false, isSystem: true},
    minerals: {name: "minerals", isItem: false, isSystem: true},
    mountAccessories: {name: "mount-accessories", isItem: false, isSystem: true},
    oil: {name: "oil", isItem: false, isSystem: true},
    potion: {name: "potion", isItem: false, isSystem: true},
    questItem: {name: "quest-item", isItem: false, isSystem: true},
    rune: {name: "rune", isItem: false, isSystem: true},
    substances: {name: "substances", isItem: false, isSystem: true},
    toolkit: {name: "toolkit", isItem: false, isSystem: true},
    traps: {name: "traps", isItem: false, isSystem: true},

    // ItemType
    diagrams: {name: "diagrams", isItem: true, isSystem: false},
    effect: {name: "effect", isItem: true, isSystem: false},
    enhancement: {name: "enhancement", isItem: true, isSystem: false},
    mount: {name: "mount", isItem: true, isSystem: false},
    mutagen: {name: "mutagen", isItem: true, isSystem: false},
    note: {name: "note", isItem: true, isSystem: false},
    profession: {name: "profession", isItem: true, isSystem: false},
    race: {name: "race", isItem: true, isSystem: false},
    spell: {name: "spell", isItem: true, isSystem: false},
    valuable: {name: "valuable", isItem: true, isSystem: false},
}

/**
 * @typedef Level
 * @property {string} name
 * @property {string} alias
 */

/**
 * @enum {Level}
 */
witcher.craftLevels = {
    novice: {
        name: "novice",
        alias: "WITCHER.Diagram.Novice"
    }
}

/**
 * @enum {Level}
 */
witcher.magicLevels = {
    novice: {
        name: "novice",
        alias: "WITCHER.Spell.Novice",
    },
    journeyman: {
        name: "journeyman",
        alias: "WITCHER.Spell.Journeyman"
    },
    master: {
        name: "master",
        alias: "WITCHER.Spell.Master"
    }
}

/**
 * @typedef MagicType
 * @property {string} name
 * @property {string} alias
 */

/**
 * @enum {MagicType}
 */
witcher.magicTypes = {
    spells: {
        name: "Spells",
        alias: "WITCHER.Spell.Spells"
    },
    invocations: {
        name: "Invocations",
        alias: "WITCHER.Spell.Invocations"
    },
    witcherSigns: {
        name: "Witcher",
        alias: "WITCHER.Spell.Witcher"
    },
    rituals: {
        name: "Rituals",
        alias: "WITCHER.Spell.Rituals"
    },
    hexes: {
        name: "Hexes",
        alias: "WITCHER.Spell.Hexes"
    },
    magicalGift: {
        name: "MagicalGift",
        alias: "WITCHER.Spell.MagicalGift"
    }
}

/**
 * @typedef {object} SkillType
 * @property {string} name
 * @property {string} alias
 * @property {string} ref
 */

/**
 * @enum {SkillType}
 */
const INT_SKILLS = {
    awareness: {
        name: "awareness",
        alias: "WITCHER.SkIntAwareness",
        ref: "skills.int.awareness",
    },
    business: {
        name: "business",
        alias: "WITCHER.SkIntBusiness",
        ref: "skills.int.business",
    },
    deduction: {
        name: "deduction",
        alias: "WITCHER.SkIntDeduction",
        ref: "skills.int.deduction",
    },
    education: {
        name: "education",
        alias: "WITCHER.SkIntEducation",
        ref: "skills.int.education",
    },
    commonSpeech: {
        name: "commonsp",
        alias: "WITCHER.SkIntCommon",
        ref: "skills.int.commonsp",
    },
    elderSpeech: {
        name: "eldersp",
        alias: "WITCHER.SkIntElder",
        ref: "skills.int.eldersp",
    },
    dwarvenSpeech: {
        name: "dwarven",
        alias: "WITCHER.SkIntDwarven",
        ref: "skills.int.dwarven",
    },
    monster: {
        name: "monster",
        alias: "WITCHER.SkIntMonster",
        ref: "skills.int.monster",
    },
    socialEtq: {
        name: "socialetq",
        alias: "WITCHER.SkIntSocialEt",
        ref: "skills.int.socialetq",
    },
    streetwise: {
        name: "streetwise",
        alias: "WITCHER.SkIntStreet",
        ref: "skills.int.streetwise",
    },
    tactics: {
        name: "tactics",
        alias: "WITCHER.SkIntTactics",
        ref: "skills.int.tactics",
    },
    teaching: {
        name: "teaching",
        alias: "WITCHER.SkIntTeaching",
        ref: "skills.int.teaching",
    },
    wilderness: {
        name: "wilderness",
        alias: "WITCHER.SkIntWilderness",
        ref: "skills.int.wilderness",
    }
}

witcher.intSkills = INT_SKILLS

/**
 * @enum {SkillType}
 */
const REF_SKILLS = {
    brawling: {
        name: "brawling",
        alias: "WITCHER.SkRefBrawling",
        ref: "skills.ref.brawling",
    },
    dodge: {
        name: "dodge",
        alias: "WITCHER.SkRefDodge",
        ref: "skills.ref.dodge",
    },
    melee: {
        name: "melee",
        alias: "WITCHER.SkRefMelee",
        ref: "skills.ref.melee",
    },
    riding: {
        name: "riding",
        alias: "WITCHER.SkRefRiding",
        ref: "skills.ref.riding",
    },
    sailing: {
        name: "sailing",
        alias: "WITCHER.SkRefSailing",
        ref: "skills.ref.sailing",
    },
    smallBlades: {
        name: "smallblades",
        alias: "WITCHER.SkRefSmall",
        ref: "skills.ref.smallblades",
    },
    staffSpear: {
        name: "staffspear",
        alias: "WITCHER.SkRefStaff",
        ref: "skills.ref.staffspear",
    },
    swordsmanship: {
        name: "swordsmanship",
        alias: "WITCHER.SkRefSwordsmanship",
        ref: "skills.ref.swordsmanship",
    }
}

witcher.refSkills = REF_SKILLS

/**
 * @enum {SkillType}
 */
const DEX_SKILLS = {
    archery: {
        name: "archery",
        alias: "WITCHER.SkDexArchery",
        ref: "skills.dex.archery",
    },
    athletics: {
        name: "athletics",
        alias: "WITCHER.SkDexAthletics",
        ref: "skills.dex.athletics",
    },
    crossbow: {
        name: "crossbow",
        alias: "WITCHER.SkDexCrossbow",
        ref: "skills.dex.crossbow",
    },
    sleight: {
        name: "sleight",
        alias: "WITCHER.SkDexSleight",
        ref: "skills.dex.sleight",
    },
    stealth: {
        name: "stealth",
        alias: "WITCHER.SkDexStealth",
        ref: "skills.dex.stealth",
    }
}

witcher.dexSkills = DEX_SKILLS

/**
 * @enum {SkillType}
 */
const BODY_SKILLS = {
    physique: {
        name: "physique",
        alias: "WITCHER.SkBodyPhys",
        ref: "skills.body.physique",
    },
    endurance: {
        name: "endurance",
        alias: "WITCHER.SkBodyEnd",
        ref: "skills.body.endurance",
    }
}

witcher.bodySkills = BODY_SKILLS

/**
 * @enum {SkillType}
 */
const EMP_SKILLS = {
    charisma: {
        name: "charisma",
        alias: "WITCHER.SkEmpCharisma",
        ref: "skills.emp.charisma",
    },
    deceit: {
        name: "deceit",
        alias: "WITCHER.SkEmpDeceit",
        ref: "skills.emp.deceit",
    },
    fineArts: {
        name: "finearts",
        alias: "WITCHER.SkEmpArts",
        ref: "skills.emp.finearts",
    },
    gambling: {
        name: "gampling",
        alias: "WITCHER.SkEmpGambling",
        ref: "skills.emp.gambling",
    },
    grooming: {
        name: "grooming",
        alias: "WITCHER.SkEmpGrooming",
        ref: "skills.emp.grooming",
    },
    perception: {
        name: "perception",
        alias: "WITCHER.SkEmpHumanPerc",
        ref: "skills.emp.perception",
    },
    leadership: {
        name: "leadership",
        alias: "WITCHER.SkEmpLeadership",
        ref: "skills.emp.leadership",
    },
    persuasion: {
        name: "persuasion",
        alias: "WITCHER.SkEmpPersuasion",
        ref: "skills.emp.persuasion",
    },
    performance: {
        name: "performance",
        alias: "WITCHER.SkEmpPerformance",
        ref: "skills.emp.performance",
    },
    seduction: {
        name: "seduction",
        alias: "WITCHER.SkEmpSeduction",
        ref: "skills.emp.seduction",
    }
}

witcher.empSkills = EMP_SKILLS

/**
 * @enum {SkillType}
 */
const CRA_SKILLS = {
    alchemy: {
        name: "alchemy",
        alias: "WITCHER.SkCraAlchemy",
        ref: "skills.cra.alchemy",
    },
    crafting: {
        name: "crafting",
        alias: "WITCHER.SkCraCrafting",
        ref: "skills.cra.crafting",
    },
    disguise: {
        name: "diquise",
        alias: "WITCHER.SkCraDisguise",
        ref: "skills.cra.disguise",
    },
    firstAid: {
        name: "firstaid",
        alias: "WITCHER.SkCraAid",
        ref: "skills.cra.firstaid",
    },
    forgery: {
        name: "forgery",
        alias: "WITCHER.SkCraForge",
        ref: "skills.cra.forgery",
    },
    pickLock: {
        name: "picklock",
        alias: "WITCHER.SkCraPick",
        ref: "skills.cra.picklock",
    },
    trapCraft: {
        name: "trapcraft",
        alias: "WITCHER.SkCraTrapCraft",
        ref: "skills.cra.trapcraft",
    }
}

witcher.craSkills = CRA_SKILLS

/**
 * @enum {SkillType}
 */
const WILL_SKILLS = {
    courage: {
        name: "courage",
        alias: "WITCHER.SkWillCourage",
        ref: "skills.will.courage",
    },
    hexWeave: {
        name: "hexweave",
        alias: "WITCHER.SkWillHex",
        ref: "skills.will.hexweave",
    },
    intimidation: {
        name: "intimidation",
        alias: "WITCHER.SkWillIntim",
        ref: "skills.will.intimidation",
    },
    spellCast: {
        name: "spellcast",
        alias: "WITCHER.SkWillSpellcast",
        ref: "skills.will.spellcast",
    },
    resistMagic: {
        name: "resistmagic",
        alias: "WITCHER.SkWillResistMag",
        ref: "skills.will.resistmagic",
    },
    resistCoerc: {
        name: "resistcoerc",
        alias: "WITCHER.SkWillResistCoer",
        ref: "skills.will.resistcoerc",
    },
    ritCraft: {
        name: "ritcraft",
        alias: "WITCHER.SkWillRitCraft",
        ref: "skills.will.ritcraft",
    }
}

witcher.willSkills = WILL_SKILLS

/**
 * @enum {SkillType}
 */
witcher.skills = {
    ...INT_SKILLS,
    ...REF_SKILLS,
    ...DEX_SKILLS,
    ...BODY_SKILLS,
    ...EMP_SKILLS,
    ...CRA_SKILLS,
    ...WILL_SKILLS
}

/**
 * @typedef {object} StatType
 * @property {string} name
 * @property {string} alias
 * @property {string} aliasShort
 * @property {string} ref
 * @property {keyof INT_SKILLS|REF_SKILLS|DEX_SKILLS|BODY_SKILLS|EMP_SKILLS|CRA_SKILLS|WILL_SKILLS} skills
 */

/**
 * @enum {StatType}
 */
const STATS = {
    int: {
        name: "int",
        alias: "WITCHER.StInt",
        aliasShort: "WITCHER.Actor.Stat.Int",
        ref: "stats.int",
        skills: {...INT_SKILLS}
    },
    ref: {
        name: "ref",
        alias: "WITCHER.StRef",
        aliasShort: "WITCHER.Actor.Stat.Ref",
        ref: "stats.ref",
        skills: {...REF_SKILLS}
    },
    dex: {
        name: "dex",
        alias: "WITCHER.StDex",
        aliasShort: "WITCHER.Actor.Stat.Dex",
        ref: "stats.dex",
        skills: {...DEX_SKILLS}
    },
    body: {
        name: "body",
        alias: "WITCHER.StBody",
        aliasShort: "WITCHER.Actor.Stat.Body",
        ref: "stats.body",
        skills: {...BODY_SKILLS}
    },
    spd: {
        name: "spd",
        alias: "WITCHER.StSpd",
        aliasShort: "WITCHER.Actor.Stat.Spd",
        ref: "stats.spd",
    },
    emp: {
        name: "emp",
        alias: "WITCHER.StEmp",
        aliasShort: "WITCHER.Actor.Stat.Emp",
        ref: "stats.emp",
        skills: {...EMP_SKILLS}
    },
    cra: {
        name: "cra",
        alias: "WITCHER.StCra",
        aliasShort: "WITCHER.Actor.Stat.Cra",
        ref: "stats.cra",
        skills: {...CRA_SKILLS}
    },
    will: {
        name: "will",
        alias: "WITCHER.StWill",
        aliasShort: "WITCHER.Actor.Stat.Will",
        ref: "stats.will",
        skills: {...WILL_SKILLS}
    },
    luck: {
        name: "luck",
        alias: "WITCHER.StLuck",
        aliasShort: "WITCHER.Actor.Stat.Luck",
        ref: "stats.luck",
    }
}

witcher.stats = STATS

/**
 * @enum {StatType}
 */
const CORE_STATS = {
    stun: {
        name: "stun",
        aliasShort: "WITCHER.Actor.CoreStat.Stun",
        ref: "coreStats.stun",
    },
    run: {
        name: "run",
        aliasShort: "WITCHER.Actor.CoreStat.Run",
        ref: "coreStats.run",
    },
    leap: {
        name: "leap",
        aliasShort: "WITCHER.Actor.CoreStat.Leap",
        ref: "coreStats.leap",
    },
    enc: {
        name: "enc",
        aliasShort: "WITCHER.Actor.CoreStat.Enc",
        ref: "coreStats.enc",
    },
    rec: {
        name: "rec",
        aliasShort: "WITCHER.Actor.CoreStat.Rec",
        ref: "coreStats.rec",
    },
    woundThreshold: {
        name: "woundThreshold",
        aliasShort: "WITCHER.Actor.CoreStat.woundThreshold",
        ref: "coreStats.woundThreshold",
    }
}

witcher.coreStats = CORE_STATS

/**
 * @enum {StatType}
 */
const DERIVED_STATS = {
    hp: {
        name: "hp",
        ref: "derivedStats.hp",
    },
    sta: {
        name: "sta",
        ref: "derivedStats.sta",
    },
    resolve: {
        name: "resolve",
        ref: "derivedStats.resolve",
    },
    focus: {
        name: "focus",
        ref: "derivedStats.focus",
    }
    //todo add other der stats PUNCH KICK if needed
}

witcher.derivedStats = DERIVED_STATS

/**
 * @enum {StatType}
 */
const REPUTATION_STATS = {
    reputation: {
        name: "reputation",
        alias: "WITCHER.StReputation",
        ref: "reputation",
    }
}

witcher.reputation = REPUTATION_STATS

/**
 * @typedef {object} StatTypes
 * @property {string} name
 * @property {keyof STATS|CORE_STATS|DERIVED_STATS|REPUTATION_STATS} list
 */

/**
 * @enum {StatTypes}
 */
const STAT_TYPES = {
    stats: {
        name: "stats",
        list: {...STATS}
    },
    coreStats: {
        name: "coreStats",
        list: {...CORE_STATS}
    },
    derivedStats: {
        name: "derivedStats",
        list: {...DERIVED_STATS}
    },
    reputation: {
        name: "reputation",
        list: {...REPUTATION_STATS}
    }
}

witcher.statTypes = STAT_TYPES

/**
 * @typedef {object} SubstanceType
 * @property {string} name
 * @property {string} alias
 */

/**
 * @enum {SubstanceType}
 */
witcher.substanceTypes = {
    vitriol: {
        name: "vitriol",
        alias: "WITCHER.Inventory.Vitriol"
    },
    rebis: {
        name: "rebis",
        alias: "WITCHER.Inventory.Rebis"
    },
    aether: {
        name: "aether",
        label: "WITCHER.Inventory.Aether"
    },
    quebrith: {
        name: "quebrith",
        alias: "WITCHER.Inventory.Quebrith"
    },
    hydragenum: {
        name: "hydragenum",
        alias: "WITCHER.Inventory.Hydragenum"
    },
    vermilion: {
        name: "vermilion",
        alias: "WITCHER.Inventory.Vermilion"
    },
    sol: {
        name: "sol",
        alias: "WITCHER.Inventory.Sol"
    },
    caelum: {
        name: "caleum",
        alias: "WITCHER.Inventory.Caelum"
    },
    fulgur: {
        name: "fulgur",
        alias: "WITCHER.Inventory.Fulgur"
    }
}

/**
 * @enum {string}
 */
witcher.Availability = {
    Everywhere: "WITCHER.Item.AvailabilityEverywhere",
    Common: "WITCHER.Item.AvailabilityCommon",
    Poor: "WITCHER.Item.AvailabilityPoor",
    Rare: "WITCHER.Item.AvailabilityRare",
}

/**
 * @enum {string}
 */
witcher.Concealment = {
    T: "WITCHER.Item.Tiny",
    S: "WITCHER.Item.Small",
    L: "WITCHER.Item.Large",
    NA: "WITCHER.Item.CantHide",
}

/**
 * @enum {string}
 */
witcher.MonsterTypes = {
    Humanoid: "WITCHER.Monster.Type.Humanoid",
    Necrophage: "WITCHER.Monster.Type.Necrophage",
    Specter: "WITCHER.Monster.Type.Specter",
    Beast: "WITCHER.Monster.Type.Beast",
    CursedOne: "WITCHER.Monster.Type.CursedOne",
    Hybrid: "WITCHER.Monster.Type.Hybrid",
    Insectoid: "WITCHER.Monster.Type.Insectoid",
    Elementa: "WITCHER.Monster.Type.Elementa",
    Relict: "WITCHER.Monster.Type.Relict",
    Ogroid: "WITCHER.Monster.Type.Ogroid",
    Draconid: "WITCHER.Monster.Type.Draconid",
    Vampire: "WITCHER.Monster.Type.Vampire",
}

/**
 * @enum {string}
 */
const CRIT_TYPE = {
    simple: "WITCHER.CritWound.Simple",
    complex: "WITCHER.CritWound.Complex",
    difficult: "WITCHER.CritWound.Difficult",
    deadly: "WITCHER.CritWound.Deadly",
}

witcher.CritType = CRIT_TYPE

/**
 * @typedef CritModType
 * @property {string} None
 * @property {string} Stabilized
 * @property {string} Treated
 */

/**
 * @enum {CritModType}
 */
witcher.CritMod = {
    None: "WITCHER.CritWound.None",
    Stabilized: "WITCHER.CritWound.Stabilized",
    Treated: "WITCHER.CritWound.Treated",
}

/**
 * @typedef {object} CritModDescription
 * @property {CritType} type
 * @property {CritModType} mod
 * @property {string} alias
 * @property {string} description
 */

/**
 * @enum {CritModDescription}
 */
witcher.CritModDescription = {
    SimpleCrackedJaw: {
        name: "SimpleCrackedJaw",
        type: CRIT_TYPE.simple,
        mod: {
            None: "WITCHER.CritWound.Mod.SimpleCrackedJaw.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleCrackedJaw.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleCrackedJaw.Treated"
        },
        alias: "WITCHER.CritWound.Name.SimpleCrackedJaw",
        description: "WITCHER.CritWound.SimpleCrackedJaw"
    },
    SimpleDisfiguringScar: {
        name: "SimpleDisfiguringScar",
        type: CRIT_TYPE.simple,
        mod: {
            None: "WITCHER.CritWound.Mod.SimpleDisfiguringScar.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleDisfiguringScar.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleDisfiguringScar.Treated"
        },
        alias: "WITCHER.CritWound.Name.SimpleDisfiguringScar",
        description: "WITCHER.CritWound.SimpleDisfiguringScar"
    },
    SimpleCrackedRibs: {
        name: "SimpleCrackedRibs",
        type: CRIT_TYPE.simple,
        mod: {
            None: "WITCHER.CritWound.Mod.SimpleCrackedRibs.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleCrackedRibs.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleCrackedRibs.Treated"
        },
        alias: "WITCHER.CritWound.Name.SimpleCrackedRibs",
        description: "WITCHER.CritWound.SimpleCrackedRibs",
    },
    SimpleForeignObject: {
        name: "SimpleForeignObject",
        type: CRIT_TYPE.simple,
        mod: {
            None: "WITCHER.CritWound.Mod.SimpleForeignObject.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleForeignObject.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleForeignObject.Treated"
        },
        alias: "WITCHER.CritWound.Name.SimpleForeignObject",
        description: "WITCHER.CritWound.SimpleForeignObject",
    },
    SimpleSprainedArm: {
        name: "SimpleSprainedArm",
        type: CRIT_TYPE.simple,
        mod: {
            None: "WITCHER.CritWound.Mod.SimpleSprainedArm.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleSprainedArm.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleSprainedArm.Treated"
        },
        alias: "WITCHER.CritWound.Name.SimpleSprainedArm",
        description: "WITCHER.CritWound.SimpleSprainedArm",
    },
    SimpleSprainedLeg: {
        name: "SimpleSprainedLeg",
        type: CRIT_TYPE.simple,
        mod: {
            None: "WITCHER.CritWound.Mod.SimpleSprainedLeg.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleSprainedLeg.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleSprainedLeg.Treated"
        },
        alias: "WITCHER.CritWound.Name.SimpleSprainedLeg",
        description: "WITCHER.CritWound.SimpleSprainedLeg",
    },
    ComplexMinorHeadWound: {
        name: "ComplexMinorHeadWound",
        type: CRIT_TYPE.complex,
        mod: {
            None: "WITCHER.CritWound.Mod.ComplexMinorHeadWound.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexMinorHeadWound.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexMinorHeadWound.Treated"
        },
        alias: "WITCHER.CritWound.Name.ComplexMinorHeadWound",
        description: "WITCHER.CritWound.ComplexMinorHeadWound",
    },
    ComplexLostTeeth: {
        name: "ComplexLostTeeth",
        type: CRIT_TYPE.complex,
        mod: {
            None: "WITCHER.CritWound.Mod.ComplexLostTeeth.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexLostTeeth.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexLostTeeth.Treated"
        },
        alias: "WITCHER.CritWound.Name.ComplexLostTeeth",
        description: "WITCHER.CritWound.ComplexLostTeeth",
    },
    ComplexRupturedSpleen: {
        name: "ComplexRupturedSpleen",
        type: CRIT_TYPE.complex,
        mod: {
            None: "WITCHER.CritWound.Mod.ComplexRupturedSpleen.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexRupturedSpleen.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexRupturedSpleen.Treated"
        },
        alias: "WITCHER.CritWound.Name.ComplexRupturedSpleen",
        description: "WITCHER.CritWound.ComplexRupturedSpleen",
    },
    ComplexBrokenRibs: {
        name: "ComplexBrokenRibs",
        type: CRIT_TYPE.complex,
        mod: {
            None: "WITCHER.CritWound.Mod.ComplexBrokenRibs.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexBrokenRibs.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexBrokenRibs.Treated"
        },
        alias: "WITCHER.CritWound.Name.ComplexBrokenRibs",
        description: "WITCHER.CritWound.ComplexBrokenRibs",
    },
    ComplexFracturedArm: {
        name: "ComplexFracturedArm",
        type: CRIT_TYPE.complex,
        mod: {
            None: "WITCHER.CritWound.Mod.ComplexFracturedArm.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexFracturedArm.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexFracturedArm.Treated"
        },
        alias: "WITCHER.CritWound.Name.ComplexFracturedArm",
        description: "WITCHER.CritWound.ComplexFracturedArm",
    },
    ComplexFracturedLeg: {
        name: "ComplexFracturedLeg",
        type: CRIT_TYPE.complex,
        mod: {
            None: "WITCHER.CritWound.Mod.ComplexFracturedLeg.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexFracturedLeg.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexFracturedLeg.Treated"
        },
        alias: "WITCHER.CritWound.Name.ComplexFracturedLeg",
        description: "WITCHER.CritWound.ComplexFracturedLeg",
    },
    DifficultSkullFracture: {
        name: "DifficultSkullFracture",
        type: CRIT_TYPE.difficult,
        mod: {
            None: "WITCHER.CritWound.Mod.DifficultSkullFracture.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultSkullFracture.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultSkullFracture.Treated"
        },
        alias: "WITCHER.CritWound.Name.DifficultSkullFracture",
        description: "WITCHER.CritWound.DifficultSkullFracture",
    },
    DifficultConcussion: {
        name: "DifficultConcussion",
        type: CRIT_TYPE.difficult,
        mod: {
            None: "WITCHER.CritWound.Mod.DifficultConcussion.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultConcussion.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultConcussion.Treated"
        },
        alias: "WITCHER.CritWound.Name.DifficultConcussion",
        description: "WITCHER.CritWound.DifficultConcussion",
    },
    DifficultTornStomach: {
        name: "DifficultTornStomach",
        type: CRIT_TYPE.difficult,
        mod: {
            None: "WITCHER.CritWound.Mod.DifficultTornStomach.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultTornStomach.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultTornStomach.Treated"
        },
        alias: "WITCHER.CritWound.Name.DifficultTornStomach",
        description: "WITCHER.CritWound.DifficultTornStomach",
    },
    DifficultSuckingChestWound: {
        name: "DifficultSuckingChestWound",
        type: CRIT_TYPE.difficult,
        mod: {
            None: "WITCHER.CritWound.Mod.DifficultSuckingChestWound.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultSuckingChestWound.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultSuckingChestWound.Treated"
        },
        alias: "WITCHER.CritWound.Name.DifficultSuckingChestWound",
        description: "WITCHER.CritWound.DifficultSuckingChestWound",
    },
    DifficultCompoundArmFracture: {
        name: "DifficultCompoundArmFracture",
        type: CRIT_TYPE.difficult,
        mod: {
            None: "WITCHER.CritWound.Mod.DifficultCompoundArmFracture.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultCompoundArmFracture.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultCompoundArmFracture.Treated"
        },
        alias: "WITCHER.CritWound.Name.DifficultCompoundArmFracture",
        description: "WITCHER.CritWound.DifficultCompoundArmFracture",
    },
    DifficultCompoundLegFracture: {
        name: "DifficultCompoundLegFracture",
        type: CRIT_TYPE.difficult,
        mod: {
            None: "WITCHER.CritWound.Mod.DifficultCompoundLegFracture.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultCompoundLegFracture.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultCompoundLegFracture.Treated"
        },
        alias: "WITCHER.CritWound.Name.DifficultCompoundLegFracture",
        description: "WITCHER.CritWound.DifficultCompoundLegFracture",
    },
    DeadlyDecapitated: {
        name: "DeadlyDecapitated",
        type: CRIT_TYPE.deadly,
        mod: {
            None: "WITCHER.CritWound.Mod.DeadlyDecapitated.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDecapitated.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDecapitated.Treated"
        },
        alias: "WITCHER.CritWound.Name.DeadlyDecapitated",
        description: "WITCHER.CritWound.DeadlyDecapitated",
    },
    DeadlyDamagedEye: {
        name: "DeadlyDamagedEye",
        type: CRIT_TYPE.deadly,
        mod: {
            None: "WITCHER.CritWound.Mod.DeadlyDamagedEye.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDamagedEye.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDamagedEye.Treated"
        },
        alias: "WITCHER.CritWound.Name.DeadlyDamagedEye",
        description: "WITCHER.CritWound.DeadlyDamagedEye",
    },
    DeadlyHearthDamage: {
        name: "DeadlyHearthDamage",
        type: CRIT_TYPE.deadly,
        mod: {
            None: "WITCHER.CritWound.Mod.DeadlyHearthDamage.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyHearthDamage.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyHearthDamage.Treated"
        },
        alias: "WITCHER.CritWound.Name.DeadlyHearthDamage",
        description: "WITCHER.CritWound.DeadlyHearthDamage",
    },
    DeadlySepticShock: {
        name: "DeadlySepticShock",
        type: CRIT_TYPE.deadly,
        mod: {
            None: "WITCHER.CritWound.Mod.DeadlySepticShock.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlySepticShock.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlySepticShock.Treated"
        },
        alias: "WITCHER.CritWound.Name.DeadlySepticShock",
        description: "WITCHER.CritWound.DeadlySepticShock",
    },
    DeadlyDismemberedArm: {
        name: "DeadlyDismemberedArm",
        type: CRIT_TYPE.deadly,
        mod: {
            None: "WITCHER.CritWound.Mod.DeadlyDismemberedArm.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDismemberedArm.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDismemberedArm.Treated"
        },
        alias: "WITCHER.CritWound.Name.DeadlyDismemberedArm",
        description: "WITCHER.CritWound.DeadlyDismemberedArm",
    },
    DeadlyDismemberedLeg: {
        name: "DeadlyDismemberedLeg",
        type: CRIT_TYPE.deadly,
        mod: {
            None: "WITCHER.CritWound.Mod.DeadlyDismemberedLeg.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDismemberedLeg.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDismemberedLeg.Treated"
        },
        alias: "WITCHER.CritWound.Name.DeadlyDismemberedLeg",
        description: "WITCHER.CritWound.DeadlyDismemberedLeg",
    },
}

/**
 * @typedef {object} LocationType
 * @property {string} name
 * @property {string} alias
 * @property {boolean} isArmorLocation
 * @property {boolean} isAttackLocation
 * @property {boolean} selectRandomEnemy
 * @property {string} locationFormula
 * @property {string} modifier
 */

/**
 * @enum {LocationType}
 */
witcher.locations = {
    random: {
        name: "Empty",
        alias: "WITCHER.Dialog.attackEmpty",
        isArmorLocation: true,
        isAttackLocation: true
    },
    randomHuman: {
        name: "randomHuman",
        alias: "WITCHER.Dialog.attackRandomHuman",
        isArmorLocation: false,
        isAttackLocation: true,
        selectRandomEnemy: true
    },
    randomMonster: {
        name: "randomMonster",
        alias: "WITCHER.Dialog.attackRandomMonster",
        isArmorLocation: false,
        isAttackLocation: true,
        selectRandomEnemy: true
    },
    head: {
        name: "Head",
        alias: "WITCHER.Armor.LocationHead",
        isArmorLocation: true,
        isAttackLocation: true,
        locationFormula: `*3`,
        modifier: `-6`
    },
    torso: {
        name: "Torso",
        alias: "WITCHER.Armor.LocationTorso",
        isArmorLocation: true,
        isAttackLocation: true,
        locationFormula: `*1`,
        modifier: `-1`
    },
    leftArm: {
        name: "L. Arm",
        alias: "WITCHER.Dialog.attackLArm",
        isArmorLocation: false,
        isAttackLocation: true,
        locationFormula: `*0.5`,
        modifier: `-3`
    },
    rightArm: {
        name: "R. Arm",
        alias: "WITCHER.Dialog.attackRArm",
        isArmorLocation: false,
        isAttackLocation: true,
        locationFormula: `*0.5`,
        modifier: `-3`
    },
    leg: {
        name: "Leg",
        alias: "WITCHER.Armor.LocationLeg",
        isArmorLocation: true,
        isAttackLocation: false
    },
    leftLeg: {
        name: "L. Leg",
        alias: "WITCHER.Dialog.attackLLeg",
        isArmorLocation: false,
        isAttackLocation: true,
        locationFormula: `*0.5`,
        modifier: `-2`
    },
    rightLeg: {
        name: "R. Leg",
        alias: "WITCHER.Dialog.attackRLeg",
        isArmorLocation: false,
        isAttackLocation: true,
        locationFormula: `*0.5`,
        modifier: `-2`
    },
    tailWing: {
        name: "Tail/Wing",
        alias: "WITCHER.Dialog.attackTail",
        isArmorLocation: false,
        isAttackLocation: true,
        locationFormula: `*0.5`
    },
    shield: {
        name: "Shield",
        alias: "WITCHER.Armor.LocationShield",
        isArmorLocation: true,
        isAttackLocation: false
    },
    fullCover: {
        name: "FullCover",
        alias: "WITCHER.Armor.LocationFull",
        isArmorLocation: true,
        isAttackLocation: false
    }
}

/**
 * @typedef {object} ArmorType
 * @property {string} name
 * @property {string} alias
 */

/**
 * @enum {ArmorType}
 */
witcher.armorTypes = {
    light: {
        name: "Light",
        alias: "WITCHER.Armor.Light"
    },
    medium: {
        name: "Medium",
        alias: "WITCHER.Armor.Medium"
    },
    heavy: {
        name: "Heavy",
        alias: "WITCHER.Armor.Heavy"
    },
    natural: {
        name: "Natural",
        alias: "WITCHER.Armor.Natural"
    }
}

/**
 * @typedef {object} DamageType
 * @property {string} name
 * @property {string} alias
 */

/**
 * @enum {DamageType}
 */
witcher.damageTypes = {
    slashing: {
        name: "slashing",
        alias: "WITCHER.Armor.Slashing"
    },
    bludgeoning: {
        name: "bludgeoning",
        alias: "WITCHER.Armor.Bludgeoning"
    },
    piercing: {
        name: "piercing",
        alias: "WITCHER.Armor.Piercing"
    },
    elemental: {
        name: "elemental",
        alias: "WITCHER.Armor.Elemental"
    }
}

/**
 * @typedef {object} StoppingType
 * @property {string} name
 * @property {string} max
 * @property {string} type
 */

/**
 * @enum {StoppingType}
 */
witcher.stopping = {
    head: {
        name: "headStopping",
        max: "headMaxStopping",
        type: "head"
    },

    torso: {
        name: "torsoStopping",
        max: "torsoMaxStopping",
        type: "torso"
    },
    rightArm: {
        name: "rightArmStopping",
        max: "rightArmMaxStopping",
        type: "torso"
    },
    leftArm: {
        name: "leftArmStopping",
        max: "leftArmMaxStopping",
        type: "torso"
    },

    rightLeg: {
        name: "rightLegStopping",
        max: "rightLegMaxStopping",
        type: "bottom"
    },
    leftLeg: {
        name: "leftLegStopping",
        max: "leftLegMaxStopping",
        type: "bottom"
    },
}

/**
 * @type {string[]}
 */
witcher.meleeSkills = ["Brawling", "Melee", "Small Blades", "Staff/Spear", "Swordsmanship", "Athletics"];

/**
 * @type {string[]}
 */
witcher.rangedSkills = ["Athletics", "Archery", "Crossbow"];
