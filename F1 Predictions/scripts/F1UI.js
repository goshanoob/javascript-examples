// Класс F1UI описывает графический интерфейс.
class F1UI {
    constructor() {
        this.f1Data = new F1Data();
        this.f1 = new F1(this.f1Data);
        this.currentTeam = -1;
    }

    // Подключить графический интерфейс при помощи функций-слушателей.
    setEventListeners() {
        // Выбрать файл команд.
        document.getElementById("openTeams").addEventListener("input", e => {
            new FS().readFile(e.target.files[0], e => {

                const openedTeams = e.target.result.split("\r\n");

                // Проверить формат данных в файле.
                if (!this.testTeamFormatFile(openedTeams)) {
                    console.log("Неверный формат файла команд!");
                    return;
                }

                // Создать объекты команд.
                const teams = [];

                openedTeams.forEach(teamStaff => {
                    const staff = teamStaff.split(","),
                        teamName = staff[0].match(/\d+\.\s+(.+)\s+(\d+$)/i);
                    const team = {};
                    team.id = teamName[2];
                    team.name = teamName[1];
                    team.racers = staff[1];
                    team.shassi = staff[2];
                    team.engine = staff[3];
                    team.budget = parseInt(staff[4]);
                    team.points = parseInt(staff[5]);
                    teams.push(team);
                });

                this.f1.teams = teams;
                // Вычислить результаты команды на этапе.
                this.f1.calculateTeamsResults();
                // Отрисовать таблицу команд.
                this.drawTeamsTable();
                // Добавить к таблице команд взаимодействия.
                this.addTeamsTableListeners()
            });
        });

        // Сохранить таблицы с прогнозом.
        document.getElementById("saveTable").addEventListener("click", e => {
            let tables = document.getElementById("predictionFirstTable").innerHTML;
            tables += document.getElementById("predictionSecondTable").innerHTML;
            new FS().saveFile(tables, "Таблица.txt");
        });

        // Добавить функции-слушатели для кнопок копирования таблиц.
        this.setCopyTablesListeners();

        // Подключить функции-слушатели для элементов управления таблицой.
        this.setTableListeners();

        // Переключатели выбора мотора, шасси, изменение бюджета активируют расчеты.
        const radioEngine = document.getElementsByName("engine");

        for (let radio of radioEngine) {
            radio.addEventListener("change", e => {
                this.f1.existEngine = e.target.value;
                this.showTeamCombinations();
            });
        }

        const radioShassis = document.getElementsByName("shassis");

        for (let radio of radioShassis) {
            radio.addEventListener("change", e => {
                this.f1.existShassi = e.target.value;
                this.showTeamCombinations();
            });
        }

        document.getElementById("budget").addEventListener("input", e => {
            this.f1.budget = parseInt(e.target.value);
            this.showTeamCombinations();
        });

        document.getElementById("recalcCommands").addEventListener("input", this.calculateTeams);

        // Изменение минимально необходимого количества очков активирует расчеты.
        document.getElementById("minRaiting").addEventListener("input", e => {
            this.f1.minRaiting = parseInt(e.target.value);
            document.getElementById("rangeRaiting").innerHTML = this.f1.minRaiting;
            this.showTeamCombinations();
        });

        // Загрузить ранее сохраненную прогнозную таблицу.
        document.getElementById("loadTable").addEventListener("input", e => {
            // Добавить таблицу в разметку.
            new FS().loadFile(e.target.files[0]).then(table => {
                const firstTable = document.getElementById("predictionFirstTable");

                firstTable.innerHTML = table;

                const loadedTables = firstTable.getElementsByTagName("table");

                if (loadedTables.length > 1) {
                    const secondTable = loadedTables[1];
                    document.getElementById("predictionSecondTable").innerHTML = secondTable.outerHTML;
                    secondTable.remove();
                }

                // Подключить функции слушатели для элементов управления таблицей.
                this.setTableListeners();
                this.getDataFromTable();
            });
        });

        // Сохранить результаты команд.
        document.getElementById("saveTeamsResults").addEventListener("click", () => {
            let text = "";

            this.f1.teams.forEach((team, i) => {
                text += `${i + 1}. ${team.name} ${team.id},${team.racers},${team.shassi},` +
                    `${team.engine},${team.budget + team.bonus},${team.result + team.points}\r\n`;
            });

            new FS().saveFile(text.slice(0, -2), "Команды");
        });
    }

    // Проверить формат данных о первой команде в загруженном файле команд.
    testTeamFormatFile(teams) {
        let isCorrect = true;

        if (teams[0].split(",").length !== 6) {
            console.log("Неверный формат файла команд.");
            isCorrect = false;
        }

        return isCorrect;
    }

    // Зарегистрировать функции-слушатели для элементов управления таблицей.
    setTableListeners() {
        // Подключить кнопки понижения\повышения строк.
        const buttonsUp = document.getElementsByClassName("buttonUp");
        const buttonsDown = document.getElementsByClassName("buttonDown");

        for (let button of buttonsUp) {
            button.removeEventListener("click", this.moveRowUpHandler);
            button.addEventListener("click", this.moveRowUpHandler);
        }

        for (let button of buttonsDown) {
            button.removeEventListener("click", this.moveRowDownHandler);
            button.addEventListener("click", this.moveRowDownHandler);
        }

        // Подключить выбор пилотов.
        const racerChecks = document.getElementsByClassName("racerCheck");

        for (let check of racerChecks) {
            check.removeEventListener("change", this.changeRacerChecksHandler);
            check.addEventListener("change", this.changeRacerChecksHandler);
        }

        // Изменить порядок строк при изменении их порядкового номера в первом столбце.
        const positions = document.getElementsByClassName("position");

        for (let position of positions) {
            position.removeEventListener("change", this.changeRowPlaceHandler);
            position.addEventListener("change", this.changeRowPlaceHandler);
        }
    }

    // Поднять строку вверх на одну позицию.
    moveRowUpHandler = e => {
        const row = e.target.parentNode.parentNode;

        if (row.rowIndex === 1)
            return;

        const firstInput = row.firstElementChild.firstElementChild;
        const secondInput = row.previousElementSibling.firstElementChild.firstElementChild;
        const number = firstInput.value;

        // Поменять порядковые номера в первом столбце местами.
        firstInput.setAttribute("value", secondInput.getAttribute("value"));
        firstInput.value = secondInput.value;
        secondInput.setAttribute("value", number);
        secondInput.value = number;

        // Поменять строки местами.
        row.parentNode.insertBefore(row, row.previousElementSibling);
        this.getDataFromTable();
    }

    // Опустить строку вниз на одну позицию.
    moveRowDownHandler = e => {
        const row = e.target.parentNode.parentNode;

        if (row.rowIndex === row.parentNode.children.length - 1)
            return;

        const firstInput = row.firstElementChild.firstElementChild;
        const secondInput = row.nextElementSibling.firstElementChild.firstElementChild;
        const number = firstInput.value;

        firstInput.setAttribute("value", secondInput.getAttribute("value"));
        firstInput.value = secondInput.value;
        secondInput.setAttribute("value", number);
        secondInput.value = number;
        row.parentNode.insertBefore(row.nextElementSibling, row);
        this.getDataFromTable();
    }

    // Обработать выбор пилота в таблице.
    changeRacerChecksHandler = _ => {
        this.f1.existDrivers.length = 0;

        const checkedRacers = document.querySelectorAll('.racerCheck:checked');

        for (let racer of checkedRacers) {
            this.f1.existDrivers.push(racer.parentNode.parentNode.children[2].innerHTML);
        }

        this.showTeamCombinations();
    }

    // Переместить строку на указанную позицию.
    changeRowPlaceHandler = e => {
        const row = e.target.parentNode.parentNode;
        const table = row.closest("div").id;
        let targetPosition = parseInt(e.target.value);
        let oldNumber = row.rowIndex;

        // Обработать ввод недопустимого значения.
        if (targetPosition > row.parentNode.children.length - 1 || targetPosition < 1) {
            e.target.value = oldNumber;
            return;
        }

        // Необязательно перенумеровывать всю таблицу. Определить конечную строку перенумерации.
        if (oldNumber < targetPosition) {
            oldNumber = targetPosition++;
        }

        const newPosition = row.parentNode.children[targetPosition];

        row.parentNode.insertBefore(row, newPosition);
        // Перенумеровать номера строк после изменения их порядка.
        this.renumber(table, oldNumber);
        this.getDataFromTable();
    }

    // Изменить значения в полях ввода первого столбца таблицы по порядку до строки,
    // ушедшей снизу, включительно.
    renumber(table, limiter) {
        const rows = document.getElementById(table).getElementsByTagName("tr");
        const reindexCount = limiter || rows.length - 1;

        for (let i = 1; i <= reindexCount; i++) {
            rows[i].firstElementChild.firstElementChild.setAttribute("value", i);
            rows[i].firstElementChild.firstElementChild.value = i;
        }
    }

    // Собрать данные из таблицы.
    getDataFromTable() {
        const predictionTable = document.getElementById("predictionFirstTable").getElementsByTagName("tr");
        const predictionTable2 = document.getElementById("predictionSecondTable").getElementsByTagName("tr");

        for (let i = 0, driversCount = this.f1Data.data1.length; i < driversCount; i++) {
            this.f1Data.data1[i][0] = predictionTable[i + 1].children[2].innerHTML;
            this.f1Data.data1[i][1] = predictionTable[i + 1].children[3].innerHTML;
            this.f1Data.data1[i][2] = predictionTable[i + 1].children[4].innerHTML;
            this.f1Data.data1[i][3] = i + 1;
            this.f1Data.data2[i][0] = predictionTable2[i + 1].children[2].innerHTML;
            this.f1Data.data2[i][1] = predictionTable2[i + 1].children[3].innerHTML;
            this.f1Data.data2[i][2] = predictionTable2[i + 1].children[4].innerHTML;
            this.f1Data.data2[i][3] = i + 1;
        }

        this.showTeamCombinations();
        this.calculateTeams();
    }

    // Рассчитать результаты команд и перестроить таблицу.
    calculateTeams = () => {
        if (!document.getElementById("recalcCommands").checked) return;

        // Вычислить результаты команд на этапе.
        this.f1.calculateTeamsResults();

        // Отобразить таблицу с результатами сформированных команд, если они загружены.
        if (this.f1.teams.length !== 0) {
            this.drawTeamsTable();
            this.addTeamsTableListeners();
        }
    }

    // Вывести комбинации команд и деталей, вычисленные по заданным критериям. 
    showTeamCombinations = () =>
        document.getElementById("combos").value = this.f1.calculate().join("\n");

    // Построить таблицу команд.
    drawTeamsTable() {
        let table = "<table><tr><td>#</td><td>Название</td><td>ID</td><td>Пилоты</td>\
						<td>Шасси</td><td>Двигатель</td><td>Бюжет</td><td>Очки</td>\
						<td>Прибавка</td><td>Сумма</td></tr>";

        this.f1.teams.forEach((team, i) => {
            const isSelected = (this.currentTeam === i + 1) ? ' class="selectedTeam"' : '';
            
            table += `<tr${isSelected}><td>${i + 1}</td>`;
            table += `<td>${team.name}</td>`;
            table += `<td>${team.id}</td>`;
            table += `<td>${team.racers}</td>`;
            table += `<td>${team.shassi}</td>`;
            table += `<td>${team.engine}</td>`;
            table += `<td>${team.budget} + ${team.bonus}</td>`;
            table += `<td>${team.points}</td>`;
            table += `<td>${team.result}</td>`;
            table += `<td>${team.result + team.points}</td>`;
            table += "</tr>";
        });

        document.getElementById("teamsTable").innerHTML = table + "</table>";
    }

    // Добавить функции-слушатели к открытой таблице команд.
    addTeamsTableListeners() {
        const teams = document.querySelectorAll("#teamsTable tr:not(:first-child)");
        const noneCheckBoxes = [...document.querySelectorAll("#shassiNone, #engineNone")];
        const shassisLabels = [...document.querySelectorAll("#settings div:first-child label")];
        const engineLabels = [...document.querySelectorAll("#settings div:nth-child(2) label")];
        const budgetInput = document.querySelector("#budget");
        let currentTeam = -1;

        for (const team of teams) {
            team.addEventListener("click", e => {
                const checkBoxes = [...document.querySelectorAll(".racerCheck")];
                const firstTable = document.querySelectorAll("#predictionFirstTable tr td:nth-child(3)");
                
                checkBoxes.filter(check => check.checked).forEach(input => input.click());
                teams.forEach(row => row.classList.remove("selectedTeam"));

                let selectedTeam = parseInt(e.currentTarget.firstChild.innerText);

                if (this.currentTeam === selectedTeam) {
                    noneCheckBoxes.forEach(input => input.click());
                    this.currentTeam = -1
                    return;
                }

                this.currentTeam = selectedTeam;

                let teamRow = this.f1.teams[selectedTeam - 1];
                let teamMates = teamRow.racers.split(" ");

                shassisLabels.filter(label => label.innerText.includes(teamRow.shassi))[0]
                    .previousElementSibling.click();
                engineLabels.filter(label => label.innerText.includes(teamRow.engine))[0]
                    .previousElementSibling.click();

                const racersRows = [...firstTable].filter(a => teamMates.includes(a.textContent));

                racersRows.forEach(row => {
                    row.parentNode.querySelector(".racerCheck").click();
                });

                budgetInput.value = this.f1.teams[selectedTeam - 1].budget;
                budgetInput.dispatchEvent(new Event("input"));

                e.currentTarget.classList.add("selectedTeam");
            });
        }
    }

    // Скопировать данные одной таблицы в другую. 
    setCopyTablesListeners() {
        const firstTable = document.getElementById("predictionFirstTable");
        const secondTable = document.getElementById("predictionSecondTable");

        document.getElementById("copyFirstTable").addEventListener("click", () =>
            this.copyTable(firstTable, secondTable));
        document.getElementById("copySecondTable").addEventListener("click", () =>
            this.copyTable(secondTable, firstTable));
    }

    copyTable(originTable, targetTable) {
        targetTable.innerHTML = originTable.innerHTML;
        this.setTableListeners();
        this.getDataFromTable();
    }
}