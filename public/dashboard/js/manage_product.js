(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var storageRef = firebase.storage().ref();
var db = firebase.firestore();
var array = [];
var temp = "";
var sno = parseInt(1);
db.collection("Product").onSnapshot(function(doc) {
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().product_name + "</td>";
        temp += "<td>" + element.data().product_sale_price + "</td>";
        temp += "<td>" + element.data().category_name + "</td>";
        temp += "<td>" + element.data().brand_name + "</td>";
        if (element.data().product_active == 1) {
            temp +=
                "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='unctive(\"" +
                element.id +
                "\")'>" +
                "unstock" +
                "</button></td>";
        } else {
            temp +=
                "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='active(\"" +
                element.id +
                "\")'>" +
                "Stock" +
                "</button></td>";
        }
        temp +=
            "<td><button type='button' class='btn btn-success px-2 py-1' onclick='updatedata(\"" +
            element.id +
            "\")'>" +
            "update" +
            "</button></td>";
        temp +=
            "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='deletedata(\"" +
            element.id +
            "\")'>" +
            " <img src='../images/trash-2.svg'>" +
            "</button></td>";
        temp +=
            "<td><button type='button' class='btn btn-info px-2 py-1' onclick='add_color(\"" +
            element.id +
            "\")'>" +
            "color" +
            "</button></td>";
        temp +=
            "<td><button type='button' class='text-white btn btn-warning px-2 py-1' onclick='show(\"" +
            element.id +
            "\")'>" +
            "show" +
            "</button></td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='Review(\"" +
            element.id +
            "\")'>" +
            "Review" +
            "</button></td></tr>";
        //temp += "<td>" + element.data().customer_name + "</td>";
        //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";

        sno++;
    });
    document.getElementById("manage_data").innerHTML = temp;
    document.getElementById("a_data").style.display = "none";
    document.getElementById("abc").style.display = "block";
});

function show(ID) {
    location.replace("show.html?id=" + ID);
}

function Review(ID) {
    location.replace("dumping.html?id=" + ID);
}

function deletedata(ID) {
    // db.collection("Product")
    //     .doc(ID)
    //     .onSnapshot(function(doc) {
    //         db.collection("Search")
    //             .where("name", "==", doc.data().product_name)
    //             .delete()
    //             .then(function(doc) {
    //                 console.log("succ..");
    //             });
    //     });
    swal({
        text: "please wait data deleting....",
        button: false,
    });

    db.collection("Product")
        .doc(ID)
        .delete()
        .then(function() {});
    db.collection("Product")
        .doc(ID)
        .collection("Colors")
        .onSnapshot(function(doc) {
            doc.forEach((element) => {
                db.collection("Product")
                    .doc(ID)
                    .collection("Colors")
                    .doc(element.id)
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
            });
        });
}

function updatedata(ID) {
    location.replace("update_product.html?id=" + ID);
}

function active(ID) {
    swal({
        text: "please wait data updateing....",
        button: false,
    });
    var docdata = {
        product_active: 1,
    };
    db.collection("Product")
        .doc(ID)
        .update(docdata)
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

function unctive(ID) {
    swal({
        text: "please wait data updateing....",
        button: false,
    });
    var docdata = {
        product_active: 0,
    };
    db.collection("Product")
        .doc(ID)
        .update(docdata)
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
var mainid;

function add_color(ID) {
    mainid = ID;
    document.getElementById("dialog_box").show();
}

document.getElementById("image_upload").addEventListener("click", function() {
    var file = document.getElementById("image_select").files[0];

    document.getElementById("image_upload").disabled = true;
    var d = new Date();

    var uploadTask = storageRef
        .child("Product/" + d.getTime() + file.name)
        .put(file);

    uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            document.getElementById("progress_b").style.width = progress + "%";
            document.getElementById("progress").innerHTML = parseInt(progress) + "%";
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log("Upload is paused");
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log("Upload is running");
                    break;
            }
        },
        function(error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case "storage/unauthorized":
                    // User doesn't have permission to access the object
                    break;

                case "storage/canceled":
                    // User canceled the upload
                    break;

                case "storage/unknown":
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                url = downloadURL;
                array.push(url);
                var datai = "";
                for (let index = 0; index < array.length; index++) {
                    datai +=
                        "<div class='col ml-auto text-right border m-2'><img class='w-auto p-2' style='width: 10px; height: 100px;' src='" +
                        array[index] +
                        "'></div>";
                }
                document.getElementById("image_color").innerHTML = datai;
                document.getElementById("image_upload").disabled = false;
            });
        }
    );
});

document.getElementById("add_data").addEventListener("click", function() {
    swal({
        text: "please wait data inserting....",
        button: false,
    });
    var docd = {
        color: document.getElementById("color").value,
        imga: array,
    };

    db.collection("Product")
        .doc(mainid)
        .collection("Colors")
        .add(docd)
        .then(function() {
            document.getElementById("dialog_box").close();
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
});

document.getElementById("cancel").addEventListener("click", function() {
    document.getElementById("dialog_box").close();
    location.reload();
});

document.getElementById("category").addEventListener("change", function() {
    searchdata();
});
document.getElementById("brand").addEventListener("change", function() {
    searchdata();
});
document.getElementById("btn").addEventListener("click", function() {
    document.getElementById("category").value = "select";
    document.getElementById("brand").value = "select";
    searchdata();
});

function searchdata() {
    var cat = document.getElementById("category").value;
    var br = document.getElementById("brand").value;
    var queryText = document.getElementById("search").value;

    document.getElementById("a_data").style.display = "block";
    document.getElementById("abc").style.display = "none";

    if (cat != "select" && br == "select") {
        db.collection("Product")
            .where("category_name", "==", cat)
            .onSnapshot(function(doc) {
                var temp = "";
                var sno = 1;
                doc.forEach((element) => {
                    temp += "<tr style='line-height: 2.5'>";
                    temp += "<td>" + sno + "</td>";
                    temp += "<td>" + element.data().product_name + "</td>";
                    temp += "<td>" + element.data().product_sale_price + "</td>";
                    temp += "<td>" + element.data().category_name + "</td>";
                    temp += "<td>" + element.data().brand_name + "</td>";
                    if (element.data().product_active == 1) {
                        temp +=
                            "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='unctive(\"" +
                            element.id +
                            "\")'>" +
                            "unstock" +
                            "</button></td>";
                    } else {
                        temp +=
                            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='active(\"" +
                            element.id +
                            "\")'>" +
                            "Stock" +
                            "</button></td>";
                    }
                    temp +=
                        "<td><button type='button' class='btn btn-success px-2 py-1' onclick='updatedata(\"" +
                        element.id +
                        "\")'>" +
                        "update" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='deletedata(\"" +
                        element.id +
                        "\")'>" +
                        " <img src='../images/trash-2.svg'>" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-info px-2 py-1' onclick='add_color(\"" +
                        element.id +
                        "\")'>" +
                        "color" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='text-white btn btn-warning px-2 py-1' onclick='show(\"" +
                        element.id +
                        "\")'>" +
                        "show" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='Review(\"" +
                        element.id +
                        "\")'>" +
                        "Review" +
                        "</button></td></tr>";
                    //temp += "<td>" + element.data().customer_name + "</td>";
                    //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";

                    sno++;
                });
                document.getElementById("manage_data").innerHTML = temp;
                document.getElementById("a_data").style.display = "none";
                document.getElementById("abc").style.display = "block";
            });
    } else if (cat == "select" && br != "select") {
        db.collection("Product")

        .where("brand_name", "==", br)
            .onSnapshot(function(doc) {
                console.log(doc);
                var temp = "";
                var sno = 1;
                doc.forEach((element) => {
                    temp += "<tr style='line-height: 2.5'>";
                    temp += "<td>" + sno + "</td>";
                    temp += "<td>" + element.data().product_name + "</td>";
                    temp += "<td>" + element.data().product_sale_price + "</td>";
                    temp += "<td>" + element.data().category_name + "</td>";
                    temp += "<td>" + element.data().brand_name + "</td>";
                    if (element.data().product_active == 1) {
                        temp +=
                            "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='unctive(\"" +
                            element.id +
                            "\")'>" +
                            "unstock" +
                            "</button></td>";
                    } else {
                        temp +=
                            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='active(\"" +
                            element.id +
                            "\")'>" +
                            "Stock" +
                            "</button></td>";
                    }
                    temp +=
                        "<td><button type='button' class='btn btn-success px-2 py-1' onclick='updatedata(\"" +
                        element.id +
                        "\")'>" +
                        "update" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='deletedata(\"" +
                        element.id +
                        "\")'>" +
                        " <img src='../images/trash-2.svg'>" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-info px-2 py-1' onclick='add_color(\"" +
                        element.id +
                        "\")'>" +
                        "color" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='text-white btn btn-warning px-2 py-1' onclick='show(\"" +
                        element.id +
                        "\")'>" +
                        "show" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='Review(\"" +
                        element.id +
                        "\")'>" +
                        "Review" +
                        "</button></td></tr>";
                    //temp += "<td>" + element.data().customer_name + "</td>";
                    //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";

                    sno++;
                });
                document.getElementById("manage_data").innerHTML = temp;
                document.getElementById("a_data").style.display = "none";
                document.getElementById("abc").style.display = "block";
            });
    } else if (cat != "select" && br != "select") {
        db.collection("Product")
            .where("category_name", "==", cat)
            .where("brand_name", "==", br)
            .onSnapshot(function(doc) {
                console.log(doc);
                var temp = "";
                var sno = 1;
                doc.forEach((element) => {
                    temp += "<tr style='line-height: 2.5'>";
                    temp += "<td>" + sno + "</td>";
                    temp += "<td>" + element.data().product_name + "</td>";
                    temp += "<td>" + element.data().product_sale_price + "</td>";
                    temp += "<td>" + element.data().category_name + "</td>";
                    temp += "<td>" + element.data().brand_name + "</td>";
                    if (element.data().product_active == 1) {
                        temp +=
                            "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='unctive(\"" +
                            element.id +
                            "\")'>" +
                            "unstock" +
                            "</button></td>";
                    } else {
                        temp +=
                            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='active(\"" +
                            element.id +
                            "\")'>" +
                            "Stock" +
                            "</button></td>";
                    }
                    temp +=
                        "<td><button type='button' class='btn btn-success px-2 py-1' onclick='updatedata(\"" +
                        element.id +
                        "\")'>" +
                        "update" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='deletedata(\"" +
                        element.id +
                        "\")'>" +
                        " <img src='../images/trash-2.svg'>" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-info px-2 py-1' onclick='add_color(\"" +
                        element.id +
                        "\")'>" +
                        "color" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='text-white btn btn-warning px-2 py-1' onclick='show(\"" +
                        element.id +
                        "\")'>" +
                        "show" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='Review(\"" +
                        element.id +
                        "\")'>" +
                        "Review" +
                        "</button></td></tr>";
                    //temp += "<td>" + element.data().customer_name + "</td>";
                    //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";

                    sno++;
                });
                document.getElementById("manage_data").innerHTML = temp;
                document.getElementById("a_data").style.display = "none";
                document.getElementById("abc").style.display = "block";
            });
    } else {
        db.collection("Product")
            .where("product_name", ">=", queryText)
            .where("product_name", "<=", queryText + "\uf8ff")
            .onSnapshot(function(doc) {
                console.log(doc);
                var temp = "";
                var sno = 1;
                doc.forEach((element) => {
                    temp += "<tr style='line-height: 2.5'>";
                    temp += "<td>" + sno + "</td>";
                    temp += "<td>" + element.data().product_name + "</td>";
                    temp += "<td>" + element.data().product_sale_price + "</td>";
                    temp += "<td>" + element.data().category_name + "</td>";
                    temp += "<td>" + element.data().brand_name + "</td>";
                    if (element.data().product_active == 1) {
                        temp +=
                            "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='unctive(\"" +
                            element.id +
                            "\")'>" +
                            "unstock" +
                            "</button></td>";
                    } else {
                        temp +=
                            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='active(\"" +
                            element.id +
                            "\")'>" +
                            "Stock" +
                            "</button></td>";
                    }
                    temp +=
                        "<td><button type='button' class='btn btn-success px-2 py-1' onclick='updatedata(\"" +
                        element.id +
                        "\")'>" +
                        "update" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-danger px-2 py-1' onclick='deletedata(\"" +
                        element.id +
                        "\")'>" +
                        " <img src='../images/trash-2.svg'>" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-info px-2 py-1' onclick='add_color(\"" +
                        element.id +
                        "\")'>" +
                        "color" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='text-white btn btn-warning px-2 py-1' onclick='show(\"" +
                        element.id +
                        "\")'>" +
                        "show" +
                        "</button></td>";
                    temp +=
                        "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='Review(\"" +
                        element.id +
                        "\")'>" +
                        "Review" +
                        "</button></td></tr>";
                    //temp += "<td>" + element.data().customer_name + "</td>";
                    //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";

                    sno++;
                });
                document.getElementById("manage_data").innerHTML = temp;
                document.getElementById("a_data").style.display = "none";
                document.getElementById("abc").style.display = "block";
            });
    }
}
var te = "";
te += "<option value='" + "select" + "'>" + "select Brand name" + "</option>";
db.collection("Brand").onSnapshot(function(d) {
    d.forEach((ele) => {
        te +=
            "<option value='" +
            ele.data().brand_name +
            "'>" +
            ele.data().brand_name +
            "</option>";
    });
    document.getElementById("brand").innerHTML = te;
});

var tea = "";
tea +=
    "<option value='" + "select" + "'>" + "select category name" + "</option>";
db.collection("category").onSnapshot(function(d) {
    d.forEach((ele) => {
        tea +=
            "<option value='" +
            ele.data().category_name +
            "'>" +
            ele.data().category_name +
            "</option>";
    });
    document.getElementById("category").innerHTML = tea;
});