import WitcherActorSheet from "./actor-sheet.js";
import {witcher} from "../../config.js";
import {getValueByStringPath, sum} from "../../helpers/actor.js";
import {addModifiersToFormula, prepareSystemRef} from "../../helpers/utils.js";
import {RollConfig} from "../../rollConfig.js";
import {extendedRoll} from "../../utils/chat.js";

export default class WitcherCharacterSheet extends WitcherActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["witcher", "sheet", "actor", "character"],
            width: 1120,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
        });
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        // Enhancements section
        html.find(".enhancement-weapon-slot").on("click", this._chooseEnhancement.bind(this));
        html.find(".enhancement-armor-slot").on("click", this._chooseEnhancement.bind(this));

        // Craft section
        html.find(".alchemy-potion").on("click", this._alchemyCraft.bind(this));
        html.find(".crafting-craft").on("click", this._craftingCraft.bind(this));

        // Profession roll
        html.find(".profession-roll").on("click", this._onProfessionRoll.bind(this));

        // Reputation section
        html.find(".reputation-roll").on("click", this._onReputationRoll.bind(this));

        // Heal section
        html.find(".heal-button").on("click", this._onHealRoll.bind(this));

        // Life section
        html.find(".life-event-display").on("click", this._onLifeEventDisplay.bind(this));
    }

    /**
     * Prepare the data structure for items which appear on the actor sheet.
     * Each subclass overrides this method to implement type-specific logic.
     * @param {Object} context
     * @return {undefined}
     */
    _prepareCharacterData(context) {
        let actor = context.actor;
        const IT = witcher.itemTypes;

        // Profession
        context.professions = actor.getListByType(IT.profession);
        context.profession = context.professions[0];

        // Race
        context.races = actor.getListByType(IT.race);
        context.race = context.races[0];

        // Calculate actor stats, skills, profession skills
        context.totalStats = this.calc_total_stats(context.data)
        context.totalSkills = this.calc_total_skills(context.data)
        context.totalProfSkills = this.calc_total_skills_profession(context.data)
        context.capabilities = context.actor.system.capabilities
    }

    /** Enhancements section */
    async _chooseEnhancement(event) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor;
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        let item = actor.items.get(itemId);
        let type = event.currentTarget.closest(".item").dataset.type;

        let enhancements = actor.getListByType(witcher.itemTypes.enhancement)
        if (type === witcher.itemTypes.weapon.name) {
            enhancements = enhancements.filter(e => !e.isApplied()
                && (e.isOfSystemType(witcher.itemTypes.rune) || e.isOfSystemType(witcher.itemTypes.weapon)));
        } else {
            enhancements = enhancements.filter(e => !item.isApplied()
                && (e.isOfSystemType(witcher.itemTypes.armor) || e.isOfSystemType(witcher.itemTypes.glyph)));
        }

        let content = ""
        let quantity = sum(enhancements)
        if (quantity === 0) {
            content += `<div class="error-display">${game.i18n.localize("WITCHER.Enhancement.NoEnhancement")}</div>`
        } else {
            let enhancementsOption = ``
            enhancements.forEach(element => {
                enhancementsOption += `<option value="${element._id}"> ${element.name}(${element.system.quantity}) </option>`;
            });
            content += `<div><label>${game.i18n.localize("WITCHER.Dialog.Enhancement")}: <select name="enhancement">${enhancementsOption}</select></label></div>`
        }

        new Dialog({
            title: `${game.i18n.localize("WITCHER.Enhancement.ChooseTitle")}`,
            content,
            buttons: {
                Cancel: {
                    label: `${game.i18n.localize("WITCHER.Button.Cancel")}`,
                    callback: () => {
                    }
                },
                Apply: {
                    label: `${game.i18n.localize("WITCHER.Dialog.Apply")}`,
                    callback: (html) => {
                        let enhancementId = undefined
                        if (html.find("[name=enhancement]")[0]) {
                            enhancementId = html.find("[name=enhancement]")[0].value;
                        }

                        let chosenEnhancement = actor.items.get(enhancementId)
                        if (item && chosenEnhancement) {
                            let newEnhancementList = []
                            let added = false
                            item.system.enhancementItems.forEach(element => {
                                if ((JSON.stringify(element) === '{}' || !element) && !added) {
                                    element = chosenEnhancement
                                    added = true
                                }
                                newEnhancementList.push(element)
                            });

                            if (type === witcher.itemTypes.weapon.name) {
                                // Adjusting weapon parameters after adding enhancement
                                item.update({'system.enhancementItems': newEnhancementList})
                            } else {
                                let allEffects = item.system.effects
                                allEffects.push(...chosenEnhancement.system.effects)
                                if (chosenEnhancement.system.type === witcher.itemTypes.armor.name) {
                                    // Adjusting armor parameters after adding enhancement
                                    item.update({
                                        'system.enhancementItems': newEnhancementList,
                                        "system.headStopping": item.system.headStopping + chosenEnhancement.system.stopping,
                                        "system.headMaxStopping": item.system.headMaxStopping + chosenEnhancement.system.stopping,
                                        "system.torsoStopping": item.system.torsoStopping + chosenEnhancement.system.stopping,
                                        "system.torsoMaxStopping": item.system.torsoMaxStopping + chosenEnhancement.system.stopping,
                                        "system.leftArmStopping": item.system.leftArmStopping + chosenEnhancement.system.stopping,
                                        "system.leftArmMaxStopping": item.system.leftArmMaxStopping + chosenEnhancement.system.stopping,
                                        "system.rightArmStopping": item.system.rightArmStopping + chosenEnhancement.system.stopping,
                                        "system.rightArmMaxStopping": item.system.rightArmMaxStopping + chosenEnhancement.system.stopping,
                                        "system.leftLegStopping": item.system.leftLegStopping + chosenEnhancement.system.stopping,
                                        "system.leftLegMaxStopping": item.system.leftLegMaxStopping + chosenEnhancement.system.stopping,
                                        "system.rightLegStopping": item.system.rightLegStopping + chosenEnhancement.system.stopping,
                                        "system.rightLegMaxStopping": item.system.rightLegMaxStopping + chosenEnhancement.system.stopping,
                                        'system.bludgeoning': chosenEnhancement.system.bludgeoning,
                                        'system.slashing': chosenEnhancement.system.slashing,
                                        'system.piercing': chosenEnhancement.system.piercing,
                                        'system.effects': allEffects
                                    })
                                } else {
                                    // Adjusting effects parameters after adding enhancement
                                    item.update({'system.effects': allEffects})
                                }
                            }

                            // todo remove hardcoded name
                            let newName = chosenEnhancement.name + "(Applied)"
                            let newQuantity = chosenEnhancement.system.quantity
                            chosenEnhancement.update({
                                'name': newName,
                                'system.applied': true,
                                'system.quantity': 1
                            })
                            // todo check what happens when chosenEnhancement count >= 0
                            if (newQuantity > 1) {
                                newQuantity -= 1
                                this._addItem(actor, chosenEnhancement, newQuantity, true)
                            }
                        }
                    }
                }
            }
        }).render(true)
    }

    /** Craft section */
    //todo check
    async _alchemyCraft(event) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        let item = actor.items.get(itemId);

        let content = `<label>${game.i18n.localize("WITCHER.Dialog.Crafting")} ${item.name}</label> <br />`;

        let messageData = {
            speaker: actor.getSpeaker(),
            flavor: `<h1>Crafting</h1>`,
        }

        let areCraftComponentsEnough = true;

        content += `<div class="components-display">`
        let alchemyCraftComponents = item.populateAlchemyCraftComponentsList();
        alchemyCraftComponents
            .filter(a => a.quantity > 0)
            .forEach(a => {
                content += `<div class="flex">${a.content}</div>`

                let ownedSubstance = actor.getSubstance(a)
                let ownedSubstanceCount = sum(ownedSubstance)
                if (ownedSubstanceCount < Number(a.quantity)) {
                    let missing = a.quantity - ownedSubstanceCount
                    content += `<span class="error-display">${game.i18n.localize("WITCHER.Dialog.NoComponents")}: ${missing} ${a.alias}</span><br />`
                    areCraftComponentsEnough = false
                }
            });
        content += `</div>`

        content += `<label>${game.i18n.localize("WITCHER.Dialog.CraftingDiagram")}: <input type="checkbox" name="hasDiagram"></label> <br />`
        content += `<label>${game.i18n.localize("WITCHER.Dialog.RealCrafting")}: <input type="checkbox" name="realCraft"></label> <br />`

        new Dialog({
            title: `${game.i18n.localize("WITCHER.Dialog.AlchemyTitle")}`,
            content,
            buttons: {
                Craft: {
                    label: `${game.i18n.localize("WITCHER.Dialog.ButtonCraft")}`,
                    callback: async html => {
                        let stat = actor.system.stats.cra.current;
                        let statName = game.i18n.localize(actor.system.stats.cra.label);
                        let skill = actor.system.skills.cra.alchemy.value;
                        let skillName = game.i18n.localize(actor.system.skills.cra.alchemy.label);
                        let hasDiagram = html.find("[name=hasDiagram]").prop("checked");
                        let realCraft = html.find("[name=realCraft]").prop("checked");
                        skillName = skillName.replace(" (2)", "");
                        messageData.flavor = `<h1>${game.i18n.localize("WITCHER.Dialog.CraftingAlchemycal")}</h1>`,
                            messageData.flavor += `<label>${game.i18n.localize("WITCHER.Dialog.Crafting")}:</label> <b>${item.name}</b> <br />`,
                            messageData.flavor += `<label>${game.i18n.localize("WITCHER.Dialog.after")}:</label> <b>${item.system.craftingTime}</b> <br />`,
                            messageData.flavor += `${game.i18n.localize("WITCHER.Diagram.alchemyDC")} ${item.system.alchemyDC}`;

                        if (!item.isAlchemicalCraft()) {
                            stat = actor.system.stats.cra.current;
                            skill = actor.system.skills.cra.crafting.value;
                            messageData.flavor = `${game.i18n.localize("WITCHER.Diagram.craftingDC")} ${item.system.craftingDC}`;
                        }

                        let rollFormula = !displayRollDetails ? `1d10+${stat}+${skill}` : `1d10+${stat}[${statName}]+${skill}[${skillName}]`;

                        if (hasDiagram) {
                            rollFormula += !displayRollDetails ? `+2` : `+2[${game.i18n.localize("WITCHER.Dialog.Diagram")}]`
                        }

                        rollFormula = addModifiersToFormula(actor.system.skills.cra.alchemy.modifiers, rollFormula)

                        let config = new RollConfig();
                        config.showCrit = true
                        config.showSuccess = true
                        config.threshold = item.system.alchemyDC
                        config.thresholdDesc = skillName
                        config.messageOnSuccess = game.i18n.localize("WITCHER.craft.ItemsSuccessfullyCrafted")
                        config.messageOnFailure = game.i18n.localize("WITCHER.craft.ItemsNotCrafted")

                        if (realCraft) {
                            if (areCraftComponentsEnough) {
                                await item.realCraft(rollFormula, messageData, config);
                            } else {
                                return ui.notifications.error(game.i18n.localize("WITCHER.Dialog.NoComponents") + " " + item.system.associatedItem.name)
                            }
                        } else {
                            // Craft without automatic removal components and without real crafting of an item
                            await extendedRoll(rollFormula, messageData, config)
                        }
                    }
                }
            }
        }).render(true)
    }

    //todo check
    async _craftingCraft(event) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        let item = actor.items.get(itemId);

        let content = `<label>${game.i18n.localize("WITCHER.Dialog.Crafting")} ${item.name}</label> <br />`;

        let messageData = {
            speaker: actor.getSpeaker(),
            flavor: `<h1>Crafting</h1>`,
        }

        let areCraftComponentsEnough = true;
        content += `<div class="components-display">`
        item.system.craftingComponents.forEach(element => {
            content += `<div class="flex"><b>${element.name}</b>(${element.quantity}) </div>`
            let ownedComponent = actor.findNeededComponent(element.name);
            let componentQuantity = sum(ownedComponent);
            if (componentQuantity < Number(element.quantity)) {
                let missing = element.quantity - Number(componentQuantity)
                areCraftComponentsEnough = false;
                content += `<span class="error-display">${game.i18n.localize("WITCHER.Dialog.NoComponents")}: ${missing} ${element.name}</span><br />`
            }
        });
        content += `</div>`

        content += `<label>${game.i18n.localize("WITCHER.Dialog.CraftingDiagram")}: <input type="checkbox" name="hasDiagram"></label> <br />`
        content += `<label>${game.i18n.localize("WITCHER.Dialog.RealCrafting")}: <input type="checkbox" name="realCraft"></label> <br />`

        new Dialog({
            title: `${game.i18n.localize("WITCHER.Dialog.CraftingTitle")}`,
            content,
            buttons: {
                Craft: {
                    label: `${game.i18n.localize("WITCHER.Dialog.ButtonCraft")}`,
                    callback: async html => {
                        let stat = actor.system.stats.cra.current;
                        let statName = game.i18n.localize(actor.system.stats.cra.label);
                        let skill = actor.system.skills.cra.crafting.value;
                        let skillName = game.i18n.localize(actor.system.skills.cra.crafting.label);
                        let hasDiagram = html.find("[name=hasDiagram]").prop("checked");
                        let realCraft = html.find("[name=realCraft]").prop("checked");
                        skillName = skillName.replace(" (2)", "");
                        messageData.flavor = `<h1>${game.i18n.localize("WITCHER.Dialog.CraftingItem")}</h1>`,
                            messageData.flavor += `<label>${game.i18n.localize("WITCHER.Dialog.Crafting")}:</label> <b>${item.name}</b> <br />`,
                            messageData.flavor += `<label>${game.i18n.localize("WITCHER.Dialog.after")}:</label> <b>${item.system.craftingTime}</b> <br />`,
                            messageData.flavor += `${game.i18n.localize("WITCHER.Diagram.craftingDC")} ${item.system.craftingDC}`;

                        let rollFormula = !displayRollDetails ? `1d10+${stat}+${skill}` : `1d10+${stat}[${statName}]+${skill}[${skillName}]`;

                        if (hasDiagram) {
                            rollFormula += !displayRollDetails ? `+2` : `+2[${game.i18n.localize("WITCHER.Dialog.Diagram")}]`
                        }

                        rollFormula = addModifiersToFormula(actor.system.skills.cra.crafting.modifiers, rollFormula)

                        let config = new RollConfig();
                        config.showCrit = true
                        config.showSuccess = true
                        config.threshold = item.system.craftingDC
                        config.thresholdDesc = skillName
                        config.messageOnSuccess = game.i18n.localize("WITCHER.craft.ItemsSuccessfullyCrafted")
                        config.messageOnFailure = game.i18n.localize("WITCHER.craft.ItemsNotCrafted")

                        if (realCraft) {
                            if (areCraftComponentsEnough) {
                                await item.realCraft(rollFormula, messageData, config);
                            } else {
                                return ui.notifications.error(game.i18n.localize("WITCHER.Dialog.NoComponents") + " " + item.system.associatedItem.name)
                            }
                        } else {
                            // Craft without automatic removal components and without real crafting of an item
                            await extendedRoll(rollFormula, messageData, config)
                        }
                    }
                }
            }
        }).render(true)
    }

    /** Profession section */
    async _onProfessionRoll(event) {
        event.preventDefault();
        let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")
        let stat = event.currentTarget.closest(".profession-display").dataset.stat;
        let level = event.currentTarget.closest(".profession-display").dataset.level;
        let name = event.currentTarget.closest(".profession-display").dataset.name;
        let effect = event.currentTarget.closest(".profession-display").dataset.effect;

        // todo throw proper error
        if (!stat || !witcher.statTypes.stats.list[stat]) {
            return
        }

        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        let statRef = prepareSystemRef(witcher.statTypes.stats.list[stat].ref, "current")
        let statValue = getValueByStringPath(actor, statRef)
        let statName = witcher.statTypes.stats.list[stat].aliasShort

        let rollFormula = witcher.rollFormulas.default
        rollFormula += !displayRollDetails
            ? `+${statValue}+${level}`
            : `+${statValue}[${game.i18n.localize(statName)}]+${level}[${name}]`;

        new Dialog({
            title: `${game.i18n.localize("WITCHER.Dialog.profession.skill")}: ${name}`,
            content: `<label>${game.i18n.localize("WITCHER.Dialog.attackCustom")}: <input name="customModifiers" value=0></label>`,
            buttons: {
                continue: {
                    label: game.i18n.localize("WITCHER.Button.Continue"),
                    callback: async html => {
                        let customAtt = html.find("[name=customModifiers]")[0].value;
                        if (customAtt < 0) {
                            rollFormula += !displayRollDetails ? `${customAtt}` : `${customAtt}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
                        }
                        if (customAtt > 0) {
                            rollFormula += !displayRollDetails ? `+${customAtt}` : `+${customAtt}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
                        }

                        let messageData = {
                            speaker: actor.getSpeaker(),
                            flavor: `<h2>${name}</h2>${effect}`
                        }

                        let config = new RollConfig()
                        config.showCrit = true
                        await extendedRoll(rollFormula, messageData, config)
                    }
                }
            }
        }).render(true)
    }

    /** Reputation section */
    async _onReputationRoll(event) {
        /**
         * @type {WitcherActor}
         */
        let actor = this.actor

        let dialogTemplate = `<h1>${game.i18n.localize("WITCHER.Reputation")}</h1>`;
        if (actor.system.reputation.modifiers.length > 0) {
            dialogTemplate += `<label>${game.i18n.localize("WITCHER.Apply.Mod")}</label>`;
            actor.system.reputation.modifiers.forEach(mod => dialogTemplate += `<div><input id="${mod.name.replace(/\s/g, '')}" type="checkbox" unchecked/> ${mod.name}(${mod.value})</div>`)
        }
        new Dialog({
            title: game.i18n.localize("WITCHER.ReputationTitle"),
            content: dialogTemplate,
            buttons: {
                t1: {
                    label: `${game.i18n.localize("WITCHER.ReputationButton.Save")}`,
                    callback: (async html => {
                        let statValue = actor.system.reputation.max

                        actor.system.reputation.modifiers.forEach(mod => {
                            const noSpacesName = mod.name.replace(/\s/g, '')
                            if (html.find(`#${noSpacesName}`)[0].checked) {
                                statValue += Number(mod.value)
                            }
                        });

                        let messageData = {speaker: actor.getSpeaker()}
                        messageData.flavor = `
              <h2>${game.i18n.localize("WITCHER.ReputationTitle")}: ${game.i18n.localize("WITCHER.ReputationSave.Title")}</h2>
              <div class="roll-summary">
                <div class="dice-formula">${game.i18n.localize("WITCHER.Chat.SaveText")}: <b>${statValue}</b></div>
              </div>
              <hr />`

                        let config = new RollConfig()
                        config.showSuccess = true
                        config.reversal = true
                        config.threshold = statValue

                        await extendedRoll(witcher.rollFormulas.default, messageData, config)
                    })
                },
                t2: {
                    label: `${game.i18n.localize("WITCHER.ReputationButton.FaceDown")}`,
                    callback: (async html => {
                        let repValue = actor.system.reputation.max

                        actor.system.reputation.modifiers.forEach(mod => {
                            const noSpacesName = mod.name.replace(/\s/g, '')
                            if (html.find(`#${noSpacesName}`)[0].checked) {
                                repValue += Number(mod.value)
                            }
                        });

                        let messageData = {speaker: actor.getSpeaker()}
                        let rollFormula = `${witcher.rollFormulas.default} + ${Number(repValue)}[${game.i18n.localize("WITCHER.Reputation")}] + ${Number(actor.system.stats.will.current)}[${game.i18n.localize("WITCHER.StWill")}]`
                        messageData.flavor = `
              <h2>${game.i18n.localize("WITCHER.ReputationTitle")}: ${game.i18n.localize("WITCHER.ReputationFaceDown.Title")}</h2>
              <div class="roll-summary">
                <div class="dice-formula">${game.i18n.localize("WITCHER.context.Result")}: <b>${rollFormula}</b></div>
              </div>
              <hr />`

                        await extendedRoll(rollFormula, messageData, new RollConfig())
                    })
                }
            }
        }).render(true);
    }

    /** Heal section */
    async _onHealRoll() {
        //todo use real template
        let dialogTemplate = `
      <h1>${game.i18n.localize("WITCHER.Heal.title")}</h1>
      <div class="flex">
        <div>
          <div><input id="R" type="checkbox" unchecked/> ${game.i18n.localize("WITCHER.Heal.resting")}</div>
          <div><input id="SF" type="checkbox" unchecked/> ${game.i18n.localize("WITCHER.Heal.sterilized")}</div>
        </div>
        <div>
          <div><input id="HH" type="checkbox" unchecked/> ${game.i18n.localize("WITCHER.Heal.healinghand")}</div>
            <div><input id="HT" type="checkbox" unchecked/> ${game.i18n.localize("WITCHER.Heal.healingTent")}</div>
        </div>
      </div>`;

        new Dialog({
            title: game.i18n.localize("WITCHER.Heal.dialogTitle"),
            content: dialogTemplate,
            buttons: {
                t1: {
                    label: game.i18n.localize("WITCHER.Heal.button"),
                    callback: async (html) => {
                        let rested = html.find("#R")[0].checked;
                        let sterFluid = html.find("#SF")[0].checked;
                        let healHand = html.find("#HH")[0].checked;
                        let healTent = html.find("#HT")[0].checked;

                        let actor = this.actor;
                        let rec = actor.system.coreStats.rec.current;
                        let curHealth = actor.system.derivedStats.hp.value;
                        let total_rec = 0;
                        let maxHealth = actor.system.derivedStats.hp.max;

                        //Calculate healed amount
                        if (rested) {
                            console.log("Spent Day Resting");
                            total_rec += rec;
                        } else {
                            console.log("Spent Day Active");
                            total_rec += Math.floor(rec / 2);
                        }
                        if (sterFluid) {
                            console.log("Add Sterilising Fluid Bonus");
                            total_rec += witcher.healModifiers.fluid;
                        }
                        if (healHand) {
                            console.log("Add Healing Hands Bonus");
                            total_rec += witcher.healModifiers.healingHands;
                        }
                        if (healTent) {
                            console.log("Add Healing Tent Bonus");
                            total_rec += witcher.healModifiers.healingTent;
                        }

                        //Update actor health
                        await actor.update({"system.derivedStats.hp.value": Math.min(curHealth + total_rec, maxHealth)})
                        setTimeout(() => {
                            let newSTA = actor.system.derivedStats.sta.max;
                            // Delay stamina refill to allow actor sheet to update max STA value if previously Seriously Wounded or in Death State,
                            // otherwise it would refill to the weakened max STA value
                            actor.update({"system.derivedStats.sta.value": newSTA});
                        }, 400);

                        ui.notifications.info(`${actor.name} ${game.i18n.localize("WITCHER.Heal.recovered")} ${rested ? game.i18n.localize("WITCHER.Heal.restful") : game.i18n.localize("WITCHER.Heal.active")} ${game.i18n.localize("WITCHER.Heal.day")}`)

                        //Remove add one day for each Crit wound and removes it if equals to max days.
                        const critList = Object.values(actor.system.critWounds).map((details) => details);
                        let newCritList = []
                        critList.forEach(crit => {
                            crit.daysHealed += 1
                            if (crit.healingTime <= 0 || crit.daysHealed < crit.healingTime) {
                                newCritList.push(crit)
                            }
                        });
                        actor.update({"system.critWounds": newCritList});
                    }
                },
                t2: {
                    label: `${game.i18n.localize("WITCHER.Button.Cancel")}`,
                }
            },
        }).render(true);
    }

    /** Life section */
    _onLifeEventDisplay(event) {
        event.preventDefault();
        let section = event.currentTarget.closest(".lifeEvents");
        //todo refactor
        switch (section.dataset.event) {
            case "10":
                this.actor.update({'system.general.lifeEvents.10.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "20":
                this.actor.update({'system.general.lifeEvents.20.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "30":
                this.actor.update({'system.general.lifeEvents.30.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "40":
                this.actor.update({'system.general.lifeEvents.40.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "50":
                this.actor.update({'system.general.lifeEvents.50.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "60":
                this.actor.update({'system.general.lifeEvents.60.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "70":
                this.actor.update({'system.general.lifeEvents.70.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "80":
                this.actor.update({'system.general.lifeEvents.80.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "90":
                this.actor.update({'system.general.lifeEvents.90.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "100":
                this.actor.update({'system.general.lifeEvents.100.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "110":
                this.actor.update({'system.general.lifeEvents.110.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "120":
                this.actor.update({'system.general.lifeEvents.120.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "130":
                this.actor.update({'system.general.lifeEvents.130.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "140":
                this.actor.update({'system.general.lifeEvents.140.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "150":
                this.actor.update({'system.general.lifeEvents.150.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "160":
                this.actor.update({'system.general.lifeEvents.160.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "170":
                this.actor.update({'system.general.lifeEvents.170.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "180":
                this.actor.update({'system.general.lifeEvents.180.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "190":
                this.actor.update({'system.general.lifeEvents.190.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
            case "200":
                this.actor.update({'system.general.lifeEvents.200.isOpened': this.actor.system.general.lifeEvents[section.dataset.event].isOpened ? false : true});
                break;
        }
    }

    calc_total_skills_profession(data) {
        let totalSkills = 0;
        if (data.profession) {
            totalSkills += Number(data.profession.system.definingSkill.level);

            totalSkills += Number(data.profession.system.skillPath1.skill1.level)
                + Number(data.profession.system.skillPath1.skill2.level)
                + Number(data.profession.system.skillPath1.skill3.level)

            totalSkills += Number(data.profession.system.skillPath2.skill1.level)
                + Number(data.profession.system.skillPath2.skill2.level)
                + Number(data.profession.system.skillPath2.skill3.level)

            totalSkills += Number(data.profession.system.skillPath3.skill1.level)
                + Number(data.profession.system.skillPath3.skill2.level)
                + Number(data.profession.system.skillPath3.skill3.level)
        }
        return totalSkills;
    }

    calc_total_skills(data) {
        let totalSkills = 0;
        for (let element in data.system.skills) {
            for (let skill in data.system.skills[element]) {
                let skillLabel = game.i18n.localize(data.system.skills[element][skill].label)
                if (skillLabel?.includes("(2)")) {
                    totalSkills += data.system.skills[element][skill].value * 2;
                } else {
                    totalSkills += data.system.skills[element][skill].value;
                }
            }
        }
        return totalSkills;
    }

    calc_total_stats(data) {
        let totalStats = 0;
        for (let element in data.system.stats) {
            totalStats += data.system.stats[element].max;
        }
        return totalStats;
    }
}
