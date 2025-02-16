import RandomTeams from '../gen9/teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';

export class RandomOMBattleFactoryTeams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.factoryTier = this.sample(['Almost Any Ability', 'Balanced Hackmons', 'Godly Gift', 'Mix and Mega', 'Partners in Crime', 'STABmons']);
	}
}

export default RandomOMBattleFactoryTeams;
