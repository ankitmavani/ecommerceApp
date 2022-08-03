(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();

var te = "";
db.collection("Brand").onSnapshot(function(d) {
    d.forEach((ele) => {
        te +=
            "<option value='" +
            ele.data().brand_name +
            "'>" +
            ele.data().brand_name +
            "</option>";
    });
    document.getElementById("_data").innerHTML = te;
});

var detail_data = [];
var la = [];
var b = "";
document.getElementById("add").addEventListener('click', function() {
    var brand_name = document.getElementById("_data").value;
    var layout = document.getElementById("data").value;

    if (brand_name == null || brand_name == "") {
        alert("please select brand name");
    } else if (layout == null || layout == "") {
        alert("select layout grid");
    } else {
        //la.push(layout);
        detail_data.push(brand_name);
        la.push(layout);
        db.collection("layout").doc(b).update({ brand: detail_data, type: la }).then(function() {
            alert("successful");
            location.reload();
        });
        detail_data = [];
    }

});


var a = "";
var sno = 1;
db.collection("layout").onSnapshot(function(doc) {
    doc.forEach(element => {
        detail_data = detail_data.concat(element.data().brand);
        la = la.concat(element.data().type);

        for (let index = 0; index < detail_data.length; index++) {
            b = element.id;
            a += "<tr style='line-height: 2.5'>";
            a += "<td>" + sno + "</td>";
            a += "<td>" + detail_data[index] + "</td>";
            a += "<td>" + la[index] + "</td>";
            a +=
                "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletedata(\"" +
                index +
                "\")'>" +
                "delete" +
                "</button></td></tr>";
            sno++;
        }

    });
    document.getElementById("layout_data").innerHTML = a;
});

function deletedata(f) {


    // const index = detail_data.indexOf(f);
    // console.log(index);
    if (f > -1) {
        detail_data.splice(f, 1);
        la.splice(f, 1);
    }
    db.collection("layout").doc(b).update({ brand: detail_data, type: la }).then(function() {
        alert("sa..");
        location.reload();
    });
    // array = [2, 9]


}

var e = "";
var sn = 1;
var d = [];
db.collection("layout").onSnapshot(function(doc) {
    doc.forEach(element => {
        d = d.concat(element.data().category);
        //la = la.concat(element.data().type);

        for (let index = 0; index < d.length; index++) {
            b = element.id;
            e += "<tr style='line-height: 2.5'>";
            e += "<td>" + sn + "</td>";
            e += "<td>" + d[index] + "</td></tr>";

            sn++;
        }

    });
    document.getElementById("category_data").innerHTML = e;
});

var t = "";
db.collection("category").onSnapshot(function(doc) {
    doc.forEach((element) => {
        t +=
            "<option value='" +
            element.data().category_name +
            "'>" +
            element.data().category_name +
            "</option>";
    });
    document.getElementById("c_data").innerHTML = t;
});
var c = [];
document.getElementById("add_data").addEventListener('click', function(doc) {
    c = c.concat(document.getElementById("c_data").value);
    db.collection("layout").doc(b).update({ category: c }).then(function() {
        alert("suc..");
        location.reload();
    });
});