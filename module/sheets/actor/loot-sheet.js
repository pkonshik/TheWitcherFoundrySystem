import WitcherActorSheet from "./actor-sheet.js";
import {witcher} from "../../config.js";

export default class WitcherLootSheet extends WitcherActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["witcher", "sheet", "actor", "loot"],
            width: 1120,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
        });
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }
}
