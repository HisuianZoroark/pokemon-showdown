import {FS} from '../../../lib';
import {toID} from '../../../sim/dex-data';

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;

	const cells = row.split(',');
	if (cells.length > 3) throw new Error(`Invalid entry when parsing usergroups.csv`);
	usergroups[toID(cells[0])] = cells[1].trim() || ' ';
}

export function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');

	const group = usergroups[userid] || ' ';
	return group + name;
}

export const Conditions: {[k: string]: ModdedConditionData & {innateName?: string}} = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Username')}|Switch In Message`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Username')}|Switch Out Message`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Username')}|Faint Message`);
		},
		// Innate effects go here
	},
	IMPORTANT: Obtain the username from getName
	*/
	abr: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('ABR')}|This will be a breeze`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('ABR')}|Your time will come`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('ABR')}|East > West`);
		},
	},
	bushtush: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Bushtush')}|YO RUN THOSE POCKETS`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Bushtush')}|Ill be back for my money`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Bushtush')}|Oh man Oh man not again`);
		},
	},
	bkc: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('BKC')}|my last game of pokemon ever`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('BKC')}|that was ACTUALLY my last game of pokemon ever`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('BKC')}|2010 o how i yearn for thou`);
		},
	},
	earthworm: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Earthworm')}|land ahoy!`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Earthworm')}|set sail!`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Earthworm')}|parlay!`);
		},
	},
	empo: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Empo')}|sorry I'm in a hurry.`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Empo')}|Grovyle uses luminous orb`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Empo')}|Grovyle was revived! ...thought it was the right one... looking closer this is... not a Reviver Seed but a Reviser Seed!`);
		},
	},
	finchinator: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Finchinator')}|FINCHTOUR`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Finchinator')}|FINCHTOUR`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Finchinator')}|FINCHTOUR`);
		},
	},
	heroictroller: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Heroic Troller')}|Ratio`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Heroic Troller')}|Not yet`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Heroic Troller')}|I see`);
		},
	},
	lax: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('lax')}|@Astamatitos and I would love to manage a team together`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('lax')}|We will be subbing ima out for blarghfarghl @FlamingVictini`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('lax')}|ya ok dogshit game`);
		},
	},
	mcmeghan: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('McMeghan')}|wassup`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('McMeghan')}|gone`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('McMeghan')}|Dreamcatcher`);
		},
	},
	instructuser: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Instruct')}|woo yeah dragalge`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Instruct')}|man, i love dragalge`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Instruct')}|NOOOOO DRAGALGE`);
		},
	},
	punny: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Punny')}|God clef`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Punny')}|:c`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Punny')}|Gasp..`);
		},
	},
	tj: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('TJ')}|Plus 6, knock 'em out, even if they Sassy`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('TJ')}|B-B-B-B-B-Beatdown and I'm out`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('TJ')}|pop smoke`);
		},
	},
	welli0u: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Welli0u')}|ACKNOWLEDGE MEEEE`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Welli0u')}|My swag is off the charts.`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Welli0u')}|I SAID I WOULD DO IT AND I DID`);
		},
	},
	z0mog: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('z0mOG')}|ima just nap`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('z0mOG')}|zzzz mimimimimi zzzz`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('z0mOG')}|https://youtube.com/z0mmm shameless plug`);
		},
	},
	// Custom Move effects start Here
	// Hot Pursuit switch cancelling
	preventswitch: {
		noCopy: true,
		duration: 1,
		onSwitchOut() {
			this.hint('Hot Pursuit prevented the switch from going through.');
			return false;
		},
		onUpdate(pokemon) {
			if (pokemon.switchFlag) {
				pokemon.switchFlag = false;
				this.hint('Hot Pursuit prevented the switch from going through.');
			}
			if (pokemon.forceSwitchFlag) {
				pokemon.forceSwitchFlag = false;
				this.hint('Hot Pursuit prevented the switch from going through.');
			}
		},
	},
};
