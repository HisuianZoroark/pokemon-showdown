import RandomTeams from '../gen9/teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';

export class RandomOMBattleFactoryTeams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		// eslint-disable-next-line max-len
		this.factoryTier = this.sample(['Almost Any Ability', 'Balanced Hackmons', 'Godly Gift', 'Inheritance', 'Mix and Mega', 'Partners in Crime', 'STABmons']);
	}
}

export default RandomOMBattleFactoryTeams;
