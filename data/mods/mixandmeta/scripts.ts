// @ts-ignore
import * as path from 'path';

import {toID} from './../../../sim/dex';

import {MixAndMeta as MxM} from './mixedmetacollection';

// @ts-ignore
const GENERIC_SCRIPTS = path.resolve(__dirname, '../../../data/scripts');
// @ts-ignore
const MNM_SCRIPTS = path.resolve(__dirname, '../mixandmega/scripts');

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	init() {
		// Have to execute for every meta
		for (const mixedMetaKey in MxM.MixedMetaCollection) {
			//console.log("init for mixedMetaKey: " + mixedMetaKey);
			
			let mixedMetaValue = MxM.MixedMetaCollection[mixedMetaKey];
			let metaFormat = Dex.formats.get(mixedMetaValue.format);
			if ('gen8' === metaFormat.mod) continue;

			// @ts-ignore
			const metaScriptPath = path.resolve(__dirname, `../${metaFormat.mod}/scripts`);
			//console.log(metaScriptPath);

			try {
				// @ts-ignore
				const metaScript: ModdedBattleScriptsData = require(metaScriptPath).Scripts;
				return metaScript.init?.call(this);
			}
			catch (e) { }
		}
	},
	actions: {
		canMegaEvo(pokemon) {
			const metaFormat = MxM.getMetaFormat(pokemon);
			if (metaFormat) {
				// @ts-ignore
				let metaScriptPath = path.resolve(__dirname, `../${metaFormat.mod}/scripts`);
				if (!metaScriptPath) {
					metaScriptPath = GENERIC_SCRIPTS;
				}

				try {
					// @ts-ignore
					const metaScript: ModdedBattleScriptsData = require(metaScriptPath).Scripts;
					return metaScript.actions?.canMegaEvo?.call(this, pokemon);
				}
				catch (e) { }
			}

			return null;
		},
		runMegaEvo(pokemon) {
			const metaFormat = MxM.getMetaFormat(pokemon);
			if (metaFormat) {
				try {
					// @ts-ignore
					const metaScriptPath = path.resolve(__dirname, `../${metaFormat.mod}/scripts`);
					// @ts-ignore
					const metaScript: ModdedBattleScriptsData = require(metaScriptPath).Scripts;
					return metaScript.actions?.runMegaEvo?.call(this, pokemon) as boolean;
				}
				catch (e) { }
			}

			// Re-implement standard runMegaEvo, but prevent MnM megas from being disabled by regular single megaevo usage
			const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
			if (!speciesid) return false;
			const side = pokemon.side;

			// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
			for (const foeActive of pokemon.foes()) {
				if (foeActive.volatiles['skydrop']?.source === pokemon) {
					return false;
				}
			}

			pokemon.formeChange(speciesid, pokemon.getItem(), true);

			// Limit one mega evolution
			let wasMega = pokemon.canMegaEvo;
			for (const ally of side.pokemon) {
				let allyIsMnM = ("[Gen 8] Mix and Mega" === toID(ally.meta?.format)); // MnM mons can still mega
				if (allyIsMnM) continue;

				if (wasMega) {
					ally.canMegaEvo = null;
				} else {
					ally.canUltraBurst = null;
				}
			}

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
		getMixedSpecies(originalSpecies, megaSpecies) { // Can only enter from MnM (for now)
			// @ts-ignore
			const MnMScript: ModdedBattleScriptsData = require(MNM_SCRIPTS).Scripts;
			return MnMScript.actions?.getMixedSpecies?.call(this, originalSpecies, megaSpecies) as Species;
		},
		getMegaDeltas(megaSpecies) { // Can only enter from MnM (for now)
			// @ts-ignore
			const MnMScript: ModdedBattleScriptsData = require(MNM_SCRIPTS).Scripts;
			return MnMScript.actions?.getMegaDeltas?.call(this, megaSpecies) as Species;
		},
		doGetMixedSpecies(speciesOrSpeciesName, deltas) { // Can only enter from MnM (for now)
			// @ts-ignore
			const MnMScript: ModdedBattleScriptsData = require(MNM_SCRIPTS).Scripts;
			return MnMScript.actions?.doGetMixedSpecies?.call(this, speciesOrSpeciesName, deltas) as Species;
		},
	},
};