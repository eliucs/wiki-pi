/**
* initializeSelect2.js
*
* This script initializes Select2 for search boxes that can make AJAX
* requests to retrieve live search results.
*
**/

let counter = 1;

$('#course-form-search').select2({
  placeholder: 'Search for articles...',
  ajax: {
    url: "/search-courses",
    type: 'GET',
    dataType: 'json',
    delay: 250,
    data: function(params) {
      return {
        q: params.term
      };
    },
    processResults: function (data) {
      let arr = [];
      $.each(data, function (index, value) {
          arr.push({
              id: index+counter,
              text: value
          });
          counter++;
      });
      return {
          results: arr
      };
    },
    cache: false
  },
  allowClear: true,
  minimumInputLength: 1,
}, true)
.trigger('change');
