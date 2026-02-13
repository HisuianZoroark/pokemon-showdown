import { RandomTeams } from '../gen9/teams';
import { Teams } from '../../../sim/teams';
import { type PRNG, type PRNGSeed } from '../../../sim/prng';
import { Dex, toID } from '../../../sim/dex';

interface TeamData {
	typeCount: { [k: string]: number };
	typeComboCount: { [k: string]: number };
	baseFormes: { [k: string]: number };
	megaCount?: number;
	zCount?: number;
	wantsTeraCount?: number;
	has: { [k: string]: number };
	forceResult: boolean;
	weaknesses: { [k: string]: number };
	resistances: { [k: string]: number };
	weather?: string;
	eeveeLimCount?: number;
	gigantamax?: boolean;
	improofList?: string[];
	god?: string;
	archetype?: string | string[];
}

interface randomOMFactorySet extends RandomTeamsTypes.RandomFactorySet {
	whatItImproofs?: string[]; // bh
	improofedBy?: string[]; // bh
	pokeball?: string; // inh
	isGod?: boolean; // GG
	slot?: StatID[]; // GG
	archetype?: string[];
}

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
	slot?: StatID[]; // GG
	archetype?: string[];
}

interface OMBattleFactorySpecies {
	sets: OMBattleFactorySet[];
	weight: number;
	isGod?: boolean; // GG
}

const OM_TIERS: { [k: string]: string } = {
	'Almost Any Ability': 'aaa',
	'Balanced Hackmons': 'bh',
	'Godly Gift': 'gg',
	'Inheritance': 'inh',
	'Mix and Mega': 'mnm',
	'Partners in Crime': 'pic',
	'Shared Power': 'sp',
	'STABmons': 'stab',
	'[Gen 6] Pure Hackmons': '6ph',
};

const SOFT_AC_WHITELIST: { [k: string]: string[] } = {
	// Allow duplicates in these sharing ability based OMs
	'pic': ['protosynthesis', 'quarkdrive'],
	'sp': [],
};

enum GG_SLOTS {
	hp,
	atk,
	def,
	spa,
	spd,
	spe,
};

const debug = 'Shared Power';

export class RandomOMBattleFactoryTeams extends RandomTeams {
	randomOMFactorySets: { [format: string]: { [species: string]: OMBattleFactorySpecies } } = require('./factory-sets.json');

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		// Unlike in regular battle factory, there will be minimal cherry picking to ensure bad combinations do not show up
		let viableTiers = Object.keys(OM_TIERS);
		// Only works with 6 Pokemon
		if (this.maxTeamSize !== 6) viableTiers = viableTiers.filter(t => t !== 'Godly Gift');
		// Doubles tier
		const pickedTeamSize = Dex.formats.getRuleTable(Dex.formats.get(format)).pickedTeamSize;
		if (this.maxTeamSize < 2 || (pickedTeamSize && pickedTeamSize < 2))  {
			viableTiers = viableTiers.filter(t => t !== 'Partners in Crime');
		}
		this.factoryTier = debug || this.sample(viableTiers);
	}

	override randomFactoryTeam(side: PlayerOptions, depth = 0): randomOMFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const jsonFactoryTier = OM_TIERS[this.factoryTier];

		// Some tiers need more care into teambuilding
		const forceResult = (['bh', 'gg', 'pic', 'sp'].includes(jsonFactoryTier)) ? depth >= 24 : depth >= 12;

		const ObviouslyNotLegalPlaceholder = Teams.import("MissingNo.||||Splash|||||||,,,,,Stellar")![0] as randomOMFactorySet;

		const sac = (jsonFactoryTier === 'aaa' || jsonFactoryTier === 'inh');

		const isArchetypeTier = (jsonFactoryTier === 'sp' || jsonFactoryTier === 'pic');

		const isHackmonsTier = (jsonFactoryTier === 'bh' || jsonFactoryTier === '6ph');

		const ggbanlist = this.dex.formats.getRuleTable(this.dex.formats.get('gen9godlygift'));

		const pokemon = [] as randomOMFactorySet[];
		if (jsonFactoryTier === 'gg') {
			// Best to start with all 6 pokemon
			for (let x = 0; x < this.maxTeamSize; x++) pokemon.push(ObviouslyNotLegalPlaceholder);
		}

		const pokemonPool = Object.keys(this.randomOMFactorySets[jsonFactoryTier]);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			wantsTeraCount: 0,
			forceResult,
			weaknesses: {},
			resistances: {},
		};
		if (isHackmonsTier) teamData.improofList = [];

		const immunityAbilities: { [k: string]: string[] } = {
			dryskin: ['Water'], waterabsorb: ['Water'], stormdrain: ['Water'],
			flashfire: ['Fire'], wellbakedbody: ['Fire'],
			lightningrod: ['Electric'], motordrive: ['Electric'], voltabsorb: ['Electric'],
			sapsipper: ['Grass'],
			eartheater: ['Ground'], levitate: ['Ground'],
			// AAA and BH
			desolateland: ['Water'], primordialsea: ['Fire'],
			purifyingsalt: ['status'], naturalcure: ['status'],
		};

		const resistanceAbilities: { [k: string]: string[] } = {
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
		const movesLimited: { [k: string]: string } = {
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
		const picMovesLimited: { [k: string]: string } = {
			tailwind: 'tailwind',
			trickroom: 'trickRoom',
			stealthrock: 'stealthRock',
			spikes: 'spikes',
			whirlwind: 'setupControl',
			roar: 'setupControl',
			dragontail: 'setupControl',
			haze: 'setupControl',
			clearsmog: 'setupControl',
		};
		const abilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
		};

		const limitFactor = Math.ceil(this.maxTeamSize / 6);

		const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: this.prng.random() ** (1 / this.randomOMFactorySets[jsonFactoryTier][speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && (pokemon.length < this.maxTeamSize || pokemon.some(e => e.species === "MissingNo."))) {
			let species;
			if (jsonFactoryTier === 'gg' && !teamData.god) {
				const godSpecies = shuffledSpecies.filter(x => ggbanlist.isRestrictedSpecies(this.dex.species.get(x.speciesName)));
				species = this.dex.species.get(godSpecies.pop()!.speciesName);
			} else {
				species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			}
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
			// case 'bh':
			// 	break;
			// case 'gg':
			// 	break;
			case 'pic':
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

			if (isHackmonsTier && !teamData.forceResult) {
				if (teamData.improofList!.length) {
					const improofsSomething = set.whatItImproofs!.filter(e => teamData.improofList!.includes(e));
					if (improofsSomething.length) {
						for (const improofedSpecies of improofsSomething) {
							const spliceIndex = teamData.improofList!.findIndex(e => e === improofedSpecies);
							if (spliceIndex >= 0) teamData.improofList!.splice(spliceIndex, 1);
						}
					} else {
						if (!pokemon.some(e => set.improofedBy!.includes(e.species)) || !set.improofedBy!.includes(set.species)) continue;
					}
				}
			}

			if (isArchetypeTier && teamData.archetype && !teamData.forceResult) {
				if (Array.isArray(teamData.archetype)) {
					if (!teamData.archetype.filter(e => set.archetype!.includes(e)).length) continue;
				} else {
					if (!set.archetype!.includes(teamData.archetype)) continue;
				}
			}

			// In these OMs,reject if pokemon share a type their abilities are immune to
			if (isArchetypeTier && immunityAbilities[toID(set.ability)]?.length) {
				let reject = false;
				for (const type of immunityAbilities[toID(set.ability)]) {
					 if (teamData.has['immunity:' + toID(type)]) {
						 reject = true;
						 break;
					 }
				}
				if (reject) continue;
			}

			if (jsonFactoryTier === 'gg') {
				// Due to how Godly Gift works, we have to tell the system which slot to put it in and add it that way
				let setAdded = false;
				if (!teamData.god) {
					this.prng.shuffle(set.slot!);
					for (const slotStat of set.slot!) {
						if (pokemon[GG_SLOTS[slotStat]]!.species === "MissingNo.") {
							pokemon[GG_SLOTS[slotStat]] = set;
							teamData.god = set.species;
							setAdded = true;
							break;
						}
					}
				} else {
					const godStats = this.dex.species.get(teamData.god).baseStats;
					const setStats = this.dex.species.get(set.species).baseStats;
					if (ggbanlist.isRestrictedSpecies(this.dex.species.get(set.species))) continue;
					for (const slotStat of set.slot!) {
						if (setStats[slotStat] >= godStats[slotStat]) continue;
						if (pokemon[GG_SLOTS[slotStat]]!.species === "MissingNo.") {
							pokemon[GG_SLOTS[slotStat]] = set;
							setAdded = true;
							break;
						}
					}
				}
				if (!setAdded) continue;
			} else {
				// Okay, the set passes, add it to our team
				pokemon.push(set);
			}

			// Now that our Pokemon has passed all checks, we can update team data:

			if (isHackmonsTier) {
				if (!set.improofedBy!.includes(set.species)) {
					if (!pokemon.some(e => set.improofedBy!.includes(e.species))) {
						teamData.improofList!.push(set.species);
					}
				}
			}

			if (isArchetypeTier && !teamData.forceResult) {
				if (!teamData.archetype) {
					teamData.archetype = set.archetype!;
				} else if (Array.isArray(teamData.archetype)) {
					teamData.archetype = this.sampleIfArray(teamData.archetype.filter(e => set.archetype!.includes(e)));
				}
				console.log(teamData.archetype);
			}


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

			if (jsonFactoryTier !== '6ph') {
				teamData.baseFormes[species.baseSpecies] = 1;
			}

			teamData.has[toID(set.item)] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (move === 'mortalspin' && !['bh', 'stab'].includes(jsonFactoryTier)) continue;
				if (movesLimited[moveId]) {
					teamData.has[movesLimited[moveId]] = 1;
				}
			}

			const ability = this.dex.abilities.get(set.ability);
			if (abilitiesLimited[ability.id]) {
				teamData.has[abilitiesLimited[ability.id]] = 1;
			}

			if (sac) {
				teamData.has[ability.id] = 1;
			}

			// soft sac due to how these tiers work, exceptions to sac listed above;
			if (isArchetypeTier && !SOFT_AC_WHITELIST[jsonFactoryTier].includes(ability.id)) {
				teamData.has[ability.id] = 1;
			}

			const item = this.dex.items.get(set.item);
			if (jsonFactoryTier === 'mnm') {
				// Stone clause
				if (((item.forcedForme && !item.zMove) || item.megaStone ||
					item.isPrimalOrb || item.name.startsWith('Rusted'))) {
					teamData.has[item.id] = 1;
				}
			}

			// donor clause
			if (jsonFactoryTier === 'inh') {
				let donorSpecies = Dex.species.get(set.pokeball!.split('0')[1]);
				teamData.has['donor:' + donorSpecies.id] = 1;
				while (donorSpecies.prevo) {
					const prevoSpecies = Dex.species.get(donorSpecies.prevo);
					if (prevoSpecies.evos.length > 1) break;
					teamData.has['donor:' + prevoSpecies.id] = 1;
					donorSpecies = prevoSpecies;
				}
			}

			if (isArchetypeTier && immunityAbilities[ability.id]?.length) {
				for (const type of immunityAbilities[ability.id]) {
					teamData.has['immunity:' + toID(type)] = 1;
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
		if (!teamData.forceResult && teamData.improofList?.length) {
			return this.randomFactoryTeam(side, ++depth);
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
			let badHazardStandards = false;
			if (!teamData.has['stealthRock'] && !isArchetypeTier) {
				badHazardStandards = true;
			}
			if (!teamData.has['hazardClear'] && (jsonFactoryTier === 'bh' || jsonFactoryTier === 'inh')) {
				badHazardStandards = true;
			}
			if (badHazardStandards) return this.randomFactoryTeam(side, ++depth);
		}

		if (pokemon.some(e => e.species === "MissingNo.")) {
			if (!teamData.forceResult) {
				return this.randomFactoryTeam(side, ++depth);
			} else {
				console.log(depth);
				return pokemon.filter(e => e.species !== "MissingNo.");
			}
		}

		console.log(depth);
		return pokemon;
	}
	randomGenericFactorySet(
		species: Species, teamData: TeamData, tier: string
	): randomOMFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomOMFactorySets[tier][id].sets;

		const itemsLimited = ['choicespecs', 'choiceband', 'choicescarf'];
		const movesLimited: { [k: string]: string } = {
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
		const abilitiesLimited: { [k: string]: string } = {
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

			if (tier === 'inh') {
				let donorSpecies = Dex.species.get(set.donor);
				if (teamData.has['donor:' + donorSpecies.id]) {
					reject = true;
					break;
				}
				while (donorSpecies.prevo) {
					const prevoSpecies = Dex.species.get(donorSpecies.prevo);
					if (prevoSpecies.evos.length > 1) break;
					if (teamData.has['donor:' + prevoSpecies.id]) {
						reject = true;
						break;
					}
					donorSpecies = prevoSpecies;
				}
			} else if (tier === 'bh') {
				if (teamData.improofList!.length && !set.improofs!.filter(e => teamData.improofList!.includes(e)).length) {
					if (!set.improofedBy!.includes(set.species)) {
						reject = true;
						break;
					}
				}
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

			if (tier === 'aaa' || tier === 'inh') {
				// SAC
				if (teamData.has[abilityId]) continue;
			}

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
			effectivePool.push({ set, moves, item });
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const set of setList) {
				effectivePool.push({ set });
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

		const item = this.sampleIfArray(setData.set.item);

		return {
			name: species.baseSpecies,
			species: (typeof species.battleOnly === 'string' && tier !== 'bh') ? species.battleOnly : species.name,
			teraType: setData.set.teraType ? this.sampleIfArray(setData.set.teraType) : species.requiredTeraType || species.types[0],
			gender:	setData.set.gender || species.gender,
			item,
			ability: this.sampleIfArray(setData.set.ability),
			shiny: setData.set.shiny || this.randomChance(1, 1024),
			level: this.adjustLevel || 100,
			happiness: 255,
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
			nature: this.sampleIfArray(setData.set.nature) || "Serious",
			moves,
			pokeball: (tier === 'inh') ? '0' + setData.set.donor : '',
			wantsTera: setData.set.wantsTera || false,
			whatItImproofs: setData.set.improofs || undefined,
			improofedBy: setData.set.improofedBy || undefined,
			slot: setData.set.slot || undefined,
			archetype: setData.set.archetype || undefined,
		};
	}
}

export default RandomOMBattleFactoryTeams;
