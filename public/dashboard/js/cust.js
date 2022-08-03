(function() {
    "use strict";
    feather.replace();
    // Graphs
})();

var db = firebase.firestore();

var url = window.location;
var ur = new URL(url);
var main_id = ur.searchParams.get("id");
var temp = "";
var sno = 1;
db.collection("Userdata")
    .doc(main_id)
    .collection("Myorder")
    .onSnapshot(function(d) {
        d.forEach((element) => {
            console.log(element.data().orderdocid);

            db.collection("Customer Order")
                .doc(element.data().orderdocid)
                .onSnapshot(function(doc) {
                    console.log(doc);
                    //doc.forEach((ele) => {
                    temp += "<tr style='line-height: 2.5'>";
                    temp += "<td>" + sno + "</td>";
                    temp += "<td>" + doc.data().pname + "</td>";
                    temp += "<td>" + doc.data().pcolor + "</td>";
                    temp += "<td>" + doc.data().pamount + "</td>";
                    temp +=
                        "<td style='line-height: 2.2' class='text-warning h6'>" +
                        doc.data().status +
                        "</td>";
                    temp +=
                        "<td><button type='button' class='btn btn-primary px-2 py-1'><a href='file:///G:/Project/bootstrap-4.5.0-examples/dashboard/dashboard1.html?id=" +
                        doc.data().orderid +
                        "'>" +
                        "Edit" +
                        "</a></button></td></tr>";

                    sno++;
                    // });
                    document.getElementById("_data").innerHTML = temp;
                    // });
                });
        });
    });