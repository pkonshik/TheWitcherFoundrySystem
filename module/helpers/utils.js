/**
 * Define a set of template paths to preload. Preloaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name
 * (e.g. "dnd5e.actor-traits").
 * @returns {Promise}
 */
export async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/witcher/templates/sheets/actor/character-sheet.html",
        "systems/witcher/templates/sheets/actor/monster-sheet.html",
        "systems/witcher/templates/sheets/actor/loot-sheet.html",
        "systems/witcher/templates/partials/character-header.html",
        "systems/witcher/templates/partials/tab-skills.html",
        "systems/witcher/templates/partials/tab-profession.html",
        "systems/witcher/templates/partials/tab-background.html",
        "systems/witcher/templates/partials/tab-inventory.html",
        "systems/witcher/templates/partials/tab-inventory-diagrams.html",
        "systems/witcher/templates/partials/tab-inventory-valuables.html",
        "systems/witcher/templates/partials/tab-inventory-mounts.html",
        "systems/witcher/templates/partials/tab-inventory-runes-glyphs.html",
        "systems/witcher/templates/partials/tab-magic.html",
        "systems/witcher/templates/partials/crit-wounds-table.html",
        "systems/witcher/templates/partials/substances.html",
        "systems/witcher/templates/partials/monster-skill-tab.html",
        "systems/witcher/templates/partials/monster-inventory-tab.html",
        "systems/witcher/templates/partials/monster-details-tab.html",
        "systems/witcher/templates/partials/monster-spell-tab.html",
        "systems/witcher/templates/partials/skill-display.html",
        "systems/witcher/templates/partials/monster-skill-display.html",
        "systems/witcher/templates/partials/loot-item-display.html",
        "systems/witcher/templates/partials/item-header.html",
        "systems/witcher/templates/partials/item-image.html",
        "systems/witcher/templates/partials/associated-item.html",
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

