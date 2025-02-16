export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	start() {
		this.gameType = this.randomChance(1, 2) ? 'doubles' : 'singles';
		this.add('gametype', this.gameType);
		this.activePerHalf = this.gameType === 'triples' ? 3 :
			(this.format.playerCount > 2 || this.gameType === 'doubles') ? 2 :
			1;
		this.speedOrder = [];
		for (let i = 0; i < this.activePerHalf * 2; i++) {
			this.speedOrder.push(i);
		}
		for (const side of this.sides) {
			switch (this.gameType) {
			case 'doubles':
				side.active = [null!, null!];
				break;
			case 'triples': case 'rotation':
				side.active = [null!, null!, null!];
				break;
			default:
				side.active = [null!];
			}
			for (let i = 0; i < side.active.length; i++) side.slotConditions[i] = {};
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
