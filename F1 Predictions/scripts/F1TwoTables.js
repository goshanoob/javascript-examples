// Класс F1Data содержит справочные данные о стоимости пилотов, шасси и двигателей в виде массивов,
// а также массив, перечисляющий комплект запчастей для каждого пилота.
// Класс F1UI описывает графический интерфейс. Методы класса:
// setEventListeners() - зарегистрировать функции-слушатели для элментов интерфейса на странице;
// getTableData() - собирает информацию из форм на странице.
// Класс F1 реализует основную логику приложеия. Методы класса:
//
class F1Data {
	// Стоимость пилотов.
	driversCosts = [
		["Ферстаппен", 45],
		["Гасли", 18],
		["Хэмилтон", 40],
		["Боттас", 32],
		["Цунода", 8],
		["Алонсо", 12],
		["Окон", 10],
		["Стролл", 14],
		["Джовинацци", 5],
		["Леклер", 26],
		["Сайнс", 20],
		["Риккардо", 23],
		["Перес", 36],
		["Феттель", 16],
		["Расселл", 4],
		["Норрис", 29],
		["Латифи", 1],
		["Шумахер", 3],
		["Райкконен", 6],
		["Мазепин", 2]
	];
	// Стоимость шасси.
	shassisCosts = [
		["Red Bull", 53],
		["Alpha Tauri", 24],
		["Mercedes", 46],
		["Alpine", 20],
		["Aston Martin", 29],
		["Alfa Romeo", 16],
		["Ferrari", 34],
		["McLaren", 40],
		["Williams", 13],
		["Haas", 10]
	];
	// Стоимость двигателей.
	enginesCosts = [
		["Mercedes", 85],
		["Honda", 60],
		["Ferrari", 40],
		["Renault", 25]
	];
	// Расшифровки для ответов сервера.
	englishName = {
		"ALO": "Алонсо",
		"BOT": "Боттас",
		"GAS": "Гасли",
		"GIO": "Джовинацци",
		"LEC": "Леклер",
		"LAT": "Латифи",
		"MAZ": "Мазепин",
		"NOR": "Норрис",
		"OCO": "Окон",
		"PER": "Перес",
		"RAI": "Райкконен",
		"RIC": "Риккардо",
		"RUS": "Расселл",
		"VER": "Ферстаппен",
		"SAI": "Сайнс",
		"STR": "Стролл",
		"VET": "Феттель",
		"HAM": "Хэмилтон",
		"TSU": "Цунода",
		"MSC": "Шумахер"
	}
	// Данные о болидах: пилот, шасси, двигатель, место.
	data1 = [
		["Алонсо", "Alpine", "Renault", 1],
		["Боттас", "Mercedes", "Mercedes", 2],
		["Гасли", "Alpha Tauri", "Honda", 3],
		["Джовинацци", "Alfa Romeo", "Ferrari", 4],
		["Латифи", "Williams", "Mercedes", 5],
		["Леклер", "Ferrari", "Ferrari", 6],
		["Мазепин", "Haas", "Ferrari", 7],
		["Норрис", "McLaren", "Mercedes", 8],
		["Окон", "Alpine", "Renault", 9],
		["Перес", "Red Bull", "Honda", 10],
		["Райкконен", "Alfa Romeo", "Ferrari", 11],
		["Рассел", "Williams", "Mercedes", 12],
		["Риккардо", "McLaren", "Mercedes", 13],
		["Сайнс", "Ferrari", "Ferrari", 14],
		["Стролл", "Aston Martin", "Mercedes", 15],
		["Ферстаппен", "Red Bull", "Honda", 16],
		["Феттель", "Aston Martin", "Mercedes", 17],
		["Хэмилтон", "Mercedes", "Mercedes", 18],
		["Цунода", "Alpha Tauri", "Honda", 19],
		["Шумахер", "Haas", "Ferrari", 20]
	];
	data2 = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
	/*
		constructor() {
			this.data2 = this.data1.slice(0);
		}*/
}

class F1UI {
	constructor() {
		this.f1Data = new F1Data();
		this.f1 = new F1(this.f1Data);
	}

	// Подключить графический интерфейс при помощи функций-слушателей.
	setEventListeners() {
		// Меню.
		/*document.querySelector("menu").addEventListener("click", (e) => {
			e.target.classList.toggle = "open";
		});*/

		// Выбрать файл команд.
		document.getElementById("openTeams").addEventListener("input", e => {
			new FS().readFile(e.target.files[0], e => {
				const openedTeams = e.target.result.split("\r\n");
				// Проврить формат данных в файле.
				if (!this.testTeamFormatFile(openedTeams)) {
					return;
				}
				// Создать объеты команд.
				const teams = [];
				openedTeams.forEach(teamStaff => {
					const staff = teamStaff.split(","),
						teamName = staff[0].match(/\d+\.\s+(.+)\s+(\d+$)/i);
					//const racers = staff[1].split(/\s+/);
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
				// Орисовать таблицу команд.
				this.drawTeamsTable();
			});
		});
		// Сохранить таблицу с прогнозом.
		document.getElementById("saveTable").addEventListener("click", e => {
			new FS().saveFile(document.getElementById("predictionTable").innerHTML, "Таблица.txt");
		});
		// Подключить функции слушатели для элементов управления таблицой.
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
				document.getElementById("predictionTable").innerHTML = table
				// Подключить функции слушатели для элементов управления таблицой.
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
	// Зарегистрировать функции-слашатели для элементов управления таблицой.
	setTableListeners() {
		// Подключить кнопки понижения\повышения строк.
		const buttonsUp = document.getElementsByClassName("buttonUp"),
			buttonsDown = document.getElementsByClassName("buttonDown");
		for (let button of buttonsUp) {
			button.addEventListener("click", e => {
				const row = e.target.parentNode.parentNode;
				if (row.rowIndex === 1)
					return;
				const firstInput = row.firstElementChild.firstElementChild,
					secondInput = row.previousElementSibling.firstElementChild.firstElementChild,
					number = firstInput.value;
				// Поменять порядковые номера в пером столбце местами.
				firstInput.setAttribute("value", secondInput.getAttribute("value"));
				firstInput.value = secondInput.value;
				secondInput.setAttribute("value", number);
				secondInput.value = number;
				// Поменять строки местами.
				row.parentNode.insertBefore(row, row.previousElementSibling);
				this.getDataFromTable();
			});
		}
		for (let button of buttonsDown) {
			button.addEventListener("click", e => {
				const row = e.target.parentNode.parentNode;
				if (row.rowIndex === row.parentNode.children.length - 1)
					return;
				const firstInput = row.firstElementChild.firstElementChild,
					secondInput = row.nextElementSibling.firstElementChild.firstElementChild,
					number = firstInput.value;
				firstInput.setAttribute("value", secondInput.getAttribute("value"));
				firstInput.value = secondInput.value;
				secondInput.setAttribute("value", number);
				secondInput.value = number;
				row.parentNode.insertBefore(row.nextElementSibling, row);
				this.getDataFromTable();
			});

		}
		// Подключить выбор пилотов.
		const racerChecks = document.getElementsByClassName("racerCheck");
		for (let check of racerChecks) {
			check.addEventListener("change", e => {
				this.f1.existDrivers.length = 0;
				const checkedRacers = document.querySelectorAll('.racerCheck:checked');
				for (let racer of checkedRacers) {
					this.f1.existDrivers.push(racer.parentNode.parentNode.children[2].innerHTML);
				}
				/*
				// Актуализация массива выборанных пилотов через добавление\удалние.
				if(e.target.checked)
					this.f1.existDrivers.push(e.target.parentNode.parentNode.children[2].innerHTML);
				else 
					this.f1.existDrivers.splice(this.f1.existDrivers.indexOf(e.target.parentNode.parentNode.children[2].innerHTML), 1);
				*/
				this.showTeamCombinations();
			});
		}
		// Изменить порядок строк при изменении их порядкового номера в первом столбце.
		const positions = document.getElementsByClassName("position");
		for (let position of positions) {
			position.addEventListener("change", e => {
				const row = e.target.parentNode.parentNode;
				let targetPostion = parseInt(e.target.value),
					oldNumber = row.rowIndex;
				// Обработать ввод недопустимого значения.
				if (targetPostion > row.parentNode.children.length - 1 || targetPostion < 1) {
					e.target.value = oldNumber;
					return;
				}
				if (oldNumber < targetPostion) {
					oldNumber = targetPostion++;
				}
				const newPosition = row.parentNode.children[targetPostion];
				row.parentNode.insertBefore(row, newPosition);
				// Перенумеровать номера строк после изменения их порядка.
				this.renumber(oldNumber);
				this.getDataFromTable();
			});
		}
	}

	// Изменить значения в полях ввода первого столбца таблицы по порядку до строки,
	// ушедшей снизу, включительно.
	renumber(limiter) {
		const rows = document.getElementById("predictionTable").getElementsByTagName("tr"),
			reindexCount = limiter || rows.length - 1;
		for (let i = 1; i <= reindexCount; i++) {
			rows[i].firstElementChild.firstElementChild.setAttribute("value", i);
			rows[i].firstElementChild.firstElementChild.value = i;
		}
	}
	// Собрать данные из таблицы.
	getDataFromTable() {
		const predictionTable = document.getElementById("predictionTable").getElementsByTagName("tr"),
			predictionTable2 = document.getElementById("predictionTable2").getElementsByTagName("tr");
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
		// Вычислить результаты команд на этапе.
		this.f1.calculateTeamsResults();
		// Отобразить таблицу с результатами сфомированных команд, если они загружены.
		if (this.f1.teams.length !== 0)
			this.drawTeamsTable();
	}
	// Вывести комбинации команд и деталей, вычисленные по заданным криетриям. 
	showTeamCombinations = () => document.getElementById("combos").value = this.f1.calculate().join("\n");
	// Построить таблицу команд.
	drawTeamsTable() {
		let table = "<table><tr><td>#</td><td>Название</td><td>ID</td><td>Пилоты</td>\
						<td>Шасси</td><td>Двигатель</td><td>Бюжет</td><td>Очки</td>\
						<td>Прибавка</td><td>Сумма</td></tr>";
		this.f1.teams.forEach((team, i) => {
			table += `<tr><td>${i + 1}</td>`;
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
}

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
		var raiting = [];
		for (var i = 0; i < this.engines.length; i++) {
			// Стоимость и очки двигателя.
			let engineCost = 0,
				engineRaiting = this.getResultFromTwoTables(2, this.engines[i][0]);
			if (this.existEngine !== this.engines[i][0])
				engineCost = this.engines[i][1];
			for (var j = 0; j < this.shassis.length; j++) {
				// Стоимость и очки шасси.
				let shassiCost = 0,
					shassiRaiting = this.getResultFromTwoTables(1, this.shassis[j][0]);
				if (this.existShassi !== this.shassis[j][0])
					shassiCost = this.shassis[j][1];

				for (var k = 0; k < this.drivers.length; k++) {
					// Массив добавляемых в комбинацию гонщиков, их стоимость и очки.
					let firstRacerCost = 0,
						firstRacerRaiting = this.getResultFromTwoTables(0, this.drivers[k][0]);
					if (this.existDrivers.indexOf(this.drivers[k][0]) === -1)
						firstRacerCost = this.drivers[k][1];
					// Общая стоимость команды.
					let totalCostWithOneRacer = engineCost + shassiCost + firstRacerCost;
					// Общая сумма очков.
					let totalRaitingWithOneRacer = engineRaiting + shassiRaiting + firstRacerRaiting;
					// Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
					if (totalCostWithOneRacer <= this.budget && totalRaitingWithOneRacer >= this.minRaiting)
						raiting.push([this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithOneRacer, totalRaitingWithOneRacer]);


					for (var n = k + 1; n < this.drivers.length; n++) {
						let secondRacerCost = 0,
							secondRacerRaiting = this.getResultFromTwoTables(0, this.drivers[n][0]);
						if (this.existDrivers.indexOf(this.drivers[n][0]) === -1)
							secondRacerCost = this.drivers[n][1];
						// Общая стоимость команды с добавлением второго гонщика.
						let totalCostWithTwoRacer = totalCostWithOneRacer + secondRacerCost;
						// Общая сумма очков с добавлением второго гонщика.
						let totalRaitingWithTwoRacer = totalRaitingWithOneRacer + secondRacerRaiting;
						// Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
						if (totalCostWithTwoRacer <= this.budget && totalRaitingWithTwoRacer >= this.minRaiting)
							raiting.push([this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithTwoRacer, totalRaitingWithTwoRacer]);

						for (var m = n + 1; m < this.drivers.length; m++) {
							let thirdRacerCost = 0,
								thirdRacerRaiting = this.getResultFromTwoTables(0, this.drivers[m][0]);
							if (this.existDrivers.indexOf(this.drivers[m][0]) === -1)
								thirdRacerCost = this.drivers[m][1];
							// Общая стоимость команды с добавлением третьего гонщика.
							let totalCostWithThreeRacer = totalCostWithTwoRacer + thirdRacerCost;
							// Общая сумма очков с добавлением второго гонщика.
							let totalRaitingWithThreeRacer = totalRaitingWithTwoRacer + thirdRacerRaiting;
							// Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
							if (totalCostWithThreeRacer <= this.budget && totalRaitingWithThreeRacer >= this.minRaiting)
								raiting.push([this.drivers[m][0], this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithThreeRacer, totalRaitingWithThreeRacer]);

							for (var p = m + 1; p < this.drivers.length; p++) {
								let fourthRacerCost = 0,
									fourthRacerRaiting = this.getResultFromTwoTables(0, this.drivers[p][0]);
								if (this.existDrivers.indexOf(this.drivers[p][0]) === -1)
									fourthRacerCost = this.drivers[p][1];
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
	getResultFromTwoTables(parametr, value) {
		var result = 0;
		for (var i = 0; i < this.data1.length; i++) {
			if (this.data1[i][parametr] === value) {
				result += this.getPoints(this.data1[i][3]);
			}
		}
		for (var i = 0; i < this.data2.length; i++) {
			if (this.data2[i][parametr] === value) {
				result += this.getPoints(this.data2[i][3]);
			}
		}
		return result;
	}
	// Вернуть заработанные очки. Способ подсчета, принятый в Формуле 1.
	getPoints(parametr) {
		var points = 0;
		switch (parametr) {
			case 1: points = 25; break;
			case 2: points = 18; break;
			case 3: points = 15; break;
			case 4: points = 12; break;
			case 5: points = 10; break;
			case 6: points = 8; break;
			case 7: points = 6; break;
			case 8: points = 4; break;
			case 9: points = 2; break;
			case 10: points = 1; break;
		}
		return points;
	}
	// Вернуть заработанные очки. Альтернативный способ посчета очков. 
	// Учитывает конкуренцию во второй половине таблицы.
	getPointsForEveryone(parametr) {
		return 21 - parametr;
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
	/*getUniqueRows(array) {
		const uniques = [], stringifiedItems = {};
		array.forEach(item => {
			let stringified = JSON.stringify(item);
			if (stringifiedItems[stringified])
				return;
			uniques.push(item);
			stringifiedItems[stringified] = true;
		});
		return uniques;
	}*/

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
			team.bonus = this.getBonus(team.result);
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