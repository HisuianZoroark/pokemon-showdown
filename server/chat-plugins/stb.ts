import {FS, Utils} from '../../lib';
import {STBSet, stbSets} from '../../data/mods/stb/random-teams';
const GEN_NAMES: {[k: string]: string} = {
	gen1: '[Gen 1]', gen2: '[Gen 2]', gen3: '[Gen 3]', gen4: '[Gen 4]', gen5: '[Gen 5]', gen6: '[Gen 6]', gen7: '[Gen 7]',
};

const STAT_NAMES: {[k: string]: string} = {
	hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe",
};

const TIERS: {[k: string]: string} = {
	uber: "Uber", ubers: "Uber",
	ou: "OU", uu: "UU", ru: "RU", nu: "NU", pu: "PU",
	mono: "Mono", monotype: "Mono", lc: "LC", littlecup: "LC",
};

function formatAbility(ability: Ability | string) {
	ability = Dex.abilities.get(ability);
	return `<a href="https://${Config.routes.dex}/abilities/${ability.id}" target="_blank" class="subtle" style="white-space:nowrap">${ability.name}</a>`;
}
function formatNature(n: string) {
	const nature = Dex.natures.get(n);
	return nature.name;
}

function formatMove(move: Move | string) {
	move = Dex.moves.get(move);
	return `<a href="https://${Config.routes.dex}/moves/${move.id}" target="_blank" class="subtle" style="white-space:nowrap">${move.name}</a>`;
}

function formatItem(item: Item | string) {
	if (typeof item === 'string' && item === "No Item") {
		return `No Item`;
	} else {
		item = Dex.items.get(item);
		return `<a href="https://${Config.routes.dex}/items/${item.id}" target="_blank" class="subtle" style="white-space:nowrap">${item.name}</a>`;
	}
}
function generateSTBSet(set: STBSet, dex: ModdedDex, baseDex: ModdedDex) {
	if (set.skip) {
		const baseSet = toID(Object.values(stbSets[set.skip]).join());
		const skipSet = toID(Object.values(set).join()).slice(0, -toID(set.skip).length);
		if (baseSet === skipSet) return ``;
	}
	let buf = ``;
	buf += `<details><summary>Set</summary>`;
	buf += `<ul style="list-style-type:none;"><li>${set.species}${set.gender !== '' ? ` (${set.gender})` : ``}${set.item ? ` @ ${Array.isArray(set.item) ? set.item.map(x => dex.items.get(x).name).join(' / ') : dex.items.get(set.item).name}` : ''}</li>`;
	buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(x => dex.abilities.get(x).name).join(' / ') : dex.abilities.get(set.ability).name}</li>`;
	if (set.shiny) buf += `<li>Shiny: ${typeof set.shiny === 'number' ? `Sometimes` : `Yes`}</li>`;
	if (set.evs) {
		const evs: string[] = [];
		let ev: StatID;
		for (ev in set.evs) {
			if (set.evs[ev] === 0) continue;
			evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
		}
		buf += `<li>EVs: ${evs.join(" / ")}</li>`;
	}
	if (set.nature) {
		buf += `<li>${Array.isArray(set.nature) ? set.nature.join(" / ") : formatNature(set.nature)} Nature</li>`;
	}
	if (set.ivs) {
		const ivs: string[] = [];
		let iv: StatID;
		for (iv in set.ivs) {
			if (set.ivs[iv] === 31) continue;
			ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
		}
		buf += `<li>IVs: ${ivs.join(" / ")}</li>`;
	}
	for (const moveid of set.moves) {
		buf += `<li>- ${Array.isArray(moveid) ? moveid.map(x => dex.moves.get(x).name).join(" / ") : dex.moves.get(moveid).name}</li>`;
	}
	const italicize = !baseDex.moves.get(set.signatureMove).exists;
	buf += `<li>- ${italicize ? `<i>` : ``}${dex.moves.get(set.signatureMove).name}${italicize ? `</i>` : ``}</li>`;
	buf += `</ul>`;
	buf += `</details>`;
	return buf;
}

function generateSSBMoveInfo(sigMove: Move, dex: ModdedDex) {
	let buf = ``;
	if (sigMove.shortDesc || sigMove.desc) {
		buf += `<hr />`;
		buf += Chat.getDataMoveHTML(sigMove);
		const details: {[k: string]: string} = {
			Priority: String(sigMove.priority),
			Gen: String(sigMove.gen) || 'CAP',
		};

		if (sigMove.isNonstandard === "Past" && dex.gen >= 8) details["&#10007; Past Gens Only"] = "";
		if (sigMove.secondary || sigMove.secondaries) details["&#10003; Secondary effect"] = "";
		if (sigMove.flags['contact']) details["&#10003; Contact"] = "";
		if (sigMove.flags['sound']) details["&#10003; Sound"] = "";
		if (sigMove.flags['bullet']) details["&#10003; Bullet"] = "";
		if (sigMove.flags['pulse']) details["&#10003; Pulse"] = "";
		if (!sigMove.flags['protect'] && !/(ally|self)/i.test(sigMove.target)) details["&#10003; Bypasses Protect"] = "";
		if (sigMove.flags['bypasssub']) details["&#10003; Bypasses Substitutes"] = "";
		if (sigMove.flags['defrost']) details["&#10003; Thaws user"] = "";
		if (sigMove.flags['bite']) details["&#10003; Bite"] = "";
		if (sigMove.flags['punch']) details["&#10003; Punch"] = "";
		if (sigMove.flags['powder']) details["&#10003; Powder"] = "";
		if (sigMove.flags['reflectable']) details["&#10003; Bounceable"] = "";
		if (sigMove.flags['charge']) details["&#10003; Two-turn move"] = "";
		if (sigMove.flags['recharge']) details["&#10003; Has recharge turn"] = "";
		if (sigMove.flags['gravity']) details["&#10007; Suppressed by Gravity"] = "";
		if (sigMove.flags['dance']) details["&#10003; Dance move"] = "";

		if (sigMove.zMove?.basePower) {
			details["Z-Power"] = String(sigMove.zMove.basePower);
		} else if (sigMove.zMove?.effect) {
			const zEffects: {[k: string]: string} = {
				clearnegativeboost: "Restores negative stat stages to 0",
				crit2: "Crit ratio +2",
				heal: "Restores HP 100%",
				curse: "Restores HP 100% if user is Ghost type, otherwise Attack +1",
				redirect: "Redirects opposing attacks to user",
				healreplacement: "Restores replacement's HP 100%",
			};
			details["Z-Effect"] = zEffects[sigMove.zMove.effect];
		} else if (sigMove.zMove?.boost) {
			details["Z-Effect"] = "";
			const boost = sigMove.zMove.boost;
			for (const h in boost) {
				details["Z-Effect"] += ` ${Dex.stats.mediumNames[h as 'atk']} +${boost[h as 'atk']}`;
			}
		} else if (sigMove.isZ && typeof sigMove.isZ === 'string') {
			details["&#10003; Z-Move"] = "";
			const zCrystal = dex.items.get(sigMove.isZ);
			details["Z-Crystal"] = zCrystal.name;
			if (zCrystal.itemUser) {
				details["User"] = zCrystal.itemUser.join(", ");
				details["Required Move"] = dex.items.get(sigMove.isZ).zMoveFrom!;
			}
		} else {
			details["Z-Effect"] = "None";
		}

		const targetTypes: {[k: string]: string} = {
			normal: "One Adjacent Pok\u00e9mon",
			self: "User",
			adjacentAlly: "One Ally",
			adjacentAllyOrSelf: "User or Ally",
			adjacentFoe: "One Adjacent Opposing Pok\u00e9mon",
			allAdjacentFoes: "All Adjacent Opponents",
			foeSide: "Opposing Side",
			allySide: "User's Side",
			allyTeam: "User's Side",
			allAdjacent: "All Adjacent Pok\u00e9mon",
			any: "Any Pok\u00e9mon",
			all: "All Pok\u00e9mon",
			scripted: "Chosen Automatically",
			randomNormal: "Random Adjacent Opposing Pok\u00e9mon",
			allies: "User and Allies",
		};
		details["Target"] = targetTypes[sigMove.target] || "Unknown";
		if (sigMove.isNonstandard === 'Unobtainable') {
			details[`Unobtainable in Gen ${dex.gen}`] = "";
		}
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
		if (sigMove.desc && sigMove.desc !== sigMove.shortDesc) {
			buf += `<details><summary><strong>In-Depth Description</strong></summary>${sigMove.desc}</details>`;
		}
	}
	return buf;
}

function generateSSBItemInfo(set: STBSet, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	if (set.item && !Array.isArray(set.item)) {
		const baseItem = baseDex.items.get(set.item);
		const sigItem = dex.items.get(set.item);
		if (!baseItem.exists || (baseItem.desc || baseItem.shortDesc) !== (sigItem.desc || sigItem.shortDesc)) {
			buf += `<hr />`;
			buf += Chat.getDataItemHTML(sigItem);
			const details: {[k: string]: string} = {
				Gen: String(sigItem.gen),
			};

			if (dex.gen >= 4) {
				if (sigItem.fling) {
					details["Fling Base Power"] = String(sigItem.fling.basePower);
					if (sigItem.fling.status) details["Fling Effect"] = sigItem.fling.status;
					if (sigItem.fling.volatileStatus) details["Fling Effect"] = sigItem.fling.volatileStatus;
					if (sigItem.isBerry) details["Fling Effect"] = "Activates the Berry's effect on the target.";
					if (sigItem.id === 'whiteherb') details["Fling Effect"] = "Restores the target's negative stat stages to 0.";
					if (sigItem.id === 'mentalherb') {
						const flingEffect = "Removes the effects of Attract, Disable, Encore, Heal Block, Taunt, and Torment from the target.";
						details["Fling Effect"] = flingEffect;
					}
				} else {
					details["Fling"] = "This item cannot be used with Fling.";
				}
			}
			if (sigItem.naturalGift && dex.gen >= 3) {
				details["Natural Gift Type"] = sigItem.naturalGift.type;
				details["Natural Gift Base Power"] = String(sigItem.naturalGift.basePower);
			}
			if (sigItem.isNonstandard && sigItem.isNonstandard !== "Custom") {
				details[`Unobtainable in Gen ${dex.gen}`] = "";
			}
			buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
				value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
			)).join("&nbsp;|&ThickSpace;")}</font>`;
		}
	}
	return buf;
}

function generateSSBAbilityInfo(set: STBSet, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	if (!Array.isArray(set.ability) && !baseDex.abilities.get(set.ability).exists) {
		const sigAbil = Dex.deepClone(dex.abilities.get(set.ability));
		if (!sigAbil.desc && !sigAbil.shortDesc) {
			sigAbil.desc = `This ability doesn't have a description. Try contacting the SSB dev team.`;
		}
		buf += `<hr />`;
		buf += Chat.getDataAbilityHTML(sigAbil);
		const details: {[k: string]: string} = {
			Gen: String(sigAbil.gen) || 'CAP',
		};
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
		if (sigAbil.desc && sigAbil.shortDesc && sigAbil.desc !== sigAbil.shortDesc) {
			buf += `<details><summary><strong>In-Depth Description</strong></summary>${sigAbil.desc}</details>`;
		}
	}
	return buf;
}

function generateSSBPokemonInfo(species: string, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	const origSpecies = baseDex.species.get(species);
	const newSpecies = dex.species.get(species);
	if (
		newSpecies.types.join('/') !== origSpecies.types.join('/') ||
		Object.values(newSpecies.abilities).join('/') !== Object.values(origSpecies.abilities).join('/') ||
		Object.values(newSpecies.baseStats).join('/') !== Object.values(origSpecies.baseStats).join('/')
	) {
		buf += `<hr />`;
		buf += Chat.getDataPokemonHTML(newSpecies, dex.gen, 'SSB');
		let weighthit = 20;
		if (newSpecies.weighthg >= 2000) {
			weighthit = 120;
		} else if (newSpecies.weighthg >= 1000) {
			weighthit = 100;
		} else if (newSpecies.weighthg >= 500) {
			weighthit = 80;
		} else if (newSpecies.weighthg >= 250) {
			weighthit = 60;
		} else if (newSpecies.weighthg >= 100) {
			weighthit = 40;
		}
		const details: {[k: string]: string} = {
			"Dex#": String(newSpecies.num),
			Gen: String(newSpecies.gen) || 'CAP',
			Height: `${newSpecies.heightm} m`,
		};
		details["Weight"] = `${newSpecies.weighthg / 10} kg <em>(${weighthit} BP)</em>`;
		if (newSpecies.color && dex.gen >= 5) details["Dex Colour"] = newSpecies.color;
		if (newSpecies.eggGroups && dex.gen >= 2) details["Egg Group(s)"] = newSpecies.eggGroups.join(", ");
		const evos: string[] = [];
		for (const evoName of newSpecies.evos) {
			const evo = dex.species.get(evoName);
			if (evo.gen <= dex.gen) {
				const condition = evo.evoCondition ? ` ${evo.evoCondition}` : ``;
				switch (evo.evoType) {
				case 'levelExtra':
					evos.push(`${evo.name} (level-up${condition})`);
					break;
				case 'levelFriendship':
					evos.push(`${evo.name} (level-up with high Friendship${condition})`);
					break;
				case 'levelHold':
					evos.push(`${evo.name} (level-up holding ${evo.evoItem}${condition})`);
					break;
				case 'useItem':
					evos.push(`${evo.name} (${evo.evoItem})`);
					break;
				case 'levelMove':
					evos.push(`${evo.name} (level-up with ${evo.evoMove}${condition})`);
					break;
				case 'other':
					evos.push(`${evo.name} (${evo.evoCondition})`);
					break;
				case 'trade':
					evos.push(`${evo.name} (trade${evo.evoItem ? ` holding ${evo.evoItem}` : condition})`);
					break;
				default:
					evos.push(`${evo.name} (${evo.evoLevel}${condition})`);
				}
			}
		}
		if (!evos.length) {
			details[`<font color="#686868">Does Not Evolve</font>`] = "";
		} else {
			details["Evolution"] = evos.join(", ");
		}
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
	}
	return buf;
}

function generateSSBInnateInfo(name: string, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	// Special casing for users whose usernames are already existing, i.e. Perish Song
	let effect = dex.conditions.get(name + 'user');
	let longDesc = ``;
	const baseAbility = Dex.deepClone(baseDex.abilities.get('noability'));
	// @ts-ignore hack to record the name of the innate abilities without using name
	if (effect.exists && effect.innateName && (effect.desc || effect.shortDesc)) {
		// @ts-ignore hack
		baseAbility.name = effect.innateName;
		if (effect.desc) baseAbility.desc = effect.desc;
		if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
		buf += `<hr />Innate Ability:<br />${Chat.getDataAbilityHTML(baseAbility)}`;
		if (effect.desc && effect.shortDesc && effect.desc !== effect.shortDesc) {
			longDesc = effect.desc;
		}
	} else {
		effect = dex.conditions.get(name);
		// @ts-ignore hack
		if (effect.exists && effect.innateName && (effect.desc || effect.shortDesc)) {
			// @ts-ignore hack
			baseAbility.name = effect.innateName;
			if (effect.desc) baseAbility.desc = effect.desc;
			if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
			buf += `<hr />Innate Ability:<br />${Chat.getDataAbilityHTML(baseAbility)}`;
			if (effect.desc && effect.shortDesc && effect.desc !== effect.shortDesc) {
				longDesc = effect.desc;
			}
		}
	}
	if (buf) {
		const details: {[k: string]: string} = {Gen: '8'};
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
	}
	if (longDesc) {
		buf += `<details><summary><strong>In-Depth Description</strong></summary>${longDesc}</details>`;
	}
	return buf;
}

function STBSets(target: string) {
	const baseDex = Dex;
	const dex = Dex.forFormat('gen8supersmogtourbros');
	if (!Object.keys(stbSets).map(toID).includes(toID(target))) {
		return {e: `Error: ${target.trim()} doesn't have a [Gen 8] Super Smogtour Bros set.`};
	}
	let displayName = '';
	const names = [];
	for (const member in stbSets) {
		if (toID(member).startsWith(toID(target))) names.push(member);
		if (toID(member) === toID(target)) displayName = member;
	}
	let buf = '';
	for (const name of names) {
		if (buf) buf += `<hr>`;
		const set = stbSets[name];
		const mutatedSpecies = dex.species.get(set.species);
		if (!set.skip) {
			buf += Utils.html`<h1><psicon pokemon="${mutatedSpecies.id}">${displayName === 'yuki' ? name : displayName}</h1>`;
		} else {
			buf += `<details><summary><psicon pokemon="${set.species}"><strong>${name.split('-').slice(1).join('-') + ' forme'}</strong></summary>`;
		}
		buf += generateSTBSet(set, dex, baseDex);
		const item = dex.items.get(set.item as string);
		if (!set.skip || set.signatureMove !== stbSets[set.skip].signatureMove) {
			const sigMove = baseDex.moves.get(set.signatureMove).exists && !Array.isArray(set.item) &&
				typeof item.zMove === 'string' ?
				dex.moves.get(item.zMove) : dex.moves.get(set.signatureMove);
			buf += generateSSBMoveInfo(sigMove, dex);
			if (sigMove.id === 'blackbird') buf += generateSSBMoveInfo(dex.moves.get('gaelstrom'), dex);
		}
		buf += generateSSBItemInfo(set, dex, baseDex);
		buf += generateSSBAbilityInfo(set, dex, baseDex);
		buf += generateSSBInnateInfo(name, dex, baseDex);
		buf += generateSSBPokemonInfo(set.species, dex, baseDex);
		if (!Array.isArray(set.item) && item.megaStone) {
			buf += generateSSBPokemonInfo(item.megaStone, dex, baseDex);
		// Psynergy, Struchni, and Raj.shoot have itemless Mega Evolutions
		} else if (['Aggron', 'Rayquaza'].includes(set.species)) {
			buf += generateSSBPokemonInfo(`${set.species}-Mega`, dex, baseDex);
		} else if (set.species === 'Charizard') {
			buf += generateSSBPokemonInfo('Charizard-Mega-X', dex, baseDex);
		}
		if (set.skip) buf += `</details>`;
	}
	return buf;
}
export const commands: Chat.ChatCommands = {
	stb(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse(`/help stb`);
		const set = STBSets(target);
		if (typeof set !== 'string') {
			throw new Chat.ErrorMessage(set.e);
		}
		return this.sendReplyBox(set);
	},
	stbhelp: [
		`/stb [username] - Displays a Smogon Tournament's Super Smogtour Bros. set and custom features.`,
	],
};
