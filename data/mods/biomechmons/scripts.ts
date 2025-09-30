// HiZo — 9/25/25, 5:38 PM
// @dhelmise mind if i code in bio mech mons
// kinda wanna get back on the programming side of things
// I may regret this later but I am filled with hubris
//
// I regret this now

import { RESTORATIVE_BERRIES } from '../../../sim/pokemon';


export const Scripts: ModdedBattleScriptsData = {
  pokemon: {
    getItem() {
      if (this.battle.dex.moves.getByID(this.item)?.exists) {
        let move = this.battle.dex.moves.getByID(this.item);
        // @ts-ignore
        return {
          id: move.id,
          name: move.name,
          fullname: 'item: ' + move.name,
          effectType: "Item",
          flags: {},
          toString() {
            return move.name;
          },
          onBioMechMons(this: Battle, pokemon: Pokemon) {
            const sketchedMove = {
              move: move.name,
              id: move.id,
              pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
              maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
              target: move.target,
              disabled: false,
              used: false,
            };
            pokemon.moveSlots.push(sketchedMove);
          },
        } as Item;
      } else if (this.battle.dex.abilities.getByID(this.item)?.exists) {
        let ability = this.battle.dex.abilities.getByID(this.item);
        // @ts-ignore
        let abilItem = {
          id: ability.id,
          name: ability.name,
          fullname: 'item: ' + ability.name,
          // displays as ability
          flags: {},
          effectType: "Item",
          toString() {
            return ability.name;
          },
        } as Item;
        for (const prop of Object.keys(ability)) {
          // @ts-ignore
          if (typeof ability[prop] === 'function' || prop.toLowerCase().endsWith('priority')) {
            // @ts-ignore
            abilItem[prop] = ability[prop];
          }
        }
        return abilItem;
      }
      return this.battle.dex.items.getByID(this.item);
    },
    getAbility() {
      if (this.battle.dex.moves.getByID(this.ability)?.exists) {
        let move = this.battle.dex.moves.getByID(this.ability);
        // @ts-ignore
        return {
          id: move.id,
          name: move.name,
          flags: {},
          fullname: 'ability: ' + move.name,
          effectType: "Ability",
          toString() {
            return move.name;
          },
          onBioMechMons(this: Battle, pokemon: Pokemon) {
            const sketchedMove = {
              move: move.name,
              id: move.id,
              pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
              maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
              target: move.target,
              disabled: false,
              used: false,
            };
            pokemon.moveSlots.push(sketchedMove);
          },
        } as Ability;
      } else if (this.battle.dex.items.getByID(this.ability)?.exists) {
        let item = this.battle.dex.items.getByID(this.ability);
        // @ts-ignore
        let abilItem = {
          id: item.id,
          name: item.name,
          fullname: 'ability: ' + item.name,
          effectType: "Ability",
          flags: {},
          toString() {
            return item.name;
          },
        } as Ability;
        for (const prop of Object.keys(item)) {
          // @ts-ignore
          if (typeof item[prop] === 'function' || prop.toLowerCase().endsWith('priority')) {
            // @ts-ignore
            abilItem[prop] = item[prop];
          }
        }
        return abilItem;
      }
      return this.battle.dex.abilities.getByID(this.ability);
    },
    // I dont want to hard code every consumable item
    eatItem(force, source, sourceEffect) {
      if (!this.item || this.itemState.knockedOff) return false;
      if ((!this.hp && this.item !== 'jabocaberry' && this.item !== 'rowapberry') || !this.isActive) return false;

      if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
      if (!source && this.battle.event?.target) source = this.battle.event.target;
      const item = this.getItem();
      if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
        // if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
        return false;
      }
      if (
        this.battle.runEvent('UseItem', this, null, null, item) &&
        (force || this.battle.runEvent('TryEatItem', this, null, null, item))
      ) {
        this.battle.add('-enditem', this, item, '[eat]');

        this.battle.singleEvent('Eat', item, this.itemState, this, source, sourceEffect);
        this.battle.runEvent('EatItem', this, source, sourceEffect, item);

        if (RESTORATIVE_BERRIES.has(item.id)) {
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

        switch (sourceEffect?.effectType) {
          case 'Ability':
            this.setAbility('No Ability', this);
            this.baseAbility = this.ability;
            break;
          case 'Move': // todo: Find out
            if (source === this) {
              break;
            }
          // fall through otherwise
          default:
            this.lastItem = this.item;
            this.item = '';
            this.battle.clearEffectState(this.itemState);
        }
        this.usedItemThisTurn = true;
        this.ateBerry = true;
        this.battle.runEvent('AfterUseItem', this, null, null, item);
        return true;
      }
      return false;
    },

    useItem(source, sourceEffect) {
      if ((!this.hp && !this.getItem().isGem) || !this.isActive) return false;
      if (!this.item || this.itemState.knockedOff) return false;

      if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
      if (!source && this.battle.event?.target) source = this.battle.event.target;
      const item = this.getItem();
      if (sourceEffect?.effectType === 'Item' && this.item !== sourceEffect.id && source === this) {
        // if an item is telling us to eat it but we aren't holding it, we probably shouldn't eat what we are holding
        return false;
      }
      if (this.battle.runEvent('UseItem', this, null, null, item)) {
        switch (item.id) {
          case 'redcard':
            this.battle.add('-enditem', this, item, `[of] ${source}`);
            break;
          default:
            if (item.isGem) {
              this.battle.add('-enditem', this, item, '[from] gem');
            } else {
              this.battle.add('-enditem', this, item);
            }
            break;
        }
        if (item.boosts) {
          this.battle.boost(item.boosts, this, source, item);
        }

        this.battle.singleEvent('Use', item, this.itemState, this, source, sourceEffect);

        switch (sourceEffect?.effectType) {
          case 'Ability':
            this.setAbility('No Ability', this);
            this.baseAbility = this.ability;
            break;
          case 'Move': // todo: Find out
            if (source === this) {
              break;
            }
          // fall through otherwise
          default:
            this.lastItem = this.item;
            this.item = '';
            this.battle.clearEffectState(this.itemState);
        }
        this.usedItemThisTurn = true;
        this.battle.runEvent('AfterUseItem', this, null, null, item);
        return true;
      }
      return false;
    },
  },
};
