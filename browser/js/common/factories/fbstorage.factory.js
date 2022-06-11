app.factory("FirebaseStorageFactory", function(){
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var storeEmailAssetRef = storageRef.child("anniversary/email")
  var storeImageRef = storageRef.child("anniversary/shop/images");

  var FirebaseStorageFactory = {};

  FirebaseStorageFactory.uploadImage = function(file){
    var metadata = {
      contentType: file.type
    }
    console.log("STORE IMAGE REF: ", storeImageRef);
    return storeImageRef.child(file.name).put(file, metadata);
  }

  FirebaseStorageFactory.uploadEmailAttachment = function(file){
    var metadata = {
      contentType: file.type
    }
    console.log("STORE FILE REF: ", storeEmailAssetRef)
    return storeEmailAssetRef.child(file.name).put(file, metadata);
  }

  FirebaseStorageFactory.removeEmailAttachment = function(filename){
    return storeEmailAssetRef.child(filename).delete();
  }

  FirebaseStorageFactory.removeImage = function(filename){
    return storeImageRef.child(filename).delete()
  }

  FirebaseStorageFactory.removeImagesFromServer = function(assetPromiseArray){
    return Promise.all(assetPromiseArray)
  }

  return FirebaseStorageFactory;

})
