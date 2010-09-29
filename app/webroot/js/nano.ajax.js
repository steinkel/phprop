/*
 *  nano Ajax Plugin v1.0
 *  http://www.nanojs.org/plugins/ajax
 *
 *  Copyright (c) 2010 James Watts (SOLFENIX)
 *  http://www.solfenix.com
 *
 *  This is FREE software, licensed under the GPL
 *  http://www.gnu.org/licenses/gpl.html
 */

if(nano){nano.plugin({load:function load(url,method,params,headers){return nano.ajax[method||'get'](url||'',params,function(){this.param.node.set(this.response.text);},null,{node:this},null,headers);},send:function send(url,method,params,headers){return nano.ajax[method||'post'](url||'',params,function(){this.param.node.set(this.response.text);},null,{node:this},null,headers);}},function(){this.reg({load:function(val){this.load(val);}});this.ajax={query:function query(name){var name=name+'=',url=document.URL;return(url.indexOf(name)!==-1)?url.substring(url.indexOf(name)+name.length).split('&',2)[0]:null;},request:function request(url,method,async,params,user,password,headers,data){var obj={};obj.url=url;obj.params=params||{};obj.method=(typeof method==='string')?method:'post';obj.async=(nano.isset(async))?true:async;obj.user=user||'';obj.password=password||'';obj.data=data||{};obj.request=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");if(obj.request){if(obj.method.toLowerCase()==='post'){obj.post='';for(var param in obj.params){obj.post+=param+'='+params[param]+'&';}
obj.post=obj.post.substring(0,obj.post.length-1);obj.request.open(obj.method,obj.url,obj.async,obj.user,obj.password);obj.request.setRequestHeader('Content-type','application/x-www-form-urlencoded');}else{url+=(url.indexOf('?')===-1)?'?':'&';for(var param in obj.params){url+=param+'='+params[param]+'&';}
obj.request.open(obj.method,url.substring(0,url.length-1),obj.async,obj.user,obj.password);}
if(headers){for(var header in headers){obj.request.setRequestHeader(header,headers[header]);}}
return obj;}else{return false;}},response:function response(obj,callback,evt){evt=evt||{};var ie6=false;if(/msie (\d+\.\d+)/i.test(navigator.userAgent)){if(RegExp.$1<7){ie6=true;}}
if(!ie6){obj.request.onprogress=function(e){if(typeof evt.onprogress==='function'){evt.onprogress.call(obj,e);}};obj.request.onload=function(e){if(typeof evt.onload==='function'){evt.onload.call(obj,e);}};obj.request.onerror=function(e){if(typeof evt.onerror==='function'){evt.onerror.call(obj,e);}};obj.request.onabort=function(e){if(typeof evt.onabort==='function'){evt.onabort.call(obj,e);}};}
obj.request.onreadystatechange=function(e){if(obj.request.readyState===4){obj.response={request:obj.request,header:function(header){return this.request.getResponseHeader(header);},text:obj.request.responseText,xml:obj.request.responseXML};if(obj.request.status===200){if(typeof callback==='function'){callback.call(obj);}}else{if(typeof evt.onerror==='function'){evt.onerror.call(obj,e);}}}};obj.request.send((obj.method.toLowerCase()==='post')?obj.post:null);return obj;},get:function get(url,params,callback,evt,headers,data){return new this.response(new this.request(url||'/','get',true,params,null,null,headers,data),callback,evt);},post:function post(url,params,callback,evt,headers,data){return new this.response(new this.request(url||'/','post',true,params,null,null,headers,data),callback,evt);}};});}
