
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
    students: ["",""],
    exams: ["TE","TE"],
    marks: [
    ]
};

backendData_.students.map((v,i,a) =>
    backendData_.marks.push({student: i, grades: []})
)

var frontendData=[];
noten.makeDisplayData(frontendData,backendData_);

function addExam() {
    console.log(frontendData[0]);
    let index=frontendData[0].findIndex((v)=>v.toString().substr(0,1)==="[");
    // if (index>0)
    //     hot.alter('insert_col', index, 1);
    //if (!noten.isEmptyCol(data,data[0].length-2)) {
        for (let r=0;r<frontendData.length;r++) {
            frontendData[r].splice(index,0,'');
        }
        //hot.render();
        hot.updateSettings({data: frontendData});
    //}
}

var container = document.getElementById('example');
var hot = new Handsontable(container, {
    data: frontendData,
    rowHeaders: false,
    colHeaders: false,
    filters: true,
    dropdownMenu: true,
    fillHandle: false,
    beforeRender: (isForced) => {
        if (isForced) {
            if (frontendData[frontendData.length-1][0].toString().trim()!='') {
                frontendData.push([]);
                for (let i=0;i<frontendData[0].length;i++)
                    frontendData[frontendData.length-1].push('');
            }
            let index=frontendData[0].findIndex((v)=>v.toString().substr(0,1)==="[");
            if (frontendData[0][index-1].toString().trim()!='') {
                for (let r=0;r<frontendData.length;r++) {
                    frontendData[r].splice(index,0,'');
                }
            }
            noten.resyncBackend(frontendData, backendData_);
        }
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
