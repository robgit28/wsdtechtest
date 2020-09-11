// change XML to JSON
function xml2Json(xml) {
// create the return object
  let object = {};
// Node type 1 is the element node
  if (xml.nodeType == 1) {
// element attributes
    if (xml.attributes.length > 0) {
      object["@attributes"] = {};
/*
if the length of the attribute is more than 0 then begin loop
then we have the initialization (let i = 0;), which begisn the loop
then we have the stopping condition (i < xml.attributes.length;), which is the
condition that the iterator variable is evaluated against— if the condition
evaluates to true the code block will run, and if it evaluates to false the
code will stop;
then the iteration statement (i++) is used to update the iterator variable on
each loop
*/
      for (let j = 0; j < xml.attributes.length; j++) {
/*
the element.attributes property returns a live collection of all attribute nodes
registered to the specified node.
item method returns node at the specified index in node list object
*/
        let attr = xml.attributes.item(j);
/*
attributes put in an object named "@attributes"
.nodeName property returns the name of the specified node as a string.
the .nodeValue property sets or returns the node value of the specified node.
returns the value of the attribute for attribute nodes
*/
        object["@attributes"][attr.nodeName] = attr.nodeValue;
      }
    }
// if node is a text node then...
  } else if (xml.nodeType == 3) {
// text
    object = xml.nodeValue;
  }
// children of parent get text from them.
/*
.slice slices the original array into a new list
.call method with the owner object (xml.childNodes) as the argument
.filter method creates a new array with all elements that return truthy
*/
  let textNodes = [].slice.call(xml.childNodes).filter(function(node) {
// return text nodes
    return node.nodeType === 3;
  });
/*
the Node.hasChildNodes method returns a Boolean value (true or false)
indicating whether the given node has child nodes or not and if length of
child nodes is the same as length of text nodes then...
*/
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
// obj variable assigned to new array
// .slice slices the original array into a new list
// .call method with the owner object (xml.childNodes) as the argument
/*
the reduce() method executes a reducer function (+) on each element of the
array, resulting in a single output value. text & node are the arguments of
the function
*/
    object = [].slice.call(xml.childNodes).reduce(function(text, node) {
      return text + node.nodeValue;
    }, "");
/*
if the Node.hasChildNodes method returns true then...
*/
  } else if (xml.hasChildNodes()) {
/*
loop through - see previous loop comment for explanation
*/
    for (let i = 0; i < xml.childNodes.length; i++) {
// creae variable called item & assign
      let item = xml.childNodes.item(i);
      let nodeName = item.nodeName;
      if (typeof object[nodeName] == "undefined") {
        object[nodeName] = xml2Json(item);
      } else {
// check typeof data type is undefined
        if (typeof object[nodeName].push == "undefined") {
          let old = object[nodeName];
          object[nodeName] = [];
          object[nodeName].push(old);
        }
        object[nodeName].push(xml2Json(item));
      }
    }
  }
  return object;
}
// access XML file
const result = await fetch('./WallStreetDocs.xml');
const xmlString = await result.text();
// parseFromString method, xml parameter & text/xml mimetype
let XmlNodes = new DOMParser().parseFromString(xmlString, 'text/xml');
xml2Json(XmlNodes);

// try catch error
function readXml(xml) {
   let dom = null;
// DOMParser interface parses XML from string into DOM
   if (window.DOMParser) {
      try {
// parseFromString method, xml parameter & text/xml mimetype
         dom = (new DOMParser()).parseFromString(xml, "text/xml");
      }
      catch (err) {dom = null;}
   }
   else if (window.ActiveXObject) {
      try {
// code for older IE browsers
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
// parse error
         if (!dom.loadXML(xml))
            window.alert(dom.parseError.reason + dom.parseError.srcText);
      }
      catch (err) {dom = null;}
   }
   else
// error message
      alert('Cannot parse xml string');
   return dom;
}
