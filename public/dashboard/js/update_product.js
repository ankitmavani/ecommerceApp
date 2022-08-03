(function() {
    "use strict";
    feather.replace();
    // Graphs
})();

var db = firebase.firestore();
var main_image;
var url = window.location;
var ur = new URL(url);
var main_id = ur.searchParams.get("id");
var storageRef = firebase.storage().ref();
var main_image = "";
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

document.getElementById("upload_image").addEventListener("click", function() {
    var file = document.getElementById("main_image").files[0];

    var d = new Date();

    var uploadTask = storageRef
        .child("Product/" + d.getTime() + file.name)
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
                    // Upload completed successfully, now we can get the download URL
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                main_image = downloadURL;
                document.getElementById("img").src = main_image;
            });
        }
    );
});

var te = "";
db.collection("Brand").onSnapshot(function(doc) {
    doc.forEach((element) => {
        te +=
            "<option value='" +
            element.data().brand_name +
            "'>" +
            element.data().brand_name +
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
});

db.collection("Product")
    .doc(main_id)
    .onSnapshot(function(doc) {
        document.getElementById("product_name").value = doc.data().product_name;
        //document.getElementById("product_detail").value = doc.data().product_detail;
        document.getElementById("product_MRP").value = parseFloat(
            doc.data().product_MRP
        );
        document.getElementById(
            "product_advance_payment"
        ).value = doc.data().advance;

        document.getElementById("product_return_time").value = doc.data().rtime;
        document.getElementById("product_delivery_time").value = doc.data().dtime;
        // document.getElementById(
        //     "product_warrenty"
        // ).value = doc.data().product_warrenty;
        // document.getElementById(
        //     "product_garrenty"
        // ).value = doc.data().product_garrenty;
        document.getElementById("product_sale_price").value = parseFloat(
            doc.data().product_sale_price
        );
        document.getElementById("product_CGST").value = parseFloat(
            doc.data().product_CGST
        );
        document.getElementById("product_SGST").value = parseFloat(
            doc.data().product_SGST
        );
        document.getElementById("product_IGST").value = parseFloat(
            doc.data().product_IGST
        );
        document.getElementById("_category").value = doc.data().category_name;
        document.getElementById("_data").value = doc.data().brand_name;
        detail_data = detail_data.concat(doc.data().product_detail);
        for (let index = 0; index < detail_data.length; index++) {
            a += "<li>" + detail_data[index] + "</li>";
        }
        document.getElementById("detail").innerHTML = a;
        main_image = doc.data().img;
        document.getElementById("img").src = main_image;
        if (doc.data().iswarrenty) {
            var warrentyv = document.getElementById("warrenty");
            warrentyv.checked = true;
            document.getElementById("product_g").value = doc.data().warrenty;
            //console.log(doc.data().iswarrenty);
        } else {
            var warrenyv = document.getElementById("garrenty");
            warrenyv.checked = true;
            document.getElementById("product_g").value = doc.data().gurrenty;
        }

        // document.getElementById("_data").value = doc.data().product_;
        // document.getElementById("_data").value = doc.data().product_brand;
        // document.getElementById("_data").value = doc.data().product_brand;
        // document.getElementById("_data").value = doc.data().product_brand;

        // document.getElementById(
        //     "product_category"
        // ).value = doc.data().product_category;
    });

function removecolor(collectionid) {
    db.collection("Product")
        .doc(main_id)
        .collection("Colors")
        .doc(collectionid)
        .delete()
        .then(function() {
            console.log("deleting successful");
            location.reload();
        });
}

var data = "";
db.collection("Product")
    .doc(main_id)
    .collection("Colors")
    .onSnapshot(function(d) {
        d.forEach((element) => {
            var image = [];
            data +=
                "<div class='row'><div class='h6 ml-auto mb-4'>color</div><span class='dot'  style='background-color:" +
                element.data().color +
                ";'></span>";
            data +=
                "<button type='button' onclick='removecolor(\"" +
                element.id +
                "\")'class='ml-2 btn btn-danger'>Remove</button><div id='image_color' class='row'>";
            image = image.concat(element.data().imga);
            for (let index = 0; index < image.length; index++) {
                data +=
                    "<div class='col ml-auto text-right border m-2'><img class='w-100 p-2' src='" +
                    image[index] +
                    "'></div>";
            }
            data += "</div></div>";
        });
        document.getElementById("data").innerHTML = data;
    });

document.getElementById("add").addEventListener("click", function() {
    var name = document.getElementById("product_name").value;
    //console.log(name);
    //var detail = document.getElementById("product_detail").value;
    var MRP = parseFloat(document.getElementById("product_MRP").value);
    var sale_price = parseFloat(
        document.getElementById("product_sale_price").value
    );
    var advance_payment = document.getElementById("product_advance_payment")
        .value;
    //var rate_value = "";
    var warrenty = "";
    var garrenty = "";
    if (document.getElementById("warrenty").checked) {
        //rate_value = document.getElementById("warrenty").value;
        var v = true;
        warrenty = document.getElementById("product_g").value;
        garrenty = "";
        //var garrenty = document.getElementById("product_garrenty").value;
    }
    if (document.getElementById("garrenty").checked) {
        //rate_value = document.getElementById("garrenty").value;
        var v = false;
        garrenty = document.getElementById("product_g").value;
        warrenty = "";
    }

    console.log(v);
    var return_time = document.getElementById("product_return_time").value;
    var delivery_time = document.getElementById("product_delivery_time").value;
    var CGST = parseFloat(document.getElementById("product_CGST").value);
    var SGST = parseFloat(document.getElementById("product_SGST").value);
    var IGST = parseFloat(document.getElementById("product_IGST").value);
    //var category = document.getElementById("_category").selectedIndex;
    //var Brand = document.getElementById("_data").selectedIndex;
    //console.log(document.getElementsByTagName("option")[category].value);
    if (name == null || name == "") {
        alert("empty name");
    } else if (detail_data == null || detail_data == "") {
        alert("empty detail");
    } else if (return_time == null || return_time == "") {
        alert("empty return time");
    } else if (main_image == null || main_image == "") {
        alert("empty main image");
    } else if (delivery_time == null || delivery_time == "") {
        alert("empty delivery time");
    } else if (MRP == null || MRP == "") {
        alert("empty MRP");
    } else if (category == null || category == "") {
        alert("empty category");
    } else if (Brand == null || Brand == "") {
        alert("empty brand");
    } else if (sale_price == null || sale_price == "") {
        alert("empty sale_price");
    } else if (CGST == null || CGST == "") {
        alert("empty CGST");
    } else if (SGST == null || SGST == "") {
        alert("empty SGST");
    } else if (IGST == null || IGST == "") {
        alert("empty IGST");
    } else if (advance_payment == null || advance_payment == "") {
        alert("empty adavance payment");
    } else {
        var discount = 100 - (sale_price * 100) / MRP;
        console.log(discount);
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
            //product_weight: document.getElementById("product_weight").value,
            //product_stock: document.getElementById("product_stock").value,
            category_name: document.getElementById("_category").value,
            brand_name: document.getElementById("_data").value,
            product_active: 1,
            iswarrenty: v,
            product_total_price: sale_price,
            product_discount: discount,
            img: main_image,
            rtime: return_time,
            dtime: delivery_time,
            warrenty: warrenty,
            gurrenty: garrenty,
            advance: advance_payment,
        };

        db.collection("Product")
            .doc(main_id)
            .update(docData)
            .then(function(doc) {
                console.log("successful");
                alert("succ..");
                location.reload();
            });
    }
});