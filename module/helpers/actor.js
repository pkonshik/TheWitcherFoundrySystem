/**
 * Sanitizes description if it contains forbidden html tags.
 * @param {WitcherItem} item
 * @return {WitcherItem}
 */
export function sanitizeDescription(item) {
    if (!item.system.description) {
        return item;
    }

    const regex = /(<.+?>)/g;
    const whiteList = ["<p>", "</p>"];
    const tagsInText = item.system.description.match(regex);
    /**
     * @type {WitcherItem}
     */
    const itemCopy = JSON.parse(JSON.stringify(item));
    if (tagsInText.some(i => !whiteList.includes(i))) {
        const temp = document.createElement('div');
        temp.textContent = itemCopy.system.description;
        itemCopy.system.description = temp.innerHTML;
    }
    return itemCopy;
}

/**
 * Calculate sum of the items with the proper system property
 * @param {WitcherItem[]} items
 * @param {string=} prop
 * @return {number}
 */
export function sum(items, prop) {
    if (!prop) {
        prop = "quantity";
    }

    let total = 0, i = 0, _len = items.length;
    for (; i < _len; i++) {
        if (this[i]["system"][prop]) {
            total += Number(this[i]["system"][prop])
        } else if (this[i]["system"]["system"][prop]) {
            total += Number(this[i]["system"]["system"][prop])
        }
    }
    return total
}

/**
 * Calculate weight of the passed items
 * @param {WitcherItem[]} items
 * @return {number}
 */
export function weight(items) {
    let total = 0, i = 0, _len = items.length;
    for (; i < _len; i++) {
        if (this[i]["system"]["weight"] && this[i]["system"]["quantity"]) {
            total += Number(this[i]["system"]["quantity"]) * Number(this[i]["system"]["weight"])
        }
    }
    return Math.ceil(total)
}

export function currencyWeight(currency) {
    let totalPieces = 0;
    totalPieces += Number(currency.bizant);
    totalPieces += Number(currency.ducat);
    totalPieces += Number(currency.lintar);
    totalPieces += Number(currency.floren);
    totalPieces += Number(currency.crown);
    totalPieces += Number(currency.oren);
    totalPieces += Number(currency.falsecoin);
    return Number(totalPieces * 0.001)
}

/**
 * Calculate cost of the passed items
 * @param {WitcherItem[]} items
 * @return {number}
 */
export function cost(items) {
    let total = 0, i = 0, _len = items.length;
    for (; i < _len; i++) {
        if (this[i]["system"]["cost"] && this[i]["system"]["quantity"]) {
            total += Number(this[i]["system"]["quantity"]) * Number(this[i]["system"]["cost"])
        }
    }
    return Math.ceil(total)
}
