firebase.auth().onAuthStateChanged(function(user) {
    if (user) {} else {
        // No user is signed in.
        location.replace("index.html");
    }
});

function signout() {
    firebase
        .auth()
        .signOut()
        .then(function() {
            // Sign-out successful.
            location.replace("index.html");
        })
        .catch(function(error) {
            // An error happened.
        });
}