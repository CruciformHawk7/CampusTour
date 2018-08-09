var loki = require('./lokisrc/lokijs');
var db = new loki('testdb.json');
var recs;
var counter = 0;

updateRecords(); 


function updateRecords() {
    loadCollection('recs', function (recs) {
    //console.log(recs.data);
    this.recs = recs;
    console.log(recs.data);
    recs.data.forEach(element => {
        addRecrd(element.ID, element.Target, element.Direction, element.Asset, element.$loki);
    });
    //var newRecords = { ID:1, Target:2, Direction:"North", Asset:"1.jpg" };
    //recs.insert(newRecords);
    //console.log("New Record", newRecords);
    savedb();
    });
    //getRidOfDb();
}

function loadCollection(colName, callback) {
    db.loadDatabase({}, function () {
        var _collection = db.getCollection(colName);

        if (!_collection) {
            console.log("Collection %s does not exit.", colName);
            _collection = db.addCollection('recs');
        }

        callback(_collection);
    });
}

function addRecrd(id, target, select, asset, count) {
    var p = document.getElementById('TableBody');
    var div = document.createElement('div');
    div.innerHTML = '<div id="content1" style="margin-top: 0px">' + 
        '<div class="bodyItem">' + id + '</div> ' + 
        '<div class="bodyItem" style="left: 20%">' + target +'</div> ' + 
        '<div class="bodyItem" style="left: 40%">' + select + '</div>' + 
        '<div class="bodyItem" style="left: 60%">' + asset + '</div>' +
        '<div class="bodyItem" style="left: 80%">' + count + '</div>' +
        '</div>' + 
        '<input id="Button' + counter + '"type="button" value="Delete" ' + 
        'class="removeButton" onclick ="RemoveElement(this, ' +  count + ')"></input>';
    counter++;
    p.appendChild(div);                
}

function addRecord() {
    var a1 = document.getElementById("ID").value;
    var a2 = document.getElementById("Target").value;
    var a3n = document.getElementById("mySelect").value;
    // use a3n if you want index based select results. 
    var sel = document.getElementById("mySelect"); 
    var a3 = sel.options[sel.selectedIndex].text;
    //use a3 if you want the text as-is
    var a4 = document.getElementById("Asset").value;
    if(a1=="" || a1==null||a2==""||a2==null||a3==""||a3==null||a4==""||a4==null)
    {
        alert("One of the values missing!");
    }
    else      
    {
        var newRecords = { ID:a1, Target:a2, Direction:a3, Asset:a4};
        var lok = recs.insert(newRecords).$loki;
        //var lok = recs.chain().find({ID:a1, Target:a2, Direction:a3, Asset:a4}).$loki;
        console.log(a1 + " " + lok);
        var p = document.getElementById('TableBody');
        var div = document.createElement('div');
        div.innerHTML = '<div id="content1" style="margin-top: 0px">' + 
            '<div class="bodyItem">' + a1 + '</div> ' + 
            '<div class="bodyItem" style="left: 20%">' + a2 +'</div> ' + 
            '<div class="bodyItem" style="left: 40%">' + a3 + '</div>' + 
            '<div class="bodyItem" style="left: 60%">' + a4 + '</div>' +
            '<div class="bodyItem" style="left: 80%">' + lok + '</div>' +
            '</div>' + 
            '<input id="Button' + counter + '"type="button" value="Delete" ' + 
            'class="removeButton" onclick ="RemoveElement(this, ' +  lok + ')"></input>';
        counter++;
        p.appendChild(div); 
        savedb();               
    }    
}
function RemoveElement(div, counr) {
    recs.chain().find({$loki: counr}).remove();
    document.getElementById("TableBody").removeChild(div.parentNode);   
    counter--;
    console.log(recs.data);
    savedb();
}

function savedb() {
    db.saveDatabase(function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("saved");
        }
        });
}

function getRidOfDb() {
    var res = confirm("Are you sure you want to clear?");
    if (res == true) {
        recs.clear();
        console.log("Deleted");
        console.log(recs.data);
        savedb();
        window.location.reload();
    }
}