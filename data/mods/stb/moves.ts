import {getName} from './conditions';
import {changeSet, changeMoves} from "./abilities";
import {stbSets} from "./random-teams";

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Move Name 1', source);
			this.add('-anim', source, 'Move Name 2', source);
		}, // For custom animations
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMove: {effect: ''}, // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMove: {boost: {atk: 2}}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// ABR
	burningrain: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 50% chance to burn the target.",
		shortDesc: "50% chance to burn the target.",
		name: "Burning Rain",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {defrost: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Water Spout');
		},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Water",
	},
	// Bushtush
	thunderwavefists: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		name: "Thunderwave Fists",
		gen: 8,
		pp: 12,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Plasma Fists');
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
	},
	// BKC
	angryrant: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages. The target's next attack will be a critical hit.",
		shortDesc: "Raises user's spe by 2. Target's next move crits.",
		name: "Angry Rant",
		gen: 8,
		pp: 5,
		priority: 2,
		flags: {snatch: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] No Retreat');
		},
		onHit(target, source, move) {
			const foe = source.side.foe.active[0];
			foe.addVolatile('angryrant');
		},
		boosts: {
			spe: 2,
		},
		condition: {
			duration: 1,
			onStart(pokemon, source, effect) {
				if (effect && (['imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', pokemon, 'move: Angry Rant', '[silent]');
				} else {
					this.add('-start', pokemon, 'move: Angry Rant');
				}
			},
			onRestart(pokemon) {
				this.effectState.duration = 1;
				this.add('-start', pokemon, 'move: Angry Rant');
			},
			onModifyCritRatio(critRatio) {
				return 5;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Angry Rant', '[silent]');
			},
		},
		secondary: null,
		target: "self",
		type: "Fire",
	},
	// Earthworm
	hotpursuit: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after an opponent using Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch, but not Baton Pass, it will hit that opponent before it leaves the field. The move hits twice and no accuracy check is done if the user hits an opponent switching out and if the opponent does not attack, and the user's turn is over; if an opponent faints from this, the replacement Pokemon does not become active until the end of the turn. The opposing Pokemon cannot is trapped and cannot switch out, even through the use of a move like Volt Switch.",
		shortDesc: "If a foe is switching out, hits 2x. Traps foe.",
		name: "Hot Pursuit",
		gen: 8,
		pp: 15,
		priority: 1,
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Pursuit');
		},
		onHit(target, source, move) {
			if (source.isActive) target.addVolatile('supertrapped', source, move, 'trapper');
		},
		flags: {protect: 1, mirror: 1},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('hotpursuit', pokemon);
				const data = side.getSideConditionData('hotpursuit');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) {
				move.accuracy = true;
				if (target.beingCalledBack || this.queue.willMove(target)) {
					move.multihit = 2;
				}
			}
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('hotpursuit');
		},
		condition: {
			duration: 1,
			onUpdate(pokemon) {
				if (pokemon.switchFlag) pokemon.switchFlag = false;
				if (pokemon.forceSwitchFlag) pokemon.forceSwitchFlag = false;
			},
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				pokemon.switchFlag = false;
				for (const source of this.effectState.sources) {
					if (!this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Hot Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('hotpursuit', source, source.getLocOf(pokemon));
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Empo
	timestopper: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Freezes the target. Sets Sticky Web.",
		shortDesc: "Freezes the target. Sets Sticky Web.",
		name: "Time Stopper",
		gen: 8,
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Sheer Cold');
		},
		onHit(target, source, move) {
			source.side.foe.addSideCondition('stickyweb');
			target.trySetStatus('frz', source, move);
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},
	// Heroic Troller
	shadowend: {
		accuracy: 100,
		basePower: 110,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Pursuit damage boost');
				return move.basePower + 60;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "This move can hit Normal-type Pokemon. If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after an opponent using Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch, but not Baton Pass, it will hit that opponent before it leaves the field. Power increases by 60 and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon does not become active until the end of the turn.",
		shortDesc: "If a foe is switching out, +60 BP. Hits Normal.",
		name: "Shadow End",
		gen: 8,
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Spectral Thief');
		},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('shadowend', pokemon);
				const data = side.getSideConditionData('shadowend');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('shadowend');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Shadow End');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('shadowend', source, source.getLocOf(pokemon));
				}
			},
		},
		ignoreImmunity: true,
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	// Instruct
	norineurotoxin: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user's replacement gets Adaptability on top of their existing ability, and cannot be ignored or suppressed. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		shortDesc: "User switches out. Replacement gets Adaptability.",
		name: "Nori Neurotoxin",
		gen: 8,
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Sludge Wave');
			this.attrLastMove('[anim] Parting Shot');
		},
		self: {
			sideCondition: 'norineurotoxin',
		},
		condition: {
			duration: 1,
			onSideStart(side, source) {
				this.debug('Nori Neurotoxin started on ' + side.name);
				this.effectState.positions = [];
				for (const i of side.active.keys()) {
					this.effectState.positions[i] = false;
				}
				this.effectState.positions[source.position] = true;
			},
			onSideRestart(side, source) {
				this.effectState.positions[source.position] = true;
			},
			onSwitchInPriority: 1,
			onSwitchIn(target) {
				this.add('-activate', target, 'move: Nori Neurotoxin');
				if (target.addVolatile('ability:adaptability')) {
					this.add('-start', target, 'adaptability', '[silent]');
					this.add('-message', `${target.name} has innate adaptability!`);
				}
			},
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Poison",
	},
	// Punny
	fairypower: {
		accuracy: 100,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			return move.basePower + 20 * pokemon.positiveBoosts();
		},
		category: "Special",
		desc: "Power is equal to 30+(X*20), where X is the user's total stat stage changes that are greater than 0. Has an 100% chance to raise the user's Defense by 1 stage.",
		shortDesc: "+20 BP each user's stat boosts. 100% chance user's Def +1.",
		name: "Fairy Power",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Stored Power');
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Fairy",
	},
	// z0mOG
	sleepwalk: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Can only be selected while user is asleep. 50% chance to be dark type and 50% chance to be normal type. Lowers target defense 100%.",
		shortDesc: "50% Dark/Normal. Must be asleep. 100% -1 Def.",
		name: "Sleep Walk",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTry(source) {
			return source.status === 'slp' || source.hasAbility('comatose');
		},
		onModifyType(move, pokemon) {
			if (this.randomChance(1, 2)) {
				move.type = 'Normal';
			} else {
				move.type = 'Dark';
			}
		},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[anim] Frustration');
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "???",
	},
};
