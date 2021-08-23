// @ts-ignore
import * as path from 'path';

import {MixAndMeta as MxM} from './mixedmetacollection';

// @ts-ignore
const GENERIC_SCRIPTS = path.resolve(__dirname, '../../../.data-dist/items');

function doesItemsExist(path: string): boolean {
	//console.log("path: " + path);
	try {
		// @ts-ignore
		const itemsScript = require(path).Items;
		//console.log("passed path");
		//console.log(itemsScript);
		if (!itemsScript) return false;
		return true;
	}
	catch (e) {
		//console.log("failed 1");
		return false; }
}

function getItemData(pokemon: Pokemon, itemName: string): ItemData | undefined {
	const metaFormat = MxM.getMetaFormat(pokemon);
	if (metaFormat) {
		// @ts-ignore
		let metaScriptPath = path.resolve(__dirname, `../${metaFormat.mod}/items`);
		if (('gen8' == metaFormat.mod) || !doesItemsExist(metaScriptPath)) {
			metaScriptPath = GENERIC_SCRIPTS;
		}

		try {
			// @ts-ignore
			const metaScript: {[itemid: string]: ItemData} = require(metaScriptPath).Items;
			//console.log("passed script");
			return metaScript[itemName];
		}
		catch (e) { }
	}
}

export const Items: {[k: string]: ModdedItemData} = {
	chilanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'chilanberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'chilanberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	enigmaberry: {
		inherit: true,
		onHit(target, source, move) {
			const itemData = getItemData(target, 'enigmaberry');
			if (itemData) {
				if (!itemData.onHit) return;
				// @ts-ignore
				itemData.onHit?.call(this, target, source, move);
			}
		},
	},
	lansatberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'lansatberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
		condition: {
			onStart(target, source, effect) {
				const itemData = getItemData(target, 'lansatberry');
				// @ts-ignore
				if (itemData) itemData.condition?.onStart?.call(this, target, source, effect);
			},
			onModifyCritRatio(critRatio, user, target, move) {
				const itemData = getItemData(user, 'lansatberry');
				if (itemData) return itemData.condition?.onModifyCritRatio?.call(this, critRatio, user, target, move);
			},
		},
	},
	leppaberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'leppaberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	micleberry: {
		inherit: true,
		condition: {
			duration: 2,
			onSourceAccuracy(accuracy, target, source, move) {
				const itemData = getItemData(target, 'micleberry');
				if (itemData) return itemData.condition?.onSourceAccuracy?.call(this, accuracy, target, source, move);
			},
		},
	},
	starfberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'starfberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	occaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'occaberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'occaberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	passhoberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'passhoberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'passhoberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	wacanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'wacanberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'wacanberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	rindoberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'rindoberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'rindoberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	yacheberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'yacheberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'yacheberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	chopleberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'chopleberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'chopleberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	kebiaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'kebiaberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'kebiaberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	shucaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'shucaberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'shucaberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	cobaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'cobaberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'cobaberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	payapaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'payapaberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'payapaberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	tangaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'tangaberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'tangaberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	chartiberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'chartiberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'chartiberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	kasibberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'kasibberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'kasibberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	habanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'habanberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'habanberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	colburberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'colburberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'colburberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	babiriberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'babiriberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'babiriberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	roseliberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			const itemData = getItemData(target, 'roseliberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, source, target, move);
		},
		onDamage(damage, target, source, effect) {
			const itemData = getItemData(target, 'roseliberry');
			if (itemData) itemData.onDamage?.call(this, damage, target, source, effect);
		},
	},
	oranberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'oranberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	sitrusberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'sitrusberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	figyberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'figyberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	iapapaberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'iapapaberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	wikiberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'wikiberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	aguavberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'aguavberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	magoberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'magoberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	liechiberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'liechiberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	ganlonberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'ganlonberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	petayaberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'petayaberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	apicotberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'apicotberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	salacberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'salacberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	keeberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'keeberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	marangaberry: {
		inherit: true,
		onEat(pokemon) {
			const itemData = getItemData(pokemon, 'marangaberry');
			if (itemData) {
				if (!itemData.onEat) return false;
				itemData.onEat?.call(this, pokemon);
			}
		},
	},
	jabocaberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			const itemData = getItemData(target, 'jabocaberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, target, source, move);
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			const itemData = getItemData(target, 'rowapberry');
			if (itemData) itemData.onDamagingHit?.call(this, damage, target, source, move);
		},
	},
};
