(function() {
    "use strict";

    feather.replace();

    // Graphs
})();
var db = firebase.firestore();

var url = window.location;
var ur = new URL(url);
var id = ur.searchParams.get("id");
var docid = "";
console.log(id);

document.getElementById("order_id").innerHTML = id;

var sno = parseInt(1);
db.collection("Customer Order")
    .where("orderid", "==", parseInt(id))
    .onSnapshot(function(doc) {
        doc.forEach((element) => {
            console.log(element.data().cid);
            db.collection("Userdata")
                .doc(element.data().cid)
                .onSnapshot(function(d) {
                    document.getElementById("customer_name").innerHTML = d.data().Name;

                    document.getElementById(
                        "shipping_address"
                    ).innerHTML = d.data().Address;
                    document.getElementById("phone").innerHTML = d.data().Monumber;
                    document.getElementById("email").innerHTML = d.data().Email;
                });
            docid = element.id;
            document.getElementById("status").innerHTML = element.data().status;
            document.getElementById(
                "delivery_time"
            ).innerHTML = element.data().adresstype;
            console.log(element.data().productid);
            var temp = "";
            db.collection("Product")
                .doc(element.data().productid)
                .onSnapshot(function(da) {
                    temp +=
                        "<tr style='line-height: 2.5;'><td>" +
                        da.data().product_name +
                        "</td>";
                    console.log(da.data().product_name);
                    console.log(element.data().pcolor);
                    temp += "<td>" + element.data().pcolor + "</td>";
                    temp += "<td>" + da.data().product_sale_price + "</td>";
                    temp += "<td>" + element.data().pqunti + "</td>";
                    temp += "<td>" + element.data().charge + "</td>";
                    temp += "<td>" + da.data().product_CGST + "</td>";
                    temp += "<td>" + da.data().product_SGST + "</td>";
                    temp += "<td>" + da.data().product_IGST + "</td>";
                    temp += "<td>" + element.data().pamount + "</td>";
                    temp += "<td>" + element.data().status + "</td></tr>";
                    console.log(temp);
                    document.getElementById("orderdata").innerHTML = temp;
                });

            document.getElementById(
                "payment_method"
            ).innerHTML = element.data().payment_method;

            document.getElementById(
                "payment_id"
            ).innerHTML = element.data().paymentid;

            document.getElementById("main_price").innerHTML = element.data().pamount;
            document.getElementById(
                "main_ship_fee"
            ).innerHTML = element.data().charge;
            document.getElementById("main_advace_fee").innerHTML =
                element.data().advancepayment + "%";
            document.getElementById(
                "main_remain_fee"
            ).innerHTML = element.data().payingamount;
            document.getElementById(
                "main_Wallet_coin"
            ).innerHTML = element.data().walletcoin;
            document.getElementById("main_total").innerHTML = element.data().pamount;
        });
    });

var te = "";
db.collection("delivery man").onSnapshot(function(doc) {
    doc.forEach((element) => {
        te +=
            "<option value='" +
            element.data().uname +
            "'>" +
            element.data().uname +
            "</option>";
    });
    document.getElementById("delivery_data").innerHTML = te;
});

document.getElementById("send").addEventListener("click", function() {
    var name = document.getElementById("delivery_data").value;
    db.collection("delivery man")
        .where("uname", "==", name)
        .onSnapshot(function(doc) {
            doc.forEach((element) => {
                var docdata = {
                    order_id: id,
                    Customer_order_id: docid,
                };
                var docd = {
                    status: "dispatch",
                };
                db.collection("Customer Order")
                    .doc(docid)
                    .update(docd)
                    .then(function() {
                        alert("save");
                    });
                db.collection("delivery man")
                    .doc(element.id)
                    .collection("Order")
                    .add(docdata)
                    .then(function() {
                        alert("send data");
                    });
                console.log(element.id);
                console.log(docid);
            });
        });
});

document.getElementById("cancel").addEventListener("click", function() {
    // var data = {
    //     status: "cancelled",
    // };
    // db.collection("Customer Order")
    //     .doc(docid)
    //     .update(data)
    //     .then(function() {
    //         alert("cancel order");
    //     });
    var doc = new jsPDF("l", "mm", [1425, 1000]);

    // var htmlString = window.document.getElementById("print");
    // var doc = new jsPDF("landscape", "pt");
    // doc.fromHTML(htmlString, 100, 100, {});
    // doc.output("datauri");

    // var elementHandler = {
    //     "#print": function(element, renderer) {
    //         return true;
    //     },
    // };
    var source = document.getElementById("print");
    doc.fromHTML(source, 15, 15);

    doc.save("Order.pdf");
});