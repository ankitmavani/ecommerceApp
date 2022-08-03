(function() {
    "use strict";
    feather.replace();
    // Graphs
})();

var db = firebase.firestore();
var storageRef = firebase.storage().ref();
var array = [];
var main_image = "";
var datai = "";
var detail_data = [];
var a = "";

document.getElementById("data_detail").addEventListener("click", function() {
    var d = document.getElementById("product_detail").value;
    detail_data.push(d);
    console.log(detail_data);
    document.getElementById("product_detail").value = "";
    a = "";
    for (let index = 0; index < detail_data.length; index++) {
        a += "<li>" + detail_data[index] + "</li>";
    }
    document.getElementById("detail").innerHTML = a;
});

document
    .getElementById("data_detail_remove")
    .addEventListener("click", function() {
        detail_data.pop();
        a = "";
        for (let index = 0; index < detail_data.length; index++) {
            a += "<li>" + detail_data[index] + "</li>";
        }
        document.getElementById("detail").innerHTML = a;
    });

document.getElementById("main_image").addEventListener("change", function() {
    var file = document.getElementById("main_image").files[0];
    document.getElementById("add").disabled = true;
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
            //document.getElementById("dialog").show();
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
                main_image = downloadURL;
                document.getElementById("img").src = main_image;
                document.getElementById("add").disabled = false;
            });
        }
    );
});

document.getElementById("Remove").addEventListener("click", function() {
    array.pop();
    datai = "";
    for (let index = 0; index < array.length; index++) {
        datai +=
            "<div class='col ml-auto text-right border m-2'><img class='w-auto p-2' style='width: 10px; height: 100px;' src='" +
            array[index] +
            "'></div>";
    }
    document.getElementById("image_color").innerHTML = datai;
});

document.getElementById("upload").addEventListener("click", function() {
    var file = document.getElementById("image").files[0];
    document.getElementById("add").disabled = true;
    document.getElementById("upload").disabled = true;
    document.getElementById("Remove").disabled = true;

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
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                url = downloadURL;
                array.push(url);
                datai = "";
                for (let index = 0; index < array.length; index++) {
                    datai +=
                        "<div class='col ml-auto text-right border m-2'><img class='w-auto p-2' style='width: auto; height: 100px;' src='" +
                        array[index] +
                        "'></div>";
                }
                document.getElementById("image_color").innerHTML = datai;
                document.getElementById("add").disabled = false;
                document.getElementById("upload").disabled = false;
                document.getElementById("Remove").disabled = false;
            });
        }
    );
});

var te = "";
db.collection("Brand").onSnapshot(function(d) {
    d.forEach((ele) => {
        te +=
            "<option value='" +
            ele.data().brand_name +
            "'>" +
            ele.data().brand_name +
            "</option>";
    });
    document.getElementById("_data").innerHTML = te;
});

var t = "";
db.collection("category").onSnapshot(function(doc) {
    doc.forEach((element) => {
        t +=
            "<option value='" +
            element.data().category_name +
            "'>" +
            element.data().category_name +
            "</option>";
    });
    document.getElementById("_category").innerHTML = t;
    var category = document.getElementById("_category").value;
    db.collection("category")
        .where("category_name", "==", category)
        .onSnapshot(function(d) {
            var ta = "";
            d.forEach((ele) => {
                db.collection("category")
                    .doc(ele.id)
                    .collection("subcategory")
                    .onSnapshot(function(doca) {
                        doca.forEach((elementa) => {
                            ta +=
                                "<option value='" +
                                elementa.data().name +
                                "'>" +
                                elementa.data().name +
                                "</option>";
                        });
                        document.getElementById("sub_category").innerHTML = ta;
                    });
            });
        });
});

document.getElementById("_category").addEventListener("change", function() {
    var category = document.getElementById("_category").value;
    db.collection("category")
        .where("category_name", "==", category)
        .onSnapshot(function(d) {
            var ta = "";
            d.forEach((ele) => {
                db.collection("category")
                    .doc(ele.id)
                    .collection("subcategory")
                    .onSnapshot(function(doca) {
                        doca.forEach((elementa) => {
                            ta +=
                                "<option value='" +
                                elementa.data().name +
                                "'>" +
                                elementa.data().name +
                                "</option>";
                        });
                        document.getElementById("sub_category").innerHTML = ta;
                    });
            });
        });
});

document.getElementById("add").addEventListener("click", function() {
    var name = document.getElementById("product_name").value;
    var return_time = document.getElementById("product_return_time").value;
    var delivery_time = document.getElementById("product_delivery_time").value;

    var MRP = parseFloat(document.getElementById("product_MRP").value);
    var sale_price = parseFloat(
        document.getElementById("product_sale_price").value
    );
    var advance_payment = document.getElementById("product_advance_payment")
        .value;
    var product_selling = document.getElementById("tsell").value;
    //var rate_value = "";
    var garrenty;
    var warrenty;
    if (document.getElementById("warrenty").checked) {
        var v = true;
        warrenty = document.getElementById("product_g").value;
        garrenty = "";
    } else if (document.getElementById("garrenty").checked) {
        var v = false;
        garrenty = document.getElementById("product_g").value;
        warrenty = "";
    } else {
        swal({
            text: "please select garrenty/warrenty....",
            button: false,
            closeOnClickOutside: true,
        });
    }

    var colors = document.getElementById("color").value;
    var CGST = parseFloat(document.getElementById("product_CGST").value);
    var SGST = parseFloat(document.getElementById("product_SGST").value);
    var IGST = parseFloat(document.getElementById("product_IGST").value);
    var Brand = document.getElementById("_data").value;
    var category = document.getElementById("_category").value;
    var sub_category = document.getElementById("sub_category").value;

    if (name == null || name == "") {
        swal({
            text: "please enter product name....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (detail_data == null || detail_data == "") {
        swal({
            text: "please enter product detail....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (return_time == null || return_time == "") {
        swal({
            text: "please enter return time....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (main_image == null || main_image == "") {
        swal({
            text: "please select main image....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (delivery_time == null || delivery_time == "") {
        swal({
            text: "please enter delivery time....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (MRP == null || MRP == "") {
        swal({
            text: "please enter MRP....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (category == null || category == "") {
        swal({
            text: "please select category....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (Brand == null || Brand == "") {
        swal({
            text: "please select Brand....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (sale_price == null || sale_price == "") {
        swal({
            text: "please enter sale price....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (CGST == null) {
        swal({
            text: "please enter CGST....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (SGST == null) {
        swal({
            text: "please enter SGST....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (IGST == null) {
        swal({
            text: "please enter IGST....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (advance_payment == null) {
        swal({
            text: "please enter advance payment....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (sub_category == null || sub_category == "") {
        swal({
            text: "please select sub category....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (product_selling == null || product_selling == "") {
        swal({
            text: "please enter total selling....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (colors == null || colors == "") {
        swal({
            text: "please select color....",
            button: false,
            closeOnClickOutside: true,
        });
    } else if (array.length == 0) {
        swal({
            text: "please select color images....",
            button: false,
            closeOnClickOutside: true,
        });
    } else {
        var discount = 100 - (sale_price * 100) / MRP;

        swal({
            text: "please wait data inserting....",
            button: false,
        });

        // var total =
        //     sale_price +
        //     (sale_price * CGST) / 100 +
        //     (sale_price * SGST) / 100 +
        //     (sale_price * IGST) / 100;
        // console.log(total);

        var docData = {
            product_name: name,
            product_detail: detail_data,
            product_MRP: MRP,
            product_sale_price: sale_price,
            product_CGST: CGST,
            product_SGST: SGST,
            product_IGST: IGST,
            iswarrenty: v,
            tsell: product_selling,
            brand_name: Brand,
            category_name: category,
            subcategory: sub_category,
            product_active: 1,
            product_total_price: sale_price,
            product_discount: discount,
            img: main_image,
            rtime: return_time,
            dtime: delivery_time,
            warrenty: warrenty,
            gurrenty: garrenty,
            advance: advance_payment,
        };

        var docd = {
            color: colors,
            imga: array,
        };

        db.collection("Product")
            .add(docData)
            .then(function(doc) {
                db.collection("Product")
                    .doc(doc.id)
                    .collection("Colors")
                    .add(docd)
                    .then(function() {
                        db.collection("Search")
                            .add({ name: name })
                            .then(function(doc) {
                                swal({
                                    icon: "success",
                                    title: "Good job!",
                                    text: "Document successfully written!",
                                }).then((value) => {
                                    location.reload();
                                });
                            });
                    });
            });
    }
});