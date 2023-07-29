/**
 * Define a set of template paths to preload. Preloaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name
 * (e.g. "dnd5e.actor-traits").
 * @returns {Promise}
 */
export async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/witcher/templates/partials/actor/character-header.html",

        "systems/witcher/templates/sheets/actor/character-sheet.html",
        "systems/witcher/templates/sheets/actor/monster-sheet.html",
        "systems/witcher/templates/sheets/actor/loot-sheet.html",

        "systems/witcher/templates/partials/tab-skills.html",

        "systems/witcher/templates/partials/tab-profession.html",
        "systems/witcher/templates/partials/profession/profession.html",
        "systems/witcher/templates/partials/profession/race.html",

        /** tab inventory */
        "systems/witcher/templates/partials/tab-inventory.html",
        "systems/witcher/templates/partials/actor/inventory/currency-section.html",
        "systems/witcher/templates/partials/actor/inventory/weapon-section.html",
        "systems/witcher/templates/partials/actor/inventory/armor-section.html",
        "systems/witcher/templates/partials/actor/inventory/valuable-section.html",
        "systems/witcher/templates/partials/actor/inventory/alchemy-section.html",
        "systems/witcher/templates/partials/actor/inventory/substances-section.html",
        "systems/witcher/templates/partials/actor/inventory/crafting-section.html",
        "systems/witcher/templates/partials/actor/inventory/runes-section.html",

        "systems/witcher/templates/partials/actor/inventory/diagram-block.html",
        "systems/witcher/templates/partials/actor/inventory/valuable-block.html",
        "systems/witcher/templates/partials/actor/inventory/mount-block.html",
        "systems/witcher/templates/partials/actor/inventory/rune-glyph-block.html",

        "systems/witcher/templates/partials/tab-magic.html",
        "systems/witcher/templates/partials/actor/magic/actor-magic-novice.html",
        "systems/witcher/templates/partials/actor/magic/actor-magic-journeyman.html",
        "systems/witcher/templates/partials/actor/magic/actor-magic-master.html",
        "systems/witcher/templates/partials/actor/magic/actor-magic-info.html",
        "systems/witcher/templates/partials/actor/magic/actor-magic-rituals.html",
        "systems/witcher/templates/partials/actor/magic/actor-magic-hexes.html",
        "systems/witcher/templates/partials/actor/magic/actor-magic-gift.html",

        "systems/witcher/templates/partials/tab-background.html",
        "systems/witcher/templates/partials/actor/background/background-info.html",
        "systems/witcher/templates/partials/actor/background/crit-wounds-table.html",
        "systems/witcher/templates/partials/actor/background/active-effects-table.html",
        "systems/witcher/templates/partials/actor/background/life-events.html",

        "systems/witcher/templates/partials/monster-skill-tab.html",

        "systems/witcher/templates/partials/monster-inventory-tab.html",
        "systems/witcher/templates/partials/monster-details-tab.html",
        "systems/witcher/templates/partials/monster-spell-tab.html",
        "systems/witcher/templates/partials/actor/inventory/skill-block.html",
        "systems/witcher/templates/partials/monster-skill-display.html",
        "systems/witcher/templates/partials/item/loot-item-display.html",

        "systems/witcher/templates/partials/item/item-header.html",
        "systems/witcher/templates/partials/item/spell-header.html",
        "systems/witcher/templates/partials/item/non-spell-header.html",
        "systems/witcher/templates/partials/item/item-image.html",

        "systems/witcher/templates/partials/item/associated-item.html",
        "systems/witcher/templates/sheets/verbal-combat.html",
        "systems/witcher/templates/sheets/weapon-attack.html"
    ];

    return loadTemplates(templatePaths);
}

export function genId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).slice(2, 11);
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1)) + 1;
}

export function addModifiersToFormula(modifiers, formula) {
    let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")
    modifiers.forEach(item => {
        if (item.value < 0) {
            formula += !displayRollDetails
                ? `${item.value}`
                : `${item.value}[${item.name}]`
        }
        if (item.value > 0) {
            formula += !displayRollDetails
                ? `+${item.value}`
                : `+${item.value}[${item.name}]`
        }
    });
    return formula;
}

/**
 * Prepare systemRef in format system.<value>.<postfix>
 * @param {string} value
 * @param {string=} postfix
 * @return {string}
 */
export function prepareSystemRef(value, postfix) {
    return postfix
        ? "system." + value + "." + postfix
        : "system." + value
}
