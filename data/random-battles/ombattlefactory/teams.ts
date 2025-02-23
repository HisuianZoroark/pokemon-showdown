import {RandomTeams, TeamData} from '../gen9/teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import {Dex, toID} from '../../../sim/dex';

interface OMBattleFactorySet {
	species: string;
	weight: number;
	ability: string | string[];
	item: string | string[];
	nature: string | string[];
	moves: (string | string[])[];
	teraType?: string | string[];
	gender?: string;
	wantsTera?: boolean;
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
	shiny?: boolean;
	improofs?: string[]; // BH
	improofedBy?: string[]; // BH
	donor?: string; // Inh
	slot?: string[]; // GG
}

interface OMBattleFactorySpecies {
	sets: OMBattleFactorySet[];
	weight: number;
	isGod?: boolean; // GG
}

const OM_TIERS: {[k: string]: string} = {
	'Almost Any Ability': 'aaa',
	'Balanced Hackmons': 'bh',
	'Godly Gift': 'gg',
	'Inheritance': 'inh',
	'Mix and Mega': 'mnm',
	'Partners in Crime': 'pic',
	'Shared Power': 'sp',
	'STABmons': 'stab',
};

const debug = 'Mix and Mega';

export class RandomOMBattleFactoryTeams extends RandomTeams {
	randomOMFactorySets: {[format: string]: {[species: string]: OMBattleFactorySpecies}} = require('./factory-sets.json');

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.factoryTier = debug || this.sample(Object.keys(OM_TIERS));
	}

	randomFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = depth >= 12;

		const jsonFactoryTier = OM_TIERS[this.factoryTier];

		const sac = (jsonFactoryTier === 'aaa' || jsonFactoryTier === 'inh');

		const pokemon = [];
		const pokemonPool = Object.keys(this.randomOMFactorySets[jsonFactoryTier]);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			wantsTeraCount: 0,
			forceResult: forceResult,
			weaknesses: {},
			resistances: {},
		};

		const resistanceAbilities: {[k: string]: string[]} = {
			dryskin: ['Water'], waterabsorb: ['Water'], stormdrain: ['Water'],
			flashfire: ['Fire'], heatproof: ['Fire'], waterbubble: ['Fire'], wellbakedbody: ['Fire'],
			lightningrod: ['Electric'], motordrive: ['Electric'], voltabsorb: ['Electric'],
			sapsipper: ['Grass'],
			thickfat: ['Ice', 'Fire'],
			eartheater: ['Ground'], levitate: ['Ground'],
			purifyingsalt: ['Ghost'],
			// AAA and BH
			desolateland: ['Water'], primordialsea: ['Fire'], deltastream: ['Electric', 'Ice', 'Rock'],
		};
		const movesLimited: {[k: string]: string} = {
			stealthrock: 'stealthRock',
			stoneaxe: 'stealthRock',
			spikes: 'spikes',
			ceaselessedge: 'spikes',
			toxicspikes: 'toxicSpikes',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
			// BH and STAB
			mortalspin: 'hazardClear',
		};
		const abilitiesLimited: {[k: string]: string} = {
			toxicdebris: 'toxicSpikes',
		};

		const limitFactor = Math.ceil(this.maxTeamSize / 6);

		const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: Math.pow(this.prng.random(), 1 / this.randomOMFactorySets[jsonFactoryTier][speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
			const species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit 2 of any type (most of the time)
			const types = species.types;
			let skip = false;
			for (const type of types) {
				if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (!teamData.forceResult) {
				// Limit 3 of any weakness
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0 && this.dex.getImmunity(typeName, types)) {
						if (teamData.weaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
			}
			if (skip) continue;

			let set = undefined;

			// Certain teams require unique team generation
			switch (jsonFactoryTier) {
				case 'bh':
					break;
				case 'gg':
					break;
				case 'pic':
					break;
				case 'sp':
					break;
				default:
					set = this.randomGenericFactorySet(species, teamData, jsonFactoryTier);
					break;
			}
			if (!set) continue;
			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === "Drought" || set.ability === "Drizzle") {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (teamData.typeComboCount[typeCombo] >= limitFactor) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			if (typeCombo in teamData.typeComboCount) {
				teamData.typeComboCount[typeCombo]++;
			} else {
				teamData.typeComboCount[typeCombo] = 1;
			}

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[toID(set.item)] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (movesLimited[moveId]) {
					teamData.has[movesLimited[moveId]] = 1;
				}
			}

			const ability = this.dex.abilities.get(set.ability);
			if (abilitiesLimited[ability.id] || sac) {
				teamData.has[abilitiesLimited[ability.id]] = 1;
			}

			const item = this.dex.items.get(set.item);
			if (jsonFactoryTier === 'mnm') {
				// Stone clause
				if (((item.forcedForme && !item.zMove) || item.megaStone ||
					item.isPrimalOrb || item.name.startsWith('Rusted'))) {
					teamData.has[item.id] = 1;
					}
			}

			for (const typeName of this.dex.types.names()) {
				const typeMod = this.dex.getEffectiveness(typeName, types);
				// Track resistances because we will require it for triple weaknesses
				if (
					typeMod < 0 ||
					resistanceAbilities[ability.id]?.includes(typeName) ||
					!this.dex.getImmunity(typeName, types)
				) {
					// We don't care about the number of resistances, so just set to 1
					teamData.resistances[typeName] = 1;
				// Track weaknesses
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomFactoryTeam(side, ++depth);

		// Quality control we cannot afford for monotype
		if (!teamData.forceResult) {
			for (const type in teamData.weaknesses) {
				// We reject if our team is triple weak to any type without having a resist
				if (teamData.resistances[type]) continue;
				if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomFactoryTeam(side, ++depth);
			}
			// Try to force a hazard and/or removal on certain teams in certain tiers
			if (!teamData.has['stealthRock'] && !teamData.has['hazardClear'] && jsonFactoryTier !== 'pic') {
				return this.randomFactoryTeam(side, ++depth);
			}
		}
		return pokemon;
	}
	randomGenericFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails, tier: string
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomOMFactorySets[tier][id].sets;

		const itemsLimited = ['choicespecs', 'choiceband', 'choicescarf'];
		const resistanceAbilities: {[k: string]: string[]} = {
			dryskin: ['Water'], waterabsorb: ['Water'], stormdrain: ['Water'],
			flashfire: ['Fire'], heatproof: ['Fire'], waterbubble: ['Fire'], wellbakedbody: ['Fire'],
			lightningrod: ['Electric'], motordrive: ['Electric'], voltabsorb: ['Electric'],
			sapsipper: ['Grass'],
			thickfat: ['Ice', 'Fire'],
			eartheater: ['Ground'], levitate: ['Ground'],
			purifyingsalt: ['Ghost'],
			// AAA and BH
			desolateland: ['Water'], primordialsea: ['Fire'], deltastream: ['Electric', 'Ice', 'Rock'],
		};
		const movesLimited: {[k: string]: string} = {
			stealthrock: 'stealthRock',
			stoneaxe: 'stealthRock',
			spikes: 'spikes',
			ceaselessedge: 'spikes',
			toxicspikes: 'toxicSpikes',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
			// BH and STAB
			mortalspin: 'hazardClear',
		};
		const abilitiesLimited: {[k: string]: string} = {
			toxicdebris: 'toxicSpikes',
		};

		// Build a pool of eligible sets, given the team partners
		// Also keep track of moves and items limited to one per team
		const effectivePool: {
			set: OMBattleFactorySet, moves?: string[], item?: string,
		}[] = [];

		for (const set of setList) {
			let reject = false;

			// limit to 1 dedicated tera user per team
			if (set.wantsTera && teamData.wantsTeraCount) {
				continue;
			}
			const allowedItems: string[] = [];

			if (Array.isArray(set.item)) {
				for (const itemString of set.item) {
					const itemId = toID(itemString);
					if (itemsLimited.includes(itemId) && teamData.has[itemId]) continue;
					if (tier === 'mnm' && teamData.has[itemId]) continue;
					allowedItems.push(itemString);
				}
			} else {
				const itemId = toID(set.item);
				if (!(itemsLimited.includes(itemId) && teamData.has[itemId])) {
					if (!(tier === 'mnm' && teamData.has[itemId])) {
						allowedItems.push(set.item);
					}
				}
			}
			if (!allowedItems.length) continue;
			const item = this.sample(allowedItems);

			const abilityId = toID(this.sampleIfArray(set.ability));
			if (abilitiesLimited[abilityId] && teamData.has[abilitiesLimited[abilityId]]) continue;

			const moves: string[] = [];
			for (const move of set.moves) {
				const allowedMoves: string[] = [];
				if (Array.isArray(move)) {
					for (const m of move) {
						const moveId = toID(m);
						if (movesLimited[moveId] && teamData.has[movesLimited[moveId]]) continue;
						allowedMoves.push(m);
					}
				} else {
					const moveId = toID(move);
					if (!(movesLimited[moveId] && teamData.has[movesLimited[moveId]])) {
						allowedMoves.push(move);
					}
				}
				if (!allowedMoves.length) {
					reject = true;
					break;
				}
				moves.push(this.sample(allowedMoves));
			}
			if (reject) continue;
			effectivePool.push({set, moves, item});
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const set of setList) {
				effectivePool.push({set});
			}
		}

		let setData = this.sample(effectivePool); // Init with unweighted random set as fallback

		const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
		const setRand = this.random(total);

		let cur = 0;
		for (const set of effectivePool) {
			cur += set.set.weight;
			if (cur > setRand) {
				setData = set; // Bingo!
				break;
			}
		}

		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moves ? setData.moves[i] : this.sampleIfArray(moveSlot));
		}

		const item = setData.item || this.sampleIfArray(setData.set.item);

		return {
			name: species.baseSpecies,
			species: (typeof species.battleOnly === 'string') ? species.battleOnly : species.name,
			teraType: setData.set.teraType ? this.sampleIfArray(setData.set.teraType) : species.forceTeraType || species.types[0],
			gender:	setData.set.gender || species.gender,
			item,
			ability: this.sampleIfArray(setData.set.ability),
			shiny: setData.set.shiny || this.randomChance(1, 1024),
			level: this.adjustLevel || (tier === "LC" ? 5 : 100),
			happiness: 255,
			evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs},
			ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs},
			nature: this.sampleIfArray(setData.set.nature) || "Serious",
			moves,
			wantsTera: setData.set.wantsTera || false,
		};
	}
}

export default RandomOMBattleFactoryTeams;
