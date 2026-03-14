// Класс F1Data содержит справочные данные о стоимости пилотов, шасси и двигателей в виде массивов,
// а также массив, перечисляющий комплект запчастей для каждого пилота.

class F1Data {
    // Стоимость пилотов.
    driversCosts = [
        ["Норрис", 45],
        ["Ферстаппен", 40],
        ["Леклер", 36],
        ["Расселл", 32],
        ["Пиастри", 29],
        ["Хэмилтон", 26],
        ["Антонелли", 23],
        ["Хаджар", 20],
        ["Сайнс", 18],
        ["Албон", 16],
        ["Лоусон", 14],
        ["Берман", 12],
        ["Гасли", 10],
        ["Окон", 9],
        ["Колапинто", 8],
        ["Линдблад", 7],
        ["Алонсо", 6],
        ["Хюлкенберг", 5],
        ["Стролл", 4],
        ["Бортолето", 3],
        ["Перес", 2],
        ["Боттас", 1],
    ];

    // Стоимость шасси.
    shassisCosts = [
        ["McLaren", 60],
        ["Ferrari", 52],
        ["Mercedes", 45],
        ["Red Bull", 39],
        ["Williams", 34],
        ["Racing Bulls", 29],
        ["Haas", 24],
        ["Alpine", 20],
        ["Aston Martin", 16],
        ["Audi", 13],
        ["Cadillac", 10]
    ];

    // Стоимость двигателей.
    enginesCosts = [
        ["Mercedes", 100],
        ["Ferrari", 80],
        ["RBPT-Ford", 60],
        ["Audi", 40],
        ["Honda", 20]
    ];

    // Данные о болидах: пилот, шасси, двигатель, место.
    data1 = [
        ["Норрис", "McLaren", "Mercedes", 1],
        ["Ферстаппен", "Red Bull", "RBPT-Ford", 2],
        ["Леклер", "Ferrari", "Ferrari", 3],
        ["Расселл", "Mercedes", "Mercedes", 4],
        ["Пиастри", "McLaren", "Mercedes", 5],
        ["Хэмилтон", "Ferrari", "Ferrari", 6],
        ["Антонелли", "Mercedes", "Mercedes", 7],
        ["Хаджар", "Red Bull", "RBPT-Ford", 8],
        ["Сайнс", "Williams", "Mercedes", 9],
        ["Албон", "Williams", "Mercedes", 10],
        ["Лоусон", "Racing Bulls", "RBPT-Ford", 11],
        ["Берман", "Haas", "Ferrari", 12],
        ["Гасли", "Alpine", "Mercedes", 13],
        ["Окон", "Haas", "Ferrari", 14],
        ["Колапинто", "Alpine", "Mercedes", 15],
        ["Линдблад", "Racing Bulls", "RBPT-Ford", 16],
        ["Алонсо", "Aston Martin", "Honda", 17],
        ["Хюлкенберг", "Audi", "Audi", 18],
        ["Стролл", "Aston Martin", "Honda", 19],
        ["Бортолето", "Audi", "Audi", 20],
        ["Перес", "Cadillac", "Ferrari", 21],
        ["Боттас", "Cadillac", "Ferrari", 22]
    ];

    data2 = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

    names = new Map([
        ["Norris Lando", "Норрис"],
        ["Verstappen Max", "Ферстаппен"],
        ["Leclerc Charles", "Леклер"],
        ["Russell George", "Расселл"],
        ["Piastri Oscar", "Пиастри"],
        ["Hamilton Lewis", "Хэмилтон"],
        ["Antonelli Kimi", "Антонелли"],
        ["Hadjar Isack", "Хаджар"],
        ["Sainz Jr Carlos", "Сайнс"],
        ["Albon Alexander", "Албон"],
        ["Lawson Liam", "Лоусон"],
        ["Bearman Oliver", "Берман"],
        ["Gasly Pierre", "Гасли"],
        ["Ocon Esteban", "Окон"],
        ["Colapinto Franco", "Колапинто"],
        ["Lindblad Arvid", "Линдблад"],
        ["Alonso Fernando", "Алонсо"],
        ["Hulkenberg Nico", "Хюлкенберг"],
        ["Stroll Lance", "Стролл"],
        ["Bortoleto Gabriel", "Бортолето"],
        ["Perez Sergio", "Перес"],
        ["Bottas Valtteri", "Боттас"]
    ]);
}