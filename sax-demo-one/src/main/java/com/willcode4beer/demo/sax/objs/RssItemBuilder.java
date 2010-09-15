package com.willcode4beer.demo.sax.objs;

import com.willcode4beer.demo.sax.RssItem;

public class RssItemBuilder {
	
	private RssItemVo working;
	
	private RssItemBuilder(){
		// use factory method
		working = new RssItemVo();
	}
	
	public static RssItemBuilder instance(){
		return new RssItemBuilder();
	}
	
	public void reset(){
		working = new RssItemVo();
	}
	
	public RssItem getItem(){
		return new ImmutableRssItem(working);
	}

	public RssItemBuilder setPubDate(String pubDate) {
		working.setPubDate(pubDate);
		return this;
	}

	public RssItemBuilder setTitle(String title) {
		working.setTitle(title);
		return this;
	}

	public RssItemBuilder setDescription(String description) {
		working.setDescription(description);
		return this;
	}

	public RssItemBuilder setLink(String link) {
		working.setLink(link);
		return this;
	}

	public RssItemBuilder setAuthor(String author) {
		working.setAuthor(author);
		return this;
	}
	
	
}
