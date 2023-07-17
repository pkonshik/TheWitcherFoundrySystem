import {witcher} from "../config.js";
import {extendedRoll} from "../utils/chat.js";
import {RollConfig} from "../rollConfig.js";
import WitcherActor from "./actor.js";

export default class WitcherItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    prepareData() {
        super.prepareData();
    }

    /**
     * Checks whether item is of specific type and/or has the specific name
     * @param {witcher.itemTypes|ItemType} type
     * @param {string=} itemName
     * @return {boolean}
     */
    isOfType(type, itemName) {
        return itemName
            ? this.type === type.name && type.isItem && this.name === itemName
            : this.type === type.name && type.isItem
    };

    /**
     * Checks whether item is of specific system type and/or has the specific name
     * @param {witcher.itemTypes|ItemType|ArmorType} type
     * @param {string=} itemName
     * @return {boolean}
     */
    isOfSystemType(type, itemName) {
        return itemName
            ? this.system.type === type.name && type.isSystem && this.name === itemName
            : this.system.type === type.name && type.isSystem
    };

    /**
     * Checks whether item is a substance of specific type and/or has specific label name
     * @param {witcher.substanceTypes|SubstanceType} type
     * @param {string=} localizedComponentName
     * @returns {boolean}
     */
    isOfSubstanceType(type, localizedComponentName) {
        return (localizedComponentName)
            ? this.system.substanceType === type.name && type.label === localizedComponentName
            : this.system.substanceType === type.name
    }

    /**
     * Checks whether item is applied
     * @return {boolean}
     */
    isApplied() {
        return this.system.applied
    }

    /**
     * Checks whether item is equipped
     * @return {boolean}
     */
    isEquipped() {
        return this.system.equipped
            || this.system.equipped === "checked"
            || this.system.equiped
            || this.system.equiped === "checked"
    }

    /**
     * Checks magic skills by level
     * @param {witcher.magicLevels|MagicLevel} magicLevel
     * @return {boolean}
     */
    isOfMagicByLevel(magicLevel) {
        // todo check
        return this.system.level === magicLevel.name
            && (this.isOfMagicType(witcher.magicTypes.spells)
                || this.isOfMagicType(witcher.magicTypes.invocations)
                || this.isOfMagicType(witcher.magicTypes.witcherSigns)
                || this.isOfMagicType(witcher.magicTypes.rituals)
                || this.isOfMagicType(witcher.magicTypes.hexes)
                || this.isOfMagicType(witcher.magicTypes.magicalGift)
            )
    }

    /**
     * Check whether magic is of type
     * @param {witcher.magicTypes|MagicType} type
     * @return {boolean}
     */
    isOfMagicType(type) {
        return this.system.class === type.name
    }

    /**
     * Check whether location is of type
     * @param {witcher.locations|LocationType} type
     * @return {boolean}
     */
    isOfLocation(type) {
        return this.system.location === type.name
    }

    /**
     * Create visual effect for the spell with help of the magic fx for the specified template
     * @param token
     * @return {Promise<void>}
     */
    async createSpellVisualEffectIfApplicable(token) {
        if (this.type === "spell" && token
            && this.system.createTemplate
            && this.system.templateType
            && this.system.templateSize) {

            token = token.document ? token : token._object
            // todo need to  create some property indicating the initial rotation of the token
            // token can be classic south oriented or user avatar which may look to the different direction
            let tokenRotation = 0

            // Prepare template data
            const templateData = {
                t: this.system.templateType,
                user: game.user.id,
                distance: this.system.templateSize,
                direction: token.document.rotation - tokenRotation,
                x: token.center.x,
                y: token.center.y,
                fillColor: game.user.color,
                flags: this.getSpellFlags()
            };

            switch (this.system.templateType) {
                case "rect":
                    templateData.distance = Math.hypot(this.system.templateSize, this.system.templateSize);
                    templateData.width = this.system.templateSize;
                    templateData.direction = 45;
                    //distance = Math.hypot(Number(this.system.templateSize))
                    //width = token?.target?.value ?? width
                    break;
                case "cone":
                    templateData.angle = 45;
                    break;
                case "ray":
                    templateData.width = 1;
                    break;
            }

            let effect = await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [templateData], {keepId: true});

            let effectObject = {id: effect[0]._id, dur: this.system?.visualEffectDuration || 0}
            if (!this.visualEffectIds) {
                this.visualEffectIds = [effectObject]
            } else {
                this.visualEffectIds.push(effectObject)
            }
        }
    }

    //todo check
    /**
     * Perform deletion of visual spell effects created with magic fx
     * @return {Promise<void>}
     */
    async deleteSpellVisualEffect() {
        if (this.visualEffectIds && this.visualEffectIds.length > 0) {
            this.visualEffectIds.forEach(e => {
                setTimeout(() => {
                    canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [e.id])
                }, e.dur * 1000);
            })
        }
    }

    //todo refactor
    getItemAttackSkill() {
        let alias = "";
        switch (this.system.attackSkill) {
            case "Brawling":
                alias = game.i18n.localize("WITCHER.SkRefBrawling")
                break;
            case "Melee":
                alias = game.i18n.localize("WITCHER.SkRefMelee");
                break;
            case "Small Blades":
                alias = game.i18n.localize("WITCHER.SkRefSmall");
                break;
            case "Staff/Spear":
                alias = game.i18n.localize("WITCHER.SkRefStaff");
                break;
            case "Swordsmanship":
                alias = game.i18n.localize("WITCHER.SkRefSwordsmanship");
                break;
            case "Archery":
                alias = game.i18n.localize("WITCHER.SkDexArchery");
                break;
            case "Athletics":
                alias = game.i18n.localize("WITCHER.SkDexAthletics");
                break;
            case "Crossbow":
                alias = game.i18n.localize("WITCHER.SkDexCrossbow");
                break;
            default:
                break;
        }

        return {
            "name": this.system.attackSkill,
            "alias": alias
        };
    }

    getAttackSkillFlags() {
        return {
            "witcher": {"origin": {"name": this.name}},
            "attackSkill": this.system.attackSkill,
            "item": this,
        }
    }

    getSpellFlags() {
        return {
            "witcher": {"origin": {"name": this.name}},
            "spell": this,
            "item": this,
        }
    }

    /**
     * Checks whether weapon item requires melee skill to perform an attack
     * @return {boolean}
     */
    doesWeaponNeedMeleeSkillToAttack() {
        if (this.system.attackSkill) {
            //Check whether item attack skill is melee
            //Since actor can throw bombs relying on Athletic which is also a melee attack skill
            //We need specific logic for bomb throws
            let meleeSkill = witcher.meleeSkills.includes(this.system.attackSkill)
            let rangedSkill = witcher.rangedSkills.includes(this.system.attackSkill)

            if (meleeSkill && rangedSkill) {
                return meleeSkill && !this.system.usingAmmo && !this.system.isThrowable;
            } else {
                return meleeSkill;
            }
        }
    }

    isAlchemicalCraft() {
        return this.system.alchemyDC && this.system.alchemyDC > 0;
    }

    isWeaponThrowable() {
        return this.system.isThrowable;
    }

    /**
     * Populate list of alchemy craft components
     * @return {alchemyComponent[]}
     */
    populateAlchemyCraftComponentsList() {
        export class alchemyComponent {
            name = "";
            alias = "";
            content = "";
            quantity = 0;

            constructor(name, alias, content, quantity) {
                this.name = name;
                this.alias = alias;
                this.content = content;
                this.quantity = quantity;
            }
        }

        /**
         * @type {alchemyComponent[]}
         */
        let alchemyCraftComponents = [];
        witcher.substanceTypes.forEach(s => {
            alchemyCraftComponents.push(
                new alchemyComponent(
                    s.name,
                    game.i18n.localize(s.label),
                    `<img src="systems/witcher/assets/images/${s.name}.png" class="substance-img" /> <b>${this.system.alchemyComponents[s.name]}</b>`,
                    this.system.alchemyComponents[s.name] > 0 ? this.system.alchemyComponents[s.name] : 0
                )
            )
        })

        this.system.alchemyCraftComponents = alchemyCraftComponents;
        return alchemyCraftComponents;
    }

    /**
     * @param {string} rollFormula
     * @param {*} messageData
     * @param {RollConfig} config
     */
    async realCraft(rollFormula, messageData, config) {
        //we want to show message to the chat only after removal of items from inventory
        config.showResult = false

        //added crit rolls for craft & alchemy
        let roll = await extendedRoll(rollFormula, messageData, config)

        //Check whether formula/diagram owner is a Craftsman
        let crafter = WitcherActor.constructor(this.actor)
        if (!crafter.system.capabilieies.craft) {
            return ui.notifications.error(`${crafter.name} ${game.i18n.localize("WITCHER.Actor.Capabilities.Spells.Error")}`);
        } else {
            ui.notifications.info(`${crafter.name} ${game.i18n.localize("WITCHER.Actor.Capabilities.Craft")}`);
        }

        messageData.flavor += `<label><b> ${crafter.name}</b></label><br/>`;

        let result = roll.total > config.threshold;
        let craftedItemName;
        if (this.system.associatedItem && this.system.associatedItem.name) {
            let craftingComponents = this.isAlchemicalCraft()
                ? this.system.alchemyCraftComponents.filter(c => Number(c.quantity) > 0)
                : this.system.craftingComponents.filter(c => Number(c.quantity) > 0);

            craftingComponents.forEach(c => {
                let componentsToDelete = this.isAlchemicalCraft()
                    ? crafter.getSubstance(c)
                    : crafter.findNeededComponent(c.name);

                let componentsCountToDelete = Number(c.quantity);
                let componentsLeftToDelete = componentsCountToDelete;
                let componentsCountDeleted = 0;

                componentsToDelete.forEach(toDelete => {
                    let toDeleteCount = Math.min(Number(toDelete.system.quantity), componentsCountToDelete, componentsLeftToDelete);
                    if (toDeleteCount <= 0) {
                        return ui.notifications.info(`${game.i18n.localize("WITCHER.craft.SkipRemovalOfComponent")}: ${toDelete.name}`);
                    }

                    if (componentsCountDeleted < componentsCountToDelete) {
                        crafter.removeItem(toDelete._id, toDeleteCount)
                        componentsCountDeleted += toDeleteCount;
                        componentsLeftToDelete -= toDeleteCount;
                        return ui.notifications.info(`${toDeleteCount} ${toDelete.name} ${game.i18n.localize("WITCHER.craft.ItemsSuccessfullyDeleted")} ${crafter.name}`);
                    }
                });

                if (componentsCountDeleted !== componentsCountToDelete || componentsLeftToDelete !== 0) {
                    result = false;
                    return ui.notifications.error(game.i18n.localize("WITCHER.err.CraftItemDeletion"));
                }
            });

            if (result) {
                let craftedItem = {...this.system.associatedItem};
                Item.create(craftedItem, {parent: crafter});
                craftedItemName = craftedItem.name;
            }
        } else {
            craftedItemName = game.i18n.localize("WITCHER.craft.SuccessfulCraftForNothing");
        }

        messageData.flavor += `<b>${craftedItemName}</b>`;
        await roll.toMessage(messageData);
    }

    /**
     * Get set of custom effects from compendium in order to use them in the HUD
     * @return {Promise<*[]|boolean>}
     */
    async getGameEffects() {
        // search for the compendium pack in the world roll tables by name of the generator
        const effectPacks = game.packs
            .filter(p => p.metadata.type === "Item")
            // Haven't found and easy and proper way of filtering compendiums by different fields
            // than _id, img, folder, name, sort, type
            // So now I see 2 ways of filtering effects with eligible HUD candidates:
            // 1 - Implement new type for the effects rather than keep them in WitcherItem - this will cause massive code rewriting
            // 2 - Open compendiums with effects, load data from them and filter collections one by one. - this is the easiest ways
            // If you know other simpler approach - feel free to modify
            .filter(c => c.index.find(r => r.type === "effect"))

        if (!effectPacks || effectPacks.length === 0) {
            // Provided world does not have associated active HUD effects
            // We should use embedded HUD statuses
            return false
        } else {
            let effectsWithHUDEnabled = []

            for (const ep of effectPacks) {
                let effects = await ep.getDocuments({type: "effect"});
                let r = effects.filter(e => e.system.isActive && e.system.isHUD).flatMap(e => ({
                    id: "@Compendium[" + e.pack + "." + e._id + "]",
                    name: e.name,
                    description: "@Compendium[" + e.pack + "." + e._id + "] - " + e.system.description,
                    label: e.name,
                    icon: e.img
                }));
                if (r && r.length > 0) {
                    effectsWithHUDEnabled = effectsWithHUDEnabled.concat(r);
                }
            }

            return effectsWithHUDEnabled
        }
    }

    /**
     * Checks whether we generated item with the help of the roll table
     * If so - generate an item with the specified quantity
     * @param {number} newQuantity
     * @return {Promise<*[]|boolean>}
     */
    async generateRandomItemFromRollTable(newQuantity) {
        //todo test
        if (this.actor.type !== "loot") {
            return ui.notifications.error(`${game.i18n.localize("WITCHER.Loot.IncorrectClass")}`)
        }

        // search for the compendium pack in the world roll tables by name of the generator
        const compendiumPack = game.packs
            .filter(p => p.metadata.type === "RollTable")
            .filter(c => c.index.find(r => r.name === this.name))

        if (!compendiumPack || compendiumPack.length === 0) {
            // Provided item does not have associated roll table
            // this item should appear in loot sheet as is
            return false
        } else if (compendiumPack.length === 1) {
            // get id of the needed table generator in the compendium pack
            const tableId = compendiumPack[0].index.getName(this.name)._id

            for (let i = 0; i < newQuantity; i++) {
                let roll = await compendiumPack[0].getDocument(tableId).then(el => el.roll())
                let res = roll.results[0]
                let pack = game.packs.get(res.documentCollection)
                await pack.getIndex();
                let genItem = await pack.getDocument(res.documentId)

                if (!genItem) {
                    return ui.notifications.error(`${game.i18n.localize("WITCHER.Monster.exportLootExtInvalidItemError")}`)
                }

                // add generated item to the loot sheet
                let itemInLoot = this.actor.items.find(i => i.name === genItem.name && i.type === genItem.type)
                if (!itemInLoot) {
                    await Item.create(genItem, {parent: this.actor})
                } else {
                    // if we have already generated item in the loot sheet - increase its count instead of creation
                    let itemToUpdate = itemInLoot[0] ? itemInLoot[0] : itemInLoot
                    let itemToUpdateCount = itemToUpdate.system.quantity
                    itemToUpdate.update({'system.quantity': ++itemToUpdateCount})
                }

                let successMessage = `${game.i18n.localize("WITCHER.Monster.exportLootExtGenerated")}: ${genItem.name}`
                ui.notifications.info(`${successMessage}`)

                //whisper info about generated items from the roll table
                let chatData = {
                    user: game.user._id,
                    content: `${successMessage} ${res.getChatText()}`,
                    whisper: game.users.filter(u => u.isGM).map(u => u._id)
                };
                ChatMessage.create(chatData, {});
            }

            // remove basic item from the loot sheet
            // this item used for generation the actual item from the roll table
            await this.actor.items.get(this.id).delete()

            return true
        } else {
            return ui.notifications.error(`${game.i18n.localize("WITCHER.Monster.exportLootExtToManyRollTablesError")}`)
        }
    }
}
