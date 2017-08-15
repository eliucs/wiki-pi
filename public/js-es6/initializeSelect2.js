/**
* initializeSelect2.js
*
* This script initializes Select2 for search boxes that can make AJAX
* requests to retrieve live search results.
*
**/

$("#course-form-search").select2({
  placeholder: 'Search for articles...',
  ajax: {
    url: "https://api.github.com/search/repositories",
    dataType: 'json',
    delay: 250,
    data: function(params) {
      return {
        q: params.term,
        page: params.page
      };
    },
    processResults: function (data, params) {
      params.page = params.page || 1;

      return {
        results: data.items,
        pagination: {
          more: (params.page * 30) < data.total_count
        }
      };
    },
    cache: true
  },
  minimumInputLength: 1,
});
