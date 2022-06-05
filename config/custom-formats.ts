// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

import {toID} from './../sim/dex';

// Mix and Meta includes
import {MixAndMeta as MxM} from '../.data-dist/mods/mixandmeta/mixedmetacollection';
const MixedMetaCollection = MxM.MixedMetaCollection as {[k: string]: MixedMeta}; // Type import correctly

export const Formats: FormatList = [

	// Random Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "Random Mashups",
	},
	{ // 19/11/30: It is automatically generating teams from Gen 8 so call it Gen 8 for now
		name: "[Gen 8] Suicide Cup: Random Battle",
		desc: `Randomized teams of Pok&eacute;mon with sets that are generated to end their lives in a quick and humane manner.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
		],

		mod: 'suicidecup',
		team: 'randomSC',
		ruleset: ['PotD', 'Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause', 'Obtainable', 'Sleep Clause Mod', 'Species Clause'],
	},
	{
		name: "[Gen 8] Mix and Mega: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with mega stones (and they know how to use 'em!)`,

		mod: 'mixandmega',
		team: 'randomHCMnM',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Mix and Mega Battle Effects'],
		onBegin() { // For some reason this is necessary in randoms even with Battle Effects
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
	},
	{
		name: "[Gen 8] Partners in Crime: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon where both active ally Pok&eacute;mon share dumb abilities and moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3618488/">Partners in Crime</a>`,
		],

		mod: 'pic',
		gameType: 'doubles',
		team: 'randomHCPiC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
		onBeforeSwitchIn(pokemon) {
			for (const side of this.sides) {
				if (side.active.every(ally => ally && !ally.fainted)) {
					let pokeA = side.active[0], pokeB = side.active[1];
					if (pokeA.ability !== pokeB.ability) {
						const pokeAInnate = 'ability:' + pokeB.ability;
						pokeA.volatiles[pokeAInnate] = {id: toID(pokeAInnate), target: pokeA};
						const pokeBInnate = 'ability:' + pokeA.ability;
						pokeB.volatiles[pokeBInnate] = {id: toID(pokeBInnate), target: pokeB};
					}
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability:' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability:' + pokemon.ability;
					delete ally.volatiles[ally.m.innate];
					ally.addVolatile(ally.m.innate);
				}
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		onFaint(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	{
		name: "[Gen 8] Pokebilities: Random Battle",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with all of their released Abilities simultaneously.`,

		mod: 'gen8',
		team: 'random',
		ruleset: ['Standard', 'Pokebilities Rule'],
	},
	{
		name: "[Gen 8] Crazyhouse: Random Battle",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with the Crazyhouse mechanic.`,

		mod: 'gen8',
		team: 'random',
		ruleset: ['Standard', 'Crazyhouse Rule', 'Dynamax Clause'],
	},
	{
		name: "[Gen 8] Trademarked: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with random trademarks.`,

		mod: 'gen8',
		team: 'randomHCTM',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
		pokemon: {
			getAbility() {
				const move = this.battle.dex.moves.get(this.battle.toID(this.ability));
				if (!move.exists) return Object.getPrototypeOf(this).getAbility.call(this);
				return {
					id: move.id,
					name: move.name,
					onStart(this: Battle, pokemon: Pokemon) {
						this.add('-activate', pokemon, 'ability: ' + move.name);
						this.actions.useMove(move, pokemon);
					},
					toString() {
						return "";
					},
				};
			},
		},
	},

	// Mashups Spotlight
	///////////////////////////////////////////////////////////////////
	{
		section: "Pet Mod Mashups",
		column: 1,
	},
	{
		name: "[Gen 8 MIXT] STABmons Mix and Mega",
		desc: `Pok&eacute;mon can use any move of their typing and mega evolve with any stone, primal orb, or other things to gain the respective boosts.`,

		mod: 'genmixt',
		
		ruleset: [
			'Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Overflow Stat Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'Mega Rayquaza Clause', 'STABmons Move Legality',
		],
		banlist: [
			'Kyogre', 'Zacian', 'Moody', 'Shadow Tag', 'Beedrillite', 'Blazikenite', 'Gengarite',
			'Kangaskhanite', 'King\'s Rock', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Baton Pass', 'Electrify',
		],
		restricted: [
			'Dialga', 'Dragapult', 'Dragonite', 'Eternatus', 'Genesect', 'Gengar', 'Giratina',
			'Groudon', 'Ho-Oh', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Therian', 'Lugia',
			'Lunala', 'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Rayquaza', 'Regigigas', 'Reshiram', 'Tapu Koko', 'Thundurus', 'Urshifu-Base', 'Xerneas', 'Yveltal',
			'Zekrom', 'Zeraora', 'Zygarde-Base', 'Zygarde-Complete', 'Acupressure', 'Belly Drum', 'Bolt Beak',
			'Boomburst', 'Clangorous Soul', 'Double Iron Bash', 'Extreme Speed', 'Fishious Rend', 'Geomancy', 'Lovely Kiss',
			'Precipice Blades', 'Shell Smash', 'Shift Gear', 'Sleep Powder', 'Spore', 'Thousand Arrows', 'Transform', 'V-create',
			'Wicked Blow',
		],
		onValidateTeam(team) {
			const itemTable = new Set<ID>();
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!item.exists) continue;
				if (itemTable.has(item.id) && (item.megaStone || item.onPrimal)) {
					return [
						`You are limited to one of each Mega Stone and Primal Orb.`,
						`(You have more than one ${item.name}.)`,
					];
				}
				itemTable.add(item.id);
			}
		},
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && !item.onPrimal && item.id !== 'ultranecroziumz') return;
			if (species.baseSpecies === item.megaEvolves || (item.onPrimal && item.itemUser?.includes(species.baseSpecies)) ||
				(species.name.startsWith('Necrozma-') && item.id === 'ultranecroziumz')) {
				return;
			}
			if (this.ruleTable.isRestricted(`item:${item.id}`) || this.ruleTable.isRestrictedSpecies(species) ||
				set.ability === 'Power Construct') {
				return [`${set.species} is not allowed to hold ${item.name}.`];
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			// @ts-ignore
			const oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
				const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			const oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			}
		},
	},

	// Mashups Spotlight
	///////////////////////////////////////////////////////////////////
	{
		section: "Mashups Spotlight",
		column: 1,
	},

	// Official OM Mashups
	///////////////////////////////////////////////////////////////////
	{
		section: "Official OM Mashups (Singles)",
		column: 1,
	},
	{
		name: "[Gen 8] PokeAAAbilities",
		desc: `Pok&eacute;mon have all of their released abilities simultaneously AND get one more ability of your choice, set in the builder.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/8821047">Pok&eacute;bilities AAA</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause', 'Pokebilities Rule', '!Obtainable Abilities', '2 Ability Clause', 'Sleep Moves Clause', '!Sleep Clause Mod'],
		banlist: [
			'Alakazam', 'Blacephalon', 'Buzzwole', 'Clefable', 'Dragapult', 'Dragonite', 'Gengar', 'Kartana', 'Keldeo', 'Kyurem', 'Melmetal', 'Mienshao',
			'Noivern', 'Obstagoon', 'Perrserker', 'Reuniclus', 'Rillaboom', 'Tapu Lele', 'Urshifu', 'Urshifu-Rapid-Strike', 'Victini', 'Weavile', 'Zamazenta-Crowned',
			'Zapdos-Galar', 'Arena Trap', 'Moody', 'Shadow Tag', 'Wonder Guard', 'Chlorophyll + Desolate Land', 'Chlorophyll + Drought', 'Electric Surge + Surge Surfer',
			'Regenerator + Emergency Exit', 'Regenerator + Multiscale', 'Regenerator + Shadow Shield', 'Regenerator + Wimp Out', 'Sand Rush + Sand Stream',
			'Slush Rush + Snow Warning', 'Swift Swim + Drizzle', 'Swift Swim + Primordial Sea', 'Snow Cloak + Snow Warning', 'Sand Veil + Sand Stream',
			'Regenerator > 2', 'Bright Powder', 'Lax Incense', 'Quick Claw',
		],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out',
			'Intrepid Sword', 'Libero', 'Magnet Pull', 'Neutralizing Gas', 'Parental Bond', 'Poison Heal', 'Prankster', 'Protean', 'Pure Power',
			'Quick Draw', 'Sand Veil', 'Serene Grace', 'Simple', 'Snow Cloak', 'Speed Boost', 'Stakeout', 'Stench', 'Tinted Lens', 'Triage',
			'Unburden', 'Water Bubble',
		],
	},
	{
		section: "Official OM Mashups (Doubles)",
		column: 1,
	},
	{
		section: "Official OM Mashups (Little Cup)",
		column: 1,
	},

	// Other OM Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "Other Mashups",
	},
	{
		section: "US/UM Official OM Mashups (Singles)",
	},
	{
		name: "[Gen 7] Pure Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed, with no bans or clauses.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/pure-hackmons-introduction">Pure Hackmons Introduction</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/page-4#post-7866923">Pure Hackmons Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/old-generations-of-hackmons-megathread.3649618/">Pure Hackmons Old Gens Megathread</a>`,
		],

		mod: 'gen7',
		ruleset: ['-Nonexistent', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Mix and Mega Anything Goes",
		desc: `Mega Stones and Primal Orbs can be used on any Pok&eacute;mon with no Mega Evolution limit, and no bans or clauses.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">MnM AG Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587441/">Vanilla Anything Goes</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Gen 7 Mix and Mega Battle Effects'],
		restricted: ['Ultranecrozium Z'],
	},
	{
		name: "[Gen 7] Almost Any Ability Ubers",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">AAA Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: ['Necrozma-Dusk-Mane', 'Shedinja'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'Arena Trap', 'Shadow Tag', // For Ubers
		],
	},
	{
		name: "[Gen 7] CAAAmomons",
		desc: `Pok&eacute;mon change type to match their first two moves, and can use any ability, barring the few that are restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">CAAAmomons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Camomons Rule', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Kartana', 'Kyurem-Black', 'Latias-Mega', 'Shedinja', 'Kommonium Z', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 
			'Innards Out', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', 
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Keldeo', 'Regigigas', 'Slaking', 'Terrakion', 'Victini', 'Weavile'
		],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] STABmons Ubers",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">STABmons Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'STABmons Move Legality'],
		banlist: ['Arceus', 'Komala', 'Kangaskhan-Mega'],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] STAAABmons",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, and learn any move of their type, apart from those restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">STAAABmons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'STABmons Move Legality', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Archeops', 'Blacephalon', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Komala', 'Kyurem-Black', 'Regigigas', 'Shedinja',
			'Silvally', 'Slaking', 'Tapu Koko', 'Terrakion', 'Thundurus-Base', 'Thundurus-Therian', 'King\'s Rock', 'Razor Fang', // STABmons
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', // AAA
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows',  // STABmons
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out', // AAA
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] STAB n Mega",
		desc: `Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit, and Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">STAB n Mega Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Standard', 'Gen 7 Mix and Mega Standard Package', 'STABmons Move Legality', 'Mega Rayquaza Clause'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify', // Mix and Mega
			'King\'s Rock', 'Razor Fang', // STABmons
			'Arceus', 'Kangaskhanite', // STAB n Mega
		],
		restricted: [
			'Beedrillite', 'Blazikenite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
			'Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows',
			'Archeops', 'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shuckle', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom', // Mix and Mega
			'Blacephalon', 'Kartana', 'Silvally', 'Tapu Koko', 'Tapu Lele', // STAB n Mega
		],
	},
	{
		section: "US/UM Official OM Mashups (Doubles)",
	},
	{
		name: "[Gen 7] Balanced Hackmons Doubles",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed, in a doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">Balanced Hackmons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587475/">Vanilla Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593766/">Vanilla BH Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Groudon-Primal', 'Arena Trap', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk'],
	},
	{
		name: "[Gen 7] Almost Any Ability Doubles",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in a Doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">Almost Any Ability Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Standard Doubles', 'Swagger Clause', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: [
			'DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles OU
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', // Doubles AAA
		],
		restricted: [
			'Anger Point', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Justified', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Shadow Tag', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	/*{
		name: "[Gen 7] Mix and Mega Doubles",
		desc: `Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit, in a Doubles setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">Mix and Mega Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7mixandmega',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Standard Doubles', 'Swagger Clause', 'Gen 7 Mix and Mega Standard Package', 'Mega Rayquaza Clause'],
		banlist: [
			'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles
			'Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify', // MnM
		],
		restricted: ['Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite',
			'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Jirachi', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Snorlax', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
		onBegin() {
			if (this.rated && this.format.id === 'gen8nationaldex') this.add('html', `<div class="broadcast-red"><strong>National Dex is currently suspecting Genesect! For information on how to participate check out the <a href="https://www.smogon.com/forums/threads/3659573/">suspect thread</a>.</strong></div>`);
		},
	},*/
	{
		name: "[Gen 7] STABmons Doubles",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Doubles setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">STABmons Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Standard Doubles', 'Swagger Clause', 'STABmons Move Legality'],
		banlist: [
			'DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles OU
			'Drizzle', 'Komala', 'Shedinja', 'Silvally', // STABmons Doubles
		],
		restricted: ['Chatter', 'Diamond Storm', 'Geomancy', 'Shell Smash', 'Shift Gear', 'Thousand Arrows'],
	},
	{
		section: "US/UM Official OM Mashups (Little Cup)",
	},
	{
		name: "[Gen 7] Balanced Hackmons LC",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed, in a Little Cup setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802590">Balanced Hackmons LC Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587475/">Vanilla Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593766/">Vanilla BH Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587196/">Vanilla LC Metagame Discussion</a>`,
		],

		mod: 'gen7',
		ruleset: ['-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Little Cup'],
		banlist: [
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', // LC
			'Arena Trap', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Chatter', 'Comatose + Sleep Talk',  // Balanced Hackmons
			'Gligar', 'Scyther', 'Sneasel', 'Type: Null', // Balanced Hackmons LC
		],
	},
	{
		name: "[Gen 7] Almost Any Ability LC",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in a Little Cup setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802590">Almost Any Ability LC Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587196/">Vanilla LC Metagame Discussion</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Standard', 'Swagger Clause', 'Little Cup', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Aipom', 'Cutiefly', 'Gligar', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon',
			'Scyther', 'Sneasel', 'Tangela', 'Yanma',
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', // LC
			'Archen', // Almost Any Ability LC
		],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', // AAA
			'Arena Trap', 'Shadow Tag', // Almost Any Ability LC
		],
	},
	{
		name: "[Gen 7] STABmons LC",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Little Cup environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802590">STABmons LC Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587196/">Vanilla LC Metagame Discussion</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Standard', 'Swagger Clause', 'Little Cup', 'STABmons Move Legality'],
		banlist: [
			'Aipom', 'Cutiefly', 'Drifloon', 'Gligar', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon',
			'Scyther', 'Sneasel', 'Swirlix', 'Tangela', 'Torchic', 'Vulpix-Base', 'Yanma',
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', // LC
			'Shadow Tag', // STABmons LC
		],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] Mix and Mega LC",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Standard', 'Little Cup', 'Gen 7 Mix and Mega Standard Package'],
		banlist: ['Eevium Z', 'Baton Pass', 'Dragon Rage', 'Electrify', 'Sonic Boom'],
		restricted: ['Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
			'Dratini', 'Gligar', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix',
		],
	},
	{
		section: "US/UM Other Mashups",
	},
	{
		name: "[Gen 7] Mix and Mega Tier Shift",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit, and Pokemon get a +10 boost to each stat per tier below OU they are in. UU gets +10, RU +20, NU +30, and PU +40.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3610073/">Vanilla Tier Shift</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Standard', 'Gen 7 Mix and Mega Standard Package', 'Tier Shift Rule', 'Mega Rayquaza Clause'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restricted: [
			'Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
			'Archeops', 'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shuckle', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
	},
	{
		name: "[Gen 7] STAAABmons RU",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, and learn any move of their type, apart from those restricted to their natural users, in an RU environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">OU STAAABmons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646905/">Vanilla RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645873/">Vanilla RU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645338/">Vanilla RU Sample Teams</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] UU', 'STABmons Move Legality', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: [
			'UU', 'RUBL', // RU
			'Aerodactyl', 'Archeops', 'Komala', 'Regigigas', 'Shedinja', 'Silvally', 'Slaking', // AAA
			'King\'s Rock', 'Razor Fang', // STABmons
			'Marowak-Alola', 'Emboar' // STAAABmons RU
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', // STABmons
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out', // AAA
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		unbanlist: [
			'Drought', // RU
			'Drizzle' // AAA
		],
	},
	{
		name: "[Gen 7] Camomons Ubers",
		desc: `Pok&eacute;mon change type to match their first two moves, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Camomons Rule'],
		banlist: ['Shedinja'],
	},
	{
		name: "[Gen 7] CAAAmomons Ubers",
		desc: `Pok&eacute;mon change type to match their first two moves, and can use any ability, barring the few that are restricted to their natural users, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Camomons Rule', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: ['Shedinja', 'Necrozma-Dusk-Mane'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'Arena Trap', 'Shadow Tag', // For Ubers
		],
	},
	{
		name: "[Gen 7] PokeAAAbilities",
		desc: `Pok&eacute;mon have all of their released Abilities simultaneously, and can use any 1 additional ability, barring the few that are restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588652/">Vanilla Pok&eacute;bilities</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Pokebilities Rule', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Bibarel', 'Bidoof', 'Diglett', 'Dugtrio', 'Excadrill', 'Glalie', 'Gothita', 'Gothitelle', 'Gothorita', 'Octillery', 'Porygon-Z', 'Remoraid', 'Smeargle', 'Snorunt', 'Trapinch', 'Wobbuffet', 'Wynaut', // Pokebilities
			 'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Victini', 'Weavile' // AAA
		],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] Camomons Balanced Hackmons",
		desc: `Nearly anything that can be hacked in-game and is usable in local battles is allowed but each Pok&eacute;mon can change type to match their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587475/">Vanilla Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588586/">Vanilla BH Suspects and Bans Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593766/">Vanilla BH Resources</a>`,
		],
		mod: 'gen7',
		ruleset: [ 
			'-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', // BH
			'Camomons Rule', // Camomons
			'Species Clause', // BH Camomons
		],
		banlist: [
			'Arena Trap', 'Contrary', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk',  // BH
			'V-Create', // BH Camomons
		],
	},
	{
		name: "[Gen 7] Tier Shift AAA",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users. Pok&eacute;mon below OU get all their stats boosted. UU/RUBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3610073/">Vanilla Tier Shift</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'AAA Classic Standard Package', '!Obtainable Abilities', 'Tier Shift Rule'],
		banlist: [
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Victini', 'Weavile', // Almost Any Ability
			'Damp Rock', 'Deep Sea Tooth', 'Eviolite', // Tier Shift
			'Thick Club', 'Absol', 'Metagross', // TS AAA
		],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},

	// Expanded Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Expanded Other Metagames",
		column: 2,
	},
	{
		name: "[Gen 8] Category Swap",
		desc: `All damaging moves have the opposite category.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/category-swap.3702709/">Category Swap</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Category Swap Rule', 'Dynamax Clause'],
		banlist: [
			// Pokemon
			'Calyrex-Ice', 'Calyrex-Shadow', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Eternatus', 'Genesect', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base', 'Lugia', 'Lunala', 'Mewtwo',
			'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Xerneas', 'Yveltal',
			'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom',
			// Abilities
			'Power Construct', 'Arena Trap', 'Shadow Tag', 'Moody',
			// Moves
			'Baton Pass', 'Draco Meteor', 'Overheat',
			// Items
			'King\'s Rock',
		],
	},
	{
		name: "[Gen 8] Crazyhouse",
		desc: `You can use Pok&eacute;mon you KO.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3699268/">Crazyhouse</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause', 'Crazyhouse Rule', 'Sleep Moves Clause'],
		banlist: [
			'Uber', 'AG', 'Arena Trap', 'Moody', 'Power Construct', 'Sand Veil', 'Shadow Tag', 'Snow Cloak',
			'Bright Powder', 'King\'s Rock', 'Lax Incense',
			'Baton Pass', 'Explosion', 'Final Gambit', 'Misty Explosion', 'Self-Destruct',
		],
	},
	{
		name: "[Gen 8] Multibility",
		desc: `Pok&eacute;mon may set an additional ability in place of an item. (Use Import in the builder to set the extra ability.)`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/multibility.3688892/">Multibility</a>`,
		],

		mod: 'multibility',
		ruleset: ['Standard', 'Multibility Rule', '2 Multibility Clause', 'Dynamax Clause'],
		banlist: [
			// Pokemon
			'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Dragonite', 'Eternatus',
			'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem-Black', 'Kyurem-White',
			'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Shedinja', 'Solgaleo', 'Spectrier', 'Urshifu-Base', 'Xerneas',
			'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde',
			// Abilities
			'Arena Trap', 'Magnet Pull', 'Moody', 'Power Construct', 'Shadow Tag'
		],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out',
			'Intrepid Sword', 'Libero', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost',
			'Stakeout', 'Water Bubble', 'Wonder Guard'
		],
		validateSet(set, teamHas) {
			const dex = this.dex;
			const itemPseudoAbility = dex.abilities.get(set.item);
			if (!itemPseudoAbility.exists) { // Not even a real ability
				return this.validateSet(set, teamHas);
			}
			const realAbility = dex.abilities.get(set.ability);
			const abilityNames = [...new Set([realAbility.name, itemPseudoAbility.name])];
			// Absolute multibility bans
			const endlessTurnPivots = ['Emergency Exit', 'Wimp Out'];
			const endlessTurnRecovery = ['Regenerator'];
			const setEndlessTurnPivots = abilityNames.filter(value => endlessTurnPivots.includes(value));
			const setEndlessTurnRecovery = abilityNames.filter(value => endlessTurnRecovery.includes(value));
			if (setEndlessTurnPivots.length > 0 && setEndlessTurnRecovery.length > 0) {
				return [
					`${set.name} may not use both ${setEndlessTurnPivots[0]} and ${setEndlessTurnRecovery[0]} simultaneously, because it could lead to an endless turn.`,
				];
			}
			// Contingent multibility bans
			if (this.ruleTable.isBanned(`ability:${itemPseudoAbility.id}`)) {
				return [`${set.name}'s item slot ability ${itemPseudoAbility.name} is banned.`];
			}
			if (this.ruleTable.isRestricted(`ability:${itemPseudoAbility.id}`)) {
				return [`${set.name}'s ${itemPseudoAbility.name} is restricted from being set in the item slot.`];
			}
			if (realAbility.id === itemPseudoAbility.id) {
				return [`${set.name}'s ${realAbility.name} cannot stack from being set in both its ability and item slots simultaneously.`];
			}

			const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
				// @ts-ignore
				require('../sim/team-validator').TeamValidator;

			let customRules = this.format.customRules || [];
			const noItemBanIndex = customRules.indexOf('-noitem');
			if (noItemBanIndex > 0) customRules = customRules.splice(noItemBanIndex, 1);
			const validator = new TeamValidator(dex.formats.get(`${this.format.id}@@@${customRules.join(',')}`));
			const backupItem = set.item;
			set.item = ''; // Remove item ability to pass standard validator
			const problems = validator.validateSet(set, {}) || [];
			set.item = backupItem; // Replace it for onValidateTeam checks
			return problems;
		},
	},
	{
		name: "[Gen 8] Suicide Cup",
		desc: `Victory is obtained when all of your Pok&eacute;mon have fainted.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
		],

		mod: 'gen8',
		ruleset: ['Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause', 'Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Team Preview'],
		banlist: [
			'Shedinja', 'Infiltrator', 'Magic Guard', 'Choice Scarf', 'Leppa Berry', 'Explosion',
			'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Self-Destruct',
		],
	},
	{
		name: "[Gen 8] Suicide Cup: National Dex",
		desc: `Victory is obtained when all of your Pok&eacute;mon have fainted, in a National Dex environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
		],

		mod: 'gen8',
		ruleset: [
			'Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause',
			'Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Team Preview', '+Past', '+Unreleased', 'Standard NatDex'
		],
		banlist: [
			'Shedinja', 'Infiltrator', 'Magic Guard', 'Misty Surge', 'Assault Vest', 'Choice Scarf', 'Leppa Berry', 'Explosion',
			'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Misty Terrain', 'Self-Destruct',
		],
	},
	{
		name: "[Gen 8] Partners in Crime",
		desc: `Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.`,

		mod: 'pic',
		gameType: 'doubles',
		ruleset: ['[Gen 8] Doubles OU', 'Sleep Clause Mod'],
		banlist: [
			'Huge Power', 'Pure Power', 'Wonder Guard', 'Normalize', 'Trace', 'Imposter', 'Transform',
			'Arctovish', 'Arctozolt', 'Dracovish', 'Dracozolt',
		],
		onBeforeSwitchIn(pokemon) {
			for (const side of this.sides) {
				if (side.active.every(ally => ally && !ally.fainted)) {
					let pokeA = side.active[0], pokeB = side.active[1];
					if (pokeA.ability !== pokeB.ability) {
						const pokeAInnate = 'ability:' + pokeB.ability;
						pokeA.volatiles[pokeAInnate] = {id: toID(pokeAInnate), target: pokeA};
						const pokeBInnate = 'ability:' + pokeA.ability;
						pokeB.volatiles[pokeBInnate] = {id: toID(pokeBInnate), target: pokeB};
					}
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability:' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability:' + pokemon.ability;
					delete ally.volatiles[ally.m.innate];
					ally.addVolatile(ally.m.innate);
				}
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		onFaint(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	// Currently in formats.ts
	/*{
		name: "[Gen 8] Pokebilities",
		desc: `Pok&eacute;mon have all of their released abilities simultaneously.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3679692/">Pok&eacute;bilities</a>`,
		],
		searchShow: false,
		ruleset: ['Standard', 'Dynamax Clause', 'Pokebilities Rule'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Conkeldurr', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Dracozolt',
			'Eternatus', 'Excadrill', 'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Base', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings',
			'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Porygon-Z', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Spectrier', 'Urshifu-Base',
			'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Base', 'Zekrom', 'Zygarde-Base', 'Power Construct',
			'Baton Pass', 'King\'s Rock',
			// Moody users
			'Glalie', 'Octillery', 'Remoraid', 'Snorunt',
			// Shadow Tag/Arena Trap
			'Diglett-Base', 'Dugtrio-Base', 'Gothita', 'Gothitelle', 'Gothorita', 'Trapinch', 'Wobbuffet', 'Wynaut',
		],
	},*/
	{
		name: "[Gen 8] 350 Cup",
		desc: "Pok&eacute;mon with a base stat total of 350 or lower get their stats doubled.",
		threads: [
			`&bullet; <a href=\"https://www.smogon.com/forums/threads/350-cup.3656554/\">350 Cup</a>`,
		],
		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause', '350 Cup Rule'],
		banlist: ['Abra', 'Gastly', 'Pawniard', 'Rufflet', 'Woobat', 'Eviolite', 'Light Ball', 'Arena Trap', 'Shadow Tag', 'Baton Pass'],
	},
	{
		name: "[Gen 8] Scalemons",
		desc: `Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 600 as possible.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658482/">Scalemons</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers', 'Scalemons Mod'],
		banlist: [
			'Crawdaunt', 'Darmanitan', 'Darmanitan-Galar', 'Darumaka', 'Darumaka-Galar', 'Gastly',
			'Arena Trap', 'Drizzle', 'Drought', 'Huge Power', 'Moody', 'Rain Dance', 'Sunny Day', 'Eviolite', 'Light Ball',
		],
	},
	{
		name: "[Gen 8] First Blood",
		desc: `The first team to have a Pok&eacute;mon faint loses.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3682954/">First Blood</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Eternatus', 'Genesect', 'Giratina',
			'Giratina-Origin', 'Groudon', 'Heatran', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Landorus-Base',
			'Magearna', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Porygon-Z',
			'Rayquaza', 'Reshiram', 'Solgaleo', 'Spectrier', 'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta',
			'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Base', 'Arena Trap', 'Magnet Pull', 'Moody', 'Power Construct', 'Shadow Tag', 'Eject Button',
			'Baton Pass', 'Swagger',
		],
		onFaint(target) {
			this.lose(target.side);
		},
	},
	{
		name: "[Gen 8] Bonus Type",
		desc: `Pok&eacute;mon can be nicknamed the name of a type to have that type added onto their current ones.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3683173/">Bonus Type</a>`,
		],

		mod: 'gen8',
		ruleset: ['Bonus Type Rule', 'Standard', 'Dynamax Clause', '!Nickname Clause'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Dragapult', 'Dragonite', 'Eternatus', 'Genesect',
			'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base', 'Lugia',
			'Lunala', 'Magearna', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa',
			'Rayquaza', 'Reshiram', 'Shedinja', 'Solgaleo', 'Spectrier', 'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned',
			'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Base', 'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] Chimera 1v1",
		desc: `Bring 6 Pok&eacute;mon and choose their order at Team Preview. The lead Pok&eacute;mon then receives the item, ability, stats, and moves of the other five Pok&eacute;mon, which play no further part in the battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661215/">Chimera 1v1</a>`,
		],

		mod: 'gen8',
		ruleset: ['Chimera 1v1 Rule', 'Standard', 'Dynamax Clause', 'Sleep Moves Clause'],
		banlist: ['Shedinja', 'Huge Power', 'Moody', 'Neutralizing Gas', 'Perish Body', 'Truant', 'Eviolite', 'Focus Sash', 'Perish Song', 'Transform', 'Trick', 'Fishious Rend', 'Bolt Beak', 'Disable', 'Double Iron Bash', 'Switcheroo'],
	},
	{
		name: "[Gen 8] Max Berries",
		desc: `All berries have their effects maximized.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3677136/">Max Berries</a>`,
		],

		mod: 'maxberries',
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Eternatus', 'Genesect', 'Giratina',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base', 'Lugia', 'Lunala', 'Magearna',
			'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza',
			'Reshiram', 'Solgaleo', 'Spectrier', 'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom', 'Zygarde-Base',
			'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'Jaboca Berry', 'Rowap Berry', 'Starf Berry', 'Baton Pass',
			'Block', 'Bug Bite', 'Knock Off', 'Mean Look', 'Pluck', 'Substitute',
		],
	},
	{
		name: "[Gen 8] Alphabet Cup",
		desc: `Allows Pok&eacute;mon to use any move that shares the same first letter as their name or a previous evolution's name.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672756/">Alphabet Cup</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause', 'Alphabet Cup Move Legality'],
		banlist: [
			'Blaziken', 'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Eternatus',
			'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base',
			'Lugia', 'Lunala', 'Magearna', 'Mamoswine', 'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings',
			'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Scolipede', 'Solgaleo', 'Spectrier', 'Urshifu-Base',
			'Weavile', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Base',
			'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'Acupressure', 'Baton Pass',
		],
		restricted: [
			'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Double Iron Bash', 'Electrify', 'Geomancy', 'Glacial Lance',
			'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Sleep Powder', 'Spore', 'Surging Strikes', 'Thousand Arrows',
		],
	},
	// Currently in formats.ts
	/*{
		name: "[Gen 8] Linked",
		desc: `The first two moves in a Pok&eacute;mon's moveset are used simultaneously.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3660421/">Linked</a>`,
		],

		mod: 'linked',
		searchShow: false,
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Cloyster', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Eternatus', 'Genesect', 'Giratina',
			'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base', 'Lugia', 'Lunala',
			'Magearna', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram',
			'Solgaleo', 'Spectrier', 'Urshifu-Base', 'Volcarona', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned',
			'Zekrom', 'Zygarde-Base', 'Zygarde-Complete', 'Arena Trap', 'Chlorophyll', 'Moody', 'Power Construct', 'Sand Rush', 'Sand Veil', 'Shadow Tag',
			'Slush Rush', 'Snow Cloak', 'Speed Boost', 'Surge Surfer', 'Swift Swim', 'Unburden', 'Bright Powder', 'King\'s Rock', 'Lax Incense', 'Baton Pass',
		],
		restricted: [
			'Baneful Bunker', 'Bounce', 'Protect', 'Detect', 'Dig', 'Dive', 'Fly', 'King\'s Shield', 'Nature\'s Madness', 'Night Shade',
			'Obstruct', 'Phantom Force', 'Seismic Toss', 'Shadow Force', 'Sky Drop', 'Spiky Shield', 'Super Fang', 'Trick Room',
		],
		onValidateSet(set) {
			const problems = [];
			for (const [i, moveid] of set.moves.entries()) {
				const move = this.dex.moves.get(moveid);
				if ([0, 1].includes(i) && this.ruleTable.isRestricted(`move:${move.id}`)) {
					problems.push(`${set.name || set.species}'s move ${move.name} cannot be linked.`);
				}
			}
			return problems;
		},
	},*/
	{
		name: "[Gen 8] Flipped",
		desc: `Every Pok&eacute;mon's stats are reversed. HP becomes Spe, Atk becomes Sp. Def, Def becomes Sp. Atk, and vice versa. To see a Pok&eacute;mon's stats outside of battle, type <code>/dt [pokemon], flipped</code>.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3662020/">Flipped</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] OU', 'Flipped Mod'],
		banlist: ['Steelix', 'Psychic Surge', 'Psychic Terrain', 'Shell Smash'],
		unbanlist: ['Darmanitan-Galar'],
	},
	{
		name: "[Gen 8] Sketchmons",
		desc: `Pok&eacute;mon can learn one of any move they don't normally learn, barring the few that are banned.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3680298/">Sketchmons</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause', 'Sketchmons Move Legality'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Dragapult', 'Eternatus', 'Genesect',
			'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base', 'Lugia',
			'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Porygon-Z',
			'Rayquaza', 'Regieleki', 'Reshiram', 'Rillaboom', 'Shedinja', 'Solgaleo', 'Spectrier', 'Swoobat', 'Urshifu-Base', 'Xerneas',
			'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zeraora', 'Zygarde-Base', 'Arena Trap',
			'Moody', 'Power Construct', 'Shadow Tag', 'King\'s Rock', 'Baton Pass',
		],
		restricted: [
			'Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Clangorous Soul', 'Double Iron Bash', 'Electrify', 'Extreme Speed',
			'Fishious Rend', 'Geomancy', 'Glacial Lance', 'Lovely Kiss', 'Octolock', 'Quiver Dance', 'Secret Sword', 'Shell Smash', 'Shift Gear',
			'Sleep Powder', 'Spore', 'Thousand Arrows', 'V-create', 'Wicked Blow',
		],
	},
	// Currently in formats.ts
	/*{
		name: "[Gen 8] Inverse",
		desc: `The type chart is inverted. Normal is super effective against Ghost, and vice versa, etc.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3666858/">Inverse</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause', 'Inverse Mod'],
		banlist: [
			'Arena Trap', 'Baton Pass', 'Calyrex-Ice', 'Calyrex-Shadow', 'Darmanitan-Galar', 'Dialga', 'Diggersby', 'Dracovish', 'Dracozolt',
			'Eternatus', 'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem-Black', 'Kyurem-White',
			'Landorus-Base', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Moody', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Pheromosa', 'Porygon-Z', 'Power Construct', 'Rayquaza', 'Regieleki', 'Reshiram', 'Rillaboom', 'Shadow Tag', 'Solgaleo', 'Spectrier',
			'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta-Base', 'Zekrom',
		],
	},*/
	{
		name: "[Gen 7] Almost Any Ability",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">AAA Resources</a>`,
		],

		mod: 'gen7',
		//searchShow: false,
		ruleset: ['[Gen 7] OU', '2 Ability Clause', 'AAA Restricted Abilities', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Victini', 'Weavile'],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restricted: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] Tier Shift",
		desc: "Pok&eacute;mon below OU get all their stats boosted. UU/RUBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.",
		threads: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3610073/\">Tier Shift</a>",
		],

		mod: 'gen7',
		//searchShow: false,
		ruleset: ['[Gen 7] OU', 'Tier Shift Rule'],
		banlist: ['Drought', 'Damp Rock', 'Deep Sea Tooth', 'Eviolite', 'Heat Rock'],
	},
	// Currently in formats.ts
	/*{
		name: "[Gen 7] STABmons",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/8697545/">USM STABmons</a>`,
		],

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] OU', 'STABmons Move Legality'],
		banlist: ['Aerodactyl', 'Aerodactyl-Mega', 'Araquanid', 'Blacephalon', 'Kartana', 'Komala', 'Kyurem-Black', 'Porygon-Z', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Thundurus', 'Thundurus-Therian', 'King\'s Rock', 'Razor Fang'],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},*/
	{
		name: "[Gen 7] Camomons",
		desc: `Pok&eacute;mon change type to match their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Camomons</a>`,
		],
		mod: 'gen7',
		//searchShow: false,
		ruleset: ['[Gen 7] OU'],
		banlist: ['Dragonite', 'Kartana', 'Kyurem-Black', 'Latias-Mega', 'Shedinja', 'Kommonium Z'],
		onModifySpecies(species, target, source, effect) {
			if (!target) return; // Chat command
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			let types = [...new Set(target.baseMoveSlots.slice(0, 2).map(move => this.dex.moves.get(move.id).type))];
			return Object.assign({}, species, {types: types});
		},
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
	},
	{
		name: "[Gen 7] 350 Cup",
		desc: "Pok&eacute;mon with a base stat total of 350 or lower get their stats doubled. &bullet; <a href=\"https://www.smogon.com/forums/threads/3589641/\">350 Cup</a>",
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', '350 Cup Rule'],
		banlist: ['Deep Sea Tooth', 'Eevium Z', 'Eviolite', 'Light Ball'],
	},
	{
		name: "[Gen 7] Inverse",
		desc: "The effectiveness of each attack is inverted. &bullet; <a href=\"https://www.smogon.com/forums/threads/3590154/\">Inverse</a>",
		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Inverse Mod'],
		banlist: ['Hoopa-Unbound', 'Kyurem-Black', 'Serperior'],
		unbanlist: ['Aegislash', 'Dialga', 'Giratina', 'Pheromosa', 'Solgaleo', 'Lucarionite'],
	},
	{
		name: "[Gen 7] Suicide Cup",
		desc: `Victory is obtained when all of your Pok&eacute;mon have fainted.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
		],

		mod: 'gen7',
		ruleset: ['Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause', 'Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Team Preview'],
		banlist: [
			'Shedinja', 'Infiltrator', 'Magic Guard', 'Misty Surge', 'Assault Vest', 'Choice Scarf', 'Leppa Berry', 'Explosion',
			'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Misty Terrain', 'Self-Destruct',
		],
	},
	{
		name: "[Gen 7] Reversed",
		desc: `Every Pok&eacute;mon has its base Atk and Sp. Atk stat, as well as its base Def and Sp. Def stat, swapped.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623871/">Reversed</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Reversed Rule'],
		banlist: ['Kyurem-Black', 'Tapu Koko'],
		unbanlist: ['Kyurem-White', 'Marshadow', 'Metagross-Mega', 'Naganadel', 'Reshiram'],
	},
	{
		name: "[Gen 7] Gods and Followers",
		desc: `The Pok&eacute;mon in the first slot is the God; the Followers must share a type with the God. If the God Pok&eacute;mon faints, the Followers are inflicted with Embargo.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3589187/">Gods and Followers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: [],
		onValidateTeam(team, format, teamHas) {
			/*console.log("onvt: " + this.formatsCache);
			for( let i=0; i<this.formatsCache.length; i++) {
				console.console.log("i: " + this.formatsCache[i]);
			}*/
			let problemsArray = /** @type {string[]} */ ([]);
			// @ts-ignore
			let types = /** @type {string[]} */ ([]);
			for (const [i, set] of team.entries()) {
				let item = this.dex.items.get(set.item);
				let species = this.dex.species.get(set.species);
				if (!species.exists) return [`The Pok\u00e9mon "${set.name || set.species}" does not exist.`];
				if (i === 0) {
					types = species.types;
					if (species.name.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz') types = ['Psychic'];
					if (item.megaStone && species.name === item.megaEvolves) {
						species = this.dex.species.get(item.megaStone);
						let baseSpecies = this.dex.species.get(item.megaEvolves);
						types = baseSpecies.types.filter(type => species.types.includes(type));
					}
					// 18/10/08 TrashChannel: Since this is already an ubers-based meta,
					// we shouldn't need to check the gods for any additional bans
				} else {
					// 18/10/08 TrashChannel: Avoid using OU validator as it interferes with mashups
					// followerbanlist: ['Uber', 'Arena Trap', 'Power Construct', 'Shadow Tag', 'Baton Pass'],
					if ("Uber" == species.tier) { // Ban ubers
						problemsArray.push("You can't use an Ubers pokemon as a follower!");
					}
					let followerBannedAbilities = ['Arena Trap', 'Power Construct', 'Shadow Tag'];
					let ability = this.dex.abilities.get(set.ability);
					let abilityName = ability.toString();
					for (let nBanAbItr = 0; nBanAbItr < followerBannedAbilities.length; ++nBanAbItr) {
						if (followerBannedAbilities[nBanAbItr] == abilityName) { // Ban OU banned abilities
							problemsArray.push("Follower has the banned ability: " + followerBannedAbilities[nBanAbItr] + "!");
						}
					}
					// Baton Pass is also banned on Ubers, so we move it to general banlist
					let followerTypes = species.types;
					if (item.megaStone && species.name === item.megaEvolves) {
						species = this.dex.species.get(item.megaStone);
						let baseSpecies = this.dex.species.get(item.megaEvolves);
						// @ts-ignore
						if (baseSpecies.types.some(type => types.includes(type)) && species.types.some(type => types.includes(type))) {
							followerTypes = baseSpecies.types.concat(species.types).filter(type => species.types.concat(baseSpecies.types).includes(type));
						}
					}
				}
			}
		},
	},
	// Probably crashes now, needs updates
	/*{
		name: "[Gen 7] Fortemons",
		desc: `Pok&eacute;mon have all of their moves inherit the properties of the move in their item slot.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3638520/">Fortemons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Serene Grace'],
		restricted: ['Bide', 'Chatter', 'Dynamic Punch', 'Fake Out', 'Frustration', 'Inferno', 'Power Trip', 'Power-Up Punch', 'Pursuit', 'Return', 'Stored Power', 'Zap Cannon'],
		validateSet(set, teamHas) {
			const restrictedMoves = this.format.restricted || [];
			let item = set.item;
			let move = this.dex.moves.get(set.item);
			if (!move.exists || move.type === 'Status' || restrictedMoves.includes(move.name) || move.flags['charge'] || move.priority > 0) return this.validateSet(set, teamHas);
			set.item = '';
			let problems = this.validateSet(set, teamHas) || [];
			set.item = item;
			// @ts-ignore
			if (this.format.checkCanLearn.call(this, move, this.dex.species.get(set.species))) problems.push(`${set.species} can't learn ${move.name}.`);
			// @ts-ignore
			if (move.secondaries && move.secondaries.some(secondary => secondary.boosts && secondary.boosts.accuracy < 0)) problems.push(`${set.name || set.species}'s move ${move.name} can't be used as an item.`);
			return problems.length ? problems : null;
		},
		checkCanLearn(move, species, lsetData, set) {
			if (move.id === 'beatup' || move.id === 'fakeout' || move.damageCallback || move.multihit) return {type: 'invalid'};
			return this.checkCanLearn(move, species, lsetData, set);
		},
		onValidateTeam(team, format) {
			let itemTable: {[k: string]: true} = {};
			for (const set of team) {
				let move = this.dex.moves.get(set.item);
				if (!move.exists) continue;
				if (itemTable[move.id]) {
					return ["You are limited to one of each forte by Forte Clause.", "(You have more than one " + move.name + ")"];
				}
				itemTable[move.id] = true;
			}
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				let move = this.getActiveMove(pokemon.set.item);
				if (move.exists && move.category !== 'Status') {
					// @ts-ignore
					pokemon.forte = move;
					pokemon.item = 'ultranecroziumz';
				}
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			// @ts-ignore
			if (move.category !== 'Status' && pokemon && pokemon.forte) {
				let ability = pokemon.getAbility();
				// @ts-ignore
				if (ability.id === 'triage' && pokemon.forte.flags['heal']) return priority + (move.flags['heal'] ? 0 : 3);
				// @ts-ignore
				return priority + pokemon.forte.priority;
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move, pokemon) {
			// @ts-ignore
			if (move.category !== 'Status' && pokemon.forte) {
				// @ts-ignore
				Object.assign(move.flags, pokemon.forte.flags);
				// @ts-ignore
				if (pokemon.forte.self) {
					// @ts-ignore
					if (pokemon.forte.self.onHit && move.self && move.self.onHit) {
						// @ts-ignore
						for (let i in pokemon.forte.self) {
							if (i.startsWith('onHit')) continue;
							// @ts-ignore
							move.self[i] = pokemon.forte.self[i];
						}
					} else {
						// @ts-ignore
						move.self = Object.assign(move.self || {}, pokemon.forte.self);
					}
				}
				// @ts-ignore
				if (pokemon.forte.secondaries) move.secondaries = (move.secondaries || []).concat(pokemon.forte.secondaries);
				// @ts-ignore
				move.critRatio = (move.critRatio - 1) + (pokemon.forte.critRatio - 1) + 1;
				for (let prop of ['basePowerCallback', 'breaksProtect', 'defensiveCategory', 'drain', 'forceSwitch', 'ignoreAbility', 'ignoreDefensive', 'ignoreEvasion', 'ignoreImmunity', 'pseudoWeather', 'recoil', 'selfSwitch', 'sleepUsable', 'stealsBoosts', 'thawsTarget', 'useTargetOffensive', 'volatileStatus', 'willCrit']) {
					// @ts-ignore
					if (pokemon.forte[prop]) {
						// @ts-ignore
						if (typeof pokemon.forte[prop] === 'number') {
							// @ts-ignore
							let num = move[prop] || 0;
							// @ts-ignore
							move[prop] = num + pokemon.forte[prop];
						} else {
							// @ts-ignore
							move[prop] = pokemon.forte[prop];
						}
					}
				}
			}
		},
		// @ts-ignore
		onHitPriority: 1,
		onHit(target, source, move) {
			// @ts-ignore
			if (move && move.category !== 'Status' && source.forte) {
				// @ts-ignore
				if (source.forte.onHit) this.singleEvent('Hit', source.forte, {}, target, source, move);
				// @ts-ignore
				if (source.forte.self && source.forte.self.onHit) this.singleEvent('Hit', source.forte.self, {}, source, source, move);
				// @ts-ignore
				if (source.forte.onAfterHit) this.singleEvent('AfterHit', source.forte, {}, target, source, move);
			}
		},
		// @ts-ignore
		onAfterSubDamagePriority: 1,
		onAfterSubDamage(damage, target, source, move) {
			// @ts-ignore
			if (move && move.category !== 'Status' && source.forte && source.forte.onAfterSubDamage) this.singleEvent('AfterSubDamage', source.forte, null, target, source, move);
		},
		onModifySecondaries(secondaries, target, source, move) {
			if (secondaries.some(s => !!s.self)) move.selfDropped = false;
		},
		// @ts-ignore
		onAfterMoveSecondarySelfPriority: 1,
		onAfterMoveSecondarySelf(source, target, move) {
			// @ts-ignore
			if (move && move.category !== 'Status' && source.forte && source.forte.onAfterMoveSecondarySelf) this.singleEvent('AfterMoveSecondarySelf', source.forte, null, source, target, move);
		},
	},*/
	{
		name: "[Gen 7] Averagemons",
		desc: `Every Pok&eacute;mon, including formes, has base 100 in every stat.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590605/">Averagemons</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Standard', 'Averagemons Rule'],
		banlist: [
			'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Smeargle',
			'Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Deep Sea Tooth', 'Eviolite', 'Light Ball', 'Thick Club', 'Baton Pass', 'Chatter',
		],
	},
	{
		name: "[Gen 7] Chimera",
		desc: `Bring 6 Pok&eacute;mon and choose their order at Team Preview. The lead Pok&eacute;mon then receives the item, ability, stats, and moves of the other five Pok&eacute;mon, who play no further part in the battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3607451/">Chimera</a>`,
		],

		mod: 'gen7',
		ruleset: [
			'Chimera 1v1 Rule', 'Obtainable', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod',
			'Cancel Mod', 'Mega Rayquaza Clause'],
		banlist: [
			'Shedinja', 'Smeargle', 'Huge Power', 'Pure Power', 'Deep Sea Tooth', 'Eviolite', 'Focus Sash', 'Light Ball', 'Lucky Punch',
			'Stick', 'Thick Club', 'Dark Void', 'Grass Whistle', 'Hypnosis', 'Lovely Kiss', 'Perish Song', 'Sing', 'Sleep Powder', 'Spore', 'Transform',
		],
	},
	{
		name: "[Gen 7] Godly Gift",
		desc: `Each Pok&eacute;mon receives one base stat from your God depending on its position in your team.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3597618/">Godly Gift</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Uber > 1', 'Uber ++ Arena Trap', 'Uber ++ Power Construct', 'Blissey', 'Chansey', 'Deoxys-Attack', 'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Sableye-Mega', 'Toxapex', 'Huge Power', 'Pure Power', 'Shadow Tag'],
		onModifySpecies(species, target, source, effect) {
			if (source || !target || !target.side) return;
			let uber = target.side.team.find(set => {
				let item = this.dex.items.get(set.item);
				return set.ability === 'Arena Trap' || set.ability === 'Power Construct' || this.dex.species.get(item.megaEvolves === set.species ? item.megaStone : set.species).tier === 'Uber';
			}) || target.side.team[0];
			let stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)];
			let pokemon = this.dex.deepClone(species);
			// @ts-ignore
			pokemon.baseStats[stat] = this.dex.species.get(uber.species).baseStats[stat];
			return pokemon;
		},
	},
	{
		name: "[Gen 7] Nature Swap",
		desc: `Pok&eacute;mon have their base stats swapped depending on their nature.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3612727/">Nature Swap</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Blissey', 'Chansey', 'Cloyster', 'Hoopa-Unbound', 'Kyurem-Black', 'Stakataka'],
		battle: {
			natureModify(stats, set) {
				let nature = this.dex.natures.get(set.nature);
				let stat;
				if (nature.plus) {
					// @ts-ignore
					stat = nature.plus;
					// @ts-ignore
					stats[stat] = Math.floor(stats[stat] * 1.1);
				}
				return stats;
			},
		},
		onModifySpecies(species, target, source, effect) {
			if (!target) return;
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			let nature = this.dex.natures.get(target.set.nature);
			if (!nature.plus) return species;
			let newStats = Object.assign({}, species.baseStats);
			let swap = newStats[nature.plus];
			// @ts-ignore
			newStats[nature.plus] = newStats[nature.minus];
			// @ts-ignore
			newStats[nature.minus] = swap;
			return Object.assign({}, species, {baseStats: newStats});
		},
	},
	{
		name: "[Gen 7] Follow the Leader",
		desc: `The first Pok&eacute;mon provides the moves and abilities for all other Pok&eacute;mon on the team.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3603860/">Follow the Leader</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Regigigas', 'Shedinja', 'Slaking', 'Smeargle', 'Imposter', 'Huge Power', 'Pure Power'],
		checkCanLearn(move, species, lsetData, set) {
			// @ts-ignore
			return set.follower ? null : this.checkCanLearn(move, species, lsetData, set);
		},
		validateSet(set, teamHas) {
			if (!teamHas.leader) {
				let problems = this.validateSet(set, teamHas);
				teamHas.leader = set.species;
				return problems;
			}
			let leader = this.dex.deepClone(set);
			leader.species = teamHas.leader;
			let problems = this.validateSet(leader, teamHas);
			if (problems) return problems;
			set.ability = this.dex.species.get(set.species || set.name).abilities['0'];
			// @ts-ignore
			set.follower = true;
			problems = this.validateSet(set, teamHas);
			set.ability = leader.ability;
			return problems;
		},
	},
	// Currently in formats.ts
	/*{
		name: "[Gen 7] Mix and Mega",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.`,

		mod: 'gen7mixandmega',
		ruleset: ['Standard', 'Mega Rayquaza Clause', 'Gen 7 Mix and Mega Standard Package'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restricted: [
			'Arceus', 'Deoxys', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem', 'Landorus-Therian', 'Lugia',
			'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma', 'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shuckle',
			'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
			'Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
		],
		unbanlist: ['Deoxys-Defense', 'Kyurem-Base', 'Necrozma-Base'],
	},*/

	// Pet Mods
	///////////////////////////////////////////////////////////////////

	{
		section: "Pet Mods",
		column: 2,
	},
	{
		name: "[Gen 8 MIXT] Mix and Mega",
		desc: `Mega Stones, Primal Orbs and other things can be used on almost any Pok&eacute;mon with no Mega Evolution limit.`,

		mod: 'genmixt',
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Overflow Stat Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'Mega Rayquaza Clause'],
		banlist: [
			'Kyogre', 'Zacian',
			'Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite',
			'Moody', 'Shadow Tag', 'Baton Pass', 'Electrify',
		],
		restricted: [
			'Dialga', 'Eternatus', 'Gengar', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyurem-Black', 'Kyurem-White',
			'Lugia', 'Lunala', 'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Rayquaza', 'Regigigas', 'Reshiram', 'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zekrom', 'Zygarde-Complete',
		],
		onValidateTeam(team) {
			const itemTable = new Set<ID>();
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				if (!item.exists) continue;
				if (itemTable.has(item.id) && (item.megaStone || item.onPrimal)) {
					return [
						`You are limited to one of each Mega Stone and Primal Orb.`,
						`(You have more than one ${item.name}.)`,
					];
				}
				itemTable.add(item.id);
			}
		},
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			const item = this.dex.items.get(set.item);
			if (!item.megaEvolves && !item.onPrimal && item.id !== 'ultranecroziumz') return;
			if (species.baseSpecies === item.megaEvolves || (item.onPrimal && item.itemUser?.includes(species.baseSpecies)) ||
				(species.name.startsWith('Necrozma-') && item.id === 'ultranecroziumz')) {
				return;
			}
			if (this.ruleTable.isRestricted(`item:${item.id}`) || this.ruleTable.isRestrictedSpecies(species) ||
				set.ability === 'Power Construct') {
				return [`${set.species} is not allowed to hold ${item.name}.`];
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			// @ts-ignore
			const oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
				const oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			const oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			}
		},
	},
	/*{
		name: "[Gen 8 Pet Mod] Roulettemons",
		desc: `A metagame made up of brand new Pok&eacute;mon that have randomly generated moves, stats, abilities, and types.`,
		threads: [
			`<a href="https://www.smogon.com/forums/threads/3649106/">Roulettemons</a>`,
		],

		mod: 'roulettemons',
		ruleset: ['Standard NatDex', 'Dynamax Clause', 'Sleep Clause Mod', 'Species Clause', 'Moody Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Baton Pass Clause', 'OHKO Clause'],
		banlist: ['All Pokemon'],
		unbanlist: [
			'Koatric', 'Aquazelle', 'Salamalix', 'Brawnkey', 'Stuneleon', 'Chillyte', 'Eartharoo', 'Crazefly', 'Electritar', 'Aquatopus', 'Scorpita', 'Baloon', 'Kinesel', 'Glacida', 'Pidgeotine', 'Gorilax', 'Albatrygon', 'Chillvark', 'Komodith', 'Giranium', 'Flamyle', 'Voltecta', 'Ostria', 'Ninjoth', 'Herbigator', 'Anteros', 'Gladiaster', 'Hyperoach', 'Barracoth', 'Toados', 'Voltarak', 'Mosqung', 'Flamepion', 'Hyenix', 'Rhinolite', 'Bellena', 'Falcola', 'Beanium', 'Lemotic', 'Biceon', 'Skeleray', 'Specyte', 'Ramron', 'Panthee', 'Blastora', 'Balar', 'Dropacle', 'Fluffora', 'Dolphena', 'Tigire', 'Catelax',
		],
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		},
	},*/
	/*{
		name: "[Gen 7 Pet Mod] Clean Slate: Micro",
		desc: `A brand new "micrometagame" created from scratch, with the ultimate goal of creating a unique, compact metagame different from any other tier.`,
		threads: [
			`<a href="https://www.smogon.com/forums/threads/3652540/">Clean Slate: Micro</a>`,
		],

		mod: 'cleanslatemicro',
		ruleset: ['Standard Pet Mod'],
		unbanlist: [
			'Crobat', 'Dragalge', 'Dugtrio-Alola', 'Farfetch\'d', 'Galvantula', 'Heracross-Base', 'Kyurem-Base', 'Ludicolo',
			'Magearna-Base', 'Malamar', 'Ninetales-Base', 'Pupitar', 'Purugly', 'Rotom-Base', 'Rotom-Heat', 'Rotom-Mow',
			'Rotom-Wash', 'Torterra', 'Type: Null', 'Umbreon', 'Wailord',
		],
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		},
	},*/
	/*{
		name: "[Gen 8] Megamax",
		desc: `A metagame where Gigantamax formes are turned into new Mega Evolutions. To see the new stats of a Megamax forme or to see what new ability does, do <code>/dt [target], megamax</code>.`,
		threads: [
			`<a href="https://www.smogon.com/forums/threads/3658623/">Megamax</a>`,
		],

		mod: 'megamax',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Corviknight-Gmax', 'Melmetal-Gmax', 'Urshifu-Gmax'],
		onChangeSet(set) {
			if (set.species.endsWith('-Gmax')) set.species = set.species.slice(0, -5);
		},
		checkCanLearn(move, species, lsetData, set) {
			if (species.name === 'Pikachu' || species.name === 'Pikachu-Gmax') {
				if (['boltstrike', 'fusionbolt', 'pikapapow', 'zippyzap'].includes(move.id)) {
					return null;
				}
			}
			if (species.name === 'Meowth' || species.name === 'Meowth-Gmax') {
				if (['partingshot', 'skillswap', 'wrap'].includes(move.id)) {
					return null;
				}
			}
			if (species.name === 'Eevee' || species.name === 'Eevee-Gmax') {
				if (['iciclecrash', 'liquidation', 'sappyseed', 'sizzlyslide', 'wildcharge'].includes(move.id)) {
					return null;
				}
			}
			return this.checkCanLearn(move, species, lsetData, set);
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			if (newSpecies.forme.includes('Gmax')) {
				newSpecies.isMega = true;
			}
			return newSpecies;
		},
		onSwitchIn(pokemon) {
			const baseSpecies = this.dex.species.get(pokemon.species.baseSpecies);
			if (baseSpecies.exists && pokemon.species.name !== (pokemon.species.changesFrom || baseSpecies.name)) {
				if (pokemon.species.types.length !== baseSpecies.types.length || pokemon.species.types[1] !== baseSpecies.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onAfterMega(pokemon) {
			const baseSpecies = this.dex.species.get(pokemon.species.baseSpecies);
			if (baseSpecies.exists && pokemon.species.name !== (pokemon.species.changesFrom || baseSpecies.name)) {
				if (pokemon.species.types.length !== baseSpecies.types.length || pokemon.species.types[1] !== baseSpecies.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
	},*/
	/*{
		name: "[Gen 8] Optimons",
		desc: `Every Pok&eacute;mon is optimized to become viable for a balanced metagame. To see the new stats of optimized Pok&eacute;mon, do <code>/dt [pokemon], optimons</code>.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657509/">Optimons</a>`,
		],

		mod: 'optimons',
		searchShow: false,
		ruleset: ['[Gen 8] OU'],
		unbanlist: ['Electabuzz', 'Electivire', 'Elekid', 'Magby', 'Magmar', 'Magmortar', 'Yanma', 'Yanmega'],
		onSwitchIn(pokemon) {
			const baseSpecies = this.dex.mod('gen8').getSpecies(pokemon.species.name);
			if (pokemon.species.types.length !== baseSpecies.types.length || pokemon.species.types[1] !== baseSpecies.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
		},
	},*/

	// OM Theorymon
	///////////////////////////////////////////////////////////////////

	{
		section: "OM Theorymon",
		column: 2,
	},
	{
		name: "[Gen 8] Camomons Triple Typing",
		desc: `(OM Theorymon) Pok&eacute;mon change type to match their first three moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-theorymon-pilot-triple-typing-in-camomons.3675713/">OM Theorymon</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656413/">Vanilla Camomons</a>`,
		],

		mod: 'gen8',
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'Camomons Triple Typing Rule'],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Darmanitan-Galar', 'Dialga', 'Dragonite', 'Eternatus', 'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh',
			'Kartana', 'Kyogre', 'Kyurem', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Rayquaza', 'Reshiram', 'Shedinja', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Base',
			'Arena Trap', 'Moody', 'Power Construct', 'Shadow Tag', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] Camomons Triple Typing: Random Battle",
		desc: `(OM Theorymon) Randomized teams of Pok&eacute;mon change type to match their first three moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-theorymon-pilot-triple-typing-in-camomons.3675713/">OM Theorymon</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656413/">Vanilla Camomons</a>`,
		],

		mod: 'gen8',
		team: 'random',
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Camomons Triple Typing Rule'],
	},

	// TrashChannel Original Programming
	///////////////////////////////////////////////////////////////////

	{
		section: "TrashChannel Original Programming",
		column: 3,
	},
	{
		name: "[Gen 8] Ultimate Mix and Meta",
		onDesc() {
			let descString = `<b>EveryOM is here!</b> <br>Bring together your dream team of Pok&eacute;mon from over 20 different OMs! ` +
			`Nickname a Pok&eacute;mon with an OM format's name or its special nicknames (e.g. type names for Bonus Type) to gain its mechanics. `;

			let ourFormat = Dex.formats.get("[Gen 8] Ultimate Mix and Meta", true);
			if (!ourFormat) return descString;

			if (ourFormat.modValueNumberA) {
				descString += `Meta clause limits you to <b>${ourFormat.modValueNumberA.toString()}</b> set(s) per meta on a single team.`;
			}

			descString += `<details><summary>Playable Meta List</summary>`;
			let isFirstEntry = true;
			for (const mixedMetaKey in MixedMetaCollection) {
				const mixedMeta = MixedMetaCollection[mixedMetaKey];
				const metaFormat = Dex.formats.get(mixedMeta.format, true);
				const metaBanned = 
					(undefined !== mixedMeta.banReason) || // Hard-coded ban
					ourFormat.banlist.includes(metaFormat.name); // Format ban

				if (metaBanned) descString += `<s>`;

				if (isFirstEntry) {
					isFirstEntry = false;
				} else {
					descString += `<br><br>`;
				}
				descString += `<b>${metaFormat.name}</b>`;
				if (metaBanned) {
					descString += `</s>`;
					descString += ` <font color="red">BANNED!!</font>`;
					descString += `<s>`;
				}
				descString += `<br>${metaFormat.desc}`;
				if (!metaBanned) {
					if (metaFormat.threads) {
						descString += `<br>${metaFormat.threads[0]}`;
					}
					descString += `<br>Tier Limit: ${mixedMeta.weightTier}`;
					if (mixedMeta.bstLimit) {
						descString += `<br>BST Limit: ${mixedMeta.bstLimit.toString()}`;
					}
				}

				if (metaBanned) {
					let banReasonText;
					if (mixedMeta.banReason) {
						banReasonText = mixedMeta.banReason;
					} else {
						banReasonText = 'Balance Ban (can be revoked in custom tours/challenges)';
					}
					descString += `</s>`;
					descString += `<br>Ban Reasoning: ${banReasonText}`;
				}
			}
			descString += `</details>`;

			return descString;
		},
		threads: [``,],
		mod: 'mixandmeta',
		ruleset: [
			'Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
			'Overflow Stat Mod', 'Multiple Abilities'
		],
		banlist: [
			'[Gen 8] Pure Hackmons', 'Pure Power'
		],
		modValueNumberA: 1,
		onValidateTeam(team, format) {
			if ('mixandmeta' !== format.mod) {
				return [`Mix and Meta must be the base format!`];
			}

			let perMetaUserCount: {[k: string]: number}  = {};
			for (const set of team) {
				if (!format.determineMeta) continue;
				const setMeta = format.determineMeta.call(this.dex, set);
				if (!setMeta) continue;

				const metaFormatName = MixedMetaCollection[setMeta].format;

				if (!perMetaUserCount.hasOwnProperty(metaFormatName)) {
					perMetaUserCount[metaFormatName] = 0;
				}
				perMetaUserCount[metaFormatName]++;
			}

			let problems: string[] = [];

			// Per-meta set limit
			if (format.modValueNumberA) {
				const perMetaLimit = format.modValueNumberA;
				for (const metaFormatName in perMetaUserCount) {
					if (perMetaUserCount[metaFormatName] > perMetaLimit) {
						problems.push(`This team has too many ${metaFormatName} users (${perMetaUserCount[metaFormatName]}/${perMetaLimit}).`);
					}
				}
			}

			// Special case teamwide validation
			if (perMetaUserCount.hasOwnProperty("[Gen 8] Shared Power")) {
				// Shared Power ability share bans
				const sharedPowerFormat = this.dex.formats.get("[Gen 8] Shared Power", true);

				const abilityPokemonBanDict: {[k: string]: string}  = {};
				for (const ban of sharedPowerFormat.banlist) {
					const banSpecies = this.dex.species.get(ban);
					if (!banSpecies.exists) continue;

					const abilities = Object.values(banSpecies.abilities).filter(a => this.dex.abilities.get(a).gen <= this.gen);
					for (const ability of abilities) {
						abilityPokemonBanDict[ability] = banSpecies.name;
					}
				}
				const pokemonAbilityBans = Object.keys(abilityPokemonBanDict);
				//console.log(sharedPowerFormat.banlist);
				//console.log(pokemonAbilityBans);
				//console.log(abilityPokemonBanDict);
				
				for (const set of team) {
					if (!format.determineMeta) continue;
					const setMeta = format.determineMeta.call(this.dex, set);
					if ('sharedpower' === setMeta) continue; // Shared power user bans will be validated separately

					const setAbility = this.dex.abilities.get(set.ability);
					if (!setAbility.exists) continue;

					// Direct ability bans
					if (sharedPowerFormat.banlist.includes(setAbility.name)) {
						problems.push(`${set.name} (${set.species}) would share the banned Shared Power ability ${setAbility.name}.`);
					}

					// Complex ability bans
					for (const setB of team) {
						const setBAbility = this.dex.abilities.get(setB.ability);
						if (!setBAbility.exists) continue;

						if (sharedPowerFormat.banlist.includes(setAbility.name + ' ++ ' + setBAbility.name) ||
							sharedPowerFormat.banlist.includes(setBAbility.name + ' ++ ' + setAbility.name)) {
							problems.push(`${set.name} (${set.species}) would share part of ` + 
							`the Shared Power complex ability ban ${setAbility.name} ++ ${setBAbility.name}.`);
						}
					}

					// Pokemon ability bans
					if (pokemonAbilityBans.includes(setAbility.name)) {
						problems.push(`${set.name} (${set.species}) would share the indirectly banned Shared Power ability ${setAbility.name} (banned from ${abilityPokemonBanDict[setAbility.name]}).`);
					}
				}
			}

			return problems;
		},
		validateSet(set, teamHas) {
			// Base format validation
			const TeamValidator: typeof import('../sim/team-validator').TeamValidator =
				// @ts-ignore
				require('../sim/team-validator').TeamValidator;

			const dex = this.dex;
			let customRules = this.format.customRules || [];
			let baseFormatCustomRules = customRules;
			baseFormatCustomRules = baseFormatCustomRules.filter(item => // Necessary for AAA, etc mashups
				!['obtainablemoves', 'obtainableabilities', 'obtainableformes', 'obtainablemisc'].includes(toID(item)));
			if (!baseFormatCustomRules.includes('!obtainable')) baseFormatCustomRules.push('!obtainable');
			const baseFormatValidator = new TeamValidator(dex.formats.get(`${this.format.id}@@@${baseFormatCustomRules.join(',')}`));

			let baseFormatProblems = baseFormatValidator.validateSet(set, {}) || [];
			baseFormatProblems = baseFormatProblems.filter(item => // Necessary to prevent illegalizing Trademarked, CrossEvo, etc
				!item.includes('invalid') && !item.includes('must not be nicknamed'));
			if (baseFormatProblems && baseFormatProblems.length > 0) {
				baseFormatProblems = ['Ultimate Mix and Meta base format problems:-'].concat(baseFormatProblems);
				return baseFormatProblems;
			}

			// Meta type validation
			if (!this.format.determineMeta) {
				return [`${this.format.name} lacks a determineMeta method! Mix and Meta must be the base format!`];
			}
			const setMeta = this.format.determineMeta.call(this.dex, set);
			if (!setMeta) {
				return [`${set.name} (${set.species})'s nickname doesn't identify a supported meta!`];
			}

			let tieringProblems: string[] = [];

			const DexCalculator: typeof import('../.trashchannel-dist/dex-calculator').DexCalculator =
				// @ts-ignore
				require('../.trashchannel-dist/dex-calculator').DexCalculator;

			const mixedMeta = MixedMetaCollection[setMeta];
			const metaFormatName = mixedMeta.format;
			const metaFormat = dex.formats.get(metaFormatName, true);

			// Meta bans validation
			if (mixedMeta.banReason) {
				return [`${set.name} (${set.species})'s meta, ${metaFormatName}, has a hard-coded ban. Ban reason: ${mixedMeta.banReason}`];
			}
			if (baseFormatValidator.ruleTable.isBanned(`item:${toID(metaFormatName)}`)) {
				return [`${set.name} (${set.species})'s meta, ${metaFormatName}, is banned for balance reasons (it can be unbanned in custom challenges/tours).`];
			}

			// Tiering system validation 
			let species = dex.species.get(set.species || set.name);
			let item = dex.items.get(set.item);
			if (set.item && item.megaStone && (item.megaEvolves === species.baseSpecies)) {
				species = dex.species.get(item.megaStone);
			}
			const setTierEnum = DexCalculator.calcTierEnumeration(species.tier);
			const metaTierEnum = DexCalculator.calcTierEnumeration(mixedMeta.weightTier);
			if (metaTierEnum > setTierEnum) {
				tieringProblems.push(
					`${set.name} (${set.species}) is in the tier ${species.tier}, ` +
					`but the meta ${metaFormat.name} has a ${mixedMeta.weightTier} tier restriction.`
				);
			}

			let setBst = 0;
			let statName: keyof StatsTable;
			for (statName in species.baseStats) {
				setBst += species.baseStats[statName];
			}

			if (mixedMeta.bstLimit && (setBst > mixedMeta.bstLimit)) {
				tieringProblems.push(
					`${set.name} (${set.species})'s BST exceeds the limit for ${metaFormatName} (${setBst}/${mixedMeta.bstLimit}).`
				);
			}

			if (tieringProblems.length > 0) return tieringProblems;

			// @ts-ignore
			//console.log("validator: " + `${metaFormat.id}@@@${customRules.join(',')}`);

			// Clear unverifiable custom rules (can't use yet)
			/*const metaFormatCustomRules: string[] = [];
			for (const mixedMetaKey in MixedMetaCollection) {
				const mixedMeta = MixedMetaCollection[mixedMetaKey];
				const metaFormat = Dex.formats.get(mixedMeta.format, true);
				metaFormatCustomRules.push(toID(metaFormat.name));
			}
			customRules = customRules.filter(item => 
				!metaFormatCustomRules.includes(toID(item)));

			// @ts-ignore
			console.log("cleaned validator: " + `${metaFormat.id}@@@${customRules.join(',')}`);*/

			// Remove namespace if it exists before using external validator
			const backupSetName = set.name;
			let postNamespaceSetName = null;
			if (set.name.includes(':')) {
				postNamespaceSetName = toID(set.name.split(':')[1]);
			}
			if (postNamespaceSetName) {
				set.name = postNamespaceSetName;
			}

			let metaProblems: string[] = [];
			if (metaFormat.validateSet) {
				// If the format has its own validator, directly call it with its own id to avoid validateSetInternal redirecting here
				const backupFormatId = this.format.id;
				this.format.id = metaFormat.id;
				metaProblems = metaFormat.validateSet.call(this, set, {}) || [];
				this.format.id = backupFormatId;
			} else { // Otherwise use a natural validator for the format
				const validator = new TeamValidator(dex.formats.get(`${metaFormat.id}@@@${customRules.join(',')}`));
				metaProblems = validator.validateSet(set, {}) || [];
			}

			// Return namespace
			if (postNamespaceSetName) {
				set.name = backupSetName;
			}

			if (metaProblems.length) {
				const metaLocator = [`${set.name} (${set.species}) was identified as a ${metaFormatName} user, ` +
				`but it failed that format's validator with the following problems:-`];
				return metaLocator.concat(metaProblems);
			}

			return null;
		},
		determineMeta(set) {
			//console.log("Running determineMeta for: " + set.species || set.name);
			return MxM.determineSetMetaKey(set);
		},
		// Call format custom methods
		onBegin() {
			this.disableAddMessage = true; // Don't show startup messages for meta rules
			const allPokemon = this.getAllPokemon();
			for (const pokemon of allPokemon) {
				const metaFormat = MxM.getMetaFormat(pokemon);
				metaFormat.onBegin?.call(this);

				if (!metaFormat.ruleset) continue;

				for (const rule of metaFormat.ruleset) {
					const ruleFormat = Dex.formats.get(rule) as FormatData;
					if (ruleFormat.onBegin) {
						ruleFormat.onBegin.call(this);
					}
				}
			}
			this.disableAddMessage = false;

			// Clear teamwide effects of OM rules
			for (const pokemon of allPokemon) {
				const metaFormat = MxM.getMetaFormat(pokemon);
				if (metaFormat && metaFormat.ruleset && metaFormat.ruleset.includes('Pokebilities Rule')) continue;

				pokemon.m.pseudoAbilities = undefined;
				pokemon.m.pokebilitiesPseudoAbilities = undefined;
			}

			for (const side of this.sides) {
				// Reverse teamwide effects of Dynamax Clause in sub-formats
				side.dynamaxUsed = false;

				// Only apply it to Pokemon from metas where it is banned
				side.canDynamaxNow = function () {
					if (!this.active) return false;

					const activePokemon = this.active[0];
					if (!activePokemon) return false;

					const metaFormat = MxM.getMetaFormat(activePokemon);
					if (metaFormat.ruleset) {
						if (metaFormat.ruleset.includes('Dynamax Clause') ||
							metaFormat.ruleset.includes('[Gen 8] OU') || // FIXME: Hack to deal with nested formats
							metaFormat.ruleset.includes('[Gen 8] Ubers')) {
							return false;
						}
					}

					return !this.dynamaxUsed;
				};
			}
		},
		onModifySpecies(species, pokemon, source, effect) {
			let pokemonSpecies = this.dex.deepClone(species);
			if (!pokemon) return pokemonSpecies;

			const metaFormat = MxM.getMetaFormat(pokemon);
			if (metaFormat.onModifySpecies) {
				pokemonSpecies = metaFormat.onModifySpecies.call(this, pokemonSpecies, pokemon, source, effect);
			}

			if (!metaFormat.ruleset) return pokemonSpecies;

			for (const rule of metaFormat.ruleset) {
				const ruleFormat = Dex.formats.get(rule) as FormatData;
				if (ruleFormat.onModifySpecies) {
					pokemonSpecies = ruleFormat.onModifySpecies.call(this, pokemonSpecies, pokemon, source, effect);
				}
			}

			return pokemonSpecies;
		},
		onBeforeSwitchIn(pokemon) {
			const metaFormat = MxM.getMetaFormat(pokemon) as FormatData;
			metaFormat.onBeforeSwitchIn?.call(this, pokemon);

			if (!metaFormat.ruleset) return;

			for (const rule of metaFormat.ruleset) {
				const ruleFormat = Dex.formats.get(rule) as FormatData;
				if (ruleFormat.onBeforeSwitchIn) {
					ruleFormat.onBeforeSwitchIn.call(this, pokemon);
				}
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.meta) { // Place volatiles on the Pokémon to show its meta if defined
				this.add('-start', pokemon, toID(pokemon.meta.format), '[silent]');
			}

			const metaFormat = MxM.getMetaFormat(pokemon) as FormatData;
			metaFormat.onSwitchIn?.call(this, pokemon);

			if (!metaFormat.ruleset) return;

			for (const rule of metaFormat.ruleset) {
				const ruleFormat = Dex.formats.get(rule) as FormatData;
				if (ruleFormat.onSwitchIn) {
					ruleFormat.onSwitchIn.call(this, pokemon);
				}
			}
		},
		onSwitchOut(pokemon) {
			const metaFormat = MxM.getMetaFormat(pokemon) as FormatData;
			metaFormat.onSwitchOut?.call(this, pokemon);

			if (!metaFormat.ruleset) return;

			for (const rule of metaFormat.ruleset) {
				const ruleFormat = Dex.formats.get(rule) as FormatData;
				if (ruleFormat.onSwitchOut) {
					ruleFormat.onSwitchOut.call(this, pokemon);
				}
			}
		},
		onAfterMega(pokemon) {
			const metaFormat = MxM.getMetaFormat(pokemon) as FormatData;
			metaFormat.onAfterMega?.call(this, pokemon);

			if (!metaFormat.ruleset) return;

			for (const rule of metaFormat.ruleset) {
				const ruleFormat = Dex.formats.get(rule) as FormatData;
				if (ruleFormat.onAfterMega) {
					ruleFormat.onAfterMega.call(this, pokemon);
				}
			}
		},
		battle: {
			spreadModify(baseStats, set) {
				const metaKey = MxM.determineSetMetaKey(set);
				if ('natureswap' === metaKey) {
					const natureSwapFormat = Dex.formats.get("[Gen 8] Nature Swap") as FormatData;
					return natureSwapFormat.battle!.spreadModify!.call(this, baseStats, set);
				} else { // Copy of default implementation
					const modStats: SparseStatsTable = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
					const tr = this.trunc;
					let statName: keyof StatsTable;
					for (statName in modStats) {
						const stat = baseStats[statName];
						modStats[statName] = tr(tr(2 * stat + set.ivs[statName] + tr(set.evs[statName] / 4)) * set.level / 100 + 5);
					}
					if ('hp' in baseStats) {
						const stat = baseStats['hp'];
						modStats['hp'] = tr(tr(2 * stat + set.ivs['hp'] + tr(set.evs['hp'] / 4) + 100) * set.level / 100 + 10);
					}
					return this.natureModify(modStats as StatsTable, set);
				}
			},
			natureModify(stats, set) {
				const metaKey = MxM.determineSetMetaKey(set);
				if ('natureswap' === metaKey) {
					const natureSwapFormat = Dex.formats.get("[Gen 8] Nature Swap") as FormatData;
					return natureSwapFormat.battle!.natureModify!.call(this, stats, set);
				} else { // Copy of default implementation
					const tr = this.trunc;
					const nature = this.dex.natures.get(set.nature);
					let s: StatIDExceptHP;
					if (nature.plus) {
						s = nature.plus;
						const stat = this.ruleTable.has('overflowstatmod') ? Math.min(stats[s], 595) : stats[s];
						stats[s] = tr(tr(stat * 110, 16) / 100);
					}
					if (nature.minus) {
						s = nature.minus;
						const stat = this.ruleTable.has('overflowstatmod') ? Math.min(stats[s], 728) : stats[s];
						stats[s] = tr(tr(stat * 90, 16) / 100);
					}
					return stats;
				}
			},
		},
		pokemon: {
			getAbility() {
				const trademarkedFormat = Dex.formats.get("[Gen 8] Trademarked") as FormatData;
				return trademarkedFormat.pokemon!.getAbility!.call(this);
			},
		},
	},
	{
		name: "[Gen 8] Bitch and Beggar",
		onDesc() {
			let bstLimitString = this.modValueNumberA ? " (<=" + this.modValueNumberA.toString() + ")" : "";
			return "You've heard of Mix and Mega, what about Bitch and Beggar? Pok&eacute;mon can 'Beggar-Evolve' using low" + bstLimitString + " BST Pok&eacute;mon as Stones.";
		},
		threads: [
			``,
		],

		mod: 'bitchandbeggar',
		ruleset: ['Obtainable', 'Bitch And Beggar Rule', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Overflow Stat Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause'],
		banlist: [
			'Calyrex-Shadow', 'Kyogre', 'Zacian-Crowned',
			'Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite',
			'Moody', 'Shadow Tag', 'Baton Pass', 'Electrify',
		],
		restricted: [
			'Calyrex-Ice', 'Dialga', 'Eternatus', 'Gengar', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyurem-Black', 'Kyurem-White',
			'Lugia', 'Lunala', 'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Rayquaza', 'Regigigas', 'Reshiram', 'Urshifu-Base', 'Xerneas', 'Yveltal', 'Zacian', 'Zekrom', 'Zygarde-Complete',
			'Arena Trap', 'Huge Power', 'Pure Power', 'Water Bubble', 'Wonder Guard',
		],
		modValueNumberA: 300,
		onValidateTeam(team) {
			const itemTable = new Set<ID>();
			for (const set of team) {
				let bitchSpecies = this.dex.species.get(set.item);
				if (!bitchSpecies.exists) continue;
				if (itemTable.has(bitchSpecies.id)) return ["You are limited to one of each Bitch.", "(You have more than one " + bitchSpecies.name + ")"];
				itemTable.add(bitchSpecies.id);
			}
		},
		onValidateSet(set, format) {
			//console.log('BnB: val ');
			//console.log('format.modValueNumberA: '+format.modValueNumberA.toString());

			let beggarSpecies = this.dex.species.get(set.species || set.name);
			let bitchSpecies = this.dex.species.get(set.item);
			//console.log('bitch: '+set.item);
			if(!bitchSpecies.exists) return;

			let problems = [];
			let bitchBST = this.dex.calcBST(bitchSpecies.baseStats);
			//console.log('bitchBST: '+bitchBST.toString());
			if(format.modValueNumberA) {
				if(bitchBST > format.modValueNumberA) {
					problems.push("Bitches are limited to " + format.modValueNumberA.toString() + " BST, but " + bitchSpecies.name + " has " + bitchBST.toString() + "!");
				}
			}
			let uberPokemon = format.restricted || [];
			if (uberPokemon.includes(beggarSpecies.name) || set.ability === 'Power Construct') return ["" + beggarSpecies.name + " is not allowed to hold " + bitchSpecies.name + "."];
			
			// Load BnB mod functions
			// @ts-ignore
			//import {Scripts as BnBMod} from '../.data-dist/mods/bitchandbeggar/scripts';
			const BnBMod: ModdedBattleScriptsData =
				// @ts-ignore
				require('../.data-dist/mods/bitchandbeggar/scripts').Scripts;

			// @ts-ignore
			const mixedSpecies = BnBMod.actions?.getMixedSpecies(beggarSpecies.name, bitchSpecies.baseSpecies);
			let oAbilitySlot = this.dex.calcActiveAbilitySlot(beggarSpecies, set.ability);
			//console.log("oAbilitySlot: " + oAbilitySlot);
			// @ts-ignore
			let postBeggarAbilityName = mixedSpecies.abilities[oAbilitySlot];
			let postBeggarAbilityId = toID(postBeggarAbilityName);
			//console.log("postBeggarAbilityId: " + postBeggarAbilityId);
			let abilityBanTest = '-ability:'+postBeggarAbilityId;
			//console.log("abilityBanTest: " + abilityBanTest);
			let abilityRestrictedTest = '*ability:'+postBeggarAbilityId;
			this.ruleTable.forEach((v, rule) => {
				//console.log("BnB rule: " + rule);
				if( rule === abilityBanTest ) {
					//console.log("BnB rule IN ");
					problems.push("If "+set.name+" beggar-evolved with the ability "+ set.ability + ", it would gain the banned ability "
						+ postBeggarAbilityName + " from its bitch "+ bitchSpecies.name + ".");
				}
				else if( rule === abilityRestrictedTest ) {
					//console.log("BnB restriction IN ");
					problems.push("If "+set.name+" beggar-evolved with the ability "+ set.ability + ", it would gain the restricted ability "
						+ postBeggarAbilityName + " from its bitch "+ bitchSpecies.name + ".");
				}
			});
			return problems;
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			// Take care of non-BnB case
			let bitchSpecies = this.dex.species.get(pokemon.item);
			if(!bitchSpecies.exists) return;
			if (null === pokemon.canMegaEvo) {
				// Place volatiles on the Pokémon to show its beggar-evolved condition and details
				let bitchSpecies = pokemon.item;
				this.add('-start', pokemon, this.dex.generateMegaStoneName(bitchSpecies), '[silent]');
				let oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				this.add('-end', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 8] Bitch and Beggar: Hackmons Cup",
		desc: `You've heard of Mix and Mega, what about Bitch and Beggar? Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, move, and bitch.`,
		threads: [
			``,
		],
		mod: 'bitchandbeggar',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Bitch And Beggar Rule'],
		team: 'randomHCBnB',
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			// Take care of non-BnB case
			let bitchSpecies = this.dex.species.get(pokemon.item);
			if(!bitchSpecies.exists) return;
			if (null === pokemon.canMegaEvo) {
				// Place volatiles on the Pokémon to show its beggar-evolved condition and details
				let bitchSpecies = pokemon.item;
				this.add('-start', pokemon, this.dex.generateMegaStoneName(bitchSpecies), '[silent]');
				let oSpecies = this.dex.species.get(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaSpecies = this.dex.species.get(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				this.add('-end', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 8] Live and Learn",
		desc: `Pok&eacute;mon can learn each other's moves and abilities when they are activated.`,
		threads: [
			`&bullet; <a href="https://www.youtube.com/watch?v=z1BRZg0GG0A">OST</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Darmanitan-Galar', 'Eternatus', 'Kyurem-Black', 'Kyurem-White', 'Lunala', 'Marshadow', 'Melmetal',
			'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Reshiram', 'Shedinja', 'Solgaleo', 'Toxapex',
			'Zacian', 'Zamazenta', 'Zekrom', 'Leppa Berry', 'Baton Pass',
			'Arena Trap', 'Gorilla Tactics', 'Imposter', 'Mirror Armor', 'Moody', 'Neutralizing Gas', 'Shadow Tag',
			'Trace',
		],
		// @ts-ignore
		runTeachableMoment(battle: Battle, effectName: string, checkAbility?: boolean, checkMove?: boolean) {
			// @ts-ignore
			if (this.format && this.format.banlist && this.format.banlist.includes(effectName)) return;

			const effectID = toID(effectName);
			const effectAsAbility = checkAbility ? battle.dex.abilities.get(effectID) : null;
			const effectAsMove = checkMove ? battle.dex.moves.get(effectID) : null;

			for (const side of battle.sides) {
				if (!side) continue;
				if (side.active.every(ally => ally && !ally.fainted)) {
					for (const activePokemon of side.active) {
						if (!activePokemon) continue;

						// Ability case
						if (checkAbility && effectAsAbility && effectAsAbility.exists) {
							const lAbilities = activePokemon.m.learnedAbilities;
							if (!lAbilities) continue;
							if (lAbilities.has(effectID)) continue;
							lAbilities.add(effectID);
							const effect = 'ability:' + effectID;
							battle.add('message', activePokemon.name+' noticed and learned the ability '+effectAsAbility.name+'!');
							// Non-immediate additions (depending on timing may be called twice, etc)
							if (['intimidate', 'download', 'intrepidsword', 'dauntlessshield'].includes(effectID)) continue;
							activePokemon.addVolatile(effect);
							//console.log('adding volatile: ' + effectID);
						}

						// Move case
						if (checkMove && effectAsMove && effectAsMove.exists) {
							const lMoves = activePokemon.m.learnedMoves;
							if (!lMoves) continue;
							if (lMoves.has(effectID)) continue;
							if (lMoves.length >= 24) {
								battle.add('message', activePokemon.name+' has run out of moveslots and cannot learn the move '+effectName+'!');
								continue;
							}
							lMoves.add(effectID);
							activePokemon.moveSlots.push({
								move: effectAsMove.name,
								id: effectAsMove.id,
								pp: ((effectAsMove.noPPBoosts || effectAsMove.isZ) ? effectAsMove.pp : effectAsMove.pp * 8 / 5),
								maxpp: ((effectAsMove.noPPBoosts || effectAsMove.isZ) ? effectAsMove.pp : effectAsMove.pp * 8 / 5),
								target: effectAsMove.target,
								disabled: false,
								disabledSource: '',
								used: false,
							});
							battle.add('message', activePokemon.name+' noticed and learned the move '+effectAsMove.name+'!');
						}
					}
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.learnedAbilities = new Set<string>();
				pokemon.m.learnedAbilities.add(pokemon.baseAbility);
				//console.log('adding base ability: ' + pokemon.baseAbility);

				pokemon.m.learnedMoves = new Set<string>();
				for (const move of pokemon.baseMoves) {
					if (!move) continue;
					pokemon.m.learnedMoves.add(move);
					//console.log('adding base move: ' + move);
				}
			}
		},
		onBeforeSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				//console.log('adding extra ability: ' + ability);
				const effect = 'ability:' + ability;
				pokemon.volatiles[effect] = {id: toID(effect), target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				const effect = 'ability:' + ability;
				//console.log('adding extra ability: ' + ability);
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
		onAfterMove(pokemon, target, move) {
			if (!move) return;
			//console.log('onAfterMove: ' + move);
			let format = this.format;
			// @ts-ignore
			if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');
			// @ts-ignore
			format.runTeachableMoment!(this, move.name, false, true);
			if(move.hasBounced) {
				// @ts-ignore
				format.runTeachableMoment!(this, 'Magic Bounce', true, false);
			}
		},
		battle: {
			doOnShowAbility(abilityName: string)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, abilityName, true, false);
			},
			/*doOnRunSingleEvent(
				eventid: string, effect: Effect, effectData: AnyObject | null,
				target: string | Pokemon | Side | Field | Battle | null, source?: string | Pokemon | Effect | false | null,
				sourceEffect?: Effect | string | null, relayVar?: any
			)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');

				if (effect) {
					if ( ('Ability' !== effect.effectType) &&
						('Move' !== effect.effectType) ) {
						return;
					}
					// @ts-ignore
					format.runTeachableMoment!(this, effect.id, true, false);
				}

				if (!sourceEffect) return;
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},
			doOnRunEvent(eventid: string, target?: Pokemon | Pokemon[] | Side | Battle | null, source?: string | Pokemon | false | null,
				sourceEffect?: Effect | null, relayVar?: any, onEffect?: boolean, fastExit?: boolean)
			{
				//if (eventid) console.log('eventid: ' + eventid);
				if ( ('Ability' !== eventid) &&
					('Move' !== eventid) ) {
					return;
				}

				if (!sourceEffect) return;
				//console.log('sourceEffect.name: ' + sourceEffect.name);

				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},*/
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
		pokemon: {
			hasAbility(ability) {
				if (this.ignoringAbility()) return false;
				if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
				const abilityid = toID(ability);
				return this.ability === abilityid || !!this.volatiles['ability:' + abilityid];
			},
		},
	},
	{
		name: "[Gen 8] Live and Learn: Random Battle",
		desc: `Pok&eacute;mon can learn each other's moves and abilities when they are activated.`,
		threads: [
			`&bullet; <a href="https://www.youtube.com/watch?v=z1BRZg0GG0A">OST</a>`,
		],

		mod: 'liveandlearn',
		team: 'randomLaL',
		ruleset: ['Standard', 'Dynamax Clause'],
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.learnedAbilities = new Set<string>();
				pokemon.m.learnedAbilities.add(pokemon.baseAbility);
				//console.log('adding base ability: ' + pokemon.baseAbility);

				pokemon.m.learnedMoves = new Set<string>();
				for (const move of pokemon.baseMoves) {
					if (!move) continue;
					pokemon.m.learnedMoves.add(move);
					//console.log('adding base move: ' + move);
				}
			}
		},
		onBeforeSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				//console.log('adding extra ability: ' + ability);
				const effect = 'ability:' + ability;
				pokemon.volatiles[effect] = {id: toID(effect), target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				const effect = 'ability:' + ability;
				//console.log('adding extra ability: ' + ability);
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
		onAfterMove(pokemon, target, move) {
			if (!move) return;
			//console.log('onAfterMove: ' + move);
			let format = this.format;
			// @ts-ignore
			if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');
			// @ts-ignore
			format.runTeachableMoment!(this, move.name, false, true);
			if(move.hasBounced) {
				// @ts-ignore
				format.runTeachableMoment!(this, 'Magic Bounce', true, false);
			}
		},
		battle: {
			doOnShowAbility(abilityName: string)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, abilityName, true, false);
			},
			/*doOnRunSingleEvent(
				eventid: string, effect: Effect, effectData: AnyObject | null,
				target: string | Pokemon | Side | Field | Battle | null, source?: string | Pokemon | Effect | false | null,
				sourceEffect?: Effect | string | null, relayVar?: any
			)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');

				if (effect) {
					if ( ('Ability' !== effect.effectType) &&
						('Move' !== effect.effectType) ) {
						return;
					}
					// @ts-ignore
					format.runTeachableMoment!(this, effect.id, true, false);
				}

				if (!sourceEffect) return;
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},
			doOnRunEvent(eventid: string, target?: Pokemon | Pokemon[] | Side | Battle | null, source?: string | Pokemon | false | null,
				sourceEffect?: Effect | null, relayVar?: any, onEffect?: boolean, fastExit?: boolean)
			{
				//if (eventid) console.log('eventid: ' + eventid);
				if ( ('Ability' !== eventid) &&
					('Move' !== eventid) ) {
					return;
				}

				if (!sourceEffect) return;
				//console.log('sourceEffect.name: ' + sourceEffect.name);

				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.formats.get('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},*/
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
		pokemon: {
			hasAbility(ability) {
				if (this.ignoringAbility()) return false;
				if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
				const abilityid = toID(ability);
				return this.ability === abilityid || !!this.volatiles['ability:' + abilityid];
			},
		},
	},
	{
		name: "[Gen 7] The Call of Pikacthulhu",
		desc: `Pok&eacute;mon have Perish status applied when entering battle.`,
		threads: [
			``,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onSwitchIn(pokemon) {
			// @ts-ignore
			pokemon.addVolatile('perishsong', pokemon);
		},
	},

	// Mirror Universe Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "Mirror Universe Mashups",
		column: 3,
	},
	{
		name: "[Gen 7] CRABmons",
		desc: `Pok&eacute;mon change type to match any two moves they could learn naturally, and can use any move of their new typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'CRABmons Move Legality', 'Camomons Rule'],
		banlist: [
			'Aerodactyl', 'Araquanid', 'Blacephalon', 'Kartana', 'Komala', 'Kyurem-Black', 'Porygon-Z', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Thundurus-Base', 'King\'s Rock', 'Razor Fang', // STABmons
			'Dragonite', 'Latias-Mega', 'Shedinja', 'Kommonium Z', // Camomons
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', // STABmons
			'V-create', // CRABmons
		],
	},
	{
		name: "[Gen 7] CRAAABmons RU",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, can change type to match any two moves they could learn naturally, and can use any move of their new typing, in addition to the moves they can normally learn, in an RU environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646905/">Vanilla RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645873/">Vanilla RU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645338/">Vanilla RU Sample Teams</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] UU', 'CRABmons Move Legality', 'Camomons Rule', 'AAA Classic Standard Package', '!Obtainable Abilities'],
		banlist: [
			'UU', 'RUBL', // RU
			'Archeops', 'Komala', 'Regigigas', 'Silvally', 'Slaking', // AAA
			'Aerodactyl', 'Araquanid', 'Blacephalon', 'Kartana', 'Kyurem-Black', 'Porygon-Z', 'Tapu Koko', 'Tapu Lele', 'Thundurus-Base', 'King\'s Rock', 'Razor Fang', // STABmons
			'Dragonite', 'Latias-Mega', 'Shedinja', // Camomons
			'Marowak-Alola', 'Emboar' // STAAABmons RU
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', // STABmons
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out', // AAA
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'V-create', // CRABmons
		],
		unbanlist: [
			'Drought', // RU
			'Drizzle' // AAA
		],
	},
];
