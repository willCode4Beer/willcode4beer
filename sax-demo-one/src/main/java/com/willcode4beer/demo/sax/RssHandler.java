package com.willcode4beer.demo.sax;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class RssHandler extends DefaultHandler {

	private List<RssItem> items = new LinkedList<RssItem>();
	private RssItem currentItem = new RssItem();
	private StringBuilder charData = new StringBuilder();
	
	@SuppressWarnings("serial")
	private Map<String,TagWorker> tagWorkers = new HashMap<String, TagWorker>(){{
		put("item",new TagWorker() {
			@Override public void handleTag(String data) {
				items.add(currentItem);
				currentItem = new RssItem();
			}
		});
		put("title",new TagWorker() {
			@Override public void handleTag(String data) {
				currentItem.setTitle(data);
			}
		});
		put("link",new TagWorker() {
			@Override public void handleTag(String data) {
				currentItem.setLink(data);
			}
		});
		put("author",new TagWorker() {
			@Override public void handleTag(String data) {
				currentItem.setAuthor(data);
			}
		});
		put("description",new TagWorker() {
			@Override public void handleTag(String data) {
				currentItem.setDescription(data.replaceAll("(\\t)|(\\n)", ""));
			}
		});
		put("pubDate",new TagWorker() {
			@Override public void handleTag(String data) {
				currentItem.setPubDate(data);
			}
		});
	}};
	
	public List<RssItem> getItems() {
		return Collections.unmodifiableList(items);
	}

	@Override
	public void endElement(String uri, String localName, String qName) throws SAXException {
		TagWorker worker = tagWorkers.get(qName);
		if (worker != null) {
			worker.handleTag(charData.toString().trim());
		}
		charData.delete(0, charData.length());
	}

	@Override
	public void characters(char[] ch, int start, int length) throws SAXException {
		charData.append(ch, start, length);
	}

	private interface TagWorker {
		void handleTag(String data);
	}
}
