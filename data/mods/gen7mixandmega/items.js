'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let Items = {
	blueorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			/**@type {Species} */
			// @ts-ignore
			let species = this.getMixedSpecies(pokemon.m.originalSpecies, 'Kyogre-Primal');
			if (pokemon.m.originalSpecies === 'Kyogre') {
				pokemon.formeChange(species, this.effect, true);
			} else {
				pokemon.formeChange(species, this.effect, true);
				pokemon.baseSpecies = species;
				this.add('-start', pokemon, 'Blue Orb', '[silent]');
			}
		},
		onTakeItem(item) {
			return false;
		},
	},
	redorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			/**@type {Species} */
			// @ts-ignore
			let species = this.getMixedSpecies(pokemon.m.originalSpecies, 'Groudon-Primal');
			if (pokemon.m.originalSpecies === 'Groudon') {
				pokemon.formeChange(species, this.effect, true);
			} else {
				pokemon.formeChange(species, this.effect, true);
				pokemon.baseSpecies = species;
				this.add('-start', pokemon, 'Red Orb', '[silent]');
				let apparentSpecies = pokemon.illusion ? pokemon.illusion.species.name : pokemon.m.originalSpecies;
				let oSpecies = this.dex.getSpecies(apparentSpecies);
				if (pokemon.illusion) {
					let types = oSpecies.types;
					if (types.length > 1 || types[types.length - 1] !== 'Fire') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Fire' ? types[0] + '/' : '') + 'Fire', '[silent]');
					}
				} else if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onTakeItem(item) {
			return false;
		},
	},
};

exports.Items = Items;
