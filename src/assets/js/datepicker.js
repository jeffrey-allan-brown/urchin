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