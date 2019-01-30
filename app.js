var loadData = () => {
    let data=localStorage.getItem("gradiant");
    if ((data !==null) && (data !== undefined) && (typeof data === 'object')) {
        let jsonData=JSON.parse(data);
        if ("classes" in jsonData)
            return jsonData;
    }
    else 
        return {
            classes: [{
                id: '6d_2018_2019',
                name: "6d Französisch (18/19)",
                examTypes: [
                    {id: "MÜ", weight: 2},
                    {id: "TE", weight: 1},
                    {id: "KA", weight: 2},
                ],
                students: ["",""],
                exams: ["TE","TE"],
                marks: [{student: "A", grades: ['5+','5+']}],
            },{
                id: '7a_2018_2019',
                name: "7a Englisch (18/19)",
                students:[],
                exams: [],
                marks: [ ],
                examTypes: [
                    {id: "MÜ", weight: 2},
                    {id: "TE", weight: 1},
                    {id: "KA", weight: 2},
                ]
            }],
            config: {
                examTypes: ["KA","TE","MÜ"]
            }
        }
}

var store = {
    debug: true,
    state: {
        backendData: loadData()
    },
    updateBackendWithFrontend(frontendData,class_id) {
        if (this.debug) {
            console.log('updateBackendWithFrontend - '+class_id)
            console.log(frontendData);
        }
        noten.resyncBackend(frontendData,
            this.state.backendData.classes.filter(v=>v.id===class_id)[0])
        this.saveBackend();
    },
    buildFrontendWithBackend(class_id,frontendData) {
        if (this.debug) {
            console.log('buildFrontendWithBackend - '+class_id)
            console.log(frontendData);
        }
        noten.makeDisplayData(frontendData,
            this.state.backendData.classes.filter(v=>v.id===class_id)[0])
    },
    buffer: '',
    saveBackend() {

        function plain(data) {
            if (data === null || typeof data === 'undefined') {
                return data;
            }

            try {
                return JSON.parse(JSON.stringify(data));
            } catch (e) {
                throw 'vue-plain: Parse failed, make sure your parameter can be JSON.stringify';
            }
        };

        let data=JSON.stringify(this.state.backendData);
        if (data!==this.buffer) {
            this.buffer=data;
            localStorage.setItem("gradiant",this.buffer);
            console.log(this.buffer);
        }
    }
  }






var app = new Vue({
    el: '#gradiant-app',
    data: {
        active_element: 'dashboard',
        sel: '',
        //load: loadTheData,
        sharedState: store.state 
    }
})



Vue.component('grade-table', {
    data: function () {
      return {
        count: 0,
        frontenddata: [],
        hot: {},
        sharedState: store.state
      }
    },
    props: ['clazz_id'],
    mounted: function () {
        // `this` points to the vm instance
        console.log(this.$refs.hot);
        //this.makeTable(this.$refs.hot);
        createTable(this.$refs.hot);
        console.log(this.clazz_id);
        loadTable(this.sharedState,this.clazz_id);
    },
    updated: function () {
        // `this` points to the vm instance
        console.log("updated");
        console.log(this.clazz_id);
        loadTable(this.sharedState,this.clazz_id);
    },
    template: '<div><span style="display: none;">{{clazz_id}}</span><div ref="hot" t="clazz"></div></div>'
  })