
var noten = {
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

    isEmptyCol: (data, colindex) => {
        let empty=0;
        for (let r=0;r<data.length;r++) {
            console.log(">"+data[r][colindex].toString().trim());
            if (data[r][colindex].toString().trim()==="")
                empty++;
        }
        return empty===data.length;
    },

    addEmptyColIfNeeded: (data) => {
        console.log(data);
        if (!Array.isArray(data) || !Array.isArray(data[0]) || data[0].length<2)
            return;

        if (!noten.isEmptyCol(data,data[0].length-2)) {
            for (let r=0;r<data.length;r++) {
                data[r].splice(data[r].length-1,0,'');
            }   
        }
    }
}