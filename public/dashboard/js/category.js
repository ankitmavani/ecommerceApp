(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();
var storageRef = firebase.storage();

var filebutttn = document.getElementById("myfile");
var url;
// Create the file metadata

filebutttn.addEventListener("change", function(e) {
    var file = e.target.files[0];

    var d = new Date();
    document.getElementById("submit_category").disabled = true;
    var uploadTask = storageRef
        .ref()
        .child("images/" + d.getTime() + file.name)
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
                document.getElementById("submit_category").disabled = false;
                //document.getElementById("submit_category").style.display = "block";
            });
        }
    );
});

function upload() {
    var category_name = document.getElementById("category_name").value;

    if (category_name == null || category_name == "") {
        swal({
            text: "please enter category name....",
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
            text: "please wait data deleting....",
            button: false,
        });
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + "/" + mm + "/" + yyyy;
        var docData = {
            category_name: category_name,
            category_url: url,
            date: today,
        };

        db.collection("category")
            .add(docData)
            .then(function() {
                db.collection("Search")
                    .add({ name: category_name })
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

function deletecategory(ID) {
    swal({
        text: "please wait data deleting....",
        button: false,
    });
    db.collection("category")
        .doc(ID)
        .onSnapshot(function(doc) {
            // db.collection("Search")
            //     .where("name", "==", doc.data().category_name)
            //     .delete()
            //     .then(function(doc) {
            //         console.log("succ..");
            //     });
            storageRef
                .refFromURL(doc.data().category_url)
                .delete()
                .then(function() {});
            db.collection("category")
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
db.collection("category").onSnapshot(function(doc) {
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().category_name + "</td>";
        temp +=
            "<td><img style='width:auto; height:100px;' src='" +
            element.data().category_url +
            "'>" +
            "</td>";
        temp += "<td>" + element.data().date + "</td>";
        console.log(element.id);
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='subcategory(\"" +
            element.id +
            "\")'>" +
            "sub category" +
            "</button></td>";

        //temp += "<td>" + element.data().customer_name + "</td>";
        //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletecategory(\"" +
            element.id +
            "\")'>" +
            "Delete" +
            "</button></td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1'><a class='text-decoration-none text-white' href='sub.html?id=" +
            element.id +
            "'>" +
            "show" +
            "</a></button></td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='update(\"" +
            element.id +
            "\")'>" +
            "Update" +
            "</button></td></tr>";
        sno++;
    });
    document.getElementById("category_data").innerHTML = temp;
    document.getElementById("a_data").style.display = "none";
    document.getElementById("abc").style.display = "block";
});

function update(ID) {
    document.getElementById("set").showModal();
    var set_image;
    document.getElementById("set_image").addEventListener("change", function(e) {
        var file = e.target.files[0];

        var d = new Date();

        var uploadTask = storageRef
            .ref()
            .child("category/" + d.getTime() + file.name)
            .put(file);

        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                document.getElementById("progress_bar").style.width = progress + "%";
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
                    document.getElementById("image").src = set_image;
                    var docdata2 = {
                        category_url: set_image,
                    };

                    db.collection("category")
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

function subcategory(ID) {
    document.getElementById("dialog").show();

    document.getElementById("a").addEventListener("click", function() {
        var n = document.getElementById("sub_category_name").value;
        if (n == null || n == "") {
            swal({
                text: "please enter sub category....",
                button: false,
                closeOnClickOutside: true,
            });
        } else {
            swal({
                text: "please wait data deleting....",
                button: false,
            });
            db.collection("category")
                .doc(ID)
                .collection("subcategory")
                .add({ name: n })
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

document.getElementById("btn").addEventListener("click", function() {
    queryText = document.getElementById("search").value;
    db.collection("category")
        .where("category_name", ">=", queryText)
        .where("category_name", "<=", queryText + "\uf8ff")
        .onSnapshot(function(doc) {
            console.log(doc);
            var temp = "";
            var sno = 1;
            doc.forEach((element) => {
                temp += "<tr style='line-height: 2.5'>";
                temp += "<td>" + sno + "</td>";
                temp += "<td>" + element.data().category_name + "</td>";
                temp +=
                    "<td><img style='width:100px; height:auto;' src='" +
                    element.data().category_url +
                    "'>" +
                    "</td>";
                temp += "<td>" + element.data().date + "</td>";
                console.log(element.id);
                //temp += "<td>" + element.data().customer_name + "</td>";
                //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
                temp +=
                    "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletecategory(\"" +
                    element.id +
                    "\")'>" +
                    "Delete" +
                    "</a></button></td></tr>";

                sno++;
            });
            document.getElementById("category_data").innerHTML = temp;
        });
});