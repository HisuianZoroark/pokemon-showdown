// HiZo — 9/25/25, 5:38 PM
// @dhelmise mind if i code in bio mech mons
// kinda wanna get back on the programming side of things
// I may regret this later but I am filled with hubris
//
// I regret this now


export const Scripts: ModdedBattleScriptsData = {
  pokemon: {
    getItem() {
      if (this.battle.dex.moves.getByID(this.item)?.exists) {
        let move = this.battle.dex.moves.getByID(this.item);
        // @ts-ignore
        return {
          id: move.id,
          name: move.name,
          fullname: 'item: move' + move.name,
          effectType: "Item",
          toString() {
  					return move.name;
  				},
          onBioMechMons(this: Battle, pokemon: Pokemon) {
            const sketchedMove = {
      				move: move.name,
      				id: move.id,
      				pp: move.pp,
      				maxpp: move.pp,
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
          fullname: 'item: ability' + ability.name,
          effectType: "Ability",
          toString() {
            return ability.name;
  				},
        } as Item;
        for (const prop of Object.keys(ability)) {
          // @ts-ignore
          if (typeof ability[prop] ==='function') {
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
          fullname: 'ability: move' + move.name,
          effectType: "Ability",
          toString() {
  					return move.name;
  				},
          onBioMechMons(this: Battle, pokemon: Pokemon) {
            const sketchedMove = {
      				move: move.name,
      				id: move.id,
      				pp: move.pp,
      				maxpp: move.pp,
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
          fullname: 'ability: item' + item.name,
          effectType: "Item",
          toString() {
            return item.name;
  				},
        } as Ability;
        for (const prop of Object.keys(item)) {
          // @ts-ignore
          if (typeof ability[prop] ==='function') {
            // @ts-ignore
            abilItem[prop] = ability[prop];
          }
        }
        return abilItem;
      }
  		return this.battle.dex.abilities.getByID(this.ability);
    },
  }
};
