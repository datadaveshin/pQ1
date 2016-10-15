function xmlToJson(xml) {
    try {
        var obj = {};
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);

                    obj[attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];

                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }

                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }

        // console.log(JSON.stringify(obj));
        return obj;
    } catch (e) {
        alert(e.message);
    }
}