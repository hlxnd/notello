
var examTypes = ["MÜ", "TE", "KA"];

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.fontWeight = 'bold';
}

function schnittRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    let schnitt = (col === frontendData[row].length - 1);
    td.style.background = schnitt ? 'lightgrey' : 'white';
    td.style.fontWeight = schnitt ? 'bold' : 'normal';
}

function calcAll() {
    noten.resyncBackend(frontendData, backendData_);
    // noten.addEmptyColIfNeeded(data);

    // // Schnitt
    // for (let r = 2; r < data.length; r++) {
    //     let s = 0;
    //     let n = 0;
    //     for (let c = 1; c < data[0].length - 2; c++) {
    //         let val = noten.parseNote(data[r][c]);
    //         if (val !== null) {
    //             s += val;
    //             n++;
    //         }
    //     }
    //     console.log(s + "/" + n);
    //     data[r][data[0].length - 1] = s / n;
    // }
}

var backendData_= {
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

var frontendData=[];
noten.makeDisplayData(frontendData,backendData_);



var container = document.getElementById('example');
var hot = new Handsontable(container, {
    data: frontendData,
    rowHeaders: false,
    colHeaders: false,
    filters: true,
    dropdownMenu: true,
    fillHandle: false,
    beforeRender: (isForced) => {
        if (isForced)
            noten.resyncBackend(frontendData, backendData_);

    },
    cells: function (row, col, prop) {
        var cellProperties = {};

        cellProperties.renderer = schnittRenderer;

        if (row === 0 && col !== 0) {
            cellProperties = {
                editor: 'select',
                selectOptions: examTypes,
                renderer: firstRowRenderer
            }
        }

        return cellProperties;
    }
});
