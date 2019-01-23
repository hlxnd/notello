
var examTypes = ["MÜ", "TE", "KA"];

var data = [
    ["", "TE", "TE", "cc", "TE", '', 'Schnitt'],
    ["Datum", "", "", "", "", "", ""],
    ["Alex", 10, 11, 12, 13, '', '?'],
    ["Arne", 20, 11, 14, 13, '', '?'],
    ["Anna", 30, 15, 12, 13, '', '?']
];

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.fontWeight = 'bold';
}

function schnittRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    let schnitt = (col === data[row].length - 1);
    td.style.background = schnitt ? 'lightgrey' : 'transparent';
    td.style.fontWeight = schnitt ? 'bold' : 'normal';
}

function calcAll() {
    noten.addEmptyColIfNeeded(data);

    // Schnitt
    for (let r = 2; r < data.length; r++) {
        let s = 0;
        let n = 0;
        for (let c = 1; c < data[0].length - 2; c++) {
            let val = noten.parseNote(data[r][c]);
            if (val !== null) {
                s += val;
                n++;
            }
        }
        console.log(s + "/" + n);
        data[r][data[0].length - 1] = s / n;
    }
}

calcAll();

var container = document.getElementById('example');
var hot = new Handsontable(container, {
    data: data,
    rowHeaders: false,
    colHeaders: false,
    filters: true,
    dropdownMenu: true,
    fillHandle: false,
    allowHtml: true,
    beforeRender: (isForced) => {
        if (isForced)
            calcAll();

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
