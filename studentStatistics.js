const class1 = [
    {
        mssv: '123000991',
        name: 'Nguyễn Trung Cường',
        avgPoint: '10',
        avgTrainingPoint: '10',
        id: "123000991",
        status: 'pass',
    },
    {
        mssv: '123000111',
        name: 'Nguyễn Hậu',
        avgPoint: '9',
        avgTrainingPoint: '9',
        id: "123000111",
        status: 'pass',
    },
];

const class2 = [
    {
        mssv: '123000991',
        name: 'Phú Trần',
        avgPoint: '8',
        avgTrainingPoint: '8',
        id: "123000194",
        status: 'pass',
    },
    {
        mssv: '123000111',
        name: 'Nguyễn Duy',
        avgPoint: '7',
        avgTrainingPoint: '7',
        id: "123000113",
        status: 'pass',
    },
];

const AllStudents = [...class1, ...class2];
const fillteredStudents = AllStudents.filter(student => student.status === 'pass');
const sortedByAvgPoint = fillteredStudents.sort((a, b) => b.avgPoint - a.avgPoint);
const sortedByAvgTrainingPoint = fillteredStudents.sort((a, b) => b.avgTrainingPoint - a.avgTrainingPoint);
const top10StudentsByAvgTrainingPoint = sortedByAvgTrainingPoint.slice(0, 10);
const top100StudentsByAvgPoint = sortedByAvgPoint.slice(0, 100);
export { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint };