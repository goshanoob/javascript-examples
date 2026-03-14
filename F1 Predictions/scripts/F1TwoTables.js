// Класс F1 реализует основную логику приложеия. Методы класса:

class F1 {
    constructor(F1Data) {
        this.data1 = F1Data.data1;
        this.data2 = F1Data.data2;
        this.engines = F1Data.enginesCosts;
        this.shassis = F1Data.shassisCosts;
        this.drivers = F1Data.driversCosts;
        this.existDrivers = [];
        this.existShassi = "";
        this.existEngine = "";
        this.teams = [];
        this.minRaiting = 50;
        this.budget = 80;
    }

    // Подобрать допустимые комбинации.
    calculate() {
        let raiting = [];
        const enginePoints = new Map();
        const chassisPoints = new Map();
        const driverPoints = new Map();
        
        this.engines.forEach(eng => enginePoints.set(eng[0], this.getResultFromTwoTables(2, eng[0])));
        this.shassis.forEach(ch => chassisPoints.set(ch[0], this.getResultFromTwoTables(1, ch[0])));
        this.drivers.forEach(dr => driverPoints.set(dr[0], this.getResultFromTwoTables(0, dr[0])));
        
        for (var i = 0; i < this.engines.length; i++) {
            // Стоимость и очки двигателя.
            let engineCost = this.existEngine !== this.engines[i][0] ? this.engines[i][1] : 0;
            let engineRaiting = enginePoints.get(this.engines[i][0]);
            
            for (var j = 0; j < this.shassis.length; j++) {
                // Стоимость и очки шасси.
                let shassiCost = this.existShassi !== this.shassis[j][0] ? this.shassis[j][1] : 0;
                let shassiRaiting = chassisPoints.get(this.shassis[j][0]);

                for (var k = 0; k < this.drivers.length; k++) {
                    // Массив добавляемых в комбинацию гонщиков, их стоимость и очки.
                    let firstRacerCost = this.existDrivers.indexOf(this.drivers[k][0]) === -1 
                        ? this.drivers[k][1] : 0;
                    let firstRacerRaiting = driverPoints.get(this.drivers[k][0]);
                    
                    // Общая стоимость команды.
                    let totalCostWithOneRacer = engineCost + shassiCost + firstRacerCost;
                    // Общая сумма очков.
                    let totalRaitingWithOneRacer = engineRaiting + shassiRaiting + firstRacerRaiting;
                    // Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
                    if (totalCostWithOneRacer <= this.budget && totalRaitingWithOneRacer >= this.minRaiting)
                        raiting.push([this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithOneRacer, totalRaitingWithOneRacer]);

                    for (var n = k + 1; n < this.drivers.length; n++) {
                        let secondRacerCost = this.existDrivers.indexOf(this.drivers[n][0]) === -1
                        ? this.drivers[n][1] : 0;
                        let secondRacerRaiting = driverPoints.get(this.drivers[n][0]);
                        
                        // Общая стоимость команды с добавлением второго гонщика.
                        let totalCostWithTwoRacer = totalCostWithOneRacer + secondRacerCost;
                        // Общая сумма очков с добавлением второго гонщика.
                        let totalRaitingWithTwoRacer = totalRaitingWithOneRacer + secondRacerRaiting;
                        // Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
                        if (totalCostWithTwoRacer <= this.budget && totalRaitingWithTwoRacer >= this.minRaiting)
                            raiting.push([this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithTwoRacer, totalRaitingWithTwoRacer]);

                        for (var m = n + 1; m < this.drivers.length; m++) {
                            let thirdRacerCost = this.existDrivers.indexOf(this.drivers[m][0]) === -1
                                ? this.drivers[m][1] : 0;
                            let thirdRacerRaiting = driverPoints.get(this.drivers[m][0]);
                            
                            // Общая стоимость команды с добавлением третьего гонщика.
                            let totalCostWithThreeRacer = totalCostWithTwoRacer + thirdRacerCost;
                            // Общая сумма очков с добавлением второго гонщика.
                            let totalRaitingWithThreeRacer = totalRaitingWithTwoRacer + thirdRacerRaiting;
                            // Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
                            if (totalCostWithThreeRacer <= this.budget && totalRaitingWithThreeRacer >= this.minRaiting)
                                raiting.push([this.drivers[m][0], this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithThreeRacer, totalRaitingWithThreeRacer]);

                            for (var p = m + 1; p < this.drivers.length; p++) {
                                let fourthRacerCost = this.existDrivers.indexOf(this.drivers[p][0]) === -1
                                    ? this.drivers[p][1] : 0;
                                let fourthRacerRaiting = driverPoints.get(this.drivers[p][0]);
                                
                                // Общая стоимость команды с добавлением третьего гонщика.
                                let totalCostWithFourRacer = totalCostWithThreeRacer + fourthRacerCost;
                                // Общая сумма очков с добавлением второго гонщика.
                                let totalRaitingWithFourRacer = totalRaitingWithThreeRacer + fourthRacerRaiting;
                                // Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
                                if (totalCostWithFourRacer <= this.budget && totalRaitingWithFourRacer >= this.minRaiting)
                                    raiting.push([this.drivers[p][0], this.drivers[m][0], this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithFourRacer, totalRaitingWithFourRacer]);
                            }
                        }
                    }
                }
            }
        }
        raiting = this.getUniqueRows(raiting);
        return raiting.sort(this.sorting);
    }

    // Получить результат состязания. Первый параметр метода определяет поиск по гонщику, 
    // шасси либо двигателю. Второй параметр - искомое совпадение в массиве данных.
    getResult(parametr, value) {
        var result = 0;
        for (var i = 0; i < this.data1.length; i++) {
            if (this.data1[i][parametr] === value)
                result += this.getPoints(this.data1[i][3]);
        }
        return result;
    }

    // Получить очки по результатам двух состязаний.
    getResultFromTwoTables(parameter, value) {

        return this.getResultFromFirstTable(parameter, value) + this.getResultFromSecondTable(parameter, value);

        /*
        
        let result = 0;

        for (let i = 0; i < this.data1.length; i++) {
            if (this.data1[i][parametr] === value) {
                result += this.getPoints(this.data1[i][3]);
            }
        }

        for (let i = 0; i < this.data2.length; i++) {
            if (this.data2[i][parametr] === value) {
                result += this.getPoints(this.data2[i][3]);
            }
        }

        return result;*/
    }

    // Получить очки из первой табилцы.
    getResultFromFirstTable = (parameter, value) =>
        this.getResultFromTable(this.data1, parameter, value);

    // Получить очки из второй табилцы.
    getResultFromSecondTable = (parameter, value) =>
        this.getResultFromTable(this.data2, parameter, value);

    // Получить очки из переданной табилцы.
    getResultFromTable(table, parameter, value) {
        let result = 0;

        for (let i = 0; i < table.length; i++) {
            if (table[i][parameter] === value) {
                result += this.getPoints(table[i][3]);
            }
        }

        return result;
    }

    // Вернуть заработанные очки. Способ подсчета, принятый в Формуле 1.
    getPoints(position) {
        const points = [0, 25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
        
        return points[position] || 0;
    }

    // Вернуть заработанные очки. Альтернативный способ посчета очков. 
    // Учитывает конкуренцию во второй половине таблицы.
    getPointsForEveryone(parametr) {
        return 23 - parametr;
    }

    // Сортировать двумерный массив комбинаций команд по убыванию заработанных очков. 
    // В случае равнества - по возрастанию стоимости команды .
    sorting(a, b) {
        const result = b[b.length - 1] === a[a.length - 1] ?
            a[a.length - 2] - b[b.length - 2] :
            b[b.length - 1] - a[a.length - 1];
        return result;
    }

    // Сортировать по стоимости команды.
    sortingByCosts(a, b) {
        return b[b.length - 1] - a[a.length - 1];
    }

    // Убрать из двумерного массива совпадающие строки.
    getUniqueRows(array) {
        const uniques = [], itemsFound = {};
        for (let i = 0, count = array.length; i < count; i++) {
            let stringified = JSON.stringify(array[i]);
            if (itemsFound[stringified])
                continue;
            uniques.push(array[i]);
            itemsFound[stringified] = true;
        }
        return uniques;
    }

    // Получить результаты команд.
    calculateTeamsResults() {
        this.teams.forEach(team => {

            team.result =
                team.racers.split(/\s+/).reduce((sum, driver) =>
                    sum + this.getResultFromTwoTables(0, driver), 0)
                + this.getResultFromTwoTables(1, team.shassi)
                + this.getResultFromTwoTables(2, team.engine);


            let fistResult =
                team.racers.split(/\s+/).reduce((sum, driver) =>
                    sum + this.getResultFromFirstTable(0, driver), 0)
                + this.getResultFromFirstTable(1, team.shassi)
                + this.getResultFromFirstTable(2, team.engine);

            let secondResult =
                team.racers.split(/\s+/).reduce((sum, driver) =>
                    sum + this.getResultFromSecondTable(0, driver), 0)
                + this.getResultFromSecondTable(1, team.shassi)
                + this.getResultFromSecondTable(2, team.engine);
            
            team.bonus = this.getBonus(fistResult) + this.getBonus(secondResult);
        });
    }

    // Получить прибавку бюджета.
    getBonus(points) {
        let bonus = 0;
        if (points < 25) {
            bonus = 0.75 * points;
        } else if (points >= 25 && points <= 45) {
            bonus = 2 / 3 * points;
        } else {
            bonus = 0.5 * points;
        }
        return Math.round(bonus);
    }
}