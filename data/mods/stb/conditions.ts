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
};
