---
layout: default
title: Home
---

<body id="home">
  <div class="container">

    <p class="intro">My name is Jonathan E. Chen. I go by wikichen on the web. This is where I share my writing and reading. Excuse the site while it undergoes some reconstruction.</p>

    <p>You can <a href="{{ site.url }}/feeding">subscribe to the feed</a> for updates.</p>

    <ul class="links">
      <li><a href="http://twitter.com/wikichen" class="twitter">twitter</a></li>
      <li><a href="http://github.com/wikichen" class="github">github</a></li>
      <li><a href="http://dribbble.com/wikichen" class="dribbble">dribbble</a></li>
      <li><a href="http://facebook.com/jonathanechen" class="facebook">facebook</a></li>
      <li><a href="mailto:hello@wikichen.is" class="email">email</a></li>
    </ul>

    <hr>

    <ul class="posts">
      {% for post in site.posts %}
        <li>
          <time class="date">{{ post.date | date: "%b %-d, %Y" }}</time>
          <a class="title" href="{{ post.url }}">{{ post.title }}</a>
          <p class="subtitle">{{ post.subtitle }}</p>
        </li>
      {% endfor %}
    </ul>

  </div>
</body>
