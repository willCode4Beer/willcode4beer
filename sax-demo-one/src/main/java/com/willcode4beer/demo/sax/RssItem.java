package com.willcode4beer.demo.sax;

public interface RssItem {

	public abstract String getPubDate();

	public abstract String getTitle();

	public abstract String getDescription();

	public abstract String getLink();

	public abstract String getAuthor();

}