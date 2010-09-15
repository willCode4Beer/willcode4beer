package com.willcode4beer.demo.sax.objs;

import com.willcode4beer.demo.sax.RssItem;

/**
 * Note: this class should not be made public, it is for internal use.
 */
class RssItemVo implements RssItem {
	
	private String pubDate;
	private String title;
	private String description;
	private String link;
	private String author;
	
	public String getPubDate() {
		return pubDate;
	}
	public String getTitle() {
		return title;
	}
	public String getDescription() {
		return description;
	}
	public String getLink() {
		return link;
	}
	public String getAuthor() {
		return author;
	}
	public void setPubDate(String pubDate) {
		this.pubDate = pubDate;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	
}
