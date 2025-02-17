import {RandomTeams, TeamData} from '../gen9/teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';

interface OMBattleFactorySet {
	species: string;
	weight: number;
	item: string[];
	ability: string[];
	nature: string[];
	moves: string[][];
	teraType: string[];
	gender?: string;
	wantsTera?: boolean;
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
	shiny?: boolean;
	improofs?: string[]; // BH
	inheritedFrom?: string; // Inh
	slot?: string[]; // GG
	isGod?: boolean; // GG
}

interface OMBattleFactorySpecies {
	sets: OMBattleFactorySet[];
	weight: number;
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

export class RandomOMBattleFactoryTeams extends RandomTeams {
	randomOMFactorySets: {[format: string]: {[species: string]: OMBattleFactorySpecies}} = require('./factory-sets.json');

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.factoryTier = this.sample(Object.keys(OM_TIERS));
	}
}

export default RandomOMBattleFactoryTeams;
