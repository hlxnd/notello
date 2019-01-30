function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.fontWeight = 'bold';
}

function schnittRenderer(instance, td, row, col, prop, value, cellProperties) {
    // Handsontable.renderers.TextRenderer.apply(this, arguments);
    // let schnitt = (col === frontendData[row].length - 1);
    // td.style.background = schnitt ? 'lightgrey' : 'white';
    // td.style.fontWeight = schnitt ? 'bold' : 'normal';
}

var frontendData=[["Schüler","","[M]"],["","",""]];
var hot;

function createTable(container) {
    hot = new Handsontable(container,{
        data: frontendData,
        rowHeaders: false,
        colHeaders: false,
        filters: true,
        dropdownMenu: true,
        fillHandle: false,
    });
};

function loadTable(state,class_id) {
    let clazz=state.backendData.classes.filter((v,i,a)=>v.id===class_id)[0];
    
    store.buildFrontendWithBackend(class_id,frontendData);
    
    //let container = document.getElementById('clazz_table');
    hot.updateSettings({
         data: frontendData,
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
                //noten.resyncBackend(frontendData, backendData_);
                store.updateBackendWithFrontend(frontendData,class_id)
             }
         },
        cells: function (row, col, prop) {
            var cellProperties = {};
    
            //cellProperties.renderer = schnittRenderer;
    
            if (row === 0 && col !== 0) {
                cellProperties = {
                    editor: 'select',
                    selectOptions: state.backendData.config.examTypes,
                    renderer: firstRowRenderer
                }
            }
    
            return cellProperties;
        }
    });
    
};

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



