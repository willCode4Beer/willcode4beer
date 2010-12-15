"use strict";
goog.provide('scmexplorer');
goog.provide('scmexplorer.App');
goog.provide('scmexplorer.Entry');

goog.require('goog.crypt.base64');
goog.require('goog.dom');
goog.require('goog.dom.xml');
goog.require('goog.events');

goog.require("goog.net.XhrIo");
goog.require("goog.structs.Map");
goog.require("goog.Uri.QueryData");


/**
 * Manages the data and interface for a connection to a SCM resource
 * @param {string} username for authentication (if required)
 * @param {string} password for authentication (if required)
 * @param {Element} Starting url to access the SCM
 * @param {Element} the displayBody
 * @param {Element} the listBox to show entries
 * @constructor
 */
scmexplorer.App = function(username, password, scmurl, displayBody) {
  this.username = username;
  this.password = password;
  this.scmurl = scmurl;
  this.displayBody = displayBody;
  this.listBox = listBox;
};

/**
 * A displayable SCM entry
 * @param {string} relative url of the entry
 * @param {string} the type (directory or file) of the entry
 * @constructor
 */
scmexplorer.Entry = function(url, type) {
	this.url = url;
	this.type = type;
	this.getDisplay = function(){
		return url;
	}
	this.click = function(){
		var root = scmexplorer.App.scmurl.value
			.substring(0,scmexplorer.App.scmurl.value.indexOf('/',8));
		if(type=="file"){
			scmexplorer.App.showRepoFile(root + url);
		}else{
			scmexplorer.App.showRepoList(root + url);
		}
	}
};

scmexplorer.App.start = function startApp() {
	console.info("starting...");
	console.info(
	goog.crypt.base64.encodeString("username:foo password")
	);
	var newHeader = goog.dom.createDom('h1',
		{
			'style' : 'background-color:#EEE'
		},
		chrome.i18n.getMessage("app_head"));
	var username = goog.dom.createDom('input',{'type':'text','id':'username'});
	var password = goog.dom.createDom('input',{'type':'password','id':'password'});
	var scmurl = goog.dom.createDom('input',{'type':'text','id':'scmurl','size':'80',value:"http://equinox-headless-service.googlecode.com/svn/trunk/src/main/java/com/willcode4beer/service/equinox/"});
	var showButton = goog.dom.createDom('button',{}, 'display');
	var displayBody = goog.dom.createDom('div', {'class':'displayBody'});
	var listBox = goog.dom.createDom('div', {'class':'listBox','id':'listBox'});
	var codeBoxWrapper = goog.dom.createDom('fieldset', {'id':'codeBoxWrapper'});
	goog.dom.appendChild(codeBoxWrapper, goog.dom.createDom('legend', {},"Code Display:"));
	var codeBox = goog.dom.createDom('code', {'class':'prettyprint','id':'codeBox'});
	scmexplorer.App.username = username;
	scmexplorer.App.password = password;
	scmexplorer.App.scmurl = scmurl;
	scmexplorer.App.displayBody = displayBody;
	scmexplorer.App.listBox = listBox;
	var scmForm = goog.dom.createDom('fieldset',
		{
			'style' : 'border: solid blue 3px;'
		},
		goog.dom.createDom('legend',{}, chrome.i18n.getMessage("params_head")),
		goog.dom.createDom('label',{}, chrome.i18n.getMessage("params_username")),
		username,
		goog.dom.createDom('br'),
		goog.dom.createDom('label',{}, chrome.i18n.getMessage("params_password") ),
		password,
		goog.dom.createDom('br'),
		goog.dom.createDom('label',{}, chrome.i18n.getMessage("params_url") ),
		scmurl,
		goog.dom.createDom('br'),
		showButton
	);
	goog.dom.appendChild(document.body, newHeader);
	goog.dom.appendChild(document.body, scmForm);
	goog.dom.appendChild(document.body, displayBody);
	goog.dom.appendChild(displayBody, listBox);
	goog.dom.appendChild(displayBody, codeBoxWrapper);
	goog.dom.appendChild(codeBoxWrapper, codeBox);
	goog.events.listen(showButton, goog.events.EventType.CLICK, function(){this.showRepoList(scmexplorer.App.scmurl.value);}, false, this);
}

scmexplorer.App.clearFileList = function() {
	var fileListNode = scmexplorer.App.listBox;
	while (fileListNode.firstChild) {
		fileListNode.removeChild(fileListNode.firstChild);
	}
}
scmexplorer.App.clearCodeBox = function() {
	var codeBoxNode = document.getElementById("codeBox");
	while (codeBoxNode.firstChild) {
		codeBoxNode.removeChild(codeBoxNode.firstChild);
	}
}

scmexplorer.App.makeBreadCrumb = function(path) {
	var root = scmexplorer.App.scmurl.value
		.substring(0,scmexplorer.App.scmurl.value.indexOf('/',8));
	var parts = path.split("/");
	var relative = "/";
	var breadCrumb = goog.dom.createDom('div',{'style':'font-weight: 900'});
	for ( var i = 0; i < parts.length; i++) {
		var part = parts[i];
		if(part.length<=0){ continue; }
		relative += part + "/";
		var node = goog.dom.createDom('span',{'class':'link','relative':relative,
			'onclick':function(){
				scmexplorer.App.showRepoList(root + this.relative);
			}},
			(part)
			);
		goog.dom.appendChild(breadCrumb, node);
		goog.dom.appendChild(breadCrumb, goog.dom.createDom('span',{}," / "));
	}
	goog.dom.appendChild(scmexplorer.App.listBox, breadCrumb);
	goog.dom.appendChild(scmexplorer.App.listBox, goog.dom.createDom('br'));
}

scmexplorer.App.showRepoList = function(url){
	var content = '<?xml version="1.0" encoding="utf-8"?><propfind xmlns="DAV:"><prop><version-controlled-configuration xmlns="DAV:"/><resourcetype xmlns="DAV:"/><baseline-relative-path xmlns="http://subversion.tigris.org/xmlns/dav/"/><repository-uuid xmlns="http://subversion.tigris.org/xmlns/dav/"/></prop></propfind>';
	var headers = {
			"Content-Type":"text/xml",
			"Depth":"1"
	};
	this.addAuthenticationHeader(headers);
	goog.net.XhrIo.send(url,this.listCallback,"PROPFIND",content,headers);
}

scmexplorer.App.showRepoFile = function(url){
	var headers = {};
	this.addAuthenticationHeader(headers);
	goog.net.XhrIo.send(url,this.showFileCallback,"GET",null,headers);
}

scmexplorer.App.addAuthenticationHeader = function(headers){
	if(scmexplorer.App.username.value.length>0){
		headers["Authorization"] = "Basic " +
			goog.crypt.base64.encodeString(
					scmexplorer.App.username.value +":"+scmexplorer.App.password.value
			)
	}
}


scmexplorer.App.showFileCallback = function(e){
	var xhr = e.target;
	var raw = xhr.getResponseText();
	document.getElementById("codeBox").innerText = raw;
	prettyPrint();
}

scmexplorer.App.listCallback = function(e){
	var xhr = e.target;
	var doc = xhr.getResponseXml();
	scmexplorer.App.showNodes(doc);
}

scmexplorer.App.showNodes = function(doc){
	scmexplorer.App.clearFileList();
	scmexplorer.App.clearCodeBox();
	var nodes = goog.dom.xml.selectNodes(doc,"//D:response");
	var entries = new Array();
	for(var i=0; i<nodes.length;i++){
		var curNode = nodes[i];
		var url = goog.dom.xml.selectSingleNode(curNode,"D:href").textContent;
		if( goog.dom.xml.selectSingleNode(curNode,"D:propstat//D:collection") ){
			entries[i] = new scmexplorer.Entry(url,"directory");
		}else{
			entries[i] = new scmexplorer.Entry(url,"file");
		}
	}

	scmexplorer.App.makeBreadCrumb(entries[0].url);
	for ( var i = 1; i < entries.length; i++) {
		var node = goog.dom.createDom('div',{'class':'link','onclick':entries[i].click},entries[i].url.substring(entries[0].url.length));
		goog.dom.appendChild(scmexplorer.App.listBox, node);
	}

}
