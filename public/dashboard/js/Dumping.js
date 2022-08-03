(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var url = window.location;
var ur = new URL(url);
var id = ur.searchParams.get("id");
var db = firebase.firestore();
var storageRef = firebase.storage().ref();
var title = "";
var detail = "";
var review = "";
var main_image = "";
document.getElementById("main_image").addEventListener("change", function(e) {
    var file = e.target.files[0];
    //var file = document.getElementById("main_image").files[0];
    document.getElementById("add").disabled = true;
    var d = new Date();

    var uploadTask = storageRef
        .child("Review/" + d.getTime() + file.name)
        .put(file, metadata);
    var metadata = {
        contentType: "image/jpeg",
    };

    uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            document.getElementById("progress").style.width = progress + "%";
            document.getElementById("progress").innerHTML = parseInt(progress) + "%";
            //document.getElementById("dialog").show();
            //document.getElementById("progress").style.width = progress + "%";
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
                main_image = downloadURL;
                document.getElementById("img").src = main_image;
                document.getElementById("add").disabled = false;
            });
        }
    );
});

document.getElementById("add").addEventListener("click", function() {
    title = document.getElementById("title").value;
    detail = document.getElementById("detail").value;
    star = document.getElementById("sel1").value;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;
    if (title == null || title == "") {
        swal({
            text: "please enter title....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (detail == null || detail == "") {
        swal({
            text: "please enter detail....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (main_image == null || main_image == "") {
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
        var docData = {
            name: title,
            detail: detail,
            star: star,
            img: main_image,
            date: today,
        };

        db.collection("Product")
            .doc(id)
            .collection("Review")
            .add(docData)
            .then(function() {
                //console.log("Document successfully written!");
                //alert("Document successfully written!");
                swal({
                    icon: "success",
                    title: "Good job!",
                    text: "Document successfully written!",
                }).then((value) => {
                    // swal(`The returned value is: ${value}`);
                    location.reload();
                });
            });
    }
});

var temp = "";
var sno = parseInt(1);
db.collection("Product")
    .doc(id)
    .collection("Review")
    .onSnapshot(function(doc) {
        temp = "";
        doc.forEach((element) => {
            temp += "<tr style='line-height: 2.5'>";
            temp += "<td>" + sno + "</td>";
            temp += "<td>" + element.data().name + "</td>";
            // temp += "<td>" + element.data().delivery_time + "</td>";
            //temp += "<td>" + element.data().charge + "</td>";
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

        document.getElementById("data").innerHTML = temp;
        document.getElementById("a_data").style.display = "none";
        document.getElementById("abc").style.display = "block";
    });

function deletedata(ID) {
    swal({
        text: "please wait data deleting....",
        button: false,
    });

    db.collection("Product")
        .doc(id)
        .collection("Review")
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