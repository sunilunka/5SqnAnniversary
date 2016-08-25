app.directive("attendeeEventPayment", function(AttendeeFactory, EmailFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/attendee-event-payment/attendee-event-payment.html",
    scope: {
      evt: "=",
      user: "=",
      init: "="
    },
    link: function(scope, element, attrs){

      scope.processingLabel = "Awaiting Payment";

      scope.processing = false;

      scope.paymentReceived = false;

      scope.attendeePaymentReceived = function(){
        scope.processingLabel = "Processing...";
        scope.processing = true;

        return AttendeeFactory.setEventPaid(scope.user.uid, scope.evt.$id)
        .then(function(){
          return EmailFactory.sendEventPaymentReceivedEmail(scope.user, scope.evt)
        })
        .then(function(status){
          scope.processingLabel = "Payment Received"
          scope.processing = false;
          scope.paymentReceived = true;

        })
        .catch(function(err){
          console.log("ERROR: ", err);
          return err;
        })

      }

      var init = function(){
        if(scope.init){
          if(scope.user.hasOwnProperty("eventPayments")){
            if(scope.user["eventPayments"][scope.evt.$id]){
              scope.processingLabel = "Payment Received";
              scope.paymentReceived = true;
            }
          }
        }
      }

      init();

    }
  }
})
