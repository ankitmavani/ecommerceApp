(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();

var storageRef = firebase.storage();

var filebutttn = document.getElementById("banner_image");

var url;

filebutttn.addEventListener("change", function(e) {
    var file = e.target.files[0];
    document.getElementById("banner_add").disabled = true;
    var d = new Date();

    var uploadTask = storageRef
        .ref()
        .child("Banner/" + d.getTime() + file.name)
        .put(file);

    uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            document.getElementById("progress").style.width = progress + "%";
            document.getElementById("progress").style.width = progress + "%";
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
                document.getElementById("banner_add").disabled = false;
            });
        }
    );
});

var banner_add = document.getElementById("banner_add");

banner_add.addEventListener("click", function() {
    var banner_name = document.getElementById("banner_name").value;
    var category = document.getElementById("_category").selectedIndex;
    if (banner_name == null || banner_name == "") {
        swal({
            text: "please select image....",
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
            Banner_name: banner_name,
            Banner_url: url,
            Banner_date: today,
            category: document.getElementsByTagName("option")[category].value,
        };

        db.collection("Banner")
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

function deletebanner(ID) {
    swal({
        text: "please wait data deleting....",
        button: false,
    });
    db.collection("Banner")
        .doc(ID)
        .onSnapshot(function(doc) {
            storageRef
                .refFromURL(doc.data().Banner_url)
                .delete()
                .then(function() {});
            db.collection("Banner")
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
db.collection("Banner").onSnapshot(function(doc) {
    doc.forEach((element) => {
        temp += "<tr style='line-height: 2.5'>";
        temp += "<td>" + sno + "</td>";
        temp += "<td>" + element.data().Banner_name + "</td>";
        temp +=
            "<td><img style='width:auto; height:100px;' src='" +
            element.data().Banner_url +
            "'>" +
            "</td>";
        temp += "<td>" + element.data().Banner_date + "</td>";
        //temp += "<td>" + element.data().customer_name + "</td>";
        //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
        temp +=
            "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletebanner(\"" +
            element.id +
            "\")'>" +
            "Delete" +
            "</a></button></td></tr>";

        sno++;
    });

    document.getElementById("banner_data").innerHTML = temp;
    document.getElementById("a_data").style.display = "none";
    document.getElementById("abc").style.display = "block";
});

var t = "";
db.collection("Product").onSnapshot(function(doc) {
    doc.forEach((element) => {
        t +=
            "<option value='" +
            element.data().product_name +
            "'>" +
            element.data().product_name +
            "</option>";
    });
    document.getElementById("_category").innerHTML = t;
});

document.getElementById("btn").addEventListener("click", function() {
    queryText = document.getElementById("search").value;
    db.collection("Banner")
        .where("Banner_name", ">=", queryText)
        .where("Banner_name", "<=", queryText + "\uf8ff")
        .onSnapshot(function(doc) {
            console.log(doc);
            var temp = "";
            var sno = 1;
            doc.forEach((element) => {
                temp += "<tr style='line-height: 2.5'>";
                temp += "<td>" + sno + "</td>";
                temp += "<td>" + element.data().Banner_name + "</td>";
                temp +=
                    "<td><img style='width:100px; height:100px;' src='" +
                    element.data().Banner_url +
                    "'>" +
                    "</td>";
                temp += "<td>" + element.data().Banner_date + "</td>";
                //temp += "<td>" + element.data().customer_name + "</td>";
                //temp += "<td style='line-height: 2.2' class='text-warning h6'>" + element.data().status + "</td>";
                temp +=
                    "<td><button type='button' class='btn btn-primary px-2 py-1' onclick='deletebanner(\"" +
                    element.id +
                    "\")'>" +
                    "Delete" +
                    "</a></button></td></tr>";

                sno++;
            });
            document.getElementById("banner_data").innerHTML = temp;
        });
});