---
layout: index
type: book
---

<section id="reading" class="container">
  <h1>Books</h1>
  <div class="books">
    {% for post in site.categories.reading %}
    <div class="book-container">
      <div class="book-cover">
        <a href="{{ post.url }}"><img src="{{ post.cover_img }}" alt="{{ post.cover_alt }}"></a>
      </div>
      <div class="book-metadata">
        <a class="book-title" href="{{ post.url }}">{{ post.title }}</a>
        <p class="book-author">{{ post.book_author }}</p>
      </div>
    </div>
    {% endfor %}
  </div>
</section>
