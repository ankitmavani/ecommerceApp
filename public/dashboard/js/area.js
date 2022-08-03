(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();

var Add_area = document.getElementById("add_area");

Add_area.addEventListener("click", function() {
    var name = document.getElementById("area_name").value;
    var charge = document.getElementById("shipping_fees").value;
    //var delivery_time = document.getElementById("area_delivery_time").value;

    if (name == null || name == "") {
        swal({
            text: "please enter name....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (charge == null || charge == "") {
        swal({
            text: "please enter charge....",
            button: false,
            closeOnClickOutside: true,
        });
    } else {
        swal({
            text: "please wait....",
            button: false,
        });
        var flag = 0;
        db.collection("Area")
            .get()
            .then(function(doc) {
                doc.forEach((element) => {
                    if (element.data().name == name) {
                        swal({
                            text: "this phone number already exist....",
                            button: false,
                            closeOnClickOutside: true,
                        });
                        flag = 1;
                    }
                });
                if (flag == 0) {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, "0");
                    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
                    var yyyy = today.getFullYear();

                    today = dd + "/" + mm + "/" + yyyy;

                    var docData = {
                        name: name,
                        charge: charge,
                        date: today,
                    };
                    db.collection("Area")
                        .add(docData)
                        .then(function() {
                            swal({
                                icon: "success",
                                title: "Good job!",
                                text: "Document successfully written!",
                            }).then((value) => {
                                // document.getElementById("dialog").close();
                                // swal(`The returned value is: ${value}`);
                                location.reload();
                            });
                        });
                }
            });
    }
});

function deletedata(ID) {
    swal({
        text: "please wait data deleting....",
        button: false,
    });

    db.collection("Area")
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

var temp = "";
var sno = parseInt(1);
db.collection("Area").onSnapshot(function(doc) {
    temp = "";
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().name + "</td>";
        // temp += "<td>" + element.data().delivery_time + "</td>";
        temp += "<td>" + element.data().charge + "</td>";
        temp += "<td>" + element.data().date + "</td>";
        temp +=
            "<td><button type='button' onClick='deletedata(\"" +
            element.id +
            "\")'" +
            "class='btn btn-primary px-2 py-1'>" +
            "delete" +
            "</button></td></tr>";
        // console.log(element.id);
        // //temp += "<td>" + element.data().customer_name + "</td>";
        // //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
        // temp +=
        //     "<td><button type='button' class='btn btn-primary px-2 py-1'><a href='file:///G:/Project/bootstrap-4.5.0-examples/dashboard/delete.html?id=" +
        //     element.id +
        //     "'>" +
        //     "Edit" +
        //     "</a></button></td></tr>";

        sno++;
    });

    document.getElementById("area_data").innerHTML = temp;
    document.getElementById("a_data").style.display = "none";
    document.getElementById("abc").style.display = "block";
});

// document.getElementById("click").addEventListener("click", function() {
//     console.log(document.getElementById("id1").value);
// });
// document.addEventListener("DOMContentLoaded", async function() {
//     //const db = firebase.firestore();

//     const searchByName = async({
//         search = "",
//         limit = 50,
//         lastNameOfLastPerson = "",
//     } = {}) => {
//         const snapshot = await db
//             .collection("Area")
//             .where("keywords", "array-contains", search.toLowerCase())
//             .orderBy("name")
//             .startAfter(lastNameOfLastPerson)
//             .limit(limit)
//             .get();
//         return snapshot.docs.reduce((acc, doc) => {
//             const name = doc.data().name;
//             return acc.concat(`
//           <tr>
//             <td>${name.last}</td>
//             <td>${name.first}</td>
//             <td>${name.middle}</td>
//             <td>${name.suffix}</td>
//           </tr>`);
//         }, "");
//     };

//     const textBoxSearch = document.querySelector("#textBoxSearch");

//     const rowsPeople = document.querySelector("#area_data");
//     area_data.innerHTML = await searchByName();

//     textBoxSearch.addEventListener(
//         "keyup",
//         async(e) =>
//         (area_data.innerHTML = await searchByName({ search: e.target.value }))
//     );

//     async function lazyLoad() {
//         const scrollIsAtTheBottom =
//             document.documentElement.scrollHeight - window.innerHeight ===
//             window.scrollY;
//         if (scrollIsAtTheBottom) {
//             const lastNameOfLastPerson =
//                 area_data.lastChild.firstElementChild.textContent;

//             area_data.innerHTML += await searchByName({
//                 search: textBoxSearch.value,
//                 lastNameOfLastPerson: lastNameOfLastPerson,
//             });
//         }
//     }
//     window.addEventListener("scroll", lazyLoad);
// });

document.getElementById("btn").addEventListener("click", function() {
    document.getElementById("a_data").style.display = "block";
    document.getElementById("abc").style.display = "none";

    queryText = document.getElementById("search").value;
    db.collection("Area")
        .where("name", ">=", queryText)
        .where("name", "<=", queryText + "\uf8ff")
        .onSnapshot(function(doc) {
            console.log(doc);
            var temp = "";
            var sno = 1;
            doc.forEach((element) => {
                temp += "<tr style='line-height: 2.5'>";
                temp += "<td>" + sno + "</td>";
                temp += "<td>" + element.data().name + "</td>";
                // temp += "<td>" + element.data().delivery_time + "</td>";
                temp += "<td>" + element.data().charge + "</td>";
                temp += "<td>" + element.data().date + "</td>";
                temp +=
                    "<td><button type='button' onClick='deletedata(\"" +
                    element.id +
                    "\")'" +
                    "class='btn btn-primary px-2 py-1'>" +
                    "delete" +
                    "</button></td></tr>";
                // console.log(element.id);
                // //temp += "<td>" + element.data().customer_name + "</td>";
                // //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
                // temp +=
                //     "<td><button type='button' class='btn btn-primary px-2 py-1'><a href='file:///G:/Project/bootstrap-4.5.0-examples/dashboard/delete.html?id=" +
                //     element.id +
                //     "'>" +
                //     "Edit" +
                //     "</a></button></td></tr>";

                sno++;
            });
            document.getElementById("area_data").innerHTML = temp;
            document.getElementById("a_data").style.display = "none";
            document.getElementById("abc").style.display = "block";
        });
});