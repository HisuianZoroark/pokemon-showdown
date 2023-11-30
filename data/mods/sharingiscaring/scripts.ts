import {RESTORATIVE_BERRIES} from '../../../sim/pokemon';
export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	pokemon: {
		isGrounded(negateImmunity) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball' || this.volatiles['item:ironball']) return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !(this.hasType('???') && 'roost' in this.volatiles)) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAbility(this)) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			if (item === 'airballoon' || this.volatiles['item:airballoon']) return false;
			return true;
		},
		hasItem(item) {
			if (this.ignoringItem()) return false;
			if (Array.isArray(item)) return item.some(i => this.hasItem(i));
			const itemid = this.battle.toID(item);
			return this.item === itemid || !!this.volatiles['item:' + itemid];
		},
		useItem(source, sourceEffect) {
			// @ts-ignore
			const hasAnyItem = !!this.item || Object.keys(this.volatiles).some(v => v.startsWith('item:'));
			// Best to declare everything early because ally might have a gem that needs proccing
			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			const item = (sourceEffect?.id.startsWith('item:')) ? sourceEffect as Item : this.getItem();
			if ((!this.hp && !item.isGem) || !this.isActive) return false;
			if (!hasAnyItem) return false;

			if (this.battle.runEvent('UseItem', this, null, null, item)) {
				switch (item.id.startsWith('item:') ? item.id.slice(5) : item.id) {
				case 'redcard':
					this.battle.add('-enditem', this, item.name, '[of] ' + source);
					break;
				default:
					if (item.isGem) {
						this.battle.add('-enditem', this, item.name, '[from] gem');
					} else {
						this.battle.add('-enditem', this, item.name);
					}
					break;
				}
				if (item.boosts) {
					this.battle.boost(item.boosts, this, source, item);
				}

				this.battle.singleEvent('Use', item, this.itemState, this, source, sourceEffect);

				if (item.id.startsWith('item:')) {
					delete this.volatiles[item.id];
					this.m.SharedItemsUsed.push(item.id.slice(5));
				} else {
					this.lastItem = this.item;
					this.item = '';
					this.itemState = {id: '', target: this};
				}
				this.usedItemThisTurn = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item);
				return true;
			}
			return false;
		},
		eatItem(force, source, sourceEffect) {
			// @ts-ignore
			const hasAnyItem = !!this.item || Object.keys(this.volatiles).some(v => v.startsWith('item:'));
			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			const item = (sourceEffect?.id.startsWith('item:')) ? sourceEffect as Item : this.getItem();
			if (!hasAnyItem) return false;
			if ((!this.hp && toID(item.name) !== 'jabocaberry' && toID(item.name) !== 'rowapberry') || !this.isActive) return false;

			if (
				this.battle.runEvent('UseItem', this, null, null, item) &&
				(force || this.battle.runEvent('TryEatItem', this, null, null, item))
			) {
				this.battle.add('-enditem', this, item.name, '[eat]');

				this.battle.singleEvent('Eat', item, this.itemState, this, source, sourceEffect);
				this.battle.runEvent('EatItem', this, null, null, item);

				if (RESTORATIVE_BERRIES.has(item.id.startsWith('item:') ? item.id.slice(5) as ID : item.id)) {
					switch (this.pendingStaleness) {
					case 'internal':
						if (this.staleness !== 'external') this.staleness = 'internal';
						break;
					case 'external':
						this.staleness = 'external';
						break;
					}
					this.pendingStaleness = undefined;
				}

				if (item.id.startsWith('item:')) {
					delete this.volatiles[item.id];
					this.m.SharedItemsUsed.push(item.id.slice(5));
				} else {
					this.lastItem = this.item;
					this.item = '';
					this.itemState = {id: '', target: this};
				}
				this.usedItemThisTurn = true;
				this.ateBerry = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item);
				return true;
			}
			return false;
		},
		setItem(item, source, effect) {
			if (!this.hp || !this.isActive) return false;
			if (this.itemState.knockedOff) return false;
			if (typeof item === 'string') item = this.battle.dex.items.get(item);

			const effectid = this.battle.effect ? this.battle.effect.id : '';
			if (RESTORATIVE_BERRIES.has('leppaberry' as ID)) {
				const inflicted = ['trick', 'switcheroo'].includes(effectid);
				const external = inflicted && source && !source.isAlly(this);
				this.pendingStaleness = external ? 'external' : 'internal';
			} else {
				this.pendingStaleness = undefined;
			}
			const oldItem = this.getItem();
			const oldItemState = this.itemState;
			this.item = item.id;
			this.itemState = {id: item.id, target: this};
			if (oldItem.exists) this.battle.singleEvent('End', oldItem, oldItemState, this);
			if (item.id) {
				this.battle.singleEvent('Start', item, this.itemState, this, source, effect);
				for (const ally of this.side.pokemon) {
					// @ts-ignore
					ally.m.SharedItemsUsed = ally.m.SharedItemsUsed.filter(i => i !== item.id);
				}
			}
			return true;
		},
	},
};
