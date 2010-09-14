package com.willcode4beer.demo.sax;

import static org.junit.Assert.*;
import static org.hamcrest.core.Is.*;
import java.io.InputStream;
import java.util.List;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.junit.Before;
import org.junit.Test;

public class RssHandlerTest {

	private final SAXParserFactory factory = SAXParserFactory.newInstance();
	private RssHandler handler;

	@Before
	public void loadUpTheData() throws Exception {
		handler = new RssHandler();
		InputStream in = this.getClass().getResourceAsStream("samplerss.xml");
		SAXParser parser = factory.newSAXParser();
		parser.parse(in, handler);
	}

	@Test
	public void validateInterface() {
		List<RssItem> items = handler.getItems();
		assertNotNull(items);
	}

	@Test
	public void validateItemCount() {
		List<RssItem> items = handler.getItems();
		assertThat(items.size(),is(32));
	}

	@Test
	public void validateFirstEntry() {
		List<RssItem> items = handler.getItems();
		RssItem item = items.get(0);
		assertThat(item.getPubDate(),is("Mon, 23 Aug 2010 10:05:00 PST"));
		assertThat(item.getTitle(),is("Stupid Java Trick: Blocking Screensavers"));
		assertThat(item.getLink(),is("http://willcode4beer.com/tips.jsp?set=disable_screensaver"));
		// notice that the enties (&lt; &gt;) translated automatically
		assertThat(item.getAuthor(),is("Paul Davis <feedback@willcode4beer.com>"));
		// in the handler, I used a little regx to clean up tabs/newlines
		assertThat(item.getDescription(),is("<p>A simple, yet useful trick: five lines of code to disable your screensaver.</p>"));
	}

}
