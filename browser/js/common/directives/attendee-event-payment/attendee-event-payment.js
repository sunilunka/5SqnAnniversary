app.directive("attendeeEventPayment", function(AttendeeFactory, EmailFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/attendee-event-payment/attendee-event-payment.html",
    link: function(scope, element, attrs){

      scope.processingLabel = "Awaiting Payment";
      scope.processing = false;
      scope.paymentReceived = false;

      scope.attendeePaymentReceived = function(){
        scope.processingLabel = "Processing...";
        element.addClass("sqn-btn-disabled")
        scope.processing = true;

        return AttendeeFactory.setEventPaid(scope.userDetails.uid, scope.evt.$id)
        .then(function(){
          return EmailFactory.sendEventPaymentReceivedEmail(scope.userDetails, scope.evt)
        })
        .then(function(status){
          element.addClass("product-option-selected");
          scope.processingLabel = "Payment Received"
          scope.processing = false;
          scope.paymentReceived = true;
          $timeout(function(){
            scope.$apply();
          },1)
        })
        .catch(function(err){
          console.log("ERROR: ", err);
          return err;
        })

      }

      var init = function(){
        if(scope.initialized){
          console.log("HIT INIT: ", scope)
          if(scope.userDetails.hasOwnProperty("eventPayments")){
            if(scope.userDetails["eventPayments"][scope.evt.$id]){
              console.log("SCOPE PAYMENTS: ", scope.userDetails["eventPayments"][scope.evt.$id])
              scope.processingLabel = "Payment Received";
              scope.paymentReceived = true;
              scope.processing = false;
              element.addClass("product-option-selected");
            }
          } else {
            scope.processingLabel = "Awaiting Payment";
            scope.processing = false;
            scope.paymentReceived = false;
          }
        }
      }

      init();

    }
  }
})
