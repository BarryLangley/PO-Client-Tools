(function () {
    var damageResults;
    function calculate(poke1, poke2, fieldInfo) {
        damageResults = Calc.getDamageResults(p1, p2, field);

        var result, minDamage, maxDamage, minPercent, maxPercent, percentText;
        var highestMaxPercent = -1;
        var bestResult;
        for (var i = 0; i < 4; i++) {
            result = damageResults[0][i];
            minDamage = result.damage[0] * p1.moves[i].hits;
            maxDamage = result.damage[15] * p1.moves[i].hits;
            minPercent = Math.floor(minDamage * 1000 / p2.maxHP) / 10;
            maxPercent = Math.floor(maxDamage * 1000 / p2.maxHP) / 10;
            result.damageText = minDamage + "-" + maxDamage + " (" + minPercent + " - " + maxPercent + "%)";
            result.koChanceText = p1.moves[i].bp === 0 ? 'nice move'
                    : getKOChanceText(result.damage, p2, field.getSide(1), p1.moves[i].hits, p1.ability === 'Bad Dreams');
            //$(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
            //$(resultLocations[0][i].damage).text(minPercent + " - " + maxPercent + "%");

            result = damageResults[1][i];
            minDamage = result.damage[0] * p2.moves[i].hits;
            maxDamage = result.damage[15] * p2.moves[i].hits;
            minPercent = Math.floor(minDamage * 1000 / p1.maxHP) / 10;
            maxPercent = Math.floor(maxDamage * 1000 / p1.maxHP) / 10;
            result.damageText = minDamage + "-" + maxDamage + " (" + minPercent + " - " + maxPercent + "%)";
            result.koChanceText = p2.moves[i].bp === 0 ? 'nice move'
                    : getKOChanceText(result.damage, p1, field.getSide(0), p2.moves[i].hits, p2.ability === 'Bad Dreams');
            //$(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
            //$(resultLocations[1][i].damage).text(minPercent + " - " + maxPercent + "%");
        }
    }

    function calculateDamage() {
        var attacker = battle.field.poke(0).pokemon,
            defender = battle.field.poke(1).pokemon;

        return {
            calculation: result.description + ": " + result.damageText + " -- " + result.koChanceText,
            damageValues: result.damage.join(', ')
        };
    }

    Calc.calculateDamage = calculateDamage;

    function getKOChanceText(damage, defender, field, hits, isBadDreams) {
        if (damage[damage.length-1] === 0) {
            return 'aim for the horn next time';
        }
        if (damage[0] >= defender.maxHP) {
            return 'guaranteed OHKO';
        }

        var hazards = 0;
        var hazardText = [];
        if (field.isSR && defender.ability !== 'Magic Guard') {
            var effectiveness = Calc.getTypeEffectiveness('Rock', defender.type1) * Calc.getTypeEffectiveness('Rock', defender.type2);
            hazards += Math.floor(effectiveness * defender.maxHP / 8);
            hazardText.push('Stealth Rock');
        }
        if ([defender.type1, defender.type2].indexOf('Flying') === -1 &&
                ['Magic Guard', 'Levitate'].indexOf(defender.ability) === -1 && defender.item !== 'Air Balloon') {
            if (field.spikes === 1) {
                hazards += Math.floor(defender.maxHP / 8);
                hazardText.push('1 layer of Spikes');
            } else if (field.spikes === 2) {
                hazards += Math.floor(defender.maxHP / 6);
                hazardText.push('2 layers of Spikes');
            } else if (field.spikes === 3) {
                hazards += Math.floor(defender.maxHP / 4);
                hazardText.push('3 layers of Spikes');
            }
        }

        var eot = 0;
        var eotText = [];
        if (field.weather === 'Sun') {
            if (defender.ability === 'Dry Skin' || defender.ability === 'Solar Power') {
                eot -= Math.floor(defender.maxHP / 8);
                eotText.push(defender.ability + ' damage');
            }
        } else if (field.weather === 'Rain') {
            if (defender.ability === 'Dry Skin') {
                eot += Math.floor(defender.maxHP / 8);
                eotText.push('Dry Skin recovery');
            } else if (defender.ability === 'Rain Dish') {
                eot += Math.floor(defender.maxHP / 16);
                eotText.push('Rain Dish recovery');
            }
        } else if (field.weather === 'Sand') {
            if (['Rock', 'Ground', 'Steel'].indexOf(defender.type1) === -1 &&
                    ['Rock', 'Ground', 'Steel'].indexOf(defender.type2) === -1 &&
                    ['Magic Guard', 'Overcoat', 'Sand Force', 'Sand Rush', 'Sand Veil'].indexOf(defender.ability) === -1 &&
                    defender.item !== 'Safety Goggles') {
                eot -= Math.floor(defender.maxHP / 16);
                eotText.push('sandstorm damage');
            }
        } else if (field.weather === 'Hail') {
            if (defender.ability === 'Ice Body') {
                eot += Math.floor(defender.maxHP / 16);
                eotText.push('Ice Body recovery');
            } else if (defender.type1 !== 'Ice' && defender.type2 !== 'Ice' &&
                    ['Magic Guard', 'Overcoat', 'Snow Cloak'].indexOf(defender.ability) === -1 &&
                    defender.item !== 'Safety Goggles') {
                eot -= Math.floor(defender.maxHP / 16);
                eotText.push('hail damage');
            }
        }
        if (defender.item === 'Leftovers') {
            eot += Math.floor(defender.maxHP / 16);
            eotText.push('Leftovers recovery');
        } else if (defender.item === 'Black Sludge') {
            if (defender.type1 === 'Poison' || defender.type2 === 'Poison') {
                eot += Math.floor(defender.maxHP / 16);
                eotText.push('Black Sludge recovery');
            } else if (defender.ability !== 'Magic Guard' && defender.ability !== 'Klutz') {
                eot -= Math.floor(defender.maxHP / 8);
                eotText.push('Black Sludge damage');
            }
        }
        var toxicCounter = 0;
        if (defender.status === 'Poisoned') {
            if (defender.ability === 'Poison Heal') {
                eot += Math.floor(defender.maxHP / 8);
                eotText.push('Poison Heal');
            } else if (defender.ability !== 'Magic Guard') {
                eot -= Math.floor(defender.maxHP / 8);
                eotText.push('poison damage');
            }
        } else if (defender.status === 'Badly Poisoned') {
            if (defender.ability === 'Poison Heal') {
                eot += Math.floor(defender.maxHP / 8);
                eotText.push('Poison Heal');
            } else if (defender.ability !== 'Magic Guard') {
                eotText.push('toxic damage');
                toxicCounter = defender.toxicCounter;
            }
        } else if (defender.status === 'Burned') {
            if (defender.ability === 'Heatproof') {
                eot -= Math.floor(defender.maxHP / 16);
                eotText.push('reduced burn damage');
            } else if (defender.ability !== 'Magic Guard') {
                eot -= Math.floor(defender.maxHP / 8);
                eotText.push('burn damage');
            }
        } else if (defender.status === 'Asleep' && isBadDreams && defender.ability !== 'Magic Guard') {
            eot -= Math.floor(defender.maxHP / 8);
            eotText.push('Bad Dreams');
        }

        // multi-hit moves have too many possibilities for brute-forcing to work, so reduce it to a 16-point distribution
        var qualifier = '';
        if (hits > 1) {
            qualifier = 'approx. ';
            //console.log("Reducing " + hits + " hits for " + damage);
            damage = getDistribution(damage, hits);
            //console.log("Reduced to " + damage);
        }

        var c = getKOChance(damage, defender.maxHP - hazards, 0, 1, defender.maxHP, toxicCounter);
        var afterText = hazardText.length > 0 ? ' after ' + serializeText(hazardText) : '';
        if (c === 1) {
            return 'guaranteed OHKO' + afterText;
        } else if (c > 0) {
            return qualifier + Math.round(c * 1000) / 10 + '% chance to OHKO' + afterText;
        }

        afterText = hazardText.length > 0 || eotText.length > 0 ? ' after ' + serializeText(hazardText.concat(eotText)) : '';
        var i;
        for (i = 2; i <= 4; i++) {
            c = getKOChance(damage, defender.maxHP - hazards, eot, i, defender.maxHP, toxicCounter);
            if (c === 1) {
                return 'guaranteed ' + i + 'HKO' + afterText;
            } else if (c > 0) {
                return qualifier + Math.round(c * 1000) / 10 + '% chance to ' + i + 'HKO' + afterText;
            }
        }

        for (i = 5; i <= 9; i++) {
            if (predictTotal(damage[0], eot, i, toxicCounter, defender.maxHP) >= defender.maxHP - hazards) {
                return 'guaranteed ' + i + 'HKO' + afterText;
            } else if (predictTotal(damage[damage.length-1], eot, i, toxicCounter, defender.maxHP) >= defender.maxHP - hazards) {
                return 'possible ' + i + 'HKO' + afterText;
            }
        }

        return 'possibly the worst move ever';
    }

    function getKOChance(damage, hp, eot, hits, maxHP, toxicCounter) {
        var n = damage.length;
        var minDamage = damage[0];
        var maxDamage = damage[n-1];
        var i;
        if (hits === 1) {
            if (maxDamage < hp) {
                return 0;
            }
            for (i = 0; i < n; i++) {
                if (damage[i] >= hp) {
                    return (n-i)/n;
                }
            }
        }
        if (predictTotal(maxDamage, eot, hits, toxicCounter, maxHP) < hp) {
            return 0;
        } else if (predictTotal(minDamage, eot, hits, toxicCounter, maxHP) >= hp) {
            return 1;
        }
        var toxicDamage = 0;
        if (toxicCounter > 0) {
            toxicDamage = Math.floor(toxicCounter * maxHP / 16);
            toxicCounter++;
        }
        var sum = 0;
        for (i = 0; i < n; i++) {
            var c = getKOChance(damage, hp - damage[i] + eot - toxicDamage, eot, hits - 1, maxHP, toxicCounter);
            if (c === 1) {
                sum += (n-i);
                break;
            } else {
                sum += c;
            }
        }
        return sum/n;
    }

    function predictTotal(damage, eot, hits, toxicCounter, maxHP) {
        var toxicDamage = 0;
        if (toxicCounter > 0) {
            for (var i = 0; i < hits-1; i++) {
                toxicDamage += Math.floor((toxicCounter + i) * maxHP / 16);
            }
        }
        var total = (damage * hits) - (eot * (hits - 1)) + toxicDamage;
    //    console.log("Predicted for damage " + damage + ", hits " + hits + ": " + total);
        return total;
    }

    function getDistribution(d, h) {
        if (h === 2) {
            return [
                d[0]*h, squash(d,1,4,h), squash(d,2,5,h), squash(d,3,6,h),
                squash(d,4,7,h), squash(d,5,7,h), squash(d,5,8,h), squash(d,6,8,h),
                squash(d,7,9,h), squash(d,7,10,h), squash(d,8,10,h), squash(d,8,11,h),
                squash(d,9,12,h), squash(d,10,13,h), squash(d,11,14,h), d[15]*h
            ];
        } else {
            return [
                d[0]*h, squash(d,1,7,h), squash(d,3,7,h), squash(d,4,7,h),
                squash(d,5,7,h), squash(d,5,8,h), squash(d,5,9,h), squash(d,6,9,h),
                squash(d,6,9,h), squash(d,6,10,h), squash(d,7,10,h), squash(d,8,10,h),
                squash(d,8,11,h), squash(d,8,12,h), squash(d,8,14,h), d[15]*h
            ];
        }
    }

    function squash(arr, startIndex, endIndex, multiplier) {
        var sum = 0;
        for (var i = startIndex; i <= endIndex; i++) {
            sum += arr[i];
        }
        return Math.round(sum * multiplier / (1 + endIndex - startIndex));
    }

    function serializeText(arr) {
        if (arr.length === 0) {
            return '';
        } else if (arr.length === 1) {
            return arr[0];
        } else if (arr.length === 2) {
            return arr[0] + " and " + arr[1];
        } else {
            var text = '';
            for (var i = 0; i < arr.length-1; i++) {
                text += arr[i] + ', ';
            }
            return text + 'and ' + arr[arr.length-1];
        }
    }

    function Pokemon(pokeInfo) {
        this.name = pokeInfo.name;
        this.type1 = pokeInfo.type1;
        this.type2 = pokeInfo.type2;
        this.level = pokeInfo.level;
        this.maxHP = pokeInfo.maxHP;
        this.curHP = pokeInfo.curHP;
        this.HPEVs = pokeInfo.HPEVs;
        this.rawStats = [];
        this.boosts = [];
        this.stats = [];
        this.evs = [];

        for (var i = 0; i < Calc.STATS.length; i++) {
            this.rawStats[Calc.STATS[i]] = pokeInfo.totals[Calc.STATS[i]];
            this.boosts[Calc.STATS[i]] = pokeInfo.boosts[Calc.STATS[i]];
            this.evs[Calc.STATS[i]] = pokeInfo.evs[Calc.STATS[i]];
        }

        this.nature = pokeInfo.nature;
        this.ability = pokeInfo.ability;
        this.item = pokeInfo.item;
        this.status = pokeInfo.status;
        this.toxicCounter = this.status === 'Badly Poisoned' ? this.toxicCounter : 0;
        this.moves = [
            new Move(pokeInfo.move1),
            new Move(pokeInfo.move2),
            new Move(pokeInfo.move3),
            new Move(pokeInfo.move4)
        ];

        this.weight = pokeInfo.weight;
    }

    function Move(moveInfo) {
        this.name = moveInfo.name;
        this.bp = moveInfo.bp;
        this.type = moveInfo.type;
        this.category = moveInfo.category;
        this.isCrit = !!moveInfo.isCrit;
        this.hits = Calc.isMultiHitMove(this.name) ? moveInfo.hits
                : Calc.isTwoHitMove(this.name) ? 2 : 1;
    }

    function Field(fieldInfo) {
        var format = fieldInfo.format; // singles/doubles
        var weather = fieldInfo.weather;
        var isGravity = fieldInfo.isGravity;
        var isSR = fieldInfo.isSR;
        var spikes = fieldInfo.spikes;
        var isReflect = fieldInfo.isReflect;
        var isLightScreen = fieldInfo.isLightScreen;
        var isForesight = fieldInfo.isForesight;
        var isHelpingHand = fieldInfo.isHelpingHand; // affects attacks against opposite side

        this.getWeather = function() {
            return weather;
        };
        this.clearWeather = function() {
            weather = "";
        };
        this.getSide = function(i) {
            return new Side(format, weather, isGravity, isSR[i], spikes[i], isReflect[i], isLightScreen[i], isForesight[i], isHelpingHand[i]);
        };
    }

    function Side(format, weather, isGravity, isSR, spikes, isReflect, isLightScreen, isForesight, isHelpingHand) {
        this.format = format;
        this.weather = weather;
        this.isGravity = isGravity;
        this.isSR = isSR;
        this.spikes = spikes;
        this.isReflect = isReflect;
        this.isLightScreen = isLightScreen;
        this.isForesight = isForesight;
        this.isHelpingHand = isHelpingHand;
    }
}());
