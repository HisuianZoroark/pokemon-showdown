export const Items: {[k: string]: ModdedItemData} = {
	rustedshield: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			// @ts-ignore
			const species: Species = this.actions.getMixedSpecies(pokemon.m.originalSpecies, 'Zamazenta-Crowned');
			if (pokemon.m.originalSpecies === 'Zamazenta') {
				pokemon.formeChange(species, this.effect, true);
			} else {
				pokemon.formeChange(species, this.effect, true);
				pokemon.baseSpecies = species;
				this.add('-start', pokemon, 'Rusted Shield', '[silent]');
				const apparentSpecies = pokemon.illusion ? pokemon.illusion.species.name : pokemon.m.originalSpecies;
				const oSpecies = this.dex.species.get(apparentSpecies);
				if (pokemon.illusion) {
					const types = oSpecies.types;
					if (types.length > 1 || types[types.length - 1] !== 'Steel') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Steel' ? types[0] + '/' : '') + 'Steel', '[silent]');
					}
				} else if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onTakeItem: false,
	},
	rustedsword: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			// @ts-ignore
			const species: Species = this.actions.getMixedSpecies(pokemon.m.originalSpecies, 'Zacian-Crowned');
			if (pokemon.m.originalSpecies === 'Zacian') {
				pokemon.formeChange(species, this.effect, true);
			} else {
				pokemon.formeChange(species, this.effect, true);
				pokemon.baseSpecies = species;
				this.add('-start', pokemon, 'Rusted Sword', '[silent]');
				const apparentSpecies = pokemon.illusion ? pokemon.illusion.species.name : pokemon.m.originalSpecies;
				const oSpecies = this.dex.species.get(apparentSpecies);
				if (pokemon.illusion) {
					const types = oSpecies.types;
					if (types.length > 1 || types[types.length - 1] !== 'Steel') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Steel' ? types[0] + '/' : '') + 'Steel', '[silent]');
					}
				} else if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onTakeItem: false,
	},
	blueorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			// @ts-ignore
			const species: Species = this.actions.getMixedSpecies(pokemon.m.originalSpecies, 'Kyogre-Primal');
			if (pokemon.m.originalSpecies === 'Kyogre') {
				pokemon.formeChange(species, this.effect, true);
			} else {
				pokemon.formeChange(species, this.effect, true);
				pokemon.baseSpecies = species;
				this.add('-start', pokemon, 'Blue Orb', '[silent]');
			}
		},
		onTakeItem: false,
		isNonstandard: null,
	},
	redorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.species.isPrimal) {
				this.queue.insertChoice({pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			// @ts-ignore
			const species: Species = this.actions.getMixedSpecies(pokemon.m.originalSpecies, 'Groudon-Primal');
			if (pokemon.m.originalSpecies === 'Groudon') {
				pokemon.formeChange(species, this.effect, true);
			} else {
				pokemon.formeChange(species, this.effect, true);
				pokemon.baseSpecies = species;
				this.add('-start', pokemon, 'Red Orb', '[silent]');
				const apparentSpecies = pokemon.illusion ? pokemon.illusion.species.name : pokemon.m.originalSpecies;
				const oSpecies = this.dex.species.get(apparentSpecies);
				if (pokemon.illusion) {
					const types = oSpecies.types;
					if (types.length > 1 || types[types.length - 1] !== 'Fire') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Fire' ? types[0] + '/' : '') + 'Fire', '[silent]');
					}
				} else if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onTakeItem: false,
		isNonstandard: null,
	},
	abomasite: {
		inherit: true,
		isNonstandard: null,
	},
	absolite: {
		inherit: true,
		isNonstandard: null,
	},
	aerodactylite: {
		inherit: true,
		isNonstandard: null,
	},
	aggronite: {
		inherit: true,
		isNonstandard: null,
	},
	alakazite: {
		inherit: true,
		isNonstandard: null,
	},
	altarianite: {
		inherit: true,
		isNonstandard: null,
	},
	ampharosite: {
		inherit: true,
		isNonstandard: null,
	},
	audinite: {
		inherit: true,
		isNonstandard: null,
	},
	banettite: {
		inherit: true,
		isNonstandard: null,
	},
	beedrillite: {
		inherit: true,
		isNonstandard: null,
	},
	blastoisinite: {
		inherit: true,
		isNonstandard: null,
	},
	blazikenite: {
		inherit: true,
		isNonstandard: null,
	},
	cameruptite: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditex: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditey: {
		inherit: true,
		isNonstandard: null,
	},
	diancite: {
		inherit: true,
		isNonstandard: null,
	},
	galladite: {
		inherit: true,
		isNonstandard: null,
	},
	garchompite: {
		inherit: true,
		isNonstandard: null,
	},
	gardevoirite: {
		inherit: true,
		isNonstandard: null,
	},
	gengarite: {
		inherit: true,
		isNonstandard: null,
	},
	glalitite: {
		inherit: true,
		isNonstandard: null,
	},
	gyaradosite: {
		inherit: true,
		isNonstandard: null,
	},
	heracronite: {
		inherit: true,
		isNonstandard: null,
	},
	houndoominite: {
		inherit: true,
		isNonstandard: null,
	},
	kangaskhanite: {
		inherit: true,
		isNonstandard: null,
	},
	latiasite: {
		inherit: true,
		isNonstandard: null,
	},
	latiosite: {
		inherit: true,
		isNonstandard: null,
	},
	lopunnite: {
		inherit: true,
		isNonstandard: null,
	},
	lucarionite: {
		inherit: true,
		isNonstandard: null,
	},
	manectite: {
		inherit: true,
		isNonstandard: null,
	},
	mawilite: {
		inherit: true,
		isNonstandard: null,
	},
	medichamite: {
		inherit: true,
		isNonstandard: null,
	},
	metagrossite: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitex: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitey: {
		inherit: true,
		isNonstandard: null,
	},
	pidgeotite: {
		inherit: true,
		isNonstandard: null,
	},
	pinsirite: {
		inherit: true,
		isNonstandard: null,
	},
	sablenite: {
		inherit: true,
		isNonstandard: null,
	},
	salamencite: {
		inherit: true,
		isNonstandard: null,
	},
	sceptilite: {
		inherit: true,
		isNonstandard: null,
	},
	scizorite: {
		inherit: true,
		isNonstandard: null,
	},
	sharpedonite: {
		inherit: true,
		isNonstandard: null,
	},
	slowbronite: {
		inherit: true,
		isNonstandard: null,
	},
	steelixite: {
		inherit: true,
		isNonstandard: null,
	},
	swampertite: {
		inherit: true,
		isNonstandard: null,
	},
	tyranitarite: {
		inherit: true,
		isNonstandard: null,
	},
	venusaurite: {
		inherit: true,
		isNonstandard: null,
	},
};
