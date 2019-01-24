// QUnit.test( "hello test", function( assert ) {
//     assert.ok( 1 == "1", "Passed!" );
// });

QUnit.test( "noten.parseNote", function( assert ) {
    assert.equal(noten.parseNote(""),null);
    assert.equal(noten.parseNote("1.3"),1.3);
    assert.equal(noten.parseNote(1.3),1.3);
    assert.equal(noten.parseNote(5),5);
    assert.equal(noten.parseNote("2+"),1.75);
    assert.equal(noten.parseNote("5-"),5.25);
    assert.equal(noten.parseNote("3-4"),3.5);
    assert.equal(noten.parseNote("3-5"),null);
    assert.equal(noten.parseNote("8+"),null);
});

QUnit.test( "noten.isEmptyCol", function( assert ) {
    let data = [[0,1,2,'',4],
    [0,1,2,'',4],
    [0,1,2,'',4]];
    assert.equal(noten.isEmptyCol(data,3),true);
    data[2][3]='x';
    assert.equal(noten.isEmptyCol(data,3),false);
    data[0][3]=6;
    assert.equal(noten.isEmptyCol(data,3),false);
});

getData = () => {
    return [[0,1,2,'',4],
            [0,1,2,'',4],
            [0,1,2,'',4]];
}

QUnit.test( "noten.addEmptyColIfNeeded", function( assert ) {
    let data = getData();
    noten.addEmptyColIfNeeded(data);
    assert.equal(data[0].length,5);

    data = getData();
    data[0][3]='x';
    noten.addEmptyColIfNeeded(data);
    assert.equal(data[0].length,6);
    assert.ok(noten.isEmptyCol(data,4));

    data = getData();
    data[2][3]=5;
    noten.addEmptyColIfNeeded(data);
    assert.equal(data[0].length,6);
    assert.ok(noten.isEmptyCol(data,4));
});

// var arrayIdentical = (array1,array2) => {
//     var is_same = (array1.length == array2.length) && array1.every(function(element, index) {
//         if (Array.isArray(element)&&Array.isArray(array2[index]))
//             return arrayIdentical(element, array2[index]);
//         else
//             return element === array2[index]; 
//    });
//    return is_same;
// }

QUnit.test( "noten.makeExamRow", function( assert ) {
    assert.deepEqual(noten.makeExamRow(['A','A','D','C']),['Exams','A','A','D','C','<A>','<D>','<C>','<*>']);
});

QUnit.test( "noten.makeGradeRows", function( assert ) {
    let data={ 
        examTypes: [
            {id: "A", weight: 10},
            {id: "D", weight: 20},
            {id: "C", weight: 30},
        ],
        students: ['A','B','C'],
        exams: ['A','A','D','C'],
        marks: [
            {student: 0, grades: ['5+','5+','5+','5+','5+']},
            {student: 1, grades: ['5+','5+','5+','5+','5+']},
            {student: 2, grades: ['5+','5+','5+','5+','5+']},
        ]
    };
    assert.deepEqual(noten.makeGradeRows(data),
        [['A','5+','5+','5+','5+','4.75','4.75','4.75','4.75'],
         ['B','5+','5+','5+','5+','4.75','4.75','4.75','4.75'],
         ['C','5+','5+','5+','5+','4.75','4.75','4.75','4.75']]);
});

QUnit.test("noten.getWeightByExamTypeName", function( assert ) {
    let examTypes = [
        {id: "MÜ", weight: 10},
        {id: "TE", weight: 20},
        {id: "KA", weight: 30},
    ];
    assert.equal(noten.getWeightByExamTypeName(examTypes,"MÜ"),10);
    assert.equal(noten.getWeightByExamTypeName(examTypes,"xx"),0);
    assert.equal(noten.getWeightByExamTypeName(examTypes,"TE"),20);
    assert.equal(noten.getWeightByExamTypeName(examTypes,"KA"),30);
});

QUnit.test("noten.makeDisplayData", function( assert ) {
    let klasse = {
        name: "6d",
        examTypes: [
            {id: "MÜ", weight: 2},
            {id: "TE", weight: 1},
            {id: "KA", weight: 2},
        ],
        students: ["Alex","Arne","Anne"],
        exams: ["TE","TE","MÜ","TE","KA"],
        marks: [
            {student: 0, grades: ['5+','5+','5+','5+','5+']},
            {student: 1, grades: ['5+','5+','5+','5+','5+']},
            {student: 2, grades: ['5+','5+','5+','5+','5+']},
        ]
    };

    let frontendData=[[]];

    assert.deepEqual(noten.makeDisplayData(frontendData,klasse),
        [["Exams","TE","TE","MÜ","TE","KA","<TE>","<MÜ>","<KA>","<*>"],
         ["Alex",'5+','5+','5+','5+','5+','4.75','4.75','4.75','4.75'],
         ["Arne",'5+','5+','5+','5+','5+','4.75','4.75','4.75','4.75'],
         ["Anne",'5+','5+','5+','5+','5+','4.75','4.75','4.75','4.75']]);
});


QUnit.test("noten.resyncBackend", function( assert ) {


    backendData_= {
        name: "6d",
        examTypes: [
            {id: "MÜ", weight: 2},
            {id: "TE", weight: 1},
            {id: "KA", weight: 2},
        ],
        students: ["Alex","Arne","Anne"],
        exams: ["TE","TE","MÜ","TE","KA"],
        marks: [
            {student: 0, grades: ['5+','5+','5+','5+','5+']},
            {student: 1, grades: ['5+','5+','5+','5+','5+']},
            {student: 2, grades: ['5+','5+','5+','5+','5+']},
        ]
    };

    frontendData = [
        ["Exams","TE","KA","KA","<>","<>","<>"],
        ["Sven","4+","3-","1-","","",""]
    ]

    noten.resyncBackend(frontendData,backendData_);

    expectedBackendData_= {
        name: "6d",
        examTypes: [
            {id: "MÜ", weight: 2},
            {id: "TE", weight: 1},
            {id: "KA", weight: 2},
        ],
        students: ["Sven"],
        exams: ["TE","KA","KA"],
        marks: [
            {student: 0, grades: ['4+','3-','1-']},
        ]
    };

    assert.deepEqual(backendData_,expectedBackendData_);
});