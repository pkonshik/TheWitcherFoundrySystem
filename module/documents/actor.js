import {witcher} from "../config.js";
import {currencyWeight, getValueByStringPath, sum, weight} from "../helpers/actor.js";
import {extendedRoll} from "../utils/chat.js";
import {addModifiersToFormula, getRandomInt, prepareSystemRef} from "../helpers/utils.js";
import {RollConfig} from "../rollConfig.js";

export default class WitcherActor extends Actor {

    /** @override */
    prepareData() {
        // Prepare data for the actor. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }

    /** @override */
    prepareBaseData() {
        // Data modifications in this step occur before processing embedded
        // documents or derived data.
    }

    /**
     * @override
     * On any change to the Stats, the Derived Stats need to be updated appropriately. The base = Will+Body/2. HP and Stamina = base * 5.
     * Recovery and Stun = base. Stun can be a maximum of 10. Encumbrance = Body*10. Run = Speed*3. Leap = Run/5. Punch and Kick bonuses are determined
     * with the Hand to Hand Table, page 48 of Witcher TRPG Handbook.
     */
    prepareDerivedData() {
        if (this.type !== "character" && this.type !== "monster") {
            // nothing to calculate for loot sheet
            return
        }

        // formula from the core book
        const base = Math.floor((this.system.stats.body.current + this.system.stats.will.current) / 2);
        // formula from the core book
        const baseMax = Math.floor((this.system.stats.body.max + this.system.stats.will.max) / 2);
        // melee bonus can be from -4 to +8 depending on the body.current
        const meleeBonus = Math.ceil((this.system.stats.body.current - 6) / 2) * 2;

        let intTotalModifiers = 0;
        let refTotalModifiers = 0;
        let dexTotalModifiers = 0;
        let bodyTotalModifiers = 0;
        let spdTotalModifiers = 0;
        let empTotalModifiers = 0;
        let craTotalModifiers = 0;
        let willTotalModifiers = 0;
        let luckTotalModifiers = 0;
        let intDivider = 1;
        let refDivider = 1;
        let dexDivider = 1;
        let bodyDivider = 1;
        let spdDivider = 1;
        let empDivider = 1;
        let craDivider = 1;
        let willDivider = 1;
        let luckDivider = 1;
        this.system.stats.int.modifiers.forEach(item => intTotalModifiers += Number(item.value));
        this.system.stats.ref.modifiers.forEach(item => refTotalModifiers += Number(item.value));
        this.system.stats.dex.modifiers.forEach(item => dexTotalModifiers += Number(item.value));
        this.system.stats.body.modifiers.forEach(item => bodyTotalModifiers += Number(item.value));
        this.system.stats.spd.modifiers.forEach(item => spdTotalModifiers += Number(item.value));
        this.system.stats.emp.modifiers.forEach(item => empTotalModifiers += Number(item.value));
        this.system.stats.cra.modifiers.forEach(item => craTotalModifiers += Number(item.value));
        this.system.stats.will.modifiers.forEach(item => willTotalModifiers += Number(item.value));
        this.system.stats.luck.modifiers.forEach(item => luckTotalModifiers += Number(item.value));

        let activeEffects = this.getListByType(witcher.itemTypes.effect).filter(e => e.system.isActive);
        activeEffects.forEach(item => {
            item.system.stats.forEach(stat => {
                switch (stat.stat) {
                    case "WITCHER.Actor.Stat.Int":
                        if (stat.modifier.includes?.("/")) {
                            intDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            intTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Ref":
                        if (stat.modifier.includes?.("/")) {
                            refDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            refTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Dex":
                        if (stat.modifier.includes?.("/")) {
                            dexDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            dexTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Body":
                        if (stat.modifier.includes?.("/")) {
                            bodyDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            bodyTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Spd":
                        if (stat.modifier.includes?.("/")) {
                            spdDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            spdTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Emp":
                        if (stat.modifier.includes?.("/")) {
                            empDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            empTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Cra":
                        if (stat.modifier.includes?.("/")) {
                            craDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            craTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Will":
                        if (stat.modifier.includes?.("/")) {
                            willDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            willTotalModifiers += Number(stat.modifier)
                        }
                        break;
                    case "WITCHER.Actor.Stat.Luck":
                        if (stat.modifier.includes?.("/")) {
                            luckDivider = Number(stat.modifier.replace("/", ''));
                        } else {
                            luckTotalModifiers += Number(stat.modifier)
                        }
                        break;
                }
            })
        });

        let stunTotalModifiers = 0;
        let runTotalModifiers = 0;
        let leapTotalModifiers = 0;
        let encTotalModifiers = 0;
        let recTotalModifiers = 0;
        let wtTotalModifiers = 0;
        let stunDivider = 1;
        let runDivider = 1;
        let leapDivider = 1;
        let encDivider = 1;
        let recDivider = 1;
        let wtDivider = 1;
        this.system.coreStats.stun.modifiers.forEach(item => stunTotalModifiers += Number(item.value));
        this.system.coreStats.run.modifiers.forEach(item => runTotalModifiers += Number(item.value));
        this.system.coreStats.leap.modifiers.forEach(item => leapTotalModifiers += Number(item.value));
        this.system.coreStats.enc.modifiers.forEach(item => encTotalModifiers += Number(item.value));
        this.system.coreStats.rec.modifiers.forEach(item => recTotalModifiers += Number(item.value));
        this.system.coreStats.woundThreshold.modifiers.forEach(item => wtTotalModifiers += Number(item.value));

        // formula from the core book for max carrying weight
        let currentEncumbrance = (this.system.stats.body.max + bodyTotalModifiers) * 10 + encTotalModifiers

        let totalWeights = weight(this.items) + currencyWeight(this.system.currency);

        let encDiff = 0
        if (currentEncumbrance < totalWeights) {
            encDiff = Math.ceil((totalWeights - currentEncumbrance) / 5)
        }
        let armorEnc = this.getArmorEncumbrance()

        activeEffects.forEach(item => {
            item.system.derived.forEach(derived => {
                switch (derived.derivedStat) {
                    case "WITCHER.Actor.CoreStat.Stun":
                        if (derived.modifier.includes?.("/")) {
                            stunDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            stunTotalModifiers += Number(derived.modifier)
                        }
                        break;
                    case "WITCHER.Actor.CoreStat.Run":
                        if (derived.modifier.includes?.("/")) {
                            runDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            runTotalModifiers += Number(derived.modifier)
                        }
                        break;
                    case "WITCHER.Actor.CoreStat.Leap":
                        if (derived.modifier.includes?.("/")) {
                            leapDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            leapTotalModifiers += Number(derived.modifier)
                        }
                        break;
                    case "WITCHER.Actor.CoreStat.Enc":
                        if (derived.modifier.includes?.("/")) {
                            encDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            encTotalModifiers += Number(derived.modifier)
                        }
                        break;
                    case "WITCHER.Actor.CoreStat.Rec":
                        if (derived.modifier.includes?.("/")) {
                            recDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            recTotalModifiers += Number(derived.modifier)
                        }
                        break;
                    case "WITCHER.Actor.CoreStat.woundThreshold":
                        if (derived.modifier.includes?.("/")) {
                            wtDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            wtTotalModifiers += Number(derived.modifier)
                        }
                        break;
                }
            })
        });

        // recalculate current values of base stats
        let curInt = Math.floor((this.system.stats.int.max + intTotalModifiers) / intDivider);
        // reduce reaction, speed, dexterity for overweight 1 pt for 5 points of overweight
        // armor reduces dexterity, reaction as well
        let curRef = Math.floor((this.system.stats.ref.max + refTotalModifiers - armorEnc - encDiff) / refDivider);
        let curDex = Math.floor((this.system.stats.dex.max + dexTotalModifiers - armorEnc - encDiff) / dexDivider);
        let curSpd = Math.floor((this.system.stats.spd.max + spdTotalModifiers - encDiff) / spdDivider);

        let curBody = Math.floor((this.system.stats.body.max + bodyTotalModifiers) / bodyDivider);
        let curEmp = Math.floor((this.system.stats.emp.max + empTotalModifiers) / empDivider);
        let curCra = Math.floor((this.system.stats.cra.max + craTotalModifiers) / craDivider);
        let curWill = Math.floor((this.system.stats.will.max + willTotalModifiers) / willDivider);
        let curLuck = Math.floor((this.system.stats.luck.max + luckTotalModifiers) / luckDivider);

        // Calculate health based values
        // TODO check
        let isDead = false;
        let isWounded = false;
        let HPValue = this.system.derivedStats.hp.value;
        if (HPValue <= 0) {
            isDead = true
            curInt = Math.floor((this.system.stats.int.max + intTotalModifiers) / 3 / intDivider)
            curRef = Math.floor((this.system.stats.ref.max + refTotalModifiers - armorEnc - encDiff) / 3 / dexDivider)
            curDex = Math.floor((this.system.stats.dex.max + dexTotalModifiers - armorEnc - encDiff) / 3 / refDivider)
            curSpd = Math.floor((this.system.stats.spd.max + spdTotalModifiers - encDiff) / 3 / spdDivider)
            curBody = Math.floor((this.system.stats.body.max + bodyTotalModifiers) / 3 / bodyDivider)
            curEmp = Math.floor((this.system.stats.emp.max + empTotalModifiers) / 3 / empDivider)
            curCra = Math.floor((this.system.stats.cra.max + craTotalModifiers) / 3 / craDivider)
            curWill = Math.floor((this.system.stats.will.max + willTotalModifiers) / 3 / willDivider)
            curLuck = Math.floor((this.system.stats.luck.max + luckTotalModifiers) / 3 / luckDivider)
        } else if (HPValue < this.system.coreStats.woundThreshold.current > 0) {
            isWounded = true
            curRef = Math.floor((this.system.stats.ref.max + refTotalModifiers - armorEnc - encDiff) / 2 / refDivider)
            curDex = Math.floor((this.system.stats.dex.max + dexTotalModifiers - armorEnc - encDiff) / 2 / dexDivider)
            curInt = Math.floor((this.system.stats.int.max + intTotalModifiers) / 2 / intDivider)
            curWill = Math.floor((this.system.stats.will.max + willTotalModifiers) / 2 / willDivider)
        }

        let hpTotalModifiers = 0;
        let staTotalModifiers = 0;
        let resTotalModifiers = 0;
        let focusTotalModifiers = 0;
        let hpDivider = 1;
        let staDivider = 1;
        this.system.derivedStats.hp.modifiers.forEach(item => hpTotalModifiers += Number(item.value));
        this.system.derivedStats.sta.modifiers.forEach(item => staTotalModifiers += Number(item.value));
        this.system.derivedStats.resolve.modifiers.forEach(item => resTotalModifiers += Number(item.value));
        this.system.derivedStats.focus.modifiers.forEach(item => focusTotalModifiers += Number(item.value));
        activeEffects.forEach(item => {
            item.system.derived.forEach(derived => {
                switch (derived.derivedStat) {
                    case "WITCHER.Actor.DerStat.HP":
                        if (derived.modifier.includes?.("/")) {
                            hpDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            hpTotalModifiers += Number(derived.modifier)
                        }
                        break;
                    case "WITCHER.Actor.DerStat.Sta":
                        if (derived.modifier.includes?.("/")) {
                            staDivider = Number(derived.modifier.replace("/", ''));
                        } else {
                            staTotalModifiers += Number(derived.modifier)
                        }
                        break;
                }
            })
        });

        let curHp = this.system.derivedStats.hp.max + hpTotalModifiers;
        let curSta = this.system.derivedStats.sta.max + staTotalModifiers;
        let curRes = this.system.derivedStats.resolve.max + resTotalModifiers;
        let curFocus = this.system.derivedStats.focus.max + focusTotalModifiers;

        // taken from core book table of physical parameters calculation
        let unmodifiedMaxHp = baseMax * 5

        if (this.system.customStat !== true) {
            curHp = Math.floor((base * 5 + hpTotalModifiers) / hpDivider)
            curSta = Math.floor((base * 5 + staTotalModifiers) / staDivider)
            curRes = (Math.floor((curWill + curInt) / 2) * 5) + resTotalModifiers
            curFocus = (Math.floor((curWill + curInt) / 2) * 3) + focusTotalModifiers
        }

        this.update({
            'system.deathStateApplied': isDead,
            'system.woundThresholdApplied': isWounded,
            'system.stats.int.current': curInt,
            'system.stats.ref.current': curRef,
            'system.stats.dex.current': curDex,
            'system.stats.body.current': curBody,
            'system.stats.spd.current': curSpd,
            'system.stats.emp.current': curEmp,
            'system.stats.cra.current': curCra,
            'system.stats.will.current': curWill,
            'system.stats.luck.current': curLuck,

            'system.derivedStats.hp.max': curHp,
            'system.derivedStats.hp.unmodifiedMax': unmodifiedMaxHp,
            'system.derivedStats.sta.max': curSta,
            'system.derivedStats.resolve.max': curRes,
            'system.derivedStats.focus.max': curFocus,

            'system.coreStats.stun.current': Math.floor((Math.clamped(base, 1, 10) + stunTotalModifiers) / stunDivider),
            'system.coreStats.stun.max': Math.clamped(baseMax, 1, 10),

            'system.coreStats.enc.current': Math.floor((this.system.stats.body.current * 10 + encTotalModifiers) / encDivider),
            'system.coreStats.enc.max': this.system.stats.body.current * 10,

            'system.coreStats.run.current': Math.floor((this.system.stats.spd.current * 3 + runTotalModifiers) / runDivider),
            'system.coreStats.run.max': this.system.stats.spd.current * 3,

            'system.coreStats.leap.current': Math.floor((this.system.stats.spd.current * 3 / 5) + leapTotalModifiers) / leapDivider,
            'system.coreStats.leap.max': Math.floor(this.system.stats.spd.max * 3 / 5),

            'system.coreStats.rec.current': Math.floor((base + recTotalModifiers) / recDivider),
            'system.coreStats.rec.max': baseMax,

            'system.coreStats.woundThreshold.current': Math.floor((baseMax + wtTotalModifiers) / wtDivider),
            'system.coreStats.woundThreshold.max': baseMax,

            'system.attackStats.meleeBonus': meleeBonus,
            'system.attackStats.punch.value': `1d6+${meleeBonus}`,
            'system.attackStats.kick.value': `1d6+${4 + meleeBonus}`,
        });
    }

    /**
     * Can be called from witcher.js
     */
    async rollItem(itemId) {
        //todo check
        await this.sheet._onItemRoll(null, itemId)
    }

    /**
     * Can be called from witcher.js
     */
    async rollSpell(itemId) {
        //todo check
        await this.sheet._onSpellRoll(null, itemId)
    }

    /**
     * Return controlled token
     * @return {TokenDocument}
     */
    getControlledToken() {
        let tokens = game.canvas.tokens.controlled.slice()
        let token;
        if (tokens.length === 0) {
            if (game.user.character) {
                token = game.user.character.token
            } else if (this.token) {
                token = this.token
            } else {
                ui.notifications.error(game.i18n.localize("WITCHER.Context.SelectActor"));
            }
        } else {
            token = tokens[0].document
        }

        return token;
    }

    getDamageFlags() {
        return {
            "witcher": {"origin": {"name": this.name}},
            "damage": true,
        }
    }

    getDefenceSuccessFlags(defenceSkill) {
        return {
            "witcher": {"origin": {"name": this.name}},
            "defenceSkill": defenceSkill,
            "defence": true,
        }
    }

    getNoDamageFlags() {
        return {
            "witcher": {"origin": {"name": this.name}},
            "damage": false,
        }
    }

    getDefenceFailFlags(defenceSkill) {
        return {
            "witcher": {"origin": {"name": this.name}},
            "defenceSkill": defenceSkill,
            "defence": false,
        }
    }

    getSpeaker() {
        return {
            "alias": this.name,
            "actor": this,
            "scene": game.scenes.current,
            "token": this.getControlledToken(),
        };
    }

    /**
     * Checks whether amount of item is enough for throwing
     * @param {WitcherItem} item
     * @return {boolean}
     */
    isEnoughThrowableWeapon(item) {
        if (item.system.isThrowable) {
            let throwableItems = this.items.filter(w => w.isOfType(witcher.itemTypes.weapon, item.name));

            let quantity = throwableItems[0].system.quantity >= 0 ?
                throwableItems[0].system.quantity :
                sum(throwableItems);
            return quantity > 0
        } else {
            return false
        }
    }

    /**
     * Get list of substances by substanceType name
     * @param {witcher.substanceTypes|SubstanceType|AlchemyComponentHolder} substance
     * @return {WitcherItem[]}
     */
    getSubstance(substance) {
        return this.getListByType(witcher.itemTypes.component)
            .filter(i => i.isOfSystemType(witcher.itemTypes.substances) && i.isOfSubstanceType(substance));
    }

    /**
     * @param {string} name
     * @return {WitcherItem}
     */
    getItemByName(name) {
        return this.items.filter(i => i.name = name)[0]
    }

    /**
     * @param {witcher.itemTypes|ItemType} itemType
     * @return {WitcherItem[]}
     */
    getListByType(itemType) {
        return this.items.filter(i => i.isOfType(itemType))
    }

    /**
     * Find needed component in the items list based on the component name or based on the exact name of the substance in the players compendium
     * Components in the diagrams are only string fields.
     * It is possible for diagram to have component which is actually the substance
     * That is why we need to check whether specific component name could be a substance
     * Ideally we need to store some flag (substances list for diagrams) to the diagram components
     * which will indicate whether the component is substance or not.
     * Such modification may require either modification dozens of compendiums, or some additional parsers
     * @param {string} localizedComponentName
     * @return {WitcherItem[]}
     */
    findNeededComponent(localizedComponentName) {
        return this.items.filter(function (i) {
            return i.isOfType(witcher.itemTypes.component) &&
                (i.name === localizedComponentName ||
                    (
                        i.isOfSystemType(witcher.itemTypes.substances &&
                            (
                                i.isOfSubstanceType(witcher.substanceTypes.vitriol, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.rebis, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.aether, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.quebrith, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.hydragenum, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.vermilion, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.sol, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.caelum, localizedComponentName) ||
                                i.isOfSubstanceType(witcher.substanceTypes.fulgur, localizedComponentName)
                            )
                        )
                    )
                )
        });
    }

    async removeItem(itemId, quantityToRemove) {
        let foundItem = this.items.get(itemId)
        let newQuantity = foundItem.system.quantity - quantityToRemove
        if (newQuantity <= 0) {
            await this.items.get(itemId).delete()
        } else {
            await foundItem.update({'system.quantity': newQuantity < 0 ? 0 : newQuantity})
        }
    }

//TODO verify who may use it
    /**
     * Get random attack location object for the random enemy based on the enemy type
     * @param {string} enemyType
     * @return {witcher.locations|LocationType}
     */
    getRandomLocationObjectForRandomEnemy(enemyType) {
        // set default location object
        let res = witcher.locations.random

        if (enemyType === witcher.locations.randomHuman.name) {
            // calculate hit locations for random human part
            let loc = getRandomInt(10)
            switch (loc) {
                case 1:
                    res = witcher.locations.head
                    break;
                case 2:
                case 3:
                case 4:
                    res = witcher.locations.torso
                    break;
                case 5:
                    res = witcher.locations.rightArm
                    break;
                case 6:
                    res = witcher.locations.leftArm
                    break;
                case 7:
                case 8:
                    res = witcher.locations.rightLeg
                    break;
                case 9:
                case 10:
                    res = witcher.locations.leftLeg
                    break;
                default:
                    res = witcher.locations.torso
                    break;
            }
        } else if (enemyType === witcher.locations.randomMonster.name) {
            // calculate hit locations for random monster part
            let loc = getRandomInt(10)
            switch (loc) {
                case 1:
                    res = witcher.locations.head
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                    res = witcher.locations.torso
                    break;
                case 6:
                case 7:
                    res = witcher.locations.rightLeg
                    break;
                case 8:
                case 9:
                    res = witcher.locations.leftLeg
                    break;
                case 10:
                    res = witcher.locations.tailWing
                    break;
                default:
                    res = witcher.locations.torso
                    break;
            }
        } else {
            return ui.notifications.error(game.i18n.localize("WITCHER.Damage.IncorrectEnemyType"));
        }

        // We should not use modifier since we are selecting random location
        res.modifier = ``;

        return res
    }

    /**
     * Get attack location object based on location name of the chosen enemy
     * @param {string} location
     * @return {witcher.locations|LocationType|*}
     */
    getLocationObject(location) {
        // set default location object
        let res = witcher.locations.random

        if (location === "randomSpell") {
            // set full damage for the spell since spell has its own formulas
            res.name = location;
            res.alias = `${game.i18n.localize("WITCHER.Location.All")}`;
        } else {
            // get location based by its name. Since the enemy is chosen - we should take attack locations not for random enemies
            let loc = witcher.locations.filter(l => l.name === location && l.isAttackLocation && !l.selectRandomEnemy)
            if (loc && loc.length() === 1) {
                res = loc[0]
            } else {
                // if we have more than 1 location with the same name and condition in our enum - we should revise it carefully
                return ui.notifications.error(game.i18n.localize("WITCHER.Damage.IncorrectLocation"));
            }
        }

        return res
    }

    /**
     * Get the damage type by name
     * @param {string} name
     * @return {DamageType}
     */
    getDamageTypeByName(name) {
        return witcher.damageTypes.filter(dt => dt.name === name)[0]
    }

    /**
     * Roll skill check
     * @param {witcher.stats|StatType} statType
     * @param {INT_SKILLS|REF_SKILLS|DEX_SKILLS|BODY_SKILLS|EMP_SKILLS|CRA_SKILLS|WILL_SKILLS} skillType
     */
    rollSkillCheck(statType, skillType) {
        let systemRef = prepareSystemRef(statType.ref, "current")
        let stat =  getValueByStringPath(this, systemRef)
        let parentStat = game.i18n.localize(statType.alias);

        let skillSystemRef = prepareSystemRef(skillType.ref)
        let skill = getValueByStringPath(this, skillSystemRef)
        let skillName = game.i18n.localize(skillType.alias).replace(" (2)", "");

        let displayRollDetails = game.settings.get("witcher", "displayRollsDetails")

        let messageData = {
            speaker: this.getSpeaker(),
            flavor: `${parentStat}: ${skillName} Check`,
        }

        if (!skill || !skillName) {
            return
        }

        let rollFormula = witcher.rollFormulas.default
        rollFormula += !displayRollDetails
            ? `+${stat}+${skill.value}`
            : `+${stat}[${parentStat}]+${skill.value}[${skillName}]`;

        //todo check
        if (this.type === "character") {
            if (statType === witcher.stats.emp
                && (skillType === witcher.empSkills.charisma
                    || skillType === witcher.empSkills.leadership
                    || skillType === witcher.empSkills.persuasion
                    || skillType === witcher.empSkills.seduction)) {

                if (this.system.general.socialStanding === "tolerated" || this.system.general.socialStanding === "toleratedFeared") {
                    rollFormula += !displayRollDetails
                        ? `-1`
                        : `-1[${game.i18n.localize("WITCHER.socialStanding.tolerated")}]`;
                } else if (this.system.general.socialStanding === "hated" || this.system.general.socialStanding === "hatedFeared") {
                    rollFormula += !displayRollDetails
                        ? `-2`
                        : `-2[${game.i18n.localize("WITCHER.socialStanding.hated")}]`;
                }
            }

            if (statType === witcher.stats.emp && skillType === witcher.empSkills.charisma
                && (this.system.general.socialStanding === "feared"
                    || this.system.general.socialStanding === "hatedFeared"
                    || this.system.general.socialStanding === "toleratedFeared")) {

                rollFormula += !displayRollDetails
                    ? `-1`
                    : `-1[${game.i18n.localize("WITCHER.socialStanding.feared")}]`;
            }

            if (statType === witcher.stats.will
                && skillType === witcher.willSkills.intimidation
                && (this.system.general.socialStanding === "feared"
                    || this.system.general.socialStanding === "hatedFeared"
                    || this.system.general.socialStanding === "toleratedFeared")) {

                rollFormula += !displayRollDetails ? `+1` : `+1[${game.i18n.localize("WITCHER.socialStanding.feared")}]`;
            }
        }

        if (skillType.ref) {
            let modifierRef = prepareSystemRef(skillType.ref, "modifiers")
            let skillModifiers = getValueByStringPath(this, modifierRef)
            rollFormula = addModifiersToFormula(skillModifiers, rollFormula)
        }

        let activeEffects = this.getListByType(witcher.itemTypes.effect).filter(e => e.system.isActive);
        activeEffects.forEach(item => {
            item.system.skills.forEach(skill => {
                if (skillName === game.i18n.localize(skill.skill)) {
                    if (skill.modifier.includes?.("/")) {
                        rollFormula += !displayRollDetails
                            ? `/${Number(skill.modifier.replace("/", ''))}`
                            : `/${Number(skill.modifier.replace("/", ''))}[${item.name}]`
                    } else {
                        rollFormula += !displayRollDetails
                            ? `+${skill.modifier}`
                            : `+${skill.modifier}[${item.name}]`
                    }
                }
            })
        });

        let armorEnc = this.getArmorEncumbrance()
        // todo fix these skill names. they should be in config
        if (armorEnc > 0 && (skillName === "Hex Weaving" || skillName === "Ritual Crafting" || skillName === "Spell Casting")) {
            // todo check
            rollFormula += !displayRollDetails
                ? `-${armorEnc}`
                : `-${armorEnc}[${game.i18n.localize("WITCHER.Armor.EncumbranceValue")}]`
        }
        new Dialog({
            title: `${game.i18n.localize("WITCHER.Dialog.Skill")}: ${skillName}`,
            content: `<label>${game.i18n.localize("WITCHER.Dialog.attackCustom")}: <input name="customModifiers" value=0></label>`,
            buttons: {
                LocationRandom: {
                    label: game.i18n.localize("WITCHER.Button.Continue"),
                    callback: async html => {
                        let customAtt = html.find("[name=customModifiers]")[0].value;
                        if (customAtt < 0) {
                            rollFormula += !displayRollDetails
                                ? `${customAtt}`
                                : `${customAtt}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
                        }
                        if (customAtt > 0) {
                            rollFormula += !displayRollDetails
                                ? `+${customAtt}`
                                : `+${customAtt}[${game.i18n.localize("WITCHER.Settings.Custom")}]`
                        }
                        let config = new RollConfig()
                        config.showCrit = true
                        config.showSuccess = true
                        await extendedRoll(rollFormula, messageData, config)
                    }
                }
            }
        }).render(true)
    }

    /**
     * Get actors' encumbrance modifier
     * @return {number}
     */
    getArmorEncumbrance() {
        let encumbranceModifier = 0
        // todo check
        this.getListByType(witcher.itemTypes.armor).forEach(item => {
            if (item.isEquipped()) {
                encumbranceModifier += item.system.encumb
            }
        });
        return encumbranceModifier
    }
}
