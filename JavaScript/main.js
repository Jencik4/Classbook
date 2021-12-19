import TableBuilder from "./TableCsv.js";
import Student from "./Student.js";
import SchoolClass from "./SchoolСlass.js";

const HelpTableRoot = document.querySelector("#HelpTableRoot");
const TableRoot = document.querySelector("#TableRoot");
const InputedTableFile = document.querySelector("#InputedTableFile"); // only .csv, .xlsx, .txt
const select = document.querySelector("#floatingSelect");

const TableRootTabularOutput = document.querySelector("#TableRootTabularOutput"); // only .csv, .xlsx, .txt
const TableRootTabularOutput2 = document.querySelector("#TableRootTabularOutput2"); // only .csv, .xlsx, .txt

const TableBuilderLoad = new TableBuilder(TableRoot);
const HelpTableRootBuilderLoad = new TableBuilder(HelpTableRoot);


const TableBuilderTabularOutput = new TableBuilder(TableRootTabularOutput);
const TableBuilderTabularOutput2 = new TableBuilder(TableRootTabularOutput2);

const chartClasses = new Chart(document.getElementById("bar-chart-grouped-classes"), {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      title: {
        display: true
      },
    }
});

const chartDisciplines = new Chart(document.getElementById("bar-chart-grouped-disciplines"), {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      title: {
        display: true
      },
    }
});

HelpTableRootBuilderLoad.update([["Главная", "Загрузка файлов таблицы с оценками(.csv,.txt,.xlsx). Просмотор их содержимого"],
["Табличная статистика", "Вывод статистики в табличном виде"],
["Графическая статистика","Вывод статистики в Графическом виде"],
["Помощь","Описание для всех вкладок"],
["О разработчике","Информация о разработчике"]],

["Вкладка", "Описание"]);

select.addEventListener("change", (e) => {
    var type = select.value;
    if (type==".csv"){
      InputedTableFile.accept = ".csv";

    }
    else if (type==".xlsx"){
      InputedTableFile.accept = ".xlsx";

    }
    else if (type==".txt"){
      InputedTableFile.accept = ".txt";

    }
  });


InputedTableFile.addEventListener("change", (e) => { 
    let fileName = InputedTableFile.files[0].name;
    console.log(fileName);
    if (select.value==".csv") {
        Papa.parse(InputedTableFile.files[0], {
            delimiter: ";",
            skipEmptyLines: true,
            complete: (results) => {
                TableBuilderLoad.update(results.data.slice(1), results.data[0]);
                console.log(results);
              }
        });
    } else if (select.value==".xlsx") {
        readXlsxFile(InputedTableFile.files[0]).then((data) => {
            TableBuilderLoad.update(data.slice(1), data[0]);
            console.log(data);
        });
    }
    else if (select.value==".txt") {
        const file = InputedTableFile.files[0];

        let reader = new FileReader();
        reader.onload = (e) => {
            const file = e.target.result;
            const lines = file.split(/\r\n|\n/);

            let data = [];
            for (let i = 0; i < lines.length; i++) 
                data[i] = lines[i].split(" ");
            
            TableBuilderLoad.update(data.slice(1), data[0]);
        };        
        reader.onerror = (e) => alert(e.target.error.name);
        reader.readAsText(file); 

    }
});

InputedTableFile.addEventListener("change", (e) => {
    let fileName = InputedTableFile.files[0].name;
    console.log(fileName);

    if (select.value==".csv") {
        Papa.parse(InputedTableFile.files[0], {
            delimiter: ";",
            skipEmptyLines: true,
            complete: (results) => {
                let classesNames = [];
                let classes = [];
                let StudentsData = results.data.slice(1);

                StudentsData.forEach(studentData => {
                    if (classesNames.includes(studentData[1])) {
                        let student = new Student(studentData[0], studentData[1], studentData.slice(2));

                        classes.forEach(element => {
                            if (element.className == student.className) 
                                element.add(student);
                        });
                    } else {
                        let schoolClass = new SchoolClass(studentData[1], results.data[0].slice(2));
                        console.log(schoolClass);
                        let student = new Student(studentData[0], studentData[1], studentData.slice(2));
                        schoolClass.add(student);
                        classesNames.push(studentData[1]);
                        classes.push(schoolClass);
                    }
                });            

                let headers = ['class', 'avg. mark', 'median', '5', '4', '3', '2'];
                let classesData = [];
                classes.forEach(schoolClass => {
                    classesData.push(schoolClass.getData());
                });

                TableBuilderTabularOutput.update(classesData, headers);
                TableBuilderTabularOutput2.update(getDisciplinesData(classes, true), ['discipline', 'avg. mark', 'median', '5', '4', '3', '2']);

                const labels = ['avg. mark', 'median', '5', '4', '3', '2'];
                const dataClasses = createDataClasses(classes, labels);
                const dataDisciplines = createDataDisciplines(classes, labels);

                chartClasses.data = dataClasses;
                chartDisciplines.data = dataDisciplines;

                chartClasses.update();
                chartDisciplines.update();
              }
        });
    } else if (select.value==".xlsx") {
        readXlsxFile(InputedTableFile.files[0]).then((data) => {
            let classesNames = [];
            let classes = [];
            let StudentsData = data.slice(1);

            StudentsData.forEach(studentData => {
                if (classesNames.includes(studentData[1])) {
                    let student = new Student(studentData[0], studentData[1], studentData.slice(2));

                    classes.forEach(element => {
                        if (element.className == student.className) 
                            element.add(student);
                    });
                } else {
                    let schoolClass = new SchoolClass(studentData[1], data[0].slice(2));
                    console.log(schoolClass);
                    let student = new Student(studentData[0], studentData[1], studentData.slice(2));
                    schoolClass.add(student);
                    classesNames.push(studentData[1]);
                    classes.push(schoolClass);
                }
            });            

            let headers = ['class', 'avg. mark', 'median', '5', '4', '3', '2'];
            let classesData = [];
            classes.forEach(schoolClass => {
                classesData.push(schoolClass.getData());
            });

            TableBuilderTabularOutput.update(classesData, headers);
            TableBuilderTabularOutput2.update(getDisciplinesData(classes, true), ['discipline', 'avg. mark', 'median', '5', '4', '3', '2']);

            const labels = ['avg. mark', 'median', '5', '4', '3', '2'];
            const dataClasses = createDataClasses(classes, labels);
            const dataDisciplines = createDataDisciplines(classes, labels);

            chartClasses.data = dataClasses;
            chartDisciplines.data = dataDisciplines;

            chartClasses.update();
            chartDisciplines.update();
        });
    }
    else if (select.value==".txt") {
        const file = InputedTableFile.files[0];

        let reader = new FileReader();
        reader.onload = (e) => {
            const file = e.target.result;
            const lines = file.split(/\r\n|\n/);

            let data = [];
            for (let i = 0; i < lines.length; i++) 
                data[i] = lines[i].split(" ");
            
                let classesNames = [];
                let classes = [];
                let StudentsData = data.slice(1);
    
                StudentsData.forEach(studentData => {
                    if (classesNames.includes(studentData[1])) {
                        let student = new Student(studentData[0], studentData[1], studentData.slice(2));
    
                        classes.forEach(element => {
                            if (element.className == student.className) 
                                element.add(student);
                        });
                    } else {
                        let schoolClass = new SchoolClass(studentData[1], data[0].slice(2));
                        console.log(schoolClass);
                        let student = new Student(studentData[0], studentData[1], studentData.slice(2));
                        schoolClass.add(student);
                        classesNames.push(studentData[1]);
                        classes.push(schoolClass);
                    }
                });            
    
                let headers = ['class', 'avg. mark', 'median', '5', '4', '3', '2'];
                let classesData = [];
                classes.forEach(schoolClass => {
                    classesData.push(schoolClass.getData());
                });
    
                TableBuilderTabularOutput.update(classesData, headers);
                TableBuilderTabularOutput2.update(getDisciplinesData(classes, true), ['discipline', 'avg. mark', 'median', '5', '4', '3', '2']);
    
                const labels = ['avg. mark', 'median', '5', '4', '3', '2'];
                const dataClasses = createDataClasses(classes, labels);
                const dataDisciplines = createDataDisciplines(classes, labels);
    
                chartClasses.data = dataClasses;
                chartDisciplines.data = dataDisciplines;
    
                chartClasses.update();
                chartDisciplines.update();
        };        
        reader.onerror = (e) => alert(e.target.error.name);
        reader.readAsText(file); 

    }

});

/**
 * 
 * @param {SchoolClass[]} classes 
 * @returns {string[][]} statisticsDisciplines
 */

function getDisciplinesData(classes, isPercentage) {
    let statisticsDisciplines = []; 
    let disciplines = classes[0].disciplines;

    for (let i = 0; i < disciplines.length; i++) {
        let statistics = [];
        let marks = [];
        classes.forEach(schoolClass => {
            marks = marks.concat(schoolClass.getAllMarksByDiscipline(disciplines[i]));
        });

        let discipline = disciplines[i];
        let avgMark = getAvgMark(marks);
        let median = getMedian(marks);

        if (isPercentage) {
            statistics = [discipline, 
                avgMark, 
                median, 
                getCount(marks, '5') + `(${getPercentage(marks, '5')}%)`, 
                getCount(marks, '4') + `(${getPercentage(marks, '4')}%)`, 
                getCount(marks, '3') + `(${getPercentage(marks, '3')}%)`, 
                getCount(marks, '2') + `(${getPercentage(marks, '2')}%)`];
        } else {
            statistics = [discipline, 
                avgMark, 
                median, 
                getCount(marks, '5'), 
                getCount(marks, '4'), 
                getCount(marks, '3'), 
                getCount(marks, '2')];
        }
                 
        statisticsDisciplines.push(statistics);
    }
    return statisticsDisciplines;
}

function getAvgMark(_marks) {
    let marks = _marks;    
    let x;
    let sum = marks.map(i => x += Number(i), x = 0).reverse()[0];
    let avgMark = (sum / marks.length).toFixed(2);

    return avgMark;
}

function getMedian(marks) {
    let values = marks.sort((a, b) => {
        return a - b;
    });
    
    let half = Math.floor(values.length / 2);
    
    if (values.length % 2)
        return values[half];
    
    return (Number(values[half - 1]) + Number(values[half])) / 2.0;
}

function getCount(marks, mark) {
    return marks.filter(m => m == mark).length;
}

function getPercentage(marks, mark) {
    return (marks.filter(m => m == mark).length / marks.length * 100).toFixed(1);
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
}

/**
 * 
 * @param {SchoolClass[]} classes 
 * @param {string[]} labels 
 * @returns dataClasses
 */
function createDataClasses(classes, labels) {
    let datasets = [];

    classes.forEach(schoolClass => {
        let dataset = {
            label: schoolClass.className,
            data: schoolClass.getData(false).slice(1),
            backgroundColor: random_rgba(),
        }
        datasets.push(dataset);
    });

    const data = {
        labels: labels,
        datasets: datasets
    };

    return data;
}

/**
 * 
 * @param {choolClass[]} classes 
 * @param {string[]} labels 
 * @returns dataDisciplines
 */
function createDataDisciplines(classes, labels) {
    let datasets = [];
    let disciplinesData = getDisciplinesData(classes, false);
    let disciplines = classes[0].disciplines;

    disciplines.forEach(discipline => {
        let data = disciplinesData.filter(d => d.includes(discipline))[0].slice(1);

        let dataset = {
            label: discipline,
            data: data,
            backgroundColor: random_rgba(),
        }
        datasets.push(dataset);
    });

    const data = {
        labels: labels,
        datasets: datasets
    };

    return data;
}