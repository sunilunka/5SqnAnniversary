app.directive("attendeeEventPayment", function(AttendeeFactory, EmailFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/attendee-event-payment/attendee-event-payment.html",
    scope: {
      details: "=",
      evt: "="
    },
    link: function(scope, element, attrs){
      scope.processingLabel = "Awaiting Payment";
      scope.processing = false;
      scope.paymentReceived = false;

      scope.attendeePaymentReceived = function(){
        scope.processingLabel = "Processing...";
        element.addClass("sqn-btn-disabled")
        scope.processing = true;

        return AttendeeFactory.setEventPaid(scope.details.$id, scope.evt.$id)
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
        if(scope.details.hasOwnProperty("eventPayments")){
          if(scope.details["eventPayments"][scope.evt.$id]){
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

      init();

    }
  }
})
