package com.willcode4beer.demo.sax.objs;

import com.willcode4beer.demo.sax.RssItem;

class ImmutableRssItem implements RssItem {
	
	private final String pubDate;
	private final String title;
	private final String description;
	private final String link;
	private final String author;
	
	public ImmutableRssItem(RssItem src){
		this.pubDate = src.getPubDate();
		this.title = src.getTitle();
		this.description = src.getDescription();
		this.link = src.getLink();
		this.author = src.getAuthor();
	}
	
	@Override
	public String getPubDate() {
		return pubDate;
	}
	@Override
	public String getTitle() {
		return title;
	}
	@Override
	public String getDescription() {
		return description;
	}
	@Override
	public String getLink() {
		return link;
	}
	@Override
	public String getAuthor() {
		return author;
	}
}
