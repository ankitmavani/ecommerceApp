(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();

var s = 0;
db.collection("Customer Order").onSnapshot(function(doc) {
    doc.forEach((element) => {
        s++;
    });
    document.getElementById("order").innerHTML = s;
});

db.collection("Customer Order")
    .where("status", "==", "Pending")
    .onSnapshot(function(doc) {
        s = 0;
        doc.forEach((element) => {
            s++;
        });
        document.getElementById("pendding_order").innerHTML = s;
    });
db.collection("Customer Order")
    .where("status", "==", "Complete")
    .onSnapshot(function(doc) {
        s = 0;
        doc.forEach((element) => {
            s++;
        });
        document.getElementById("complete_order").innerHTML = s;
    });
db.collection("Customer Order")
    .where("status", "==", "cancelled")
    .onSnapshot(function(doc) {
        s = 0;
        doc.forEach((element) => {
            s++;
        });
        document.getElementById("cancelled_order").innerHTML = s;
    });
db.collection("Product").onSnapshot(function(doc) {
    s = 0;
    doc.forEach((element) => {
        s++;
    });
    document.getElementById("product").innerHTML = s;
});
// db.collection("Dashboard").onSnapshot(function(d) {
//     d.forEach((element) => {
//         document.getElementById("total_sale").innerHTML = element.data().total_sale;
//     });
// });

var temp = "";
var sno = parseInt(1);
db.collection("Customer Order").onSnapshot(function(doc) {
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().orderid + "</td>";
        temp += "<td>" + element.data().DateTime + "</td>";
        //temp += "<td>" + element.data().cid + "</td>";
        // console.log();
        // var name = "";
        // // console.log(element.data().cid);
        // await db.collection("Product")
        //     .doc(element.data().productid)
        //     .onSnapshot(function(doc) {
        //         name = doc.data().product_name;
        //         console.log(doc.data().product_name);
        //     });
        temp += "<td style='width:400px;'>" + element.data().pname + "</td>";
        temp +=
            "<td style='line-height: 2.2' class='text-warning h6'>" +
            element.data().status +
            "</td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletedata(\"" +
            element.id +
            "\")'>" +
            "delete" +
            "</button></td>";
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

function deletedata(ID) {
    db.collection("Customer Order")
        .doc(ID)
        .delete()
        .then(function() {
            alert("delete data");
            location.reload();
        });
}

document.getElementById("btn").addEventListener("click", function() {
    queryText = document.getElementById("search").value;
    db.collection("Customer Order")
        .where("orderid", ">=", parseInt(queryText))
        .where("orderid", "<=", parseInt(queryText + "\uf8ff"))
        .onSnapshot(function(doc) {
            console.log(doc);
            var temp = "";
            var sno = 1;
            doc.forEach((element) => {
                temp += "<tr style='line-height: 2.5'>";
                temp += "<td>" + sno + "</td>";
                temp += "<td>" + element.data().orderid + "</td>";
                temp += "<td>" + element.data().DateTime + "</td>";
                //temp += "<td>" + element.data().cid + "</td>";
                // console.log();
                temp += "<td style='width:400px;'>" + element.data().pname + "</td>";

                temp +=
                    "<td style='line-height: 2.2' class='text-warning h6'>" +
                    element.data().status +
                    "</td>";
                temp +=
                    "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletedata(\"" +
                    element.id +
                    "\")'>" +
                    "delete" +
                    "</button></td>";
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