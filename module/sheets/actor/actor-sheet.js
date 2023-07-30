import {buttonDialog, extendedRoll, rollDamage} from "../../utils/chat.js";
import {witcher} from "../../config.js";
import {RollConfig} from "../../rollConfig.js";

import {ExecuteDefence} from "../../utils/actions.js";
import {cost, currencyWeight, getValueByStringPath, sanitizeDescription, sum, weight} from "../../helpers/actor.js";
import {addModifiersToFormula, genId, prepareSystemRef} from "../../helpers/utils.js";

export default class WitcherActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["witcher", "sheet", "actor"],
            width: 1120,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
        });
    }

    /** @override */
    get template() {
        return `systems/witcher/templates/sheets/actor/${this.actor.type}-sheet.html`;
    }

    /** @override */
    async getData(options) {
        const context = super.getData(options);
        const actorData = this.actor.toObject(false);

        context.system = actorData.system
        context.flags = actorData.flags;
        context.config = CONFIG.witcher

        context.useAdrenaline = game.settings.get("witcher", "useOptionalAdrenaline")
        context.displayRollDetails = game.settings.get("witcher", "displayRollsDetails")
        context.useVerbalCombat = game.settings.get("witcher", "useOptionalVerbalCombat")
        context.displayRep = game.settings.get("witcher", "displayRep")

        context.maxWeight = context.system.maxWeight ?? 100

        // Prepare character data and items.
        if (actorData.type === 'character' || actorData.type === "monster") {
            this._prepareMagic(context);
        }

        this._prepareCommonActorData(context);
        this._prepareItems(context);

        if (actorData.type === 'character') {
            this._prepareCharacterData(context);
        }

        // Add roll data for TinyMCE editors.
        context.rollData = context.actor.getRollData();

        if (!actorData.system.panels) {
            this.actor.update({'system.panels': {}});
        }
        context.isGM = game.user.isGM
        return context;
    }

    /**
     * Organize and classify Common actors data
     * @param context
     * @private
     */
    _prepareCommonActorData(context) {
        let actor = context.actor;

        const IT = witcher.itemTypes;
        context.notes = actor.getListByType(IT.note);

        context.currency = actor.system.currency
        context.totalWeight = weight(context.items) + currencyWeight(context.currency);
        context.totalCost = cost(context.items);
    }

    /**
     * Organize and classify Spells for Actor sheets
     * @param context
     * @private
     */
    _prepareMagic(context) {
        let actor = context.actor;
        const IT = witcher.itemTypes;

        context.activeEffects = actor.getListByType(IT.effect).filter(e => e.system.isActive);

        // Spell section
        context.spells = actor.getListByType(IT.spell);
        context.noviceSpells = context.spells.filter(s => s.isOfMagicByLevel(witcher.magicLevels.novice));
        context.journeymanSpells = context.spells.filter(s => s.isOfMagicByLevel(witcher.magicLevels.journeyman));
        context.masterSpells = context.spells.filter(s => s.isOfMagicByLevel(witcher.magicLevels.master));
        context.invocations = context.spells.filter(s => s.isOfMagicType(witcher.magicTypes.invocations))
        context.witcherSigns = context.spells.filter(s => s.isOfMagicType(witcher.magicTypes.witcherSigns))
        context.rituals = context.spells.filter(s => s.isOfMagicType(witcher.magicTypes.rituals));
        context.hexes = context.spells.filter(s => s.isOfMagicType(witcher.magicTypes.hexes));
        context.magicalgift = context.spells.filter(s => s.isOfMagicType(witcher.magicTypes.magicalGift));
    }

    /**
     * Organize and classify Items for Actor sheets.
     * @param {Object} context The actor to prepare.
     * @return {undefined}
     */
    _prepareItems(context) {
        let actor = context.actor;
        let items = context.actor.items;

        const IT = witcher.itemTypes;

        context.items = items

        // Weapon section
        context.weapons = actor.getListByType(IT.weapon);
        context.weapons.forEach((weapon) => {
            if (weapon.system.enhancements > 0
                && weapon.system.enhancements !== weapon.system.enhancementItems.length) {

                let newEnhancementList = []
                for (let i = 0; i < weapon.system.enhancements; i++) {
                    let element = weapon.system.enhancementItems[i]
                    if (element && JSON.stringify(element) !== '{}') {
                        newEnhancementList.push(element)
                    } else {
                        newEnhancementList.push({})
                    }
                }

                let item = actor.items.get(weapon._id);
                item.update({'system.enhancementItems': newEnhancementList})
            }
        });

        // Armor section
        context.armors = items.filter(i => i.isOfType(IT.armor)
            || (i.isOfType(IT.enhancement) && i.isOfSystemType(IT.armor) && !i.isApplied())
        );
        context.armors.forEach((armor) => {
            if (armor.system.enhancements > 0
                && armor.system.enhancements !== armor.system.enhancementItems.length) {

                let newEnhancementList = []
                for (let i = 0; i < armor.system.enhancements; i++) {
                    let element = armor.system.enhancementItems[i]
                    if (element && JSON.stringify(element) !== '{}') {
                        newEnhancementList.push(element)
                    } else {
                        newEnhancementList.push({})
                    }
                }
                let item = actor.items.get(armor._id);
                item.update({'system.enhancementItems': newEnhancementList})
            }
        });

        // Crafting section
        const allComponents = actor.getListByType(IT.component);
        context.allComponents = allComponents;
        context.craftingMaterials = allComponents.filter(i => i.isOfSystemType(IT.craftingMaterial) || i.isOfSystemType(IT.component));
        context.ingotsAndMinerals = allComponents.filter(i => i.isOfSystemType(IT.minerals));
        context.hidesAndAnimalParts = allComponents.filter(i => i.isOfSystemType(IT.animalParts));
        const enhancements = items.filter(i => i.isOfType(IT.enhancement) && !i.isOfSystemType(IT.armor) && !i.isApplied());
        context.enhancements = enhancements;

        // Valuables section
        const valuables = actor.getListByType(IT.valuable);
        context.valuables = valuables;
        context.clothingAndContainers = valuables.filter(i => i.isOfSystemType(IT.clothing) || i.isOfSystemType(IT.containers));
        context.general = valuables.filter(i => i.isOfSystemType(IT.genera) || !i.system.type);
        context.foodAndDrinks = valuables.filter(i => i.isOfSystemType(IT.foodDrink));
        context.toolkits = valuables.filter(i => i.isOfSystemType(IT.toolkit));
        context.questItems = valuables.filter(i => i.isOfSystemType(IT.questItem));
        context.mounts = actor.getListByType(IT.mount);
        context.mountAccessories = items.filter(i => i.isOfType(IT.valuable) && i.isOfSystemType(IT.mountAccessories));
        context.runeItems = enhancements.filter(e => e.isOfSystemType(IT.rune));
        context.glyphItems = enhancements.filter(e => e.isOfSystemType(IT.glyph));

        // Alchemy section
        context.alchemicalItems = items.filter(i => (i.isOfType(IT.valuable) && i.isOfSystemType(IT.alchemicalItem))
            || (i.isOfType(IT.alchemical) && i.isOfSystemType(IT.alchemical)));
        context.witcherPotions = items.filter(i => i.isOfType(IT.alchemical)
            && (i.isOfSystemType(IT.decoction) || i.isOfSystemType(IT.potion)));
        context.oils = items.filter(i => i.isOfType(IT.alchemical) && i.isOfSystemType(IT.oil));
        context.alchemicalTreatments = items.filter(i => i.isOfType(IT.component) && i.isOfSystemType(IT.alchemical));
        context.mutagens = actor.getListByType(IT.mutagen);

        // Formula section
        const diagrams = actor.getListByType(IT.diagrams);
        context.diagrams = diagrams;
        context.alchemicalItemDiagrams = diagrams.filter(d => d.isOfSystemType(IT.alchemical) || !d.system.type).map(sanitizeDescription);
        context.potionDiagrams = diagrams.filter(d => d.isOfSystemType(IT.potion)).map(sanitizeDescription);
        context.decoctionDiagrams = diagrams.filter(d => d.isOfSystemType(IT.decoction)).map(sanitizeDescription);
        context.oilDiagrams = diagrams.filter(d => d.isOfSystemType(IT.oil)).map(sanitizeDescription);

        // Diagrams section
        context.ingredientDiagrams = diagrams.filter(d => d.isOfSystemType(IT.ingredients)).map(sanitizeDescription);
        context.weaponDiagrams = diagrams.filter(d => d.isOfSystemType(IT.weapon)).map(sanitizeDescription);
        context.armorDiagrams = diagrams.filter(d => d.isOfSystemType(IT.armor)).map(sanitizeDescription);
        context.elderfolkWeaponDiagrams = diagrams.filter(d => d.isOfSystemType(IT.armorEnhancement)).map(sanitizeDescription);
        context.elderfolkArmorDiagrams = diagrams.filter(d => d.isOfSystemType(IT.elderfolkWeapon)).map(sanitizeDescription);
        context.ammunitionDiagrams = diagrams.filter(d => d.isOfSystemType(IT.ammunition)).map(sanitizeDescription);
        context.bombDiagrams = diagrams.filter(d => d.isOfSystemType(IT.bomb)).map(sanitizeDescription);
        context.trapDiagrams = diagrams.filter(d => d.isOfSystemType(IT.traps)).map(sanitizeDescription);

        context.substancesVitriol = actor.getSubstance(witcher.substanceTypes.vitriol);
        context.vitriolCount = sum(context.substancesVitriol)
        context.substancesRebis = actor.getSubstance(witcher.substanceTypes.rebis);
        context.rebisCount = sum(context.substancesRebis);
        context.substancesAether = actor.getSubstance(witcher.substanceTypes.aether);
        context.aetherCount = sum(context.substancesAether);
        context.substancesQuebrith = actor.getSubstance(witcher.substanceTypes.quebrith);
        context.quebrithCount = sum(context.substancesQuebrith);
        context.substancesHydragenum = actor.getSubstance(witcher.substanceTypes.hydragenum);
        context.hydragenumCount = sum(context.substancesHydragenum);
        context.substancesVermilion = actor.getSubstance(witcher.substanceTypes.vermilion);
        context.vermilionCount = sum(context.substancesVermilion);
        context.substancesSol = actor.getSubstance(witcher.substanceTypes.sol);
        context.solCount = sum(context.substancesSol);
        context.substancesCaelum = actor.getSubstance(witcher.substanceTypes.caelum);
        context.caelumCount = sum(context.substancesCaelum);
        context.substancesFulgur = actor.getSubstance(witcher.substanceTypes.fulgur);
        context.fulgurCount = sum(context.substancesFulgur);
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor;

        // Recalculate derived data
        html.find("input.stat-max, .hp-value").on("change", actor.prepareDerivedData.bind(this.actor));

        html.find(".inline-edit").change(this._onInlineEdit.bind(this));
        html.find(".spell-display").on("click", this._onSpellDisplay.bind(this));
        html.find(".derived-modifier-display").on("click", this._onDerivedModifierDisplay.bind(this));

        // Item Listeners
        html.find(".add-item").on("click", this._onAddItem.bind(this));
        html.find(".edit-item").on("click", this._onEditItem.bind(this));
        html.find(".delete-item").on("click", this._onDeleteItem.bind(this));
        html.find(".show-item").on("click", this._onShowItem.bind(this));

        html.find(".buy-item").on("click", this._onBuyItem.bind(this));
        html.find(".hide-item").on("click", this._onHideItem.bind(this));

        html.find(".display-weapon").on("click", this._onDisplayItemInfo.bind(this));
        html.find(".display-armor").on("click", this._onDisplayItemInfo.bind(this));
        html.find(".display-valuable").on("click", this._onDisplayItemInfo.bind(this));
        html.find(".display-spell").on("click", this._onDisplayItemInfo.bind(this));
        html.find(".display-substance").on("click", this._onSubstanceDisplay.bind(this));

        // Skill modifier listeners
        html.find(".add-skill-modifier").on("click", this._onAddSkillModifier.bind(this));
        html.find(".edit-skill-modifier").on("blur", this._onEditSkillModifier.bind(this));
        html.find(".delete-skill-modifier").on("click", this._onRemoveSkillModifier.bind(this));
        html.find(".display-skill-modifier").on("click", this._onDisplaySkillModifier.bind(this));

        // Modifier listeners
        html.find(".add-modifier").on("click", this._onAddModifier.bind(this));
        html.find(".edit-modifier").on("blur", this._onEditModifier.bind(this));
        html.find(".delete-modifier").on("click", this._onRemoveModifier.bind(this));
        html.find(".display-modifier").on("click", this._onDisplayModifier.bind(this));

        // Effects section
        html.find(".add-crit").on("click", this._onAddCrit.bind(this));
        html.find(".delete-crit").on("click", this._onRemoveCrit.bind(this));
        html.find(".add-active-effect").on("click", this._onAddActiveEffect.bind(this));

        html.find(".item-roll").on("click", this._onItemRoll.bind(this));
        html.find(".init-roll").on("click", this._onInitRoll.bind(this));
        html.find(".crit-roll").on("click", this._onCritRoll.bind(this));
        html.find(".defence-roll").on("click", this._onDefenceRoll.bind(this));
        html.find(".verbal-button").on("click", this._onVerbalCombat.bind(this));

        html.find(".stat-roll").on("click", this._onStatSaveRoll.bind(this));
        html.find(".spell-roll").on("click", this._onSpellRoll.bind(this));

        // Death saves section
        html.find(".death-minus").on("click", this._removeDeathSaves.bind(this));
        html.find(".death-plus").on("click", this._addDeathSaves.bind(this));
        html.find(".death-roll").on("click", this._onDeathSaveRoll.bind(this));

        html.find("input").focusin(ev => this._onFocusIn(ev));

        let ST = witcher.stats;
        let INT = witcher.intSkills;
        let REF = witcher.refSkills;
        let DEX = witcher.dexSkills;
        let BODY = witcher.bodySkills;
        let EMP = witcher.empSkills;
        let CRA = witcher.empSkills;
        let WILL = witcher.willSkills;

        //int skills
        html.find("#awareness-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.awareness)
        });
        html.find("#business-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.business)
        });
        html.find("#deduction-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.deduction)
        });
        html.find("#education-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.education)
        });
        html.find("#commonsp-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.commonSpeech)
        });
        html.find("#eldersp-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.elderSpeech)
        });
        html.find("#dwarven-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.dwarvenSpeech)
        });
        html.find("#monster-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.monster)
        });
        html.find("#socialetq-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.socialEtq)
        });
        html.find("#streetwise-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.streetwise)
        });
        html.find("#tactics-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.tactics)
        });
        html.find("#teaching-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.teaching)
        });
        html.find("#wilderness-rollable").on("click", () => {
            actor.rollSkillCheck(ST.int, INT.wilderness)
        });

        //ref skills
        html.find("#brawling-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.brawling)
        });
        html.find("#dodge-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.dodge)
        });
        html.find("#melee-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.melee)
        });
        html.find("#riding-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.riding)
        });
        html.find("#sailing-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.sailing)
        });
        html.find("#smallblades-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.smallBlades)
        });
        html.find("#staffspear-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.staffSpear)
        });
        html.find("#swordsmanship-rollable").on("click", () => {
            actor.rollSkillCheck(ST.ref, REF.swordsmanship)
        });

        //dex skills
        html.find("#archery-rollable").on("click", () => {
            actor.rollSkillCheck(ST.dex, DEX.archery)
        });
        html.find("#athletics-rollable").on("click", () => {
            actor.rollSkillCheck(ST.dex, DEX.athletics)
        });
        html.find("#crossbow-rollable").on("click", () => {
            actor.rollSkillCheck(ST.dex, DEX.crossbow)
        });
        html.find("#sleight-rollable").on("click", () => {
            actor.rollSkillCheck(ST.dex, DEX.sleight)
        });
        html.find("#stealth-rollable").on("click", () => {
            actor.rollSkillCheck(ST.dex, DEX.stealth)
        });

        //body skills
        html.find("#physique-rollable").on("click", () => {
            actor.rollSkillCheck(ST.body, BODY.physique)
        });
        html.find("#endurance-rollable").on("click", () => {
            actor.rollSkillCheck(ST.body, BODY.endurance)
        });

        //emp skills
        html.find("#charisma-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.charisma)
        });
        html.find("#deceit-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.deceit)
        });
        html.find("#finearts-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.fineArts)
        });
        html.find("#gambling-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.gambling)
        });
        html.find("#grooming-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.grooming)
        });
        html.find("#perception-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.perception)
        });
        html.find("#leadership-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.leadership)
        });
        html.find("#persuasion-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.persuasion)
        });
        html.find("#performance-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.performance)
        });
        html.find("#seduction-rollable").on("click", () => {
            actor.rollSkillCheck(ST.emp, EMP.seduction)
        });

        //cra skills
        html.find("#alchemy-rollable").on("click", () => {
            actor.rollSkillCheck(ST.cra, CRA.alchemy)
        });
        html.find("#crafting-rollable").on("click", () => {
            actor.rollSkillCheck(ST.cra, CRA.crafting)
        });
        html.find("#disguise-rollable").on("click", () => {
            actor.rollSkillCheck(ST.cra, CRA.disguise)
        });
        html.find("#firstaid-rollable").on("click", () => {
            actor.rollSkillCheck(ST.cra, CRA.firstAid)
        });
        html.find("#forgery-rollable").on("click", () => {
            actor.rollSkillCheck(ST.cra, CRA.forgery)
        });
        html.find("#picklock-rollable").on("click", () => {
            actor.rollSkillCheck(ST.cra, CRA.pickLock)
        });
        html.find("#trapcraft-rollable").on("click", () => {
            actor.rollSkillCheck(ST.cra, CRA.trapCraft)
        });

        //will skills
        html.find("#courage-rollable").on("click", () => {
            actor.rollSkillCheck(ST.will, WILL.courage)
        });
        html.find("#hexweave-rollable").on("click", () => {
            actor.rollSkillCheck(ST.will, WILL.hexWeave)
        });
        html.find("#intimidation-rollable").on("click", () => {
            actor.rollSkillCheck(ST.will, WILL.intimidation)
        });
        html.find("#spellcast-rollable").on("click", () => {
            actor.rollSkillCheck(ST.will, WILL.spellCast)
        });
        html.find("#resistmagic-rollable").on("click", () => {
            actor.rollSkillCheck(ST.will, WILL.resistMagic)
        });
        html.find("#resistcoerc-rollable").on("click", () => {
            actor.rollSkillCheck(ST.will, WILL.resistCoerc)
        });
        html.find("#ritcraft-rollable").on("click", () => {
            actor.rollSkillCheck(ST.will, WILL.ritCraft)
        });

        html.find(".draggable").on("dragstart", (ev) => {
            let itemId = ev.target.dataset.id
            let item = this.actor.items.get(itemId);
            ev.originalEvent.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                    item: item,
                    actor: this.actor,
                    type: "itemDrop",
                }),
            )
        });

        const newDragDrop = new DragDrop({
            dragSelector: `.draggable`,
            dropSelector: `.window-content`,
            permissions: {dragstart: this._canDragStart.bind(this), drop: this._canDragDrop.bind(this)},
            callbacks: {dragstart: this._onDragStart.bind(this), drop: this._onDrop.bind(this)}
        })
        this._dragDrop.push(newDragDrop);
    }

    /** Death saves section */
    async _removeDeathSaves(event) {
        event.preventDefault();
        await this.actor.update({"system.deathSaves": 0});
    }

    async _addDeathSaves(event) {
        event.preventDefault();
        await this.actor.update({"system.deathSaves": this.actor.system.deathSaves + 1});
    }

    async _onDeathSaveRoll(event) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        // Calculate stun base for death save roll
        let stunBase = Math.floor((actor.system.stats.body.max + actor.system.stats.will.max) / 2);
        if (actor.system.derivedStats.hp.value > 0) {
            stunBase = actor.system.coreStats.stun.current
        }
        if (stunBase > 10) {
            stunBase = 10;
        }
        stunBase -= actor.system.deathSaves

        let messageData = {
            speaker: actor.getSpeaker(),
            flavor: `
        <h2>${game.i18n.localize("WITCHER.DeathSave")}</h2>
        <div class="roll-summary">
            <div class="dice-formula">${game.i18n.localize("WITCHER.Chat.SaveText")} <b>${stunBase}</b></div>
        </div>
        <hr />`
        }

        let config = new RollConfig()
        config.reversal = true
        config.showSuccess = true
        config.threshold = stunBase

        await extendedRoll(witcher.rollFormulas.default, messageData, config)
    }

    /** @override */
    async _onDropItem(event, data) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        if (!actor.isOwner) return false;
        const item = await Item.implementation.fromDropData(data);
        const itemData = item.toObject();

        // Handle item sorting within the same Actor
        if (actor.uuid === item.parent?.uuid) return this._onSortItem(event, itemData);

        // dragData should exist for ActorSheet, WitcherItemSheet.
        // It is populated during the activateListeners phase
        let witcherDragData = event.dataTransfer.getData("text/plain")
        let dragData = witcherDragData ? JSON.parse(witcherDragData) : data;

        // handle itemDrop prepared in ActorSheet, WitcherItemSheet
        // need this to drop item from actor
        if (witcherDragData && dragData.type === "itemDrop") {
            let previousActor = game.actors.get(dragData.actor._id)
            let token = previousActor.token ?? previousActor.getActiveTokens()[0]
            if (token) {
                previousActor = token.actor
            }

            if (previousActor === actor) {
                return false;
            }

            // Calculate the rollable amount of items to be dropped from actors' inventory
            if (typeof (dragData.item.system.quantity) === 'string' && dragData.item.system.quantity.includes("d")) {
                let messageData = {
                    speaker: actor.getSpeaker(),
                    flavor: `<h1>Quantity of ${dragData.item.name}</h1>`,
                }
                let roll = await new Roll(dragData.item.system.quantity).evaluate({async: true})
                await roll.toMessage(messageData)

                // Add items to the recipient actor
                await this._addItem(actor, dragData.item, Math.floor(roll.total))

                // Remove items from donor actor
                if (previousActor) {
                    await previousActor.items.get(dragData.item._id).delete()
                }
                return true
            }

            if (dragData.item.system.quantity !== 0) {
                if (dragData.item.system.quantity > 1) {
                    let content = `${game.i18n.localize("WITCHER.Items.transferMany")}: <input type="number" class="small" name="numberOfItem" value=1>/${dragData.item.system.quantity} <br />`
                    let cancel = true
                    let numberOfItem = 0
                    let dialogData = {
                        buttons: [
                            [`${game.i18n.localize("WITCHER.Button.Continue")}`, (html) => {
                                numberOfItem = html.find("[name=numberOfItem]")[0].value;
                                cancel = false
                            }],
                            [`${game.i18n.localize("WITCHER.Button.All")}`, () => {
                                numberOfItem = dragData.item.system.quantity
                                cancel = false
                            }]
                        ],
                        title: game.i18n.localize("WITCHER.Items.transferTitle"),
                        content: content
                    }
                    await buttonDialog(dialogData)

                    if (cancel) {
                        return false
                    } else {
                        // Remove items from donor actor
                        await this._removeItem(previousActor, dragData.item._id, numberOfItem)
                        if (numberOfItem > dragData.item.system.quantity) {
                            numberOfItem = dragData.item.system.quantity
                        }
                        // Add items to the recipient actor
                        await this._addItem(actor, dragData.item, numberOfItem)
                    }
                } else {
                    // Add item to the recipient actor
                    await this._addItem(actor, dragData.item, 1)
                    // Remove item from donor actor
                    if (previousActor) {
                        await previousActor.items.get(dragData.item._id).delete()
                    }
                }
            }
        } else if (dragData && dragData.type === "Item") {
            // Adding items from compendia
            // We do not have the same dragData object in compendia as for Actor or Item
            let itemToAdd = item

            // Somehow previous item from passed data object is empty. Let's try to get item from passed event
            if (!itemToAdd) {
                let dragEventData = TextEditor.getDragEventData(event)
                itemToAdd = await fromUuid(dragEventData.uuid)
            }

            if (itemToAdd) {
                await this._addItem(actor, itemToAdd, 1)
            }
        } else {
            await super._onDrop(event);
        }
    }

    async _removeItem(actor, itemId, quantityToRemove) {
        await actor.removeItem(itemId, quantityToRemove)
    }

    /** Item handlers */

    /**
     * @param {WitcherActor} actor
     * @param {WitcherItem} addItem
     * @param {number} numberOfItem
     * @param {boolean} forceCreate
     * @return {Promise<void>}
     * @private
     */
    async _addItem(actor, addItem, numberOfItem, forceCreate = false) {
        let foundItem = actor.getItemByNameAndType(addItem.name, addItem.type) ?? actor.getItemByName(addItem.name)
        if (foundItem && !forceCreate) {
            await foundItem.update({'system.quantity': Number(foundItem.system.quantity) + Number(numberOfItem)})
        } else {
            let newItem = {...addItem};

            if (numberOfItem) {
                newItem.system.quantity = Number(numberOfItem)
            }
            await actor.createEmbeddedDocuments("Item", [newItem]);
        }
    }

    async _onAddItem(event) {
        let element = event.currentTarget
        let itemData = {
            name: `new ${element.dataset.itemType}`,
            type: element.dataset.itemType
        }

        //todo refactor
        switch (element.dataset.spellType) {
            case "spellNovice":
                itemData.system = {class: "Spells", level: "novice"}
                break;
            case "spellJourneyman":
                itemData.system = {class: "Spells", level: "journeyman"}
                break;
            case "spellMaster":
                itemData.system = {class: "Spells", level: "master"}
                break;
            case "rituals":
                itemData.system = {class: "Rituals"}
                break;
            case "hexes":
                itemData.system = {class: "Hexes"}
                break;
            case "magicalgift":
                itemData.system = {class: "MagicalGift"}
                break;
        }

        // set default component || alchemical type based on itemType && subType
        if (element.dataset.itemType === witcher.itemTypes.component.name) {
            if (element.dataset.subType === witcher.itemTypes.alchemical.name) {
                itemData.system = {type: element.dataset.subType}
            } else if (element.dataset.subType) {
                itemData.system = {
                    type: witcher.itemTypes.substances.name,
                    substanceType: element.dataset.subType
                }
            } else {
                itemData.system = {
                    type: witcher.itemTypes.component.name,
                    substanceType: element.dataset.subType
                }
            }
        }

        // set general valuable type
        if (element.dataset.itemType === witcher.itemTypes.valuable.name) {
            itemData.system = {type: witcher.itemTypes.genera.name};
        }

        // set default diagram type
        if (element.dataset.itemType === witcher.itemTypes.diagrams.name) {
            itemData.system = {
                type: witcher.itemTypes.alchemical.name,
                level: witcher.craftLevels.novice.name,
                isFormulae: true
            };
        }

        await Item.create(itemData, {parent: this.actor})
    }

    async _onEditItem(event) {
        event.preventDefault();
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true)
    }

    async _onDeleteItem(event) {
        event.preventDefault();
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        return await this.actor.items.get(itemId).delete();
    }

    async _onShowItem(event) {
        event.preventDefault;
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        new Dialog({
            title: item.name,
            content: `<img src="${item.img}" alt="${item.img}" width="100%" />`,
            buttons: {}
        }, {
            width: 520,
            resizable: true
        }).render(true);
    }

    async _onBuyItem(event) {
        event.preventDefault();
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let coinOptions = `
      <option value="crown" selected> ${game.i18n.localize("WITCHER.Currency.crown")} </option>
      <option value="bizant"> ${game.i18n.localize("WITCHER.Currency.bizant")} </option>
      <option value="ducat"> ${game.i18n.localize("WITCHER.Currency.ducat")} </option>
      <option value="lintar"> ${game.i18n.localize("WITCHER.Currency.lintar")} </option>
      <option value="floren"> ${game.i18n.localize("WITCHER.Currency.floren")} </option>
      <option value="oren"> ${game.i18n.localize("WITCHER.Currency.oren")} </option>
      `;
        let percentOptions = `
      <option value="50">50%</option>
      <option value="100" selected>100%</option>
      <option value="125">125%</option>
      <option value="150">150%</option>
      <option value="175">175%</option>
      <option value="200">200%</option>
      `;

        let content = `
      <script>
        function calcTotalCost() {
          const qtyInput = document.getElementById("itemQty");
          const ItemCostInput = document.getElementById("custumCost");
          const costTotalInput = document.getElementById("costTotal");
          costTotalInput.value = ItemCostInput.value * qtyInput.value
        }
        function applyPercentage() {
          const qtyInput = document.getElementById("itemQty");
          const percentage = document.getElementById("percent");
          const ItemCostInput = document.getElementById("custumCost");
          ItemCostInput.value = Math.ceil(${item.system.cost} * (percentage.value / 100))

          const costTotalInput = document.getElementById("costTotal");
          costTotalInput.value = ItemCostInput.value * qtyInput.value
        }
      </script>

      <label>${game.i18n.localize("WITCHER.Loot.InitialCost")}: ${item.system.cost}</label><br />
      <label>${game.i18n.localize("WITCHER.Loot.HowMany")}: 
        <input id="itemQty" onChange="calcTotalCost()" type="number" class="small" name="itemQty" value=1> /${item.system.quantity}
      </label> <br />
      <label>${game.i18n.localize("WITCHER.Loot.ItemCost")}</label>
      <input id="custumCost" onChange="calcTotalCost()" type="number" name="costPerItemValue" value=${item.system.cost}>${game.i18n.localize("WITCHER.Loot.Percent")}
      <select id="percent" onChange="applyPercentage()" name="percentage">${percentOptions}</select><br /><br />
      <label>${game.i18n.localize("WITCHER.Loot.TotalCost")}</label> 
      <input id="costTotal" type="number" class="small" name="costTotalValue" value=${item.system.cost}>
      <select name="coinType">${coinOptions}</select><br />
      `
        let characterOptions = `<option value="">other</option>`
        for (let actor of game.actors) {
            if (actor.testUserPermission(game.user, "OWNER")) {
                if (actor === game.user.character) {
                    characterOptions += `<option value="${actor._id}" selected>${actor.name}</option>`
                } else {
                    characterOptions += `<option value="${actor._id}">${actor.name}</option>`
                }
            }
        }
        content += `To Character : <select name="character">${characterOptions}</select>`

        let cancel = true
        let numberOfItem = 0;
        let totalCost = 0;
        let characterId = "";
        let coinType = "";

        let dialogData = {
            buttons: [
                [`${game.i18n.localize("WITCHER.Button.Continue")}`, (html) => {
                    numberOfItem = html.find("[name=itemQty]")[0].value;
                    totalCost = html.find("[name=costTotalValue]")[0].value;
                    coinType = html.find("[name=coinType]")[0].value;
                    characterId = html.find("[name=character]")[0].value;
                    cancel = false
                }]],
            title: game.i18n.localize("WITCHER.Loot.BuyTitle"),
            content: content
        }
        await buttonDialog(dialogData)
        if (cancel) {
            return
        }

        let buyerActor = game.actors.get(characterId)
        let token = buyerActor.token ?? buyerActor.getActiveTokens()[0]
        if (token) {
            buyerActor = token.actor
        }

        if (!witcher.currency[coinType]) {
            ui.notifications.error(game.i18n.localize("WITCHER.Currency.Error.InvalidCurrency"))
            return
        }

        let hasEnoughMoney = true
        if (buyerActor) {
            hasEnoughMoney = buyerActor.system.currency[coinType] >= totalCost
        }

        if (!hasEnoughMoney) {
            ui.notifications.error(game.i18n.localize("WITCHER.Currency.Error.NotEnoughCoins"))
        } else {
            await this._removeItem(this.actor, itemId, numberOfItem)
            if (buyerActor) {
                await this._addItem(buyerActor, item, numberOfItem)
            }

            // reduce amount of coins from buyer and add them to seller
            let currencyPropertyRef = prepareSystemRef(witcher.currency[coinType].ref)
            if (buyerActor) {
                let currencyToReduce = getValueByStringPath(buyerActor, currencyPropertyRef)
                buyerActor.update({[currencyPropertyRef]: currencyToReduce - totalCost})
            }
            let currencyToIncrease = getValueByStringPath(this.actor, currencyPropertyRef)
            this.actor.update({[currencyPropertyRef]: Number(currencyToIncrease) + Number(totalCost)})
        }
    }

    async _onHideItem(event) {
        event.preventDefault();
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        item.update({"system.isHidden": !item.system.isHidden})
    }

    _onDisplayItemInfo(event) {
        event.preventDefault();
        let section = event.currentTarget.closest(".item");
        let editor = $(section).find(".item-info")
        editor.toggleClass("invisible");
    }

    _onSubstanceDisplay(event) {
        event.preventDefault();
        let subType = event.currentTarget.closest(".substance").dataset.subType;

        // todo send proper error
        if (!subType) {
            return
        }

        let panelRef = "system.panels." + subType + "IsOpen"
        let isPanelOpen = getValueByStringPath(this.actor, panelRef)
        this.actor.update({[panelRef]: !isPanelOpen});
    }

    /** Skill modifier handlers */
    async _onAddSkillModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".skill").dataset.stat;
        let skill = event.currentTarget.closest(".skill").dataset.skill;
        let type = event.currentTarget.closest(".skill").dataset.type;

        // todo return proper error
        if (!type || !skill || !stat || !witcher.statTypes[type].list[stat].skills[skill]) {
            return
        }

        let modifierRef = prepareSystemRef(witcher.statTypes[type].list[stat].skills[skill].ref, "modifiers")
        let modifiers = getValueByStringPath(this.actor, modifierRef)

        modifiers.push({id: genId(), name: "Modifier", value: 0})
        this.actor.update({[modifierRef]: modifiers});
    }

    async _onEditSkillModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".skill").dataset.stat;
        let skill = event.currentTarget.closest(".skill").dataset.skill;
        let type = event.currentTarget.closest(".skill").dataset.type;

        // todo return proper error
        if (!type || !skill || !stat || !witcher.statTypes[type].list[stat].skills[skill]) {
            return
        }

        let modifierRef = prepareSystemRef(witcher.statTypes[type].list[stat].skills[skill].ref, "modifiers")
        let modifiers = getValueByStringPath(this.actor, modifierRef)


        let element = event.currentTarget;
        let itemId = element.closest(".list-modifiers").dataset.id;

        let field = element.dataset.field;
        let value = element.value

        let objIndex = modifiers.findIndex((obj => obj.id === itemId));
        modifiers[objIndex][field] = value

        this.actor.update({[modifierRef]: modifiers});
    }

    async _onRemoveSkillModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".skill").dataset.stat;
        let skill = event.currentTarget.closest(".skill").dataset.skill;
        let type = event.currentTarget.closest(".skill").dataset.type;

        // todo return proper error
        if (!type || !skill || !stat || !witcher.statTypes[type].list[stat].skills[skill]) {
            return
        }

        let modifierRef = prepareSystemRef(witcher.statTypes[type].list[stat].skills[skill].ref, "modifiers")
        let modifiers = getValueByStringPath(this.actor, modifierRef)

        const newModList = Object.values(modifiers).map((details) => details);
        const idxToRm = newModList.findIndex((v) => v.id === event.target.dataset.id);
        newModList.splice(idxToRm, 1);

        this.actor.update({[modifierRef]: newModList});
    }

    _onDisplaySkillModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".skill").dataset.stat;
        let skill = event.currentTarget.closest(".skill").dataset.skill;
        let type = event.currentTarget.closest(".skill").dataset.type;

        // todo return proper error
        if (!type || !skill || !stat || !witcher.statTypes[type].list[stat].skills[skill]) {
            return
        }

        let isOpenedRef = prepareSystemRef(witcher.statTypes[type].list[stat].skills[skill].ref, "isOpened")
        let val = getValueByStringPath(this.actor, isOpenedRef)

        this.actor.update({[isOpenedRef]: !val});
    }

    /** Modifiers handlers */
    async _onAddModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".stat-display").dataset.stat;
        let type = event.currentTarget.closest(".stat-display").dataset.type;

        // todo return proper error
        if (!type || !stat || !witcher.statTypes[type].list[stat]) {
            return
        }

        let modifierRef = prepareSystemRef(witcher.statTypes[type].list[stat].ref, "modifiers")
        let modifiers = getValueByStringPath(this.actor, modifierRef)

        modifiers.push({id: genId(), name: "Modifier", value: 0})
        this.actor.update({[modifierRef]: modifiers});
    }

    async _onEditModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".stat-display").dataset.stat;
        let type = event.currentTarget.closest(".stat-display").dataset.type;

        // todo return proper error
        if (!type || !stat || !witcher.statTypes[type].list[stat]) {
            return
        }

        let modifierRef = prepareSystemRef(witcher.statTypes[type].list[stat].ref, "modifiers")
        let modifiers = getValueByStringPath(this.actor, modifierRef)

        let element = event.currentTarget;
        let itemId = element.closest(".list-modifiers").dataset.id;

        let field = element.dataset.field;
        let value = element.value

        let objIndex = modifiers.findIndex((obj => obj.id === itemId));
        modifiers[objIndex][field] = value

        this.actor.update({[modifierRef]: modifiers});
        this.actor.prepareDerivedData();
    }

    async _onRemoveModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".stat-display").dataset.stat;
        let type = event.currentTarget.closest(".stat-display").dataset.type;

        // todo return proper error
        if (!type || !stat || !witcher.statTypes[type].list[stat]) {
            return
        }

        let modifierRef = prepareSystemRef(witcher.statTypes[type].list[stat].ref, "modifiers")
        let modifiers = getValueByStringPath(this.actor, modifierRef)

        const newModList = Object.values(modifiers).map((details) => details);
        const idxToRm = newModList.findIndex((v) => v.id === event.target.dataset.id);
        newModList.splice(idxToRm, 1);

        this.actor.update({[modifierRef]: newModList});
        this.actor.prepareDerivedData();
    }

    _onDisplayModifier(event) {
        event.preventDefault();
        let stat = event.currentTarget.closest(".stat-display").dataset.stat;
        let type = event.currentTarget.closest(".stat-display").dataset.type;

        // todo return proper error
        if (!type || !stat || !witcher.statTypes[type].list[stat]) {
            return
        }

        let isOpenedRef = prepareSystemRef(witcher.statTypes[type].list[stat].ref, "isOpened")
        let val = getValueByStringPath(this.actor, isOpenedRef)

        this.actor.update({[isOpenedRef]: !val});
    }

    /** Effects section */
    async _onAddCrit(event) {
        event.preventDefault();
        const prevCritList = this.actor.system.critWounds;
        const newCritList = Object.values(prevCritList).map((details) => details);
        newCritList.push({
            id: genId(),
            effect: witcher.CritModDescription.SimpleCrackedJaw.name,
            mod: witcher.CritModDescription.SimpleCrackedJaw.mod.None,
            description: witcher.CritModDescription.SimpleCrackedJaw.description,
            notes: "",
        });
        this.actor.update({"system.critWounds": newCritList});
    }

    async _onRemoveCrit(event) {
        event.preventDefault();
        const prevCritList = this.actor.system.critWounds;
        const newCritList = Object.values(prevCritList).map((details) => details);
        const idxToRm = newCritList.findIndex((v) => v.id === event.target.dataset.id);
        newCritList.splice(idxToRm, 1);
        this.actor.update({"system.critWounds": newCritList});
    }

    async _onAddActiveEffect() {
        let itemData = {
            name: `new effect`,
            type: "effect"
        }
        await Item.create(itemData, {parent: this.actor})
    }

    /** Roll handlers */
    async _onSpellRoll(event, itemId = null) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")

        if (!itemId) {
            itemId = event.currentTarget.closest(".item").dataset.itemId;
        }
        let spellItem = actor.items.get(itemId);
        let rollFormula = witcher.rollFormulas.default
        rollFormula += !displayRollDetails
            ? `+${actor.system.stats.will.current}`
            : `+${actor.system.stats.will.current}[${game.i18n.localize("WITCHER.StWill")}]`;

        //todo refactor
        // get proper skill for the spell case based on the magic type
        switch (spellItem.system.class) {
            case witcher.magicTypes.witcherSigns.name:
            case witcher.magicTypes.invocations.name:
            case witcher.magicTypes.spells.name:
                rollFormula += !displayRollDetails
                    ? `+${actor.system.skills.will.spellcast.value}`
                    : `+${actor.system.skills.will.spellcast.value}[${game.i18n.localize("WITCHER.SkWillSpellcastLable")}]`;
                break;
            case witcher.magicTypes.rituals.name:
                rollFormula += !displayRollDetails
                    ? `+${actor.system.skills.will.ritcraft.value}`
                    : `+${actor.system.skills.will.ritcraft.value}[${game.i18n.localize("WITCHER.SkWillRitCraftLable")}]`;
                break;
            case witcher.magicTypes.hexes.name:
                rollFormula += !displayRollDetails
                    ? `+${actor.system.skills.will.hexweave.value}`
                    : `+${actor.system.skills.will.hexweave.value}[${game.i18n.localize("WITCHER.SkWillHexLable")}]`;
                break;
        }

        let staCostTotal = spellItem.system.stamina;
        let customModifier = 0;
        let isExtraAttack = false
        let content = `<label>${game.i18n.localize("WITCHER.Dialog.attackExtra")}: <input type="checkbox" name="isExtraAttack"></label> <br />`
        if (spellItem.system.staminaIsVar) {
            content += `${game.i18n.localize("WITCHER.Spell.staminaDialog")}<input class="small" name="staCost" value=1> <br />`
        }

        // Check whether actor has applicable focus options for cast
        let focusOptions = `<option value="0"> </option>`
        let secondFocusOptions = `<option value="0" selected> </option>`

        let useFocus = false
        if (actor.system.focus1.value > 0) {
            focusOptions += `<option value="${actor.system.focus1.value}" selected> ${actor.system.focus1.name} (${actor.system.focus1.value}) </option>`;
            secondFocusOptions += `<option value="${actor.system.focus1.value}"> ${actor.system.focus1.name} (${actor.system.focus1.value}) </option>`;
            useFocus = true
        }
        if (actor.system.focus2.value > 0) {
            focusOptions += `<option value="${actor.system.focus2.value}"> ${actor.system.focus2.name} (${actor.system.focus2.value}) </option>`;
            secondFocusOptions += `<option value="${actor.system.focus2.value}"> ${actor.system.focus2.name} (${actor.system.focus2.value}) </option>`;
            useFocus = true
        }
        if (actor.system.focus3.value > 0) {
            focusOptions += `<option value="${actor.system.focus3.value}"> ${actor.system.focus3.name} (${actor.system.focus3.value}) </option>`;
            secondFocusOptions += `<option value="${actor.system.focus3.value}"> ${actor.system.focus3.name} (${actor.system.focus3.value}) </option>`;
            useFocus = true
        }
        if (actor.system.focus4.value > 0) {
            focusOptions += `<option value="${actor.system.focus4.value}"> ${actor.system.focus4.name} (${actor.system.focus4.value}) </option>`;
            secondFocusOptions += `<option value="${actor.system.focus4.value}"> ${actor.system.focus4.name} (${actor.system.focus4.value}) </option>`;
            useFocus = true
        }

        if (useFocus) {
            content += ` <label>${game.i18n.localize("WITCHER.Spell.ChooseFocus")}: <select name="focus">${focusOptions}</select></label> <br />`
            content += ` <label>${game.i18n.localize("WITCHER.Spell.ChooseExpandedFocus")}: <select name="secondFocus">${secondFocusOptions}</select></label> <br />`
        }

        content += `<label>${game.i18n.localize("WITCHER.Dialog.attackCustom")}: <input class="small" name="customMod" value=0></label> <br /><br />`;
        let cancel = true
        let focusValue = 0
        let secondFocusValue = 0

        // Render form to choose skill modifications before the roll
        let dialogData = {
            buttons: [
                [`${game.i18n.localize("WITCHER.Button.Continue")}`, (html) => {
                    if (spellItem.system.staminaIsVar) {
                        staCostTotal = html.find("[name=staCost]")[0].value;
                    }
                    customModifier = html.find("[name=customMod]")[0].value;
                    isExtraAttack = html.find("[name=isExtraAttack]").prop("checked");
                    if (html.find("[name=focus]")[0]) {
                        focusValue = html.find("[name=focus]")[0].value;
                    }
                    if (html.find("[name=secondFocus]")[0]) {
                        secondFocusValue = html.find("[name=secondFocus]")[0].value;
                    }
                    cancel = false
                }]],
            title: game.i18n.localize("WITCHER.Spell.MagicCost"),
            content: content
        }
        await buttonDialog(dialogData)
        if (cancel) {
            return
        }

        let origStaCost = staCostTotal
        let newSta = actor.system.derivedStats.sta.value

        staCostTotal -= Number(focusValue) + Number(secondFocusValue)

        // Calculate modifier for extra attack
        if (isExtraAttack) {
            staCostTotal += witcher.modifiers.extraAttack.staCost
        }

        // Do not allow usage less than 1 stamina during the cast
        let useMinimalStaCost = false
        if (staCostTotal < 1) {
            useMinimalStaCost = true
            staCostTotal = 1
        }

        newSta -= staCostTotal

        if (newSta < 0) {
            return ui.notifications.error(game.i18n.localize("WITCHER.Spell.notEnoughSta"));
        }

        // Update actors' stamina
        actor.update({
            'system.derivedStats.sta.value': newSta
        });

        //todo check whether we need to spent 1 STA even if focus value > STA cost
        let staCostDisplay = `${origStaCost}[${game.i18n.localize("WITCHER.Spell.Short.StaCost")}]`

        // Adjust display info for the roll
        if (isExtraAttack) {
            staCostDisplay += witcher.modifiers.extraAttack.staCostDisplay
            if (displayRollDetails) {
                staCostDisplay += `[${game.i18n.localize(witcher.modifiers.extraAttack.staCostDisplayExtraRef)}]`
            }
        }

        staCostDisplay += ` - ${Number(focusValue) + Number(secondFocusValue)}[${game.i18n.localize("WITCHER.Actor.DerStat.Focus")}]`
        staCostDisplay += ` =  ${staCostTotal}`
        if (useMinimalStaCost) {
            staCostDisplay += `[${game.i18n.localize("WITCHER.MinValue")}]`
        }

        // Adjust roll formula with modifiers
        if (customModifier < 0) {
            rollFormula += !displayRollDetails
                ? `${customModifier}`
                : `${customModifier}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
        }
        if (customModifier > 0) {
            rollFormula += !displayRollDetails
                ? `+${customModifier}`
                : `+${customModifier}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
        }
        if (isExtraAttack) {
            rollFormula += witcher.modifiers.extraAttack.formula
            if (displayRollDetails) {
                rollFormula += `[${game.i18n.localize(witcher.modifiers.extraAttack.formulaExtraRef)}]`
            }
        }

        // todo refactor
        // get the spells' element type
        let spellSource = ''
        switch (spellItem.system.source) {
            case "mixedElements":
                spellSource = "WITCHER.Spell.Mixed";
                break;
            case "earth":
                spellSource = "WITCHER.Spell.Earth";
                break;
            case "air":
                spellSource = "WITCHER.Spell.Air";
                break;
            case "fire":
                spellSource = "WITCHER.Spell.Fire";
                break;
            case "Water":
                spellSource = "WITCHER.Spell.Water";
                break;
        }

        // Prepare message data for roll
        let messageData = {
            speaker: actor.getSpeaker(),
            flags: spellItem.getSpellFlags(),
            flavor: `<h2><img src="${spellItem.img}" class="item-img"  alt="${spellItem.name}"/>${spellItem.name}</h2>
          <div><b>${game.i18n.localize("WITCHER.Spell.StaCost")}: </b>${staCostDisplay}</div>
          <div><b>${game.i18n.localize("WITCHER.Mutagen.Source")}: </b>${game.i18n.localize(spellSource)}</div>
          <div><b>${game.i18n.localize("WITCHER.Spell.Effect")}: </b>${spellItem.system.effect}</div>`
        }
        if (spellItem.system.range) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.Spell.Range")}: </b>${spellItem.system.range}</div>`
        }
        if (spellItem.system.duration) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.Spell.Duration")}: </b>${spellItem.system.duration}</div>`
        }
        if (spellItem.system.defence) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.Spell.Defence")}: </b>${spellItem.system.defence}</div>`
        }
        if (spellItem.system.preparationTime) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.Spell.PrepTime")}: </b>${spellItem.system.preparationTime}</div>`
        }
        if (spellItem.system.difficultyCheck) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.DC")}: </b>${spellItem.system.difficultyCheck}</div>`
        }
        if (spellItem.system.components) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.Spell.Components")}: </b>${spellItem.system.components}</div>`
        }
        if (spellItem.system.alternateComponents) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.Spell.AlternateComponents")}: </b>${spellItem.system.alternateComponents}</div>`
        }
        if (spellItem.system.liftRequirement) {
            messageData.flavor += `<div><b>${game.i18n.localize("WITCHER.Spell.Requirements")}: </b>${spellItem.system.liftRequirement}</div>`
        }

        if (spellItem.system.causeDamages) {
            let effects = JSON.stringify(spellItem.system.effects)
            //todo add to configs
            let locationJSON = JSON.stringify(actor.getLocationObject("randomSpell"))

            let dmg = spellItem.system.damage || "0"
            messageData.flavor += `<button class="damage" data-img="${spellItem.img}" data-name="${spellItem.name}" data-dmg="${dmg}" data-location='${locationJSON}' data-effects='${effects}'>${game.i18n.localize("WITCHER.table.Damage")}</button>`;
        }

        let config = new RollConfig()
        config.showCrit = true
        await extendedRoll(rollFormula, messageData, config)

        let token = actor.getControlledToken();

        await spellItem.createSpellVisualEffectIfApplicable(token);
        await spellItem.deleteSpellVisualEffect();
    }

    async _onInitRoll(event) {
        await this.actor.rollInitiative({createCombatants: true, rerollInitiative: true})
    }

    async _onCritRoll(event) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        let rollResult = await new Roll(witcher.rollFormulas.critRoll).evaluate({async: true})
        let messageData = {
            speaker: actor.getSpeaker()
        }
        await rollResult.toMessage(messageData)
    }

    async _onDefenceRoll(event) {
        ExecuteDefence(this.actor)
    }

    async _onVerbalCombat(path, data) {
        let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")
        const dialogTemplate = await renderTemplate("systems/witcher/templates/sheets/verbal-combat.html", data);

        new Dialog({
            title: game.i18n.localize("WITCHER.verbalCombat.DialogTitle"),
            content: dialogTemplate,
            buttons: {
                t1: {
                    label: "Roll",
                    callback: async (html) => {
                        let verbal = document.querySelector('input[name="verbalCombat"]:checked').value;
                        console.log(verbal)
                        let vcName;
                        let vcStatName;
                        let vcStat;
                        let vcSkillName;
                        let vcSkill;
                        let vcDmg;
                        let effect;
                        let modifiers;

                        //todo refactor
                        switch (verbal) {
                            case "Seduce":
                                vcName = "WITCHER.verbalCombat.Seduce";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpSeduction";
                                vcSkill = this.actor.system.skills.emp.seduction.value;
                                modifiers = this.actor.system.skills.emp.seduction.modifiers
                                vcDmg = `1d6+${this.actor.system.stats.emp.current}[${game.i18n.localize(vcStatName)}]`
                                effect = "WITCHER.verbalCombat.SeduceEffect"
                                break;
                            case "Persuade":
                                vcName = "WITCHER.verbalCombat.Persuade";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpPersuasion";
                                vcSkill = this.actor.system.skills.emp.persuasion.value;
                                modifiers = this.actor.system.skills.emp.persuasion.modifiers;
                                vcDmg = `1d6/2+${this.actor.system.stats.emp.current}[${game.i18n.localize(vcStatName)}]`
                                effect = "WITCHER.verbalCombat.PersuadeEffect"
                                break;
                            case "Appeal":
                                vcName = "WITCHER.verbalCombat.Appeal";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpLeadership";
                                vcSkill = this.actor.system.skills.emp.leadership.value;
                                modifiers = this.actor.system.skills.emp.leadership.modifiers;
                                vcDmg = `1d10+${this.actor.system.stats.emp.current}[${game.i18n.localize(vcStatName)}]`
                                effect = "WITCHER.verbalCombat.AppealEffect"
                                break;
                            case "Befriend":
                                vcName = "WITCHER.verbalCombat.Befriend";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpCharisma";
                                vcSkill = this.actor.system.skills.emp.charisma.value;
                                modifiers = this.actor.system.skills.emp.charisma.modifiers;
                                vcDmg = `1d6+${this.actor.system.stats.emp.current}[${game.i18n.localize(vcStatName)}]`
                                effect = "WITCHER.verbalCombat.BefriendEffect"
                                break;
                            case "Deceive":
                                vcName = "WITCHER.verbalCombat.Deceive";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpDeceit";
                                vcSkill = this.actor.system.skills.emp.deceit.value;
                                modifiers = this.actor.system.skills.emp.deceit.modifiers;
                                vcDmg = `1d6+${this.actor.system.stats.int.current}[${game.i18n.localize("WITCHER.Actor.Stat.Int")}]`
                                effect = "WITCHER.verbalCombat.DeceiveEffect"
                                break;
                            case "Ridicule":
                                vcName = "WITCHER.verbalCombat.Ridicule";
                                vcStatName = "WITCHER.Actor.Stat.Int";
                                vcStat = this.actor.system.stats.int.current;
                                vcSkillName = "WITCHER.SkIntSocialEt";
                                vcSkill = this.actor.system.skills.int.socialetq.value;
                                modifiers = this.actor.system.skills.int.socialetq.modifiers;
                                vcDmg = `1d6+${this.actor.system.stats.will.current}[${game.i18n.localize("WITCHER.Actor.Stat.Will")}]`
                                effect = "WITCHER.verbalCombat.RidiculeEffect"
                                break;
                            case "Intimidate":
                                vcName = "WITCHER.verbalCombat.Intimidate";
                                vcStatName = "WITCHER.Actor.Stat.Will";
                                vcStat = this.actor.system.stats.will.current;
                                vcSkillName = "WITCHER.SkWillIntim";
                                vcSkill = this.actor.system.skills.will.intimidation.value;
                                modifiers = this.actor.system.skills.will.intimidation.modifiers;
                                vcDmg = `1d10+${this.actor.system.stats.will.current}[${game.i18n.localize("WITCHER.Actor.Stat.Will")}]`
                                effect = "WITCHER.verbalCombat.IntimidateEffect"
                                break;
                            case "Ignore":
                                vcName = "WITCHER.verbalCombat.Ignore";
                                vcStatName = "WITCHER.Actor.Stat.Will";
                                vcStat = this.actor.system.stats.will.current;
                                vcSkillName = "WITCHER.SkWillResistCoer";
                                vcSkill = this.actor.system.skills.will.resistcoerc.value;
                                modifiers = [];
                                vcDmg = `1d10+${this.actor.system.stats.emp.current}[${game.i18n.localize("WITCHER.Actor.Stat.Emp")}]`
                                effect = "WITCHER.verbalCombat.None"
                                break;
                            case "Counterargue":
                                vcName = "WITCHER.verbalCombat.Counterargue";
                                vcStatName = "WITCHER.context.unavailable";
                                vcStat = 0;
                                vcSkillName = "WITCHER.context.unavailable";
                                vcSkill = 0;
                                modifiers = this.actor.system.skills.emp.persuasion.modifiers;
                                vcDmg = `${game.i18n.localize("WITCHER.verbalCombat.CounterargueDmg")}`
                                effect = "WITCHER.verbalCombat.CounterargueEffect"
                                break;
                            case "ChangeSubject":
                                vcName = "WITCHER.verbalCombat.ChangeSubject";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpPersuasion";
                                vcSkill = this.actor.system.skills.emp.persuasion.value;
                                modifiers = this.actor.system.skills.emp.persuasion.modifiers;
                                vcDmg = `1d6+${this.actor.system.stats.int.current}[${game.i18n.localize("WITCHER.Actor.Stat.Int")}]`
                                effect = "WITCHER.verbalCombat.None"
                                break;
                            case "Disengage":
                                vcName = "WITCHER.verbalCombat.Disengage";
                                vcStatName = "WITCHER.Actor.Stat.Will";
                                vcStat = this.actor.system.stats.will.current;
                                vcSkillName = "WITCHER.SkWillResistCoer";
                                vcSkill = this.actor.system.skills.will.resistcoerc.value;
                                modifiers = this.actor.system.skills.will.resistcoerc.modifiers;
                                vcDmg = game.i18n.localize("WITCHER.verbalCombat.None")
                                effect = "WITCHER.verbalCombat.DisengageEffect"
                                break;
                            case "Romance":
                                vcName = "WITCHER.verbalCombat.Romance";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpCharisma";
                                vcSkill = this.actor.system.skills.emp.charisma.value;
                                modifiers = this.actor.system.skills.emp.charisma.modifiers;
                                vcDmg = game.i18n.localize("WITCHER.verbalCombat.None")
                                effect = "WITCHER.verbalCombat.RomanceEffect"
                                break;
                            case "Study":
                                vcName = "WITCHER.verbalCombat.Study";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpHumanPerc";
                                vcSkill = this.actor.system.skills.emp.perception.value;
                                modifiers = this.actor.system.skills.emp.perception.modifiers;
                                vcDmg = game.i18n.localize("WITCHER.verbalCombat.None")
                                effect = "WITCHER.verbalCombat.StudyEffect"
                                break;
                            case "ImplyPersuade":
                                vcName = "WITCHER.verbalCombat.ImplyPersuade";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpPersuasion";
                                vcSkill = this.actor.system.skills.emp.persuasion.value;
                                modifiers = this.actor.system.skills.emp.persuasion.modifiers;
                                vcDmg = game.i18n.localize("WITCHER.verbalCombat.None")
                                effect = "WITCHER.verbalCombat.ImplyEffect"
                                break;
                            case "ImplyDeceit":
                                vcName = "WITCHER.verbalCombat.ImplyDeceit";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpDeceit";
                                vcSkill = this.actor.system.skills.emp.deceit.value;
                                modifiers = this.actor.system.skills.emp.deceit.modifiers;
                                vcDmg = game.i18n.localize("WITCHER.verbalCombat.None")
                                effect = "WITCHER.verbalCombat.ImplyEffect"
                                break;
                            case "Bribe":
                                vcName = "WITCHER.verbalCombat.Bribe";
                                vcStatName = "WITCHER.Actor.Stat.Emp";
                                vcStat = this.actor.system.stats.emp.current;
                                vcSkillName = "WITCHER.SkEmpGambling";
                                vcSkill = this.actor.system.skills.emp.gambling.value;
                                modifiers = this.actor.system.skills.emp.gambling.modifiers;
                                vcDmg = game.i18n.localize("WITCHER.verbalCombat.None")
                                effect = "WITCHER.verbalCombat.BribeEffect"
                                break;
                        }

                        let rollFormula = witcher.rollFormulas.default
                        rollFormula += !displayRollDetails
                            ? `+${vcStat}+${vcSkill}`
                            : `+${vcStat}[${game.i18n.localize(vcStatName)}]+${vcSkill}[${game.i18n.localize(vcSkillName)}]`

                        rollFormula = addModifiersToFormula(modifiers, rollFormula)

                        // add custom attributes. Check if it is possible to refactor
                        let customAtt = html.find("[name=customModifiers]")[0].value;
                        if (customAtt < 0) {
                            rollFormula += !displayRollDetails
                                ? `${customAtt}`
                                : `${customAtt}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
                        } else if (customAtt > 0) {
                            rollFormula += !displayRollDetails
                                ? `+${customAtt}`
                                : `+${customAtt}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
                        }

                        /**
                         * @type {WitcherActor}
                         */
                        let actor = this.actor
                        let messageData = {speaker: actor.getSpeaker()}
                        messageData.flavor = `
              <h2>${game.i18n.localize("WITCHER.verbalCombat.Title")}: ${game.i18n.localize(vcName)}</h2>
              <b>${game.i18n.localize("WITCHER.Weapon.Damage")}</b>: ${vcDmg} <br />
              ${game.i18n.localize(effect)}
              <hr />`

                        let config = new RollConfig()
                        config.showCrit = true
                        await extendedRoll(rollFormula, messageData, config)
                    }
                },
                t2: {
                    label: `${game.i18n.localize("WITCHER.Button.Cancel")}`,
                }
            },
        }).render(true);
    }

    async _onStatSaveRoll(event) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor
        let stat = event.currentTarget.closest(".stat-display").dataset.stat;

        let statValue = ""
        let statName = ""

        if (stat === witcher.reputation.reputation.name) {
            statValue = witcher.reputation.reputation.ref + "current"
            statName = witcher.reputation.reputation.alias
        } else if (witcher.stats[stat]) {
            statValue = witcher.stats[stat].ref + "current"
            statName = witcher.stats[stat].alias
        }

        let messageData = {speaker: actor.getSpeaker()}
        messageData.flavor = `
      <h2>${game.i18n.localize(statName)}</h2>
      <div class="roll-summary">
          <div class="dice-formula">${game.i18n.localize("WITCHER.Chat.SaveText")} <b>${statValue}</b></div>
      </div>
      <hr />`

        let config = new RollConfig()
        config.showCrit = true
        config.showSuccess = true
        config.reversal = true
        config.threshold = statValue
        config.thresholdDesc = statName
        await extendedRoll(witcher.rollFormulas.default, messageData, config)
    }

    _onInlineEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;

        let item = this.actor.items.get(itemId);
        let field = element.dataset.field;

        // Edit checkbox values
        let value = element.value
        if (value === "false") {
            value = true
        } else if (value === "true" || value === "checked") {
            value = false
        }

        return item.update({[field]: value});
    }

    _onFocusIn(event) {
        event.currentTarget.select();
    }

    async _onItemRoll(event, itemId = null) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor
        let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")

        if (!itemId) {
            itemId = event.currentTarget.closest(".item").dataset.itemId;
        }
        let item = actor.items.get(itemId);
        let displayDmgFormula = `${item.system.damage}`
        let formula = !displayRollDetails
            ? `${item.system.damage}`
            : `${item.system.damage}[${game.i18n.localize("WITCHER.Diagram.Weapon")}]`

        let isMeleeAttack = item.doesWeaponNeedMeleeSkillToAttack();
        if (actor.type === "character" && isMeleeAttack) {
            if (actor.system.attackStats.meleeBonus < 0) {
                displayDmgFormula += `${actor.system.attackStats.meleeBonus}`
                formula += !displayRollDetails
                    ? `${actor.system.attackStats.meleeBonus}`
                    : `${actor.system.attackStats.meleeBonus}[${game.i18n.localize("WITCHER.Dialog.attackMeleeBonus")}]`
            } else if (actor.system.attackStats.meleeBonus > 0) {
                displayDmgFormula += `+${actor.system.attackStats.meleeBonus}`
                formula += !displayRollDetails
                    ? `+${actor.system.attackStats.meleeBonus}`
                    : `+${actor.system.attackStats.meleeBonus}[${game.i18n.localize("WITCHER.Dialog.attackMeleeBonus")}]`
            }
        }

        let attackSkill = item.getItemAttackSkill();
        let messageData = {
            speaker: actor.getSpeaker(),
            flavor: `<h1> ${game.i18n.localize("WITCHER.Dialog.attack")}: ${item.name}</h1>`,
            flags: item.getAttackSkillFlags(),
        }

        let ammunitions = ``
        let noAmmo = 0
        let ammunitionOption = ``
        if (item.system.usingAmmo) {
            // get ammunitions for the weapon using ammo
            ammunitions = actor.items.filter(function (item) {
                return item.isOfType(witcher.itemTypes.weapon) && item.system.isAmmo
            });
            let quantity = sum(ammunitions)
            if (quantity <= 0) {
                noAmmo = 1;
            } else {
                ammunitions.forEach(element => {
                    ammunitionOption += `<option value="${element._id}"> ${element.name}(${element.system.quantity}) </option>`;
                });
            }
        }

        let noThrowable = !actor.isEnoughThrowableWeapon(item)
        let Mymelebonus = actor.system.attackStats.meleeBonus
        let data = {
            item,
            attackSkill,
            displayDmgFormula,
            isMeleeAttack,
            noAmmo,
            noThrowable,
            ammunitionOption,
            ammunitions,
            Mymelebonus
        }
        const myDialogOptions = {width: 500}
        const dialogTemplate = await renderTemplate("systems/witcher/templates/sheets/weapon-attack.html", data)

        new Dialog({
            title: `${game.i18n.localize("WITCHER.Dialog.attackWith")}: ${item.name}`,
            content: dialogTemplate,
            buttons: {
                Roll: {
                    label: `${game.i18n.localize("WITCHER.Dialog.ButtonRoll")}`,
                    callback: async html => {
                        let isExtraAttack = html.find("[name=isExtraAttack]").prop("checked");

                        let location = html.find("[name=location]")[0].value;
                        let ammunition = undefined
                        if (html.find("[name=ammunition]")[0]) {
                            ammunition = html.find("[name=ammunition]")[0].value;
                        }

                        let targetOutsideLOS = html.find("[name=targetOutsideLOS]").prop("checked");
                        let outsideLOS = html.find("[name=outsideLOS]").prop("checked");
                        let isFastDraw = html.find("[name=isFastDraw]").prop("checked");
                        let isProne = html.find("[name=isProne]").prop("checked");
                        let isPinned = html.find("[name=isPinned]").prop("checked");
                        let isActivelyDodging = html.find("[name=isActivelyDodging]").prop("checked");
                        let isMoving = html.find("[name=isMoving]").prop("checked");
                        let isAmbush = html.find("[name=isAmbush]").prop("checked");
                        let isRicochet = html.find("[name=isRicochet]").prop("checked");
                        let isBlinded = html.find("[name=isBlinded]").prop("checked");
                        let isSilhouetted = html.find("[name=isSilhouetted]").prop("checked");
                        let customAim = html.find("[name=customAim]")[0].value;

                        let range = item.system.range ? html.find("[name=range]")[0].value : null;
                        let customAtt = html.find("[name=customAtt]")[0].value;
                        let strike = html.find("[name=strike]")[0].value;
                        let damageType = html.find("[name=damageType]")[0].value;
                        let customDmg = html.find("[name=customDmg]")[0].value;
                        let attacknumber = 1;

                        if (isExtraAttack) {
                            let newSta = actor.system.derivedStats.sta.value - 3

                            if (newSta < 0) {
                                return ui.notifications.error(game.i18n.localize("WITCHER.Spell.notEnoughSta"));
                            }
                            actor.update({
                                'system.derivedStats.sta.value': newSta
                            });
                        }

                        if (strike === "fast") {
                            attacknumber = 2;
                        }
                        for (let i = 0; i < attacknumber; i++) {
                            let attFormula = witcher.rollFormulas.default
                            let damageFormula = formula;

                            // todo refactor in order to get modifiers from config
                            if (item.system.accuracy < 0) {
                                attFormula += !displayRollDetails
                                    ? `${item.system.accuracy}`
                                    : `${item.system.accuracy}[${game.i18n.localize("WITCHER.Weapon.Short.WeaponAccuracy")}]`
                            }
                            if (item.system.accuracy > 0) {
                                attFormula += !displayRollDetails
                                    ? `+${item.system.accuracy}`
                                    : `+${item.system.accuracy}[${game.i18n.localize("WITCHER.Weapon.Short.WeaponAccuracy")}]`
                            }
                            if (targetOutsideLOS) {
                                attFormula += !displayRollDetails
                                    ? `-3`
                                    : `-3[${game.i18n.localize("WITCHER.Dialog.attackTargetOutsideLOS")}]`;
                            }
                            if (outsideLOS) {
                                attFormula += !displayRollDetails
                                    ? `+3`
                                    : `+3[${game.i18n.localize("WITCHER.Dialog.attackOutsideLOS")}]`;
                            }
                            if (isExtraAttack) {
                                attFormula += !displayRollDetails
                                    ? `-3`
                                    : `-3[${game.i18n.localize("WITCHER.Dialog.attackExtra")}]`;
                            }
                            if (isFastDraw) {
                                attFormula += !displayRollDetails
                                    ? `-3`
                                    : `-3[${game.i18n.localize("WITCHER.Dialog.attackIsFastDraw")}]`;
                            }
                            if (isProne) {
                                attFormula += !displayRollDetails
                                    ? `-2`
                                    : `-2[${game.i18n.localize("WITCHER.Dialog.attackIsProne")}]`;
                            }
                            if (isPinned) {
                                attFormula += !displayRollDetails
                                    ? `+4`
                                    : `+4[${game.i18n.localize("WITCHER.Dialog.attackIsPinned")}]`;
                            }
                            if (isActivelyDodging) {
                                attFormula += !displayRollDetails
                                    ? `-2`
                                    : `-2[${game.i18n.localize("WITCHER.Dialog.attackIsActivelyDodging")}]`;
                            }
                            if (isMoving) {
                                attFormula += !displayRollDetails
                                    ? `-3`
                                    : `-3[${game.i18n.localize("WITCHER.Dialog.attackIsMoving")}]`;
                            }
                            if (isAmbush) {
                                attFormula += !displayRollDetails
                                    ? `+5`
                                    : `+5[${game.i18n.localize("WITCHER.Dialog.attackIsAmbush")}]`;
                            }
                            if (isRicochet) {
                                attFormula += !displayRollDetails
                                    ? `-5`
                                    : `-5[${game.i18n.localize("WITCHER.Dialog.attackIsRicochet")}]`;
                            }
                            if (isBlinded) {
                                attFormula += !displayRollDetails
                                    ? `-3`
                                    : `-3[${game.i18n.localize("WITCHER.Dialog.attackIsBlinded")}]`;
                            }
                            if (isSilhouetted) {
                                attFormula += !displayRollDetails
                                    ? `+2`
                                    : `+2[${game.i18n.localize("WITCHER.Dialog.attackIsSilhouetted")}]`;
                            }
                            if (customAim > 0) {
                                attFormula += !displayRollDetails
                                    ? `+${customAim}`
                                    : `+${customAim}[${game.i18n.localize("WITCHER.Dialog.attackCustom")}]`;
                            }

                            let modifiers;

                            // todo refactor
                            switch (attackSkill.name) {
                                case "Brawling":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.ref.current}+${actor.system.skills.ref.brawling.value}`
                                        : `+${actor.system.stats.ref.current}[${game.i18n.localize("WITCHER.Actor.Stat.Ref")}]+${actor.system.skills.ref.brawling.value}[${game.i18n.localize("WITCHER.SkRefBrawling")}]`;
                                    modifiers = actor.system.skills.ref.brawling.modifiers;
                                    break;
                                case "Melee":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.ref.current}+${actor.system.skills.ref.melee.value}`
                                        : `+${actor.system.stats.ref.current}[${game.i18n.localize("WITCHER.Actor.Stat.Ref")}]+${actor.system.skills.ref.melee.value}[${game.i18n.localize("WITCHER.SkRefMelee")}]`;
                                    modifiers = actor.system.skills.ref.melee.modifiers;
                                    break;
                                case "Small Blades":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.ref.current}+${actor.system.skills.ref.smallblades.value}`
                                        : `+${actor.system.stats.ref.current}[${game.i18n.localize("WITCHER.Actor.Stat.Ref")}]+${actor.system.skills.ref.smallblades.value}[${game.i18n.localize("WITCHER.SkRefSmall")}]`;
                                    modifiers = actor.system.skills.ref.smallblades.modifiers;
                                    break;
                                case "Staff/Spear":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.ref.current}+${actor.system.skills.ref.staffspear.value}`
                                        : `+${actor.system.stats.ref.current}[${game.i18n.localize("WITCHER.Actor.Stat.Ref")}]+${actor.system.skills.ref.staffspear.value}[${game.i18n.localize("WITCHER.SkRefStaff")}]`;
                                    modifiers = actor.system.skills.ref.staffspear.modifiers;
                                    break;
                                case "Swordsmanship":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.ref.current}+${actor.system.skills.ref.swordsmanship.value}`
                                        : `+${actor.system.stats.ref.current}[${game.i18n.localize("WITCHER.Actor.Stat.Ref")}]+${actor.system.skills.ref.swordsmanship.value}[${game.i18n.localize("WITCHER.SkRefSwordsmanship")}]`;
                                    modifiers = actor.system.skills.ref.swordsmanship.modifiers;
                                    break;
                                case "Archery":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.dex.current}+${actor.system.skills.dex.archery.value}`
                                        : `+${actor.system.stats.dex.current}[${game.i18n.localize("WITCHER.Actor.Stat.Dex")}]+${actor.system.skills.dex.archery.value}[${game.i18n.localize("WITCHER.SkDexArchery")}]`;
                                    modifiers = actor.system.skills.dex.archery.modifiers;
                                    break;
                                case "Athletics":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.dex.current}+${actor.system.skills.dex.athletics.value}`
                                        : `+${actor.system.stats.dex.current}[${game.i18n.localize("WITCHER.Actor.Stat.Dex")}]+${actor.system.skills.dex.athletics.value}[${game.i18n.localize("WITCHER.SkDexAthletics")}]`;
                                    modifiers = actor.system.skills.dex.athletics.modifiers;
                                    break;
                                case "Crossbow":
                                    attFormula += !displayRollDetails
                                        ? `+${actor.system.stats.dex.current}+${actor.system.skills.dex.crossbow.value}`
                                        : `+${actor.system.stats.dex.current}[${game.i18n.localize("WITCHER.Actor.Stat.Dex")}]+${actor.system.skills.dex.crossbow.value}[${game.i18n.localize("WITCHER.SkDexCrossbow")}]`;
                                    modifiers = actor.system.skills.dex.crossbow.modifiers;
                                    break;
                            }

                            if (customAtt !== "0") {
                                attFormula += !displayRollDetails ? `+${customAtt}` : `+${customAtt}[${game.i18n.localize("WITCHER.Settings.Custom")}]`;
                            }

                            // todo refactor + add modifiers to config
                            switch (range) {
                                case "pointBlank":
                                    attFormula = !displayRollDetails
                                        ? `${attFormula}+5`
                                        : `${attFormula}+5[${game.i18n.localize("WITCHER.Weapon.Range")}]`;
                                    break;
                                case "medium":
                                    attFormula = !displayRollDetails
                                        ? `${attFormula}-2`
                                        : `${attFormula}-2[${game.i18n.localize("WITCHER.Weapon.Range")}]`;
                                    break;
                                case "long":
                                    attFormula = !displayRollDetails
                                        ? `${attFormula}-4`
                                        : `${attFormula}-4[${game.i18n.localize("WITCHER.Weapon.Range")}]`;
                                    break;
                                case "extreme":
                                    attFormula = !displayRollDetails
                                        ? `${attFormula}-6`
                                        : `${attFormula}-6[${game.i18n.localize("WITCHER.Weapon.Range")}]`;
                                    break;
                            }

                            if (customDmg !== "0") {
                                damageFormula += !displayRollDetails ? `+${customDmg}` : `+${customDmg}[${game.i18n.localize("WITCHER.Settings.Custom")}]`;
                            }
                            let touchedLocation = actor.getLocationObject(location);
                            let LocationFormula = touchedLocation.locationFormula;
                            attFormula += !displayRollDetails
                                ? `${touchedLocation.modifier}`
                                : `${touchedLocation.modifier}[${touchedLocation.alias}]`;

                            // todo refactor + add modifiers to config
                            if (strike === "joint" || strike === "strong") {
                                attFormula = !displayRollDetails
                                    ? `${attFormula}-3`
                                    : `${attFormula}-3[${game.i18n.localize("WITCHER.Dialog.attackStrike")}]`;
                            }

                            attFormula = addModifiersToFormula(modifiers, attFormula)

                            let allEffects = item.system.effects
                            if (ammunition) {
                                let item = actor.items.get(ammunition);
                                let newQuantity = item.system.quantity - 1;
                                item.update({"system.quantity": newQuantity})
                                allEffects.push(...item.system.effects)
                            }

                            if (item.isWeaponThrowable()) {
                                let newQuantity = item.system.quantity - 1;
                                if (newQuantity < 0) {
                                    return
                                }
                                item.update({"system.quantity": newQuantity})
                                allEffects.push(...item.system.effects)
                            }

                            if (item.system.enhancementItems) {
                                item.system.enhancementItems.forEach(element => {
                                    if (element && JSON.stringify(element) !== '{}') {
                                        let enhancement = actor.items.get(element._id);
                                        allEffects.push(...enhancement.system.effects)
                                    }
                                });
                            }

                            let effects = JSON.stringify(item.system.effects)
                            messageData.flavor = `<div class="attack-message"><h1><img src="${item.img}" class="item-img" />${game.i18n.localize("WITCHER.Attack")}: ${item.name}</h1>`;
                            messageData.flavor += `<span>  ${game.i18n.localize("WITCHER.Armor.Location")}: ${touchedLocation.alias} = ${LocationFormula} </span>`;

                            let touchedLocationJSON = JSON.stringify(touchedLocation);
                            messageData.flavor += `<button class="damage" data-img="${item.img}" data-dmg-type="${damageType}" data-name="${item.name}" data-dmg="${damageFormula}" data-location='${touchedLocationJSON}'  data-location-formula="${LocationFormula}" data-strike="${strike}" data-effects='${effects}'>${game.i18n.localize("WITCHER.table.Damage")}</button>`;

                            let config = new RollConfig()
                            config.showResult = false
                            let roll = await extendedRoll(attFormula, messageData, config)

                            if (item.system.rollOnlyDmg) {
                                await rollDamage(item.img, item.name, damageFormula, touchedLocation, LocationFormula, strike, item.system.effects, damageType)
                            } else {
                                await roll.toMessage(messageData);
                            }
                        }
                    }
                }
            }
        }, myDialogOptions).render(true)
    }

    _onSpellDisplay(event) {
        event.preventDefault();
        let section = event.currentTarget.closest(".spell");
        // todo refactor
        switch (section.dataset.spellType) {
            case "noviceSpell":
                this.actor.update({'system.panels.noviceSpellIsOpen': this.actor.system.panels.noviceSpellIsOpen ? false : true});
                break;
            case "journeymanSpell":
                this.actor.update({'system.panels.journeymanSpellIsOpen': this.actor.system.panels.journeymanSpellIsOpen ? false : true});
                break;
            case "masterSpell":
                this.actor.update({'system.panels.masterSpellIsOpen': this.actor.system.panels.masterSpellIsOpen ? false : true});
                break;
            case "ritual":
                this.actor.update({'system.panels.ritualIsOpen': this.actor.system.panels.ritualIsOpen ? false : true});
                break;
            case "hex":
                this.actor.update({'system.panels.hexIsOpen': this.actor.system.panels.hexIsOpen ? false : true});
                break;
            case "magicalgift":
                this.actor.update({'system.panels.magicalgiftIsOpen': this.actor.system.panels.magicalgiftIsOpen ? false : true});
                break;
        }
    }

    _onDerivedModifierDisplay(event) {
        this.actor.update({'system.derivedStats.modifiersIsOpened': this.actor.system.derivedStats.modifiersIsOpened ? false : true});
    }

    /** Do not delete. This method is here to give external modules the possibility to make skill rolls. */
    async _onSkillRoll(statNum, skillNum) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor
        actor.rollSkillCheck(statNum, skillNum);
    }
}
