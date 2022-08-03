(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();
var url = window.location;
var ur = new URL(url);
var id = ur.searchParams.get("id");
var temp = "";
var sno = 1;

db.collection("category")
    .doc(id)
    .onSnapshot(function(doc) {
        document.getElementById("heading").innerHTML =
            "<h1 class='h2'>" + doc.data().category_name + "</h1>";
    });

db.collection("category")
    .doc(id)
    .collection("subcategory")
    .onSnapshot(function(doc) {
        doc.forEach((element) => {
            temp += "<tr style='line-height: 2.5'>";
            temp += "<td>" + sno + "</td>";
            temp += "<td>" + element.data().name + "</td>";
            // temp += "<td>" + element.data().DateTime + "</td>";
            temp +=
                "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletedata(\"" +
                element.id +
                "\")'>" +
                "delete" +
                "</button></td></tr>";
            sno++;
        });
        document.getElementById("data").innerHTML = temp;
        document.getElementById("a_data").style.display = "none";
        document.getElementById("abc").style.display = "block";
    });

function deletedata(ID) {
    swal({
        text: "please wait data deleting....",
        button: false,
    });
    db.collection("category")
        .doc(id)
        .collection("subcategory")
        .doc(ID)
        .delete()
        .then(function() {
            swal({
                icon: "warning",
                title: "Delete Document",
                text: "Document successfully deleting..!",
            }).then((value) => {
                // swal(`The returned value is: ${value}`);
                location.reload();
            });
        });
}