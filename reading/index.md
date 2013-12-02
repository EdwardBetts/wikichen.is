---
layout: default
---

<body>
  <h1>Blog Posts</h1>
  <ul class="posts">
    {% for post in site.categories.reading %}
      <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
</body>