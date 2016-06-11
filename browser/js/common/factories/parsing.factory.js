app.factory("ParsingFactory", function(){

  var spaceRegex = /\\s/;

  var ParsingFactory = {};

  /* Display text from textarea fields on forms. */
  ParsingFactory.parseStringForDisplay = function(string){
    var parsedForLineFeeds = string.split("\n");
    /* Split string based on newlines, remove blank lines. Allows for use of ng-repeat and allocation of text to elements by returning array of strings. */
    return parsedForLineFeeds.filter(function(str){
      return str !== "";
    })
  }

  ParsingFactory.formatNumberForDisplay = function(number){
    return number.toString().length === 1 ? "0" + number : number;
  }


  ParsingFactory.formatNumberObj = function(numObj){
    let formattedObj = {};
    for(var num in numObj){
      formattedObj[num] = ParsingFactory.formatNumberForDisplay(numObj[num]);
    }
    return formattedObj;
  }

  return ParsingFactory;

})
