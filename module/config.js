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
 * @property {string} valueRef
 * @property {string} modifierRef
 */

/**
 * @enum {SkillType}
 */
const INT_SKILLS = {
    awareness: {
        name: "awareness",
        alias: "WITCHER.SkIntAwareness",
        valueRef: "int.awareness.value",
        modifierRef: "int.awareness.modifiers"
    },
    business: {
        name: "business",
        alias: "WITCHER.SkIntBusiness",
        valueRef: "int.business.value",
        modifierRef: "int.business.modifiers"
    },
    deduction: {
        name: "deduction",
        alias: "WITCHER.SkIntDeduction",
        valueRef: "int.deduction.value",
        modifierRef: "int.deduction.modifiers"
    },
    education: {
        name: "education",
        alias: "WITCHER.SkIntEducation",
        valueRef: "int.education.value",
        modifierRef: "int.education.modifiers"
    },
    commonSpeech: {
        name: "commonsp",
        alias: "WITCHER.SkIntCommon",
        valueRef: "int.commonsp.value",
        modifierRef: "int.commonsp.modifiers"
    },
    elderSpeech: {
        name: "eldersp",
        alias: "WITCHER.SkIntElder",
        valueRef: "int.eldersp.value",
        modifierRef: "int.eldersp.modifiers"
    },
    dwarvenSpeech: {
        name: "dwarven",
        alias: "WITCHER.SkIntDwarven",
        valueRef: "int.dwarven.value",
        modifierRef: "int.dwarven.modifiers"
    },
    monster: {
        name: "monster",
        alias: "WITCHER.SkIntMonster",
        valueRef: "int.monster.value",
        modifierRef: "int.monster.modifiers"
    },
    socialEtq: {
        name: "socialetq",
        alias: "WITCHER.SkIntSocialEt",
        valuerRef: "int.socialetq.value",
        modifierRef: "int.socialetq.modifiers"
    },
    streetwise: {
        name: "streetwise",
        alias: "WITCHER.SkIntStreet",
        valueRef: "int.streetwise.value",
        modifierRef: "int.streetwise.modifiers"
    },
    tactics: {
        name: "tactics",
        alias: "WITCHER.SkIntTactics",
        valueRef: "int.tactics.value",
        modifierRef: "int.tactics.modifiers"
    },
    teaching: {
        name: "teaching",
        alias: "WITCHER.SkIntTeaching",
        valueRef: "int.teaching.value",
        modifierRef: "int.teaching.modifiers"
    },
    wilderness: {
        name: "wilderness",
        alias: "WITCHER.SkIntWilderness",
        valueRef: "int.wilderness.value",
        modifierRef: "int.wilderness.modifiers"
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
        valueRef: "ref.brawling.value",
        modifierRef: "ref.brawling.modifiers"
    },
    dodge: {
        name: "dodge",
        alias: "WITCHER.SkRefDodge",
        valueRef: "ref.dodge.value",
        modifierRef: "ref.dodge.modifiers"
    },
    melee: {
        name: "melee",
        alias: "WITCHER.SkRefMelee",
        valueRef: "ref.melee.value",
        modifierRef: "ref.melee.modifiers"
    },
    riding: {
        name: "riding",
        alias: "WITCHER.SkRefRiding",
        valueRef: "ref.riding.value",
        modifierRef: "ref.riding.modifiers"
    },
    sailing: {
        name: "sailing",
        alias: "WITCHER.SkRefSailing",
        valueRef: "ref.sailing.value",
        modifierRef: "ref.sailing.modifiers"
    },
    smallBlades: {
        name: "smallblades",
        alias: "WITCHER.SkRefSmall",
        valueRef: "ref.smallblades.value",
        modifierRef: "ref.smallblades.modifiers"
    },
    staffSpear: {
        name: "staffspear",
        alias: "WITCHER.SkRefStaff",
        valueRef: "ref.staffspear.value",
        modifierRef: "ref.staffspear.modifiers"
    },
    swordsmanship: {
        name: "swordsmanship",
        alias: "WITCHER.SkRefSwordsmanship",
        valueRef: "ref.swordsmanship.value",
        modifierRef: "ref.swordsmanship.modifiers"
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
        valueRef: "dex.archery.value",
        modifierRef: "dex.archery.modifiers"
    },
    athletics: {
        name: "athletics",
        alias: "WITCHER.SkDexAthletics",
        valueRef: "dex.athletics.value",
        modifierRef: "dex.athletics.modifiers"
    },
    crossbow: {
        name: "crossbow",
        alias: "WITCHER.SkDexCrossbow",
        valueRef: "dex.crossbow.value",
        modifierRef: "dex.crossbow.modifiers"
    },
    sleight: {
        name: "sleight",
        alias: "WITCHER.SkDexSleight",
        valueRef: "dex.sleight.value",
        modifierRef: "dex.sleight.modifiers"
    },
    stealth: {
        name: "stealth",
        alias: "WITCHER.SkDexStealth",
        valueRef: "dex.stealth.value",
        modifierRef: "dex.stealth.modifiers"
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
        valueRef: "body.physique.value",
        modifierRef: "body.physique.modifiers"
    },
    endurance: {
        name: "endurance",
        alias: "WITCHER.SkBodyEnd",
        valueRef: "body.endurance.value",
        modifierRef: "body.endurance.modifiers"
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
        valueRef: "emp.charisma.value",
        modifierRef: "emp.charisma.modifiers"
    },
    deceit: {
        name: "deceit",
        alias: "WITCHER.SkEmpDeceit",
        valueRef: "emp.deceit.value",
        modifierRef: "emp.deceit.modifiers"
    },
    fineArts: {
        name: "finearts",
        alias: "WITCHER.SkEmpArts",
        valueRef: "emp.finearts.value",
        modifierRef: "emp.finearts.modifiers"
    },
    gambling: {
        name: "gampling",
        alias: "WITCHER.SkEmpGambling",
        valueRef: "emp.gambling.value",
        modifierRef: "emp.gambling.modifiers"
    },
    grooming: {
        name: "grooming",
        alias: "WITCHER.SkEmpGrooming",
        valueRef: "emp.grooming.value",
        modifierRef: "emp.grooming.modifiers"
    },
    perception: {
        name: "perception",
        alias: "WITCHER.SkEmpHumanPerc",
        valueRef: "emp.perception.value",
        modifierRef: "emp.perception.modifiers"
    },
    leadership: {
        name: "leadership",
        alias: "WITCHER.SkEmpLeadership",
        valueRef: "emp.leadership.value",
        modifierRef: "emp.leadership.modifiers"
    },
    persuasion: {
        name: "persuasion",
        alias: "WITCHER.SkEmpPersuasion",
        valueRef: "emp.persuasion.value",
        modifierRef: "emp.persuasion.modifiers"
    },
    performance: {
        name: "performance",
        alias: "WITCHER.SkEmpPerformance",
        valueRef: "emp.performance.value",
        modifierRef: "emp.performance.modifiers"
    },
    seduction: {
        name: "seduction",
        alias: "WITCHER.SkEmpSeduction",
        valueRef: "emp.seduction.value",
        modifierRef: "emp.seduction.modifiers"
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
        valueRef: "cra.alchemy.value",
        modifierRef: "cra.alchemy.modifiers"
    },
    crafting: {
        name: "crafting",
        alias: "WITCHER.SkCraCrafting",
        valueRef: "cra.crafting.value",
        modifierRef: "cra.crafting.modifiers"
    },
    disguise: {
        name: "diquise",
        alias: "WITCHER.SkCraDisguise",
        valueRef: "cra.disguise.value",
        modifierRef: "cra.disguise.modifiers"
    },
    firstAid: {
        name: "firstaid",
        alias: "WITCHER.SkCraAid",
        valueRef: "cra.firstaid.value",
        modifierRef: "cra.firstaid.modifiers"
    },
    forgery: {
        name: "forgery",
        alias: "WITCHER.SkCraForge",
        valueRef: "cra.forgery.value",
        modifierRef: "cra.forgery.modifiers"
    },
    pickLock: {
        name: "picklock",
        alias: "WITCHER.SkCraPick",
        valueRef: "cra.picklock.value",
        modifierRef: "cra.picklock.modifiers"
    },
    trapCraft: {
        name: "trapcraft",
        alias: "WITCHER.SkCraTrapCraft",
        valueRef: "cra.trapcraft.value",
        modifierRef: "cra.trapcraft.modifiers"
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
        valueRef: "will.courage.value",
        modifierRef: "will.courage.modifiers"
    },
    hexWeave: {
        name: "hexweave",
        alias: "WITCHER.SkWillHex",
        valueRef: "will.hexweave.value",
        modifierRef: "will.hexweave.modifiers"
    },
    intimidation: {
        name: "intimidation",
        alias: "WITCHER.SkWillIntim",
        valueRef: "will.intimidation.value",
        modifierRef: "will.intimidation.modifiers"
    },
    spellCast: {
        name: "spellcast",
        alias: "WITCHER.SkWillSpellcast",
        valueRef: "will.spellcast.value",
        modifierRef: "will.spellcast.modifiers"
    },
    resistMagic: {
        name: "resistmagic",
        alias: "WITCHER.SkWillResistMag",
        valueRef: "will.resistmagic.value",
        modifierRef: "will.resistmagic.modifiers"
    },
    resistCoerc: {
        name: "resistcoerc",
        alias: "WITCHER.SkWillResistCoer",
        valueRef: "will.resistcoerc.value",
        modifierRef: "will.resistcoerc.modifiers"
    },
    ritCraft: {
        name: "ritcraft",
        alias: "WITCHER.SkWillRitCraft",
        valueRef: "will.ritcraft.value",
        modifierRef: "will.ritcraft.modifiers"
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
        alias: "WITCHER.Actor.Stat.Ref",
        aliasShort: "WITCHER.Actor.Stat.Ref",
        ref: "stats.ref",
        skills: {...REF_SKILLS}
    },
    dex: {
        name: "dex",
        alias: "WITCHER.Actor.Stat.Dex",
        aliasShort: "WITCHER.Actor.Stat.Dex",
        ref: "stats.dex",
        skills: {...DEX_SKILLS}
    },
    body: {
        name: "body",
        alias: "WITCHER.Actor.Stat.Body",
        aliasShort: "WITCHER.Actor.Stat.Body",
        ref: "stats.body",
        skills: {...BODY_SKILLS}
    },
    spd: {
        name: "spd",
        alias: "WITCHER.Actor.Stat.Spd",
        aliasShort: "WITCHER.Actor.Stat.Spd",
        ref: "stats.spd",
    },
    emp: {
        name: "emp",
        alias: "WITCHER.Actor.Stat.Emp",
        aliasShort: "WITCHER.Actor.Stat.Emp",
        ref: "stats.emp",
        skills: {...EMP_SKILLS}
    },
    cra: {
        name: "cra",
        alias: "WITCHER.Actor.Stat.Cra",
        aliasShort: "WITCHER.Actor.Stat.Cra",
        ref: "stats.cra",
        skills: {...CRA_SKILLS}
    },
    will: {
        name: "will",
        alias: "WITCHER.Actor.Stat.Will",
        aliasShort: "WITCHER.Actor.Stat.Will",
        ref: "stats.will",
        skills: {...WILL_SKILLS}
    },
    luck: {
        name: "luck",
        alias: "WITCHER.Actor.Stat.Luck",
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
 * @typedef CritGravityConfiguration
 * @property {string} name
 * @property {keyof CRIT_TYPE} type
 * @property {string} alias
 */

/**
 * @enum {CritGravityConfiguration}
 */
witcher.CritGravity = {
    Simple: {
        name: "SimpleCrackedJaw",
        type: CRIT_TYPE.simple,
        alias: "WITCHER.CritWound.SimpleCrackedJaw"
    },
    Complex: {
        name: "ComplexMinorHeadWound",
        type: CRIT_TYPE.complex,
        alias: "WITCHER.CritWound.ComplexMinorHeadWound"
    },
    Difficult: {
        name: "DifficultSkullFracture",
        type: CRIT_TYPE.difficult,
        alias: "WITCHER.CritWound.DifficultSkullFracture"
    },
    Deadly: {
        name: "DeadlyDecapitated",
        type: CRIT_TYPE.deadly,
        alias: "WITCHER.CritWound.DeadlyDecapitated"
    },
}

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
 * @property {string} description
 */

/**
 * @enum {CritModDescription}
 */
witcher.CritModDescription = {
    SimpleCrackedJaw: {
        type: CRIT_TYPE.simple,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.SimpleCrackedJaw.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleCrackedJaw.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleCrackedJaw.Treated"
        },
        description: "WITCHER.CritWound.SimpleCrackedJaw"
    },
    SimpleDisfiguringScar: {
        type: CRIT_TYPE.simple,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.SimpleDisfiguringScar.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleDisfiguringScar.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleDisfiguringScar.Treated"
        },
        description: "WITCHER.CritWound.SimpleDisfiguringScar"
    },
    SimpleCrackedRibs: {
        type: CRIT_TYPE.simple,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.SimpleCrackedRibs.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleCrackedRibs.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleCrackedRibs.Treated"
        },
        description: "WITCHER.CritWound.SimpleCrackedRibs",
    },
    SimpleForeignObject: {
        type: CRIT_TYPE.simple,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.SimpleForeignObject.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleForeignObject.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleForeignObject.Treated"
        },
        description: "WITCHER.CritWound.SimpleForeignObject",
    },
    SimpleSprainedArm: {
        type: CRIT_TYPE.simple,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.SimpleSprainedArm.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleSprainedArm.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleSprainedArm.Treated"
        },
        description: "WITCHER.CritWound.SimpleSprainedArm",
    },
    SimpleSprainedLeg: {
        type: CRIT_TYPE.simple,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.SimpleSprainedLeg.None",
            Stabilized: "WITCHER.CritWound.Mod.SimpleSprainedLeg.Stabilized",
            Treated: "WITCHER.CritWound.Mod.SimpleSprainedLeg.Treated"
        },
        description: "WITCHER.CritWound.SimpleSprainedLeg",
    },
    ComplexMinorHeadWound: {
        type: CRIT_TYPE.complex,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.ComplexMinorHeadWound.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexMinorHeadWound.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexMinorHeadWound.Treated"
        },
        description: "WITCHER.CritWound.ComplexMinorHeadWound",
    },
    ComplexLostTeeth: {
        type: CRIT_TYPE.complex,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.ComplexLostTeeth.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexLostTeeth.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexLostTeeth.Treated"
        },
        description: "WITCHER.CritWound.ComplexLostTeeth",
    },
    ComplexRupturedSpleen: {
        type: CRIT_TYPE.complex,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.ComplexRupturedSpleen.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexRupturedSpleen.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexRupturedSpleen.Treated"
        },
        description: "WITCHER.CritWound.ComplexRupturedSpleen",
    },
    ComplexBrokenRibs: {
        type: CRIT_TYPE.complex,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.ComplexBrokenRibs.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexBrokenRibs.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexBrokenRibs.Treated"
        },
        description: "WITCHER.CritWound.ComplexBrokenRibs",
    },
    ComplexFracturedArm: {
        type: CRIT_TYPE.complex,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.ComplexFracturedArm.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexFracturedArm.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexFracturedArm.Treated"
        },
        description: "WITCHER.CritWound.ComplexFracturedArm",
    },
    ComplexFracturedLeg: {
        type: CRIT_TYPE.complex,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.ComplexFracturedLeg.None",
            Stabilized: "WITCHER.CritWound.Mod.ComplexFracturedLeg.Stabilized",
            Treated: "WITCHER.CritWound.Mod.ComplexFracturedLeg.Treated"
        },
        description: "WITCHER.CritWound.ComplexFracturedLeg",
    },
    DifficultSkullFracture: {
        type: CRIT_TYPE.difficult,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DifficultSkullFracture.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultSkullFracture.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultSkullFracture.Treated"
        },
        description: "WITCHER.CritWound.DifficultSkullFracture",
    },
    DifficultConcussion: {
        type: CRIT_TYPE.difficult,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DifficultConcussion.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultConcussion.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultConcussion.Treated"
        },
        description: "WITCHER.CritWound.DifficultConcussion",
    },
    DifficultTornStomach: {
        type: CRIT_TYPE.difficult,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DifficultTornStomach.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultTornStomach.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultTornStomach.Treated"
        },
        description: "WITCHER.CritWound.DifficultTornStomach",
    },
    DifficultSuckingChestWound: {
        type: CRIT_TYPE.difficult,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DifficultSuckingChestWound.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultSuckingChestWound.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultSuckingChestWound.Treated"
        },
        description: "WITCHER.CritWound.DifficultSuckingChestWound",
    },
    DifficultCompoundArmFracture: {
        type: CRIT_TYPE.difficult,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DifficultCompoundArmFracture.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultCompoundArmFracture.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultCompoundArmFracture.Treated"
        },
        description: "WITCHER.CritWound.DifficultCompoundArmFracture",
    },
    DifficultCompoundLegFracture: {
        type: CRIT_TYPE.difficult,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DifficultCompoundLegFracture.None",
            Stabilized: "WITCHER.CritWound.Mod.DifficultCompoundLegFracture.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DifficultCompoundLegFracture.Treated"
        },
        description: "WITCHER.CritWound.DifficultCompoundLegFracture",
    },
    DeadlyDecapitated: {
        type: CRIT_TYPE.deadly,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DeadlyDecapitated.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDecapitated.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDecapitated.Treated"
        },
        description: "WITCHER.CritWound.DeadlyDecapitated",
    },
    DeadlyDamagedEye: {
        type: CRIT_TYPE.deadly,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DeadlyDamagedEye.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDamagedEye.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDamagedEye.Treated"
        },
        description: "WITCHER.CritWound.DeadlyDamagedEye",
    },
    DeadlyHearthDamage: {
        type: CRIT_TYPE.deadly,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DeadlyHearthDamage.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyHearthDamage.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyHearthDamage.Treated"
        },
        description: "WITCHER.CritWound.DeadlyHearthDamage",
    },
    DeadlySepticShock: {
        type: CRIT_TYPE.deadly,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DeadlySepticShock.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlySepticShock.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlySepticShock.Treated"
        },
        description: "WITCHER.CritWound.DeadlySepticShock",
    },
    DeadlyDismemberedArm: {
        type: CRIT_TYPE.deadly,
        mod: witcher.CritMod = {
            None: "WITCHER.CritWound.Mod.DeadlyDismemberedArm.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDismemberedArm.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDismemberedArm.Treated"
        },
        description: "WITCHER.CritWound.DeadlyDismemberedArm",
    },
    DeadlyDismemberedLeg: {
        type: CRIT_TYPE.deadly,
        mod: {
            None: "WITCHER.CritWound.Mod.DeadlyDismemberedLeg.None",
            Stabilized: "WITCHER.CritWound.Mod.DeadlyDismemberedLeg.Stabilized",
            Treated: "WITCHER.CritWound.Mod.DeadlyDismemberedLeg.Treated"
        },
        description: "WITCHER.CritWound.DeadlyDismemberedLeg",
    },
}

/**
 * @enum {string}
 */
witcher.CritSimple = {
    SimpleCrackedJaw: "WITCHER.CritWound.Name.SimpleCrackedJaw",
    SimpleDisfiguringScar: "WITCHER.CritWound.Name.SimpleDisfiguringScar",
    SimpleCrackedRibs: "WITCHER.CritWound.Name.SimpleCrackedRibs",
    SimpleForeignObject: "WITCHER.CritWound.Name.SimpleForeignObject",
    SimpleSprainedArm: "WITCHER.CritWound.Name.SimpleSprainedArm",
    SimpleSprainedLeg: "WITCHER.CritWound.Name.SimpleSprainedLeg",
};

/**
 * @enum {string}
 */
witcher.CritComplex = {
    ComplexMinorHeadWound: "WITCHER.CritWound.Name.ComplexMinorHeadWound",
    ComplexLostTeeth: "WITCHER.CritWound.Name.ComplexLostTeeth",
    ComplexRupturedSpleen: "WITCHER.CritWound.Name.ComplexRupturedSpleen",
    ComplexBrokenRibs: "WITCHER.CritWound.Name.ComplexBrokenRibs",
    ComplexFracturedArm: "WITCHER.CritWound.Name.ComplexFracturedArm",
    ComplexFracturedLeg: "WITCHER.CritWound.Name.ComplexFracturedLeg",
};

/**
 * @enum {string}
 */
witcher.CritDifficult = {
    DifficultSkullFracture: "WITCHER.CritWound.Name.DifficultSkullFracture",
    DifficultConcussion: "WITCHER.CritWound.Name.DifficultConcussion",
    DifficultTornStomach: "WITCHER.CritWound.Name.DifficultTornStomach",
    DifficultSuckingChestWound: "WITCHER.CritWound.Name.DifficultSuckingChestWound",
    DifficultCompoundArmFracture: "WITCHER.CritWound.Name.DifficultCompoundArmFracture",
    DifficultCompoundLegFracture: "WITCHER.CritWound.Name.DifficultCompoundLegFracture",
};

/**
 * @enum {string}
 */
witcher.CritDeadly = {
    DeadlyDecapitated: "WITCHER.CritWound.Name.DeadlyDecapitated",
    DeadlyDamagedEye: "WITCHER.CritWound.Name.DeadlyDamagedEye",
    DeadlyHearthDamage: "WITCHER.CritWound.Name.DeadlyHearthDamage",
    DeadlySepticShock: "WITCHER.CritWound.Name.DeadlySepticShock",
    DeadlyDismemberedArm: "WITCHER.CritWound.Name.DeadlyDismemberedArm",
    DeadlyDismemberedLeg: "WITCHER.CritWound.Name.DeadlyDismemberedLeg",
};

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
