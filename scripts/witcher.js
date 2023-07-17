import WitcherItem from "../module/documents/item.js";
import WitcherActor from "../module/documents/actor.js";
import WitcherItemSheet from "../module/sheets/item-sheet.js";
import WitcherActorSheet from "../module/sheets/actor/actor-sheet.js";
import * as Chat from "../module/utils/chat.js";
import {registerSettings} from "../module/settings.js";
import {preloadHandlebarsTemplates} from "../module/helpers/utils.js";
import {witcher} from "../module/config.js";
import {sum} from "../module/helpers/actor.js";

Hooks.once("init", function () {
    game.witcher = {
        WitcherActor,
        WitcherItem
    }

    console.log("witcher | init system");

    CONFIG.witcher = witcher
    CONFIG.Actor.documentClass = WitcherActor;
    CONFIG.Item.documentClass = WitcherItem;

/*    CONFIG.Actor.systemDataModels.character = WitcherActorData;
    CONFIG.Actor.trackableAttributes = {
        character: {
            bar: ["attributes.hp"],
            value: ["attributes.ac.value"]
        }
    };*/

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("witcher", WitcherItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("witcher", WitcherActorSheet, {makeDefault: true});

    preloadHandlebarsTemplates().then(() => registerSettings());
});

Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    Hooks.on("hotbarDrop", (bar, data, slot) => createWitcherMacro(data, slot));

    if (game.settings.get("witcher", "useWitcherFont")) {
        let els = document.getElementsByClassName("game")
        Array.prototype.forEach.call(els, function (el) {
            if (el) {
                el.classList.add("witcher-style")
            }
        });
        let chat = document.getElementById("chat-log")
        if (chat) {
            chat.classList.add("witcher-style")
        }
    }

    // Override custom effects with HUD effects from the compendium
    if (game.settings.get("witcher", "loadCustomStatusesFromCompendium")) {
        let result = await WitcherItem.prototype.getGameEffects();
        if (result && result.length > 0) {
            CONFIG.statusEffects = result;
        }
    }

    CONFIG.Combat.initiative.formula = game.settings.get("witcher", "displayRollsDetails")
        ? "1d10 + @stats.ref.current[REF]"
        : "1d10 + @stats.ref.current"
});

Hooks.once("dragRuler.ready", (SpeedProvider) => {
    class FictionalGameSystemSpeedProvider extends SpeedProvider {
        get colors() {
            return [
                {id: "walk", default: 0x00FF00, name: "my-module-id.speeds.walk"},
                {id: "dash", default: 0xFFFF00, name: "my-module-id.speeds.dash"},
                {id: "run", default: 0xFF8000, name: "my-module-id.speeds.run"}
            ]
        }

        getRanges(token) {
            let baseSpeed = token.actor.system.stats.spd.current
            // A character can always walk it's base speed and dash twice it's base speed
            let moveSpeed = baseSpeed % 2 === 0 ? baseSpeed : baseSpeed + 1;
            let runSpeed = (baseSpeed * 3) % 2 === 0 ? baseSpeed * 3 : baseSpeed * 3 + 1;
            return [
                {range: moveSpeed, color: "walk"},
                {range: runSpeed, color: "dash"}
            ]
        }
    }

    dragRuler.registerSystem("witcher", FictionalGameSystemSpeedProvider)
})

Hooks.once("polyglot.init", (LanguageProvider) => {
    class FictionalGameSystemLanguageProvider extends LanguageProvider {
        get originalAlphabets() {
            return {
                "common": "130% Thorass",
                "dwarven": "120% Dethek",
                "elder": "150% Espruar",
            };
        }

        get originalTongues() {
            return {
                "_default": "common",
                "common": "common",
                "dwarven": "dwarven",
                "elder": "elder",
            };
        }

        getUserLanguages(actor) {
            let known_languages = new Set();
            let literate_languages = new Set();
            known_languages.add("common")
            if (actor.system.skills.int.eldersp.isProfession || actor.system.skills.int.eldersp.isPickup || actor.system.skills.int.eldersp.isLearned || actor.system.skills.int.eldersp.value > 0) {
                known_languages.add("elder")
            }
            if (actor.system.skills.int.dwarven.isProfession || actor.system.skills.int.dwarven.isPickup || actor.system.skills.int.dwarven.isLearned || actor.system.skills.int.dwarven.value > 0) {
                known_languages.add("dwarven")
            }
            if (actor.system.skills.int.commonsp.isProfession || actor.system.skills.int.commonsp.isPickup || actor.system.skills.int.commonsp.isLearned || actor.system.skills.int.commonsp.value > 0) {
                known_languages.add("common")
            }
            return [known_languages, literate_languages];
        }
    }

    polyglot.registerSystem("witcher", FictionalGameSystemLanguageProvider)
})

Hooks.on("getChatLogEntryContext", Chat.addChatMessageContextOptions);

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createWitcherMacro(data, slot) {
    //todo check
    if (data.type === 'Actor') {
        const actor = game.actors.get(data.id);
        if (!actor) {
            return;
        }
        const command = `game.actors.get('${data.id}')?.sheet.render(true)`;
        let macro =
            game.macros.entities.find(macro => macro.name === actor.name && macro.command === command);

        if (!macro) {
            macro = await Macro.create({
                name: actor.name,
                type: 'script',
                img: actor.system.img,
                command: command
            }, {renderSheet: false});
        }
        await game.user.assignHotbarMacro(macro, slot);
        return false;
    } else if (!("item" in data)) {
        return ui.notifications.warn("You can only create macro buttons for owned Items");
    } else if (data.item.type === 'weapon') {
        const weapon = data.item;
        let foundActor = null
        game.actors.forEach(actor => {
            actor.items.forEach(item => {
                if (weapon._id === item.id) {
                    foundActor = actor
                }
            });
        });
        if (!foundActor) {
            return ui.notifications.warn("You can only create macro buttons with the original character");
        }
        const command = `actor = game.actors.get('${foundActor.id}');actor.rollItem("${weapon._id}")`;
        let macro = game.macros.find(m => (m.name === weapon.name) && (m.command === command));
        if (!macro) {
            macro = await Macro.create({
                name: weapon.name,
                type: "script",
                img: weapon.img,
                command: command,
                flags: {"witcher.itemMacro": true}
            });
        }
        await game.user.assignHotbarMacro(macro, slot);
        return false;
    } else if (data.item.type === 'spell') {
        const spell = data.item;
        let foundActor = null
        game.actors.forEach(actor => {
            actor.items.forEach(item => {
                if (spell._id === item.id) {
                    foundActor = actor
                }
            });
        });
        if (!foundActor) {
            return ui.notifications.warn("You can only create macro buttons with the original character");
        }
        const command = `actor = game.actors.get('${foundActor.id}');actor.rollSpell("${spell._id}")`;
        let macro = game.macros.find(m => (m.name === spell.name) && (m.command === command));
        if (!macro) {
            macro = await Macro.create({
                name: spell.name,
                type: "script",
                img: spell.img,
                command: command,
                flags: {"witcher.itemMacro": true}
            });
        }
        await game.user.assignHotbarMacro(macro, slot);
        return false;
    }
}

Handlebars.registerHelper("getOwnedComponentCount", function (actor, componentName) {
    if (!actor) {
        console.warn("'actor' parameter passed into getOwnedComponentCount is undefined. That might be a problem with one of the selected actors diagrams.");
        return 0;
    }
    return sum(actor.findNeededComponent(componentName));
});

Handlebars.registerHelper("getSetting", function (setting) {
    return game.settings.get("witcher", setting);
});

Handlebars.registerHelper("window", function (...props) {
    props.pop();
    return props.reduce((result, prop) => result[prop], window);
});

Handlebars.registerHelper("includes", function (csv, substr) {
    return csv.split(",").map(v => v.trim()).includes(substr);
});
