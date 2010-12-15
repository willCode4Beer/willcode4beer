"use strict";
goog.provide('scmexplorer');
goog.provide('scmexplorer.Subversion');

goog.require("goog.net.XhrIo");


scmexplorer.Subversion.list = function(url, callback){
	var content = '<?xml version="1.0" encoding="utf-8"?><propfind xmlns="DAV:"><prop><version-controlled-configuration xmlns="DAV:"/><resourcetype xmlns="DAV:"/><baseline-relative-path xmlns="http://subversion.tigris.org/xmlns/dav/"/><repository-uuid xmlns="http://subversion.tigris.org/xmlns/dav/"/></prop></propfind>';
	var headers = {
			"Content-Type":"text/xml",
			"Depth":"1"
	};
	goog.net.XhrIo.send(url, callback,"PROPFIND",content,headers);
}

scmexplorer.Subversion.getFile = function(url, callback){
	goog.net.XhrIo.send(url,callback,"GET");
}