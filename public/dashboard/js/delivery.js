(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();

var Add_area = document.getElementById("add_delivery_data");

Add_area.addEventListener("click", function() {
    var user_name = document.getElementById("user_name").value;
    var user_phone = document.getElementById("user_phone").value;
    var user_email = document.getElementById("user_email").value;
    var user_password = document.getElementById("password").value;

    if (user_name == null || user_name == "") {
        swal({
            text: "please enter username....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (user_email == null || user_email == "") {
        swal({
            text: "please enter email....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (user_phone == null || user_phone == "") {
        swal({
            text: "please enter phone....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (user_password == null || user_password == "") {
        swal({
            text: "please enter password....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (user_phone.length != 10) {
        swal({
            text: "please enter valid phone....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email)) {
        swal({
            text: "please enter valid email....",
            button: false,
            closeOnClickOutside: true,
        });
    } else {
        swal({
            text: "please wait....",
            button: false,
        });
        var flag = 0;

        db.collection("delivery man")
            .get()
            .then(function(doc) {
                doc.forEach((element) => {
                    if (element.data().phone == user_phone) {
                        swal({
                            text: "this phone number already exist....",
                            button: false,
                            closeOnClickOutside: true,
                        });
                        flag = 1;
                    }
                    if (element.data().email == user_email) {
                        swal({
                            text: "this email number already exist....",
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
                        uname: user_name,
                        email: user_email,
                        phone: user_phone,
                        password: user_password,
                        date: today,
                    };

                    db.collection("delivery man")
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

    db.collection("delivery man")
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
db.collection("delivery man").onSnapshot(function(doc) {
    temp = "";
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().uname + "</td>";
        temp += "<td>" + element.data().phone + "</td>";
        temp += "<td>" + element.data().email + "</td>";

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
    document.getElementById("delivery_man_data").innerHTML = temp;
    document.getElementById("a_data").style.display = "none";
    document.getElementById("abc").style.display = "block";
});