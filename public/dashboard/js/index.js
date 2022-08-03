var db = firebase.firestore();

// const myform=document.getElementById('myform');

// myform.addEventListener('submit',function(e){
//     const formdata=new FormData(this);
//     const searchParams=new URLSearchParams();
// });

// var formData = new FormData();
// console.log(formData.get("email"));
document.getElementById("sign_btn").addEventListener("click", function() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    db.collection("Admin").onSnapshot(function(doc) {
        doc.forEach((element) => {
            if (element.data().email == email) {
                console.log("login...");

                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        alert(errorMessage);

                        // ...
                    });
            } else {
                alert("not user avalable");
            }
        });
    });
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        location.replace("Dashboard/dashboard.html");
    } else {
        // No user is signed in.
    }
});