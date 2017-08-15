/**
* initializeSelect2.js
*
* This script initializes Select2 for search boxes that can make AJAX
* requests to retrieve live search results.
*
**/

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
      var arr = [];
      $.each(data, function (index, value) {
          arr.push({
              id: index+1,
              text: value
          });
      });
      return {
          results: arr
      };
    },
    cache: true
  },
  escapeMarkup: function (markup) {
    return markup;
  },
  minimumInputLength: 1,
})
.trigger('change.select2');
