app.factory("FirebaseStorageFactory", function(){
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var storeImageRef = storageRef.child("anniversary/shop/images");

  var FirebaseStorageFactory = {};

  FirebaseStorageFactory.uploadImage = function(){
    console.log("STORE IMAGE REF: ", storeImageRef);
  }

  FirebaseStorageFactory.removeImage = function(){
    
  }

  return FirebaseStorageFactory;

})
