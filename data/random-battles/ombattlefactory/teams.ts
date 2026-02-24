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
	bestStat?: StatID[];
	archetype?: string | string[];
}

// it's OM not Om >:(
// eslint-disable-next-line @typescript-eslint/naming-convention
interface randomOMFactorySet extends RandomTeamsTypes.RandomFactorySet {
	whatItImproofs?: string[]; // bh
	improofedBy?: string[]; // bh
	pokeball?: string; // inh
	isGod?: boolean; // GG
	slot?: (StatID | 'any')[]; // GG
	bestStat?: StatID[]; // GG
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
	slot?: (StatID | 'any')[]; // GG
	bestStat?: StatID[]; // GG
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

const debug = 'Balanced Hackmons';

export class RandomOMBattleFactoryTeams extends RandomTeams {
	// eslint-disable-next-line @stylistic/max-len
	randomOMFactorySets: { [format: string]: { [species: string]: OMBattleFactorySpecies } } = require('./factory-sets.json');

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		const ruleTable = Dex.formats.getRuleTable(Dex.formats.get(format));
		// Unlike in regular battle factory, there will be minimal cherry picking to ensure bad combinations do not show up
		let viableTiers = Object.keys(OM_TIERS);
		// Only works with 6 Pokemon
		if (this.maxTeamSize !== 6) viableTiers = viableTiers.filter(t => t !== 'Godly Gift');
		// Doubles tier
		if (this.maxTeamSize < 2 || (ruleTable.pickedTeamSize && ruleTable.pickedTeamSize < 2)) {
			viableTiers = viableTiers.filter(t => t !== 'Partners in Crime');
		}

		this.factoryTier = debug || this.sample(viableTiers);

		const tierID = this.dex.formats.get(ruleTable.valueRules.get('forcebattlefactorytier')).id || undefined;
		const ombfTiers: { [k: string]: string } = {
			'gen9almostanyability': 'Almost Any Ability',
			'gen9balancedhackmons': 'Balanced Hackmons',
			'gen9godlygift': 'Godly Gift',
			'gen9inheritance': 'Inheritance',
			'gen9mixandmega': 'Mix and Mega',
			'gen9partnersincrime': 'Partners in Crime',
			'gen9sharedpower': 'Shared Power',
			'gen9stabmons': 'STABmons',
			'gen6purehackmons': '[Gen 6] Pure Hackmons',
		};

		if (tierID && ombfTiers[tierID]) {
			if (!viableTiers.includes(ombfTiers[tierID])) {
				throw new Error(`Your ruleset is incompatible with ${ombfTiers[tierID]}.`);
			} else {
				this.factoryTier = ombfTiers[tierID];
			}
		}
	}

	override randomFactoryTeam(side: PlayerOptions, depth = 0): randomOMFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const jsonFactoryTier = OM_TIERS[this.factoryTier];

		// Some tiers need more care into teambuilding
		const forceResult = (['bh', 'gg', 'pic', 'sp', '6ph'].includes(jsonFactoryTier)) ? depth >= 24 : depth >= 12;

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
		const abilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
		};

		// Stones that change type or give an immunity ability on mega evolution
		const mnmTypeChangeStones: { [k: string]: (string | null)[] } = {
			absolitez: [null, 'Ghost'],
			aggronite: [null, 'Steel'],
			altarianite: [null, 'Fairy'],
			ampharosite: [null, 'Dragon'],
			audinite: [null, 'Fairy'],
			barbaracite: [null, 'Fighting'],
			charizarditex: [null, 'Dragon'],
			chimechite: [null, 'Steel'],
			clefablite: [null, 'Flying'],
			cornerstonemask: [null, 'Rock'],
			feraligite: [null, 'Dragon'],
			garchompitez: [null, 'Dragon'],
			golisopite: [null, 'Steel'],
			gyaradosite: [null, 'Dark'],
			hearthflamemask: [null, 'Fire'],
			lopunnite: [null, 'Fighting'],
			meganiumite: [null, 'Fairy'],
			mewtwonitex: [null, 'Fighting'],
			pinsirite: [null, 'Flying'],
			rustedsword: [null, 'Steel'],
			rustedshield: [null, 'Steel'],
			sceptilite: [null, 'Dragon'],
			staraptite: ['Fighting', null],
			wellspringmask: [null, 'Water'],
		};
		const mnmResistanceAbilityStones: { [k: string]: string[] } = {
			blueorb: ['Fire'],
			chandelurite: ['Fire'],
			chimechite: ['Ground'],
			eelektrossite: ['Ground'],
			griseouscore: ['Ground'],
			heatranite: ['Fire'],
			latiasite: ['Ground'],
			latiosite: ['Ground'],
			redorb: ['Water'],
			sceptilite: ['Electric'],
			venusaurite: ['Ice', 'Fire'],
			wellspringmask: ['Water'],
			zeraorite: ['Electric'],
		};

		// In godly gift these pokemon have stats so bad that its nearly impossible to slot automatically
		const ggReallyBadStats: { [k: string]: StatID[] } = {
			calyrexice: ['spe'],
			deoxys: ['hp', 'def', 'spd'],
		};

		const redundantAbilities: { [k: string]: string[] } = {
			dryskin: ['WaterImmunity'], waterabsorb: ['WaterImmunity'], stormdrain: ['WaterImmunity'],
			flashfire: ['FireImmunity'], wellbakedbody: ['FireImmunity'],
			lightningrod: ['ElectricImmunity'], motordrive: ['ElectricImmunity'], voltabsorb: ['ElectricImmunity'],
			sapsipper: ['GrassImmunity'],
			eartheater: ['GroundImmunity'], levitate: ['GroundImmunity'],
			// AAA and BH
			desolateland: ['WaterImmunity'], primordialsea: ['FireImmunity'],
			purifyingsalt: ['statusImmunity'], naturalcure: ['statusImmunity'],
		};

		// Doubles teambuilding has different requirements
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
			protect: 'protectMove',
			detect: 'protectMove',
			kingsshield: 'protectMove',
			spikyshield: 'protectMove',
			banefulbunker: 'protectMove',
			obstruct: 'protectMove',
			silktrap: 'protectMove',
			burningbulwark: 'protectMove',
		};
		const picAbilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
			unaware: 'setupControl',
			goodasgold: 'sporeCheck',
			overcoat: 'sporeCheck',
			magicbounce: 'sporeCheck',
			vitalspirit: 'sporeCheck',
			purifyingsalt: 'sporeCheck',
			sapsipper: 'sporeCheck',
		};

		// Needed, otherwise you get bad team compositions
		const picMovesWithRequiredElements: { [k: string]: string[] } = {
			// afteryou: ['drought', 'prankster'], // Needs hardcoding
			expandingforce: ['psychicsurge'],
			electroshot: ['drizzle', 'raindance'],
			grassyglide: ['grassysurge'],
			blizzard: ['snowwarning', 'snowscape'],
			solarblade: ['drought', 'sunnyday'],
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
			if (teamData.baseFormes[species.baseSpecies] && jsonFactoryTier !== '6ph') continue;

			// Limit 2 of any type (most of the time)
			let types = species.types;
			if (jsonFactoryTier !== 'mnm') {
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
			}

			let set = undefined;

			set = this.randomFactorySet(species, teamData, jsonFactoryTier);

			if (!set) continue;

			// Same deal as the earlier code except we mutate all types to be what their stones are
			if (jsonFactoryTier === 'mnm') {
				types = [];
				let deltaTypes = [] as (string | null)[];
				if (mnmTypeChangeStones[toID(set.item)]) {
					deltaTypes = mnmTypeChangeStones[toID(set.item)];
				} else if (this.dex.items.get(set.item).onPlate) {
					deltaTypes = [this.dex.items.get(set.item).onPlate!, null];
				} else if (this.dex.items.get(set.item).onMemory) {
					deltaTypes = [this.dex.items.get(set.item).onMemory!, null];
				}
				if (deltaTypes.length) {
					for (let i = 0; i < 2; i++) {
						if (deltaTypes[i]) {
							types.push(deltaTypes[i]!);
						} else if (species.types[i]) {
							types.push(species.types[i]);
						}
					}
					types = [...new Set(types)];
				} else {
					types = species.types;
				}
				console.log(set.species);
				console.log(set.item);
				console.log(types);
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
			}

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

			if (isArchetypeTier && set.archetype && teamData.archetype && !teamData.forceResult) {
				if (Array.isArray(teamData.archetype)) {
					if (!teamData.archetype.filter(e => set.archetype!.includes(e)).length) continue;
				} else {
					if (!set.archetype.includes(teamData.archetype)) continue;
				}
			}

			// In these OMs,reject if pokemon share a type their abilities are immune to
			if (isArchetypeTier && redundantAbilities[toID(set.ability)]?.length) {
				let reject = false;
				for (const redundancy of redundantAbilities[toID(set.ability)]) {
					if (teamData.has[toID(redundancy)]) {
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
						if (slotStat === 'any') continue; // Should not be here for gods
						if (pokemon[GG_SLOTS[slotStat]].species === "MissingNo.") {
							pokemon[GG_SLOTS[slotStat]] = set;
							teamData.god = set.species;
							teamData.bestStat = set.bestStat;
							setAdded = true;
							break;
						}
					}
				} else {
					const godStats = this.dex.species.get(teamData.god).baseStats;
					const setStats = this.dex.species.get(set.species).baseStats;
					if (ggbanlist.isRestrictedSpecies(this.dex.species.get(set.species))) continue;
					for (const slotStat of set.slot!) {
						if (slotStat === 'any') {
							for (const s of Dex.stats.ids()) {
								if (teamData.bestStat?.includes(s)) continue;
								if (ggReallyBadStats[toID(teamData.god)]?.includes(s)) {
									if (['atk', 'spa'].includes((s))) {
										const opposite = s === 'atk' ? 'spa' as StatID : 'atk' as StatID;
										if (setStats[opposite] < setStats[s]) continue;
									} else {
										if ((setStats[s] - godStats[s]) > 15) continue;
									}
								} else {
									if (setStats[s] >= godStats[s]) continue;
								}
								if (pokemon[GG_SLOTS[s]].species === "MissingNo.") {
									pokemon[GG_SLOTS[s]] = set;
									setAdded = true;
									break;
								}
							}
						} else {
							if (ggReallyBadStats[toID(teamData.god)]?.includes(slotStat)) {
								if (['atk', 'spa'].includes((slotStat))) {
									const opposite = slotStat === 'atk' ? 'spa' as StatID : 'atk' as StatID;
									if (setStats[opposite] < setStats[slotStat]) continue;
								} else {
									if ((setStats[slotStat] - godStats[slotStat]) > 15) continue;
								}
							} else {
								if (setStats[slotStat] >= godStats[slotStat]) continue;
							}
							if (pokemon[GG_SLOTS[slotStat]].species === "MissingNo.") {
								pokemon[GG_SLOTS[slotStat]] = set;
								setAdded = true;
								break;
							}
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

			if (isArchetypeTier && set.archetype && !teamData.forceResult) {
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

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[toID(set.item)] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			const ability = this.dex.abilities.get(set.ability);

			if (jsonFactoryTier === 'pic') {
				const saidPiCRequiredElements = [...new Set(Object.values(picMovesWithRequiredElements).flat())];

				// misc. spore checks
				if (toID(set.item) === 'safetygoggles' || set.teraType === 'Grass' || types.includes('Grass')) {
					if (teamData.has['sporeCheck']) {
						teamData.has['sporeCheck']++;
					} else {
						teamData.has['sporeCheck'] = 1;
					}
				}

				for (const move of set.moves) {
					const moveId = toID(move);
					if (picMovesLimited[moveId]) {
						if (teamData.has[picMovesLimited[moveId]]) {
							teamData.has[picMovesLimited[moveId]]++;
						} else {
							teamData.has[picMovesLimited[moveId]] = 1;
						}
					}
					if (saidPiCRequiredElements.includes(moveId)) {
						teamData.has['pic:' + moveId] = 1;
					}
					if (moveId === 'focusenergy') {
						teamData.has['pic:focusenergy'] = 1;
					}
				}
				if (picAbilitiesLimited[ability.id]) {
					if (teamData.has[picAbilitiesLimited[ability.id]]) {
						teamData.has[picAbilitiesLimited[ability.id]]++;
					} else {
						teamData.has[picAbilitiesLimited[ability.id]] = 1;
					}
				}
				if (saidPiCRequiredElements.includes(ability.id)) {
					teamData.has['pic:' + ability.id] = 1;
				}
				// After You
				if (set.species === 'Torkoal') {
					teamData.has['pic:torkoal'] = 1;
				}
				if (ability.id === 'prankster') {
					teamData.has['pic:prankster'] = 1;
				}
			} else {
				for (const move of set.moves) {
					const moveId = toID(move);
					if (move === 'mortalspin' && !['bh', 'stab'].includes(jsonFactoryTier)) continue;
					if (movesLimited[moveId]) {
						if (movesLimited[moveId] === 'hazardClear' &&
							teamData.has[movesLimited[moveId]] && jsonFactoryTier === 'bh') {
							teamData.has[movesLimited[moveId]]++;
						} else {
							teamData.has[movesLimited[moveId]] = 1;
						}

					}
				}
				if (abilitiesLimited[ability.id]) {
					teamData.has[abilitiesLimited[ability.id]] = 1;
				}
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

			if (isArchetypeTier && redundantAbilities[ability.id]?.length) {
				for (const redundancy of redundantAbilities[ability.id]) {
					teamData.has[toID(redundancy)] = 1;
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
				} else if (
					jsonFactoryTier === 'mnm' &&
					mnmResistanceAbilityStones[item.id]?.includes(typeName)
				) {
					console.log(item.id);
					console.log(mnmResistanceAbilityStones[item.id]);
					teamData.resistances[typeName] = 1;
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

			if (jsonFactoryTier === 'pic') {
				let badPiCstandards = false;
				if (!teamData.has['protectMove'] || teamData.has['protectMove'] < 2) {
					badPiCstandards = true;
				}
				if (!teamData.has['setupControl']) {
					badPiCstandards = true;
				}
				if (!teamData.has['sporeCheck'] || teamData.has['sporeCheck'] < 2) {
					badPiCstandards = true;
				}
				if ((!teamData.has['trickRoom'] || teamData.has['trickRoom'] < 2) && teamData.archetype === 'trickroom') {
					badPiCstandards = true;
				}
				if (badPiCstandards) return this.randomFactoryTeam(side, ++depth);
			}
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
	override randomFactorySet(
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
			protect: 'protectMove',
			detect: 'protectMove',
			kingsshield: 'protectMove',
			spikyshield: 'protectMove',
			banefulbunker: 'protectMove',
			obstruct: 'protectMove',
			silktrap: 'protectMove',
			burningbulwark: 'protectMove',
		};

		const picAbilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
			unaware: 'setupControl',
			goodasgold: 'sporeCheck',
			overcoat: 'sporeCheck',
			magicbounce: 'sporeCheck',
			vitalspirit: 'sporeCheck',
			purifyingsalt: 'sporeCheck',
			sapsipper: 'sporeCheck',
		};

		const picMovesWithRequiredElements: { [k: string]: string[] } = {
			// afteryou: ['drought', 'prankster'], // Needs hardcoding
			expandingforce: ['psychicsurge'],
			electroshot: ['drizzle', 'raindance'],
			grassyglide: ['grassysurge'],
			blizzard: ['snowwarning', 'snowscape'],
			solarblade: ['drought', 'sunnyday'],
		};

		const sac = (tier === 'aaa' || tier === 'inh');

		const isArchetypeTier = (tier === 'sp' || tier === 'pic');

		const isHackmonsTier = (tier === 'bh' || tier === '6ph');

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
			} else if (isHackmonsTier) {
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
					if (tier === 'pic' && itemId === 'scopelens' && !teamData.has['pic:focusenergy']) {
						continue;
					}
					allowedItems.push(itemString);
				}
			} else {
				const itemId = toID(set.item);
				let rejectItem = false;
				if (tier === 'pic' && itemId === 'scopelens' && !teamData.has['pic:focusenergy']) {
					rejectItem = true;
				}
				if (tier === 'mnm' && teamData.has[itemId]) {
					rejectItem = true;
				}
				if (!(itemsLimited.includes(itemId) && teamData.has[itemId]) && !rejectItem) {
					allowedItems.push(set.item);
				}
			}
			if (!allowedItems.length) continue;
			const item = this.sample(allowedItems);

			const abilityId = toID(this.sampleIfArray(set.ability));

			if (tier === 'pic') {
				if (picAbilitiesLimited[abilityId]) {
					switch (picAbilitiesLimited[abilityId]) {
					case 'setupControl':
						if (teamData.has[picAbilitiesLimited[abilityId]] >= 2) continue;
						break;
					case 'sporeCheck':
						if (teamData.has[picAbilitiesLimited[abilityId]] >= 3) continue;
						break;
					default:
						if (teamData.has[picAbilitiesLimited[abilityId]]) continue;
						break;
					}
				}
			} else {
				if (abilitiesLimited[abilityId] && teamData.has[abilitiesLimited[abilityId]]) continue;
			}

			if (sac || isArchetypeTier) {
				// SAC
				if (teamData.has[abilityId]) continue;
			}

			const moves: string[] = [];
			for (const move of set.moves) {
				const allowedMoves: string[] = [];
				if (Array.isArray(move)) {
					for (const m of move) {
						const moveId = toID(m);
						if (tier === 'pic') {
							if (moveId === 'afteryou') {
								switch (set.species) {
								case 'Lilligant-Hisui':
									if (!teamData.has['pic:torkoal']) continue;
									break;
								case 'Ampharos':
									if (!teamData.has['pic:prankster']) continue;
									break;
								}
							}
							if (picMovesWithRequiredElements[moveId]) {
								let unsupportedElement = false;
								for (const required of picMovesWithRequiredElements[moveId]) {
									if (!teamData.has['pic:' + required]) {
										unsupportedElement = true;
										break;
									} else if (toID(set.ability) !== required) {
										unsupportedElement = true;
										break;
									}
								}
								if (unsupportedElement) continue;
							}
							if (picMovesLimited[moveId]) {
								switch (picMovesLimited[moveId]) {
								case 'setupControl':
									if (teamData.has[picMovesLimited[moveId]] >= 2) continue;
									break;
								case 'trickRoom':
									// TODO: standarize archetype names
									const trickRoomLimit = teamData.archetype === 'trickroom' ? 4 : 1;
									if (teamData.has[picMovesLimited[moveId]] >= trickRoomLimit) continue;
									break;
								case 'protectMove':
									if (teamData.has[picMovesLimited[moveId]] >= 4) continue;
									break;
								case 'default':
									if (teamData.has[picMovesLimited[moveId]]) continue;
									break;
								}
							}
						} else {
							if (movesLimited[moveId] && teamData.has[movesLimited[moveId]]) {
								if (movesLimited[moveId] === 'hazardClear' && tier === 'bh') {
									if (teamData.has[movesLimited[moveId]] >= 2) continue;
								} else {
									continue;
								}
							}
						}
						allowedMoves.push(m);
					}
				} else {
					const moveId = toID(move);
					if (tier === 'pic') {
						let unsupportedElement = false;
						if (moveId === 'afteryou') {
							switch (set.species) {
							case 'Lilligant-Hisui':
								if (!teamData.has['pic:torkoal']) unsupportedElement = true;
								break;
							case 'Ampharos':
								if (!teamData.has['pic:prankster']) unsupportedElement = true;
								break;
							}
						}
						if (picMovesWithRequiredElements[moveId]) {
							for (const required of picMovesWithRequiredElements[moveId]) {
								if (teamData.has['pic:' + required]) {
									unsupportedElement = true;
									break;
								} else if (toID(set.ability) !== required) {
									unsupportedElement = true;
									break;
								}
							}
						}
						let tooManyMovesLimited = false;
						if (picMovesLimited[moveId]) {
							switch (picMovesLimited[moveId]) {
							case 'setupControl':
								if (teamData.has[picMovesLimited[moveId]] >= 2) tooManyMovesLimited = true;
								break;
							case 'trickRoom':
								// TODO: standarize archetype names
								const trickRoomLimit = teamData.archetype === 'trickroom' ? 4 : 1;
								if (teamData.has[picMovesLimited[moveId]] >= trickRoomLimit) tooManyMovesLimited = true;
								break;
							case 'protectMove':
								if (teamData.has[picMovesLimited[moveId]] >= 4) tooManyMovesLimited = true;
								break;
							case 'default':
								if (teamData.has[picMovesLimited[moveId]]) tooManyMovesLimited = true;
								break;
							}
						}
						if (!tooManyMovesLimited && !unsupportedElement) {
							allowedMoves.push(move);
						}
					} else {
						if (!(movesLimited[moveId] && teamData.has[movesLimited[moveId]])) {
							if (movesLimited[moveId] === 'hazardClear' && tier === 'bh') {
								if (!(teamData.has[movesLimited[moveId]] >= 2)) allowedMoves.push(move);
							} else {
								allowedMoves.push(move);
							}
						}
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
			// eslint-disable-next-line @stylistic/max-len
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
			pokeball: (tier === 'inh') ? `0${setData.set.donor}` : '',
			wantsTera: setData.set.wantsTera || false,
			whatItImproofs: setData.set.improofs || undefined,
			improofedBy: setData.set.improofedBy || undefined,
			slot: setData.set.slot || undefined,
			bestStat: setData.set.bestStat || undefined,
			archetype: setData.set.archetype || undefined,
		};
	}
}

export default RandomOMBattleFactoryTeams;
