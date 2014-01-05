(function () {
    // returns int[2][4][16], where D1 is pokemon, D2 is move, D3 is possible damage values
    function getDamageResults(p1, p2, field) {
        checkAirLock(p1, field);
        checkAirLock(p2, field);
        checkForecast(p1, field.getWeather());
        checkForecast(p2, field.getWeather());
        checkKlutz(p1);
        checkKlutz(p2);
        p1.stats[Calc.DF] = getModifiedStat(p1.rawStats[Calc.DF], p1.boosts[Calc.DF]);
        p1.stats[Calc.SD] = getModifiedStat(p1.rawStats[Calc.SD], p1.boosts[Calc.SD]);
        p1.stats[Calc.SP] = getFinalSpeed(p1, field.getWeather());
        p2.stats[Calc.DF] = getModifiedStat(p2.rawStats[Calc.DF], p2.boosts[Calc.DF]);
        p2.stats[Calc.SD] = getModifiedStat(p2.rawStats[Calc.SD], p2.boosts[Calc.SD]);
        p2.stats[Calc.SP] = getFinalSpeed(p2, field.getWeather());
        checkIntimidate(p1, p2);
        checkIntimidate(p2, p1);
        checkDownload(p1, p2);
        checkDownload(p2, p1);
        p1.stats[Calc.AT] = getModifiedStat(p1.rawStats[Calc.AT], p1.boosts[Calc.AT]);
        p1.stats[Calc.SA] = getModifiedStat(p1.rawStats[Calc.SA], p1.boosts[Calc.SA]);
        p2.stats[Calc.AT] = getModifiedStat(p2.rawStats[Calc.AT], p2.boosts[Calc.AT]);
        p2.stats[Calc.SA] = getModifiedStat(p2.rawStats[Calc.SA], p2.boosts[Calc.SA]);
        var side1 = field.getSide(1);
        var side2 = field.getSide(0);
        checkInfiltrator(p1, side2);
        checkInfiltrator(p2, side1);
        var results = [[],[]];
        for (var i = 0; i < 4; i++) {
            results[0][i] = getDamageResult(p1, p2, p1.moves[i], side1);
            results[1][i] = getDamageResult(p2, p1, p2.moves[i], side2);
        }
        return results;
    }

    Calc.getDamageResults = getDamageResults;

    function getDamageResult(attacker, defender, move, field) {
        var description = {
            "attackerName": attacker.name,
            "moveName": move.name,
            "defenderName": defender.name
        };

        var EMPTY_RESULT = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
        if (move.bp === 0) {
            return {"damage":EMPTY_RESULT, "description":buildDescription(description)};
        }

        var defAbility = defender.ability;
        if (['Mold Breaker', 'Teravolt', 'Turboblaze'].indexOf(attacker.ability) !== -1) {
            defAbility = '';
            description.attackerAbility = attacker.ability;
        }

        var isCritical = move.isCrit && ['Battle Armor', 'Shell Armor'].indexOf(defAbility) === -1;

        if (move.name === 'Weather Ball') {
            move.type = field.weather === 'Sun' ? 'Fire'
                    : field.weather === 'Rain' ? 'Water'
                    : field.weather === 'Sand' ? 'Rock'
                    : field.weather === 'Hail' ? 'Ice'
                    : 'Normal';
            description.weather = field.weather;
            description.moveType = move.type;
        } else if (move.name === 'Judgment' && attacker.item.indexOf('Plate') !== -1) {
            move.type = Calc.getItemBoostType(attacker.item);
        } else if (move.name === 'Natural Gift' && attacker.item.indexOf('Berry') !== -1) {
            var gift = Calc.getNaturalGift(attacker.item);
            move.type = gift.t;
            move.bp = gift.p;
            description.attackerItem = attacker.item;
            description.moveBP = move.bp;
            description.moveType = move.type;
        }

        var isAerilate = attacker.ability === 'Aerilate' && move.type === 'Normal';
        var isPixilate = attacker.ability === 'Pixilate' && move.type === 'Normal';
        var isRefrigerate = attacker.ability === 'Refrigerate' && move.type === 'Normal';
        if (isAerilate) {
            move.type = 'Flying';
        } else if (isPixilate) {
            move.type = 'Fairy';
        } else if (isRefrigerate) {
            move.type = 'Ice';
        } else if (attacker.ability === 'Normalize') {
            move.type = 'Normal';
            description.attackerAbility = attacker.ability;
        }

        var typeEffectiveness = getMoveEffectiveness(move, defender.type1, attacker.ability === 'Scrappy' || field.isForesight, field.isGravity) *
                    getMoveEffectiveness(move, defender.type2, attacker.ability === 'Scrappy' || field.isForesight, field.isGravity);

        if (typeEffectiveness === 0) {
            return {"damage":EMPTY_RESULT, "description":buildDescription(description)};
        }
        if ((defAbility === 'Wonder Guard' && typeEffectiveness <= 1) ||
                (move.type === 'Grass' && defAbility === 'Sap Sipper') ||
                (move.type === 'Fire' && defAbility === 'Flash Fire') ||
                (move.type === 'Water' && ['Dry Skin', 'Storm Drain', 'Water Absorb'].indexOf(defAbility) !== -1) ||
                (move.type === 'Electric' && ['Lightning Rod', 'Motor Drive', 'Volt Absorb'].indexOf(defAbility) !== -1) ||
                (move.type === 'Ground' && !field.isGravity && defAbility === 'Levitate') ||
                (Calc.isBulletMove(move.name) && defAbility === 'Bulletproof') ||
                (Calc.isSoundMove(move.name) && defAbility === 'Soundproof')) {
            description.defenderAbility = defAbility;
            return {"damage":EMPTY_RESULT, "description":buildDescription(description)};
        }
        if (move.type === 'Ground' && !field.isGravity && defender.item === 'Air Balloon') {
            description.defenderItem = defender.item;
            return {"damage":EMPTY_RESULT, "description":buildDescription(description)};
        }

        description.HPEVs = defender.HPEVs + ' HP';

        if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
            var lv = attacker.level;
            if (attacker.ability === 'Parental Bond') {
                lv *= 2;
            }
            return {"damage":[lv,lv,lv,lv, lv,lv,lv,lv, lv,lv,lv,lv, lv,lv,lv,lv], "description":buildDescription(description)};
        }

        if (move.hits > 1) {
            description.hits = move.hits;
        }
        var turnOrder = attacker.stats[Calc.SP] > defender.stats[Calc.SP] ? 'FIRST' : 'LAST';

        ////////////////////////////////
        ////////// BASE POWER //////////
        ////////////////////////////////
        var basePower;
        switch (move.name) {
            case 'Payback':
                basePower = turnOrder === 'LAST' ? 100 : 50;
                description.moveBP = basePower;
                break;
            case 'Electro Ball':
                var r = Math.floor(attacker.stats[Calc.SP] / defender.stats[Calc.SP]);
                basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : 60;
                description.moveBP = basePower;
                break;
            case 'Gyro Ball':
                basePower = Math.min(150, Math.floor(25 * defender.stats[Calc.SP] / attacker.stats[Calc.SP]));
                description.moveBP = basePower;
                break;
            case 'Punishment':
                basePower = Math.min(200, 60 + 20 * countBoosts(defender.boosts));
                description.moveBP = basePower;
                break;
            case 'Low Kick':
            case 'Grass Knot':
                var w = defender.weight;
                basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
                description.moveBP = basePower;
                break;
            case 'Hex':
                basePower = defender.status !== 'Healthy' ? 130 : 65;
                description.moveBP = basePower;
                break;
            case 'Heavy Slam':
            case 'Heat Crash':
                var wr = attacker.weight / defender.weight;
                basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
                description.moveBP = basePower;
                break;
            case 'Stored Power':
                basePower = 20 + 20 * countBoosts(attacker.boosts);
                description.moveBP = basePower;
                break;
            case 'Acrobatics':
                basePower = attacker.item === 'Flying Gem' || attacker.item === '' ? 110 : 55;
                description.moveBP = basePower;
                break;
            case 'Wake-Up Slap':
                basePower = defender.status === 'Asleep' ? 140 : 70;
                description.moveBP = basePower;
                break;
            case 'Weather Ball':
                basePower = field.weather !== '' ? 100 : 50;
                description.moveBP = basePower;
                break;
            case 'Fling':
                basePower = Calc.getFlingPower(attacker.item);
                description.moveBP = basePower;
                description.attackerItem = attacker.item;
                break;
            case 'Eruption':
            case 'Water Spout':
                basePower = Math.max(1, Math.floor(150 * attacker.curHP / attacker.maxHP));
                description.moveBP = basePower;
                break;
            case 'Flail':
            case 'Reversal':
                var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
                basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
                description.moveBP = basePower;
                break;
            default:
                basePower = move.bp;
        }

        var bpMods = [];
        if ((attacker.ability === 'Technician' && basePower <= 60) ||
                (attacker.ability === 'Flare Boost' && attacker.status === 'Burned' && move.category === 'Special') ||
                (attacker.ability === 'Toxic Boost' && (attacker.status === 'Poisoned' || attacker.status === 'Badly Poisoned') &&
                        move.category === 'Physical')) {
            bpMods.push(0x1800);
            description.attackerAbility = attacker.ability;
        } else if (attacker.ability === 'Analytic' && turnOrder !== 'FIRST') {
            bpMods.push(0x14CD);
            description.attackerAbility = attacker.ability;
        } else if (attacker.ability === 'Sand Force' && field.weather === 'Sand' && ['Rock','Ground','Steel'].indexOf(move.type) !== -1) {
            bpMods.push(0x14CD);
            description.attackerAbility = attacker.ability;
            description.weather = field.weather;
        } else if ((attacker.ability === 'Reckless' && Calc.isRecoilMove(move.name)) ||
                (attacker.ability === 'Iron Fist' && Calc.isPunchMove(move.name))) {
            bpMods.push(0x1333);
            description.attackerAbility = attacker.ability;
        }

        if (defAbility === 'Heatproof' && move.type === 'Fire') {
            bpMods.push(0x800);
            description.defenderAbility = defAbility;
        } else if (defAbility === 'Dry Skin' && move.type === 'Fire') {
            bpMods.push(0x1400);
            description.defenderAbility = defAbility;
        }

        if (attacker.ability === 'Sheer Force' && Calc.isSheerForceMove(move.name)) {
            bpMods.push(0x14CD);
            description.attackerAbility = attacker.ability;
        }

        if (Calc.getItemBoostType(attacker.item) === move.type) {
            bpMods.push(0x1333);
            description.attackerItem = attacker.item;
        } else if ((attacker.item === 'Muscle Band' && move.category === 'Physical') ||
                (attacker.item === 'Wise Glasses' && move.category === 'Special')) {
            bpMods.push(0x1199);
            description.attackerItem = attacker.item;
        } else if (((attacker.item === 'Adamant Orb' && attacker.name === 'Dialga') ||
                (attacker.item === 'Lustrous Orb' && attacker.name === 'Palkia') ||
                (attacker.item === 'Griseous Orb' && attacker.name === 'Giratina-O')) &&
                (move.type === attacker.type1 || move.type === attacker.type2)) {
            bpMods.push(0x1333);
            description.attackerItem = attacker.item;
        } else if (attacker.item === move.type + " Gem") {
            bpMods.push(0x14CD);
            description.attackerItem = attacker.item;
        }

        if ((move.name === 'Facade' && ['Burned','Paralyzed','Poisoned','Badly Poisoned'].indexOf(attacker.status) !== -1) ||
                (move.name === 'Brine' && defender.curHP <= defender.maxHP / 2) ||
                (move.name === 'Venoshock' && (defender.status === 'Poisoned' || defender.status === 'Badly Poisoned'))) {
            bpMods.push(0x2000);
            description.moveBP = move.bp * 2;
        } else if (move.name === 'Solar Beam' && ['Rain Dance','Sandstorm','Hail'].indexOf(field.weather) !== -1) {
            bpMods.push(0x800);
            description.moveBP = move.bp / 2;
            description.weather = field.weather;
        } else if (move.name === 'Knock Off' && !(defender.item === '' ||
                (defender.name === 'Giratina-O' && defender.item === 'Griseous Orb') ||
                (defender.name.indexOf('Arceus') !== -1 && defender.item.indexOf('Plate') !== -1))) {
            bpMods.push(0x1800);
            description.moveBP = move.bp * 1.5;
        }

        if (field.isHelpingHand) {
            bpMods.push(0x1800);
            description.isHelpingHand = true;
        }

        if (isAerilate || isPixilate || isRefrigerate || (attacker.ability === 'Tough Claws' && Calc.isContactMove(move))) {
            bpMods.push(0x14CD);
            description.attackerAbility = attacker.ability;
        } else if ((attacker.ability === 'Mega Launcher' && Calc.isPulseMove(move.name)) ||
                (attacker.ability === 'Strong Jaw' && Calc.isBiteMove(move.name))) {
            bpMods.push(0x1800);
            description.attackerAbility = attacker.ability;
        }

        if ((attacker.ability === 'Dark Aura' && move.type === 'Dark') ||
                (attacker.ability === 'Fairy Aura' && move.type === 'Fairy')) {
            if (defAbility === 'Aura Break') {
                bpMods.push(0xAAA);
                description.defenderAbility = defAbility;
            } else {
                bpMods.push(0x1555);
            }
            description.attackerAbility = attacker.ability;
        }
        if ((defAbility === 'Dark Aura' && move.type === 'Dark') ||
                (defAbility === 'Fairy Aura' && move.type === 'Fairy')) {
            if (attacker.ability === 'Aura Break') {
                bpMods.push(0xAAA);
                description.attackerAbility = attacker.ability;
            } else {
                bpMods.push(0x1555);
            }
            description.defenderAbility = defAbility;
        }

        basePower = Math.max(1, pokeRound(basePower * chainMods(bpMods) / 0x1000));

        ////////////////////////////////
        ////////// (SP)ATTACK //////////
        ////////////////////////////////
        var attack;
        var attackSource = move.name === 'Foul Play' ? defender : attacker;
        var attackStat = move.category === 'Physical' ? Calc.AT : Calc.SA;
        description.attackEVs = attacker.evs[attackStat] +
                (Calc.NATURES[attacker.nature][0] === attackStat ? '+' : Calc.NATURES[attacker.nature][1] === attackStat ? '-' : '') + ' ' +
                toPOStat(attackStat);
        if (attackSource.boosts[attackStat] === 0 || (isCritical && attackSource.boosts[attackStat] < 0)) {
            attack = attackSource.rawStats[attackStat];
        } else if (defAbility === 'Unaware') {
            attack = attackSource.rawStats[attackStat];
            description.defenderAbility = defAbility;
        } else {
            attack = attackSource.stats[attackStat];
            description.attackBoost = attackSource.boosts[attackStat];
        }

        // unlike all other attack modifiers, Hustle gets applied directly
        if (attacker.ability === 'Hustle' && move.category === 'Physical') {
            attack = pokeRound(attack * 3/2);
            description.attackerAbility = attacker.ability;
        }

        var atMods = [];
        if (defAbility === 'Thick Fat' && (move.type === 'Fire' || move.type === 'Ice')) {
            atMods.push(0x800);
            description.defenderAbility = defAbility;
        }

        if ((attacker.ability === 'Guts' && attacker.status !== 'Healthy' && move.category === 'Physical') ||
                (attacker.ability === 'Overgrow' && attacker.curHP <= attacker.maxHP / 3 && move.type === 'Grass') ||
                (attacker.ability === 'Blaze' && attacker.curHP <= attacker.maxHP / 3 && move.type === 'Fire') ||
                (attacker.ability === 'Torrent' && attacker.curHP <= attacker.maxHP / 3 && move.type === 'Water') ||
                (attacker.ability === 'Swarm' && attacker.curHP <= attacker.maxHP / 3 && move.type === 'Bug') ||
                (attacker.ability === 'Flash Fire' && move.type === 'Fire')) {
            atMods.push(0x1800);
            description.attackerAbility = attacker.ability;
        } else if ((attacker.ability === 'Solar Power' && field.weather === 'Sun' && move.category === 'Special') ||
                (attacker.ability === 'Flower Gift' && field.weather === 'Sun' && move.category === 'Physical')) {
            atMods.push(0x1800);
            description.attackerAbility = attacker.ability;
            description.weather = field.weather;
        } else if ((attacker.ability === 'Defeatist' && attacker.curHP <= attacker.maxHP / 3) ||
                (attacker.ability === 'Slow Start' && move.category === 'Physical')) {
            atMods.push(0x800);
            description.attackerAbility = attacker.ability;
        } else if ((attacker.ability === 'Huge Power' || attacker.ability === 'Pure Power') && move.category === 'Physical') {
            atMods.push(0x2000);
            description.attackerAbility = attacker.ability;
        }

        if ((attacker.item === 'Thick Club' && (attacker.name === 'Cubone' || attacker.name === 'Marowak') && move.category === 'Physical') ||
                (attacker.item === 'Deep Sea Tooth' && attacker.name === 'Clamperl' && move.category === 'Special') ||
                (attacker.item === 'Light Ball' && attacker.name === 'Pikachu')) {
            atMods.push(0x2000);
            description.attackerItem = attacker.item;
        } else if ((attacker.item === 'Soul Dew' && (attacker.name === 'Latios' || attacker.name === 'Latias') && move.category === 'Special') ||
                (attacker.item === 'Choice Band' && move.category === 'Physical') ||
                (attacker.item === 'Choice Specs' && move.category === 'Special')) {
            atMods.push(0x1800);
            description.attackerItem = attacker.item;
        }

        attack = Math.max(1, pokeRound(attack * chainMods(atMods) / 0x1000));

        ////////////////////////////////
        ///////// (SP)DEFENSE //////////
        ////////////////////////////////
        var defense;
        var hitsPhysical = dealsPhysicalDamage(move);
        var defenseStat = hitsPhysical ? Calc.DF : Calc.SD;
        description.defenseEVs = defender.evs[defenseStat] +
                (Calc.NATURES[defender.nature][0] === defenseStat ? '+' : Calc.NATURES[defender.nature][1] === defenseStat ? '-' : '') + ' ' +
                toPOStat(defenseStat);
        if (defender.boosts[defenseStat] === 0 || (isCritical && defender.boosts[defenseStat] > 0) || move.name === 'Sacred Sword') {
            defense = defender.rawStats[defenseStat];
        } else if (attacker.ability === 'Unaware') {
            defense = defender.rawStats[defenseStat];
            description.attackerAbility = attacker.ability;
        } else {
            defense = defender.stats[defenseStat];
            description.defenseBoost = defender.boosts[defenseStat];
        }

        // unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
        if (field.weather === 'Sand' && (defender.type1 === 'Rock' || defender.type2 === 'Rock') && !hitsPhysical) {
            defense = pokeRound(defense * 3/2);
            description.weather = field.weather;
        }

        var dfMods = [];
        if (defAbility === 'Marvel Scale' && defender.status !== 'Healthy' && hitsPhysical) {
            dfMods.push(0x1800);
            description.defenderAbility = defAbility;
        } else if (defAbility === 'Flower Gift' && field.weather === 'Sun' && !hitsPhysical) {
            dfMods.push(0x1800);
            description.defenderAbility = defAbility;
            description.weather = field.weather;
        }

        if ((defender.item === 'Deep Sea Scale' && defender.name === 'Clamperl' && !hitsPhysical) ||
                (defender.item === 'Metal Powder' && defender.name === 'Ditto') ||
                (defender.item === 'Soul Dew' && (defender.name === 'Latios' || defender.name === 'Latias') && !hitsPhysical) ||
                (defender.item === 'Assault Vest' && !hitsPhysical) || defender.item === 'Eviolite') {
            dfMods.push(0x1800);
            description.defenderItem = defender.item;
        }

        defense = Math.max(1, pokeRound(defense * chainMods(dfMods) / 0x1000));

        ////////////////////////////////
        //////////// DAMAGE ////////////
        ////////////////////////////////
        var baseDamage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / defense) / 50 + 2);
        if (field.format !== 'Singles' && Calc.isSpreadMove(move.name)) {
            baseDamage = pokeRound(baseDamage * 0xC00 / 0x1000);
        }
        if ((field.weather === 'Sun' && move.type === 'Fire') || (field.weather === 'Rain' && move.type === 'Water')) {
            baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
            description.weather = field.weather;
        } else if ((field.weather === 'Sun' && move.type === 'Water') || (field.weather === 'Rain' && move.type === 'Fire')) {
            baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
            description.weather = field.weather;
        }
        if (isCritical) {
            baseDamage = Math.floor(baseDamage * 1.5);
            description.isCritical = isCritical;
        }
        // the random factor is applied between the crit mod and the stab mod, so don't apply anything below this until we're inside the loop
        var stabMod = 0x1000;
        if (move.type === attacker.type1 || move.type === attacker.type2) {
            if (attacker.ability === 'Adaptability') {
                stabMod = 0x2000;
                description.attackerAbility = attacker.ability;
            } else {
                stabMod = 0x1800;
            }
        } else if (attacker.ability === 'Protean') {
            stabMod = 0x1800;
            description.attackerAbility = attacker.ability;
        }
        var applyBurn = (attacker.status === 'Burned' && move.category === 'Physical' && move.name !== 'Facade' && attacker.ability !== 'Guts');
        description.isBurned = applyBurn;
        var finalMods = [];
        if (field.isReflect && move.category === 'Physical' && !isCritical) {
            finalMods.push(field.format !== 'Singles' ? 0xA8F : 0x800);
            description.isReflect = true;
        } else if (field.isLightScreen && move.category === 'Special' && !isCritical) {
            finalMods.push(field.format !== 'Singles' ? 0xA8F : 0x800);
            description.isLightScreen = true;
        }
        if (defAbility === 'Multiscale' && defender.curHP === defender.maxHP) {
            finalMods.push(0x800);
            description.defenderAbility = defAbility;
        }
        if (attacker.ability === 'Tinted Lens' && typeEffectiveness < 1) {
            finalMods.push(0x2000);
            description.attackerAbility = attacker.ability;
        } else if (attacker.ability === 'Sniper' && isCritical) {
            finalMods.push(0x1800);
            description.attackerAbility = attacker.ability;
        }
        if ((defAbility === 'Solid Rock' || defAbility === 'Filter') && typeEffectiveness > 1) {
            finalMods.push(0xC00);
            description.defenderAbility = defAbility;
        }
        if (attacker.item === 'Expert Belt' && typeEffectiveness > 1) {
            finalMods.push(0x1333);
            description.attackerItem = attacker.item;
        } else if (attacker.item === 'Life Orb') {
            finalMods.push(0x14CC);
            description.attackerItem = attacker.item;
        }
        if (Calc.getBerryResistType(defender.item) === move.type && (typeEffectiveness > 1 || move.type === 'Normal') &&
                attacker.ability !== 'Unnerve') {
            finalMods.push(0x800);
            description.defenderItem = defender.item;
        }
        if (defAbility === 'Fur Coat' && hitsPhysical) {
            finalMods.push(0x800);
            description.defenderAbility = defAbility;
        }
        var finalMod = chainMods(finalMods);

        var damage = [];
        for (var i = 0; i < 16; i++) {
            damage[i] = Math.floor(baseDamage * (85 + i) / 100);
            damage[i] = pokeRound(damage[i] * stabMod / 0x1000);
            damage[i] = Math.floor(damage[i] * typeEffectiveness);
            if (applyBurn) {
                damage[i] = Math.floor(damage[i] / 2);
            }
            damage[i] = Math.max(1, damage[i]);
            damage[i] = pokeRound(damage[i] * finalMod / 0x1000);
            if (attacker.ability === 'Parental Bond' && move.hits === 1) {
                damage[i] = Math.floor(damage[i] * 3/2);
                description.attackerAbility = attacker.ability;
            }
        }
        //console.log(move.name + " -- BP: " + basePower + ", AT: " + attack + ", DF: " + defense + ", DAMAGE: " + damage);
        return {"damage":damage, "description":buildDescription(description)};
    }

    Calc.getDamageResult = getDamageResult;

    function buildDescription(description) {
        var output = "";
        if (description.attackBoost) {
            if (description.attackBoost > 0) {
                output += "+";
            }
            output += description.attackBoost + " ";
        }
        output = appendIfSet(output, description.attackEVs);
        output = appendIfSet(output, description.attackerItem);
        output = appendIfSet(output, description.attackerAbility);
        if (description.isBurned) {
            output += "burned ";
        }
        output += description.attackerName + " ";
        if (description.isHelpingHand) {
            output += "Helping Hand ";
        }
        output += description.moveName + " ";
        if (description.moveBP && description.moveType) {
            output += "(" + description.moveBP + " BP " + description.moveType + ") ";
        } else if (description.moveBP) {
            output += "(" + description.moveBP + " BP) ";
        } else if (description.moveType) {
            output += "(" + description.moveType + ") ";
        }
        if (description.hits) {
            output += "(" + description.hits + " hits) ";
        }
        output += "vs. ";
        if (description.defenseBoost) {
            if (description.defenseBoost > 0) {
                output += "+";
            }
            output += description.defenseBoost + " ";
        }
        output = appendIfSet(output, description.HPEVs);
        if (description.defenseEVs) {
            output += " / " + description.defenseEVs + " ";
        }
        output = appendIfSet(output, description.defenderItem);
        output = appendIfSet(output, description.defenderAbility);
        output += description.defenderName;
        if (description.weather) {
            output += " in " + description.weather;
        }
        if (description.isReflect) {
            output += " through Reflect";
        } else if (description.isLightScreen) {
            output += " through Light Screen";
        }
        if (description.isCritical) {
            output += " on a critical hit";
        }
        return output;
    }

    Calc.buildDescription = buildDescription;

    function appendIfSet(str, toAppend) {
        if (toAppend) {
            return str + toAppend + " ";
        }
        return str;
    }

    Calc.appendIfSet = appendIfSet;

    function toPOStat(stat) {
        return stat === Calc.AT ? 'Atk'
                : stat === Calc.DF ? 'Def'
                : stat === Calc.SA ? 'SAtk'
                : stat === Calc.SD ? 'SDef'
                : stat === Calc.SP ? 'Spd'
                : 'wtf';
    }

    Calc.toPOStat = toPOStat;

    function chainMods(mods) {
        var M = 0x1000;
        for(var i = 0; i < mods.length; i++) {
            if(mods[i] !== 0x1000) {
                M = ((M * mods[i]) + 0x800) >> 12;
            }
        }
        return M;
    }

    Calc.chainMods = chainMods;

    function getMoveEffectiveness(move, type, isGhostRevealed, isGravity) {
        if (isGhostRevealed && type === 'Ghost' && (move.type === 'Normal' || move.type === 'Fighting')) {
            return 1;
        } else if (isGravity && type === 'Flying' && move.type === 'Ground') {
            return 1;
        } else if (move.name === 'Freeze Dry' && type === 'Water') {
            return 2;
        } else if (move.name === 'Flying Press') {
            return Calc.getTypeEffectiveness(move.type, type) * Calc.getTypeEffectiveness('Flying', type);
        } else {
            return Calc.getTypeEffectiveness(move.type, type);
        }
    }

    Calc.getMoveEffectiveness = getMoveEffectiveness;

    function getModifiedStat(stat, mod) {
        return mod > 0 ? Math.floor(stat * (2 + mod) / 2)
                : mod < 0 ? Math.floor(stat * 2 / (2 - mod))
                : stat;
    }

    Calc.getModifiedStat = getModifiedStat;

    function getFinalSpeed(pokemon, weather) {
        var speed = getModifiedStat(pokemon.rawStats[Calc.SP], pokemon.boosts[Calc.SP]);
        if (pokemon.item === 'Choice Scarf') {
            speed = Math.floor(speed * 1.5);
        } else if (pokemon.item === 'Macho Brace' || pokemon.item === 'Iron Ball') {
            speed = Math.floor(speed / 2);
        }
        if ((pokemon.ability === 'Chlorophyll' && weather === 'Sun') ||
                (pokemon.ability === 'Sand Rush' && weather === 'Sand') ||
                (pokemon.ability === 'Swift Swim' && weather === 'Rain')) {
            speed *= 2;
        }
        return speed;
    }

    Calc.getFinalSpeed = getFinalSpeed;

    function dealsPhysicalDamage(move) {
        return move.category === 'Physical' || ['Psyshock', 'Psystrike', 'Secret Sword'].indexOf(move.name) !== -1;
    }

    Calc.dealsPhysicalDamage = dealsPhysicalDamage;

    function checkAirLock(pokemon, field) {
        if (pokemon.ability === 'Air Lock' || pokemon.ability === 'Cloud Nine') {
            field.clearWeather();
        }
    }

    Calc.checkAirLock = checkAirLock;

    function checkForecast(pokemon, weather) {
        if (pokemon.ability === 'Forecast' && pokemon.name === 'Castform') {
            if (weather === 'Sun') {
                pokemon.type1 = 'Fire';
            } else if (weather === 'Rain') {
                pokemon.type1 = 'Water';
            } else if (weather === 'Hail') {
                pokemon.type1 = 'Ice';
            } else {
                pokemon.type1 = 'Normal';
            }
            pokemon.type2 = '';
        }
    }

    Calc.checkForecast = checkForecast;

    function checkKlutz(pokemon) {
        if (pokemon.ability === 'Klutz') {
            pokemon.item = '';
        }
    }

    Calc.checkKlutz = checkKlutz;

    function checkIntimidate(source, target) {
        if (source.ability === 'Intimidate') {
            if (target.ability === 'Contrary' || target.ability === 'Defiant') {
                target.boosts[Calc.AT] += 1;
            /*} else if (target.ability === 'Clear Body' || target.ability === 'Hyper Cutter') {
                // no effect*/
            } else if (target.ability === 'Simple') {
                target.boosts[Calc.AT] -= 2;
            } else {
                target.boosts[Calc.AT] -= 1;
            }
        }
    }

    Calc.checkIntimidate = checkIntimidate;

    function checkDownload(source, target) {
        if (source.ability === 'Download') {
            if (target.stats[Calc.SD] <= target.stats[Calc.DF]) {
                source.boosts[Calc.SA] += 1;
            } else {
                source.boosts[Calc.AT] += 1;
            }
        }
    }

    Calc.checkDownload = checkDownload;
    function checkInfiltrator(attacker, defenderSide) {
        if (attacker.ability === 'Infiltrator') {
            defenderSide.isReflect = false;
            defenderSide.isLightScreen = false;
        }
    }

    Calc.checkInfiltrator = checkInfiltrator;

    function countBoosts(boosts) {
        var sum = 0;
        for (var i = 0; i < Calc.STATS.length; i++) {
            if (boosts[Calc.STATS[i]] > 0) {
                sum += boosts[Calc.STATS[i]];
            }
        }
        return sum;
    }

    Calc.countBoosts = countBoosts;

    // GameFreak rounds DOWN on .5
    function pokeRound(num) {
        return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
    }

    Calc.pokeRound = pokeRound;
}());
