app.directive("scrollBottom", function($timeout){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      let targetElement = element[0];
      let pastHeight = targetElement.scrollHeight;

      /* This doesn't seem to work on mobile devices. Poop. It might be due to using the fat arrow function, and scoping of 'this'. Will look into it later. */
      // let scrollDown = (event) => {
      //   console.log("EVENT FIRED: ", event.animationName);
      //   let currentHeight = targetElement.scrollHeight;
      //   if(event.animationName === 'new-item-received'){
      //     currentHeight = targetElement.scrollHeight;
      //     if(currentHeight > pastHeight){
      //       targetElement.scrollTop = currentHeight;
      //       pastHeight = currentHeight;
      //     }
      //   }
      // }
      //
      //
      // targetElement.addEventListener("MSAnimationStart", scrollDown, false);
      //
      // targetElement.addEventListener("animationStart", scrollDown, false);
      //
      // targetElement.addEventListener("webkitAnimationStart", scrollDown, false);

      setInterval(function(){
        let currentHeight = element[0].scrollHeight;
        if(currentHeight > pastHeight){
          element[0].scrollTop = currentHeight;
          pastHeight = currentHeight;
        }
      }, 1000)

    }
  }
})
