var disqus_loaded = false;
var comments = document.getElementById('disqus_thread');

function load_disqus() {
  var disqus_shortname = 'wikichen';
  disqus_loaded = true;

  var dsq = document.createElement('script');
  dsq.type = 'text/javascript';
  dsq.async = true;
  dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
}

// get offset of an object
function findTop(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
    do {
        curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return curtop;
  }
}

if (window.location.hash.indexOf('#comments') > 0)
    load_disqus();

if (comments) {
  var commentsOffset = findTop(comments);

  window.onscroll = function() {
    if (!disqus_loaded && window.pageYOffset > commentsOffset - 1500) {
      //console.log('Loading comments...');
      load_disqus();
    }
  }
}
