(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();
var storageRef = firebase.storage();

var filebutttn = document.getElementById("brand_image");
var url;
// Create the file metadata
var metadata = {
    contentType: "image/jpeg",
};

filebutttn.addEventListener("change", function(e) {
    var file = e.target.files[0];

    var d = new Date();
    document.getElementById("brand_btn").disabled = true;
    var uploadTask = storageRef
        .ref()
        .child("Brand/" + d.getTime() + file.name)
        .put(file);

    uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            document.getElementById("progress").style.width = progress + "%";
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
                document.getElementById("img").src = url;
                document.getElementById("brand_btn").disabled = false;
            });
        }
    );
});

function upload() {
    var brand_name = document.getElementById("brand_name").value;

    if (brand_name == null || brand_name == "") {
        swal({
            text: "please enter Brand name....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (url == null || url == "") {
        swal({
            text: "please select image....",
            button: false,
            closeOnClickOutside: true,
        });
    } else {
        swal({
            text: "please wait data inserting....",
            button: false,
        });
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + "/" + mm + "/" + yyyy;
        var docData = {
            brand_name: brand_name,
            brand_url: url,
            set_feature_brand: 0,
            set_feature_brand_image: null,
            set_special_offer: 0,
            date: today,
        };

        db.collection("Brand")
            .add(docData)
            .then(function() {
                db.collection("Search")
                    .add({ name: brand_name })
                    .then(function(doc) {
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
    }
}

// function deletedata(ID) {
//     console.log(ID);
//     db.collection("category")
//         .doc(ID)
//         .onSnapshot(function(doc) {
//             storageRef
//                 .getReferenceFromUrl(doc.data().category_url)
//                 .delete()
//                 .then(function() {
//                     alert("delete");
//                 });
//         });
//     db.collection("category")
//         .doc(ID)
//         .delete()
//         .then(function() {
//             alert("delete data");
//         });
// }

function setfeaturebrand(ID) {
    document.getElementById("set_brand").showModal();
    var set_image;
    document.getElementById("set_image").addEventListener("change", function(e) {
        var file = e.target.files[0];
        var flag = 0;
        var d = new Date();

        var uploadTask = storageRef
            .ref()
            .child("Brand/set feature Brand/" + d.getTime() + file.name)
            .put(file, metadata);

        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                document.getElementById("progress_bar").style.width = progress + "%";
                document.getElementById("progress_bar").innerHTML =
                    parseInt(progress) + "%";
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
                swal({
                    text: "please wait data deleting....",
                    button: false,
                });
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    set_image = downloadURL;
                    document.getElementById("image").src = set_image;
                    var docdata2 = {
                        set_feature_brand: 0,
                        set_feature_brand_image: null,
                    };
                    var docData = {
                        set_feature_brand: 1,
                        set_feature_brand_image: set_image,
                    };

                    db.collection("Brand")
                        .where("set_feature_brand", "==", 1)
                        .get()
                        .then(function(d) {
                            d.forEach((element) => {
                                db.collection("Brand")
                                    .doc(element.id)
                                    .update(docdata2)
                                    .then(function() {
                                        flag = 1;

                                        db.collection("Brand")
                                            .doc(ID)
                                            .update(docData)
                                            .then(function() {
                                                document.getElementById("set_brand").close();
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
                            });
                        });
                    flag = 1;
                });
            }
        );
    });
}

function update(ID) {
    document.getElementById("set").showModal();
    var set_image;
    document.getElementById("set1").addEventListener("change", function(e) {
        var file = e.target.files[0];

        var d = new Date();

        var uploadTask = storageRef
            .ref()
            .child("Brand/" + d.getTime() + file.name)
            .put(file);

        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                document.getElementById("progress_bar1").style.width = progress + "%";
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
                    set_image = downloadURL;
                    document.getElementById("image1").src = set_image;
                    var docdata2 = {
                        brand_url: set_image,
                    };

                    db.collection("Brand")
                        .doc(ID)
                        .update(docdata2)
                        .then(function() {
                            document.getElementById("set").close();
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
            }
        );
    });
}

// function disoffer(ID) {
//     console.log(ID);
//     var docdata = {
//         set_special_offer: 0,
//     };
//     db.collection("Brand")
//         .doc(ID)
//         .update(docdata)
//         .then(function() {
//             console.log("Document update written!");
//             location.reload();
//         });
// }

// function setoffer(ID) {
//     console.log(ID);
//     var docdata = {
//         set_special_offer: 1,
//     };
//     db.collection("Brand")
//         .doc(ID)
//         .update(docdata)
//         .then(function() {
//             console.log("Document update written!");
//             location.reload();
//         });
// }

function deletebrand(ID) {
    swal({
        text: "please wait data deleting....",
        button: false,
    });
    db.collection("Brand")
        .doc(ID)
        .onSnapshot(function(doc) {
            // db.collection("Search")
            //     .where("name", "==", doc.data().brand_name)
            //     .delete()
            //     .then(function(doc) {
            //         console.log("succ..");
            //     });
            storageRef
                .refFromURL(doc.data().brand_url)
                .delete()
                .then(function() {});
            db.collection("Brand")
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
        });
}

var temp = "";
var sno = parseInt(1);
db.collection("Brand").onSnapshot(function(doc) {
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().brand_name + "</td>";
        temp +=
            "<td><img style='width:auto; height:100px;' src='" +
            element.data().brand_url +
            "'>" +
            "</td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='setfeaturebrand(\"" +
            element.id +
            "\")'>" +
            "setbrand" +
            "</a></button></td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='update(\"" +
            element.id +
            "\")'>" +
            "Update" +
            "</button></td>";
        console.log(element.id);
        //temp += "<td>" + element.data().customer_name + "</td>";
        //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1'onclick='deletebrand(\"" +
            element.id +
            "\")'>" +
            "delete" +
            "</button></td></tr>";

        sno++;
    });
    document.getElementById("brand_data").innerHTML = temp;
    document.getElementById("a_data").style.display = "none";
    document.getElementById("abc").style.display = "block";
});

document.getElementById("btn").addEventListener("click", function() {
    queryText = document.getElementById("search").value;
    db.collection("Brand")
        .where("brand_name", ">=", queryText)
        .where("brand_name", "<=", queryText + "\uf8ff")
        .onSnapshot(function(doc) {
            console.log(doc);
            var temp = "";
            var sno = 1;
            doc.forEach((element) => {
                temp += "<tr style='line-height: 2.5'>";
                temp += "<td>" + sno + "</td>";
                temp += "<td>" + element.data().brand_name + "</td>";
                temp +=
                    "<td><img style='width:125px; height:100px;' src='" +
                    element.data().brand_url +
                    "'>" +
                    "</td>";
                temp +=
                    "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='setfeaturebrand(\"" +
                    element.id +
                    "\")'>" +
                    "setbrand" +
                    "</a></button></td>";
                if (element.data().set_special_offer == 0) {
                    temp +=
                        "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='setoffer(\"" +
                        element.id +
                        "\")'>" +
                        "setoffer" +
                        "</a></button></td>";
                } else {
                    temp +=
                        "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='disoffer(\"" +
                        element.id +
                        "\")'>" +
                        "disoffer" +
                        "</a></button></td>";
                }
                console.log(element.id);
                //temp += "<td>" + element.data().customer_name + "</td>";
                //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
                temp +=
                    "<td><button type='button' class='btn btn-primary px-2 py-1'onclick='deletebrand(\"" +
                    element.id +
                    "\")'>" +
                    "delete" +
                    "</button></td></tr>";

                sno++;
            });
            document.getElementById("brand_data").innerHTML = temp;
        });
});