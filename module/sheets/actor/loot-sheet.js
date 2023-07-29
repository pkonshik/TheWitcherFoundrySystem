import WitcherActorSheet from "./actor-sheet.js";
import {witcher} from "../../config.js";

export class WitcherLootSheet extends WitcherActorSheet {

    /**
     * Organize and classify Items for Loot sheet.
     * @param {Object} context The loot to prepare.
     * @return {undefined}
     */
    _prepareItems(context) {
        /**
         * @type {WitcherItem[]}
         */
        let items = context.items;

        context.loots = items.filter(i => i.type === witcher.itemTypes.component ||
            i.type === witcher.itemTypes.craftingMaterial ||
            i.type === witcher.itemTypes.enhancement ||
            i.type === witcher.itemTypes.valuable ||
            i.type === witcher.itemTypes.animalParts ||
            i.type === witcher.itemTypes.diagrams ||
            i.type === witcher.itemTypes.armor ||
            i.type === witcher.itemTypes.alchemical ||
            i.type === witcher.itemTypes.enhancement ||
            i.type === witcher.itemTypes.mutagen);
    }
}
