app.factory("FirebaseStorageFactory", function(){
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var storeImageRef = storageRef.child("anniversary/shop/images");

  var FirebaseStorageFactory = {};

  FirebaseStorageFactory.uploadImage = function(file){
    var metadata = {
      contentType: file.type
    }
    console.log("STORE IMAGE REF: ", storeImageRef);
    return storeImageRef.child(file.name).put(file, metadata);
  }

  FirebaseStorageFactory.removeImage = function(filename){
    return storeImageRef.child(filename).delete()
  }

  return FirebaseStorageFactory;

})
