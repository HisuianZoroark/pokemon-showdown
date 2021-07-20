export const Formats: FormatList = [

	// Official OM Mashups
	///////////////////////////////////////////////////////////////////
	{
		section: "Official OM Mashups (Singles)",
		column: 1,
	},
	{
		name: "[Gen 8] Almost Any Ability Ubers",
		desc: `Pok&eacute;mon can use almost any ability in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Almost Any Ability Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3676539/">Vanilla Ubers Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675564/">Vanilla Ubers Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675194/">Vanilla Ubers Viability Rankings</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Standard', 'Dynamax Clause', '2 Ability Clause', '!Obtainable Abilities',
		],
		banlist: [
			'AG', 'Calyrex-Shadow', 'Marshadow', 'Shedinja', 'Urshifu-Base', 'Arena Trap', 'Comatose', 'Contrary',
			'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out',
			'Intrepid Sword', 'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag',
			'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] CAAAmomons",
		desc: `Pok&eacute;mon can use almost any ability and will be the typing of their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] CAAAmomons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656413/">Vanilla Camomons</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'Camomons Rule', '2 Ability Clause', '!Obtainable Abilities',
		],
		banlist: [
			'Archeops', 'Blacephalon', 'Calyrex-Ice', 'Calyrex-Shadow', 'Cresselia', 'Dialga', 'Dracovish', 'Dragapult',
			'Dragonite', 'Eternatus', 'Genesect', 'Giratina', 'Groudon', 'Ho-Oh', 'Hydreigon', 'Kartana',
			'Kyogre', 'Kyurem', 'Landorus-Base', 'Latias', 'Latios', 'Lugia', 'Lunala', 'Marshadow',
			'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shedinja',
			'Slowking-Galar', 'Solgaleo', 'Spectrier', 'Urshifu', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta',
			'Zekrom', 'Zeraora', 'Zygarde-Base', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat',
			'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero',
			'Moody', 'Neutralizing Gas', 'Parental Bond', 'Poison Heal', 'Power Construct', 'Protean', 'Pure Power', 'Shadow Tag',
			'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] STAAABmons",
		desc: `Pok&eacute;mon can use almost any ability and any move of their typing. Teams: https://www.smogon.com/forums/threads/staaabmons.3680144/#post-8787305`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STAAABmons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656429/">Vanilla STABmons</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Standard', 'STABmons Move Legality', 'Dynamax Clause', '2 Ability Clause', 'Sleep Moves Clause', '!Obtainable Abilities', '!Sleep Clause Mod',
		],
		banlist: [
			'Archeops', 'Blacephalon', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chandelure', 'Dialga', 'Dragapult', 'Eternatus',
			'Genesect', 'Giratina', 'Groudon', 'Ho-Oh', 'Kartana', 'Keldeo', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Latios', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Melmetal',
			'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas',
			'Reshiram', 'Shedinja', 'Silvally', 'Solgaleo', 'Spectrier', 'Tapu Koko', 'Terrakion', 'Thundurus',
			'Urshifu-Base', 'Volcarona', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom', 'Zeraora',
			'Zygarde-Base', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power',
			'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Moody', 'Neutralizing Gas',
			'Parental Bond', 'Poison Heal', 'Power Construct', 'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost',
			'Stakeout', 'Tinted Lens', 'Water Bubble', 'Wonder Guard', 'King\'s Rock', 'Baton Pass', 'Electrify',
		],
		unbanlist: [
			'Precipice Blades',
		],
		restricted: [
			'Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Clangorous Soul', 'Double Iron Bash', 'Dragon Ascent', 'Extreme Speed',
			'Fishious Rend', 'Geomancy', 'Glacial Lance', 'Lovely Kiss', 'No Retreat', 'Oblivion Wing', 'Shell Smash', 'Shift Gear',
			'Spore', 'Thousand Arrows', 'Transform', 'V-create', 'Wicked Blow',
		],
	},
	{
		name: "[Gen 8] STABmons Ubers",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3676539/">Vanilla Ubers Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675564/">Vanilla Ubers Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675194/">Vanilla Ubers Viability Rankings</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Standard', 'Dynamax Clause', 'STABmons Move Legality',
		],
		banlist: [
			'AG', 'Calyrex-Shadow', 'Shadow Tag', 'King\'s Rock', 'Baton Pass',
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Bolt Beak', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Fishious Rend', 'Geomancy',
			'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', 'V-create', 'Wicked Blow',
		],
	},
	{
		name: "[Gen 8] STABmons Mix and Mega",
		desc: `Pok&eacute;mon can use any move of their typing and mega evolve with any stone to gain the respective boosts.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Mix and Mega Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">Vanilla M&amp;M Resources</a>`
		],

		mod: 'mixandmega',
		ruleset: [
			'Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Overflow Stat Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'Mix and Mega Standard Package', 'STABmons Move Legality',
		],
		banlist: [
			'Calyrex-Shadow', 'Kyogre', 'Zacian', 'Moody', 'Shadow Tag', 'Beedrillite', 'Blazikenite', 'Gengarite',
			'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Baton Pass', 'Electrify',
		],
		restricted: [
			'Calyrex-Ice', 'Dialga', 'Dragapult', 'Dragonite', 'Eternatus', 'Genesect', 'Gengar', 'Giratina',
			'Groudon', 'Ho-Oh', 'Kartana', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala',
			'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza',
			'Regigigas', 'Reshiram', 'Spectrier', 'Tapu Koko', 'Urshifu', 'Xerneas', 'Yveltal', 'Zekrom',
			'Zygarde-Base', 'Zygarde-Complete', 'Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Boomburst', 'Clangorous Soul',
			'Double Iron Bash', 'Extreme Speed', 'Fishious Rend', 'Geomancy', 'Glacial Lance', 'Lovely Kiss', 'Precipice Blades', 'Shell Smash',
			'Shift Gear', 'Sleep Powder', 'Spore', 'Thousand Arrows', 'Transform', 'V-create', 'Wicked Blow',
		],
	},
	{
		name: "[Gen 8] Tier Shift AAA",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users. Those below OU get all their stats, excluding HP, boosted. UU/RUBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Tier Shift AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3662165/">Vanilla Tier Shift</a>`
		],

		mod: 'gen8',
		ruleset: [
			'[Gen 8] OU', 'Overflow Stat Mod', 'Tier Shift Rule', '2 Ability Clause', '!Obtainable Abilities',
		],
		banlist: [
			'Absol', 'Archeops', 'Arctovish', 'Bellossom', 'Guzzlord', 'Regigigas', 'Shedinja', 'Comatose',
			'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter',
			'Innards Out', 'Intrepid Sword', 'Libero', 'Neutralizing Gas', 'Parental Bond', 'Poison Heal', 'Protean', 'Pure Power',
			'Simple', 'Speed Boost', 'Stakeout', 'Tinted Lens', 'Water Bubble', 'Wonder Guard', 'Damp Rock', 'Eviolite',
			'Heat Rock', 'Light Ball',
		],
		unbanlist: [
			'Cinderace', 'Darmanitan-Galar', 'Dracovish', 'Genesect', 'Landorus-Base', 'Magearna', 'Spectrier', 'Zamazenta-Crowned',
		],
	},
	{
		section: "Official OM Mashups (Doubles)",
		column: 1,
	},
	{
		name: "[Gen 8] Almost Any Ability Doubles",
		desc: `Pok&eacute;mon can use almost any ability in a Doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Almost Any Ability Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3684554/">Vanilla Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658826/">Vanilla Doubles OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673519/">Vanilla Doubles OU Viability Rankings</a>`
		],

		mod: 'gen8',
		gameType: 'doubles',
		ruleset: [
			'Standard Doubles', 'Dynamax Clause', 'Swagger Clause', '2 Ability Clause', '!Obtainable Abilities',
		],
		banlist: [
			'DUber', 'Kartana', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Urshifu-Rapid-Strike', 'Zygarde-Base', 'Anger Point',
			'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales',
			'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond',
			'Power Construct', 'Protean', 'Pure Power', 'Rattled', 'Serene Grace', 'Shadow Tag', 'Simple', 'Soul-Heart',
			'Speed Boost', 'Stakeout', 'Steam Engine', 'Water Bubble', 'Wonder Guard', 'Weakness Policy', 'Beat Up', 'Stored Power',
		],
	},
	{
		name: "[Gen 8] Balanced Hackmons Doubles",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Balanced Hackmons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661142/">Vanilla Doubles Ubers</a>`
		],

		mod: 'gen8',
		gameType: 'doubles',
		ruleset: [
			'Standard Doubles', 'Forme Clause', '!Gravity Sleep Clause', '!Obtainable Abilities', '!Obtainable Moves', '!Obtainable Misc', '!Species Clause',
		],
		banlist: [
			'Comatose + Sleep Talk', 'Shedinja', 'Anger Point', 'Arena Trap', 'Contrary', 'Gorilla Tactics', 'Huge Power', 'Illusion',
			'Innards Out', 'Justified', 'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power',
			'Rattled', 'Shadow Tag', 'Soul-Heart', 'Stakeout', 'Stamina', 'Steam Engine', 'Wandering Spirit', 'Water Bubble',
			'Wonder Guard', 'Double Iron Bash', 'Octolock',
		],
	},
	{
		name: "[Gen 8] Camomons Doubles",
		desc: `Pok&eacute;mon change type to match their first two moves in a Doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Camomons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3684554/">Vanilla Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658826/">Vanilla Doubles OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673519/">Vanilla Doubles OU Viability Rankings</a>`
		],

		mod: 'gen8',
		gameType: 'doubles',
		ruleset: [
			'Standard Doubles', 'Dynamax Clause', 'Swagger Clause', 'Sleep Clause Mod', 'Camomons Rule',
		],
		banlist: [
			'DUber', 'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Dracovish', 'Dragonite', 'Eternatus', 'Genesect',
			'Giratina', 'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base',
			'Latias', 'Latios', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Rayquaza', 'Reshiram', 'Shedinja', 'Slowking-Galar', 'Solgaleo', 'Xerneas', 'Yveltal',
			'Zacian', 'Zamazenta', 'Zekrom', 'Zygarde-Base', 'Moody', 'Power Construct', 'Shadow Tag', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] STABmons Doubles",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3684554/">Vanilla Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658826/">Vanilla Doubles OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673519/">Vanilla Doubles OU Viability Rankings</a>`
		],

		mod: 'gen8',
		gameType: 'doubles',
		ruleset: [
			'Standard Doubles', 'Dynamax Clause', 'Swagger Clause', 'STABmons Move Legality',
		],
		banlist: [
			'DUber', 'Blissey', 'Chansey', 'Shedinja', 'Silvally', 'Snorlax', 'Power Construct', 'Shadow Tag',
			'Swift Swim',
		],
		restricted: [
			'Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Decorate', 'Diamond Storm', 'Double Iron Bash', 'Fishious Rend',
			'Geomancy', 'Glacial Lance', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows',
		],
	},
	{
		section: "Official OM Mashups (Little Cup)",
		column: 1,
	},
	{
		name: "[Gen 8] Almost Any Ability Little Cup",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in a Little Cup environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Almost Any Ability Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Little Cup', 'Standard', 'Dynamax Clause', '!Obtainable Abilities',
		],
		banlist: [
			'Corsola-Galar', 'Cutiefly', 'Drifloon', 'Gastly', 'Rufflet', 'Scyther', 'Sneasel', 'Swirlix',
			'Tangela', 'Vulpix-Alola', 'Arena Trap', 'Chlorophyll', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat',
			'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero',
			'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost',
			'Stakeout', 'Water Bubble', 'Wonder Guard', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] Balanced Hackmons Little Cup",
		desc: `Pok&eacute;mon can use anything that can be hacked in-game and is usable in local battles is allowed in a Little Cup environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Balanced Hackmons Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Little Cup', 'Standard', 'Dynamax Clause', '!Obtainable',
		],
		banlist: [
			'Comatose + Sleep Talk', 'Nonexistent', 'Past', 'Scyther', 'Sneasel', 'Type: Null', 'Arena Trap', 'Contrary',
			'Gorilla Tactics', 'Huge Power', 'Illusion', 'Innards Out', 'Intrepid Sword', 'Libero', 'Magnet Pull', 'Moody',
			'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'Baton Pass', 'Bolt Beak', 'Double Iron Bash', 'Shell Smash',
		],
		unbanlist: [
			'Chlorophyll',
		],
	},
	{
		name: "[Gen 8] Camomons Little Cup",
		desc: `Pok&eacute;mon change type to match their first two moves in a Little Cup environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Camomons Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Little Cup', 'Standard', 'Dynamax Clause', 'Camomons Rule',
		],
		banlist: [
			'Calyrex-Ice', 'Calyrex-Shadow', 'Corsola-Galar', 'Cutiefly', 'Darmanitan-Galar', 'Dialga', 'Dracovish', 'Dragonite',
			'Drifloon', 'Eternatus', 'Gastly', 'Genesect', 'Giratina', 'Gothita', 'Groudon', 'Ho-Oh',
			'Hydreigon', 'Kartana', 'Kyogre', 'Kyurem', 'Landorus-Base', 'Latias', 'Latios', 'Lugia',
			'Lunala', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Reshiram',
			'Rufflet', 'Scyther', 'Shedinja', 'Slowking-Galar', 'Sneasel', 'Solgaleo', 'Swirlix', 'Tangela',
			'Vulpix-Alola', 'Woobat', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom', 'Zeraora',
			'Zygarde-Base', 'Chlorophyll', 'Moody', 'Power Construct', 'Baton Pass',
		],
	},
	{
		name: "[Gen 8] STABmons Little Cup",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Little Cup environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
		],

		mod: 'gen8',
		ruleset: [
			'Little Cup', 'Standard', 'Dynamax Clause', 'STABmons Move Legality',
		],
		banlist: [
			'Corsola-Galar', 'Cutiefly', 'Drifloon', 'Gastly', 'Gothita', 'Porygon', 'Rufflet', 'Scyther',
			'Sneasel', 'Swirlix', 'Tangela', 'Vulpix-Alola', 'Woobat', 'Chlorophyll', 'Moody', 'Baton Pass',
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Bolt Beak', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Fishious Rend', 'Geomancy',
			'Glacial Lance', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', 'V-create', 'Wicked Blow',
		],
	},
];
