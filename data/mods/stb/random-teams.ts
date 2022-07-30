import RandomTeams from '../../random-teams';

export interface STBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName;
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
}
interface STBSets {[k: string]: STBSet}

export const stbSets: STBSets = {
	/*
	// Example:
	Username: {
		species: 'Species', ability: 'Ability', item: 'Item', gender: '',
		moves: ['Move Name', ['Move Name', 'Move Name']],
		signatureMove: 'Move Name',
		evs: {stat: number}, ivs: {stat: number}, nature: 'Nature', level: 100, shiny: false,
	},
	// Species, ability, and item need to be captialized properly ex: Ludicolo, Swift Swim, Life Orb
	// Gender can be M, F, N, or left as an empty string
	// each slot in moves needs to be a string (the move name, captialized properly ex: Hydro Pump), or an array of strings (also move names)
	// signatureMove also needs to be capitalized properly ex: Scripting
	// You can skip Evs (defaults to 82 all) and/or Ivs (defaults to 31 all), or just skip part of the Evs (skipped evs are 0) and/or Ivs (skipped Ivs are 31)
	// You can also skip shiny, defaults to false. Level can be skipped (defaults to 100).
	// Nature needs to be a valid nature with the first letter capitalized ex: Modest
	*/
	// Please keep sets organized alphabetically based on staff member name!
	ABR: {
		species: 'Gastrodon-East', ability: 'Water Bubble', item: 'Rocky Helmet', gender: 'M',
		moves: ['Calm Mind', 'Scorching Sands', 'Recover'],
		signatureMove: 'Burning Rain',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold',
	},
	BKC: {
		species: 'Blaziken', ability: 'Anger Point', item: 'Focus Sash', gender: 'M',
		moves: ['Blaze Kick', 'Close Combat', 'Outrage'],
		signatureMove: 'Angry Rant',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
	},
	Bushtush: {
		species: 'Electivire', ability: 'Intrepid Sword', item: 'Leftovers', gender: 'M',
		moves: ['Dragon Dance', 'Close Combat', 'Icicle Crash'],
		signatureMove: 'Thunderwave Fists',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly', shiny: true,
	},
	Earthworm: {
		species: 'Heatran', ability: 'Flash Fire', item: 'Leftovers', gender: 'M',
		moves: ['Magma Storm', 'Earth Power', 'Taunt'],
		signatureMove: 'Hot Pursuit',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
	Empo: {
		species: 'Grovyle', ability: 'Time Tripper', item: 'Eviolite', gender: 'M',
		moves: ['Swords Dance', 'Leaf Blade', 'Close Combat'],
		signatureMove: 'Time Stopper',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
	},
	Finchinator: {
		species: 'Garchomp', ability: 'Skill Link', item: 'Life Orb', gender: '',
		moves: ['Swords Dance', 'Scale Shot', 'Aqua Tail'],
		signatureMove: 'Aftermaths',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	'Heroic Troller': {
		species: 'Dusknoir', ability: 'Timeline Reversal', item: 'Choice Band', gender: 'M',
		moves: ['Shadow Sneak', 'Close Combat', 'Glacial Lance'],
		signatureMove: 'Shadow End',
		evs: {hp: 248, atk: 252, spd: 8}, nature: 'Adamant',
	},
	Instruct: {
		species: 'Dragalge', ability: 'Regenerator', item: 'Assault Vest', gender: 'M',
		moves: ['Core Enforcer', 'Clear Smog', 'Rapid Spin'],
		signatureMove: 'Nori Neurotoxin',
		evs: {hp: 252, def: 4, spd: 252}, ivs: {spe: 0}, nature: 'Sassy',
	},
	lax: {
		species: 'Munchlax', ability: 'Protean', item: 'Eviolite', gender: 'M',
		moves: ['Mega Kick', 'Fishious Rend', 'Precipice Blades'],
		signatureMove: 'Whine and Dine',
		evs: {hp: 128, atk: 128, spe: 252}, nature: 'Jolly',
	},
	McMeghan: {
		species: 'Zapdos', ability: 'Iron Barbs', item: 'Heavy-Duty Boots', gender: 'N',
		moves: ['Discharge', 'Roost', 'Heat Wave'],
		signatureMove: 'Flycare',
		evs: {hp: 248, def: 220, spe: 40}, nature: 'Timid',
	},
	Punny: {
		species: 'Clefable', ability: 'Magic Guard', item: 'Leftovers', gender: 'M',
		moves: ['Soft Boiled', 'Calm Mind', 'Lava Plume'],
		signatureMove: 'Fairy Power',
		evs: {hp: 252, def: 252, spe: 4}, nature: 'Bold',
	},
	TJ: {
		species: 'Throh', ability: 'Huge Power', item: 'Choice Band', gender: 'M',
		moves: ['U-turn', 'Ice Punch', 'Earthquake'],
		signatureMove: 'Ninja Punch',
		evs: {hp: 252, spd: 4, spe: 252}, nature: 'Adamant',
	},
	Welli0u: {
		species: 'Kommo-o', ability: 'Technician', item: 'Leftovers', gender: '',
		moves: ['Swords Dance', 'Scale Shot', 'Poison Jab'],
		signatureMove: 'SuperManPunch',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Adamant',
	},
	z0mOG: {
		species: 'Obstagoon', ability: 'Comatose', item: 'Choice Band', gender: 'M',
		moves: ['Sleep Talk'],
		signatureMove: 'Sleep Walk',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
	},
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = ruleTable.has('sametypeclause') ? this.sample([...this.dex.types.names()]) : false;
		let pool = debug.length ? debug : Object.keys(stbSets);
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(stbSets[x].species).types.includes(monotype));
		}
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Staff Bros team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const stbSet: STBSet = this.dex.deepClone(stbSets[name]);
			if (stbSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored when debugging or for monotype variations.
				const species = this.dex.species.get(stbSet.species);
				if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

				const weaknesses = [];
				for (const type of this.dex.types.names()) {
					const typeMod = this.dex.getEffectiveness(type, species.types);
					if (typeMod > 0) weaknesses.push(type);
				}
				let rejected = false;
				for (const type of weaknesses) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 3) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (stbSet.ability === 'Wonder Guard') {
					if (!typePool['wonderguard']) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of weaknesses) {
					typePool[type]++;
				}
			}

			const set: PokemonSet = {
				name: name,
				species: stbSet.species,
				item: Array.isArray(stbSet.item) ? this.sampleNoReplace(stbSet.item) : stbSet.item,
				ability: Array.isArray(stbSet.ability) ? this.sampleNoReplace(stbSet.ability) : stbSet.ability,
				moves: [],
				nature: stbSet.nature ? Array.isArray(stbSet.nature) ? this.sampleNoReplace(stbSet.nature) : stbSet.nature : 'Serious',
				gender: stbSet.gender || this.sample(['M', 'F', 'N']),
				evs: stbSet.evs ? {...{hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ...stbSet.evs} :
				{hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
				ivs: {...{hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ...stbSet.ivs},
				level: this.adjustLevel || stbSet.level || 100,
				happiness: typeof stbSet.happiness === 'number' ? stbSet.happiness : 255,
				shiny: typeof stbSet.shiny === 'number' ? this.randomChance(1, stbSet.shiny) : !!stbSet.shiny,
			};
			while (set.moves.length < 3 && stbSet.moves.length > 0) {
				let move = this.sampleNoReplace(stbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(stbSet.signatureMove);

			// Any set specific tweaks occur here.

			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === this.maxTeamSize && set.ability === 'Illusion') {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomStaffBrosTeams;
