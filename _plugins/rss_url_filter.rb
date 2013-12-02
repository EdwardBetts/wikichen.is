module Jekyll

  # yeah delete this, not using this since media is served from CDN
  module RSSURLFilter
    def rel_to_abs_urls(input)
      url = @context.registers[:site].config['url']
      input.gsub('src="/', 'src="' + url + '/').gsub('href="/', 'href="' + url + '/')
    end
  end
end

Liquid::Template.register_filter(Jekyll::RSSURLFilter)