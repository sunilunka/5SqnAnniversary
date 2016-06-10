app.factory("ParsingFactory", function(){

  var spaceRegex = /\\s/;

  return {
    parseForDisplay: function(string){
      console.log("SPLIT STRING: ", string.split("\n"))
      var parsedForLineFeeds = string.split("\n");
      return parsedForLineFeeds.filter(function(str){
        return str !== "";
      })

    }
  }

})
