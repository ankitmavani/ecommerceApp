(function() {
    "use strict";
    feather.replace();
    // Graphs
})();

var db = firebase.firestore();
var temp = "";
var sno = parseInt(1);

sta = document.getElementById("category").value;

document.getElementById("category").addEventListener("change", function() {
    sta = document.getElementById("category").value;
    db.collection("Customer Order")
        .where("status", "==", sta)
        .onSnapshot(function(doc) {
            temp = "";
            doc.forEach((element) => {
                temp += "<tr style='line-height: 2.5'>";
                temp += "<td>" + sno + "</td>";
                temp += "<td>" + element.data().orderid + "</td>";
                temp += "<td>" + element.data().pname + "</td>";
                // /db.collection("Product").doc(doc.data().p).onSnapshot(function(doc) {

                // });
                // temp += "<td>" + element.data().Datetime + "</td>";
                temp += "<td>" + element.data().cid + "</td>";
                temp +=
                    "<td style='line-height: 2.2' class='text-warning h6'>" +
                    element.data().status +
                    "</td>";
                temp +=
                    "<td><button type='button' class='btn btn-primary px-2 py-1'><a href='dashboard1.html?id=" +
                    element.data().orderid +
                    "'>" +
                    "Edit" +
                    "</a></button></td></tr>";
                sno++;
            });
            document.getElementById("data").innerHTML = temp;
        });
});

db.collection("Customer Order")
    .where("status", "==", sta)
    .onSnapshot(function(doc) {
        temp = "";
        doc.forEach((element) => {
            temp += "<tr style='line-height: 2.5'>";
            temp += "<td>" + sno + "</td>";
            temp += "<td>" + element.data().orderid + "</td>";
            temp += "<td>" + element.data().pname + "</td>";
            // /db.collection("Product").doc(doc.data().p).onSnapshot(function(doc) {

            // });
            // temp += "<td>" + element.data().Datetime + "</td>";
            temp += "<td>" + element.data().cid + "</td>";
            temp +=
                "<td style='line-height: 2.2' class='text-warning h6'>" +
                element.data().status +
                "</td>";
            temp +=
                "<td><button type='button' class='btn btn-primary px-2 py-1'><a href='dashboard1.html?id=" +
                element.data().orderid +
                "'>" +
                "Edit" +
                "</a></button></td></tr>";
            sno++;
        });
        document.getElementById("data").innerHTML = temp;
    });