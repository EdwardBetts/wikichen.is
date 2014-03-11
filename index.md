---
layout: default
title: welcome to
---

<body id="home">
  <div class="container">

    <p class="intro">Welcome to (wikichen's web wonderland), currently happily under construction. Feel free to poke around.</p>

    <ul class="links">
      <li><a href="http://twitter.com/wikichen" class="twitter">twitter</a></li>
      <li><a href="http://github.com/wikichen" class="github">github</a></li>
      <li><a href="http://dribbble.com/wikichen" class="dribbble">dribbble</a></li>
      <li><a href="http://facebook.com/jonathanechen" class="facebook">facebook</a></li>
      <li><a href="mailto:hello@wikichen.is" class="email">email</a></li>
    </ul>

    <hr>

    <ul class="posts">
      {% for post in site.categories.writing %}
        <li>
          <time class="date">{{ post.date | date: "%B %-d" }}</time>
          <a href="{{ post.url }}">
            <span class="title">{{ post.title }}: {{ post.subtitle }}</span>
          </a>
        </li>
      {% endfor %}
    </ul>




  </div>
</body>
