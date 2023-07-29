import {genId} from "../helpers/utils.js";

export default class WitcherItemSheet extends ItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["witcher", "sheet", "item"],
            width: 520,
            height: 480,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
            dragDrop: [{
                dragSelector: ".items-list .item",
                dropSelector: null
            }],
        });
    }

    get template() {
        return `systems/witcher/templates/sheets/${this.object.type}-sheet.html`;
    }

    /** @override */
    getData(options) {
        const context = super.getData(options);
        const itemData = context.item;

        context.rollData = {};
        let actor = this.object?.parent ?? null;
        if (actor) {
            context.rollData = actor.getRollData();
        }

        context.system = itemData.system;
        context.flags = itemData.flags;

        this.options.classes.push(`item-${this.item.type}`)

        if (this.item.type === "weapon") {
            let appliedId = false;
            this.item.system.effects.forEach(element => {
                if (!element.id) {
                    appliedId = true
                    element.id = genId()
                }
            });
            if (appliedId) {
                this.item.update({'system.effects': this.item.system.effects});
            }
        }
        return context;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        html.find(".add-effect").on("click", this._onAddEffect.bind(this));
        html.find(".add-modifier").on("click", this._onAddModifierStat.bind(this));
        html.find(".add-skill-modifier").on("click", this._onAddModifierSkill.bind(this));
        html.find(".add-modifier").on("click", this._onAddModifierDerived.bind(this));

        html.find(".add-component").on("click", this._onAddComponent.bind(this));
        html.find(".add-associated-item").on("click", this._onAddAssociatedItem.bind(this))
        html.find(".remove-associated-item").on("click", this._onRemoveAssociatedItem.bind(this))
        html.find(".remove-component").on("click", this._onRemoveComponent.bind(this));

        html.find(".remove-effect").on("click", this._onRemoveEffect.bind(this));
        html.find(".remove-modifier-stat").on("click", this._onRemoveModifierStat.bind(this));
        html.find(".remove-modifier-skill").on("click", this._onRemoveModifierSkill.bind(this));
        html.find(".remove-modifier-derived").on("click", this._onRemoveModifierDerived.bind(this));

        html.find(".list-edit").on("blur", this._onListEdit.bind(this));
        html.find(".modifiers-edit").on("change", this._onModifierEdit.bind(this));
        html.find(".modifiers-edit-skills").on("change", this._onModifierSkillsEdit.bind(this));
        html.find(".edit-modifier").on("change", this._onModifierDerivedEdit.bind(this));
        html.find("input").focusin(ev => this._onFocusIn(ev));
        html.find(".damage-type").on("change", this._onDamageTypeEdit.bind(this));

        html.find(".dragable").on("dragstart", (ev) => {
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
            dragSelector: `.dragable`,
            dropSelector: `.window-content`,
            permissions: {dragstart: this._canDragStart.bind(this), drop: this._canDragDrop.bind(this)},
            callbacks: {dragstart: this._onDragStart.bind(this), drop: this._onDrop.bind(this)}
        })
        this._dragDrop.push(newDragDrop);
    }

    /**
     * @override
     * Process drop onto the diagrams list.
     * We can add associated item for craft or component
     * @param {DragEvent} event
     * @return {Promise<void>}
     * @private
     */
    async _onDrop(event) {
        if (this.item.type === "diagrams") {
            let dragEventData = TextEditor.getDragEventData(event)
            let item = await fromUuid(dragEventData.uuid)

            if (item) {
                if (event.target.offsetParent.dataset.type === "associatedItem") {
                    await this.item.update({'system.associatedItem': item});
                } else {
                    let newComponentList = []
                    if (this.item.system.craftingComponents) {
                        newComponentList = this.item.system.craftingComponents
                    }
                    newComponentList.push({id: genId(), name: item.name, quantity: 1})
                    await this.item.update({'system.craftingComponents': newComponentList});
                }
            }
        }
    }

    /**
     * Edit the list of crafting components for diagram or list of effects for an item
     * @param event
     * @private
     */
    _onListEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;

        let field = element.dataset.field;
        let value = element.value
        if (this.item.type === "diagrams") {
            let components = this.item.system.craftingComponents
            let objIndex = components.findIndex((obj => obj.id === itemId));
            components[objIndex][field] = value
            this.item.update({'system.craftingComponents': components});
        } else {
            let effects = this.item.system.effects
            let objIndex = effects.findIndex((obj => obj.id === itemId));
            effects[objIndex][field] = value

            this.item.update({'system.effects': effects});
        }
    }

    /**
     * Edit the list of stat modifiers for an item
     * @param event
     * @private
     */
    _onModifierEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let field = element.dataset.field;
        let value = element.value
        let effects = this.item.system.stats
        let objIndex = effects.findIndex((obj => obj.id === itemId));
        effects[objIndex][field] = value
        this.item.update({'system.stats': effects});
    }

    /**
     * Edit damage type for a weapon
     * @param event
     * @private
     */
    _onDamageTypeEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let newval = Object.assign({}, this.item.system.type)
        newval[element.id] = !newval[element.id]
        let types = []
        if (newval.slashing) types.push(game.i18n.localize("WITCHER.Armor.Slashing"))
        if (newval.piercing) types.push(game.i18n.localize("WITCHER.Armor.Piercing"))
        if (newval.bludgeoning) types.push(game.i18n.localize("WITCHER.Armor.Bludgeoning"))
        if (newval.elemental) types.push(game.i18n.localize("WITCHER.Armor.Elemental"))
        newval.text = types.join(", ")
        this.item.update({'system.type': newval});
    }

    /**
     * Edit derived stats for an item
     * @param event
     * @private
     */
    _onModifierDerivedEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;

        let field = element.dataset.field;
        let value = element.value
        let effects = this.item.system.derived
        let objIndex = effects.findIndex((obj => obj.id === itemId));
        effects[objIndex][field] = value
        this.item.update({'system.derived': effects});
    }

    /**
     * Edit skills stats for an item
     * @param event
     * @private
     */
    _onModifierSkillsEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;

        let field = element.dataset.field;
        let value = element.value
        let effects = this.item.system.skills
        let objIndex = effects.findIndex((obj => obj.id === itemId));
        effects[objIndex][field] = value
        this.item.update({'system.skills': effects});
    }

    /**
     * Remove crafting component from the list
     * @param event
     * @private
     */
    _onRemoveComponent(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newComponentList = this.item.system.craftingComponents.filter(item => item.id !== itemId)
        this.item.update({'system.craftingComponents': newComponentList});
    }

    /**
     * Remove effect from an item
     * @param event
     * @private
     */
    _onRemoveEffect(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newEffectList = this.item.system.effects.filter(item => item.id !== itemId)
        this.item.update({'system.effects': newEffectList});
    }

    /**
     * Remove stat modifier from an item
     * @param event
     * @private
     */
    _onRemoveModifierStat(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newModifierList = this.item.system.stats.filter(item => item.id !== itemId)
        this.item.update({'system.stats': newModifierList});
    }

    /**
     * Remove skill modifier from an item
     * @param event
     * @private
     */
    _onRemoveModifierSkill(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newModifierList = this.item.system.skills.filter(item => item.id !== itemId)
        this.item.update({'system.skills': newModifierList});
    }

    /**
     * Remove derived modifier from an item
     * @param event
     * @private
     */
    _onRemoveModifierDerived(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newModifierList = this.item.system.derived.filter(item => item.id !== itemId)
        this.item.update({'system.derived': newModifierList});
    }

    /**
     * Add effect to an item
     * @param event
     * @private
     */
    _onAddEffect(event) {
        event.preventDefault();
        let newEffectList = []
        if (this.item.system.effects) {
            newEffectList = this.item.system.effects
        }
        newEffectList.push({id: genId(), name: "effect", percentage: ""})
        this.item.update({'system.effects': newEffectList});
    }

    /**
     * Add crafting component to a diagram
     * @param event
     * @private
     */
    _onAddComponent(event) {
        event.preventDefault();
        let newComponentList = []
        if (this.item.system.craftingComponents) {
            newComponentList = this.item.system.craftingComponents
        }
        newComponentList.push({id: genId(), name: "component", quantity: ""})
        this.item.update({'system.craftingComponents': newComponentList});
    }

    /**
     * Add associated item to a diagram
     * @param event
     * @return {Promise<void>}
     * @private
     */
    async _onAddAssociatedItem(event) {
        event.preventDefault();
        if (this.item.type === "diagrams") {
            if (!this.item.system.associatedItem) {
                let newAssociatedItem = ({id: genId(), name: "super item", img: "icons/svg/item-bag.svg"})
                await this.item.update({'system.associatedItem': newAssociatedItem});
            }
        }
    }

    /**
     * Remove associated item from a diagram
     * @param event
     * @return {Promise<void>}
     * @private
     */
    async _onRemoveAssociatedItem(event) {
        event.preventDefault();
        if (this.item.type === "diagrams") {
            let newAssociatedItem = {id: "", name: "", img: ""};
            await this.item.update({'system.associatedItem': newAssociatedItem});
        }
    }

    /**
     * Add modifiers stat to an item
     * @param event
     * @private
     */
    _onAddModifierStat(event) {
        event.preventDefault();
        let newModifierList = []
        if (this.item.system.stats) {
            newModifierList = this.item.system.stats
        }
        newModifierList.push({id: genId(), stat: "none", modifier: 0})
        this.item.update({'system.stats': newModifierList});
    }

    /**
     * Add modifier to item skill
     * @param event
     * @private
     */
    _onAddModifierSkill(event) {
        event.preventDefault();
        let newModifierList = []
        if (this.item.system.skills) {
            newModifierList = this.item.system.skills
        }
        newModifierList.push({id: genId(), skill: "none", modifier: 0})
        this.item.update({'system.skills': newModifierList});
    }

    /**
     * Add derived modifier stat to an item
     * @param event
     * @private
     */
    _onAddModifierDerived(event) {
        event.preventDefault();
        let newModifierList = []
        if (this.item.system.derived) {
            newModifierList = this.item.system.derived
        }
        newModifierList.push({id: genId(), derivedStat: "none", modifier: 0})
        this.item.update({'system.derived': newModifierList});
    }

    /**
     * Focus on item
     * @param event
     * @private
     */
    _onFocusIn(event) {
        event.currentTarget.select();
    }
}
