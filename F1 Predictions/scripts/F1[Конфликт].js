	class F1Data {
		driversCosts = [
			["Ферстаппен", 45],
			["Гасли", 18],
			["Хэмилтон",  40],
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
		]
		
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
		]
		
		enginesCosts = [
			["Mercedes", 85],
			["Honda", 60],
			["Ferrari", 40],
			["Renault", 25]
		]
		
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
		
		data = [
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
		]
	}

class F1UI {
	constructor(){
		this.f1Data = new F1Data();
		this.existDrivers = [];
		this.existEngine = "";
		this.existShassi = "";
		this.teams = [];
		this.f1 = new F1(this.f1Data, this);
	}
	
	// Подключить графический интерфейс при помощи функций-слушателей.
	setEventListeners() {
		// Выбор файлов для чтения.
		document.getElementById("openTeams").addEventListener("change", e => {
			new FS().readFile(e.target.files[0], e => {
				document.getElementById("teamsPoints").value = e.target.result;
				this.f1.teams = e.target.result.split("\r\n");
				this.drawTable();
			});
			
		});
		
		document.getElementById("saveTable").addEventListener("click", e => {
			new FS().saveFile(document.getElementById("predictionTable").outerHTML, "Таблица.txt");
		});
		
		
		// Переключатели выбора мотора, шасси, изменение бюджета активируют расчеты.
		const radioEngine = document.getElementsByName("engine");
		for(let radio of radioEngine){
			radio.addEventListener("change", e => {
				this.f1.existEngine = e.target.value;
				document.getElementById("combos").innerHTML = this.f1.calculate().join("<br>");
			});
		}
		const radioShassis = document.getElementsByName("shassis");
		for(let radio of radioShassis){
			radio.addEventListener("change", e => {
				this.f1.existShassi = e.target.value;
				document.getElementById("combos").innerHTML = this.f1.calculate().join("<br>");
			});
		}
		document.getElementById("budget").addEventListener("input", e => {
			this.f1.budget = parseInt(e.target.value);
			document.getElementById("combos").innerHTML = this.f1.calculate().join("<br>");
		});
		// Изменение минимально необходимого количества очков активирует расчеты.
		document.getElementById("minRaiting").addEventListener("input", e => {
			this.f1.minRaiting = parseInt(e.target.value);
			document.getElementById("rangeRaiting").innerHTML = this.f1.minRaiting;
			document.getElementById("combos").innerHTML = this.f1.calculate().join("<br>");
		});
		// Подключить кнопки понижения\повышения строк.
		const buttonsUp = document.getElementsByClassName("buttonUp"),
		buttonsDown = document.getElementsByClassName("buttonDown");
		for(let button of buttonsUp){
			button.addEventListener("click", e => {
				const row = e.target.parentNode.parentNode;
				if(row.rowIndex === 1)
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
				this.getData();
			});
		}
		for(let button of buttonsDown){
			button.addEventListener("click", e => {
				const row = e.target.parentNode.parentNode;
				if(row.rowIndex === row.parentNode.children.length - 1)
					return;
				const firstInput = row.firstElementChild.firstElementChild,
					secondInput = row.nextElementSibling.firstElementChild.firstElementChild,
					number = firstInput.value;
				firstInput.setAttribute("value", secondInput.getAttribute("value"));
				firstInput.value = secondInput.value;
				secondInput.setAttribute("value", number);
				secondInput.value = number;
				row.parentNode.insertBefore(row.nextElementSibling, row);
				this.getData();
			});
		}
		// Изменить порядок строк при изменении их порядкового номера в первом столбце.
		const positions = document.getElementsByClassName("position");
		for(let position of positions){
			position.addEventListener("change", e => {
				const row = e.target.parentNode.parentNode;
				let targetPostion = parseInt(e.target.value),
					oldNumber = row.rowIndex;
				// Обработать ввод недопустимого значения.
				if(targetPostion > row.parentNode.children.length - 1 || targetPostion < 1){
					e.target.value = oldNumber;
					return;
				}
				if(oldNumber < targetPostion){
					oldNumber = targetPostion++;
				}
				const newPosition = row.parentNode.children[targetPostion];
				row.parentNode.insertBefore(row, newPosition);
				// Перенумеровать номера строк после изменения их порядка.
				this.renumber(oldNumber);
				this.getData();
			});
		}
	}
	// Изменить значения в полях ввода первого столбца таблицы по порядку до строки,
	// ушедшей снизу, включительно.
	renumber(limiter){
		const rows = document.getElementById("predictionTable").getElementsByTagName("tr"),
			reindexCount = limiter || rows.length - 1;
		for(let i = 1; i <= reindexCount; i++){
			rows[i].firstElementChild.firstElementChild.setAttribute("value", i);
			rows[i].firstElementChild.firstElementChild.value = i;
		}
	}
	// Собрать данные со страницы.
	getData(){
		// Данные из таблицы.
		const predictionTable = document.getElementById("predictionTable").getElementsByTagName("tr");
		for(let i = 0, driversCount = this.f1Data.data.length; i < driversCount; i++){
			this.f1Data.data[i][0] = predictionTable[i+1].children[2].innerHTML;
			this.f1Data.data[i][1] = predictionTable[i+1].children[3].innerHTML;
			this.f1Data.data[i][2] = predictionTable[i+1].children[4].innerHTML;
			this.f1Data.data[i][3] = i + 1;
		}
		// Учесть выбранные элементы и пилотов.
		this.existDrivers.length = 0;
		const checkboxes = document.getElementsByClassName("checkbox");
		for(let checkbox of checkboxes){
			if(checkbox.checked)
				this.existDrivers.push(checkbox.parentNode.parentNode.children[2].innerHTML);
		}
		this.existShassi = document.querySelector('input[name="shassis"]:checked').value;
		this.existEngine = document.querySelector('input[name="engine"]:checked').value;
		document.getElementById("combos").innerHTML = this.f1.calculate().join("<br>");
		document.getElementById("teamsPoints").value = "";
		this.f1.getTeamsResults().forEach((result,i) => {
			document.getElementById("teamsPoints").value +=
		`${this.f1.teams[i]} +${result}(${this.f1.getBonus(result)})\r\n`;
		});
		
	}

	drawTable(){
		let table = "<table><tr><td>#</td><td>Название</td><td>ID</td><td>Пилоты</td><td>Шасси</td><td>Двигатель</td><td>Бюжет</td><td>Очки</td><td>Прибавка</td></tr>";
		const results = this.f1.getTeamsResults();
		this.f1.teams.forEach((value, i) => {
			table += `<tr><td>${i + 1}<\/td>`;
			table +=`<td>${value[0]}<\/td>`;
			table +=`<td>${value[0]}<\/td>`;
			table +=`<td>${value.split(",")[1]}<\/td>`;
			table +=`<td>${value.split(",")[2]}<\/td>`;
			table +=`<td>${value.split(",")[3]}<\/td>`;
			table +=`<td>${value.split(",")[4]}<\/td>`;
			table +=`<td>${value.split(",")[5]}<\/td>`;
			table +=`<td>${results[i]}<\/td>`;
			table += "<\/tr>";
		});
		document.getElementById("teamsTable").innerHTML = table + "</table>";
	}
}

class F1 {
	constructor(F1Data, UI){
		this.data = F1Data.data;
		this.engines = F1Data.enginesCosts;
		this.shassis = F1Data.shassisCosts;
		this.drivers = F1Data.driversCosts;
		this.existDrivers = UI.existDrivers;
		this.existEngine = UI.existEngine;
		this.existShassi = UI.existShassi;
		this.teams = UI.teams;
		this.minRaiting = 50;
		this.budget = 80;
	}
	// Подобрать допустимые комбинации.
	calculate(){
		var raiting = [];
		for(var i = 0; i < this.engines.length; i++){
			// Стоимость и очки двигателя.
			let engineCost = 0,
			engineRaiting = this.getResult(2, this.engines[i][0]);
			if(this.existEngine !== this.engines[i][0])
				engineCost = this.engines[i][1];
			for(var j = 0; j < this.shassis.length; j++){
				// Стоимость и очки шасси.
				let shassiCost = 0,
				shassiRaiting = this.getResult(1, this.shassis[j][0]);
				if(this.existShassi !== this.shassis[j][0])
					shassiCost = this.shassis[j][1];
			
				for(var k = 0; k < this.drivers.length; k++){
					// Массив добавляемых в комбинацию гонщиков, их стоимость и очки.
					let firstRacerCost = 0, 
					firstRacerRaiting = this.getResult(0, this.drivers[k][0]);
					if(this.existDrivers.indexOf(this.drivers[k][0]) === -1)
						firstRacerCost = this.drivers[k][1];
					// Общая стоимость команды.
					let totalCostWithOneRacer = engineCost + shassiCost + firstRacerCost;
					// Общая сумма очков.
					let totalRaitingWithOneRacer = engineRaiting + shassiRaiting + firstRacerRaiting;
					// Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
					if(totalCostWithOneRacer <= this.budget && totalRaitingWithOneRacer >= this.minRaiting)
						raiting.push([this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithOneRacer, totalRaitingWithOneRacer]);
					
					
					for(var n = k + 1; n < this.drivers.length; n++){
						let secondRacerCost = 0, 
						secondRacerRaiting = this.getResult(0, this.drivers[n][0]);
						if(this.existDrivers.indexOf(this.drivers[n][0]) === -1)
							secondRacerCost = this.drivers[n][1];
						// Общая стоимость команды с добавлением второго гонщика.
						let totalCostWithTwoRacer = totalCostWithOneRacer + secondRacerCost;
						// Общая сумма очков с добавлением второго гонщика.
						let totalRaitingWithTwoRacer = totalRaitingWithOneRacer + secondRacerRaiting;
						// Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
						if(totalCostWithTwoRacer <= this.budget && totalRaitingWithTwoRacer >= this.minRaiting)
							raiting.push([this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithTwoRacer, totalRaitingWithTwoRacer]);	
					
						for(var m = n + 1; m < this.drivers.length; m++){
							let thirdRacerCost = 0, 
							thirdRacerRaiting = this.getResult(0, this.drivers[m][0]);
							if(this.existDrivers.indexOf(this.drivers[m][0]) === -1)
								thirdRacerCost = this.drivers[m][1];
							// Общая стоимость команды с добавлением третьего гонщика.
							let totalCostWithThreeRacer = totalCostWithTwoRacer + thirdRacerCost;
							// Общая сумма очков с добавлением второго гонщика.
							let totalRaitingWithThreeRacer = totalRaitingWithTwoRacer + thirdRacerRaiting;
							// Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
							if(totalCostWithThreeRacer <= this.budget && totalRaitingWithThreeRacer >= this.minRaiting)
								raiting.push([this.drivers[m][0], this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithThreeRacer, totalRaitingWithThreeRacer]);	
								
							for(var p = m + 1; p < this.drivers.length; p++){
								let fourthRacerCost = 0, 
								fourthRacerRaiting = this.getResult(0, this.drivers[p][0]);
								if(this.existDrivers.indexOf(this.drivers[p][0]) === -1)
									fourthRacerCost = this.drivers[p][1];
								// Общая стоимость команды с добавлением третьего гонщика.
								let totalCostWithFourRacer = totalCostWithThreeRacer + fourthRacerCost;
								// Общая сумма очков с добавлением второго гонщика.
								let totalRaitingWithFourRacer = totalRaitingWithThreeRacer + fourthRacerRaiting;
								// Добавить комбинацию команды, если удовлетворяет условиям бюджета и минимуму очков.
								if(totalCostWithFourRacer <= this.budget && totalRaitingWithFourRacer >= this.minRaiting)
									raiting.push([this.drivers[p][0], this.drivers[m][0], this.drivers[n][0], this.drivers[k][0], this.shassis[j][0], this.engines[i][0], totalCostWithFourRacer, totalRaitingWithFourRacer]);	
							}
						}
					}
				}
			}
		}
		raiting = this.multiDimensionalUnique(raiting);
		return raiting.sort(this.sorting);
	}
	// Получить результат состязания. Первый параметр метода определяет поиск по гонщику, 
	// шасси либо двигателю. Второй параметр - искомое совпадение в массиве данных.
	getResult(parametr, value){
		var result = 0;
		for(var i = 0; i < this.data.length; i++){
			if(this.data[i][parametr] === value)
				result += this.getPoints(this.data[i][3]);
		}
		return result;
	}
	// Вернуть заработанные очки. Способ подсчета, принятый в Формуле 1.
	getPoints(parametr){
		var points = 0;
		switch(parametr){
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
	getPointsForEveryone(parametr){
		return 21 - parametr;
	}
	// Сортировать двумерный массив комбинаций команд по убыванию заработанных очков. 
	// В случае равнества - по возрастанию стоимости команды .
	sorting(a, b){
		const result = b[b.length - 1] === a[a.length - 1] ?
			a[a.length - 2] - b[b.length - 2] :
			b[b.length - 1] - a[a.length - 1];
		return result;
	}
	// Сортировать по стоимости команды.
	sortingByCosts(a, b){
		return b[b.length - 1] - a[a.length - 1];
	}
	// Найти совпадающие элементы двумерного массива.
	multiDimensionalUnique(arr) {
		const uniques = [],	itemsFound = {};
		for(let i = 0, l = arr.length; i < l; i++) {
			let stringified = JSON.stringify(arr[i]);
			if(itemsFound[stringified])
				continue;
			uniques.push(arr[i]);
			itemsFound[stringified] = true;
		}
		return uniques;
	}
	
	getTeamsResults(){
		let teamsPoints = [];
		this.teams.forEach(team =>
			teamsPoints.push(
				team.split(",")[1].split(/\s+/).reduce((sum, driver) => 
						sum + this.getResult(0, driver), 0) 
				+ this.getResult(1, team.split(",")[2]) 
				+ this.getResult(2, team.split(",")[3]) 
			)
		);
		return teamsPoints;
	}
	// Получить прибавку бюджета.
	getBonus(points){
		let bonus = 0;
		if(points < 25){
			bonus = 0.75 * points;
		} else if(points >=25){
			bonus = 2/3 * points;
		} else {
			bonus = 0.5 * points;
		}
		return bonus.toFixed();
	}
	
}