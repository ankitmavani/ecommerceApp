(function() {
    "use strict";
    feather.replace();
})();

var db = firebase.firestore();
var temp = "";
var sno = 1;
db.collection("Userdata").onSnapshot(function(doc) {
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().Name + "</td>";
        temp +=
            "<td><a href='mailto:" +
            element.data().Email +
            "'>" +
            element.data().Email +
            "</a></td>";
        temp +=
            "<td><a href='tel:" +
            element.data().Monumber +
            "'>" +
            element.data().Monumber +
            "</a></td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='show(\"" +
            element.id +
            "\")'>" +
            "show" +
            "</button></td>";
        sno++;
    });
    document.getElementById("customer_data").innerHTML = temp;
    document.getElementById("a_data").style.display = "none";
    document.getElementById("abc").style.display = "block";
});

function show(ID) {
    location.replace("cust.html?id=" + ID);
}