import {toID} from './../../../sim/dex';

export class MixAndMeta {
	public static readonly MixedMetaCollection: {[k: string]: MixedMeta} = {
		'350cup': {
			format: "[Gen 8] 350 Cup",
			weightTier: "OU",
		},
		almostanyability: {
			format: "[Gen 8] Almost Any Ability",
			weightTier: "OU",
		},
		alphabetcup: {
			format: "[Gen 8] Alphabet Cup",
			weightTier: "OU",
		},
		balancedhackmons: {
			format: "[Gen 8] Balanced Hackmons",
			weightTier: "LC",
		},
		bonustype: {
			format: "[Gen 8] Bonus Type",
			weightTier: "OU",
			isSetRedFlag: function(set: PokemonSet) {
				const bonusType = Dex.types.get(set.name);
				if (!bonusType.exists) return undefined;

				return `named for the Bonus Type ${bonusType.name}`;
			},
		},
		camomons: {
			format: "[Gen 8] Camomons",
			weightTier: "OU",
		},
		crossevolution: {
			format: "[Gen 8] Cross Evolution",
			weightTier: "OU",
			isSetRedFlag: function(set: PokemonSet) {
				const setNameID = toID(set.name);
				const species = Dex.species.get(set.species);
				const setNameAsSpecies = Dex.species.get(setNameID);
				if (!setNameAsSpecies.exists) return undefined;

				const baseSpeciesNameID = toID(species.baseSpecies);
				if (setNameID === baseSpeciesNameID) return undefined;

				return `named as a different base species, ${species.baseSpecies}`;
			},
		},
		flipped: {
			format: "[Gen 8] Flipped",
			weightTier: "OU",
		},
		inheritance: {
			format: "[Gen 8] Inheritance",
			weightTier: "OU",
		},
		maxberries: {
			format: "[Gen 8] Max Berries",
			weightTier: "OU",
		},
		mixandmega: {
			format: "[Gen 8] Mix and Mega",
			weightTier: "RU",
		},
		natureswap: {
			format: "[Gen 8] Nature Swap",
			weightTier: "OU",
		},
		nfe: {
			format: "[Gen 8] NFE",
			weightTier: "OU",
		},
		pokebilities: {
			format: "[Gen 8] Pokebilities",
			weightTier: "OU",
		},
		purehackmons: {
			format: "[Gen 8] Pure Hackmons",
			weightTier: "LC",
			bstLimit: 200,
		},
		scalemons: {
			format: "[Gen 8] Scalemons",
			weightTier: "OU",
		},
		sharedpower: {
			format: "[Gen 8] Shared Power",
			weightTier: "RU",
		},
		sketchmons: {
			format: "[Gen 8] Sketchmons",
			weightTier: "OU",
		},
		stabmons: {
			format: "[Gen 8] STABmons",
			weightTier: "OU",
		},
		tiershift: {
			format: "[Gen 8] Tier Shift",
			weightTier: "OU",
		},
		trademarked: {
			format: "[Gen 8] Trademarked",
			weightTier: "OU",
		},
		// Impossible/banned:-
		// [Gen 8] 2v2 Doubles: Different game type
		// [Gen 8] Chimera 1v1: Has teamwide effects
		// [Gen 8] Godly Gift: Teamwide effects
		// [Gen 8] First Blood: Different win condition
		// [Gen 8] Free-For-All: Different game type
		// [Gen 8] Inverse: Global effects
		// [Gen 8] Linked: Global effects
		// [Gen 8] The Loser's Game: Different win condition
		chimera1v1: {
			format: "[Gen 8] Chimera 1v1",
			weightTier: "OU",
			banReason: "(Technical Ban) Has teamwide effects.",
		},
		firstblood: {
			format: "[Gen 8] First Blood",
			weightTier: "OU",
			banReason: "(Technical Ban) Changes the win condition.",
		},
		godlygift: {
			format: "[Gen 8] Godly Gift",
			weightTier: "OU",
			banReason: "(Technical Ban) Has teamwide effects.",
		},
		inverse: {
			format: "[Gen 8] Inverse",
			weightTier: "OU",
			banReason: "(Technical Ban) Has global effects.",
		},
		linked: {
			format: "[Gen 8] Linked",
			weightTier: "OU",
			banReason: "(Technical Ban) Has global effects.",
		},
		thelosersgame: {
			format: "[Gen 8] The Loser's Game",
			weightTier: "OU",
			banReason: "(Technical Ban) Changes the win condition.",
		},
	};
	static determineSetMetaKey(set: PokemonSet): string | undefined {
		const setName = set.name;
		let metaKey = undefined;
		for (const mmKey in MixAndMeta.MixedMetaCollection) {
			const metaDatum = MixAndMeta.MixedMetaCollection[mmKey];

			// Try to ID meta by namespace
			if (metaDatum.namespace) {
				const suppliedNamespace = toID(setName.split(':')[0]);
				if (metaDatum.namespace === suppliedNamespace) {
					metaKey = mmKey;
					break;
				}
			}

			// Try to ID meta by checking if the name is a red flag
			if (metaDatum.isSetRedFlag) {
				if (metaDatum.isSetRedFlag(set)) {
					metaKey = mmKey;
					break;
				}
			}

			// Try to ID meta by matching name to format
			let setID = toID(setName);

			if (Dex.data.Aliases.hasOwnProperty(setID)) {
				setID = toID(Dex.data.Aliases[setID]);
			}

			if (!((setID === mmKey) || (setID === toID(metaDatum.format)))) continue;
			metaKey = mmKey;
		}

		return metaKey;
	}
	static getMetaFormat(pokemon: Pokemon): FormatData {
		if (!pokemon.meta) {
			const metaKey = MixAndMeta.determineSetMetaKey(pokemon.set);
			pokemon.meta = metaKey ? MixAndMeta.MixedMetaCollection[metaKey] : null;
		}

		const pokeFormat = pokemon.meta ? pokemon.meta.format : "[Gen 8] OU";
		return Dex.formats.get(pokeFormat) as FormatData;
	}
};