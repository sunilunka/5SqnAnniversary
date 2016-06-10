app.factory("ParsingFactory", function(){

  var spaceRegex = /\\s/;

  return {
    parseStringForDisplay: function(string){
      console.log("SPLIT STRING: ", string.split("\n"))
      var parsedForLineFeeds = string.split("\n");
      return parsedForLineFeeds.filter(function(str){
        return str !== "";
      })
    },

    parseNumberForStorageAndDisplay: function(number){
      return number.toString().length === 1 ? "0" + number : number;
    },

    parseNumberForModification: function(number){
      return parseInt(number);
    }
  }

})
