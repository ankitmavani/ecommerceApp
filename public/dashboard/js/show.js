(function() {
    "use strict";

    feather.replace();

    // Graphs
})();

var db = firebase.firestore();
var url = window.location;
var ur = new URL(url);
var main_id = ur.searchParams.get("id");
var a = "";
var b = "";
db.collection("Product")
    .doc(main_id)
    .onSnapshot(function(d) {
        a += "<div class='h6'>Product Name:" + d.data().product_name + "</div>";
        a += "<div class='h6'>Product MRP :" + d.data().product_MRP + "</div>";
        a += "<div class='h6'>Product CGST:" + d.data().product_CGST + "</div>";
        a += "<div class='h6'>Product SGST:" + d.data().product_SGST + "</div>";
        a += "<div class='h6'>Product IGST:" + d.data().product_IGST + "</div>";
        a +=
            "<div class='h6'>Product sale price:" +
            d.data().product_sale_price +
            "</div>";
        a +=
            "<div class='h6'>Product total price:" +
            d.data().product_total_price +
            "</div>";
        a +=
            "<div class='h6'>Product Discount:" +
            d.data().product_discount +
            "</div>";

        b +=
            "<div class='h6'>Product category:" + d.data().category_name + "</div>";
        b += "<div class='h6'>Product brand:" + d.data().brand_name + "</div>";
        b += "<div class='h6'>Product return time:" + d.data().rtime + "</div>";
        b += "<div class='h6'>Product delivery time:" + d.data().dtime + "</div>";
        b += "<div class='h6'>Product Advance pay:" + d.data().advance + "</div>";
        b += "<div class='h6'>Product Warrenty:" + d.data().warrenty + "</div>";
        b += "<div class='h6'>Product gurrenty:" + d.data().gurrenty + "</div>";
        //b += "<div class='h6'>Product Weight:" + d.data().product_weight + "</div>";

        document.getElementById("a").innerHTML = a;
        document.getElementById("b").innerHTML = b;

        var detail_data = [];
        var c = "";
        detail_data = detail_data.concat(d.data().product_detail);
        for (let index = 0; index < detail_data.length; index++) {
            c += "<li>" + detail_data[index] + "</li>";
        }
        document.getElementById("detail").innerHTML = c;
        document.getElementById("img").src = d.data().img;
    });
var data = "";

function removecolor(collectionid) {
    db.collection("Product")
        .doc(main_id)
        .collection("Colors")
        .doc(collectionid)
        .delete()
        .then(function() {
            location.reload();
            console.log("deleting successful");
        });
}

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