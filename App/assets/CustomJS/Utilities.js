function StringEncodingMechanism(maliciousText) {
    debugger;
    var returnStr = maliciousText.replaceAll('&', '&amp;');
    returnStr = returnStr.replaceAll('<', '&lt;');
    returnStr = returnStr.replaceAll('>', '&gt;');
    returnStr = returnStr.replaceAll('"', '&quot;');
    returnStr = returnStr.replaceAll("'", '&#x27;');
    returnStr = returnStr.replaceAll('/', '&#x2F;');
    returnStr = returnStr.replaceAll('alert(', 'alert-');
    return returnStr;
}

function StringDecodingMechanism(maliciousText) {
    debugger;
    var returnStr = returnStr.replaceAll('&lt;', '<');
    returnStr = returnStr.replaceAll('&gt;', '>');
    returnStr = returnStr.replaceAll('&quot;', '"');
    returnStr = returnStr.replaceAll("&#x27;", "'");
    returnStr = returnStr.replaceAll('&#x2F;', '/');
    returnStr = returnStr.replaceAll('alert-', 'alert(');
    returnStr = maliciousText.replaceAll('&amp;', '&');
    return returnStr;
}