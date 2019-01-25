
var noten = {
    resyncBackend(frontendData,backendData) {

        //try {
            backendData.exams=frontendData[0]
                .slice(1)
                .filter((v,i,a) => v.substr(0,1)!=="[");
            backendData.marks=frontendData.slice(1).map(
                (v,i,a) => { return { student: v[0], 
                    grades: v.slice(1,backendData.exams.length+1)};
                });
            this.makeDisplayData(frontendData,backendData);
        // }
        // catch {
        //     throw "Data error while syncing!"
        // }
    },

    makeDisplayData(frontendData,backendData) {
        frontendData.splice(0,null,this.makeExamRow(backendData))
        let gradeRows=this.makeGradeRows(backendData);
        gradeRows.map((v,i,a) => {
            frontendData.splice(i+1,null,v);
        });
        frontendData.splice(gradeRows.length+1);
        return frontendData;
    },
    
    makeExamRow(backendData) {
        var unique = backendData.exams.filter((v, i, a) => a.indexOf(v) === i);

        return [backendData.name]
            .concat(backendData.exams)
            .concat(unique.filter(v=>v.toString().trim()!=='').map(s=>'['+s.trim()+']'))
            .concat('[M]')
            .concat('[N]');
    },

    makeGradeRows(data) {
        return data.marks.map(x => {
            // Student name
            let gradeRow = [x.student];
            let unique = data.exams.filter((v, i, a) => a.indexOf(v) === i);
            // Fix length of grades
            for (let i=x.grades.length;i<data.exams.length;i++)
                x.grades.push('');
            let marks = x.grades.slice(0,data.exams.length);
            
            gradeRow = gradeRow.concat(marks);

            let averageByExamType = 
                unique.map(examTypeName=>{
                    let sum=x.grades.slice(0,data.exams.length).filter((v,i,a) => 
                        examTypeName===data.exams[i]).reduce((a, b) => this.parseNote(a) + this.parseNote(b), 0);
                    console.log(x.grades);
                    console.log(data.exams);
                    let count=data.exams.filter((v,i,a)=> (v===examTypeName) && (x.grades[i].toString().trim()!="") ).length;
                    if (count>0)
                        return (sum/count).toFixed(2).toString();
                    else 
                        return '';
                });
            gradeRow = gradeRow.concat(averageByExamType);

            let grandSum = averageByExamType
                .map((v,i,a) => this.parseNote(v) * this.getWeightByExamTypeName(data.examTypes,unique[i]))
                .reduce((a, b) => a + b, 0);
            //console.log(averageByExamType)

            let grandWeightCount = unique
                .map((v,i,a)=>(averageByExamType[i].trim()==''?0:1)*this.getWeightByExamTypeName(data.examTypes,unique[i]))
                .reduce((a, b) => a + b, 0);

            console.log(gradeRow);

            if ((grandSum!='')&&(grandWeightCount>0)) {
                let grandAverage=grandSum/grandWeightCount;
                gradeRow.push(grandAverage.toFixed(2).toString());
                gradeRow.push(noten.parseFloatToNote(grandAverage));
            }
            else {
                gradeRow.push('');
                gradeRow.push('');
            }
                       
            return gradeRow;
        });
    },

    addExam(backendData) {
        backendData.exams.push('');
        return backendData;
    },

    getWeightByExamTypeName(examTypes, name) {
        let found = examTypes.find(v=>v.id===name);
        if (found!==undefined)
            return found.weight;
        else 
            return 0;
    },
    
    /// Transform a note entry to a numerical value
    parseNote: (note) => {
        let val=null;
        if (typeof(note) === "number")
            val=note;
        else if (typeof(note) === "string") {
            if (/^[1-6][+\-]$/.test(note))
                val=parseFloat(note.substr(0,1))+(note.substr(1,2)=="+"?(-0.25):0.25);
            else if (/^[1-6]\-[1-6]$/.test(note)) {
                val=parseFloat(note.substr(0,1));
                if (val+1===parseFloat(note.substr(2,1)))
                    val+=0.5;
                else
                    val=null;
            }
            else if (/^[0-9]*[\.0-9]*$/.test(note)) {
                val = parseFloat(note.trim());
                if (isNaN(val))
                    val=null;
            }
        }
        return val;
    },

    parseFloatToNote(floatNote) {
        let integer=Math.floor(floatNote+(0.25+0.5)/2);
        let decimal=floatNote-Math.floor(floatNote);
        let stringNote=integer.toString();

        if (decimal<=(0+0.25)/2) {} // do nothing
        else if (decimal<=(0.25+0.5)/2)
            stringNote+="-";
        else if (decimal<=(0.5+0.75)/2)
            stringNote+="-"+(integer+1).toString();
        else if (decimal<=(0.75+1)/2)
            stringNote+="+";
        return stringNote;
    },

    isEmptyCol: (data, colindex) => {
        let empty=0;
        for (let r=0;r<data.length;r++) {
            if (data[r][colindex].toString().trim()==="")
                empty++;
        }
        return empty===data.length;
    },

    addEmptyColIfNeeded: (data) => {
        if (!Array.isArray(data) || !Array.isArray(data[0]) || data[0].length<2)
            return;

        if (!noten.isEmptyCol(data,data[0].length-2)) {
            for (let r=0;r<data.length;r++) {
                data[r].splice(data[r].length-1,0,'');
            }   
        }
    }
}