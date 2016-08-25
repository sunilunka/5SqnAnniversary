app.directive("attendeeEventPayment", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/attendee-event-payment/attendee-event-payment.html",
    scope: {
      evt: "=",
      user: "="
    },
    link: function(scope, element, attrs){

      scope.processingLabel = "Attendee To Pay";

      scope.processing = false;

      

    }
  }
})
