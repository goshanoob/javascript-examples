// Класс, реализующий статистические методы.
// data - свойство, содержащее массив ряда данных, может быть определено при вызове конструктора;
// getMean() - метод, возвращающий среднее арифметическое;
// getValueCounts() - возвращает объект, свойства которого перечисляют элементы ряда данных, 
// а значения свойств - число их повторений в ряду;
// getModa() - возвращает массив с модами ряда данных;
// getModaAnother() - аналогично getModa();
// getMedian() - возвращает медианное значение ряда.

class Statistics {
	constructor(data){
		this.data = data;
	}
	// Среднее арифметическое. Возвращает число.
	getMean() {
		let sum = 0;
		for(let i of this.data){
			sum += i
		}
		return this.toRound(sum / this.data.length, 3);
	}
	
	// Частоты элементов. Возвращает объект со свойствами элемент:количество.
	getValueCounts(){
		let repetition = {};
		for(let i of this.data){
			if(repetition.hasOwnProperty(i)){
				repetition[i]++;
			} else {
				repetition[i] = 1;
			} 
		}
		return repetition;
	}
	
	// Среднее арифметическое взвешенное.
	getAverage(weights){
		let production = this.data.reduce((sum, current, index) => {
			return sum + current * weights[index];
		}, 0);
		let weightsSum = weights.reduce((sum, current) => {
			return sum + current;
		}, 0);
		return this.toRound(production / weightsSum, 3);
	}
	
	// Мода. Возвращет массив с модами типа String.
	getModa(){
		// Получить массив [значение, число повторов]. Сортировать массив по убыванию числа повтором.
		let elements = Object.entries(this.getValueCounts());
		elements.sort((a, b) => b[1] - a[1]);
		let modeValue = elements[0][1], modes = [];
		// Модальными являются первые значения в сотированном массиве с одинаковым числом повторов.
		elements.forEach(current => {
			if(current[1] === modeValue)
				modes.push(current[0]);
		});	
		return modes;
	}
	
	// Альтернативный вариант вычисления моды. Возвращет массив с модами типа String.
	getModaAnother(){
		// Массив мод, объект с числом повторений значений ряда.
		let modes = [], valueCounts = this.getValueCounts(),
		// Максимальное число повторений в ряду данных.
		max = valueCounts[Object.keys(valueCounts)[0]];
		for(let key in valueCounts){
			let value = valueCounts[key];
			if(value === max){
				modes.push(key);
			} else if(value > max) {
				modes = [key];
				max = value;
			}
		}
		return modes;
	}
	
	// Медиана.
	getMedian(){
		let sortData = this.data, n = sortData.length, median = 0;
		sortData.sort((a, b) => {return b - a});
		if(n % 2 === 0){
			let k = n / 2;
			median = (sortData[k] + sortData[k + 1]) / 2;
		} else {
			median = sortData[Math.ceil(n / 2)];
		}
		return median;
	}
	
	// Среднеквадратическое отклонение.
	getSquare(){
		return this.toRound(Math.sqrt(this.getDispersion()));
	}
	
	// Дисперсия.
	getDispersion(){
		const mean = this.getMean(), count = this.data.length;
		return	this.data.reduce((sum, element) =>
					sum + Math.pow(element - mean , 2) , 0
				) / count;
	}
	
	// Линейный тренд.
	getTrendLine(){
        const count = this.data.length;
        // Вычислить статистические величины.
        let X = 0, Y = this.data, sumX = 0, sumY = 0,
            product = 0, sumProduct = 0, sumSquareX = 0,
            meanX = 0, meanY = 0, b = 0, k = 0;
        for(let i = 0; i < count; i++){
            X = i + 1;
            sumX += X;
            sumY += Y[i];
            product = X * Y[i];
            sumProduct += product;
            sumSquareX += X * X;
        }
        // Вычислить средние арифметические.
        meanX = sumX / count;
        meanY = sumY / count;
        // Получить коэффициенты уравнения прямой тренда.
        k = sumProduct - count * meanX * meanY;
        k /= sumSquareX - count * Math.pow(meanX, 2);
		b = meanY - k * meanX;
		return {k: k, b: b};
	}
	
	// Привести данные к вещественному типу.
	testData(data){
		return data.map(element => parseFloat(element));
	}
	
	// Округлить с определенной точностью.
	toRound(value, accurancy = 2){
		return parseFloat(value.toFixed(accurancy));
	}
}
