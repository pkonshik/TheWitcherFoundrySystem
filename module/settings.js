export const registerSettings = function () {
    // Register any custom system settings here
    game.settings.register("witcher", "useOptionalAdrenaline", {
        name: "WITCHER.Settings.Adrenaline",
        hint: "WITCHER.Settings.AdrenalineDetails",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("witcher", "displayRollsDetails", {
        name: "WITCHER.Settings.displayRollDetails",
        hint: "WITCHER.Settings.displayRollDetailsHint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("witcher", "useWitcherFont", {
        name: "WITCHER.Settings.specialFont",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("witcher", "displayRep", {
        name: "WITCHER.Settings.displayReputation",
        hint: "WITCHER.Settings.displayReputationHint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("witcher", "useOptionalVerbalCombat", {
        name: "WITCHER.Settings.useVerbalCombatRule",
        hint: "WITCHER.Settings.useVerbalCombatRuleHint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("witcher", "loadCustomStatusesFromCompendium", {
        name: "WITCHER.Settings.loadCustomStatusesFromCompendium",
        hint: "WITCHER.Settings.loadCustomStatusesFromCompendiumHint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("witcher", "clickableImageItemTypes", {
        name: "WITCHER.Settings.clickableImageItemTypes",
        hint: "WITCHER.Settings.clickableImageItemTypesHint",
        scope: "world",
        config: true,
        type: String,
        default: "valuable"
    });
    game.settings.register("witcher", "clickableImageCheckboxForGMOnly", {
        name: "WITCHER.Settings.clickableImageCheckboxForGMOnly",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
}
