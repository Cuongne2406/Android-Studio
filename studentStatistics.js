const class1 = [
    {
        mssv: '123000991',
        name: 'Nguyễn Trung Cường - Công Nghệ Thông Tin',
        avgPoint: '9.8',
        avgTrainingPoint: '95',
        id: "123000991",
        status: 'pass',
    },
    {
        mssv: '123000111',
        name: 'Trần Văn A - Công Nghệ Thông Tin',
        avgPoint: '9.5',
        avgTrainingPoint: '90',
        id: "123000111",
        status: 'pass',
    },
    {
        mssv: '123000222',
        name: 'Lê Thị B - Khoa Dược',
        avgPoint: '8.5',
        avgTrainingPoint: '85',
        id: "123000222",
        status: 'pass',
    },
];

const class2 = [
    {
        mssv: '123000333',
        name: 'Phạm Văn C - Khoa Cơ Điện',
        avgPoint: '8.2',
        avgTrainingPoint: '88',
        id: "123000333",
        status: 'pass',
    },
    {
        mssv: '123000444',
        name: 'Hoàng Thị D - Ngôn Ngữ Anh',
        avgPoint: '7.9',
        avgTrainingPoint: '92',
        id: "123000444",
        status: 'pass',
    },
    {
        mssv: '123000555',
        name: 'Đặng Văn E - Quản Trị Kinh Doanh',
        avgPoint: '7.5',
        avgTrainingPoint: '80',
        id: "123000555",
        status: 'pass',
    },
    {
        mssv: '123000666',
        name: 'Vũ Thị F - Luật Kinh Tế',
        avgPoint: '7.2',
        avgTrainingPoint: '75',
        id: "123000666",
        status: 'pass',
    },
    {
        mssv: '123000777',
        name: 'Nguyễn Văn G - Công Nghệ Thông Tin',
        avgPoint: '6.5',
        avgTrainingPoint: '70',
        id: "123000777",
        status: 'pass',
    },
];

const AllStudents = [...class1, ...class2];
const sortedByAvgPoint = [...AllStudents].sort((a, b) => Number(b.avgPoint) - Number(a.avgPoint));
const sortedByAvgTrainingPoint = [...AllStudents].sort((a, b) => Number(b.avgTrainingPoint) - Number(a.avgTrainingPoint));
const top10StudentsByAvgTrainingPoint = sortedByAvgTrainingPoint.slice(0, 10);
const top100StudentsByAvgPoint = sortedByAvgPoint.slice(0, 100);

export { top100StudentsByAvgPoint, top10StudentsByAvgTrainingPoint };