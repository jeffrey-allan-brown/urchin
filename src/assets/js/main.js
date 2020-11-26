(function($) {
    'use strict';
    $(function() {

    	// Enable feather-icons with SVG markup
    	feather.replace();
	  	
     
  
  
    });

})(jQuery);

$(function() {
  'use strict';

  if($('#dashboardDatePicker').length) {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('#dashboardDatePicker').datepicker({
      format: "mm/dd/yyyy",
      todayHighlight: true,
      autoclose: true
    });
    $('#dashboardDatePicker').datepicker('setDate', today);
  }
});
// initialize clipboard plugin
if ($('.btn-clipboard').length) {
  var clipboard = new ClipboardJS('.btn-clipboard');

  // Enabling tooltip to all clipboard buttons
  $('.btn-clipboard').attr('data-toggle', 'tooltip').attr('title', 'Copy to clipboard');

  // initializing bootstrap tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // initially hide btn-clipboard and show after copy
  clipboard.on('success', function(e) {
    e.trigger.classList.value = 'btn btn-clipboard btn-current'
    $('.btn-current').tooltip('hide');
    e.trigger.dataset.originalTitle = 'Copied';
    $('.btn-current').tooltip('show');
    setTimeout(function(){
        $('.btn-current').tooltip('hide');
        e.trigger.dataset.originalTitle = 'Copy to clipboard';
        e.trigger.classList.value = 'btn btn-clipboard'
    },1000);
    e.clearSelection();
  });
}