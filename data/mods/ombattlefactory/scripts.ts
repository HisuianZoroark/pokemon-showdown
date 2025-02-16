export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	start() {
		// eslint-disable-next-line max-len
		const om = Dex.formats.get(`gen9${this.toID(this.teamGenerator.factoryTier)}@@@${(this.format.customRules || []).join(',')}`);
		this.ruleTable = this.dex.formats.getRuleTable(om);
		if (this.teamGenerator.factoryTier === 'Partners in Crime') {
			// Transform tier into Doubles
			this.gameType = 'doubles';
			this.activePerHalf = 2;
			this.speedOrder = [];
			for (let i = 0; i < this.activePerHalf * 2; i++) {
				this.speedOrder.push(i);
			}
			for (const side of this.sides) {
				side.active = [null!, null!];
				for (let i = 0; i < side.active.length; i++) side.slotConditions[i] = {};
			}
		}
		for (const entry in om) {
			// @ts-ignore suuuuuuuuuper hacky
			if (typeof om[entry] === 'function') this.format[entry] = om[entry];
		}
		if (om.mod !== 'gen9') {
			// Ensures data from OMs gets carried here
			const moddedDex = Dex.dexes[om.mod];
			for (const i in moddedDex.data.Scripts) {
				const entry = moddedDex.data.Scripts[i];
				if (typeof entry === 'function') (this as any)[i] = entry;
			}
			for (const i in moddedDex.data.Moves) {
				(this as any)[i] = moddedDex.data.Moves[i];
			}
			for (const i in moddedDex.data.Abilities) {
				(this as any)[i] = moddedDex.data.Abilities[i];
			}
			for (const i in moddedDex.data.Items) {
				(this as any)[i] = moddedDex.data.Items[i];
			}
		}

		this.add('gametype', this.gameType);

		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			if (subFormat.exists) {
				const hasEventHandler = Object.keys(subFormat).some(
					// skip event handlers that are handled elsewhere
					val => val.startsWith('on') && ![
						'onBegin', 'onTeamPreview', 'onBattleStart', 'onValidateRule', 'onValidateTeam', 'onChangeSet', 'onValidateSet',
					].includes(val)
				);
				if (hasEventHandler) this.field.addPseudoWeather(rule);
			}
		}

		if (this.teamGenerator.factoryTier === 'Godly Gift') {
			// Reapplies Godly Gift Mod because it gets lost
			for (const side of this.sides) {
				for (const poke of side.pokemon) {
					poke.species = poke.setSpecies(this.dex.species.get(poke.species));
				}
			}
		}

		// Deserialized games should use restart()
		if (this.deserialized) return;
		// need all players to start
		if (!this.sides.every(side => !!side)) throw new Error(`Missing sides: ${this.sides}`);

		if (this.started) throw new Error(`Battle already started`);

		const format = this.format;
		this.started = true;
		if (this.gameType === 'multi') {
			this.sides[1].foe = this.sides[2]!;
			this.sides[0].foe = this.sides[3]!;
			this.sides[2]!.foe = this.sides[1];
			this.sides[3]!.foe = this.sides[0];
			this.sides[1].allySide = this.sides[3]!;
			this.sides[0].allySide = this.sides[2]!;
			this.sides[2]!.allySide = this.sides[0];
			this.sides[3]!.allySide = this.sides[1];
			// sync side conditions
			this.sides[2]!.sideConditions = this.sides[0].sideConditions;
			this.sides[3]!.sideConditions = this.sides[1].sideConditions;
		} else {
			this.sides[1].foe = this.sides[0];
			this.sides[0].foe = this.sides[1];
			if (this.sides.length > 2) { // ffa
				this.sides[2]!.foe = this.sides[3]!;
				this.sides[3]!.foe = this.sides[2]!;
			}
		}

		for (const side of this.sides) {
			this.add('teamsize', side.id, side.pokemon.length);
		}

		this.add('gen', this.gen);

		// Don't use onBegin as OMs override it
		this.add(`raw|<div class="broadcast-blue"><b>Battle Factory Tier: ${this.teamGenerator.factoryTier}</b></div>`);

		this.add('tier', format.name);
		if (this.rated) {
			if (this.rated === 'Rated battle') this.rated = true;
			this.add('rated', typeof this.rated === 'string' ? this.rated : '');
		}

		format.onBegin?.call(this);
		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			subFormat.onBegin?.call(this);
		}

		if (this.teamGenerator.factoryTier === 'Mix and Mega') {
			for (const pokemon of this.getAllPokemon()) {
				const item = pokemon.getItem();
				if (item.forcedForme && !item.zMove && item.forcedForme !== pokemon.species.name) {
					const rawSpecies = (this.actions as any).getMixedSpecies(pokemon.m.originalSpecies, item.forcedForme, pokemon);
					const species = pokemon.setSpecies(rawSpecies);
					if (!species) continue;
					pokemon.baseSpecies = rawSpecies;
					pokemon.details = pokemon.getUpdatedDetails();
					pokemon.ability = this.toID(species.abilities['0']);
					pokemon.baseAbility = pokemon.ability;
				}
			}
		}

		if (this.sides.some(side => !side.pokemon[0])) {
			throw new Error('Battle not started: A player has an empty team.');
		}

		if (this.debugMode) {
			this.checkEVBalance();
		}

		format.onTeamPreview?.call(this);
		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			subFormat.onTeamPreview?.call(this);
		}

		this.queue.addChoice({choice: 'start'});
		this.midTurn = true;
		if (!this.requestState) this.turnLoop();
	},
};
