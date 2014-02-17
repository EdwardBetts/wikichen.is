---
title: writing
layout: index
type: blog
---

<ul class="posts">
  {% for post in site.categories.writing %}
    <li>
      <time class="date">{{ post.date | date: "%B %-d" }}</time>
      <a href="{{ post.url }}">
        <span class="title">{{ post.title }}</span>
      </a>
    </li>
  {% endfor %}
</ul>
