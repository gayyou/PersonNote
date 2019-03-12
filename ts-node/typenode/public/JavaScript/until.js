function search() {
	var searchAll = document.getElementById("searchAll");
	var xml = httpObject();
	searchAll.onkeypress = function() {
		if (event.keyCode==13) {
			var search = searchAll.value;
			var jsonObj = {};
			jsonObj.search = search;
			var json = JSON.stringify(jsonObj);
			xml.open("post","searchWrite",true) 
    	    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    	    xml.send("json="+json);
    	    xml.onreadystatechange = function() {
    	        if ((xml.readyState == 4) && (xml.status == 200)) {
    	            	var response = xml.responseText;
    	            	if (response=="1") {
    	            		window.location.href="searchPage.html";
    	            	}
    	            }
    	        } 
		}
	}
}
function httpObject() {
    var xml;
    try {                                                             // 获取浏览器对象
       /* IE 8.0+, Firefox, Safari */  
       xml = new XMLHttpRequest();
              } catch (e) { 
                  /*internet EXplore */
                  try {
                      xml = new ActiveXObject("Msxml2.XMLHTTP");
                  } catch (e) {
                      try {   
                        /* code for ie5 and ie6 */
                          xml = new ActiveXObject("Microsoft.XMLHTTP");
                      } catch (e) {
                          alert("浏览器对象出错")
                      }
                 }
              }
    return xml;
}
function getHsonLength(json) {  
    var jsonLength=0;  
    for (var i in json) {  
        jsonLength++;  
    }  
    return jsonLength;  
}
function filter(text) {
	text = text.replace(/<br\/>/g, "\n");			//防止前端注入
	text = text.replace(/<nbsp;>/g," ");
	text = text.replace(/<br>/g, "\n");
	text = text.replace(/</g, "&lt;");
	text = text.replace(/>/g, "&gt;");
	text = text.replace(/\//g, "&#47;");
	text = text.replace(/\n/g, "<br/>");
	text = text.replace(/\s/g,"&nbsp;");
	return text;
}
function filterToBackstage(text) {
	text = text.replace(/\n/g, "<br/>");
	text = text.replace(/\s/g,"<nbsp;>");
	return text;
}