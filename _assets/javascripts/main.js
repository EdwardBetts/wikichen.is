var disqus_loaded = false;
var comments = document.getElementById('disqus_thread');

/*function load_disqus() {
  var disqus_shortname = 'wikichen';
  disqus_loaded = true;

  var dsq = document.createElement('script');
  dsq.type = 'text/javascript';
  dsq.async = true;
  dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
}*/

$(document).ready(function() {
  $('.showComments').on('click', function() {
    var disqus_shortname = 'wikichen';

    // ajax request to load the disqus javascript
		$.ajax({
      type: "GET",
      url: "//" + disqus_shortname + ".disqus.com/embed.js",
      dataType: "script",
      cache: true
    });

    $(this).fadeOut();
  });
});
