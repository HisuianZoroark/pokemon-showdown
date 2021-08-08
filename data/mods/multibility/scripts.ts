import {toID} from './../../../sim/dex';

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	init() {
		// Create multibility item version of all abilities that can't be removed in-battle.
		// Use separate IDs so that the validator doesn't try to disambiguate them from abilities.
		const baseItem: ItemData = {
			name: "",
			onTakeItem(item, source) { return false; },
		};
		for (const abilityName in this.data.Abilities) {
			const abilityItem: ItemData = Dex.deepClone(baseItem);
			abilityItem.id = toID(abilityName + 'multibility');
			abilityItem.name = abilityName;
			this.data.Items[abilityItem.id] = abilityItem;
		}
	},
};
