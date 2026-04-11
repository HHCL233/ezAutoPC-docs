import {
  $,
  JQ,
  appendChild,
  createElement,
  each,
  eachArray,
  eachObject,
  getAttribute,
  getDocument,
  getNodeName,
  getWindow,
  hexFromArgb,
  isArrayLike,
  isBoolean,
  isDocument,
  isDomReady,
  isElement,
  isFunction,
  isNodeName,
  isNull,
  isNumber,
  isObjectLike,
  isString,
  isUndefined,
  isWindow,
  map,
  remove,
  removeAttribute,
  removeChild,
  returnFalse,
  returnTrue,
  setAttribute,
  setColorScheme,
  sourceColorFromImage,
  toCamelCase,
  toElement,
  toKebabCase,
  unique
} from "./chunk-XIUHZGE6.js";

// node_modules/@mdui/jq/functions/merge.js
var merge = (first, second) => {
  eachArray(second, (value) => {
    first.push(value);
  });
  return first;
};

// node_modules/@mdui/jq/methods/add.js
$.fn.add = function(selector) {
  return new JQ(unique(merge(this.get(), $(selector).get())));
};

// node_modules/@mdui/jq/methods/appendTo.js
eachArray(["appendTo", "prependTo"], (name, nameIndex) => {
  $.fn[name] = function(target) {
    const extraChilds = [];
    const $target = $(target).map((_, element) => {
      const childNodes = element.childNodes;
      const childLength = childNodes.length;
      if (childLength) {
        return childNodes[nameIndex ? 0 : childLength - 1];
      }
      const child = createElement("div");
      appendChild(element, child);
      extraChilds.push(child);
      return child;
    });
    const $result = this[nameIndex ? "insertBefore" : "insertAfter"]($target);
    $(extraChilds).remove();
    return $result;
  };
});

// node_modules/@mdui/jq/shared/css.js
var getComputedStyleValue = (element, name) => {
  const window2 = getWindow();
  return window2.getComputedStyle(element).getPropertyValue(toKebabCase(name));
};
var isBorderBox = (element) => {
  return getComputedStyleValue(element, "box-sizing") === "border-box";
};
var getExtraWidth = (element, direction, extra) => {
  const position = direction === "width" ? ["Left", "Right"] : ["Top", "Bottom"];
  return [0, 1].reduce((prev, _, index) => {
    let prop = extra + position[index];
    if (extra === "border") {
      prop += "Width";
    }
    return prev + parseFloat(getComputedStyleValue(element, prop) || "0");
  }, 0);
};
var getStyle = (element, name) => {
  if (name === "width" || name === "height") {
    const valueNumber = element.getBoundingClientRect()[name];
    if (isBorderBox(element)) {
      return `${valueNumber}px`;
    }
    return `${valueNumber - getExtraWidth(element, name, "border") - getExtraWidth(element, name, "padding")}px`;
  }
  return getComputedStyleValue(element, name);
};
var cssNumber = [
  "animation-iteration-count",
  "column-count",
  "fill-opacity",
  "flex-grow",
  "flex-shrink",
  "font-weight",
  "grid-area",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "widows",
  "z-index",
  "zoom"
];

// node_modules/@mdui/jq/methods/attr.js
eachArray(["attr", "prop", "css"], (name, nameIndex) => {
  const set4 = (element, key, value) => {
    if (isUndefined(value)) {
      return;
    }
    if (nameIndex === 0) {
      return setAttribute(element, key, value);
    }
    if (nameIndex === 1) {
      element[key] = value;
      return;
    }
    key = toKebabCase(key);
    const getSuffix = () => key.startsWith("--") || cssNumber.includes(key) ? "" : "px";
    element.style.setProperty(key, isNumber(value) ? `${value}${getSuffix()}` : value);
  };
  const get4 = (element, key) => {
    if (nameIndex === 0) {
      return getAttribute(element, key);
    }
    if (nameIndex === 1) {
      return element[key];
    }
    return getStyle(element, key);
  };
  $.fn[name] = function(key, value) {
    if (isObjectLike(key)) {
      eachObject(key, (k, v) => {
        this[name](k, v);
      });
      return this;
    }
    if (arguments.length === 1) {
      const element = this[0];
      return isElement(element) ? get4(element, key) : void 0;
    }
    return this.each((i, element) => {
      set4(element, key, isFunction(value) ? value.call(element, i, get4(element, key)) : value);
    });
  };
});

// node_modules/@mdui/jq/methods/children.js
$.fn.children = function(selector) {
  const children = [];
  this.each((_, element) => {
    eachArray(element.childNodes, (childNode) => {
      if (!isElement(childNode)) {
        return;
      }
      if (!selector || $(childNode).is(selector)) {
        children.push(childNode);
      }
    });
  });
  return new JQ(unique(children));
};

// node_modules/@mdui/jq/methods/slice.js
$.fn.slice = function(...args) {
  return new JQ([].slice.apply(this, args));
};

// node_modules/@mdui/jq/methods/eq.js
$.fn.eq = function(index) {
  const ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);
  return new JQ(ret);
};

// node_modules/@mdui/jq/methods/utils/dir.js
var dir = ($elements, nameIndex, node, selector, filter) => {
  const ret = [];
  let target;
  $elements.each((_, element) => {
    target = element[node];
    while (target && isElement(target)) {
      if (nameIndex === 2) {
        if (selector && $(target).is(selector)) {
          break;
        }
        if (!filter || $(target).is(filter)) {
          ret.push(target);
        }
      } else if (nameIndex === 0) {
        if (!selector || $(target).is(selector)) {
          ret.push(target);
        }
        break;
      } else {
        if (!selector || $(target).is(selector)) {
          ret.push(target);
        }
      }
      target = target[node];
    }
  });
  return new JQ(unique(ret));
};

// node_modules/@mdui/jq/methods/parent.js
eachArray(["", "s", "sUntil"], (name, nameIndex) => {
  $.fn[`parent${name}`] = function(selector, filter) {
    const $nodes = !nameIndex ? this : $(this.get().reverse());
    return dir($nodes, nameIndex, "parentNode", selector, filter);
  };
});

// node_modules/@mdui/jq/methods/closest.js
$.fn.closest = function(selector) {
  if (this.is(selector)) {
    return this;
  }
  const matched = [];
  this.parents().each((_, element) => {
    if ($(element).is(selector)) {
      matched.push(element);
      return false;
    }
  });
  return new JQ(matched);
};

// node_modules/@mdui/jq/shared/data.js
var weakMap = /* @__PURE__ */ new WeakMap();
var getAll = (element) => {
  return weakMap.get(element) ?? {};
};
var get = (element, keyOriginal) => {
  const data2 = getAll(element);
  const key = toCamelCase(keyOriginal);
  return key in data2 ? data2[key] : void 0;
};
var setAll = (element, object) => {
  const data2 = getAll(element);
  eachObject(object, (keyOriginal, value) => {
    data2[toCamelCase(keyOriginal)] = value;
  });
  weakMap.set(element, data2);
};
var set = (element, keyOriginal, value) => {
  setAll(element, { [keyOriginal]: value });
};
var removeAll = (element) => {
  weakMap.delete(element);
};
var removeMultiple = (element, keysOriginal) => {
  const data2 = getAll(element);
  eachArray(keysOriginal, (keyOriginal) => {
    const key = toCamelCase(keyOriginal);
    delete data2[key];
  });
  weakMap.set(element, data2);
};
var rbrace = /^(?:{[\w\W]*\}|\[[\w\W]*\])$/;
var stringTransform = (value) => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === "null") {
    return null;
  }
  if (value === +value + "") {
    return +value;
  }
  if (rbrace.test(value)) {
    return JSON.parse(value);
  }
  return value;
};
var dataAttr = (element, key, value) => {
  if (isUndefined(value) && element.nodeType === 1) {
    value = element.dataset[key];
    if (isString(value)) {
      try {
        value = stringTransform(value);
      } catch (_err) {
      }
    }
  }
  return value;
};

// node_modules/@mdui/jq/methods/data.js
$.fn.data = function(key, value) {
  if (isUndefined(key)) {
    if (!this.length) {
      return void 0;
    }
    const element = this[0];
    const resultData = getAll(element);
    if (element.nodeType !== 1) {
      return resultData;
    }
    eachObject(element.dataset, (key2) => {
      resultData[key2] = dataAttr(element, key2, resultData[key2]);
    });
    return resultData;
  }
  if (isObjectLike(key)) {
    return this.each(function() {
      setAll(this, key);
    });
  }
  if (arguments.length === 2 && isUndefined(value)) {
    return this;
  }
  if (!isUndefined(value)) {
    return this.each(function() {
      set(this, key, value);
    });
  }
  if (!this.length) {
    return void 0;
  }
  return dataAttr(this[0], toCamelCase(key), get(this[0], key));
};

// node_modules/@mdui/jq/methods/empty.js
$.fn.empty = function() {
  return this.each((_, element) => {
    element.innerHTML = "";
  });
};

// node_modules/@mdui/jq/methods/extend.js
$.fn.extend = function(obj) {
  eachObject(obj, (prop, value) => {
    $.fn[prop] = value;
  });
  return this;
};

// node_modules/@mdui/jq/methods/filter.js
$.fn.filter = function(selector) {
  if (isFunction(selector)) {
    return this.map((index, element) => {
      return selector.call(element, index, element) ? element : void 0;
    });
  }
  if (isString(selector)) {
    return this.map((_, element) => {
      return $(element).is(selector) ? element : void 0;
    });
  }
  const $selector = $(selector);
  return this.map((_, element) => {
    return $selector.get().includes(element) ? element : void 0;
  });
};

// node_modules/@mdui/jq/methods/find.js
$.fn.find = function(selector) {
  const foundElements = [];
  this.each((_, element) => {
    merge(foundElements, $(element.querySelectorAll(selector)).get());
  });
  return new JQ(foundElements);
};

// node_modules/@mdui/jq/methods/first.js
$.fn.first = function() {
  return this.eq(0);
};

// node_modules/@mdui/jq/functions/contains.js
var contains = (container2, contains2) => {
  return container2 !== contains2 && toElement(container2).contains(contains2);
};

// node_modules/@mdui/jq/methods/has.js
$.fn.has = function(selector) {
  const $targets = isString(selector) ? this.find(selector) : $(selector);
  const { length } = $targets;
  return this.map(function() {
    for (let i = 0; i < length; i += 1) {
      if (contains(this, $targets[i])) {
        return this;
      }
    }
    return;
  });
};

// node_modules/@mdui/jq/methods/hasClass.js
$.fn.hasClass = function(className2) {
  return this[0].classList.contains(className2);
};

// node_modules/@mdui/jq/methods/width.js
var handleExtraWidth = (element, name, value, funcIndex, includeMargin, multiply) => {
  const getExtraWidthValue = (extra) => {
    return getExtraWidth(element, name.toLowerCase(), extra) * multiply;
  };
  if (funcIndex === 2 && includeMargin) {
    value += getExtraWidthValue("margin");
  }
  if (isBorderBox(element)) {
    if (funcIndex === 0) {
      value -= getExtraWidthValue("border");
    }
    if (funcIndex === 1) {
      value -= getExtraWidthValue("border");
      value -= getExtraWidthValue("padding");
    }
  } else {
    if (funcIndex === 0) {
      value += getExtraWidthValue("padding");
    }
    if (funcIndex === 2) {
      value += getExtraWidthValue("border");
      value += getExtraWidthValue("padding");
    }
  }
  return value;
};
var get2 = (element, name, funcIndex, includeMargin) => {
  const document3 = getDocument();
  const clientProp = `client${name}`;
  const scrollProp = `scroll${name}`;
  const offsetProp = `offset${name}`;
  const innerProp = `inner${name}`;
  if (isWindow(element)) {
    return funcIndex === 2 ? element[innerProp] : toElement(document3)[clientProp];
  }
  if (isDocument(element)) {
    const doc = toElement(element);
    return Math.max(
      // @ts-ignore
      element.body[scrollProp],
      doc[scrollProp],
      // @ts-ignore
      element.body[offsetProp],
      doc[offsetProp],
      doc[clientProp]
    );
  }
  const value = parseFloat(getComputedStyleValue(element, name.toLowerCase()) || "0");
  return handleExtraWidth(element, name, value, funcIndex, includeMargin, 1);
};
var set2 = (element, elementIndex, name, funcIndex, includeMargin, value) => {
  let computedValue = isFunction(value) ? value.call(element, elementIndex, get2(element, name, funcIndex, includeMargin)) : value;
  if (computedValue == null) {
    return;
  }
  const $element = $(element);
  const dimension = name.toLowerCase();
  if (isString(computedValue) && ["auto", "inherit", ""].includes(computedValue)) {
    $element.css(dimension, computedValue);
    return;
  }
  const suffix = computedValue.toString().replace(/\b[0-9.]*/, "");
  const numerical = parseFloat(computedValue);
  computedValue = handleExtraWidth(element, name, numerical, funcIndex, includeMargin, -1) + (suffix || "px");
  $element.css(dimension, computedValue);
};
eachArray(["Width", "Height"], (name) => {
  eachArray([`inner${name}`, name.toLowerCase(), `outer${name}`], (funcName, funcIndex) => {
    $.fn[funcName] = function(margin, value) {
      const isSet = arguments.length && (funcIndex < 2 || !isBoolean(margin));
      const includeMargin = margin === true || value === true;
      if (!isSet) {
        return this.length ? get2(this[0], name, funcIndex, includeMargin) : void 0;
      }
      return this.each((index, element) => {
        return set2(element, index, name, funcIndex, includeMargin, margin);
      });
    };
  });
});

// node_modules/@mdui/jq/methods/hide.js
$.fn.hide = function() {
  return this.each((_, element) => {
    element.style.display = "none";
  });
};

// node_modules/@mdui/jq/methods/val.js
eachArray(["val", "html", "text"], (name, nameIndex) => {
  const props = ["value", "innerHTML", "textContent"];
  const propName = props[nameIndex];
  const get4 = ($elements) => {
    if (nameIndex === 2) {
      return map($elements, (element) => {
        return toElement(element)[propName];
      }).join("");
    }
    if (!$elements.length) {
      return void 0;
    }
    const firstElement = $elements[0];
    const $firstElement = $(firstElement);
    if (nameIndex === 0 && $firstElement.is("select[multiple]")) {
      return map($firstElement.find("option:checked"), (element) => element.value);
    }
    return firstElement[propName];
  };
  const set4 = (element, value) => {
    if (isUndefined(value)) {
      if (nameIndex !== 0) {
        return;
      }
      value = "";
    }
    if (nameIndex === 1 && isElement(value)) {
      value = value.outerHTML;
    }
    element[propName] = value;
  };
  $.fn[name] = function(value) {
    if (!arguments.length) {
      return get4(this);
    }
    return this.each((i, element) => {
      const $element = $(element);
      const computedValue = isFunction(value) ? value.call(element, i, get4($element)) : value;
      if (nameIndex === 0 && Array.isArray(computedValue)) {
        if ($element.is("select[multiple]")) {
          map($element.find("option"), (option) => {
            return option.selected = computedValue.includes(option.value);
          });
        } else {
          element.checked = computedValue.includes(element.value);
        }
      } else {
        set4(element, computedValue);
      }
    });
  };
});

// node_modules/@mdui/jq/methods/index.js
$.fn.index = function(selector) {
  if (!arguments.length) {
    return this.eq(0).parent().children().get().indexOf(this[0]);
  }
  if (isString(selector)) {
    return $(selector).get().indexOf(this[0]);
  }
  return this.get().indexOf($(selector)[0]);
};

// node_modules/@mdui/jq/methods/last.js
$.fn.last = function() {
  return this.eq(-1);
};

// node_modules/@mdui/jq/methods/next.js
eachArray(["", "All", "Until"], (name, nameIndex) => {
  $.fn[`next${name}`] = function(selector, filter) {
    return dir(this, nameIndex, "nextElementSibling", selector, filter);
  };
});

// node_modules/@mdui/jq/methods/not.js
$.fn.not = function(selector) {
  const $excludes = this.filter(selector);
  return this.map((_, element) => {
    return $excludes.index(element) > -1 ? void 0 : element;
  });
};

// node_modules/@mdui/jq/shared/event.js
var CustomEvent2 = getWindow().CustomEvent;
var MduiCustomEvent = class extends CustomEvent2 {
  constructor(type, options) {
    super(type, options);
    this.data = options.data;
    this.namespace = options.namespace;
  }
};
var elementIdMap = /* @__PURE__ */ new WeakMap();
var elementId = 1;
var getElementId = (element) => {
  if (!elementIdMap.has(element)) {
    elementIdMap.set(element, ++elementId);
  }
  return elementIdMap.get(element);
};
var handlersMap = /* @__PURE__ */ new Map();
var getHandlers = (element) => {
  const id2 = getElementId(element);
  return handlersMap.get(id2) || handlersMap.set(id2, []).get(id2);
};
var parse = (type) => {
  const parts = type.split(".");
  return {
    type: parts[0],
    namespace: parts.slice(1).sort().join(" ")
  };
};
var matcherFor = (namespace) => {
  return new RegExp("(?:^| )" + namespace.replace(" ", " .* ?") + "(?: |$)");
};
var getMatchedHandlers = (element, type, func, selector) => {
  const event = parse(type);
  return getHandlers(element).filter((handler) => {
    return handler && (!event.type || handler.type === event.type) && (!event.namespace || matcherFor(event.namespace).test(handler.namespace)) && (!func || getElementId(handler.func) === getElementId(func)) && (!selector || handler.selector === selector);
  });
};
var add = (element, types, func, data2, selector) => {
  let useCapture = false;
  if (isObjectLike(data2) && data2.useCapture) {
    useCapture = true;
  }
  types.split(" ").forEach((type) => {
    if (!type) {
      return;
    }
    const event = parse(type);
    const callFn = (e, elem) => {
      const result = func.apply(
        elem,
        // @ts-ignore
        e.detail === null ? [e] : [e].concat(e.detail)
      );
      if (result === false) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const proxyFn = (e) => {
      if (e.namespace && !matcherFor(e.namespace).test(event.namespace)) {
        return;
      }
      e.data = data2;
      if (selector) {
        $(element).find(selector).get().reverse().forEach((elem) => {
          if (elem === e.target || contains(elem, e.target)) {
            callFn(e, elem);
          }
        });
      } else {
        callFn(e, element);
      }
    };
    const handler = {
      type: event.type,
      namespace: event.namespace,
      func,
      selector,
      id: getHandlers(element).length,
      proxy: proxyFn
    };
    getHandlers(element).push(handler);
    element.addEventListener(handler.type, proxyFn, useCapture);
  });
};
var remove2 = (element, types, func, selector) => {
  const handlersInElement = getHandlers(element);
  const removeEvent = (handler) => {
    delete handlersInElement[handler.id];
    element.removeEventListener(handler.type, handler.proxy, false);
  };
  if (!types) {
    handlersInElement.forEach((handler) => {
      removeEvent(handler);
    });
  } else {
    types.split(" ").forEach((type) => {
      if (type) {
        getMatchedHandlers(element, type, func, selector).forEach((handler) => {
          removeEvent(handler);
        });
      }
    });
  }
};

// node_modules/@mdui/jq/methods/off.js
$.fn.off = function(types, selector, callback) {
  if (isObjectLike(types)) {
    eachObject(types, (type, fn) => {
      this.off(type, selector, fn);
    });
    return this;
  }
  if (selector === false || isFunction(selector)) {
    callback = selector;
    selector = void 0;
  }
  if (callback === false) {
    callback = returnFalse;
  }
  return this.each(function() {
    remove2(this, types, callback, selector);
  });
};

// node_modules/@mdui/jq/functions/extend.js
function extend(target, ...objectN) {
  eachArray(objectN, (object) => {
    eachObject(object, (prop, value) => {
      if (!isUndefined(value)) {
        target[prop] = value;
      }
    });
  });
  return target;
}

// node_modules/@mdui/jq/methods/offsetParent.js
$.fn.offsetParent = function() {
  const document3 = getDocument();
  return this.map(function() {
    let offsetParent = this.offsetParent;
    while (offsetParent && $(offsetParent).css("position") === "static") {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || document3.documentElement;
  });
};

// node_modules/@mdui/jq/methods/position.js
var floatStyle = ($element, name) => {
  return parseFloat($element.css(name));
};
$.fn.position = function() {
  if (!this.length) {
    return void 0;
  }
  const $element = this.eq(0);
  let currentOffset;
  let parentOffset = {
    left: 0,
    top: 0
  };
  if ($element.css("position") === "fixed") {
    currentOffset = $element[0].getBoundingClientRect();
  } else {
    currentOffset = $element.offset();
    const $offsetParent = $element.offsetParent();
    parentOffset = $offsetParent.offset();
    parentOffset.top += floatStyle($offsetParent, "border-top-width");
    parentOffset.left += floatStyle($offsetParent, "border-left-width");
  }
  return {
    top: currentOffset.top - parentOffset.top - floatStyle($element, "margin-top"),
    left: currentOffset.left - parentOffset.left - floatStyle($element, "margin-left")
  };
};

// node_modules/@mdui/jq/methods/offset.js
var get3 = (element) => {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }
  const { top, left } = element.getBoundingClientRect();
  const { pageYOffset, pageXOffset } = element.ownerDocument.defaultView;
  return {
    top: top + pageYOffset,
    left: left + pageXOffset
  };
};
var set3 = (element, value, index) => {
  const $element = $(element);
  const position = $element.css("position");
  if (position === "static") {
    $element.css("position", "relative");
  }
  const currentOffset = get3(element);
  const currentTopString = $element.css("top");
  const currentLeftString = $element.css("left");
  let currentTop;
  let currentLeft;
  const calculatePosition = (position === "absolute" || position === "fixed") && (currentTopString + currentLeftString).includes("auto");
  if (calculatePosition) {
    const currentPosition = $element.position();
    currentTop = currentPosition.top;
    currentLeft = currentPosition.left;
  } else {
    currentTop = parseFloat(currentTopString);
    currentLeft = parseFloat(currentLeftString);
  }
  const computedValue = isFunction(value) ? value.call(element, index, extend({}, currentOffset)) : value;
  $element.css({
    top: computedValue.top != null ? computedValue.top - currentOffset.top + currentTop : void 0,
    left: computedValue.left != null ? computedValue.left - currentOffset.left + currentLeft : void 0
  });
};
$.fn.offset = function(value) {
  if (!arguments.length) {
    if (!this.length) {
      return void 0;
    }
    return get3(this[0]);
  }
  return this.each(function(index) {
    set3(this, value, index);
  });
};

// node_modules/@mdui/jq/methods/on.js
$.fn.on = function(types, selector, data2, callback, one) {
  if (isObjectLike(types)) {
    if (!isString(selector)) {
      data2 = data2 || selector;
      selector = void 0;
    }
    eachObject(types, (type, fn) => {
      this.on(type, selector, data2, fn, one);
    });
    return this;
  }
  if (data2 == null && callback == null) {
    callback = selector;
    data2 = selector = void 0;
  } else if (callback == null) {
    if (isString(selector)) {
      callback = data2;
      data2 = void 0;
    } else {
      callback = data2;
      data2 = selector;
      selector = void 0;
    }
  }
  if (callback === false) {
    callback = returnFalse;
  } else if (!callback) {
    return this;
  }
  if (one) {
    const _this = this;
    const origCallback = callback;
    callback = function(event, ...dataN) {
      _this.off(event.type, selector, callback);
      return origCallback.call(this, event, ...dataN);
    };
  }
  return this.each(function() {
    add(this, types, callback, data2, selector);
  });
};

// node_modules/@mdui/jq/methods/one.js
$.fn.one = function(types, selector, data2, callback) {
  return this.on(types, selector, data2, callback, true);
};

// node_modules/@mdui/jq/methods/prev.js
eachArray(["", "All", "Until"], (name, nameIndex) => {
  $.fn[`prev${name}`] = function(selector, filter) {
    const $nodes = !nameIndex ? this : $(this.get().reverse());
    return dir($nodes, nameIndex, "previousElementSibling", selector, filter);
  };
});

// node_modules/@mdui/jq/methods/removeAttr.js
$.fn.removeAttr = function(attributeName) {
  const names = attributeName.split(" ").filter((name) => name);
  return this.each(function() {
    eachArray(names, (name) => {
      removeAttribute(this, name);
    });
  });
};

// node_modules/@mdui/jq/functions/removeData.js
var removeData = (element, name) => {
  if (isUndefined(name)) {
    return removeAll(element);
  }
  const keys = isString(name) ? name.split(" ").filter((nameItem) => nameItem) : name;
  removeMultiple(element, keys);
};

// node_modules/@mdui/jq/methods/removeData.js
$.fn.removeData = function(name) {
  return this.each((_, element) => {
    removeData(element, name);
  });
};

// node_modules/@mdui/jq/methods/removeProp.js
$.fn.removeProp = function(name) {
  return this.each((_, element) => {
    try {
      delete element[name];
    } catch (_err) {
    }
  });
};

// node_modules/@mdui/jq/methods/replaceWith.js
$.fn.replaceWith = function(newContent) {
  this.each((index, element) => {
    let content = newContent;
    if (isFunction(content)) {
      content = content.call(element, index, element.innerHTML);
    } else if (index && !isString(content)) {
      content = $(content).clone();
    }
    $(element).before(content);
  });
  return this.remove();
};

// node_modules/@mdui/jq/methods/replaceAll.js
$.fn.replaceAll = function(target) {
  return $(target).map((index, element) => {
    $(element).replaceWith(index ? this.clone() : this);
    return this.get();
  });
};

// node_modules/@mdui/jq/functions/param.js
var param = (obj) => {
  if (!isObjectLike(obj) && !Array.isArray(obj)) {
    return "";
  }
  const args = [];
  const destructure = (key, value) => {
    let keyTmp;
    if (isObjectLike(value)) {
      eachObject(value, (i, v) => {
        keyTmp = Array.isArray(value) && !isObjectLike(v) ? "" : i;
        destructure(`${key}[${keyTmp}]`, v);
      });
    } else {
      keyTmp = value == null || value === "" ? "=" : `=${encodeURIComponent(value)}`;
      args.push(encodeURIComponent(key) + keyTmp);
    }
  };
  if (Array.isArray(obj)) {
    eachArray(obj, ({ name, value }) => {
      return destructure(name, value);
    });
  } else {
    eachObject(obj, destructure);
  }
  return args.join("&");
};

// node_modules/@mdui/jq/shared/form.js
var formCollections = /* @__PURE__ */ new WeakMap();
var getFormControls = (form) => {
  const nativeFormControls = [...form.elements];
  const formControls = formCollections.get(form) || [];
  const comparePosition = (a, b) => {
    const position = a.compareDocumentPosition(b);
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  };
  return [...nativeFormControls, ...formControls].sort(comparePosition);
};

// node_modules/@mdui/jq/methods/serializeArray.js
var getFormControlsValue = ($elements) => {
  const result = [];
  $elements.each((_, element) => {
    const elements = element instanceof HTMLFormElement ? getFormControls(element) : [element];
    $(elements).each((_2, element2) => {
      const $element = $(element2);
      const type = element2.type;
      const nodeName = element2.nodeName.toLowerCase();
      if (nodeName !== "fieldset" && element2.name && !element2.disabled && [
        "input",
        "select",
        "textarea",
        "keygen",
        "mdui-checkbox",
        "mdui-radio-group",
        "mdui-switch",
        "mdui-text-field",
        "mdui-select",
        "mdui-slider",
        "mdui-range-slider",
        "mdui-segmented-button-group"
      ].includes(nodeName) && !["submit", "button", "image", "reset", "file"].includes(type) && (!["radio", "checkbox"].includes(type) || element2.checked) && (!["mdui-checkbox", "mdui-switch"].includes(nodeName) || element2.checked)) {
        result.push({
          name: element2.name,
          value: $element.val()
        });
      }
    });
  });
  return result;
};
$.fn.serializeArray = function() {
  return getFormControlsValue(this).map((element) => {
    if (!Array.isArray(element.value)) {
      return element;
    }
    return element.value.map((value) => ({
      name: element.name,
      value
    }));
  }).flat();
};

// node_modules/@mdui/jq/methods/serialize.js
$.fn.serialize = function() {
  return param(this.serializeArray());
};

// node_modules/@mdui/jq/methods/serializeObject.js
$.fn.serializeObject = function() {
  const result = {};
  getFormControlsValue(this).forEach((element) => {
    const { name, value } = element;
    if (!Object.prototype.hasOwnProperty.call(result, name)) {
      result[name] = value;
    } else {
      const originalValue = result[name];
      if (!Array.isArray(originalValue)) {
        result[name] = [originalValue];
      }
      if (Array.isArray(value)) {
        result[name].push(...value);
      } else {
        result[name].push(value);
      }
    }
  });
  return result;
};

// node_modules/@mdui/jq/methods/show.js
var elementDisplay = {};
var defaultDisplay = (nodeName) => {
  const document3 = getDocument();
  let element;
  let display;
  if (!elementDisplay[nodeName]) {
    element = createElement(nodeName);
    appendChild(document3.body, element);
    display = getStyle(element, "display");
    removeChild(element);
    if (display === "none") {
      display = "block";
    }
    elementDisplay[nodeName] = display;
  }
  return elementDisplay[nodeName];
};
$.fn.show = function() {
  return this.each((_, element) => {
    if (element.style.display === "none") {
      element.style.display = "";
    }
    if (getStyle(element, "display") === "none") {
      element.style.display = defaultDisplay(element.nodeName);
    }
  });
};

// node_modules/@mdui/jq/methods/siblings.js
$.fn.siblings = function(selector) {
  return this.prevAll(selector).add(this.nextAll(selector));
};

// node_modules/@mdui/jq/methods/toggle.js
$.fn.toggle = function() {
  return this.each((_, element) => {
    if (getStyle(element, "display") === "none") {
      $(element).show();
    } else {
      $(element).hide();
    }
  });
};

// node_modules/@mdui/jq/methods/trigger.js
$.fn.trigger = function(name, detail = null, options) {
  const { type, namespace } = parse(name);
  const event = new MduiCustomEvent(type, {
    detail,
    data: null,
    namespace,
    bubbles: true,
    cancelable: false,
    composed: true,
    ...options
  });
  return this.each((_, element) => {
    element.dispatchEvent(event);
  });
};

// node_modules/@mdui/jq/shared/ajax.js
var ajaxStart = "ajaxStart";
var ajaxSuccess = "ajaxSuccess";
var ajaxError = "ajaxError";
var ajaxComplete = "ajaxComplete";
var globalOptions = {};
var isQueryStringData = (method) => {
  return ["GET", "HEAD"].includes(method);
};
var appendQuery = (url, query) => {
  return `${url}&${query}`.replace(/[&?]{1,2}/, "?");
};
var isCrossDomain = (url) => {
  const window2 = getWindow();
  return /^([\w-]+:)?\/\/([^/]+)/.test(url) && RegExp.$2 !== window2.location.host;
};
var isHttpStatusSuccess = (status) => {
  return status >= 200 && status < 300 || [0, 304].includes(status);
};
var mergeOptions = (options) => {
  const defaults = {
    url: "",
    method: "GET",
    data: "",
    processData: true,
    async: true,
    cache: true,
    username: "",
    password: "",
    headers: {},
    xhrFields: {},
    statusCode: {},
    dataType: "",
    contentType: "application/x-www-form-urlencoded",
    timeout: 0,
    global: true
  };
  eachObject(globalOptions, (key, value) => {
    const callbacks = [
      "beforeSend",
      "success",
      "error",
      "complete",
      "statusCode"
    ];
    if (!callbacks.includes(key) && !isUndefined(value)) {
      defaults[key] = value;
    }
  });
  return extend({}, defaults, options);
};

// node_modules/@mdui/jq/functions/ajax.js
var ajax = (options) => {
  const document3 = getDocument();
  const window2 = getWindow();
  let isCanceled = false;
  const eventParams = {};
  const successEventParams = {};
  const mergedOptions = mergeOptions(options);
  const method = mergedOptions.method.toUpperCase();
  let { data: data2, url } = mergedOptions;
  url = url || window2.location.toString();
  const { processData, async, cache, username, password, headers, xhrFields, statusCode, dataType, contentType, timeout, global: global5 } = mergedOptions;
  const isMethodQueryString = isQueryStringData(method);
  if (data2 && (isMethodQueryString || processData) && !isString(data2) && !(data2 instanceof ArrayBuffer) && !(data2 instanceof Blob) && !(data2 instanceof Document) && !(data2 instanceof FormData)) {
    data2 = param(data2);
  }
  if (data2 && isMethodQueryString) {
    url = appendQuery(url, data2);
    data2 = null;
  }
  const trigger = (event, callback, ...args) => {
    if (global5) {
      $(document3).trigger(event, callback === "success" ? successEventParams : eventParams);
    }
    let resultGlobal;
    let resultCustom;
    if (callback in globalOptions) {
      resultGlobal = globalOptions[callback](...args);
    }
    if (mergedOptions[callback]) {
      resultCustom = mergedOptions[callback](...args);
    }
    if (callback === "beforeSend" && [resultGlobal, resultCustom].includes(false)) {
      isCanceled = true;
    }
  };
  const XHR = () => {
    let textStatus;
    return new Promise((resolve, reject) => {
      const doReject = (reason) => {
        return reject(new Error(reason));
      };
      if (isMethodQueryString && !cache) {
        url = appendQuery(url, `_=${Date.now()}`);
      }
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, async, username, password);
      if (contentType || data2 && !isMethodQueryString && contentType !== false) {
        xhr.setRequestHeader("Content-Type", contentType);
      }
      if (dataType === "json") {
        xhr.setRequestHeader("Accept", "application/json, text/javascript");
      }
      eachObject(headers, (key, value) => {
        if (!isUndefined(value)) {
          xhr.setRequestHeader(key, value + "");
        }
      });
      if (!isCrossDomain(url)) {
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      }
      eachObject(xhrFields, (key, value) => {
        xhr[key] = value;
      });
      eventParams.xhr = successEventParams.xhr = xhr;
      eventParams.options = successEventParams.options = mergedOptions;
      let xhrTimeout;
      xhr.onload = () => {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }
        const isSuccess = isHttpStatusSuccess(xhr.status);
        let responseData = void 0;
        if (isSuccess) {
          textStatus = xhr.status === 204 || method === "HEAD" ? "nocontent" : xhr.status === 304 ? "notmodified" : "success";
          if (dataType === "json" || !dataType && (xhr.getResponseHeader("content-type") || "").includes("json")) {
            try {
              responseData = method === "HEAD" ? void 0 : JSON.parse(xhr.responseText);
              successEventParams.response = responseData;
            } catch (_err) {
              textStatus = "parsererror";
              trigger(ajaxError, "error", xhr, textStatus);
              doReject(textStatus);
            }
            if (textStatus !== "parsererror") {
              trigger(ajaxSuccess, "success", responseData, textStatus, xhr);
              resolve(responseData);
            }
          } else {
            responseData = method === "HEAD" ? void 0 : xhr.responseType === "text" || xhr.responseType === "" ? xhr.responseText : xhr.response;
            successEventParams.response = responseData;
            trigger(ajaxSuccess, "success", responseData, textStatus, xhr);
            resolve(responseData);
          }
        } else {
          textStatus = "error";
          trigger(ajaxError, "error", xhr, textStatus);
          doReject(textStatus);
        }
        eachArray([globalOptions.statusCode ?? {}, statusCode], (func) => {
          if (func[xhr.status]) {
            if (isSuccess) {
              func[xhr.status](responseData, textStatus, xhr);
            } else {
              func[xhr.status](xhr, textStatus);
            }
          }
        });
        trigger(ajaxComplete, "complete", xhr, textStatus);
      };
      xhr.onerror = () => {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }
        trigger(ajaxError, "error", xhr, xhr.statusText);
        trigger(ajaxComplete, "complete", xhr, "error");
        doReject(xhr.statusText);
      };
      xhr.onabort = () => {
        let statusText = "abort";
        if (xhrTimeout) {
          statusText = "timeout";
          clearTimeout(xhrTimeout);
        }
        trigger(ajaxError, "error", xhr, statusText);
        trigger(ajaxComplete, "complete", xhr, statusText);
        doReject(statusText);
      };
      trigger(ajaxStart, "beforeSend", xhr, mergedOptions);
      if (isCanceled) {
        return doReject("cancel");
      }
      if (timeout > 0) {
        xhrTimeout = window2.setTimeout(() => xhr.abort(), timeout);
      }
      xhr.send(data2);
    });
  };
  return XHR();
};

// node_modules/@mdui/jq/static/ajax.js
$.ajax = ajax;

// node_modules/@mdui/jq/functions/ajaxSetup.js
var ajaxSetup = (options) => {
  return extend(globalOptions, options);
};

// node_modules/@mdui/jq/static/ajaxSetup.js
$.ajaxSetup = ajaxSetup;

// node_modules/@mdui/jq/static/contains.js
$.contains = contains;

// node_modules/@mdui/jq/functions/data.js
function data(element, key, value) {
  if (isObjectLike(key)) {
    setAll(element, key);
    return key;
  }
  if (!isUndefined(value)) {
    set(element, key, value);
    return value;
  }
  if (isUndefined(key)) {
    return getAll(element);
  }
  return get(element, key);
}

// node_modules/@mdui/jq/static/data.js
$.data = data;

// node_modules/@mdui/jq/static/each.js
$.each = each;

// node_modules/@mdui/jq/static/extend.js
$.extend = function(target, ...objectN) {
  if (!objectN.length) {
    eachObject(target, (prop, value) => {
      this[prop] = value;
    });
    return this;
  }
  return extend(target, ...objectN);
};

// node_modules/@mdui/jq/static/map.js
$.map = map;

// node_modules/@mdui/jq/static/merge.js
$.merge = merge;

// node_modules/@mdui/jq/static/param.js
$.param = param;

// node_modules/@mdui/jq/static/removeData.js
$.removeData = removeData;

// node_modules/@mdui/jq/static/unique.js
$.unique = unique;

// node_modules/tslib/tslib.es6.mjs
function __decorate(decorators, target, key, desc2) {
  var c = arguments.length, r = c < 3 ? target : desc2 === null ? desc2 = Object.getOwnPropertyDescriptor(target, key) : desc2, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc2);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d2 = decorators[i]) r = (c < 3 ? d2(r) : c > 3 ? d2(target, key, r) : d2(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

// node_modules/@lit/reactive-element/development/css-tag.js
var NODE_MODE = false;
var global = globalThis;
var supportsAdoptingStyleSheets = global.ShadowRoot && (global.ShadyCSS === void 0 || global.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var constructionToken = /* @__PURE__ */ Symbol();
var cssTagCache = /* @__PURE__ */ new WeakMap();
var CSSResult = class {
  constructor(cssText, strings, safeToken) {
    this["_$cssResult$"] = true;
    if (safeToken !== constructionToken) {
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    }
    this.cssText = cssText;
    this._strings = strings;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let styleSheet = this._styleSheet;
    const strings = this._strings;
    if (supportsAdoptingStyleSheets && styleSheet === void 0) {
      const cacheable = strings !== void 0 && strings.length === 1;
      if (cacheable) {
        styleSheet = cssTagCache.get(strings);
      }
      if (styleSheet === void 0) {
        (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
        if (cacheable) {
          cssTagCache.set(strings, styleSheet);
        }
      }
    }
    return styleSheet;
  }
  toString() {
    return this.cssText;
  }
};
var textFromCSSResult = (value) => {
  if (value["_$cssResult$"] === true) {
    return value.cssText;
  } else if (typeof value === "number") {
    return value;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
  }
};
var unsafeCSS = (value) => new CSSResult(typeof value === "string" ? value : String(value), void 0, constructionToken);
var css = (strings, ...values) => {
  const cssText = strings.length === 1 ? strings[0] : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText, strings, constructionToken);
};
var adoptStyles = (renderRoot, styles) => {
  if (supportsAdoptingStyleSheets) {
    renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  } else {
    for (const s of styles) {
      const style25 = document.createElement("style");
      const nonce = global["litNonce"];
      if (nonce !== void 0) {
        style25.setAttribute("nonce", nonce);
      }
      style25.textContent = s.cssText;
      renderRoot.appendChild(style25);
    }
  }
};
var cssResultFromStyleSheet = (sheet) => {
  let cssText = "";
  for (const rule of sheet.cssRules) {
    cssText += rule.cssText;
  }
  return unsafeCSS(cssText);
};
var getCompatibleStyle = supportsAdoptingStyleSheets || NODE_MODE && global.CSSStyleSheet === void 0 ? (s) => s : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;

// node_modules/@lit/reactive-element/development/reactive-element.js
var { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf } = Object;
var NODE_MODE2 = false;
var global2 = globalThis;
if (NODE_MODE2) {
  global2.customElements ??= customElements;
}
var DEV_MODE = true;
var issueWarning;
var trustedTypes = global2.trustedTypes;
var emptyStringForBooleanAttribute = trustedTypes ? trustedTypes.emptyScript : "";
var polyfillSupport = DEV_MODE ? global2.reactiveElementPolyfillSupportDevMode : global2.reactiveElementPolyfillSupport;
if (DEV_MODE) {
  global2.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!global2.litIssuedWarnings.has(warning) && !global2.litIssuedWarnings.has(code)) {
      console.warn(warning);
      global2.litIssuedWarnings.add(warning);
    }
  };
  queueMicrotask(() => {
    issueWarning("dev-mode", `Lit is in dev mode. Not recommended for production!`);
    if (global2.ShadyDOM?.inUse && polyfillSupport === void 0) {
      issueWarning("polyfill-support-missing", `Shadow DOM is being polyfilled via \`ShadyDOM\` but the \`polyfill-support\` module has not been loaded.`);
    }
  });
}
var debugLogEvent = DEV_MODE ? (event) => {
  const shouldEmit = global2.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global2.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var JSCompiler_renameProperty = (prop, _obj) => prop;
var defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        value = value ? emptyStringForBooleanAttribute : null;
        break;
      case Object:
      case Array:
        value = value == null ? value : JSON.stringify(value);
        break;
    }
    return value;
  },
  fromAttribute(value, type) {
    let fromValue = value;
    switch (type) {
      case Boolean:
        fromValue = value !== null;
        break;
      case Number:
        fromValue = value === null ? null : Number(value);
        break;
      case Object:
      case Array:
        try {
          fromValue = JSON.parse(value);
        } catch (e) {
          fromValue = null;
        }
        break;
    }
    return fromValue;
  }
};
var notEqual = (value, old) => !is(value, old);
var defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  useDefault: false,
  hasChanged: notEqual
};
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata");
global2.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ReactiveElement = class extends HTMLElement {
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(initializer) {
    this.__prepare();
    (this._initializers ??= []).push(initializer);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    this.finalize();
    return this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    if (options.state) {
      options.attribute = false;
    }
    this.__prepare();
    if (this.prototype.hasOwnProperty(name)) {
      options = Object.create(options);
      options.wrapped = true;
    }
    this.elementProperties.set(name, options);
    if (!options.noAccessor) {
      const key = DEV_MODE ? (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        /* @__PURE__ */ Symbol.for(`${String(name)} (@property() cache)`)
      ) : /* @__PURE__ */ Symbol();
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== void 0) {
        defineProperty(this.prototype, name, descriptor);
      }
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(name, key, options) {
    const { get: get4, set: set4 } = getOwnPropertyDescriptor(this.prototype, name) ?? {
      get() {
        return this[key];
      },
      set(v) {
        this[key] = v;
      }
    };
    if (DEV_MODE && get4 == null) {
      if ("value" in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
        throw new Error(`Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      }
      issueWarning("reactive-property-without-getter", `Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get: get4,
      set(value) {
        const oldValue = get4?.call(this);
        set4?.call(this, value);
        this.requestUpdate(name, oldValue, options);
      },
      configurable: true,
      enumerable: true
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(name) {
    return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
  }
  /**
   * Initializes static own properties of the class used in bookkeeping
   * for element properties, initializers, etc.
   *
   * Can be called multiple times by code that needs to ensure these
   * properties exist before using them.
   *
   * This method ensures the superclass is finalized so that inherited
   * property metadata can be copied down.
   * @nocollapse
   */
  static __prepare() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("elementProperties", this))) {
      return;
    }
    const superCtor = getPrototypeOf(this);
    superCtor.finalize();
    if (superCtor._initializers !== void 0) {
      this._initializers = [...superCtor._initializers];
    }
    this.elementProperties = new Map(superCtor.elementProperties);
  }
  /**
   * Finishes setting up the class so that it's ready to be registered
   * as a custom element and instantiated.
   *
   * This method is called by the ReactiveElement.observedAttributes getter.
   * If you override the observedAttributes getter, you must either call
   * super.observedAttributes to trigger finalization, or call finalize()
   * yourself.
   *
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("finalized", this))) {
      return;
    }
    this.finalized = true;
    this.__prepare();
    if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const props = this.properties;
      const propKeys = [
        ...getOwnPropertyNames(props),
        ...getOwnPropertySymbols(props)
      ];
      for (const p of propKeys) {
        this.createProperty(p, props[p]);
      }
    }
    const metadata = this[Symbol.metadata];
    if (metadata !== null) {
      const properties = litPropertyMetadata.get(metadata);
      if (properties !== void 0) {
        for (const [p, options] of properties) {
          this.elementProperties.set(p, options);
        }
      }
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [p, options] of this.elementProperties) {
      const attr = this.__attributeNameForProperty(p, options);
      if (attr !== void 0) {
        this.__attributeToPropertyMap.set(attr, p);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);
    if (DEV_MODE) {
      if (this.hasOwnProperty("createProperty")) {
        issueWarning("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");
      }
      if (this.hasOwnProperty("getPropertyDescriptor")) {
        issueWarning("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
      }
    }
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(styles) {
    const elementStyles = [];
    if (Array.isArray(styles)) {
      const set4 = new Set(styles.flat(Infinity).reverse());
      for (const s of set4) {
        elementStyles.unshift(getCompatibleStyle(s));
      }
    } else if (styles !== void 0) {
      elementStyles.push(getCompatibleStyle(styles));
    }
    return elementStyles;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
  }
  constructor() {
    super();
    this.__instanceProperties = void 0;
    this.isUpdatePending = false;
    this.hasUpdated = false;
    this.__reflectingProperty = null;
    this.__initialize();
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    this.__updatePromise = new Promise((res) => this.enableUpdating = res);
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.__saveInstanceProperties();
    this.requestUpdate();
    this.constructor._initializers?.forEach((i) => i(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(controller) {
    (this.__controllers ??= /* @__PURE__ */ new Set()).add(controller);
    if (this.renderRoot !== void 0 && this.isConnected) {
      controller.hostConnected?.();
    }
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(controller) {
    this.__controllers?.delete(controller);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs.
   */
  __saveInstanceProperties() {
    const instanceProperties = /* @__PURE__ */ new Map();
    const elementProperties = this.constructor.elementProperties;
    for (const p of elementProperties.keys()) {
      if (this.hasOwnProperty(p)) {
        instanceProperties.set(p, this[p]);
        delete this[p];
      }
    }
    if (instanceProperties.size > 0) {
      this.__instanceProperties = instanceProperties;
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    adoptStyles(renderRoot, this.constructor.elementStyles);
    return renderRoot;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot();
    this.enableUpdating(true);
    this.__controllers?.forEach((c) => c.hostConnected?.());
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(_requestedUpdate) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    this.__controllers?.forEach((c) => c.hostDisconnected?.());
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(name, _old, value) {
    this._$attributeToProperty(name, value);
  }
  __propertyToAttribute(name, value) {
    const elemProperties = this.constructor.elementProperties;
    const options = elemProperties.get(name);
    const attr = this.constructor.__attributeNameForProperty(name, options);
    if (attr !== void 0 && options.reflect === true) {
      const converter = options.converter?.toAttribute !== void 0 ? options.converter : defaultConverter;
      const attrValue = converter.toAttribute(value, options.type);
      if (DEV_MODE && this.constructor.enabledWarnings.includes("migration") && attrValue === void 0) {
        issueWarning("undefined-attribute-value", `The attribute value for the ${name} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);
      }
      this.__reflectingProperty = name;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      }
      this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(name, value) {
    const ctor = this.constructor;
    const propName = ctor.__attributeToPropertyMap.get(name);
    if (propName !== void 0 && this.__reflectingProperty !== propName) {
      const options = ctor.getPropertyOptions(propName);
      const converter = typeof options.converter === "function" ? { fromAttribute: options.converter } : options.converter?.fromAttribute !== void 0 ? options.converter : defaultConverter;
      this.__reflectingProperty = propName;
      const convertedValue = converter.fromAttribute(value, options.type);
      this[propName] = convertedValue ?? this.__defaultValues?.get(propName) ?? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      convertedValue;
      this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @param useNewValue if true, the newValue argument is used instead of
   *     reading the property value. This is important to use if the reactive
   *     property is a standard private accessor, as opposed to a plain
   *     property, since private members can't be dynamically read by name.
   * @param newValue the new value of the property. This is only used if
   *     `useNewValue` is true.
   * @category updates
   */
  requestUpdate(name, oldValue, options, useNewValue = false, newValue) {
    if (name !== void 0) {
      if (DEV_MODE && name instanceof Event) {
        issueWarning(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
      }
      const ctor = this.constructor;
      if (useNewValue === false) {
        newValue = this[name];
      }
      options ??= ctor.getPropertyOptions(name);
      const changed = (options.hasChanged ?? notEqual)(newValue, oldValue) || // When there is no change, check a corner case that can occur when
      // 1. there's a initial value which was not reflected
      // 2. the property is subsequently set to this value.
      // For example, `prop: {useDefault: true, reflect: true}`
      // and el.prop = 'foo'. This should be considered a change if the
      // attribute is not set because we will now reflect the property to the attribute.
      options.useDefault && options.reflect && newValue === this.__defaultValues?.get(name) && !this.hasAttribute(ctor.__attributeNameForProperty(name, options));
      if (changed) {
        this._$changeProperty(name, oldValue, options);
      } else {
        return;
      }
    }
    if (this.isUpdatePending === false) {
      this.__updatePromise = this.__enqueueUpdate();
    }
  }
  /**
   * @internal
   */
  _$changeProperty(name, oldValue, { useDefault, reflect, wrapped }, initializeValue) {
    if (useDefault && !(this.__defaultValues ??= /* @__PURE__ */ new Map()).has(name)) {
      this.__defaultValues.set(name, initializeValue ?? oldValue ?? this[name]);
      if (wrapped !== true || initializeValue !== void 0) {
        return;
      }
    }
    if (!this._$changedProperties.has(name)) {
      if (!this.hasUpdated && !useDefault) {
        oldValue = void 0;
      }
      this._$changedProperties.set(name, oldValue);
    }
    if (reflect === true && this.__reflectingProperty !== name) {
      (this.__reflectingProperties ??= /* @__PURE__ */ new Set()).add(name);
    }
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async __enqueueUpdate() {
    this.isUpdatePending = true;
    try {
      await this.__updatePromise;
    } catch (e) {
      Promise.reject(e);
    }
    const result = this.scheduleUpdate();
    if (result != null) {
      await result;
    }
    return !this.isUpdatePending;
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    const result = this.performUpdate();
    if (DEV_MODE && this.constructor.enabledWarnings.includes("async-perform-update") && typeof result?.then === "function") {
      issueWarning("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);
    }
    return result;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * @category updates
   */
  performUpdate() {
    if (!this.isUpdatePending) {
      return;
    }
    debugLogEvent?.({ kind: "update" });
    if (!this.hasUpdated) {
      this.renderRoot ??= this.createRenderRoot();
      if (DEV_MODE) {
        const ctor = this.constructor;
        const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
        if (shadowedProperties.length) {
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${shadowedProperties.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
        }
      }
      if (this.__instanceProperties) {
        for (const [p, value] of this.__instanceProperties) {
          this[p] = value;
        }
        this.__instanceProperties = void 0;
      }
      const elementProperties = this.constructor.elementProperties;
      if (elementProperties.size > 0) {
        for (const [p, options] of elementProperties) {
          const { wrapped } = options;
          const value = this[p];
          if (wrapped === true && !this._$changedProperties.has(p) && value !== void 0) {
            this._$changeProperty(p, void 0, options, value);
          }
        }
      }
    }
    let shouldUpdate = false;
    const changedProperties = this._$changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.willUpdate(changedProperties);
        this.__controllers?.forEach((c) => c.hostUpdate?.());
        this.update(changedProperties);
      } else {
        this.__markUpdated();
      }
    } catch (e) {
      shouldUpdate = false;
      this.__markUpdated();
      throw e;
    }
    if (shouldUpdate) {
      this._$didUpdate(changedProperties);
    }
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(_changedProperties) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(changedProperties) {
    this.__controllers?.forEach((c) => c.hostUpdated?.());
    if (!this.hasUpdated) {
      this.hasUpdated = true;
      this.firstUpdated(changedProperties);
    }
    this.updated(changedProperties);
    if (DEV_MODE && this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update")) {
      issueWarning("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
    }
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.isUpdatePending = false;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(_changedProperties) {
    this.__reflectingProperties &&= this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p]));
    this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(_changedProperties) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(_changedProperties) {
  }
};
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: "open" };
ReactiveElement[JSCompiler_renameProperty("elementProperties", ReactiveElement)] = /* @__PURE__ */ new Map();
ReactiveElement[JSCompiler_renameProperty("finalized", ReactiveElement)] = /* @__PURE__ */ new Map();
polyfillSupport?.({ ReactiveElement });
if (DEV_MODE) {
  ReactiveElement.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const ensureOwnWarnings = function(ctor) {
    if (!ctor.hasOwnProperty(JSCompiler_renameProperty("enabledWarnings", ctor))) {
      ctor.enabledWarnings = ctor.enabledWarnings.slice();
    }
  };
  ReactiveElement.enableWarning = function(warning) {
    ensureOwnWarnings(this);
    if (!this.enabledWarnings.includes(warning)) {
      this.enabledWarnings.push(warning);
    }
  };
  ReactiveElement.disableWarning = function(warning) {
    ensureOwnWarnings(this);
    const i = this.enabledWarnings.indexOf(warning);
    if (i >= 0) {
      this.enabledWarnings.splice(i, 1);
    }
  };
}
(global2.reactiveElementVersions ??= []).push("2.1.2");
if (DEV_MODE && global2.reactiveElementVersions.length > 1) {
  queueMicrotask(() => {
    issueWarning("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
  });
}

// node_modules/lit-html/development/lit-html.js
var DEV_MODE2 = true;
var ENABLE_EXTRA_SECURITY_HOOKS = true;
var ENABLE_SHADYDOM_NOPATCH = true;
var NODE_MODE3 = false;
var global3 = globalThis;
var debugLogEvent2 = DEV_MODE2 ? (event) => {
  const shouldEmit = global3.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global3.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var debugLogRenderId = 0;
var issueWarning2;
if (DEV_MODE2) {
  global3.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning2 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!global3.litIssuedWarnings.has(warning) && !global3.litIssuedWarnings.has(code)) {
      console.warn(warning);
      global3.litIssuedWarnings.add(warning);
    }
  };
  queueMicrotask(() => {
    issueWarning2("dev-mode", `Lit is in dev mode. Not recommended for production!`);
  });
}
var wrap = ENABLE_SHADYDOM_NOPATCH && global3.ShadyDOM?.inUse && global3.ShadyDOM?.noPatch === true ? global3.ShadyDOM.wrap : (node) => node;
var trustedTypes2 = global3.trustedTypes;
var policy = trustedTypes2 ? trustedTypes2.createPolicy("lit-html", {
  createHTML: (s) => s
}) : void 0;
var identityFunction = (value) => value;
var noopSanitizer = (_node, _name, _type) => identityFunction;
var setSanitizer = (newSanitizer) => {
  if (!ENABLE_EXTRA_SECURITY_HOOKS) {
    return;
  }
  if (sanitizerFactoryInternal !== noopSanitizer) {
    throw new Error(`Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.`);
  }
  sanitizerFactoryInternal = newSanitizer;
};
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
  sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = (node, name, type) => {
  return sanitizerFactoryInternal(node, name, type);
};
var boundAttributeSuffix = "$lit$";
var marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
var markerMatch = "?" + marker;
var nodeMarker = `<${markerMatch}>`;
var d = NODE_MODE3 && global3.document === void 0 ? {
  createTreeWalker() {
    return {};
  }
} : document;
var createMarker = () => d.createComment("");
var isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
var isArray = Array.isArray;
var isIterable = (value) => isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof value?.[Symbol.iterator] === "function";
var SPACE_CHAR = `[ 	
\f\r]`;
var ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
var NAME_CHAR = `[^\\s"'>=/]`;
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var COMMENT_START = 1;
var TAG_NAME = 2;
var DYNAMIC_TAG_NAME = 3;
var commentEndRegex = /-->/g;
var comment2EndRegex = />/g;
var tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
var ENTIRE_MATCH = 0;
var ATTRIBUTE_NAME = 1;
var SPACES_AND_EQUALS = 2;
var QUOTE_CHAR = 3;
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
var rawTextElement = /^(?:script|style|textarea|title)$/i;
var HTML_RESULT = 1;
var SVG_RESULT = 2;
var MATHML_RESULT = 3;
var ATTRIBUTE_PART = 1;
var CHILD_PART = 2;
var PROPERTY_PART = 3;
var BOOLEAN_ATTRIBUTE_PART = 4;
var EVENT_PART = 5;
var ELEMENT_PART = 6;
var COMMENT_PART = 7;
var tag = (type) => (strings, ...values) => {
  if (DEV_MODE2 && strings.some((s) => s === void 0)) {
    console.warn("Some template strings are undefined.\nThis is probably caused by illegal octal escape sequences.");
  }
  if (DEV_MODE2) {
    if (values.some((val) => val?.["_$litStatic$"])) {
      issueWarning2("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);
    }
  }
  return {
    // This property needs to remain unminified.
    ["_$litType$"]: type,
    strings,
    values
  };
};
var html = tag(HTML_RESULT);
var svg = tag(SVG_RESULT);
var mathml = tag(MATHML_RESULT);
var noChange = /* @__PURE__ */ Symbol.for("lit-noChange");
var nothing = /* @__PURE__ */ Symbol.for("lit-nothing");
var templateCache = /* @__PURE__ */ new WeakMap();
var walker = d.createTreeWalker(
  d,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
  if (!isArray(tsa) || !tsa.hasOwnProperty("raw")) {
    let message = "invalid template strings array";
    if (DEV_MODE2) {
      message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, "\n");
    }
    throw new Error(message);
  }
  return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
var getTemplateHtml = (strings, type) => {
  const l = strings.length - 1;
  const attrNames = [];
  let html2 = type === SVG_RESULT ? "<svg>" : type === MATHML_RESULT ? "<math>" : "";
  let rawTextEndRegex;
  let regex = textEndRegex;
  for (let i = 0; i < l; i++) {
    const s = strings[i];
    let attrNameEndIndex = -1;
    let attrName;
    let lastIndex = 0;
    let match;
    while (lastIndex < s.length) {
      regex.lastIndex = lastIndex;
      match = regex.exec(s);
      if (match === null) {
        break;
      }
      lastIndex = regex.lastIndex;
      if (regex === textEndRegex) {
        if (match[COMMENT_START] === "!--") {
          regex = commentEndRegex;
        } else if (match[COMMENT_START] !== void 0) {
          regex = comment2EndRegex;
        } else if (match[TAG_NAME] !== void 0) {
          if (rawTextElement.test(match[TAG_NAME])) {
            rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
          }
          regex = tagEndRegex;
        } else if (match[DYNAMIC_TAG_NAME] !== void 0) {
          if (DEV_MODE2) {
            throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
          }
          regex = tagEndRegex;
        }
      } else if (regex === tagEndRegex) {
        if (match[ENTIRE_MATCH] === ">") {
          regex = rawTextEndRegex ?? textEndRegex;
          attrNameEndIndex = -1;
        } else if (match[ATTRIBUTE_NAME] === void 0) {
          attrNameEndIndex = -2;
        } else {
          attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
          attrName = match[ATTRIBUTE_NAME];
          regex = match[QUOTE_CHAR] === void 0 ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
        }
      } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
        regex = tagEndRegex;
      } else if (regex === commentEndRegex || regex === comment2EndRegex) {
        regex = textEndRegex;
      } else {
        regex = tagEndRegex;
        rawTextEndRegex = void 0;
      }
    }
    if (DEV_MODE2) {
      console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, "unexpected parse state B");
    }
    const end = regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
    html2 += regex === textEndRegex ? s + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s.slice(0, attrNameEndIndex) + boundAttributeSuffix + s.slice(attrNameEndIndex)) + marker + end : s + marker + (attrNameEndIndex === -2 ? i : end);
  }
  const htmlResult = html2 + (strings[l] || "<?>") + (type === SVG_RESULT ? "</svg>" : type === MATHML_RESULT ? "</math>" : "");
  return [trustFromTemplateString(strings, htmlResult), attrNames];
};
var Template = class _Template {
  constructor({ strings, ["_$litType$"]: type }, options) {
    this.parts = [];
    let node;
    let nodeIndex = 0;
    let attrNameIndex = 0;
    const partCount = strings.length - 1;
    const parts = this.parts;
    const [html2, attrNames] = getTemplateHtml(strings, type);
    this.el = _Template.createElement(html2, options);
    walker.currentNode = this.el.content;
    if (type === SVG_RESULT || type === MATHML_RESULT) {
      const wrapper = this.el.content.firstChild;
      wrapper.replaceWith(...wrapper.childNodes);
    }
    while ((node = walker.nextNode()) !== null && parts.length < partCount) {
      if (node.nodeType === 1) {
        if (DEV_MODE2) {
          const tag2 = node.localName;
          if (/^(?:textarea|template)$/i.test(tag2) && node.innerHTML.includes(marker)) {
            const m = `Expressions are not supported inside \`${tag2}\` elements. See https://lit.dev/msg/expression-in-${tag2} for more information.`;
            if (tag2 === "template") {
              throw new Error(m);
            } else
              issueWarning2("", m);
          }
        }
        if (node.hasAttributes()) {
          for (const name of node.getAttributeNames()) {
            if (name.endsWith(boundAttributeSuffix)) {
              const realName = attrNames[attrNameIndex++];
              const value = node.getAttribute(name);
              const statics = value.split(marker);
              const m = /([.?@])?(.*)/.exec(realName);
              parts.push({
                type: ATTRIBUTE_PART,
                index: nodeIndex,
                name: m[2],
                strings: statics,
                ctor: m[1] === "." ? PropertyPart : m[1] === "?" ? BooleanAttributePart : m[1] === "@" ? EventPart : AttributePart
              });
              node.removeAttribute(name);
            } else if (name.startsWith(marker)) {
              parts.push({
                type: ELEMENT_PART,
                index: nodeIndex
              });
              node.removeAttribute(name);
            }
          }
        }
        if (rawTextElement.test(node.tagName)) {
          const strings2 = node.textContent.split(marker);
          const lastIndex = strings2.length - 1;
          if (lastIndex > 0) {
            node.textContent = trustedTypes2 ? trustedTypes2.emptyScript : "";
            for (let i = 0; i < lastIndex; i++) {
              node.append(strings2[i], createMarker());
              walker.nextNode();
              parts.push({ type: CHILD_PART, index: ++nodeIndex });
            }
            node.append(strings2[lastIndex], createMarker());
          }
        }
      } else if (node.nodeType === 8) {
        const data2 = node.data;
        if (data2 === markerMatch) {
          parts.push({ type: CHILD_PART, index: nodeIndex });
        } else {
          let i = -1;
          while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
            parts.push({ type: COMMENT_PART, index: nodeIndex });
            i += marker.length - 1;
          }
        }
      }
      nodeIndex++;
    }
    if (DEV_MODE2) {
      if (attrNames.length !== attrNameIndex) {
        throw new Error(`Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=\${true} ?disabled=\${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: 
\`` + strings.join("${...}") + "`");
      }
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(html2, _options) {
    const el = d.createElement("template");
    el.innerHTML = html2;
    return el;
  }
};
function resolveDirective(part, value, parent = part, attributeIndex) {
  if (value === noChange) {
    return value;
  }
  let currentDirective = attributeIndex !== void 0 ? parent.__directives?.[attributeIndex] : parent.__directive;
  const nextDirectiveConstructor = isPrimitive(value) ? void 0 : (
    // This property needs to remain unminified.
    value["_$litDirective$"]
  );
  if (currentDirective?.constructor !== nextDirectiveConstructor) {
    currentDirective?.["_$notifyDirectiveConnectionChanged"]?.(false);
    if (nextDirectiveConstructor === void 0) {
      currentDirective = void 0;
    } else {
      currentDirective = new nextDirectiveConstructor(part);
      currentDirective._$initialize(part, parent, attributeIndex);
    }
    if (attributeIndex !== void 0) {
      (parent.__directives ??= [])[attributeIndex] = currentDirective;
    } else {
      parent.__directive = currentDirective;
    }
  }
  if (currentDirective !== void 0) {
    value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
  }
  return value;
}
var TemplateInstance = class {
  constructor(template, parent) {
    this._$parts = [];
    this._$disconnectableChildren = void 0;
    this._$template = template;
    this._$parent = parent;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(options) {
    const { el: { content }, parts } = this._$template;
    const fragment = (options?.creationScope ?? d).importNode(content, true);
    walker.currentNode = fragment;
    let node = walker.nextNode();
    let nodeIndex = 0;
    let partIndex = 0;
    let templatePart = parts[0];
    while (templatePart !== void 0) {
      if (nodeIndex === templatePart.index) {
        let part;
        if (templatePart.type === CHILD_PART) {
          part = new ChildPart(node, node.nextSibling, this, options);
        } else if (templatePart.type === ATTRIBUTE_PART) {
          part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
        } else if (templatePart.type === ELEMENT_PART) {
          part = new ElementPart(node, this, options);
        }
        this._$parts.push(part);
        templatePart = parts[++partIndex];
      }
      if (nodeIndex !== templatePart?.index) {
        node = walker.nextNode();
        nodeIndex++;
      }
    }
    walker.currentNode = d;
    return fragment;
  }
  _update(values) {
    let i = 0;
    for (const part of this._$parts) {
      if (part !== void 0) {
        debugLogEvent2 && debugLogEvent2({
          kind: "set part",
          part,
          value: values[i],
          valueIndex: i,
          values,
          templateInstance: this
        });
        if (part.strings !== void 0) {
          part._$setValue(values, part, i);
          i += part.strings.length - 2;
        } else {
          part._$setValue(values[i]);
        }
      }
      i++;
    }
  }
};
var ChildPart = class _ChildPart {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent?._$isConnected ?? this.__isConnected;
  }
  constructor(startNode, endNode, parent, options) {
    this.type = CHILD_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this._$startNode = startNode;
    this._$endNode = endNode;
    this._$parent = parent;
    this.options = options;
    this.__isConnected = options?.isConnected ?? true;
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._textSanitizer = void 0;
    }
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let parentNode = wrap(this._$startNode).parentNode;
    const parent = this._$parent;
    if (parent !== void 0 && parentNode?.nodeType === 11) {
      parentNode = parent.parentNode;
    }
    return parentNode;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(value, directiveParent = this) {
    if (DEV_MODE2 && this.parentNode === null) {
      throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
    }
    value = resolveDirective(this, value, directiveParent);
    if (isPrimitive(value)) {
      if (value === nothing || value == null || value === "") {
        if (this._$committedValue !== nothing) {
          debugLogEvent2 && debugLogEvent2({
            kind: "commit nothing to child",
            start: this._$startNode,
            end: this._$endNode,
            parent: this._$parent,
            options: this.options
          });
          this._$clear();
        }
        this._$committedValue = nothing;
      } else if (value !== this._$committedValue && value !== noChange) {
        this._commitText(value);
      }
    } else if (value["_$litType$"] !== void 0) {
      this._commitTemplateResult(value);
    } else if (value.nodeType !== void 0) {
      if (DEV_MODE2 && this.options?.host === value) {
        this._commitText(`[probable mistake: rendered a template's host in itself (commonly caused by writing \${this} in a template]`);
        console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
        return;
      }
      this._commitNode(value);
    } else if (isIterable(value)) {
      this._commitIterable(value);
    } else {
      this._commitText(value);
    }
  }
  _insert(node) {
    return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
  }
  _commitNode(value) {
    if (this._$committedValue !== value) {
      this._$clear();
      if (ENABLE_EXTRA_SECURITY_HOOKS && sanitizerFactoryInternal !== noopSanitizer) {
        const parentNodeName = this._$startNode.parentNode?.nodeName;
        if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
          let message = "Forbidden";
          if (DEV_MODE2) {
            if (parentNodeName === "STYLE") {
              message = `Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css\`...\` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.`;
            } else {
              message = `Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.`;
            }
          }
          throw new Error(message);
        }
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value,
        options: this.options
      });
      this._$committedValue = this._insert(value);
    }
  }
  _commitText(value) {
    if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
      const node = wrap(this._$startNode).nextSibling;
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(node, "data", "property");
        }
        value = this._textSanitizer(value);
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit text",
        node,
        value,
        options: this.options
      });
      node.data = value;
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        const textNode = d.createTextNode("");
        this._commitNode(textNode);
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(textNode, "data", "property");
        }
        value = this._textSanitizer(value);
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: textNode,
          value,
          options: this.options
        });
        textNode.data = value;
      } else {
        this._commitNode(d.createTextNode(value));
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: wrap(this._$startNode).nextSibling,
          value,
          options: this.options
        });
      }
    }
    this._$committedValue = value;
  }
  _commitTemplateResult(result) {
    const { values, ["_$litType$"]: type } = result;
    const template = typeof type === "number" ? this._$getTemplate(result) : (type.el === void 0 && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
    if (this._$committedValue?._$template === template) {
      debugLogEvent2 && debugLogEvent2({
        kind: "template updating",
        template,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values
      });
      this._$committedValue._update(values);
    } else {
      const instance = new TemplateInstance(template, this);
      const fragment = instance._clone(this.options);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      instance._update(values);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated and updated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      this._commitNode(fragment);
      this._$committedValue = instance;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(result) {
    let template = templateCache.get(result.strings);
    if (template === void 0) {
      templateCache.set(result.strings, template = new Template(result));
    }
    return template;
  }
  _commitIterable(value) {
    if (!isArray(this._$committedValue)) {
      this._$committedValue = [];
      this._$clear();
    }
    const itemParts = this._$committedValue;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      if (partIndex === itemParts.length) {
        itemParts.push(itemPart = new _ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
      } else {
        itemPart = itemParts[partIndex];
      }
      itemPart._$setValue(item);
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
      itemParts.length = partIndex;
    }
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives
   *     in those Parts.
   *
   * @internal
   */
  _$clear(start = wrap(this._$startNode).nextSibling, from) {
    this._$notifyConnectionChanged?.(false, true, from);
    while (start !== this._$endNode) {
      const n = wrap(start).nextSibling;
      wrap(start).remove();
      start = n;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this method
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(isConnected) {
    if (this._$parent === void 0) {
      this.__isConnected = isConnected;
      this._$notifyConnectionChanged?.(isConnected);
    } else if (DEV_MODE2) {
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
    }
  }
};
var AttributePart = class {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(element, name, strings, parent, options) {
    this.type = ATTRIBUTE_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this.element = element;
    this.name = name;
    this._$parent = parent;
    this.options = options;
    if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
      this._$committedValue = new Array(strings.length - 1).fill(new String());
      this.strings = strings;
    } else {
      this._$committedValue = nothing;
    }
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._sanitizer = void 0;
    }
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(value, directiveParent = this, valueIndex, noCommit) {
    const strings = this.strings;
    let change = false;
    if (strings === void 0) {
      value = resolveDirective(this, value, directiveParent, 0);
      change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
      if (change) {
        this._$committedValue = value;
      }
    } else {
      const values = value;
      value = strings[0];
      let i, v;
      for (i = 0; i < strings.length - 1; i++) {
        v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
        if (v === noChange) {
          v = this._$committedValue[i];
        }
        change ||= !isPrimitive(v) || v !== this._$committedValue[i];
        if (v === nothing) {
          value = nothing;
        } else if (value !== nothing) {
          value += (v ?? "") + strings[i + 1];
        }
        this._$committedValue[i] = v;
      }
    }
    if (change && !noCommit) {
      this._commitValue(value);
    }
  }
  /** @internal */
  _commitValue(value) {
    if (value === nothing) {
      wrap(this.element).removeAttribute(this.name);
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._sanitizer === void 0) {
          this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "attribute");
        }
        value = this._sanitizer(value ?? "");
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit attribute",
        element: this.element,
        name: this.name,
        value,
        options: this.options
      });
      wrap(this.element).setAttribute(this.name, value ?? "");
    }
  }
};
var PropertyPart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = PROPERTY_PART;
  }
  /** @internal */
  _commitValue(value) {
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      if (this._sanitizer === void 0) {
        this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "property");
      }
      value = this._sanitizer(value);
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value,
      options: this.options
    });
    this.element[this.name] = value === nothing ? void 0 : value;
  }
};
var BooleanAttributePart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = BOOLEAN_ATTRIBUTE_PART;
  }
  /** @internal */
  _commitValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(value && value !== nothing),
      options: this.options
    });
    wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
  }
};
var EventPart = class extends AttributePart {
  constructor(element, name, strings, parent, options) {
    super(element, name, strings, parent, options);
    this.type = EVENT_PART;
    if (DEV_MODE2 && this.strings !== void 0) {
      throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
    }
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(newListener, directiveParent = this) {
    newListener = resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
    if (newListener === noChange) {
      return;
    }
    const oldListener = this._$committedValue;
    const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
    const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
    debugLogEvent2 && debugLogEvent2({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: newListener,
      options: this.options,
      removeListener: shouldRemoveListener,
      addListener: shouldAddListener,
      oldListener
    });
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.name, this, oldListener);
    }
    if (shouldAddListener) {
      this.element.addEventListener(this.name, this, newListener);
    }
    this._$committedValue = newListener;
  }
  handleEvent(event) {
    if (typeof this._$committedValue === "function") {
      this._$committedValue.call(this.options?.host ?? this.element, event);
    } else {
      this._$committedValue.handleEvent(event);
    }
  }
};
var ElementPart = class {
  constructor(element, parent, options) {
    this.element = element;
    this.type = ELEMENT_PART;
    this._$disconnectableChildren = void 0;
    this._$parent = parent;
    this.options = options;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit to element binding",
      element: this.element,
      value,
      options: this.options
    });
    resolveDirective(this, value);
  }
};
var _$LH = {
  // Used in lit-ssr
  _boundAttributeSuffix: boundAttributeSuffix,
  _marker: marker,
  _markerMatch: markerMatch,
  _HTML_RESULT: HTML_RESULT,
  _getTemplateHtml: getTemplateHtml,
  // Used in tests and private-ssr-support
  _TemplateInstance: TemplateInstance,
  _isIterable: isIterable,
  _resolveDirective: resolveDirective,
  _ChildPart: ChildPart,
  _AttributePart: AttributePart,
  _BooleanAttributePart: BooleanAttributePart,
  _EventPart: EventPart,
  _PropertyPart: PropertyPart,
  _ElementPart: ElementPart
};
var polyfillSupport2 = DEV_MODE2 ? global3.litHtmlPolyfillSupportDevMode : global3.litHtmlPolyfillSupport;
polyfillSupport2?.(Template, ChildPart);
(global3.litHtmlVersions ??= []).push("3.3.2");
if (DEV_MODE2 && global3.litHtmlVersions.length > 1) {
  queueMicrotask(() => {
    issueWarning2("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
  });
}
var render = (value, container2, options) => {
  if (DEV_MODE2 && container2 == null) {
    throw new TypeError(`The container to render into may not be ${container2}`);
  }
  const renderId = DEV_MODE2 ? debugLogRenderId++ : 0;
  const partOwnerNode = options?.renderBefore ?? container2;
  let part = partOwnerNode["_$litPart$"];
  debugLogEvent2 && debugLogEvent2({
    kind: "begin render",
    id: renderId,
    value,
    container: container2,
    options,
    part
  });
  if (part === void 0) {
    const endNode = options?.renderBefore ?? null;
    partOwnerNode["_$litPart$"] = part = new ChildPart(container2.insertBefore(createMarker(), endNode), endNode, void 0, options ?? {});
  }
  part._$setValue(value);
  debugLogEvent2 && debugLogEvent2({
    kind: "end render",
    id: renderId,
    value,
    container: container2,
    options,
    part
  });
  return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
  render.setSanitizer = setSanitizer;
  render.createSanitizer = createSanitizer;
  if (DEV_MODE2) {
    render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
  }
}

// node_modules/lit-element/development/lit-element.js
var JSCompiler_renameProperty2 = (prop, _obj) => prop;
var DEV_MODE3 = true;
var global4 = globalThis;
var issueWarning3;
if (DEV_MODE3) {
  global4.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning3 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!global4.litIssuedWarnings.has(warning) && !global4.litIssuedWarnings.has(code)) {
      console.warn(warning);
      global4.litIssuedWarnings.add(warning);
    }
  };
}
var LitElement = class extends ReactiveElement {
  constructor() {
    super(...arguments);
    this.renderOptions = { host: this };
    this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = super.createRenderRoot();
    this.renderOptions.renderBefore ??= renderRoot.firstChild;
    return renderRoot;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(changedProperties) {
    const value = this.render();
    if (!this.hasUpdated) {
      this.renderOptions.isConnected = this.isConnected;
    }
    super.update(changedProperties);
    this.__childPart = render(value, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.__childPart?.setConnected(true);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__childPart?.setConnected(false);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return noChange;
  }
};
LitElement["_$litElement$"] = true;
LitElement[JSCompiler_renameProperty2("finalized", LitElement)] = true;
global4.litElementHydrateSupport?.({ LitElement });
var polyfillSupport3 = DEV_MODE3 ? global4.litElementPolyfillSupportDevMode : global4.litElementPolyfillSupport;
polyfillSupport3?.({ LitElement });
(global4.litElementVersions ??= []).push("4.2.2");
if (DEV_MODE3 && global4.litElementVersions.length > 1) {
  queueMicrotask(() => {
    issueWarning3("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
  });
}

// node_modules/@lit/reactive-element/development/decorators/custom-element.js
var customElement = (tagName) => (classOrTarget, context) => {
  if (context !== void 0) {
    context.addInitializer(() => {
      customElements.define(tagName, classOrTarget);
    });
  } else {
    customElements.define(tagName, classOrTarget);
  }
};

// node_modules/@lit/reactive-element/development/decorators/property.js
var DEV_MODE4 = true;
var issueWarning4;
if (DEV_MODE4) {
  globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning4 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!globalThis.litIssuedWarnings.has(warning) && !globalThis.litIssuedWarnings.has(code)) {
      console.warn(warning);
      globalThis.litIssuedWarnings.add(warning);
    }
  };
}
var legacyProperty = (options, proto, name) => {
  const hasOwnProperty = proto.hasOwnProperty(name);
  proto.constructor.createProperty(name, options);
  return hasOwnProperty ? Object.getOwnPropertyDescriptor(proto, name) : void 0;
};
var defaultPropertyDeclaration2 = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
var standardProperty = (options = defaultPropertyDeclaration2, target, context) => {
  const { kind, metadata } = context;
  if (DEV_MODE4 && metadata == null) {
    issueWarning4("missing-class-metadata", `The class ${target} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  }
  let properties = globalThis.litPropertyMetadata.get(metadata);
  if (properties === void 0) {
    globalThis.litPropertyMetadata.set(metadata, properties = /* @__PURE__ */ new Map());
  }
  if (kind === "setter") {
    options = Object.create(options);
    options.wrapped = true;
  }
  properties.set(context.name, options);
  if (kind === "accessor") {
    const { name } = context;
    return {
      set(v) {
        const oldValue = target.get.call(this);
        target.set.call(this, v);
        this.requestUpdate(name, oldValue, options, true, v);
      },
      init(v) {
        if (v !== void 0) {
          this._$changeProperty(name, void 0, options, v);
        }
        return v;
      }
    };
  } else if (kind === "setter") {
    const { name } = context;
    return function(value) {
      const oldValue = this[name];
      target.call(this, value);
      this.requestUpdate(name, oldValue, options, true, value);
    };
  }
  throw new Error(`Unsupported decorator location: ${kind}`);
};
function property(options) {
  return (protoOrTarget, nameOrContext) => {
    return typeof nameOrContext === "object" ? standardProperty(options, protoOrTarget, nameOrContext) : legacyProperty(options, protoOrTarget, nameOrContext);
  };
}

// node_modules/@lit/reactive-element/development/decorators/state.js
function state(options) {
  return property({
    ...options,
    // Add both `state` and `attribute` because we found a third party
    // controller that is keying off of PropertyOptions.state to determine
    // whether a field is a private internal property or not.
    state: true,
    attribute: false
  });
}

// node_modules/@lit/reactive-element/development/decorators/base.js
var desc = (obj, name, descriptor) => {
  descriptor.configurable = true;
  descriptor.enumerable = true;
  if (
    // We check for Reflect.decorate each time, in case the zombiefill
    // is applied via lazy loading some Angular code.
    Reflect.decorate && typeof name !== "object"
  ) {
    Object.defineProperty(obj, name, descriptor);
  }
  return descriptor;
};

// node_modules/@lit/reactive-element/development/decorators/query.js
var DEV_MODE5 = true;
var issueWarning5;
if (DEV_MODE5) {
  globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning5 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!globalThis.litIssuedWarnings.has(warning) && !globalThis.litIssuedWarnings.has(code)) {
      console.warn(warning);
      globalThis.litIssuedWarnings.add(warning);
    }
  };
}

// node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js
function queryAssignedElements(options) {
  return ((obj, name) => {
    const { slot, selector } = options ?? {};
    const slotSelector = `slot${slot ? `[name=${slot}]` : ":not([name])"}`;
    return desc(obj, name, {
      get() {
        const slotEl = this.renderRoot?.querySelector(slotSelector);
        const elements = slotEl?.assignedElements(options) ?? [];
        return selector === void 0 ? elements : elements.filter((node) => node.matches(selector));
      }
    });
  });
}

// node_modules/lit-html/development/directives/if-defined.js
var ifDefined = (value) => value ?? nothing;

// node_modules/lit-html/development/directive.js
var PartType = {
  ATTRIBUTE: 1,
  CHILD: 2,
  PROPERTY: 3,
  BOOLEAN_ATTRIBUTE: 4,
  EVENT: 5,
  ELEMENT: 6
};
var directive = (c) => (...values) => ({
  // This property needs to remain unminified.
  ["_$litDirective$"]: c,
  values
});
var Directive = class {
  constructor(_partInfo) {
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  /** @internal */
  _$initialize(part, parent, attributeIndex) {
    this.__part = part;
    this._$parent = parent;
    this.__attributeIndex = attributeIndex;
  }
  /** @internal */
  _$resolve(part, props) {
    return this.update(part, props);
  }
  update(_part, props) {
    return this.render(...props);
  }
};

// node_modules/lit-html/development/directives/style-map.js
var important = "important";
var importantFlag = " !" + important;
var flagTrim = 0 - importantFlag.length;
var StyleMapDirective = class extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== "style" || partInfo.strings?.length > 2) {
      throw new Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
    }
  }
  render(styleInfo) {
    return Object.keys(styleInfo).reduce((style25, prop) => {
      const value = styleInfo[prop];
      if (value == null) {
        return style25;
      }
      prop = prop.includes("-") ? prop : prop.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase();
      return style25 + `${prop}:${value};`;
    }, "");
  }
  update(part, [styleInfo]) {
    const { style: style25 } = part.element;
    if (this._previousStyleProperties === void 0) {
      this._previousStyleProperties = new Set(Object.keys(styleInfo));
      return this.render(styleInfo);
    }
    for (const name of this._previousStyleProperties) {
      if (styleInfo[name] == null) {
        this._previousStyleProperties.delete(name);
        if (name.includes("-")) {
          style25.removeProperty(name);
        } else {
          style25[name] = null;
        }
      }
    }
    for (const name in styleInfo) {
      const value = styleInfo[name];
      if (value != null) {
        this._previousStyleProperties.add(name);
        const isImportant = typeof value === "string" && value.endsWith(importantFlag);
        if (name.includes("-") || isImportant) {
          style25.setProperty(name, isImportant ? value.slice(0, flagTrim) : value, isImportant ? important : "");
        } else {
          style25[name] = value;
        }
      }
    }
    return noChange;
  }
};
var styleMap = directive(StyleMapDirective);

// node_modules/@mdui/shared/base/mdui-element.js
var MduiElement = class extends LitElement {
  /**
   * 触发自定义事件。若返回 false，表示事件被取消
   * @param type
   * @param options 通常只用到 cancelable 和 detail；bubbles、composed 统一不用
   */
  emit(type, options) {
    const event = new CustomEvent(type, Object.assign({
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {}
    }, options));
    return this.dispatchEvent(event);
  }
};

// node_modules/@mdui/shared/controllers/has-slot.js
var HasSlotController = class {
  constructor(host, ...slotNames) {
    this.slotNames = [];
    (this.host = host).addController(this);
    this.slotNames = slotNames;
    this.onSlotChange = this.onSlotChange.bind(this);
  }
  hostConnected() {
    this.host.shadowRoot.addEventListener("slotchange", this.onSlotChange);
    if (!isDomReady()) {
      $(() => {
        this.host.requestUpdate();
      });
    }
  }
  hostDisconnected() {
    this.host.shadowRoot.removeEventListener("slotchange", this.onSlotChange);
  }
  test(slotName) {
    return slotName === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
  }
  hasDefaultSlot() {
    return [...this.host.childNodes].some((node) => {
      if (node.nodeType === node.TEXT_NODE && node.textContent.trim() !== "") {
        return true;
      }
      if (node.nodeType === node.ELEMENT_NODE) {
        const el = node;
        if (!el.hasAttribute("slot")) {
          return true;
        }
      }
      return false;
    });
  }
  hasNamedSlot(name) {
    return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
  }
  onSlotChange(event) {
    const slot = event.target;
    if (this.slotNames.includes("[default]") && !slot.name || slot.name && this.slotNames.includes(slot.name)) {
      this.host.requestUpdate();
    }
  }
};

// node_modules/@mdui/shared/helpers/template.js
var nothingTemplate = html`${nothing}`;

// node_modules/@mdui/shared/lit-styles/component-style.js
var componentStyle = css`:host{box-sizing:border-box}:host *,:host ::after,:host ::before{box-sizing:inherit}:host :focus,:host :focus-visible,:host(:focus),:host(:focus-visible){outline:0}[hidden]{display:none!important}`;

// node_modules/lit-html/development/directives/unsafe-html.js
var HTML_RESULT2 = 1;
var UnsafeHTMLDirective = class extends Directive {
  constructor(partInfo) {
    super(partInfo);
    this._value = nothing;
    if (partInfo.type !== PartType.CHILD) {
      throw new Error(`${this.constructor.directiveName}() can only be used in child bindings`);
    }
  }
  render(value) {
    if (value === nothing || value == null) {
      this._templateResult = void 0;
      return this._value = value;
    }
    if (value === noChange) {
      return value;
    }
    if (typeof value != "string") {
      throw new Error(`${this.constructor.directiveName}() called with a non-string value`);
    }
    if (value === this._value) {
      return this._templateResult;
    }
    this._value = value;
    const strings = [value];
    strings.raw = strings;
    return this._templateResult = {
      // Cast to a known set of integers that satisfy ResultType so that we
      // don't have to export ResultType and possibly encourage this pattern.
      // This property needs to remain unminified.
      ["_$litType$"]: this.constructor.resultType,
      strings,
      values: []
    };
  }
};
UnsafeHTMLDirective.directiveName = "unsafeHTML";
UnsafeHTMLDirective.resultType = HTML_RESULT2;
var unsafeHTML = directive(UnsafeHTMLDirective);

// node_modules/lit-html/development/directives/unsafe-svg.js
var SVG_RESULT2 = 2;
var UnsafeSVGDirective = class extends UnsafeHTMLDirective {
};
UnsafeSVGDirective.directiveName = "unsafeSVG";
UnsafeSVGDirective.resultType = SVG_RESULT2;
var unsafeSVG = directive(UnsafeSVGDirective);

// node_modules/lit-html/development/directive-helpers.js
var { _ChildPart: ChildPart2 } = _$LH;
var ENABLE_SHADYDOM_NOPATCH2 = true;
var wrap2 = ENABLE_SHADYDOM_NOPATCH2 && window.ShadyDOM?.inUse && window.ShadyDOM?.noPatch === true ? window.ShadyDOM.wrap : (node) => node;
var isPrimitive2 = (value) => value === null || typeof value != "object" && typeof value != "function";
var isSingleExpression = (part) => part.strings === void 0;
var RESET_VALUE = {};
var setCommittedValue = (part, value = RESET_VALUE) => part._$committedValue = value;

// node_modules/lit-html/development/async-directive.js
var DEV_MODE6 = true;
var notifyChildrenConnectedChanged = (parent, isConnected) => {
  const children = parent._$disconnectableChildren;
  if (children === void 0) {
    return false;
  }
  for (const obj of children) {
    obj["_$notifyDirectiveConnectionChanged"]?.(isConnected, false);
    notifyChildrenConnectedChanged(obj, isConnected);
  }
  return true;
};
var removeDisconnectableFromParent = (obj) => {
  let parent, children;
  do {
    if ((parent = obj._$parent) === void 0) {
      break;
    }
    children = parent._$disconnectableChildren;
    children.delete(obj);
    obj = parent;
  } while (children?.size === 0);
};
var addDisconnectableToParent = (obj) => {
  for (let parent; parent = obj._$parent; obj = parent) {
    let children = parent._$disconnectableChildren;
    if (children === void 0) {
      parent._$disconnectableChildren = children = /* @__PURE__ */ new Set();
    } else if (children.has(obj)) {
      break;
    }
    children.add(obj);
    installDisconnectAPI(parent);
  }
};
function reparentDisconnectables(newParent) {
  if (this._$disconnectableChildren !== void 0) {
    removeDisconnectableFromParent(this);
    this._$parent = newParent;
    addDisconnectableToParent(this);
  } else {
    this._$parent = newParent;
  }
}
function notifyChildPartConnectedChanged(isConnected, isClearingValue = false, fromPartIndex = 0) {
  const value = this._$committedValue;
  const children = this._$disconnectableChildren;
  if (children === void 0 || children.size === 0) {
    return;
  }
  if (isClearingValue) {
    if (Array.isArray(value)) {
      for (let i = fromPartIndex; i < value.length; i++) {
        notifyChildrenConnectedChanged(value[i], false);
        removeDisconnectableFromParent(value[i]);
      }
    } else if (value != null) {
      notifyChildrenConnectedChanged(value, false);
      removeDisconnectableFromParent(value);
    }
  } else {
    notifyChildrenConnectedChanged(this, isConnected);
  }
}
var installDisconnectAPI = (obj) => {
  if (obj.type == PartType.CHILD) {
    obj._$notifyConnectionChanged ??= notifyChildPartConnectedChanged;
    obj._$reparentDisconnectables ??= reparentDisconnectables;
  }
};
var AsyncDirective = class extends Directive {
  constructor() {
    super(...arguments);
    this._$disconnectableChildren = void 0;
  }
  /**
   * Initialize the part with internal fields
   * @param part
   * @param parent
   * @param attributeIndex
   */
  _$initialize(part, parent, attributeIndex) {
    super._$initialize(part, parent, attributeIndex);
    addDisconnectableToParent(this);
    this.isConnected = part._$isConnected;
  }
  // This property needs to remain unminified.
  /**
   * Called from the core code when a directive is going away from a part (in
   * which case `shouldRemoveFromParent` should be true), and from the
   * `setChildrenConnected` helper function when recursively changing the
   * connection state of a tree (in which case `shouldRemoveFromParent` should
   * be false).
   *
   * @param isConnected
   * @param isClearingDirective - True when the directive itself is being
   *     removed; false when the tree is being disconnected
   * @internal
   */
  ["_$notifyDirectiveConnectionChanged"](isConnected, isClearingDirective = true) {
    if (isConnected !== this.isConnected) {
      this.isConnected = isConnected;
      if (isConnected) {
        this.reconnected?.();
      } else {
        this.disconnected?.();
      }
    }
    if (isClearingDirective) {
      notifyChildrenConnectedChanged(this, isConnected);
      removeDisconnectableFromParent(this);
    }
  }
  /**
   * Sets the value of the directive's Part outside the normal `update`/`render`
   * lifecycle of a directive.
   *
   * This method should not be called synchronously from a directive's `update`
   * or `render`.
   *
   * @param directive The directive to update
   * @param value The value to set
   */
  setValue(value) {
    if (isSingleExpression(this.__part)) {
      this.__part._$setValue(value, this);
    } else {
      if (DEV_MODE6 && this.__attributeIndex === void 0) {
        throw new Error(`Expected this.__attributeIndex to be a number`);
      }
      const newValues = [...this.__part._$committedValue];
      newValues[this.__attributeIndex] = value;
      this.__part._$setValue(newValues, this, 0);
    }
  }
  /**
   * User callbacks for implementing logic to release any resources/subscriptions
   * that may have been retained by this directive. Since directives may also be
   * re-connected, `reconnected` should also be implemented to restore the
   * working state of the directive prior to the next render.
   */
  disconnected() {
  }
  reconnected() {
  }
};

// node_modules/lit-html/development/directives/private-async-helpers.js
var PseudoWeakRef = class {
  constructor(ref2) {
    this._ref = ref2;
  }
  /**
   * Disassociates the ref with the backing instance.
   */
  disconnect() {
    this._ref = void 0;
  }
  /**
   * Reassociates the ref with the backing instance.
   */
  reconnect(ref2) {
    this._ref = ref2;
  }
  /**
   * Retrieves the backing instance (will be undefined when disconnected)
   */
  deref() {
    return this._ref;
  }
};
var Pauser = class {
  constructor() {
    this._promise = void 0;
    this._resolve = void 0;
  }
  /**
   * When paused, returns a promise to be awaited; when unpaused, returns
   * undefined. Note that in the microtask between the pauser being resumed
   * an await of this promise resolving, the pauser could be paused again,
   * hence callers should check the promise in a loop when awaiting.
   * @returns A promise to be awaited when paused or undefined
   */
  get() {
    return this._promise;
  }
  /**
   * Creates a promise to be awaited
   */
  pause() {
    this._promise ??= new Promise((resolve) => this._resolve = resolve);
  }
  /**
   * Resolves the promise which may be awaited
   */
  resume() {
    this._resolve?.();
    this._promise = this._resolve = void 0;
  }
};

// node_modules/lit-html/development/directives/until.js
var isPromise = (x) => {
  return !isPrimitive2(x) && typeof x.then === "function";
};
var _infinity = 1073741823;
var UntilDirective = class extends AsyncDirective {
  constructor() {
    super(...arguments);
    this.__lastRenderedIndex = _infinity;
    this.__values = [];
    this.__weakThis = new PseudoWeakRef(this);
    this.__pauser = new Pauser();
  }
  render(...args) {
    return args.find((x) => !isPromise(x)) ?? noChange;
  }
  update(_part, args) {
    const previousValues = this.__values;
    let previousLength = previousValues.length;
    this.__values = args;
    const weakThis = this.__weakThis;
    const pauser = this.__pauser;
    if (!this.isConnected) {
      this.disconnected();
    }
    for (let i = 0; i < args.length; i++) {
      if (i > this.__lastRenderedIndex) {
        break;
      }
      const value = args[i];
      if (!isPromise(value)) {
        this.__lastRenderedIndex = i;
        return value;
      }
      if (i < previousLength && value === previousValues[i]) {
        continue;
      }
      this.__lastRenderedIndex = _infinity;
      previousLength = 0;
      Promise.resolve(value).then(async (result) => {
        while (pauser.get()) {
          await pauser.get();
        }
        const _this = weakThis.deref();
        if (_this !== void 0) {
          const index = _this.__values.indexOf(value);
          if (index > -1 && index < _this.__lastRenderedIndex) {
            _this.__lastRenderedIndex = index;
            _this.setValue(result);
          }
        }
      });
    }
    return noChange;
  }
  disconnected() {
    this.__weakThis.disconnect();
    this.__pauser.pause();
  }
  reconnected() {
    this.__weakThis.reconnect(this);
    this.__pauser.resume();
  }
};
var until = directive(UntilDirective);

// node_modules/mdui/components/icon/style.js
var style = css`:host{display:inline-block;width:1em;height:1em;font-weight:400;font-family:'Material Icons';font-display:block;font-style:normal;line-height:1;direction:ltr;letter-spacing:normal;white-space:nowrap;text-transform:none;word-wrap:normal;-webkit-font-smoothing:antialiased;text-rendering:optimizelegibility;-moz-osx-font-smoothing:grayscale;font-size:1.5rem}::slotted(svg),svg{width:100%;height:100%;fill:currentcolor}`;

// node_modules/mdui/components/icon/index.js
var Icon = class Icon2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "[default]");
  }
  render() {
    const renderDefault = () => {
      if (this.name) {
        const [name, variant] = this.name.split("--");
        const familyMap = /* @__PURE__ */ new Map([
          ["outlined", "Material Icons Outlined"],
          ["filled", "Material Icons"],
          ["rounded", "Material Icons Round"],
          ["sharp", "Material Icons Sharp"],
          ["two-tone", "Material Icons Two Tone"]
        ]);
        return html`<span translate="no" style="${styleMap({ fontFamily: familyMap.get(variant) })}">${name}</span>`;
      }
      if (this.src) {
        return html`${until(ajax({ url: this.src }).then(unsafeSVG))}`;
      }
      return html``;
    };
    return this.hasSlotController.test("[default]") ? html`<slot></slot>` : renderDefault();
  }
};
Icon.styles = [componentStyle, style];
__decorate([
  property({ reflect: true })
], Icon.prototype, "name", void 0);
__decorate([
  property({ reflect: true })
], Icon.prototype, "src", void 0);
Icon = __decorate([
  customElement("mdui-icon")
], Icon);

// node_modules/mdui/components/avatar/style.js
var style2 = css`:host{--shape-corner:var(--mdui-shape-corner-full);position:relative;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;white-space:nowrap;vertical-align:middle;border-radius:var(--shape-corner);-webkit-user-select:none;user-select:none;width:2.5rem;height:2.5rem;background-color:rgb(var(--mdui-color-primary-container));color:rgb(var(--mdui-color-on-primary-container));font-size:var(--mdui-typescale-title-medium-size);font-weight:var(--mdui-typescale-title-medium-weight);letter-spacing:var(--mdui-typescale-title-medium-tracking);line-height:var(--mdui-typescale-title-medium-line-height)}img{width:100%;height:100%}::slotted(mdui-icon),mdui-icon{font-size:1.5em}`;

// node_modules/mdui/components/avatar/index.js
var Avatar = class Avatar2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "[default]");
  }
  render() {
    return this.hasSlotController.test("[default]") ? html`<slot></slot>` : this.src ? html`<img part="image" alt="${ifDefined(this.label)}" src="${this.src}" style="${styleMap({ objectFit: this.fit })}">` : this.icon ? html`<mdui-icon part="icon" name="${this.icon}"></mdui-icon>` : nothingTemplate;
  }
};
Avatar.styles = [componentStyle, style2];
__decorate([
  property({ reflect: true })
], Avatar.prototype, "src", void 0);
__decorate([
  property({ reflect: true })
], Avatar.prototype, "fit", void 0);
__decorate([
  property({ reflect: true })
], Avatar.prototype, "icon", void 0);
__decorate([
  property({ reflect: true })
], Avatar.prototype, "label", void 0);
Avatar = __decorate([
  customElement("mdui-avatar")
], Avatar);

// node_modules/mdui/components/badge/style.js
var style3 = css`:host{--shape-corner:var(--mdui-shape-corner-full);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:var(--shape-corner);padding-left:.25rem;padding-right:.25rem;color:rgb(var(--mdui-color-on-error));background-color:rgb(var(--mdui-color-error));height:1rem;min-width:1rem;font-size:var(--mdui-typescale-label-small-size);font-weight:var(--mdui-typescale-label-small-weight);letter-spacing:var(--mdui-typescale-label-small-tracking);line-height:var(--mdui-typescale-label-small-line-height)}:host([variant=small]){min-width:0;padding:0;width:.375rem;height:.375rem}`;

// node_modules/mdui/components/badge/index.js
var Badge = class Badge2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.variant = "large";
  }
  render() {
    if (this.variant === "small") {
      return nothingTemplate;
    }
    return html`<slot></slot>`;
  }
};
Badge.styles = [componentStyle, style3];
__decorate([
  property({ reflect: true })
], Badge.prototype, "variant", void 0);
Badge = __decorate([
  customElement("mdui-badge")
], Badge);

// node_modules/@mdui/shared/helpers/decorator.js
var booleanConverter = (value) => {
  return value !== null && value.toLowerCase() !== "false";
};

// node_modules/@mdui/shared/controllers/defined.js
var DefinedController = class {
  constructor(host, options) {
    this.defined = false;
    (this.host = host).addController(this);
    this.relatedElements = options.relatedElements;
    this.needDomReady = options.needDomReady || !!options.relatedElements;
    this.onSlotChange = this.onSlotChange.bind(this);
  }
  hostConnected() {
    this.host.shadowRoot.addEventListener("slotchange", this.onSlotChange);
  }
  hostDisconnected() {
    this.host.shadowRoot.removeEventListener("slotchange", this.onSlotChange);
  }
  /**
   * 判断组件是否定义完成
   */
  isDefined() {
    if (this.defined) {
      return true;
    }
    this.defined = (!this.needDomReady || isDomReady()) && !this.getUndefinedLocalNames().length;
    return this.defined;
  }
  /**
   * 在组件定义完成后，promise 被 resolve
   */
  async whenDefined() {
    if (this.defined) {
      return Promise.resolve();
    }
    const document3 = getDocument();
    if (this.needDomReady && !isDomReady(document3)) {
      await new Promise((resolve) => {
        document3.addEventListener("DOMContentLoaded", () => resolve(), {
          once: true
        });
      });
    }
    const undefinedLocalNames = this.getUndefinedLocalNames();
    if (undefinedLocalNames.length) {
      const promises = [];
      undefinedLocalNames.forEach((localName) => {
        promises.push(customElements.whenDefined(localName));
      });
      await Promise.all(promises);
    }
    this.defined = true;
    return;
  }
  /**
   * slot 中的未完成定义的相关 Web components 组件的 CSS 选择器
   */
  getScopeLocalNameSelector() {
    const localNames = this.relatedElements;
    if (!localNames) {
      return null;
    }
    if (Array.isArray(localNames)) {
      return localNames.map((localName) => `${localName}:not(:defined)`).join(",");
    }
    return Object.keys(localNames).filter((localName) => !localNames[localName]).map((localName) => `${localName}:not(:defined)`).join(",");
  }
  /**
   * 整个页面中的未完成定义的相关 Web components 组件的 CSS 选择器
   */
  getGlobalLocalNameSelector() {
    const localNames = this.relatedElements;
    if (!localNames || Array.isArray(localNames)) {
      return null;
    }
    return Object.keys(localNames).filter((localName) => localNames[localName]).map((localName) => `${localName}:not(:defined)`).join(",");
  }
  /**
   * 获取未完成定义的相关 Web components 组件名
   */
  getUndefinedLocalNames() {
    const scopeSelector = this.getScopeLocalNameSelector();
    const globalSelector = this.getGlobalLocalNameSelector();
    const undefinedScopeElements = scopeSelector ? [...this.host.querySelectorAll(scopeSelector)] : [];
    const undefinedGlobalElements = globalSelector ? [...getDocument().querySelectorAll(globalSelector)] : [];
    const localNames = [
      ...undefinedScopeElements,
      ...undefinedGlobalElements
    ].map((element) => element.localName);
    return unique(localNames);
  }
  /**
   * slot 变更时，若 slot 中包含未完成定义的相关 Web components 组件，则组件未定义完成
   */
  onSlotChange() {
    const selector = this.getScopeLocalNameSelector();
    if (selector) {
      const undefinedElements = this.host.querySelectorAll(selector);
      if (undefinedElements.length) {
        this.defined = false;
      }
    }
  }
};

// node_modules/@mdui/shared/decorators/watch.js
function watch(propName, waitUntilFirstUpdate = false) {
  return (proto, functionName) => {
    const { update } = proto;
    if (propName in proto) {
      proto.update = function(changedProperties) {
        if (changedProperties.has(propName)) {
          const oldValue = changedProperties.get(propName);
          const newValue = this[propName];
          if (oldValue !== newValue) {
            if (!waitUntilFirstUpdate || this.hasUpdated) {
              this[functionName](oldValue, newValue);
            }
          }
        }
        update.call(this, changedProperties);
      };
    }
  };
}

// node_modules/@mdui/shared/mixins/scrollBehavior.js
var weakMap2 = /* @__PURE__ */ new WeakMap();
var ScrollBehaviorMixin = (superclass) => {
  class ScrollBehaviorMixinClass extends superclass {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
      super(...args);
      this.scrollBehaviorDefinedController = new DefinedController(this, {
        needDomReady: true
      });
      this.lastScrollTopThreshold = 0;
      this.lastScrollTopNoThreshold = 0;
      this.isParentLayout = false;
      this.onListeningScroll = this.onListeningScroll.bind(this);
    }
    /**
     * 滚动时，如果需要给 container 添加 padding，添加在顶部还是底部
     */
    get scrollPaddingPosition() {
      throw new Error("Must implement scrollPaddingPosition getter");
    }
    async onScrollTargetChange(oldValue, newValue) {
      const hasUpdated = this.hasUpdated;
      await this.scrollBehaviorDefinedController.whenDefined();
      if (hasUpdated) {
        this.setContainerPadding("remove", oldValue);
        this.setContainerPadding("add", newValue);
      }
      if (!this.scrollBehavior) {
        return;
      }
      const oldListening = this.getListening(oldValue);
      if (oldListening) {
        oldListening.removeEventListener("scroll", this.onListeningScroll);
      }
      const newListening = this.getListening(newValue);
      if (newListening) {
        this.updateScrollTop(newListening);
        newListening.addEventListener("scroll", this.onListeningScroll);
      }
    }
    async onScrollBehaviorChange() {
      await this.scrollBehaviorDefinedController.whenDefined();
      const listening = this.getListening(this.scrollTarget);
      if (!listening) {
        return;
      }
      if (this.scrollBehavior) {
        this.updateScrollTop(listening);
        listening.addEventListener("scroll", this.onListeningScroll);
      } else {
        listening.removeEventListener("scroll", this.onListeningScroll);
      }
    }
    connectedCallback() {
      super.connectedCallback();
      this.scrollBehaviorDefinedController.whenDefined().then(() => {
        this.isParentLayout = isNodeName(this.parentElement, "mdui-layout");
        this.setContainerPadding("add", this.scrollTarget);
      });
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.scrollBehaviorDefinedController.whenDefined().then(() => {
        this.setContainerPadding("remove", this.scrollTarget);
      });
    }
    /**
     * scrollBehavior 包含多个滚动行为，用空格分割
     * 用该方法判断指定滚动行为是否在 scrollBehavior 中
     * @param behavior 为数组时，只要其中一个行为在 scrollBehavior 中，即返回 `true`
     */
    hasScrollBehavior(behavior) {
      const behaviors = this.scrollBehavior?.split(" ") ?? [];
      if (Array.isArray(behavior)) {
        return !!behaviors.filter((v) => behavior.includes(v)).length;
      } else {
        return behaviors.includes(behavior);
      }
    }
    /**
     * 执行滚动事件，在滚动距离超过 scrollThreshold 时才会执行
     * Note: 父类可以按需实现该方法
     * @param _isScrollingUp 是否向上滚动
     * @param _scrollTop 距离 scrollTarget 顶部的距离
     */
    runScrollThreshold(_isScrollingUp, _scrollTop) {
      return;
    }
    /**
     * 执行滚动事件，会无视 scrollThreshold，始终会执行
     * @param _isScrollingUp 是否向上滚动
     * @param _scrollTop 距离 scrollTarget 顶部的距离
     */
    runScrollNoThreshold(_isScrollingUp, _scrollTop) {
      return;
    }
    /**
     * 更新滚动容器的 padding，避免内容被 navigation-bar 覆盖
     * @param action 新增、更新、移除 padding
     * @param scrollTarget 在该元素上添加、更新或移除 padding
     */
    setContainerPadding(action, scrollTarget) {
      const container2 = this.getContainer(scrollTarget);
      if (!container2 || this.isParentLayout) {
        return;
      }
      const position = this.scrollPaddingPosition;
      const propName = position === "top" ? "paddingTop" : "paddingBottom";
      if (action === "add" || action === "update") {
        const propValue = ["fixed", "absolute"].includes($(this).css("position")) ? this.offsetHeight : null;
        $(container2).css({ [propName]: propValue });
        if (action === "add" && propValue !== null) {
          const options = weakMap2.get(container2) ?? { top: [], bottom: [] };
          options[position].push(this);
          weakMap2.set(container2, options);
        }
      }
      if (action === "remove") {
        const options = weakMap2.get(container2);
        if (!options) {
          return;
        }
        const index = options[position].indexOf(this);
        if (index > -1) {
          options[position].splice(index, 1);
          weakMap2.set(container2, options);
        }
        if (!options[position].length) {
          $(container2).css({ [propName]: null });
        }
      }
    }
    onListeningScroll() {
      const listening = this.getListening(this.scrollTarget);
      window.requestAnimationFrame(() => this.onScroll(listening));
    }
    /**
     * 滚动事件，这里过滤掉不符合条件的滚动
     */
    onScroll(listening) {
      const scrollTop = listening.scrollY ?? listening.scrollTop;
      if (this.lastScrollTopNoThreshold !== scrollTop) {
        this.runScrollNoThreshold(scrollTop < this.lastScrollTopNoThreshold, scrollTop);
        this.lastScrollTopNoThreshold = scrollTop;
      }
      if (Math.abs(scrollTop - this.lastScrollTopThreshold) > (this.scrollThreshold || 0)) {
        this.runScrollThreshold(scrollTop < this.lastScrollTopThreshold, scrollTop);
        this.lastScrollTopThreshold = scrollTop;
      }
    }
    /**
     * 重新更新 lastScrollTopThreshold、lastScrollTopNoThreshold 的值
     * 用于在 scrollTarget、scrollBehavior 变更时，重新设置 lastScrollTopThreshold、lastScrollTopNoThreshold 的初始值
     */
    updateScrollTop(listening) {
      this.lastScrollTopThreshold = this.lastScrollTopNoThreshold = listening.scrollY ?? listening.scrollTop;
    }
    /**
     * 获取组件需要监听哪个元素的滚动状态
     */
    getListening(target) {
      return target ? $(target)[0] : window;
    }
    /**
     * 获取组件在哪个容器内滚动
     */
    getContainer(target) {
      return target ? $(target)[0] : document.body;
    }
  }
  __decorate([
    property({ attribute: "scroll-target" })
  ], ScrollBehaviorMixinClass.prototype, "scrollTarget", void 0);
  __decorate([
    property({ reflect: true, attribute: "scroll-behavior" })
  ], ScrollBehaviorMixinClass.prototype, "scrollBehavior", void 0);
  __decorate([
    property({ type: Number, reflect: true, attribute: "scroll-threshold" })
  ], ScrollBehaviorMixinClass.prototype, "scrollThreshold", void 0);
  __decorate([
    watch("scrollTarget")
  ], ScrollBehaviorMixinClass.prototype, "onScrollTargetChange", null);
  __decorate([
    watch("scrollBehavior")
  ], ScrollBehaviorMixinClass.prototype, "onScrollBehaviorChange", null);
  return ScrollBehaviorMixinClass;
};

// node_modules/@mdui/shared/helpers/uniqueId.js
var id = 0;
var uniqueId = () => {
  return ++id;
};

// node_modules/@mdui/shared/helpers/observeResize.js
var weakMap3;
var observer;
var observeResize = (target, callback) => {
  const $target = $(target);
  const key = uniqueId();
  const result = {
    unobserve: () => {
      $target.each((_, target2) => {
        const options = weakMap3.get(target2);
        const index = options.coArr.findIndex((co) => co.key === key);
        if (index !== -1) {
          options.coArr.splice(index, 1);
        }
        if (!options.coArr.length) {
          observer.unobserve(target2);
          weakMap3.delete(target2);
        } else {
          weakMap3.set(target2, options);
        }
      });
    }
  };
  if (!weakMap3) {
    weakMap3 = /* @__PURE__ */ new WeakMap();
    observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const target2 = entry.target;
        const options = weakMap3.get(target2);
        options.entry = entry;
        options.coArr.forEach((co) => {
          co.callback.call(result, entry, result);
        });
      });
    });
  }
  $target.each((_, target2) => {
    const options = weakMap3.get(target2) ?? { coArr: [] };
    if (options.coArr.length && options.entry) {
      callback.call(result, options.entry, result);
    }
    options.coArr.push({ callback, key });
    weakMap3.set(target2, options);
    observer.observe(target2);
  });
  return result;
};

// node_modules/mdui/components/layout/helper.js
var LayoutManager = class {
  constructor() {
    this.states = [];
  }
  /**
   * 注册 `<mdui-layout-main>`
   */
  registerMain(element) {
    this.$main = $(element);
  }
  /**
   * 取消注册 `<mdui-layout-main>`
   */
  unregisterMain() {
    this.$main = void 0;
  }
  /**
   * 注册新的 `<mdui-layout-item>`
   */
  registerItem(element) {
    const state2 = { element };
    this.states.push(state2);
    state2.observeResize = observeResize(state2.element, () => {
      this.updateLayout(state2.element, {
        width: this.isNoWidth(state2) ? 0 : void 0
      });
    });
    this.items = void 0;
    this.resort();
    this.updateLayout();
  }
  /**
   * 取消注册 `<mdui-layout-item>`
   */
  unregisterItem(element) {
    const index = this.states.findIndex((item2) => item2.element === element);
    if (index < 0) {
      return;
    }
    const item = this.states[index];
    item.observeResize?.unobserve();
    this.items = void 0;
    this.states.splice(index, 1);
    if (this.states[index]) {
      this.updateLayout(this.states[index].element);
    }
  }
  /**
   * 获取所有 `<mdui-layout-item>` 元素（按在 DOM 中的顺序）
   */
  getItems() {
    if (!this.items) {
      const items = this.states.map((state2) => state2.element);
      this.items = items.sort((a, b) => {
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1;
        } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return this.items;
  }
  /**
   * 获取 `<mdui-layout-main>` 元素
   */
  getMain() {
    return this.$main ? this.$main[0] : void 0;
  }
  /**
   * 获取 `<mdui-layout-item>` 及 `<mdui-layout-main>` 元素
   */
  getItemsAndMain() {
    return [...this.getItems(), this.getMain()].filter((i) => i);
  }
  /**
   * 更新 `order` 值，更新完后重新计算布局
   */
  updateOrder() {
    this.resort();
    this.updateLayout();
  }
  /**
   * 重新计算布局
   * @param element 从哪一个元素开始更新；若未传入参数，则将更新所有元素
   * @param size 此次更新中，元素的宽高（仅在此次更新中使用）。若不传则自动计算
   */
  updateLayout(element, size) {
    const state2 = element ? {
      element,
      width: size?.width,
      height: size?.height
    } : void 0;
    const index = state2 ? this.states.findIndex((v) => v.element === state2.element) : 0;
    if (index < 0) {
      return;
    }
    Object.assign(this.states[index], state2);
    this.states.forEach((currState, currIndex) => {
      if (currIndex < index) {
        return;
      }
      const placement = currState.element.layoutPlacement;
      const prevState = currIndex > 0 ? this.states[currIndex - 1] : void 0;
      const top = prevState?.top ?? 0;
      const right = prevState?.right ?? 0;
      const bottom = prevState?.bottom ?? 0;
      const left = prevState?.left ?? 0;
      Object.assign(currState, { top, right, bottom, left });
      switch (placement) {
        case "top":
        case "bottom":
          currState[placement] += currState.height ?? currState.element.offsetHeight;
          break;
        case "right":
        case "left":
          currState[placement] += (this.isNoWidth(currState) ? 0 : currState.width) ?? currState.element.offsetWidth;
          break;
      }
      currState.height = currState.width = void 0;
      $(currState.element).css({
        position: "absolute",
        top: placement === "bottom" ? null : top,
        right: placement === "left" ? null : right,
        bottom: placement === "top" ? null : bottom,
        left: placement === "right" ? null : left
      });
    });
    const lastState = this.states[this.states.length - 1];
    if (this.$main) {
      this.$main.css({
        paddingTop: lastState.top,
        paddingRight: lastState.right,
        paddingBottom: lastState.bottom,
        paddingLeft: lastState.left
      });
    }
  }
  /**
   * 按 order 排序，order 相同时，按在 DOM 中的顺序排序
   */
  resort() {
    const items = this.getItems();
    this.states.sort((a, b) => {
      const aOrder = a.element.order ?? 0;
      const bOrder = b.element.order ?? 0;
      if (aOrder > bOrder) {
        return 1;
      }
      if (aOrder < bOrder) {
        return -1;
      }
      if (items.indexOf(a.element) > items.indexOf(b.element)) {
        return 1;
      }
      if (items.indexOf(a.element) < items.indexOf(b.element)) {
        return -1;
      }
      return 0;
    });
  }
  /**
   * 组件宽度是否为 0
   * mdui-navigation-drawer 较为特殊，在为模态化时，占据的宽度为 0
   */
  isNoWidth(state2) {
    return isNodeName(state2.element, "mdui-navigation-drawer") && // @ts-ignore
    state2.element.isModal;
  }
};
var layoutManagerMap = /* @__PURE__ */ new WeakMap();
var getLayout = (element) => {
  if (!layoutManagerMap.has(element)) {
    layoutManagerMap.set(element, new LayoutManager());
  }
  return layoutManagerMap.get(element);
};

// node_modules/mdui/components/layout/layout-item-base.js
var LayoutItemBase = class extends MduiElement {
  constructor() {
    super(...arguments);
    this.isParentLayout = false;
  }
  /**
   * 当前布局组件所处的位置，父类必须实现该 getter
   */
  get layoutPlacement() {
    throw new Error("Must implement placement getter!");
  }
  // order 变更时，需要重新调整布局
  onOrderChange() {
    this.layoutManager?.updateOrder();
  }
  connectedCallback() {
    super.connectedCallback();
    const parentElement = this.parentElement;
    this.isParentLayout = isNodeName(parentElement, "mdui-layout");
    if (this.isParentLayout) {
      this.layoutManager = getLayout(parentElement);
      this.layoutManager.registerItem(this);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.layoutManager) {
      this.layoutManager.unregisterItem(this);
    }
  }
};
__decorate([
  property({ type: Number, reflect: true })
], LayoutItemBase.prototype, "order", void 0);
__decorate([
  watch("order", true)
], LayoutItemBase.prototype, "onOrderChange", null);

// node_modules/mdui/components/bottom-app-bar/style.js
var style4 = css`:host{--shape-corner:var(--mdui-shape-corner-none);--z-index:2000;position:fixed;right:0;bottom:0;left:0;display:flex;flex:0 0 auto;align-items:center;justify-content:flex-start;border-radius:var(--shape-corner) var(--shape-corner) 0 0;z-index:var(--z-index);transition:bottom var(--mdui-motion-duration-long2) var(--mdui-motion-easing-emphasized);padding:0 1rem;height:5rem;background-color:rgb(var(--mdui-color-surface-container));box-shadow:var(--mdui-elevation-level2)}:host([scroll-target]:not([scroll-target=''])){position:absolute}:host([hide]:not([hide=false i])){transition-duration:var(--mdui-motion-duration-short4);bottom:-5.625rem}::slotted(:not(:first-child)){margin-left:.5rem}::slotted(mdui-fab){box-shadow:var(--mdui-elevation-level0)}:host([fab-detach]:not([fab-detach=false i])) ::slotted(mdui-fab){position:absolute;transition:bottom var(--mdui-motion-duration-long2) var(--mdui-motion-easing-standard);right:1rem;bottom:.75rem}:host([fab-detach][hide][scroll-behavior~=hide]:not([hide=false i],[fab-detach=false i])) ::slotted(mdui-fab){transition-duration:var(--mdui-motion-duration-short4);bottom:1rem;box-shadow:var(--mdui-elevation-level2)}:host([fab-detach][hide][scroll-behavior~=hide][scroll-target]:not([fab-detach=false i],[hide=false i],[scroll-target=''])) ::slotted(mdui-fab){bottom:6.625rem}:host([hide]:not([hide=false i])) ::slotted(:not(mdui-fab)),:host([hide]:not([hide=false i],[fab-detach])) ::slotted(mdui-fab),:host([hide][fab-detach=false i]:not([hide=false i])) ::slotted(mdui-fab){transform:translateY(8.75rem);transition:transform var(--mdui-motion-duration-0) var(--mdui-motion-easing-emphasized-accelerate) var(--mdui-motion-duration-short4)}::slotted(:first-child){transition:transform var(--mdui-motion-duration-short3) var(--mdui-motion-easing-emphasized-decelerate) var(--mdui-motion-duration-short1)}::slotted(:nth-child(2)){transition:transform var(--mdui-motion-duration-short3) var(--mdui-motion-easing-emphasized-decelerate) var(--mdui-motion-duration-short3)}::slotted(:nth-child(3)){transition:transform var(--mdui-motion-duration-short3) var(--mdui-motion-easing-emphasized-decelerate) var(--mdui-motion-duration-short4)}::slotted(:nth-child(4)){transition:transform var(--mdui-motion-duration-short3) var(--mdui-motion-easing-emphasized-decelerate) var(--mdui-motion-duration-medium1)}::slotted(:nth-child(5)){transition:transform var(--mdui-motion-duration-short3) var(--mdui-motion-easing-emphasized-decelerate) var(--mdui-motion-duration-medium2)}::slotted(:nth-child(6)){transition:transform var(--mdui-motion-duration-short3) var(--mdui-motion-easing-emphasized-decelerate) var(--mdui-motion-duration-medium3)}`;

// node_modules/mdui/components/bottom-app-bar/index.js
var BottomAppBar = class BottomAppBar2 extends ScrollBehaviorMixin(LayoutItemBase) {
  constructor() {
    super(...arguments);
    this.hide = false;
    this.fabDetach = false;
  }
  get scrollPaddingPosition() {
    return "bottom";
  }
  get layoutPlacement() {
    return "bottom";
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.addEventListener("transitionend", (event) => {
      if (event.target === this) {
        this.emit(this.hide ? "hidden" : "shown");
      }
    });
  }
  render() {
    return html`<slot></slot>`;
  }
  /**
   * 滚动行为
   * 当前仅支持 hide 这一个行为，所以不做行为类型判断
   */
  runScrollThreshold(isScrollingUp) {
    if (!isScrollingUp && !this.hide) {
      const eventProceeded = this.emit("hide", { cancelable: true });
      if (eventProceeded) {
        this.hide = true;
      }
    }
    if (isScrollingUp && this.hide) {
      const eventProceeded = this.emit("show", { cancelable: true });
      if (eventProceeded) {
        this.hide = false;
      }
    }
  }
};
BottomAppBar.styles = [componentStyle, style4];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], BottomAppBar.prototype, "hide", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "fab-detach"
  })
], BottomAppBar.prototype, "fabDetach", void 0);
__decorate([
  property({ reflect: true, attribute: "scroll-behavior" })
], BottomAppBar.prototype, "scrollBehavior", void 0);
BottomAppBar = __decorate([
  customElement("mdui-bottom-app-bar")
], BottomAppBar);

// node_modules/lit-html/development/directives/ref.js
var createRef = () => new Ref();
var Ref = class {
};
var lastElementForContextAndCallback = /* @__PURE__ */ new WeakMap();
var RefDirective = class extends AsyncDirective {
  render(_ref) {
    return nothing;
  }
  update(part, [ref2]) {
    const refChanged = ref2 !== this._ref;
    if (refChanged && this._ref !== void 0) {
      this._updateRefValue(void 0);
    }
    if (refChanged || this._lastElementForRef !== this._element) {
      this._ref = ref2;
      this._context = part.options?.host;
      this._updateRefValue(this._element = part.element);
    }
    return nothing;
  }
  _updateRefValue(element) {
    if (!this.isConnected) {
      element = void 0;
    }
    if (typeof this._ref === "function") {
      const context = this._context ?? globalThis;
      let lastElementForCallback = lastElementForContextAndCallback.get(context);
      if (lastElementForCallback === void 0) {
        lastElementForCallback = /* @__PURE__ */ new WeakMap();
        lastElementForContextAndCallback.set(context, lastElementForCallback);
      }
      if (lastElementForCallback.get(this._ref) !== void 0) {
        this._ref.call(this._context, void 0);
      }
      lastElementForCallback.set(this._ref, element);
      if (element !== void 0) {
        this._ref.call(this._context, element);
      }
    } else {
      this._ref.value = element;
    }
  }
  get _lastElementForRef() {
    return typeof this._ref === "function" ? lastElementForContextAndCallback.get(this._context ?? globalThis)?.get(this._ref) : this._ref?.value;
  }
  disconnected() {
    if (this._lastElementForRef === this._element) {
      this._updateRefValue(void 0);
    }
  }
  reconnected() {
    this._updateRefValue(this._element);
  }
};
var ref = directive(RefDirective);

// node_modules/classcat/index.js
function cc(names) {
  if (typeof names === "string" || typeof names === "number") return "" + names;
  let out = "";
  if (Array.isArray(names)) {
    for (let i = 0, tmp; i < names.length; i++) {
      if ((tmp = cc(names[i])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (let k in names) {
      if (names[k]) out += (out && " ") + k;
    }
  }
  return out;
}

// node_modules/@mdui/shared/controllers/form.js
var reportValidityOverloads = /* @__PURE__ */ new WeakMap();
var formResets = /* @__PURE__ */ new WeakMap();
var FormController = class {
  constructor(host, options) {
    (this.host = host).addController(this);
    this.definedController = new DefinedController(host, {
      needDomReady: true
    });
    this.options = {
      form: (control) => {
        const formId = $(control).attr("form");
        if (formId) {
          const root = control.getRootNode();
          return root.getElementById(formId);
        }
        return control.closest("form");
      },
      name: (control) => control.name,
      value: (control) => control.value,
      defaultValue: (control) => control.defaultValue,
      setValue: (control, value) => control.value = value,
      disabled: (control) => control.disabled,
      reportValidity: (control) => isFunction(control.reportValidity) ? control.reportValidity() : true,
      ...options
    };
    this.onFormData = this.onFormData.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormReset = this.onFormReset.bind(this);
    this.reportFormValidity = this.reportFormValidity.bind(this);
  }
  hostConnected() {
    this.definedController.whenDefined().then(() => {
      this.form = this.options.form(this.host);
      if (this.form) {
        this.attachForm(this.form);
      }
    });
  }
  hostDisconnected() {
    this.detachForm();
  }
  hostUpdated() {
    this.definedController.whenDefined().then(() => {
      const form = this.options.form(this.host);
      if (!form) {
        this.detachForm();
      }
      if (form && this.form !== form) {
        this.detachForm();
        this.attachForm(form);
      }
    });
  }
  /**
   * 获取当前表单控件关联的 `<form>` 元素
   */
  getForm() {
    return this.form ?? null;
  }
  /**
   * 重置整个表单，所有表单控件恢复成默认值
   */
  reset(invoker) {
    this.doAction("reset", invoker);
  }
  /**
   * 提交整个表单
   */
  submit(invoker) {
    this.doAction("submit", invoker);
  }
  attachForm(form) {
    if (!form) {
      this.form = void 0;
      return;
    }
    this.form = form;
    if (formCollections.has(this.form)) {
      formCollections.get(this.form).add(this.host);
    } else {
      formCollections.set(this.form, /* @__PURE__ */ new Set([this.host]));
    }
    this.form.addEventListener("formdata", this.onFormData);
    this.form.addEventListener("submit", this.onFormSubmit);
    this.form.addEventListener("reset", this.onFormReset);
    if (!reportValidityOverloads.has(this.form)) {
      reportValidityOverloads.set(this.form, this.form.reportValidity);
      this.form.reportValidity = () => this.reportFormValidity();
    }
  }
  detachForm() {
    if (this.form) {
      formCollections.get(this.form).delete(this.host);
      this.form.removeEventListener("formdata", this.onFormData);
      this.form.removeEventListener("submit", this.onFormSubmit);
      this.form.removeEventListener("reset", this.onFormReset);
      if (reportValidityOverloads.has(this.form) && !formCollections.get(this.form).size) {
        this.form.reportValidity = reportValidityOverloads.get(this.form);
        reportValidityOverloads.delete(this.form);
      }
    }
  }
  doAction(type, invoker) {
    if (!this.form) {
      return;
    }
    const $button = $(`<button type="${type}">`).css({
      position: "absolute",
      width: 0,
      height: 0,
      clipPath: "inset(50%)",
      overflow: "hidden",
      whiteSpace: "nowrap"
    });
    const button = $button[0];
    if (invoker) {
      button.name = invoker.name;
      button.value = invoker.value;
      [
        "formaction",
        "formenctype",
        "formmethod",
        "formnovalidate",
        "formtarget"
      ].forEach((attr) => {
        $button.attr(attr, $(invoker).attr(attr));
      });
    }
    this.form.append(button);
    button.click();
    button.remove();
  }
  onFormData(event) {
    const disabled = this.options.disabled(this.host);
    const name = this.options.name(this.host);
    const value = this.options.value(this.host);
    const isButton = [
      "mdui-button",
      "mdui-button-icon",
      "mdui-chip",
      "mdui-fab",
      "mdui-segmented-button"
    ].includes(this.host.tagName.toLowerCase());
    if (!disabled && !isButton && isString(name) && name && !isUndefined(value)) {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          event.formData.append(name, val.toString());
        });
      } else {
        event.formData.append(name, value.toString());
      }
    }
  }
  // todo: 当前组件进行验证的顺序，取决于组件的注册顺序，而不会按在 DOM 中的顺序从上到下验证。如何按 DOM 顺序验证？
  onFormSubmit(event) {
    const disabled = this.options.disabled(this.host);
    const reportValidity = this.options.reportValidity;
    if (this.form && !this.form.noValidate && !disabled && !reportValidity(this.host)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
  onFormReset() {
    if (this.form) {
      this.options.setValue(this.host, this.options.defaultValue(this.host));
      this.host.invalid = false;
      if (formResets.has(this.form)) {
        formResets.get(this.form).add(this.host);
      } else {
        formResets.set(this.form, /* @__PURE__ */ new Set([this.host]));
      }
    }
  }
  reportFormValidity() {
    if (this.form && !this.form.noValidate) {
      const elements = getFormControls(this.form);
      for (const element of elements) {
        if (isFunction(element.reportValidity) && !element.reportValidity()) {
          return false;
        }
      }
    }
    return true;
  }
};

// node_modules/@mdui/shared/mixins/anchor.js
var AnchorMixin = (superclass) => {
  class AnchorMixinClass extends superclass {
    renderAnchor({ id: id2, className: className2, part, content = html`<slot></slot>`, refDirective, tabIndex }) {
      return html`<a ${refDirective} id="${ifDefined(id2)}" class="_a ${className2 ? className2 : ""}" part="${ifDefined(part)}" href="${ifDefined(this.href)}" download="${ifDefined(this.download)}" target="${ifDefined(this.target)}" rel="${ifDefined(this.rel)}" tabindex="${ifDefined(tabIndex)}">${content}</a>`;
    }
  }
  __decorate([
    property({ reflect: true })
  ], AnchorMixinClass.prototype, "href", void 0);
  __decorate([
    property({ reflect: true })
  ], AnchorMixinClass.prototype, "download", void 0);
  __decorate([
    property({ reflect: true })
  ], AnchorMixinClass.prototype, "target", void 0);
  __decorate([
    property({ reflect: true })
  ], AnchorMixinClass.prototype, "rel", void 0);
  return AnchorMixinClass;
};

// node_modules/@mdui/shared/mixins/focusable.js
var isClick = true;
var document2 = getDocument();
document2.addEventListener("pointerdown", () => {
  isClick = true;
});
document2.addEventListener("keydown", () => {
  isClick = false;
});
var FocusableMixin = (superclass) => {
  class FocusableMixinClass extends superclass {
    constructor() {
      super(...arguments);
      this.autofocus = false;
      this.focused = false;
      this.focusVisible = false;
      this.focusableDefinedController = new DefinedController(this, { relatedElements: [""] });
      this._manipulatingTabindex = false;
      this._tabIndex = 0;
    }
    /**
     * 元素在使用 Tab 键切换焦点时的顺序
     */
    get tabIndex() {
      const $this = $(this);
      if (this.focusElement === this) {
        return Number($this.attr("tabindex") || -1);
      }
      const tabIndexAttribute = Number($this.attr("tabindex") || 0);
      if (this.focusDisabled || tabIndexAttribute < 0) {
        return -1;
      }
      if (!this.focusElement) {
        return tabIndexAttribute;
      }
      return this.focusElement.tabIndex;
    }
    set tabIndex(tabIndex) {
      if (this._manipulatingTabindex) {
        this._manipulatingTabindex = false;
        return;
      }
      const $this = $(this);
      if (this.focusElement === this) {
        if (tabIndex !== null) {
          this._tabIndex = tabIndex;
        }
        $this.attr("tabindex", this.focusDisabled ? null : tabIndex);
        return;
      }
      const onPointerDown = () => {
        if (this.tabIndex === -1) {
          this.tabIndex = 0;
          this.focus({ preventScroll: true });
        }
      };
      if (tabIndex === -1) {
        this.addEventListener("pointerdown", onPointerDown);
      } else {
        this._manipulatingTabindex = true;
        this.removeEventListener("pointerdown", onPointerDown);
      }
      if (tabIndex === -1 || this.focusDisabled) {
        $this.attr("tabindex", -1);
        if (tabIndex !== -1) {
          this.manageFocusElementTabindex(tabIndex);
        }
        return;
      }
      if (!this.hasAttribute("tabindex")) {
        this._manipulatingTabindex = false;
      }
      this.manageFocusElementTabindex(tabIndex);
    }
    /**
     * 父类要实现该属性，表示是否禁用 focus 状态
     */
    get focusDisabled() {
      throw new Error("Must implement focusDisabled getter!");
    }
    /**
     * 最终获得焦点的元素
     */
    get focusElement() {
      throw new Error("Must implement focusElement getter!");
    }
    connectedCallback() {
      super.connectedCallback();
      this.updateComplete.then(() => {
        requestAnimationFrame(() => {
          this.manageAutoFocus();
        });
      });
    }
    /**
     * 模拟鼠标点击元素
     */
    click() {
      if (this.focusDisabled) {
        return;
      }
      if (this.focusElement !== this) {
        this.focusElement.click();
      } else {
        HTMLElement.prototype.click.apply(this);
      }
    }
    /**
     * 将焦点设置到当前元素。
     *
     * 可以传入一个对象作为参数，该对象的属性包括：
     *
     * * `preventScroll`：默认情况下，元素获取焦点后，页面会滚动以将该元素滚动到视图中。如果不希望页面滚动，可以将此属性设置为 `true`。
     */
    focus(options) {
      if (this.focusDisabled || !this.focusElement) {
        return;
      }
      if (this.focusElement !== this) {
        this.focusElement.focus(options);
      } else {
        HTMLElement.prototype.focus.apply(this, [options]);
      }
    }
    /**
     * 移除当前元素的焦点
     */
    blur() {
      if (this.focusElement !== this) {
        this.focusElement.blur();
      } else {
        HTMLElement.prototype.blur.apply(this);
      }
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.focusElement.addEventListener("focus", () => {
        this.focused = true;
        this.focusVisible = !isClick;
      });
      this.focusElement.addEventListener("blur", () => {
        this.focused = false;
        this.focusVisible = false;
      });
    }
    update(changedProperties) {
      if (this._lastFocusDisabled === void 0 || this._lastFocusDisabled !== this.focusDisabled) {
        this._lastFocusDisabled = this.focusDisabled;
        const $this = $(this);
        if (this.focusDisabled) {
          $this.removeAttr("tabindex");
        } else {
          if (this.focusElement === this) {
            this._manipulatingTabindex = true;
            $this.attr("tabindex", this._tabIndex);
          } else if (this.tabIndex > -1) {
            $this.removeAttr("tabindex");
          }
        }
      }
      super.update(changedProperties);
    }
    updated(changedProperties) {
      super.updated(changedProperties);
      if (this.focused && this.focusDisabled) {
        this.blur();
      }
    }
    async manageFocusElementTabindex(tabIndex) {
      if (!this.focusElement) {
        await this.updateComplete;
      }
      if (tabIndex === null) {
        this.focusElement.removeAttribute("tabindex");
      } else {
        this.focusElement.tabIndex = tabIndex;
      }
    }
    manageAutoFocus() {
      if (this.autofocus) {
        this.dispatchEvent(new KeyboardEvent("keydown", {
          code: "Tab"
        }));
        this.focusElement.focus();
      }
    }
  }
  __decorate([
    property({
      type: Boolean,
      /**
       * 哪些属性需要 reflect: true？
       * 一般所有属性都需要 reflect，但以下情况除外：
       * 1. 会频繁变更的属性
       * 2. 属性同步会造成较大性能开销的属性
       * 3. 复杂类型属性（数组、对象等，仅提供 property，不提供 attribute）
       */
      reflect: true,
      converter: booleanConverter
    })
  ], FocusableMixinClass.prototype, "autofocus", void 0);
  __decorate([
    property({
      type: Boolean,
      reflect: true,
      converter: booleanConverter
    })
  ], FocusableMixinClass.prototype, "focused", void 0);
  __decorate([
    property({
      type: Boolean,
      reflect: true,
      converter: booleanConverter,
      attribute: "focus-visible"
    })
  ], FocusableMixinClass.prototype, "focusVisible", void 0);
  __decorate([
    property({ type: Number, attribute: "tabindex" })
  ], FocusableMixinClass.prototype, "tabIndex", null);
  return FocusableMixinClass;
};

// node_modules/lit-html/development/directives/class-map.js
var ClassMapDirective = class extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== "class" || partInfo.strings?.length > 2) {
      throw new Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
  }
  render(classInfo) {
    return " " + Object.keys(classInfo).filter((key) => classInfo[key]).join(" ") + " ";
  }
  update(part, [classInfo]) {
    if (this._previousClasses === void 0) {
      this._previousClasses = /* @__PURE__ */ new Set();
      if (part.strings !== void 0) {
        this._staticClasses = new Set(part.strings.join(" ").split(/\s/).filter((s) => s !== ""));
      }
      for (const name in classInfo) {
        if (classInfo[name] && !this._staticClasses?.has(name)) {
          this._previousClasses.add(name);
        }
      }
      return this.render(classInfo);
    }
    const classList = part.element.classList;
    for (const name of this._previousClasses) {
      if (!(name in classInfo)) {
        classList.remove(name);
        this._previousClasses.delete(name);
      }
    }
    for (const name in classInfo) {
      const value = !!classInfo[name];
      if (value !== this._previousClasses.has(name) && !this._staticClasses?.has(name)) {
        if (value) {
          classList.add(name);
          this._previousClasses.add(name);
        } else {
          classList.remove(name);
          this._previousClasses.delete(name);
        }
      }
    }
    return noChange;
  }
};
var classMap = directive(ClassMapDirective);

// node_modules/mdui/components/circular-progress/style.js
var style5 = css`:host{position:relative;display:inline-block;flex-shrink:0;width:2.5rem;height:2.5rem;stroke:rgb(var(--mdui-color-primary))}.progress{position:relative;display:inline-block;width:100%;height:100%;text-align:left;transition:opacity var(--mdui-motion-duration-medium1) var(--mdui-motion-easing-linear)}.determinate svg{transform:rotate(-90deg);fill:transparent}.determinate .track{stroke:transparent}.determinate .circle{stroke:inherit;transition:stroke-dashoffset var(--mdui-motion-duration-long2) var(--mdui-motion-easing-standard)}.indeterminate{font-size:0;letter-spacing:0;white-space:nowrap;animation:mdui-comp-circular-progress-rotate 1568ms var(--mdui-motion-easing-linear) infinite}.indeterminate .circle,.indeterminate .layer{position:absolute;width:100%;height:100%}.indeterminate .layer{animation:mdui-comp-circular-progress-layer-rotate 5332ms var(--mdui-motion-easing-standard) infinite both}.indeterminate .circle{fill:transparent;stroke:inherit}.indeterminate .gap-patch{position:absolute;top:0;left:47.5%;width:5%;height:100%;overflow:hidden}.indeterminate .gap-patch .circle{left:-900%;width:2000%;transform:rotate(180deg)}.indeterminate .clipper{position:relative;display:inline-block;width:50%;height:100%;overflow:hidden}.indeterminate .clipper .circle{width:200%}.indeterminate .clipper.left .circle{animation:mdui-comp-circular-progress-left-spin 1333ms var(--mdui-motion-easing-standard) infinite both}.indeterminate .clipper.right .circle{left:-100%;animation:mdui-comp-circular-progress-right-spin 1333ms var(--mdui-motion-easing-standard) infinite both}@keyframes mdui-comp-circular-progress-rotate{to{transform:rotate(360deg)}}@keyframes mdui-comp-circular-progress-layer-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes mdui-comp-circular-progress-left-spin{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes mdui-comp-circular-progress-right-spin{0%{transform:rotate(-265deg)}50%{transform:rotate(-130deg)}100%{transform:rotate(-265deg)}}`;

// node_modules/mdui/components/circular-progress/index.js
var CircularProgress = class CircularProgress2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.max = 1;
  }
  render() {
    const isDeterminate = !isUndefined(this.value);
    return html`<div class="progress ${classMap({
      determinate: isDeterminate,
      indeterminate: !isDeterminate
    })}">${isDeterminate ? this.renderDeterminate() : this.renderInDeterminate()}</div>`;
  }
  renderDeterminate() {
    const value = this.value;
    const strokeWidth = 4;
    const circleRadius = 18;
    const π = 3.1415926;
    const center = circleRadius + strokeWidth / 2;
    const circumference = 2 * π * circleRadius;
    const determinateStrokeDashOffset = (1 - value / Math.max(this.max ?? value, value)) * circumference;
    return html`<svg viewBox="0 0 ${center * 2} ${center * 2}"><circle class="track" cx="${center}" cy="${center}" r="${circleRadius}" stroke-width="${strokeWidth}"></circle><circle class="circle" cx="${center}" cy="${center}" r="${circleRadius}" stroke-dasharray="${2 * π * circleRadius}" stroke-dashoffset="${determinateStrokeDashOffset}" stroke-width="${strokeWidth}"></circle></svg>`;
  }
  renderInDeterminate() {
    const strokeWidth = 4;
    const circleRadius = 18;
    const π = 3.1415926;
    const center = circleRadius + strokeWidth / 2;
    const circumference = 2 * π * circleRadius;
    const halfCircumference = 0.5 * circumference;
    const circle = (thisStrokeWidth) => html`<svg class="circle" viewBox="0 0 ${center * 2} ${center * 2}"><circle cx="${center}" cy="${center}" r="${circleRadius}" stroke-dasharray="${circumference}" stroke-dashoffset="${halfCircumference}" stroke-width="${thisStrokeWidth}"></circle></svg>`;
    return html`<div class="layer"><div class="clipper left">${circle(strokeWidth)}</div><div class="gap-patch">${circle(strokeWidth * 0.8)}</div><div class="clipper right">${circle(strokeWidth)}</div></div>`;
  }
};
CircularProgress.styles = [componentStyle, style5];
__decorate([
  property({ type: Number, reflect: true })
], CircularProgress.prototype, "max", void 0);
__decorate([
  property({ type: Number })
], CircularProgress.prototype, "value", void 0);
CircularProgress = __decorate([
  customElement("mdui-circular-progress")
], CircularProgress);

// node_modules/mdui/components/ripple/style.js
var style6 = css`:host{position:absolute;top:0;left:0;display:block;width:100%;height:100%;overflow:hidden;pointer-events:none}.surface{position:absolute;top:0;left:0;width:100%;height:100%;transition-duration:280ms;transition-property:background-color;pointer-events:none;transition-timing-function:var(--mdui-motion-easing-standard)}.hover{background-color:rgba(var(--mdui-comp-ripple-state-layer-color,var(--mdui-color-on-surface)),var(--mdui-state-layer-hover))}:host-context([focus-visible]) .focused{background-color:rgba(var(--mdui-comp-ripple-state-layer-color,var(--mdui-color-on-surface)),var(--mdui-state-layer-focus))}.dragged{background-color:rgba(var(--mdui-comp-ripple-state-layer-color,var(--mdui-color-on-surface)),var(--mdui-state-layer-dragged))}.wave{position:absolute;z-index:1;background-color:rgb(var(--mdui-comp-ripple-state-layer-color,var(--mdui-color-on-surface)));border-radius:50%;transform:translate3d(0,0,0) scale(.4);opacity:0;animation:225ms ease 0s 1 normal forwards running mdui-comp-ripple-radius-in,75ms ease 0s 1 normal forwards running mdui-comp-ripple-opacity-in;pointer-events:none}.out{transform:translate3d(var(--mdui-comp-ripple-transition-x,0),var(--mdui-comp-ripple-transition-y,0),0) scale(1);animation:150ms ease 0s 1 normal none running mdui-comp-ripple-opacity-out}@keyframes mdui-comp-ripple-radius-in{from{transform:translate3d(0,0,0) scale(.4);animation-timing-function:var(--mdui-motion-easing-standard)}to{transform:translate3d(var(--mdui-comp-ripple-transition-x,0),var(--mdui-comp-ripple-transition-y,0),0) scale(1)}}@keyframes mdui-comp-ripple-opacity-in{from{opacity:0;animation-timing-function:linear}to{opacity:var(--mdui-state-layer-pressed)}}@keyframes mdui-comp-ripple-opacity-out{from{animation-timing-function:linear;opacity:var(--mdui-state-layer-pressed)}to{opacity:0}}`;

// node_modules/mdui/components/ripple/index.js
var Ripple = class Ripple2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.noRipple = false;
    this.hover = false;
    this.focused = false;
    this.dragged = false;
    this.surfaceRef = createRef();
  }
  startPress(event) {
    if (this.noRipple) {
      return;
    }
    const $surface = $(this.surfaceRef.value);
    const surfaceHeight = $surface.innerHeight();
    const surfaceWidth = $surface.innerWidth();
    let touchStartX;
    let touchStartY;
    if (!event) {
      touchStartX = surfaceWidth / 2;
      touchStartY = surfaceHeight / 2;
    } else {
      const touchPosition = typeof TouchEvent !== "undefined" && event instanceof TouchEvent && event.touches.length ? event.touches[0] : event;
      const offset = $surface.offset();
      if (touchPosition.pageX < offset.left || touchPosition.pageX > offset.left + surfaceWidth || touchPosition.pageY < offset.top || touchPosition.pageY > offset.top + surfaceHeight) {
        return;
      }
      touchStartX = touchPosition.pageX - offset.left;
      touchStartY = touchPosition.pageY - offset.top;
    }
    const diameter = Math.max(Math.pow(Math.pow(surfaceHeight, 2) + Math.pow(surfaceWidth, 2), 0.5), 48);
    const translateX = `${-touchStartX + surfaceWidth / 2}px`;
    const translateY = `${-touchStartY + surfaceHeight / 2}px`;
    const translate = `translate3d(${translateX}, ${translateY}, 0) scale(1)`;
    $('<div class="wave"></div>').css({
      width: diameter,
      height: diameter,
      marginTop: -diameter / 2,
      marginLeft: -diameter / 2,
      left: touchStartX,
      top: touchStartY
    }).each((_, wave) => {
      wave.style.setProperty("--mdui-comp-ripple-transition-x", translateX);
      wave.style.setProperty("--mdui-comp-ripple-transition-y", translateY);
    }).prependTo(this.surfaceRef.value).each((_, wave) => wave.clientLeft).css("transform", translate).on("animationend", function(e) {
      const event2 = e;
      if (event2.animationName === "mdui-comp-ripple-radius-in") {
        $(this).data("filled", true);
      }
    });
  }
  endPress() {
    const $waves = $(this.surfaceRef.value).children().filter((_, wave) => !$(wave).data("removing")).data("removing", true);
    const hideAndRemove = ($waves2) => {
      $waves2.addClass("out").each((_, wave) => wave.clientLeft).on("animationend", function() {
        $(this).remove();
      });
    };
    $waves.filter((_, wave) => !$(wave).data("filled")).on("animationend", function(e) {
      const event = e;
      if (event.animationName === "mdui-comp-ripple-radius-in") {
        hideAndRemove($(this));
      }
    });
    hideAndRemove($waves.filter((_, wave) => !!$(wave).data("filled")));
  }
  startHover() {
    this.hover = true;
  }
  endHover() {
    this.hover = false;
  }
  startFocus() {
    this.focused = true;
  }
  endFocus() {
    this.focused = false;
  }
  startDrag() {
    this.dragged = true;
  }
  endDrag() {
    this.dragged = false;
  }
  render() {
    return html`<div ${ref(this.surfaceRef)} class="surface ${classMap({
      hover: this.hover,
      focused: this.focused,
      dragged: this.dragged
    })}"></div>`;
  }
};
Ripple.styles = [componentStyle, style6];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "no-ripple"
  })
], Ripple.prototype, "noRipple", void 0);
__decorate([
  state()
], Ripple.prototype, "hover", void 0);
__decorate([
  state()
], Ripple.prototype, "focused", void 0);
__decorate([
  state()
], Ripple.prototype, "dragged", void 0);
Ripple = __decorate([
  customElement("mdui-ripple")
], Ripple);

// node_modules/mdui/components/ripple/ripple-mixin.js
var RippleMixin = (superclass) => {
  class Mixin extends superclass {
    constructor() {
      super(...arguments);
      this.noRipple = false;
      this.rippleIndex = void 0;
      this.getRippleIndex = () => this.rippleIndex;
    }
    /**
     * 子类要添加该属性，指向 <mdui-ripple> 元素
     * 如果一个组件中包含多个 <mdui-ripple> 元素，则这里可以是一个数组或 NodeList
     */
    get rippleElement() {
      throw new Error("Must implement rippleElement getter!");
    }
    /**
     * 子类要实现该属性，表示是否禁用 ripple
     * 如果一个组件中包含多个 <mdui-ripple> 元素，则这里可以是一个数组；也可以是单个值，同时控制多个 <mdui-ripple> 元素
     */
    get rippleDisabled() {
      throw new Error("Must implement rippleDisabled getter!");
    }
    /**
     * 当前 <mdui-ripple> 元素相对于哪个元素存在，即 hover、pressed、dragged 属性要添加到哪个元素上，默认为 :host
     * 如果需要修改该属性，则子类可以实现该属性
     * 如果一个组件中包含多个 <mdui-ripple> 元素，则这里可以是一个数组；也可以是单个值，同时控制多个 <mdui-ripple> 元素
     */
    get rippleTarget() {
      return this;
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      const $rippleTarget = $(this.rippleTarget);
      const setRippleIndex = (event) => {
        if (isArrayLike(this.rippleTarget)) {
          this.rippleIndex = $rippleTarget.index(event.target);
        }
      };
      const rippleTargetArr = isArrayLike(this.rippleTarget) ? this.rippleTarget : [this.rippleTarget];
      rippleTargetArr.forEach((rippleTarget) => {
        rippleTarget.addEventListener("pointerdown", (event) => {
          setRippleIndex(event);
          this.startPress(event);
        });
        rippleTarget.addEventListener("pointerenter", (event) => {
          setRippleIndex(event);
          this.startHover(event);
        });
        rippleTarget.addEventListener("pointerleave", (event) => {
          setRippleIndex(event);
          this.endHover(event);
        });
        rippleTarget.addEventListener("focus", (event) => {
          setRippleIndex(event);
          this.startFocus();
        });
        rippleTarget.addEventListener("blur", (event) => {
          setRippleIndex(event);
          this.endFocus();
        });
      });
    }
    /**
     * 若存在多个 <mdui-ripple>，但 rippleTarget 为同一个，则 hover 状态无法在多个 <mdui-ripple> 之间切换
     * 所以把 startHover 和 endHover 设置为 protected，供子类调用
     * 子类中，在 getRippleIndex() 的返回值变更前调用 endHover(event)，变更后调用 startHover(event)
     */
    startHover(event) {
      if (event.pointerType !== "mouse" || this.isRippleDisabled()) {
        return;
      }
      this.getRippleTarget().setAttribute("hover", "");
      this.getRippleElement().startHover();
    }
    endHover(event) {
      if (event.pointerType !== "mouse" || this.isRippleDisabled()) {
        return;
      }
      this.getRippleTarget().removeAttribute("hover");
      this.getRippleElement().endHover();
    }
    /**
     * 当前激活的 <mdui-ripple> 元素是否被禁用
     */
    isRippleDisabled() {
      const disabled = this.rippleDisabled;
      if (!Array.isArray(disabled)) {
        return disabled;
      }
      const rippleIndex = this.getRippleIndex();
      if (rippleIndex !== void 0) {
        return disabled[rippleIndex];
      }
      return disabled.length ? disabled[0] : false;
    }
    /**
     * 获取当前激活的 <mdui-ripple> 元素实例
     */
    getRippleElement() {
      const ripple = this.rippleElement;
      if (!isArrayLike(ripple)) {
        return ripple;
      }
      const rippleIndex = this.getRippleIndex();
      if (rippleIndex !== void 0) {
        return ripple[rippleIndex];
      }
      return ripple[0];
    }
    /**
     * 获取当前激活的 <mdui-ripple> 元素相对于哪个元素存在
     */
    getRippleTarget() {
      const target = this.rippleTarget;
      if (!isArrayLike(target)) {
        return target;
      }
      const rippleIndex = this.getRippleIndex();
      if (rippleIndex !== void 0) {
        return target[rippleIndex];
      }
      return target[0];
    }
    startFocus() {
      if (this.isRippleDisabled()) {
        return;
      }
      this.getRippleElement().startFocus();
    }
    endFocus() {
      if (this.isRippleDisabled()) {
        return;
      }
      this.getRippleElement().endFocus();
    }
    startPress(event) {
      if (this.isRippleDisabled() || event.button) {
        return;
      }
      const target = this.getRippleTarget();
      target.setAttribute("pressed", "");
      if (["touch", "pen"].includes(event.pointerType)) {
        let hidden = false;
        let timer = setTimeout(() => {
          timer = 0;
          this.getRippleElement().startPress(event);
        }, 70);
        const hideRipple = () => {
          if (timer) {
            clearTimeout(timer);
            timer = 0;
            this.getRippleElement().startPress(event);
          }
          if (!hidden) {
            hidden = true;
            this.endPress();
          }
          target.removeEventListener("pointerup", hideRipple);
          target.removeEventListener("pointercancel", hideRipple);
        };
        const touchMove = () => {
          if (timer) {
            clearTimeout(timer);
            timer = 0;
          }
          target.removeEventListener("touchmove", touchMove);
        };
        target.addEventListener("touchmove", touchMove);
        target.addEventListener("pointerup", hideRipple);
        target.addEventListener("pointercancel", hideRipple);
      }
      if (event.pointerType === "mouse" && event.button === 0) {
        const hideRipple = () => {
          this.endPress();
          target.removeEventListener("pointerup", hideRipple);
          target.removeEventListener("pointercancel", hideRipple);
          target.removeEventListener("pointerleave", hideRipple);
        };
        this.getRippleElement().startPress(event);
        target.addEventListener("pointerup", hideRipple);
        target.addEventListener("pointercancel", hideRipple);
        target.addEventListener("pointerleave", hideRipple);
      }
    }
    endPress() {
      if (this.isRippleDisabled()) {
        return;
      }
      this.getRippleTarget().removeAttribute("pressed");
      this.getRippleElement().endPress();
    }
    startDrag() {
      if (this.isRippleDisabled()) {
        return;
      }
      this.getRippleElement().startDrag();
    }
    endDrag() {
      if (this.isRippleDisabled()) {
        return;
      }
      this.getRippleElement().endDrag();
    }
  }
  __decorate([
    property({
      type: Boolean,
      reflect: true,
      converter: booleanConverter,
      attribute: "no-ripple"
    })
  ], Mixin.prototype, "noRipple", void 0);
  return Mixin;
};

// node_modules/mdui/components/button/button-base-style.js
var buttonBaseStyle = css`.button{position:relative;display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;overflow:hidden;color:inherit;font-size:inherit;font-family:inherit;font-weight:inherit;letter-spacing:inherit;white-space:nowrap;text-align:center;text-decoration:none;vertical-align:middle;background:0 0;border:none;outline:0;cursor:inherit;-webkit-user-select:none;user-select:none;touch-action:manipulation;zoom:1;-webkit-user-drag:none}`;

// node_modules/mdui/components/button/button-base.js
var ButtonBase = class extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.loading = false;
    this.name = "";
    this.value = "";
    this.type = "button";
    this.formNoValidate = false;
    this.formController = new FormController(this);
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    if (this.isButton()) {
      return this.focusElement.validity;
    }
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    if (this.isButton()) {
      return this.focusElement.validationMessage;
    }
  }
  get rippleDisabled() {
    return this.disabled || this.loading;
  }
  get focusElement() {
    return this.isButton() ? this.renderRoot?.querySelector("._button") : !this.focusDisabled ? this.renderRoot?.querySelector("._a") : this;
  }
  get focusDisabled() {
    return this.disabled || this.loading;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    if (this.isButton()) {
      const valid = this.focusElement.checkValidity();
      if (!valid) {
        this.emit("invalid", {
          bubbles: false,
          cancelable: true,
          composed: false
        });
      }
      return valid;
    }
    return true;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    if (this.isButton()) {
      const invalid = !this.focusElement.reportValidity();
      if (invalid) {
        this.emit("invalid", {
          bubbles: false,
          cancelable: true,
          composed: false
        });
      }
      return !invalid;
    }
    return true;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    if (this.isButton()) {
      this.focusElement.setCustomValidity(message);
    }
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.addEventListener("click", () => {
      if (this.type === "submit") {
        this.formController.submit(this);
      }
      if (this.type === "reset") {
        this.formController.reset(this);
      }
    });
  }
  renderLoading() {
    return this.loading ? html`<mdui-circular-progress part="loading"></mdui-circular-progress>` : nothingTemplate;
  }
  renderButton({ id: id2, className: className2, part, content = html`<slot></slot>` }) {
    return html`<button id="${ifDefined(id2)}" class="${cc(["_button", className2])}" part="${ifDefined(part)}" ?disabled="${this.rippleDisabled || this.focusDisabled}">${content}</button>`;
  }
  isButton() {
    return !this.href;
  }
};
ButtonBase.styles = [
  componentStyle,
  buttonBaseStyle
];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ButtonBase.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ButtonBase.prototype, "loading", void 0);
__decorate([
  property({ reflect: true })
], ButtonBase.prototype, "name", void 0);
__decorate([
  property({ reflect: true })
], ButtonBase.prototype, "value", void 0);
__decorate([
  property({ reflect: true })
], ButtonBase.prototype, "type", void 0);
__decorate([
  property({ reflect: true })
], ButtonBase.prototype, "form", void 0);
__decorate([
  property({ reflect: true, attribute: "formaction" })
], ButtonBase.prototype, "formAction", void 0);
__decorate([
  property({ reflect: true, attribute: "formenctype" })
], ButtonBase.prototype, "formEnctype", void 0);
__decorate([
  property({ reflect: true, attribute: "formmethod" })
], ButtonBase.prototype, "formMethod", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "formnovalidate"
  })
], ButtonBase.prototype, "formNoValidate", void 0);
__decorate([
  property({ reflect: true, attribute: "formtarget" })
], ButtonBase.prototype, "formTarget", void 0);

// node_modules/mdui/components/button/style.js
var style7 = css`:host{--shape-corner:var(--mdui-shape-corner-full);position:relative;display:inline-block;flex-shrink:0;overflow:hidden;text-align:center;border-radius:var(--shape-corner);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:box-shadow var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear);min-width:3rem;height:2.5rem;color:rgb(var(--mdui-color-primary));font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking);line-height:var(--mdui-typescale-label-large-line-height)}.button{width:100%;padding:0 1rem}:host([full-width]:not([full-width=false i])){display:block}:host([variant=elevated]){box-shadow:var(--mdui-elevation-level1);background-color:rgb(var(--mdui-color-surface-container-low));--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([variant=filled]){color:rgb(var(--mdui-color-on-primary));background-color:rgb(var(--mdui-color-primary));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-primary)}:host([variant=tonal]){color:rgb(var(--mdui-color-on-secondary-container));background-color:rgb(var(--mdui-color-secondary-container));--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-secondary-container
    )}:host([variant=outlined]){border:.0625rem solid rgb(var(--mdui-color-outline));--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([variant=text]){--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([variant=outlined][focus-visible]){border-color:rgb(var(--mdui-color-primary))}:host([variant=elevated][hover]){box-shadow:var(--mdui-elevation-level2)}:host([variant=filled][hover]),:host([variant=tonal][hover]){box-shadow:var(--mdui-elevation-level1)}:host([disabled]:not([disabled=false i])),:host([loading]:not([loading=false i])){cursor:default;pointer-events:none}:host([disabled]:not([disabled=false i])){color:rgba(var(--mdui-color-on-surface),38%);box-shadow:var(--mdui-elevation-level0)}:host([variant=elevated][disabled]:not([disabled=false i])),:host([variant=filled][disabled]:not([disabled=false i])),:host([variant=tonal][disabled]:not([disabled=false i])){background-color:rgba(var(--mdui-color-on-surface),12%)}:host([variant=outlined][disabled]:not([disabled=false i])){border-color:rgba(var(--mdui-color-on-surface),12%)}.label{display:inline-flex;padding-right:.5rem;padding-left:.5rem}.end-icon,.icon{display:inline-flex;font-size:1.28571429em}.end-icon mdui-icon,.icon mdui-icon,::slotted([slot=end-icon]),::slotted([slot=icon]){font-size:inherit}mdui-circular-progress{display:inline-flex;width:1.125rem;height:1.125rem}:host([variant=filled]) mdui-circular-progress{stroke:rgb(var(--mdui-color-on-primary))}:host([variant=tonal]) mdui-circular-progress{stroke:rgb(var(--mdui-color-on-secondary-container))}:host([disabled]:not([disabled=false i])) mdui-circular-progress{stroke:rgba(var(--mdui-color-on-surface),38%)}`;

// node_modules/mdui/components/button/index.js
var Button = class Button2 extends ButtonBase {
  constructor() {
    super(...arguments);
    this.variant = "filled";
    this.fullWidth = false;
    this.rippleRef = createRef();
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  render() {
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton() ? this.renderButton({
      className: "button",
      part: "button",
      content: this.renderInner()
    }) : this.disabled || this.loading ? html`<span part="button" class="button _a">${this.renderInner()}</span>` : this.renderAnchor({
      className: "button",
      part: "button",
      content: this.renderInner()
    })}`;
  }
  renderIcon() {
    if (this.loading) {
      return this.renderLoading();
    }
    return html`<slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderLabel() {
    return html`<slot part="label" class="label"></slot>`;
  }
  renderEndIcon() {
    return html`<slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon ? html`<mdui-icon name="${this.endIcon}"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderInner() {
    return [this.renderIcon(), this.renderLabel(), this.renderEndIcon()];
  }
};
Button.styles = [ButtonBase.styles, style7];
__decorate([
  property({ reflect: true })
], Button.prototype, "variant", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "full-width"
  })
], Button.prototype, "fullWidth", void 0);
__decorate([
  property({ reflect: true })
], Button.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-icon" })
], Button.prototype, "endIcon", void 0);
Button = __decorate([
  customElement("mdui-button")
], Button);

// node_modules/mdui/components/button-icon/style.js
var style8 = css`:host{--shape-corner:var(--mdui-shape-corner-full);position:relative;display:inline-block;flex-shrink:0;overflow:hidden;text-align:center;border-radius:var(--shape-corner);cursor:pointer;-webkit-tap-highlight-color:transparent;font-size:1.5rem;width:2.5rem;height:2.5rem}:host([variant=standard]){color:rgb(var(--mdui-color-on-surface-variant));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface-variant)}:host([variant=filled]){color:rgb(var(--mdui-color-primary));background-color:rgb(var(--mdui-color-surface-container-highest));--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([variant=tonal]){color:rgb(var(--mdui-color-on-surface-variant));background-color:rgb(var(--mdui-color-surface-container-highest));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface-variant)}:host([variant=outlined]){border:.0625rem solid rgb(var(--mdui-color-outline));color:rgb(var(--mdui-color-on-surface-variant));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface-variant)}:host([variant=outlined][pressed]){color:rgb(var(--mdui-color-on-surface));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([variant=standard][selected]:not([selected=false i])){color:rgb(var(--mdui-color-primary));--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([variant=filled]:not([selectable])),:host([variant=filled][selectable=false i]),:host([variant=filled][selected]:not([selected=false i])){color:rgb(var(--mdui-color-on-primary));background-color:rgb(var(--mdui-color-primary));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-primary)}:host([variant=tonal]:not([selectable])),:host([variant=tonal][selectable=false i]),:host([variant=tonal][selected]:not([selected=false i])){color:rgb(var(--mdui-color-on-secondary-container));background-color:rgb(var(--mdui-color-secondary-container));--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-secondary-container
    )}:host([variant=outlined][selected]:not([selected=false i])){border:none;color:rgb(var(--mdui-color-inverse-on-surface));background-color:rgb(var(--mdui-color-inverse-surface));--mdui-comp-ripple-state-layer-color:var(--mdui-color-inverse-on-surface)}:host([variant=filled][disabled]:not([disabled=false i])),:host([variant=outlined][disabled]:not([disabled=false i])),:host([variant=tonal][disabled]:not([disabled=false i])){background-color:rgba(var(--mdui-color-on-surface),.12);border-color:rgba(var(--mdui-color-on-surface),.12)}:host([disabled]:not([disabled=false i])),:host([loading]:not([loading=false i])){cursor:default;pointer-events:none}:host([disabled]:not([disabled=false i])){color:rgba(var(--mdui-color-on-surface),.38)!important}.button{float:left;width:100%}:host([loading]:not([loading=false i])) .button,:host([loading]:not([loading=false i])) mdui-ripple{opacity:0}.icon,.selected-icon mdui-icon,::slotted(*){font-size:inherit}mdui-circular-progress{display:flex;position:absolute;top:calc(50% - 1.5rem / 2);left:calc(50% - 1.5rem / 2);width:1.5rem;height:1.5rem}:host([variant=filled]:not([disabled])) mdui-circular-progress,:host([variant=filled][disabled=false i]) mdui-circular-progress{stroke:rgb(var(--mdui-color-on-primary))}:host([disabled]:not([disabled=false i])) mdui-circular-progress{stroke:rgba(var(--mdui-color-on-surface),38%)}`;

// node_modules/mdui/components/button-icon/index.js
var ButtonIcon = class ButtonIcon2 extends ButtonBase {
  constructor() {
    super(...arguments);
    this.variant = "standard";
    this.selectable = false;
    this.selected = false;
    this.rippleRef = createRef();
    this.hasSlotController = new HasSlotController(this, "[default]", "selected-icon");
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  onSelectedChange() {
    this.emit("change");
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.addEventListener("click", () => {
      if (!this.selectable || this.disabled) {
        return;
      }
      this.selected = !this.selected;
    });
  }
  render() {
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton() ? this.renderButton({
      className: "button",
      part: "button",
      content: this.renderIcon()
    }) : this.disabled || this.loading ? html`<span part="button" class="button _a">${this.renderIcon()}</span>` : this.renderAnchor({
      className: "button",
      part: "button",
      content: this.renderIcon()
    })} ${this.renderLoading()}`;
  }
  renderIcon() {
    const icon = () => this.hasSlotController.test("[default]") ? html`<slot></slot>` : this.icon ? html`<mdui-icon part="icon" class="icon" name="${this.icon}"></mdui-icon>` : nothingTemplate;
    const selectedIcon = () => this.hasSlotController.test("selected-icon") || this.selectedIcon ? html`<slot name="selected-icon" part="selected-icon" class="selected-icon"><mdui-icon name="${this.selectedIcon}"></mdui-icon></slot>` : icon();
    return this.selected ? selectedIcon() : icon();
  }
};
ButtonIcon.styles = [ButtonBase.styles, style8];
__decorate([
  property({ reflect: true })
], ButtonIcon.prototype, "variant", void 0);
__decorate([
  property({ reflect: true })
], ButtonIcon.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "selected-icon" })
], ButtonIcon.prototype, "selectedIcon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ButtonIcon.prototype, "selectable", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ButtonIcon.prototype, "selected", void 0);
__decorate([
  watch("selected", true)
], ButtonIcon.prototype, "onSelectedChange", null);
ButtonIcon = __decorate([
  customElement("mdui-button-icon")
], ButtonIcon);

// node_modules/mdui/components/card/style.js
var style9 = css`:host{--shape-corner:var(--mdui-shape-corner-medium);position:relative;display:inline-block;overflow:hidden;border-radius:var(--shape-corner);-webkit-tap-highlight-color:transparent;transition:box-shadow var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear);--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([clickable]:not([clickable=false i])){cursor:pointer}:host([variant=elevated]){background-color:rgb(var(--mdui-color-surface-container-low));box-shadow:var(--mdui-elevation-level1)}:host([variant=filled]){background-color:rgb(var(--mdui-color-surface-container-highest))}:host([variant=outlined]){background-color:rgb(var(--mdui-color-surface));border:.0625rem solid rgb(var(--mdui-color-outline))}:host([variant=elevated][hover]){box-shadow:var(--mdui-elevation-level2)}:host([variant=filled][hover]),:host([variant=outlined][hover]){box-shadow:var(--mdui-elevation-level1)}:host([variant=elevated][dragged]),:host([variant=filled][dragged]),:host([variant=outlined][dragged]){box-shadow:var(--mdui-elevation-level3)}:host([disabled]:not([disabled=false i])){opacity:.38;cursor:default;-webkit-user-select:none;user-select:none}:host([variant=elevated][disabled]:not([disabled=false i])){background-color:rgb(var(--mdui-color-surface-variant));box-shadow:var(--mdui-elevation-level0)}:host([variant=filled][disabled]:not([disabled=false i])){background-color:rgb(var(--mdui-color-surface));box-shadow:var(--mdui-elevation-level1)}:host([variant=outlined][disabled]:not([disabled=false i])){box-shadow:var(--mdui-elevation-level0);border-color:rgba(var(--mdui-color-outline),.32)}.link{position:relative;display:inline-block;width:100%;height:100%;color:inherit;font-size:inherit;letter-spacing:inherit;text-decoration:none;touch-action:manipulation;-webkit-user-drag:none}`;

// node_modules/mdui/components/card/index.js
var Card = class Card2 extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
  constructor() {
    super(...arguments);
    this.variant = "elevated";
    this.clickable = false;
    this.disabled = false;
    this.rippleRef = createRef();
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.disabled || !this.href && !this.clickable;
  }
  get focusElement() {
    return this.href && !this.disabled ? this.renderRoot.querySelector("._a") : this;
  }
  get focusDisabled() {
    return this.rippleDisabled;
  }
  render() {
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.href && !this.disabled ? this.renderAnchor({
      className: "link",
      content: html`<slot></slot>`
    }) : html`<slot></slot>`}`;
  }
};
Card.styles = [componentStyle, style9];
__decorate([
  property({ reflect: true })
], Card.prototype, "variant", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Card.prototype, "clickable", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Card.prototype, "disabled", void 0);
Card = __decorate([
  customElement("mdui-card")
], Card);

// node_modules/lit-html/development/directives/live.js
var LiveDirective = class extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (!(partInfo.type === PartType.PROPERTY || partInfo.type === PartType.ATTRIBUTE || partInfo.type === PartType.BOOLEAN_ATTRIBUTE)) {
      throw new Error("The `live` directive is not allowed on child or event bindings");
    }
    if (!isSingleExpression(partInfo)) {
      throw new Error("`live` bindings can only contain a single expression");
    }
  }
  render(value) {
    return value;
  }
  update(part, [value]) {
    if (value === noChange || value === nothing) {
      return value;
    }
    const element = part.element;
    const name = part.name;
    if (part.type === PartType.PROPERTY) {
      if (value === element[name]) {
        return noChange;
      }
    } else if (part.type === PartType.BOOLEAN_ATTRIBUTE) {
      if (!!value === element.hasAttribute(name)) {
        return noChange;
      }
    } else if (part.type === PartType.ATTRIBUTE) {
      if (element.getAttribute(name) === String(value)) {
        return noChange;
      }
    }
    setCommittedValue(part);
    return value;
  }
};
var live = directive(LiveDirective);

// node_modules/@mdui/shared/decorators/default-value.js
function defaultValue(propertyName = "value") {
  return (proto, key) => {
    const constructor = proto.constructor;
    const attributeChangedCallback = constructor.prototype.attributeChangedCallback;
    constructor.prototype.attributeChangedCallback = function(name, old, value) {
      const options = constructor.getPropertyOptions(propertyName);
      const attributeName = isString(options.attribute) ? options.attribute : propertyName;
      if (name === attributeName) {
        const converter = options.converter || defaultConverter;
        const fromAttribute = isFunction(converter) ? converter : converter?.fromAttribute ?? defaultConverter.fromAttribute;
        const newValue = fromAttribute(value, options.type);
        if (this[propertyName] !== newValue) {
          this[key] = newValue;
        }
      }
      attributeChangedCallback.call(this, name, old, value);
    };
  };
}

// node_modules/@mdui/shared/icons/shared/style.js
var style10 = css`:host{display:inline-block;width:1em;height:1em;line-height:1;font-size:1.5rem}`;

// node_modules/@mdui/shared/icons/shared/svg-tag.js
var svgTag = (svgPaths) => html`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">${unsafeSVG(svgPaths)}</svg>`;

// node_modules/@mdui/shared/icons/check-box-outline-blank.js
var IconCheckBoxOutlineBlank = class IconCheckBoxOutlineBlank2 extends LitElement {
  render() {
    return svgTag('<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>');
  }
};
IconCheckBoxOutlineBlank.styles = style10;
IconCheckBoxOutlineBlank = __decorate([
  customElement("mdui-icon-check-box-outline-blank")
], IconCheckBoxOutlineBlank);

// node_modules/@mdui/shared/icons/check-box.js
var IconCheckBox = class IconCheckBox2 extends LitElement {
  render() {
    return svgTag('<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>');
  }
};
IconCheckBox.styles = style10;
IconCheckBox = __decorate([
  customElement("mdui-icon-check-box")
], IconCheckBox);

// node_modules/@mdui/shared/icons/indeterminate-check-box.js
var IconIndeterminateCheckBox = class IconIndeterminateCheckBox2 extends LitElement {
  render() {
    return svgTag('<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/>');
  }
};
IconIndeterminateCheckBox.styles = style10;
IconIndeterminateCheckBox = __decorate([
  customElement("mdui-icon-indeterminate-check-box")
], IconIndeterminateCheckBox);

// node_modules/mdui/components/checkbox/style.js
var style11 = css`:host{position:relative;display:inline-flex;cursor:pointer;-webkit-tap-highlight-color:transparent;border-radius:.125rem;font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking);line-height:var(--mdui-typescale-label-large-line-height)}label{display:inline-flex;align-items:center;width:100%;cursor:inherit;-webkit-user-select:none;user-select:none;touch-action:manipulation;zoom:1;-webkit-user-drag:none}input{position:absolute;padding:0;opacity:0;pointer-events:none;width:1.125rem;height:1.125rem;margin:0 0 0 .6875rem}.icon{display:flex;position:absolute;opacity:1;transform:scale(1);color:rgb(var(--mdui-color-on-surface));font-size:1.5rem;transition:color var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}.checked-icon,.indeterminate-icon{opacity:0;transform:scale(.5);transition-property:color,opacity,transform;transition-duration:var(--mdui-motion-duration-short4);transition-timing-function:var(--mdui-motion-easing-standard)}.icon .i,::slotted([slot=checked-icon]),::slotted([slot=indeterminate-icon]),::slotted([slot=unchecked-icon]){color:inherit;font-size:inherit}i{position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border-radius:50%;width:2.5rem;height:2.5rem;--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}.label{display:flex;width:100%;padding-top:.625rem;padding-bottom:.625rem;color:rgb(var(--mdui-color-on-surface));transition:color var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}:host([checked]:not([checked=false i])) i{--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([checked]:not([checked=false i])) .icon{color:rgb(var(--mdui-color-primary))}:host([checked]:not([checked=false i])) .indeterminate-icon{opacity:0;transform:scale(.5)}:host([checked]:not([checked=false i])) .checked-icon{opacity:1;transform:scale(1)}:host([indeterminate]:not([indeterminate=false i])) i{--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([indeterminate]:not([indeterminate=false i])) .icon{color:rgb(var(--mdui-color-primary))}:host([indeterminate]:not([indeterminate=false i])) .checked-icon{opacity:0;transform:scale(.5)}:host([indeterminate]:not([indeterminate=false i])) .indeterminate-icon{opacity:1;transform:scale(1)}.invalid i{--mdui-comp-ripple-state-layer-color:var(--mdui-color-error)}.invalid .icon{color:rgb(var(--mdui-color-error))}.invalid .label{color:rgb(var(--mdui-color-error))}:host([disabled]:not([disabled=false i])){cursor:default;pointer-events:none}:host([disabled]:not([disabled=false i])) .icon{color:rgba(var(--mdui-color-on-surface),38%)}:host([disabled]:not([disabled=false i])) .label{color:rgba(var(--mdui-color-on-surface),38%)}:host([disabled][checked]:not([disabled=false i],[checked=false i])) .unchecked-icon,:host([disabled][indeterminate]:not([disabled=false i],[indeterminate=false i])) .unchecked-icon{opacity:0}`;

// node_modules/mdui/components/checkbox/index.js
var Checkbox = class Checkbox2 extends RippleMixin(FocusableMixin(MduiElement)) {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.checked = false;
    this.defaultChecked = false;
    this.indeterminate = false;
    this.required = false;
    this.name = "";
    this.value = "on";
    this.invalid = false;
    this.inputRef = createRef();
    this.rippleRef = createRef();
    this.formController = new FormController(this, {
      value: (control) => control.checked ? control.value : void 0,
      defaultValue: (control) => control.defaultChecked,
      setValue: (control, checked) => control.checked = checked
    });
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    return this.inputRef.value.validity;
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    return this.inputRef.value.validationMessage;
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.disabled;
  }
  get focusElement() {
    return this.inputRef.value;
  }
  get focusDisabled() {
    return this.disabled;
  }
  async onDisabledChange() {
    await this.updateComplete;
    this.invalid = !this.inputRef.value.checkValidity();
  }
  async onCheckedChange() {
    await this.updateComplete;
    const form = this.formController.getForm();
    if (form && formResets.get(form)?.has(this)) {
      this.invalid = false;
      formResets.get(form).delete(this);
    } else {
      this.invalid = !this.inputRef.value.checkValidity();
    }
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    const valid = this.inputRef.value.checkValidity();
    if (!valid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
    }
    return valid;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    this.invalid = !this.inputRef.value.reportValidity();
    if (this.invalid) {
      const eventProceeded = this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      if (!eventProceeded) {
        this.blur();
        this.focus();
      }
    }
    return !this.invalid;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    this.inputRef.value.setCustomValidity(message);
    this.invalid = !this.inputRef.value.checkValidity();
  }
  render() {
    return html`<label class="${classMap({ invalid: this.invalid })}"><input ${ref(this.inputRef)} type="checkbox" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .indeterminate="${live(this.indeterminate)}" .disabled="${this.disabled}" .checked="${live(this.checked)}" .required="${this.required}" @change="${this.onChange}"> <i part="control"><mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple><slot name="unchecked-icon" part="unchecked-icon" class="icon unchecked-icon">${this.uncheckedIcon ? html`<mdui-icon name="${this.uncheckedIcon}" class="i"></mdui-icon>` : html`<mdui-icon-check-box-outline-blank class="i"></mdui-icon-check-box-outline-blank>`}</slot><slot name="checked-icon" part="checked-icon" class="icon checked-icon">${this.checkedIcon ? html`<mdui-icon name="${this.checkedIcon}" class="i"></mdui-icon>` : html`<mdui-icon-check-box class="i"></mdui-icon-check-box>`}</slot><slot name="indeterminate-icon" part="indeterminate-icon" class="icon indeterminate-icon">${this.indeterminateIcon ? html`<mdui-icon name="${this.indeterminateIcon}" class="i"></mdui-icon>` : html`<mdui-icon-indeterminate-check-box class="i"></mdui-icon-indeterminate-check-box>`}</slot></i><slot part="label" class="label"></slot></label>`;
  }
  /**
   * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
   */
  onChange() {
    this.checked = this.inputRef.value.checked;
    this.indeterminate = false;
    this.emit("change");
  }
};
Checkbox.styles = [componentStyle, style11];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Checkbox.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Checkbox.prototype, "checked", void 0);
__decorate([
  defaultValue("checked")
], Checkbox.prototype, "defaultChecked", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Checkbox.prototype, "indeterminate", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Checkbox.prototype, "required", void 0);
__decorate([
  property({ reflect: true })
], Checkbox.prototype, "form", void 0);
__decorate([
  property({ reflect: true })
], Checkbox.prototype, "name", void 0);
__decorate([
  property({ reflect: true })
], Checkbox.prototype, "value", void 0);
__decorate([
  property({ reflect: true, attribute: "unchecked-icon" })
], Checkbox.prototype, "uncheckedIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "checked-icon" })
], Checkbox.prototype, "checkedIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "indeterminate-icon" })
], Checkbox.prototype, "indeterminateIcon", void 0);
__decorate([
  state()
], Checkbox.prototype, "invalid", void 0);
__decorate([
  watch("disabled", true),
  watch("indeterminate", true),
  watch("required", true)
], Checkbox.prototype, "onDisabledChange", null);
__decorate([
  watch("checked", true)
], Checkbox.prototype, "onCheckedChange", null);
Checkbox = __decorate([
  customElement("mdui-checkbox")
], Checkbox);

// node_modules/@mdui/shared/icons/check.js
var IconCheck = class IconCheck2 extends LitElement {
  render() {
    return svgTag('<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>');
  }
};
IconCheck.styles = style10;
IconCheck = __decorate([
  customElement("mdui-icon-check")
], IconCheck);

// node_modules/@mdui/shared/icons/clear.js
var IconClear = class IconClear2 extends LitElement {
  render() {
    return svgTag('<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>');
  }
};
IconClear.styles = style10;
IconClear = __decorate([
  customElement("mdui-icon-clear")
], IconClear);

// node_modules/mdui/components/chip/style.js
var style12 = css`:host{--shape-corner:var(--mdui-shape-corner-small);position:relative;display:inline-block;flex-shrink:0;overflow:hidden;border-radius:var(--shape-corner);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:box-shadow var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear);height:2rem;background-color:rgb(var(--mdui-color-surface));border:.0625rem solid rgb(var(--mdui-color-outline));color:rgb(var(--mdui-color-on-surface-variant));font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking);line-height:var(--mdui-typescale-label-large-line-height);--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface-variant)}.button{padding-right:.4375rem;padding-left:.4375rem}:host([variant=input]) .button{padding-right:.1875rem;padding-left:.1875rem}:host([selected]:not([selected=false i])) .button{padding-right:.5rem;padding-left:.5rem}:host([selected][variant=input]:not([selected=false i])) .button{padding-right:.25rem;padding-left:.25rem}:host([elevated]:not([elevated=false i])) .button{padding-right:.5rem;padding-left:.5rem}:host([variant=assist]){color:rgb(var(--mdui-color-on-surface));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([elevated]:not([elevated=false i])){border-width:0;background-color:rgb(var(--mdui-color-surface-container-low));box-shadow:var(--mdui-elevation-level1)}:host([selected]:not([selected=false i])){color:rgb(var(--mdui-color-on-secondary-container));background-color:rgb(var(--mdui-color-secondary-container));border-width:0;--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-secondary-container
    )}:host([disabled]:not([disabled=false i])),:host([loading]:not([loading=false i])){cursor:default;pointer-events:none}:host([disabled]:not([disabled=false i])){border-color:rgba(var(--mdui-color-on-surface),12%);color:rgba(var(--mdui-color-on-surface),38%);box-shadow:var(--mdui-elevation-level0)}:host([disabled][elevated]:not([disabled=false i],[elevated=false i])),:host([disabled][selected]:not([disabled=false i],[selected=false i])){background-color:rgba(var(--mdui-color-on-surface),12%)}:host([selected][hover]:not([selected=false i])){box-shadow:var(--mdui-elevation-level1)}:host([elevated][hover]:not([elevated=false i])){color:rgb(var(--mdui-color-on-secondary-container));box-shadow:var(--mdui-elevation-level2)}:host([variant=filter][hover]),:host([variant=input][hover]),:host([variant=suggestion][hover]){color:rgb(var(--mdui-color-on-surface-variant))}:host([variant=filter][focus-visible]),:host([variant=input][focus-visible]),:host([variant=suggestion][focus-visible]){border-color:rgb(var(--mdui-color-on-surface-variant))}:host([dragged]),:host([dragged][hover]){box-shadow:var(--mdui-elevation-level4)}.button{overflow:visible}.label{display:inline-flex;padding-right:.5rem;padding-left:.5rem}.end-icon,.icon,.selected-icon{display:inline-flex;font-size:1.28571429em;color:rgb(var(--mdui-color-on-surface-variant))}:host([variant=assist]) .end-icon,:host([variant=assist]) .icon,:host([variant=assist]) .selected-icon{color:rgb(var(--mdui-color-primary))}:host([selected]:not([selected=false i])) .end-icon,:host([selected]:not([selected=false i])) .icon,:host([selected]:not([selected=false i])) .selected-icon{color:rgb(var(--mdui-color-on-secondary-container))}:host([disabled]:not([disabled=false i])) .end-icon,:host([disabled]:not([disabled=false i])) .icon,:host([disabled]:not([disabled=false i])) .selected-icon{opacity:.38;color:rgb(var(--mdui-color-on-surface))}.end-icon .i,.icon .i,.selected-icon .i,::slotted([slot=end-icon]),::slotted([slot=icon]),::slotted([slot=selected-icon]){font-size:inherit}:host([variant=input]) .has-icon .icon,:host([variant=input]) .has-icon .selected-icon,:host([variant=input]) .has-icon mdui-circular-progress{margin-left:.25rem}:host([variant=input]) .has-end-icon .end-icon{margin-right:.25rem}mdui-circular-progress{display:inline-flex;width:1.125rem;height:1.125rem}:host([disabled]:not([disabled=false i])) mdui-circular-progress{stroke:rgba(var(--mdui-color-on-surface),38%)}::slotted(mdui-avatar[slot=end-icon]),::slotted(mdui-avatar[slot=icon]),::slotted(mdui-avatar[slot=selected-icon]){width:1.5rem;height:1.5rem}:host([disabled]:not([disabled=false i])) ::slotted(mdui-avatar[slot=end-icon]),:host([disabled]:not([disabled=false i])) ::slotted(mdui-avatar[slot=icon]),:host([disabled]:not([disabled=false i])) ::slotted(mdui-avatar[slot=selected-icon]){opacity:.38}::slotted(mdui-avatar[slot=icon]),::slotted(mdui-avatar[slot=selected-icon]){margin-left:-.25rem;margin-right:-.125rem}::slotted(mdui-avatar[slot=end-icon]){margin-right:-.25rem;margin-left:-.125rem}.delete-icon{display:inline-flex;font-size:1.28571429em;transition:background-color var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear);border-radius:var(--mdui-shape-corner-full);margin-right:-.25rem;margin-left:-.25rem;padding:.25rem;color:rgb(var(--mdui-color-on-surface-variant))}.delete-icon:hover{background-color:rgba(var(--mdui-color-on-surface-variant),12%)}.has-end-icon .delete-icon{margin-left:.25rem}:host([variant=assiat]) .delete-icon{color:rgb(var(--mdui-color-primary))}:host([variant=input]) .delete-icon{margin-right:.0625rem}:host([disabled]:not([disabled=false i])) .delete-icon{color:rgba(var(--mdui-color-on-surface),38%)}.delete-icon .i,::slotted([slot=delete-icon]){font-size:inherit}::slotted(mdui-avatar[slot=delete-icon]){width:1.125rem;height:1.125rem}`;

// node_modules/mdui/components/chip/index.js
var Chip = class Chip2 extends ButtonBase {
  constructor() {
    super();
    this.variant = "assist";
    this.elevated = false;
    this.selectable = false;
    this.selected = false;
    this.deletable = false;
    this.rippleRef = createRef();
    this.hasSlotController = new HasSlotController(this, "icon", "selected-icon", "end-icon");
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  onSelectedChange() {
    this.emit("change");
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKeyDown);
  }
  render() {
    const hasIcon = this.icon || this.hasSlotController.test("icon");
    const hasEndIcon = this.endIcon || this.hasSlotController.test("end-icon");
    const hasSelectedIcon = this.selectedIcon || ["assist", "filter"].includes(this.variant) || hasIcon || this.hasSlotController.test("selected-icon");
    const className2 = cc({
      button: true,
      "has-icon": this.loading || !this.selected && hasIcon || this.selected && hasSelectedIcon,
      "has-end-icon": hasEndIcon
    });
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton() ? this.renderButton({
      className: className2,
      part: "button",
      content: this.renderInner()
    }) : this.disabled || this.loading ? html`<span part="button" class="${className2} _a">${this.renderInner()}</span>` : this.renderAnchor({
      className: className2,
      part: "button",
      content: this.renderInner()
    })}`;
  }
  onClick() {
    if (this.disabled || this.loading) {
      return;
    }
    if (this.selectable) {
      this.selected = !this.selected;
    }
  }
  onKeyDown(event) {
    if (this.disabled || this.loading) {
      return;
    }
    if (this.selectable && event.key === " ") {
      event.preventDefault();
      this.selected = !this.selected;
    }
    if (this.deletable && ["Delete", "Backspace"].includes(event.key)) {
      this.emit("delete");
    }
  }
  /**
   * 点击删除按钮
   */
  onDelete(event) {
    event.stopPropagation();
    this.emit("delete");
  }
  renderIcon() {
    if (this.loading) {
      return this.renderLoading();
    }
    const icon = () => {
      return this.icon ? html`<mdui-icon name="${this.icon}" class="i"></mdui-icon>` : nothingTemplate;
    };
    const selectedIcon = () => {
      if (this.selectedIcon) {
        return html`<mdui-icon name="${this.selectedIcon}" class="i"></mdui-icon>`;
      }
      if (this.variant === "assist" || this.variant === "filter") {
        return html`<mdui-icon-check class="i"></mdui-icon-check>`;
      }
      return icon();
    };
    return !this.selected ? html`<slot name="icon" part="icon" class="icon">${icon()}</slot>` : html`<slot name="selected-icon" part="selected-icon" class="selected-icon">${selectedIcon()}</slot>`;
  }
  renderLabel() {
    return html`<slot part="label" class="label"></slot>`;
  }
  renderEndIcon() {
    return html`<slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon ? html`<mdui-icon name="${this.endIcon}" class="i"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderDeleteIcon() {
    if (!this.deletable) {
      return nothingTemplate;
    }
    return html`<slot name="delete-icon" part="delete-icon" class="delete-icon" @click="${this.onDelete}">${this.deleteIcon ? html`<mdui-icon name="${this.deleteIcon}" class="i"></mdui-icon>` : html`<mdui-icon-clear class="i"></mdui-icon-clear>`}</slot>`;
  }
  renderInner() {
    return [
      this.renderIcon(),
      this.renderLabel(),
      this.renderEndIcon(),
      this.renderDeleteIcon()
    ];
  }
};
Chip.styles = [ButtonBase.styles, style12];
__decorate([
  property({ reflect: true })
], Chip.prototype, "variant", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Chip.prototype, "elevated", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Chip.prototype, "selectable", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Chip.prototype, "selected", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Chip.prototype, "deletable", void 0);
__decorate([
  property({ reflect: true })
], Chip.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "selected-icon" })
], Chip.prototype, "selectedIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-icon" })
], Chip.prototype, "endIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "delete-icon" })
], Chip.prototype, "deleteIcon", void 0);
__decorate([
  watch("selected", true)
], Chip.prototype, "onSelectedChange", null);
Chip = __decorate([
  customElement("mdui-chip")
], Chip);

// node_modules/@mdui/shared/helpers/array.js
var arraysEqualIgnoreOrder = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
};

// node_modules/mdui/components/collapse/collapse-style.js
var collapseStyle = css`:host{display:block}`;

// node_modules/mdui/components/collapse/collapse.js
var Collapse = class Collapse2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.accordion = false;
    this.disabled = false;
    this.activeKeys = [];
    this.isInitial = true;
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-collapse-item"]
    });
  }
  async onActiveKeysChange() {
    await this.definedController.whenDefined();
    const value = this.accordion ? this.items.find((item) => this.activeKeys.includes(item.key))?.value : this.items.filter((item) => this.activeKeys.includes(item.key)).map((item) => item.value);
    this.setValue(value);
    if (!this.isInitial) {
      this.emit("change");
    }
  }
  async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();
    if (this.accordion) {
      const value = this.value;
      if (!value) {
        this.setActiveKeys([]);
      } else {
        const item = this.items.find((item2) => item2.value === value);
        this.setActiveKeys(item ? [item.key] : []);
      }
    } else {
      const value = this.value;
      if (!value.length) {
        this.setActiveKeys([]);
      } else {
        const activeKeys = this.items.filter((item) => value.includes(item.value)).map((item) => item.key);
        this.setActiveKeys(activeKeys);
      }
    }
    this.updateItems();
  }
  render() {
    return html`<slot @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot>`;
  }
  setActiveKeys(activeKeys) {
    if (!arraysEqualIgnoreOrder(this.activeKeys, activeKeys)) {
      this.activeKeys = activeKeys;
    }
  }
  setValue(value) {
    if (this.accordion || isUndefined(this.value) || isUndefined(value)) {
      this.value = value;
    } else if (!arraysEqualIgnoreOrder(this.value, value)) {
      this.value = value;
    }
  }
  onClick(event) {
    if (this.disabled) {
      return;
    }
    if (event.button) {
      return;
    }
    const target = event.target;
    const item = target.closest("mdui-collapse-item");
    if (!item || item.disabled) {
      return;
    }
    const path = event.composedPath();
    if (item.trigger && !path.find((element) => isElement(element) && $(element).is(item.trigger))) {
      return;
    }
    if (!path.find((element) => isElement(element) && element.part.contains("header"))) {
      return;
    }
    if (this.accordion) {
      if (this.activeKeys.includes(item.key)) {
        this.setActiveKeys([]);
      } else {
        this.setActiveKeys([item.key]);
      }
    } else {
      const activeKeys = [...this.activeKeys];
      if (activeKeys.includes(item.key)) {
        activeKeys.splice(activeKeys.indexOf(item.key), 1);
      } else {
        activeKeys.push(item.key);
      }
      this.setActiveKeys(activeKeys);
    }
    this.isInitial = false;
    this.updateItems();
  }
  async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }
  // 更新 <mdui-collapse-item> 的状态
  updateItems() {
    this.items.forEach((item) => {
      item.active = this.activeKeys.includes(item.key);
      item.isInitial = this.isInitial;
    });
  }
};
Collapse.styles = [
  componentStyle,
  collapseStyle
];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Collapse.prototype, "accordion", void 0);
__decorate([
  property()
], Collapse.prototype, "value", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Collapse.prototype, "disabled", void 0);
__decorate([
  state()
], Collapse.prototype, "activeKeys", void 0);
__decorate([
  queryAssignedElements({ selector: "mdui-collapse-item", flatten: true })
], Collapse.prototype, "items", void 0);
__decorate([
  watch("activeKeys", true)
], Collapse.prototype, "onActiveKeysChange", null);
__decorate([
  watch("value")
], Collapse.prototype, "onValueChange", null);
Collapse = __decorate([
  customElement("mdui-collapse")
], Collapse);

// node_modules/mdui/components/collapse/collapse-item-style.js
var collapseItemStyle = css`:host{display:flex;flex-direction:column}.header{display:block}.body{display:block;overflow:hidden;transition:height var(--mdui-motion-duration-short4) var(--mdui-motion-easing-emphasized)}.body.opened{overflow:visible}.body.active{transition-duration:var(--mdui-motion-duration-medium4)}`;

// node_modules/mdui/components/collapse/collapse-item.js
var CollapseItem = class CollapseItem2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.active = false;
    this.state = "closed";
    this.isInitial = true;
    this.key = uniqueId();
    this.bodyRef = createRef();
  }
  onActiveChange() {
    if (this.isInitial) {
      this.state = this.active ? "opened" : "closed";
      if (this.hasUpdated) {
        this.updateBodyHeight();
      }
    } else {
      this.state = this.active ? "open" : "close";
      this.emit(this.state);
      this.updateBodyHeight();
    }
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.updateBodyHeight();
  }
  render() {
    return html`<slot name="header" part="header" class="header">${this.header}</slot><slot part="body" class="body ${classMap({
      opened: this.state === "opened",
      active: this.active
    })}" ${ref(this.bodyRef)} @transitionend="${this.onTransitionEnd}"></slot>`;
  }
  onTransitionEnd(event) {
    if (event.target === this.bodyRef.value) {
      this.state = this.active ? "opened" : "closed";
      this.emit(this.state);
      this.updateBodyHeight();
    }
  }
  updateBodyHeight() {
    const scrollHeight = this.bodyRef.value.scrollHeight;
    if (this.state === "close") {
      $(this.bodyRef.value).height(scrollHeight);
      this.bodyRef.value.clientLeft;
    }
    $(this.bodyRef.value).height(this.state === "opened" ? "auto" : this.state === "open" ? scrollHeight : 0);
  }
};
CollapseItem.styles = [
  componentStyle,
  collapseItemStyle
];
__decorate([
  property({ reflect: true })
], CollapseItem.prototype, "value", void 0);
__decorate([
  property({ reflect: true })
], CollapseItem.prototype, "header", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], CollapseItem.prototype, "disabled", void 0);
__decorate([
  property()
], CollapseItem.prototype, "trigger", void 0);
__decorate([
  state()
], CollapseItem.prototype, "active", void 0);
__decorate([
  state()
], CollapseItem.prototype, "state", void 0);
__decorate([
  watch("active")
], CollapseItem.prototype, "onActiveChange", null);
CollapseItem = __decorate([
  customElement("mdui-collapse-item")
], CollapseItem);

// node_modules/lit-html/development/directives/when.js
function when(condition, trueCase, falseCase) {
  return condition ? trueCase(condition) : falseCase?.(condition);
}

// node_modules/@mdui/shared/helpers/animate.js
function animateTo(el, keyframes, options) {
  if (!el) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    if (options.duration === Infinity) {
      throw new Error("Promise-based animations must be finite.");
    }
    if (isNumber(options.duration) && isNaN(options.duration)) {
      options.duration = 0;
    }
    if (options.easing === "") {
      options.easing = "linear";
    }
    const animation = el.animate(keyframes, options);
    animation.addEventListener("cancel", resolve, { once: true });
    animation.addEventListener("finish", resolve, { once: true });
  });
}
function stopAnimations(el) {
  if (!el) {
    return Promise.resolve();
  }
  return Promise.all(el.getAnimations().map((animation) => {
    return new Promise((resolve) => {
      const handleAnimationEvent = requestAnimationFrame(resolve);
      animation.addEventListener("cancel", () => handleAnimationEvent, {
        once: true
      });
      animation.addEventListener("finish", () => handleAnimationEvent, {
        once: true
      });
      animation.cancel();
    });
  }));
}

// node_modules/@mdui/shared/helpers/tabbable.js
function isTabbable(el) {
  const window2 = getWindow();
  const localName = el.localName;
  if (el.getAttribute("tabindex") === "-1") {
    return false;
  }
  if (el.hasAttribute("disabled")) {
    return false;
  }
  if (el.hasAttribute("aria-disabled") && el.getAttribute("aria-disabled") !== "false") {
    return false;
  }
  if (localName === "input" && el.getAttribute("type") === "radio" && !el.hasAttribute("checked")) {
    return false;
  }
  if (el.offsetParent === null) {
    return false;
  }
  if (window2.getComputedStyle(el).visibility === "hidden") {
    return false;
  }
  if ((localName === "audio" || localName === "video") && el.hasAttribute("controls")) {
    return true;
  }
  if (el.hasAttribute("tabindex")) {
    return true;
  }
  if (el.hasAttribute("contenteditable") && el.getAttribute("contenteditable") !== "false") {
    return true;
  }
  return [
    "button",
    "input",
    "select",
    "textarea",
    "a",
    "audio",
    "video",
    "summary"
  ].includes(localName);
}
function getTabbableBoundary(root) {
  const allElements = [];
  function walk(el) {
    if (el instanceof HTMLElement) {
      allElements.push(el);
      if (el.shadowRoot !== null && el.shadowRoot.mode === "open") {
        walk(el.shadowRoot);
      }
    }
    const children = el.children;
    [...children].forEach((e) => walk(e));
  }
  walk(root);
  const start = allElements.find((el) => isTabbable(el)) ?? null;
  const end = allElements.reverse().find((el) => isTabbable(el)) ?? null;
  return { start, end };
}

// node_modules/@mdui/shared/helpers/modal.js
var activeModals = [];
var Modal = class {
  constructor(element) {
    this.tabDirection = "forward";
    this.element = element;
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  activate() {
    activeModals.push(this.element);
    document.addEventListener("focusin", this.handleFocusIn);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  deactivate() {
    activeModals = activeModals.filter((modal) => modal !== this.element);
    document.removeEventListener("focusin", this.handleFocusIn);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
  isActive() {
    return activeModals[activeModals.length - 1] === this.element;
  }
  checkFocus() {
    if (this.isActive()) {
      if (!this.element.matches(":focus-within")) {
        const { start, end } = getTabbableBoundary(this.element);
        const target = this.tabDirection === "forward" ? start : end;
        if (typeof target?.focus === "function") {
          target.focus({ preventScroll: true });
        }
      }
    }
  }
  handleFocusIn() {
    this.checkFocus();
  }
  handleKeyDown(event) {
    if (event.key === "Tab" && event.shiftKey) {
      this.tabDirection = "backward";
    }
    requestAnimationFrame(() => this.checkFocus());
  }
  handleKeyUp() {
    this.tabDirection = "forward";
  }
};

// node_modules/@mdui/shared/helpers/motion.js
var getEasing = (element, name) => {
  const cssVariableName = `--mdui-motion-easing-${name}`;
  return $(element).css(cssVariableName).trim();
};
var getDuration = (element, name) => {
  const cssVariableName = `--mdui-motion-duration-${name}`;
  const cssValue = $(element).css(cssVariableName).trim().toLowerCase();
  if (cssValue.endsWith("ms")) {
    return parseFloat(cssValue);
  } else {
    return parseFloat(cssValue) * 1e3;
  }
};

// node_modules/@mdui/shared/helpers/scroll.js
var scrollBarSizeCached;
var getScrollBarSize = (fresh) => {
  if (isUndefined(document)) {
    return 0;
  }
  if (fresh || scrollBarSizeCached === void 0) {
    const $inner = $("<div>").css({
      width: "100%",
      height: "200px"
    });
    const $outer = $("<div>").css({
      position: "absolute",
      top: "0",
      left: "0",
      pointerEvents: "none",
      visibility: "hidden",
      width: "200px",
      height: "150px",
      overflow: "hidden"
    }).append($inner).appendTo(document.body);
    const widthContained = $inner[0].offsetWidth;
    $outer.css("overflow", "scroll");
    let widthScroll = $inner[0].offsetWidth;
    if (widthContained === widthScroll) {
      widthScroll = $outer[0].clientWidth;
    }
    $outer.remove();
    scrollBarSizeCached = widthContained - widthScroll;
  }
  return scrollBarSizeCached;
};
var hasScrollbar = (target) => {
  return target.scrollHeight > target.clientHeight;
};
var lockMap = /* @__PURE__ */ new WeakMap();
var className = "mdui-lock-screen";
var lockScreen = (source, target) => {
  const document3 = getDocument();
  target ??= document3.documentElement;
  if (!lockMap.has(target)) {
    lockMap.set(target, /* @__PURE__ */ new Set());
  }
  const lock = lockMap.get(target);
  lock.add(source);
  const $target = $(target);
  if (hasScrollbar(target)) {
    $target.css("width", `calc(100% - ${getScrollBarSize()}px)`);
  }
  $target.addClass(className);
};
var unlockScreen = (source, target) => {
  const document3 = getDocument();
  target ??= document3.documentElement;
  const lock = lockMap.get(target);
  if (!lock) {
    return;
  }
  lock.delete(source);
  if (lock.size === 0) {
    lockMap.delete(target);
    $(target).removeClass(className).width("");
  }
};

// node_modules/@lit/localize/internal/locale-status-event.js
var LOCALE_STATUS_EVENT = "lit-localize-status";

// node_modules/@lit/localize/internal/str-tag.js
var isStrTagged = (val) => typeof val !== "string" && "strTag" in val;
var joinStringsAndValues = (strings, values, valueOrder) => {
  let concat = strings[0];
  for (let i = 1; i < strings.length; i++) {
    concat += values[valueOrder ? valueOrder[i - 1] : i - 1];
    concat += strings[i];
  }
  return concat;
};

// node_modules/@lit/localize/internal/default-msg.js
var defaultMsg = ((template) => isStrTagged(template) ? joinStringsAndValues(template.strings, template.values) : template);

// node_modules/@lit/localize/init/install.js
var msg = defaultMsg;
var installed = false;
function _installMsgImplementation(impl) {
  if (installed) {
    throw new Error("lit-localize can only be configured once");
  }
  msg = impl;
  installed = true;
}

// node_modules/@lit/localize/internal/deferred.js
var Deferred = class {
  constructor() {
    this.settled = false;
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  resolve(value) {
    this.settled = true;
    this._resolve(value);
  }
  reject(error) {
    this.settled = true;
    this._reject(error);
  }
};

// node_modules/@lit/localize/internal/fnv1a64.js
var hl = [];
for (let i = 0; i < 256; i++) {
  hl[i] = (i >> 4 & 15).toString(16) + (i & 15).toString(16);
}
function fnv1a64(str) {
  let t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  for (let i = 0; i < str.length; i++) {
    v0 ^= str.charCodeAt(i);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return hl[v3 >> 8] + hl[v3 & 255] + hl[v2 >> 8] + hl[v2 & 255] + hl[v1 >> 8] + hl[v1 & 255] + hl[v0 >> 8] + hl[v0 & 255];
}

// node_modules/@lit/localize/internal/id-generation.js
var HASH_DELIMITER = "";
var HTML_PREFIX = "h";
var STRING_PREFIX = "s";
function generateMsgId(strings, isHtmlTagged) {
  return (isHtmlTagged ? HTML_PREFIX : STRING_PREFIX) + fnv1a64(typeof strings === "string" ? strings : strings.join(HASH_DELIMITER));
}

// node_modules/@lit/localize/internal/runtime-msg.js
var expressionOrders = /* @__PURE__ */ new WeakMap();
var hashCache = /* @__PURE__ */ new Map();
function runtimeMsg(templates2, template, options) {
  if (templates2) {
    const id2 = options?.id ?? generateId(template);
    const localized = templates2[id2];
    if (localized) {
      if (typeof localized === "string") {
        return localized;
      } else if ("strTag" in localized) {
        return joinStringsAndValues(
          localized.strings,
          // Cast `template` because its type wasn't automatically narrowed (but
          // we know it must be the same type as `localized`).
          template.values,
          localized.values
        );
      } else {
        let order = expressionOrders.get(localized);
        if (order === void 0) {
          order = localized.values;
          expressionOrders.set(localized, order);
        }
        return {
          ...localized,
          values: order.map((i) => template.values[i])
        };
      }
    }
  }
  return defaultMsg(template);
}
function generateId(template) {
  const strings = typeof template === "string" ? template : template.strings;
  let id2 = hashCache.get(strings);
  if (id2 === void 0) {
    id2 = generateMsgId(strings, typeof template !== "string" && !("strTag" in template));
    hashCache.set(strings, id2);
  }
  return id2;
}

// node_modules/@lit/localize/init/runtime.js
function dispatchStatusEvent(detail) {
  window.dispatchEvent(new CustomEvent(LOCALE_STATUS_EVENT, { detail }));
}
var activeLocale = "";
var loadingLocale;
var sourceLocale;
var validLocales;
var loadLocale;
var templates;
var loading = new Deferred();
loading.resolve();
var requestId = 0;
var configureLocalization = (config) => {
  _installMsgImplementation(((template, options) => runtimeMsg(templates, template, options)));
  activeLocale = sourceLocale = config.sourceLocale;
  validLocales = new Set(config.targetLocales);
  validLocales.add(config.sourceLocale);
  loadLocale = config.loadLocale;
  return { getLocale, setLocale };
};
var getLocale = () => {
  return activeLocale;
};
var setLocale = (newLocale) => {
  if (newLocale === (loadingLocale ?? activeLocale)) {
    return loading.promise;
  }
  if (!validLocales || !loadLocale) {
    throw new Error("Internal error");
  }
  if (!validLocales.has(newLocale)) {
    throw new Error("Invalid locale code");
  }
  requestId++;
  const thisRequestId = requestId;
  loadingLocale = newLocale;
  if (loading.settled) {
    loading = new Deferred();
  }
  dispatchStatusEvent({ status: "loading", loadingLocale: newLocale });
  const localePromise = newLocale === sourceLocale ? (
    // We could switch to the source locale synchronously, but we prefer to
    // queue it on a microtask so that switching locales is consistently
    // asynchronous.
    Promise.resolve({ templates: void 0 })
  ) : loadLocale(newLocale);
  localePromise.then((mod) => {
    if (requestId === thisRequestId) {
      activeLocale = newLocale;
      loadingLocale = void 0;
      templates = mod.templates;
      dispatchStatusEvent({ status: "ready", readyLocale: newLocale });
      loading.resolve();
    }
  }, (err) => {
    if (requestId === thisRequestId) {
      dispatchStatusEvent({
        status: "error",
        errorLocale: newLocale,
        errorMessage: err.toString()
      });
      loading.reject(err);
    }
  });
  return loading.promise;
};

// node_modules/mdui/internal/localeCodes.js
var sourceLocale2 = `en-us`;
var targetLocales = [
  `ar-eg`,
  `az-az`,
  `be-by`,
  `bg-bg`,
  `bn-bd`,
  `ca-es`,
  `cs-cz`,
  `da-dk`,
  `de-de`,
  `el-gr`,
  `en-gb`,
  `es-es`,
  `et-ee`,
  `fa-ir`,
  `fi-fi`,
  `fr-be`,
  `fr-ca`,
  `fr-fr`,
  `ga-ie`,
  `gl-es`,
  `he-il`,
  `hi-in`,
  `hr-hr`,
  `hu-hu`,
  `hy-am`,
  `id-id`,
  `is-is`,
  `it-it`,
  `ja-jp`,
  `ka-ge`,
  `kk-kz`,
  `km-kh`,
  `kmr-iq`,
  `kn-in`,
  `ko-kr`,
  `lt-lt`,
  `lv-lv`,
  `mk-mk`,
  `ml-in`,
  `mn-mn`,
  `ms-my`,
  `nb-no`,
  `ne-np`,
  `nl-be`,
  `nl-nl`,
  `pl-pl`,
  `pt-br`,
  `pt-pt`,
  `ro-ro`,
  `ru-ru`,
  `sk-sk`,
  `sl-si`,
  `sr-rs`,
  `sv-se`,
  `ta-in`,
  `th-th`,
  `tr-tr`,
  `uk-ua`,
  `ur-pk`,
  `vi-vn`,
  `zh-cn`,
  `zh-hk`,
  `zh-tw`
];

// node_modules/mdui/internal/localize.js
var uninitializedError = "You must call `loadLocale` first to set up the localized template.";
var getLocale2;
var setLocale2;
var initializeLocalize = (loadFunc) => {
  const window2 = getWindow();
  const result = configureLocalization({
    sourceLocale: sourceLocale2,
    targetLocales,
    loadLocale: loadFunc
  });
  getLocale2 = result.getLocale;
  setLocale2 = result.setLocale;
  window2.addEventListener(LOCALE_STATUS_EVENT, (event) => {
    window2.dispatchEvent(new CustomEvent("mdui-localize-status", {
      detail: event.detail
    }));
  });
};
var listeningLitLocalizeStatus = false;
var localeReadyCallbacksMap = /* @__PURE__ */ new Map();
var onLocaleReady = (target, callback) => {
  if (!listeningLitLocalizeStatus) {
    listeningLitLocalizeStatus = true;
    const window2 = getWindow();
    window2.addEventListener(LOCALE_STATUS_EVENT, (event) => {
      if (event.detail.status === "ready") {
        localeReadyCallbacksMap.forEach((callbacks2) => {
          callbacks2.forEach((cb) => cb());
        });
      }
    });
  }
  const callbacks = localeReadyCallbacksMap.get(target) || [];
  callbacks.push(callback);
  localeReadyCallbacksMap.set(target, callbacks);
};
var offLocaleReady = (target) => {
  localeReadyCallbacksMap.delete(target);
};

// node_modules/mdui/components/dialog/style.js
var style13 = css`:host{--shape-corner:var(--mdui-shape-corner-extra-large);--z-index:2300;position:fixed;z-index:var(--z-index);display:none;align-items:center;justify-content:center;inset:0;padding:3rem}::slotted(mdui-top-app-bar[slot=header]){position:absolute;border-top-left-radius:var(--mdui-shape-corner-extra-large);border-top-right-radius:var(--mdui-shape-corner-extra-large);background-color:rgb(var(--mdui-color-surface-container-high))}:host([fullscreen]:not([fullscreen=false i])){--shape-corner:var(--mdui-shape-corner-none);padding:0}:host([fullscreen]:not([fullscreen=false i])) ::slotted(mdui-top-app-bar[slot=header]){border-top-left-radius:var(--mdui-shape-corner-none);border-top-right-radius:var(--mdui-shape-corner-none)}.overlay{position:fixed;inset:0;background-color:rgba(var(--mdui-color-scrim),.4)}.panel{--mdui-color-background:var(--mdui-color-surface-container-high);position:relative;display:flex;flex-direction:column;max-height:100%;border-radius:var(--shape-corner);outline:0;transform-origin:top;min-width:17.5rem;max-width:35rem;padding:1.5rem;background-color:rgb(var(--mdui-color-surface-container-high));box-shadow:var(--mdui-elevation-level3)}:host([fullscreen]:not([fullscreen=false i])) .panel{width:100%;max-width:100%;height:100%;max-height:100%;box-shadow:var(--mdui-elevation-level0)}.header{display:flex;flex-direction:column}.has-icon .header{align-items:center}.icon{display:flex;color:rgb(var(--mdui-color-secondary));font-size:1.5rem}.icon mdui-icon,::slotted([slot=icon]){font-size:inherit}.headline{display:flex;color:rgb(var(--mdui-color-on-surface));font-size:var(--mdui-typescale-headline-small-size);font-weight:var(--mdui-typescale-headline-small-weight);letter-spacing:var(--mdui-typescale-headline-small-tracking);line-height:var(--mdui-typescale-headline-small-line-height)}.icon+.headline{padding-top:1rem}.body{overflow:auto}.header+.body{margin-top:1rem}.description{display:flex;color:rgb(var(--mdui-color-on-surface-variant));font-size:var(--mdui-typescale-body-medium-size);font-weight:var(--mdui-typescale-body-medium-weight);letter-spacing:var(--mdui-typescale-body-medium-tracking);line-height:var(--mdui-typescale-body-medium-line-height)}:host([fullscreen]:not([fullscreen=false i])) .description{color:rgb(var(--mdui-color-on-surface))}.has-description.has-default .description{margin-bottom:1rem}.action{display:flex;justify-content:flex-end;padding-top:1.5rem}.action::slotted(:not(:first-child)){margin-left:.5rem}:host([stacked-actions]:not([stacked-actions=false i])) .action{flex-direction:column;align-items:end}:host([stacked-actions]:not([stacked-actions=false i])) .action::slotted(:not(:first-child)){margin-left:0;margin-top:.5rem}`;

// node_modules/mdui/components/dialog/index.js
var Dialog = class Dialog2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.open = false;
    this.fullscreen = false;
    this.closeOnEsc = false;
    this.closeOnOverlayClick = false;
    this.stackedActions = false;
    this.overlayRef = createRef();
    this.panelRef = createRef();
    this.bodyRef = createRef();
    this.hasSlotController = new HasSlotController(this, "header", "icon", "headline", "description", "action", "[default]");
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-top-app-bar"]
    });
  }
  async onOpenChange() {
    const hasUpdated = this.hasUpdated;
    if (!this.open && !hasUpdated) {
      return;
    }
    await this.definedController.whenDefined();
    if (!hasUpdated) {
      await this.updateComplete;
    }
    const children = Array.from(this.panelRef.value.querySelectorAll(".header, .body, .actions"));
    const easingLinear = getEasing(this, "linear");
    const easingEmphasizedDecelerate = getEasing(this, "emphasized-decelerate");
    const easingEmphasizedAccelerate = getEasing(this, "emphasized-accelerate");
    const stopAnimation = () => Promise.all([
      stopAnimations(this.overlayRef.value),
      stopAnimations(this.panelRef.value),
      ...children.map((child) => stopAnimations(child))
    ]);
    if (this.open) {
      if (hasUpdated) {
        const eventProceeded = this.emit("open", { cancelable: true });
        if (!eventProceeded) {
          return;
        }
      }
      this.style.display = "flex";
      const topAppBarElements = this.topAppBarElements ?? [];
      if (topAppBarElements.length) {
        const topAppBarElement = topAppBarElements[0];
        if (!topAppBarElement.scrollTarget) {
          topAppBarElement.scrollTarget = this.bodyRef.value;
        }
        this.bodyRef.value.style.marginTop = "0";
      }
      this.originalTrigger = document.activeElement;
      this.modalHelper.activate();
      lockScreen(this);
      await stopAnimation();
      requestAnimationFrame(() => {
        const autoFocusTarget = this.querySelector("[autofocus]");
        if (autoFocusTarget) {
          autoFocusTarget.focus({ preventScroll: true });
        } else {
          this.panelRef.value.focus({ preventScroll: true });
        }
      });
      const duration = getDuration(this, "medium4");
      await Promise.all([
        animateTo(this.overlayRef.value, [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear
        }),
        animateTo(this.panelRef.value, [
          { transform: "translateY(-1.875rem) scaleY(0)" },
          { transform: "translateY(0) scaleY(1)" }
        ], {
          duration: hasUpdated ? duration : 0,
          easing: easingEmphasizedDecelerate
        }),
        animateTo(this.panelRef.value, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1 }], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear
        }),
        ...children.map((child) => animateTo(child, [
          { opacity: 0 },
          { opacity: 0, offset: 0.2 },
          { opacity: 1, offset: 0.8 },
          { opacity: 1 }
        ], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear
        }))
      ]);
      if (hasUpdated) {
        this.emit("opened");
      }
    } else {
      const eventProceeded = this.emit("close", { cancelable: true });
      if (!eventProceeded) {
        return;
      }
      this.modalHelper.deactivate();
      await stopAnimation();
      const duration = getDuration(this, "short4");
      await Promise.all([
        animateTo(this.overlayRef.value, [{ opacity: 1 }, { opacity: 0 }], {
          duration,
          easing: easingLinear
        }),
        animateTo(this.panelRef.value, [
          { transform: "translateY(0) scaleY(1)" },
          { transform: "translateY(-1.875rem) scaleY(0.6)" }
        ], { duration, easing: easingEmphasizedAccelerate }),
        animateTo(this.panelRef.value, [{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration, easing: easingLinear }),
        ...children.map((child) => animateTo(child, [{ opacity: 1 }, { opacity: 0, offset: 0.75 }, { opacity: 0 }], { duration, easing: easingLinear }))
      ]);
      this.style.display = "none";
      unlockScreen(this);
      const trigger = this.originalTrigger;
      if (typeof trigger?.focus === "function") {
        setTimeout(() => trigger.focus());
      }
      this.emit("closed");
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unlockScreen(this);
    offLocaleReady(this);
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.modalHelper = new Modal(this);
    this.addEventListener("keydown", (event) => {
      if (this.open && this.closeOnEsc && event.key === "Escape") {
        event.stopPropagation();
        this.open = false;
      }
    });
  }
  render() {
    const hasActionSlot = this.hasSlotController.test("action");
    const hasDefaultSlot = this.hasSlotController.test("[default]");
    const hasIcon = !!this.icon || this.hasSlotController.test("icon");
    const hasHeadline = !!this.headline || this.hasSlotController.test("headline");
    const hasDescription = !!this.description || this.hasSlotController.test("description");
    const hasHeader = hasIcon || hasHeadline || this.hasSlotController.test("header");
    const hasBody = hasDescription || hasDefaultSlot;
    return html`<div ${ref(this.overlayRef)} part="overlay" class="overlay" @click="${this.onOverlayClick}" tabindex="-1"></div><div ${ref(this.panelRef)} part="panel" class="panel ${classMap({
      "has-icon": hasIcon,
      "has-description": hasDescription,
      "has-default": hasDefaultSlot
    })}" tabindex="0">${when(hasHeader, () => html`<slot name="header" part="header" class="header">${when(hasIcon, () => this.renderIcon())} ${when(hasHeadline, () => this.renderHeadline())}</slot>`)} ${when(hasBody, () => html`<div ${ref(this.bodyRef)} part="body" class="body">${when(hasDescription, () => this.renderDescription())}<slot></slot></div>`)} ${when(hasActionSlot, () => html`<slot name="action" part="action" class="action"></slot>`)}</div>`;
  }
  onOverlayClick() {
    this.emit("overlay-click");
    if (!this.closeOnOverlayClick) {
      return;
    }
    this.open = false;
  }
  renderIcon() {
    return html`<slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderHeadline() {
    return html`<slot name="headline" part="headline" class="headline">${this.headline}</slot>`;
  }
  renderDescription() {
    return html`<slot name="description" part="description" class="description">${this.description}</slot>`;
  }
};
Dialog.styles = [componentStyle, style13];
__decorate([
  property({ reflect: true })
], Dialog.prototype, "icon", void 0);
__decorate([
  property({ reflect: true })
], Dialog.prototype, "headline", void 0);
__decorate([
  property({ reflect: true })
], Dialog.prototype, "description", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Dialog.prototype, "open", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Dialog.prototype, "fullscreen", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "close-on-esc"
  })
], Dialog.prototype, "closeOnEsc", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "close-on-overlay-click"
  })
], Dialog.prototype, "closeOnOverlayClick", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "stacked-actions"
  })
], Dialog.prototype, "stackedActions", void 0);
__decorate([
  queryAssignedElements({
    slot: "header",
    selector: "mdui-top-app-bar",
    flatten: true
  })
], Dialog.prototype, "topAppBarElements", void 0);
__decorate([
  watch("open")
], Dialog.prototype, "onOpenChange", null);
Dialog = __decorate([
  customElement("mdui-dialog")
], Dialog);

// node_modules/mdui/components/divider/style.js
var style14 = css`:host{display:block;height:.0625rem;background-color:rgb(var(--mdui-color-surface-variant))}:host([inset]:not([inset=false i])){margin-left:1rem}:host([middle]:not([middle=false i])){margin-left:1rem;margin-right:1rem}:host([vertical]:not([vertical=false i])){height:100%;width:.0625rem}`;

// node_modules/mdui/components/divider/index.js
var Divider = class Divider2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.vertical = false;
    this.inset = false;
    this.middle = false;
  }
  render() {
    return html``;
  }
};
Divider.styles = [componentStyle, style14];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Divider.prototype, "vertical", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Divider.prototype, "inset", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Divider.prototype, "middle", void 0);
Divider = __decorate([
  customElement("mdui-divider")
], Divider);

// node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName2(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow2(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow2(value).Node;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow2(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow2(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName2(node));
}
function getComputedStyle(element) {
  return getWindow2(element).getComputedStyle(element);
}
function getParentNode(node) {
  if (getNodeName2(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow2(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

// node_modules/mdui/components/dropdown/style.js
var style15 = css`:host{--z-index:2100;display:contents}.panel{display:block;position:fixed;z-index:var(--z-index)}`;

// node_modules/mdui/components/dropdown/index.js
var Dropdown = class Dropdown2 extends MduiElement {
  constructor() {
    super();
    this.open = false;
    this.disabled = false;
    this.trigger = "click";
    this.placement = "auto";
    this.stayOpenOnClick = false;
    this.openDelay = 150;
    this.closeDelay = 150;
    this.openOnPointer = false;
    this.panelRef = createRef();
    this.definedController = new DefinedController(this, {
      relatedElements: [""]
    });
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onDocumentKeydown = this.onDocumentKeydown.bind(this);
    this.onWindowScroll = this.onWindowScroll.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onPanelClick = this.onPanelClick.bind(this);
  }
  get triggerElement() {
    return this.triggerElements[0];
  }
  // 这些属性变更时，需要更新样式
  async onPositionChange() {
    if (this.open) {
      await this.definedController.whenDefined();
      this.updatePositioner();
    }
  }
  async onOpenChange() {
    const hasUpdated = this.hasUpdated;
    if (!this.open && !hasUpdated) {
      return;
    }
    await this.definedController.whenDefined();
    if (!hasUpdated) {
      await this.updateComplete;
    }
    const easingLinear = getEasing(this, "linear");
    const easingEmphasizedDecelerate = getEasing(this, "emphasized-decelerate");
    const easingEmphasizedAccelerate = getEasing(this, "emphasized-accelerate");
    if (this.open) {
      if (hasUpdated) {
        const eventProceeded = this.emit("open", { cancelable: true });
        if (!eventProceeded) {
          return;
        }
      }
      const focusablePanel = this.panelElements.find((panel) => isFunction(panel.focus));
      setTimeout(() => {
        focusablePanel?.focus();
      });
      const duration = getDuration(this, "medium4");
      await stopAnimations(this.panelRef.value);
      this.panelRef.value.hidden = false;
      this.updatePositioner();
      await Promise.all([
        animateTo(this.panelRef.value, [
          { transform: `${this.getCssScaleName()}(0.45)` },
          { transform: `${this.getCssScaleName()}(1)` }
        ], {
          duration: hasUpdated ? duration : 0,
          easing: easingEmphasizedDecelerate
        }),
        animateTo(this.panelRef.value, [{ opacity: 0 }, { opacity: 1, offset: 0.125 }, { opacity: 1 }], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear
        })
      ]);
      if (hasUpdated) {
        this.emit("opened");
      }
    } else {
      const eventProceeded = this.emit("close", { cancelable: true });
      if (!eventProceeded) {
        return;
      }
      if (!this.hasTrigger("focus") && isFunction(this.triggerElement?.focus) && (this.contains(document.activeElement) || this.contains(document.activeElement?.assignedSlot ?? null))) {
        this.triggerElement.focus();
      }
      const duration = getDuration(this, "short4");
      await stopAnimations(this.panelRef.value);
      await Promise.all([
        animateTo(this.panelRef.value, [
          { transform: `${this.getCssScaleName()}(1)` },
          { transform: `${this.getCssScaleName()}(0.45)` }
        ], { duration, easing: easingEmphasizedAccelerate }),
        animateTo(this.panelRef.value, [{ opacity: 1 }, { opacity: 1, offset: 0.875 }, { opacity: 0 }], { duration, easing: easingLinear })
      ]);
      if (this.panelRef.value) {
        this.panelRef.value.hidden = true;
      }
      this.emit("closed");
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.definedController.whenDefined().then(() => {
      document.addEventListener("pointerdown", this.onDocumentClick);
      document.addEventListener("keydown", this.onDocumentKeydown);
      this.overflowAncestors = getOverflowAncestors(this.triggerElement);
      this.overflowAncestors.forEach((ancestor) => {
        ancestor.addEventListener("scroll", this.onWindowScroll);
      });
      this.observeResize = observeResize(this.triggerElement, () => {
        this.updatePositioner();
      });
    });
  }
  disconnectedCallback() {
    if (!this.open && this.panelRef.value) {
      this.panelRef.value.hidden = true;
    }
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onDocumentClick);
    document.removeEventListener("keydown", this.onDocumentKeydown);
    this.overflowAncestors?.forEach((ancestor) => {
      ancestor.removeEventListener("scroll", this.onWindowScroll);
    });
    this.observeResize?.unobserve();
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.definedController.whenDefined().then(() => {
      this.triggerElement.addEventListener("focus", this.onFocus);
      this.triggerElement.addEventListener("click", this.onClick);
      this.triggerElement.addEventListener("contextmenu", this.onContextMenu);
      this.triggerElement.addEventListener("mouseenter", this.onMouseEnter);
    });
  }
  render() {
    return html`<slot name="trigger" part="trigger" class="trigger"></slot><slot ${ref(this.panelRef)} part="panel" class="panel" hidden @click="${this.onPanelClick}"></slot>`;
  }
  /**
   * 获取 dropdown 打开、关闭动画的 CSS scaleX 或 scaleY
   */
  getCssScaleName() {
    return this.animateDirection === "horizontal" ? "scaleX" : "scaleY";
  }
  /**
   * 在 document 上点击时，根据条件判断是否要关闭 dropdown
   */
  onDocumentClick(e) {
    if (this.disabled || !this.open) {
      return;
    }
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.open = false;
    }
    if (this.hasTrigger("contextmenu") && !this.hasTrigger("click") && path.includes(this.triggerElement)) {
      this.open = false;
    }
  }
  /**
   * 在 document 上按下按键时，根据条件判断是否要关闭 dropdown
   */
  onDocumentKeydown(event) {
    if (this.disabled || !this.open) {
      return;
    }
    if (event.key === "Escape") {
      this.open = false;
      return;
    }
    if (event.key === "Tab") {
      if (!this.hasTrigger("focus") && isFunction(this.triggerElement?.focus)) {
        event.preventDefault();
      }
      this.open = false;
    }
  }
  onWindowScroll() {
    window.requestAnimationFrame(() => this.onPositionChange());
  }
  hasTrigger(trigger) {
    const triggers = this.trigger.split(" ");
    return triggers.includes(trigger);
  }
  onFocus() {
    if (this.disabled || this.open || !this.hasTrigger("focus")) {
      return;
    }
    this.open = true;
  }
  onClick(e) {
    if (this.disabled || e.button || !this.hasTrigger("click")) {
      return;
    }
    if (this.open && (this.hasTrigger("hover") || this.hasTrigger("focus"))) {
      return;
    }
    this.pointerOffsetX = e.offsetX;
    this.pointerOffsetY = e.offsetY;
    this.open = !this.open;
  }
  onPanelClick(e) {
    if (!this.disabled && !this.stayOpenOnClick && $(e.target).is("mdui-menu-item")) {
      this.open = false;
    }
  }
  onContextMenu(e) {
    if (this.disabled || !this.hasTrigger("contextmenu")) {
      return;
    }
    e.preventDefault();
    this.pointerOffsetX = e.offsetX;
    this.pointerOffsetY = e.offsetY;
    this.open = true;
  }
  onMouseEnter() {
    if (this.disabled || !this.hasTrigger("hover")) {
      return;
    }
    window.clearTimeout(this.closeTimeout);
    if (this.openDelay) {
      this.openTimeout = window.setTimeout(() => {
        this.open = true;
      }, this.openDelay);
    } else {
      this.open = true;
    }
  }
  onMouseLeave() {
    if (this.disabled || !this.hasTrigger("hover")) {
      return;
    }
    window.clearTimeout(this.openTimeout);
    this.closeTimeout = window.setTimeout(() => {
      this.open = false;
    }, this.closeDelay || 50);
  }
  // 更新 panel 的位置
  updatePositioner() {
    const $panel = $(this.panelRef.value);
    const $window = $(window);
    const panelElements = this.panelElements;
    const panelRect = {
      width: Math.max(...panelElements?.map((panel) => panel.offsetWidth) ?? []),
      height: panelElements?.map((panel) => panel.offsetHeight).reduce((total, height) => total + height, 0)
    };
    const triggerClientRect = this.triggerElement.getBoundingClientRect();
    const triggerRect = this.openOnPointer ? {
      top: this.pointerOffsetY + triggerClientRect.top,
      left: this.pointerOffsetX + triggerClientRect.left,
      width: 0,
      height: 0
    } : triggerClientRect;
    const screenMargin = 8;
    let transformOriginX;
    let transformOriginY;
    let top;
    let left;
    let placement = this.placement;
    if (placement === "auto") {
      const windowWidth = $window.width();
      const windowHeight = $window.height();
      let position2;
      let alignment2;
      if (windowHeight - triggerRect.top - triggerRect.height > panelRect.height + screenMargin) {
        position2 = "bottom";
      } else if (triggerRect.top > panelRect.height + screenMargin) {
        position2 = "top";
      } else if (windowWidth - triggerRect.left - triggerRect.width > panelRect.width + screenMargin) {
        position2 = "right";
      } else if (triggerRect.left > panelRect.width + screenMargin) {
        position2 = "left";
      } else {
        position2 = "bottom";
      }
      if (["top", "bottom"].includes(position2)) {
        if (windowWidth - triggerRect.left > panelRect.width + screenMargin) {
          alignment2 = "start";
        } else if (triggerRect.left + triggerRect.width / 2 > panelRect.width / 2 + screenMargin && windowWidth - triggerRect.left - triggerRect.width / 2 > panelRect.width / 2 + screenMargin) {
          alignment2 = void 0;
        } else if (triggerRect.left + triggerRect.width > panelRect.width + screenMargin) {
          alignment2 = "end";
        } else {
          alignment2 = "start";
        }
      } else {
        if (windowHeight - triggerRect.top > panelRect.height + screenMargin) {
          alignment2 = "start";
        } else if (triggerRect.top + triggerRect.height / 2 > panelRect.height / 2 + screenMargin && windowHeight - triggerRect.top - triggerRect.height / 2 > panelRect.height / 2 + screenMargin) {
          alignment2 = void 0;
        } else if (triggerRect.top + triggerRect.height > panelRect.height + screenMargin) {
          alignment2 = "end";
        } else {
          alignment2 = "start";
        }
      }
      placement = alignment2 ? [position2, alignment2].join("-") : position2;
    }
    const [position, alignment] = placement.split("-");
    this.animateDirection = ["top", "bottom"].includes(position) ? "vertical" : "horizontal";
    switch (position) {
      case "top":
        transformOriginY = "bottom";
        top = triggerRect.top - panelRect.height;
        break;
      case "bottom":
        transformOriginY = "top";
        top = triggerRect.top + triggerRect.height;
        break;
      default:
        transformOriginY = "center";
        switch (alignment) {
          case "start":
            top = triggerRect.top;
            break;
          case "end":
            top = triggerRect.top + triggerRect.height - panelRect.height;
            break;
          default:
            top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
            break;
        }
        break;
    }
    switch (position) {
      case "left":
        transformOriginX = "right";
        left = triggerRect.left - panelRect.width;
        break;
      case "right":
        transformOriginX = "left";
        left = triggerRect.left + triggerRect.width;
        break;
      default:
        transformOriginX = "center";
        switch (alignment) {
          case "start":
            left = triggerRect.left;
            break;
          case "end":
            left = triggerRect.left + triggerRect.width - panelRect.width;
            break;
          default:
            left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
            break;
        }
        break;
    }
    $panel.css({
      top,
      left,
      transformOrigin: [transformOriginX, transformOriginY].join(" ")
    });
  }
};
Dropdown.styles = [componentStyle, style15];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Dropdown.prototype, "open", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Dropdown.prototype, "disabled", void 0);
__decorate([
  property({ reflect: true })
], Dropdown.prototype, "trigger", void 0);
__decorate([
  property({ reflect: true })
], Dropdown.prototype, "placement", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "stay-open-on-click"
  })
], Dropdown.prototype, "stayOpenOnClick", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "open-delay" })
], Dropdown.prototype, "openDelay", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "close-delay" })
], Dropdown.prototype, "closeDelay", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "open-on-pointer"
  })
], Dropdown.prototype, "openOnPointer", void 0);
__decorate([
  queryAssignedElements({ slot: "trigger", flatten: true })
], Dropdown.prototype, "triggerElements", void 0);
__decorate([
  queryAssignedElements({ flatten: true })
], Dropdown.prototype, "panelElements", void 0);
__decorate([
  watch("placement", true),
  watch("openOnPointer", true)
], Dropdown.prototype, "onPositionChange", null);
__decorate([
  watch("open")
], Dropdown.prototype, "onOpenChange", null);
Dropdown = __decorate([
  customElement("mdui-dropdown")
], Dropdown);

// node_modules/@mdui/shared/helpers/delay.js
var delay = (duration = 0) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

// node_modules/mdui/components/fab/style.js
var style16 = css`:host{--shape-corner-small:var(--mdui-shape-corner-small);--shape-corner-normal:var(--mdui-shape-corner-large);--shape-corner-large:var(--mdui-shape-corner-extra-large);position:relative;display:inline-block;flex-shrink:0;overflow:hidden;text-align:center;border-radius:var(--shape-corner-normal);cursor:pointer;-webkit-tap-highlight-color:transparent;transition-property:box-shadow;transition-timing-function:var(--mdui-motion-easing-emphasized);transition-duration:var(--mdui-motion-duration-medium4);width:3.5rem;height:3.5rem;box-shadow:var(--mdui-elevation-level3);font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking);line-height:var(--mdui-typescale-label-large-line-height)}.button{padding:0 1rem}:host([size=small]) .button{padding:0 .5rem}:host([size=large]) .button{padding:0 1.875rem}:host([lowered]){box-shadow:var(--mdui-elevation-level1)}:host([focus-visible]){box-shadow:var(--mdui-elevation-level3)}:host([lowered][focus-visible]){box-shadow:var(--mdui-elevation-level1)}:host([pressed]){box-shadow:var(--mdui-elevation-level3)}:host([lowered][pressed]){box-shadow:var(--mdui-elevation-level1)}:host([hover]){box-shadow:var(--mdui-elevation-level4)}:host([lowered][hover]){box-shadow:var(--mdui-elevation-level2)}:host([variant=primary]){color:rgb(var(--mdui-color-on-primary-container));background-color:rgb(var(--mdui-color-primary-container));--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-primary-container
    )}:host([variant=surface]){color:rgb(var(--mdui-color-primary));background-color:rgb(var(--mdui-color-surface-container-high));--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([variant=surface][lowered]){background-color:rgb(var(--mdui-color-surface-container-low))}:host([variant=secondary]){color:rgb(var(--mdui-color-on-secondary-container));background-color:rgb(var(--mdui-color-secondary-container));--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-secondary-container
    )}:host([variant=tertiary]){color:rgb(var(--mdui-color-on-tertiary-container));background-color:rgb(var(--mdui-color-tertiary-container));--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-tertiary-container
    )}:host([size=small]){border-radius:var(--shape-corner-small);width:2.5rem;height:2.5rem}:host([size=large]){border-radius:var(--shape-corner-large);width:6rem;height:6rem}:host([disabled]:not([disabled=false i])),:host([loading]:not([loading=false i])){cursor:default;pointer-events:none}:host([disabled]:not([disabled=false i])){color:rgba(var(--mdui-color-on-surface),38%);background-color:rgba(var(--mdui-color-on-surface),12%);box-shadow:var(--mdui-elevation-level0)}:host([extended]:not([extended=false i])){width:auto}.label{display:inline-flex;transition:opacity var(--mdui-motion-duration-short2) var(--mdui-motion-easing-linear) var(--mdui-motion-duration-short2);padding-left:.25rem;padding-right:.25rem}.has-icon .label{margin-left:.5rem}:host([size=small]) .has-icon .label{margin-left:.25rem}:host([size=large]) .has-icon .label{margin-left:1rem}:host(:not([extended])) .label,:host([extended=false i]) .label{opacity:0;transition-delay:0s;transition-duration:var(--mdui-motion-duration-short1)}:host([size=large]) .label{font-size:1.5em}.icon{display:inline-flex;font-size:1.71428571em}:host([size=large]) .icon{font-size:2.57142857em}.icon mdui-icon,::slotted([slot=icon]){font-size:inherit}mdui-circular-progress{display:inline-flex;width:1.5rem;height:1.5rem}:host([size=large]) mdui-circular-progress{width:2.25rem;height:2.25rem}:host([disabled]:not([disabled=false i])) mdui-circular-progress{stroke:rgba(var(--mdui-color-on-surface),38%)}`;

// node_modules/mdui/components/fab/index.js
var Fab = class Fab2 extends ButtonBase {
  constructor() {
    super(...arguments);
    this.variant = "primary";
    this.size = "normal";
    this.extended = false;
    this.rippleRef = createRef();
    this.hasSlotController = new HasSlotController(this, "icon");
    this.definedController = new DefinedController(this, {
      relatedElements: [""]
    });
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  /**
   * extended 变更时，设置动画
   */
  async onExtendedChange() {
    const hasUpdated = this.hasUpdated;
    if (this.extended) {
      this.style.width = `${this.scrollWidth}px`;
    } else {
      this.style.width = "";
    }
    await this.definedController.whenDefined();
    await this.updateComplete;
    if (this.extended && !hasUpdated) {
      this.style.width = `${this.scrollWidth}px`;
    }
    if (!hasUpdated) {
      await delay();
      this.style.transitionProperty = "box-shadow, width, bottom, transform";
    }
  }
  render() {
    const className2 = cc({
      button: true,
      "has-icon": this.icon || this.hasSlotController.test("icon")
    });
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton() ? this.renderButton({
      className: className2,
      part: "button",
      content: this.renderInner()
    }) : this.disabled || this.loading ? html`<span part="button" class="_a ${className2}">${this.renderInner()}</span>` : this.renderAnchor({
      className: className2,
      part: "button",
      content: this.renderInner()
    })}`;
  }
  renderLabel() {
    return html`<slot part="label" class="label"></slot>`;
  }
  renderIcon() {
    if (this.loading) {
      return this.renderLoading();
    }
    return html`<slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderInner() {
    return [this.renderIcon(), this.renderLabel()];
  }
};
Fab.styles = [ButtonBase.styles, style16];
__decorate([
  property({ reflect: true })
], Fab.prototype, "variant", void 0);
__decorate([
  property({ reflect: true })
], Fab.prototype, "size", void 0);
__decorate([
  property({ reflect: true })
], Fab.prototype, "icon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Fab.prototype, "extended", void 0);
__decorate([
  watch("extended")
], Fab.prototype, "onExtendedChange", null);
Fab = __decorate([
  customElement("mdui-fab")
], Fab);

// node_modules/mdui/components/layout/layout-style.js
var layoutStyle = css`:host{position:relative;display:flex;flex:1 1 auto;overflow:hidden}:host([full-height]:not([full-height=false i])){height:100%}`;

// node_modules/mdui/components/layout/layout.js
var Layout = class Layout2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.fullHeight = false;
  }
  render() {
    return html`<slot></slot>`;
  }
};
Layout.styles = [componentStyle, layoutStyle];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "full-height"
  })
], Layout.prototype, "fullHeight", void 0);
Layout = __decorate([
  customElement("mdui-layout")
], Layout);

// node_modules/mdui/components/layout/layout-item-style.js
var layoutItemStyle = css`:host{display:flex;z-index:1}`;

// node_modules/mdui/components/layout/layout-item.js
var LayoutItem = class LayoutItem2 extends LayoutItemBase {
  constructor() {
    super(...arguments);
    this.placement = "top";
  }
  get layoutPlacement() {
    return this.placement;
  }
  // placement 变更时，需要重新调整布局
  onPlacementChange() {
    this.layoutManager?.updateLayout(this);
  }
  render() {
    return html`<slot></slot>`;
  }
};
LayoutItem.styles = [
  componentStyle,
  layoutItemStyle
];
__decorate([
  property({ reflect: true })
], LayoutItem.prototype, "placement", void 0);
__decorate([
  watch("placement", true)
], LayoutItem.prototype, "onPlacementChange", null);
LayoutItem = __decorate([
  customElement("mdui-layout-item")
], LayoutItem);

// node_modules/mdui/components/layout/layout-main-style.js
var layoutMainStyle = css`:host{flex:1 0 auto;max-width:100%;overflow:auto}`;

// node_modules/mdui/components/layout/layout-main.js
var LayoutMain = class LayoutMain2 extends MduiElement {
  connectedCallback() {
    super.connectedCallback();
    const parentElement = this.parentElement;
    if (isNodeName(parentElement, "mdui-layout")) {
      this.layoutManager = getLayout(parentElement);
      this.layoutManager.registerMain(this);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.layoutManager) {
      this.layoutManager.unregisterMain();
    }
  }
  render() {
    return html`<slot></slot>`;
  }
};
LayoutMain.styles = [
  componentStyle,
  layoutMainStyle
];
LayoutMain = __decorate([
  customElement("mdui-layout-main")
], LayoutMain);

// node_modules/mdui/components/linear-progress/style.js
var style17 = css`:host{--shape-corner:var(--mdui-shape-corner-none);position:relative;display:inline-block;width:100%;overflow:hidden;border-radius:var(--shape-corner);background-color:rgb(var(--mdui-color-surface-container-highest));height:.25rem}.determinate,.indeterminate{background-color:rgb(var(--mdui-color-primary))}.determinate{height:100%;transition:width var(--mdui-motion-duration-long2) var(--mdui-motion-easing-standard)}.indeterminate::before{position:absolute;top:0;bottom:0;left:0;background-color:inherit;animation:mdui-comp-progress-indeterminate 2s var(--mdui-motion-easing-linear) infinite;content:' '}.indeterminate::after{position:absolute;top:0;bottom:0;left:0;background-color:inherit;animation:mdui-comp-progress-indeterminate-short 2s var(--mdui-motion-easing-linear) infinite;content:' '}@keyframes mdui-comp-progress-indeterminate{0%{left:0;width:0}50%{left:30%;width:70%}75%{left:100%;width:0}}@keyframes mdui-comp-progress-indeterminate-short{0%{left:0;width:0}50%{left:0;width:0}75%{left:0;width:25%}100%{left:100%;width:0}}`;

// node_modules/mdui/components/linear-progress/index.js
var LinearProgress = class LinearProgress2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.max = 1;
  }
  render() {
    const isDeterminate = !isUndefined(this.value);
    if (isDeterminate) {
      const value = this.value;
      return html`<div part="indicator" class="determinate" style="${styleMap({
        width: `${value / Math.max(this.max ?? value, value) * 100}%`
      })}"></div>`;
    }
    return html`<div part="indicator" class="indeterminate"></div>`;
  }
};
LinearProgress.styles = [componentStyle, style17];
__decorate([
  property({ type: Number, reflect: true })
], LinearProgress.prototype, "max", void 0);
__decorate([
  property({ type: Number })
], LinearProgress.prototype, "value", void 0);
LinearProgress = __decorate([
  customElement("mdui-linear-progress")
], LinearProgress);

// node_modules/mdui/components/list/list-item-style.js
var listItemStyle = css`:host{--shape-corner:var(--mdui-shape-corner-none);--shape-corner-rounded:var(--mdui-shape-corner-extra-large);position:relative;display:block;border-radius:var(--shape-corner);--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([rounded]:not([rounded=false i])),:host([rounded]:not([rounded=false i])) mdui-ripple{border-radius:var(--shape-corner-rounded)}:host([active]:not([active=false i])){background-color:rgb(var(--mdui-color-secondary-container));--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-secondary-container
    )}:host([disabled]:not([disabled=false i])){pointer-events:none}.container{cursor:pointer;-webkit-user-select:none;user-select:none;text-decoration:none;color:inherit;-webkit-tap-highlight-color:transparent}:host([disabled]:not([disabled=false i])) .container{cursor:default;opacity:.38}:host([nonclickable]:not([href],[nonclickable=false i])) .container{cursor:auto;-webkit-user-select:auto;user-select:auto}.preset{display:flex;align-items:center;padding:.5rem 1.5rem .5rem 1rem;min-height:3.5rem}:host([alignment=start]) .preset{align-items:flex-start}:host([alignment=end]) .preset{align-items:flex-end}.body{display:flex;flex:1 1 100%;flex-direction:column;justify-content:center;min-width:0}.headline{display:block;color:rgb(var(--mdui-color-on-surface));font-size:var(--mdui-typescale-body-large-size);font-weight:var(--mdui-typescale-body-large-weight);letter-spacing:var(--mdui-typescale-body-large-tracking);line-height:var(--mdui-typescale-body-large-line-height)}:host([active]:not([active=false i])) .headline{color:rgb(var(--mdui-color-on-secondary-container))}.description{display:none;color:rgb(var(--mdui-color-on-surface-variant));font-size:var(--mdui-typescale-body-medium-size);font-weight:var(--mdui-typescale-body-medium-weight);letter-spacing:var(--mdui-typescale-body-medium-tracking);line-height:var(--mdui-typescale-body-medium-line-height)}:host([disabled]:not([disabled=false i])) .description,:host([focused]) .description,:host([hover]) .description,:host([pressed]) .description{color:rgb(var(--mdui-color-on-surface))}.has-description .description{display:block}:host([description-line='1']) .description,:host([headline-line='1']) .headline{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host([description-line='2']) .description,:host([description-line='3']) .description,:host([headline-line='2']) .headline,:host([headline-line='3']) .headline{display:-webkit-box;overflow:hidden;text-overflow:ellipsis;-webkit-box-orient:vertical}:host([description-line='2']) .description,:host([headline-line='2']) .headline{-webkit-line-clamp:2}:host([description-line='3']) .description,:host([headline-line='3']) .headline{-webkit-line-clamp:3}.end-icon,.icon{display:flex;flex:0 0 auto;font-size:var(--mdui-typescale-label-small-size);font-weight:var(--mdui-typescale-label-small-weight);letter-spacing:var(--mdui-typescale-label-small-tracking);line-height:var(--mdui-typescale-label-small-line-height);color:rgb(var(--mdui-color-on-surface-variant))}:host([disabled]:not([disabled=false i])) .end-icon,:host([disabled]:not([disabled=false i])) .icon,:host([focused]) .end-icon,:host([focused]) .icon,:host([hover]) .end-icon,:host([hover]) .icon,:host([pressed]) .end-icon,:host([pressed]) .icon{color:rgb(var(--mdui-color-on-surface))}:host([active]:not([active=false i])) .end-icon,:host([active]:not([active=false i])) .icon{color:rgb(var(--mdui-color-on-secondary-container))}.end-icon mdui-icon,.icon mdui-icon,.is-end-icon ::slotted([slot=end-icon]),.is-icon ::slotted([slot=icon]){font-size:1.5rem}.has-icon .icon{margin-right:1rem}.has-icon ::slotted(mdui-checkbox[slot=icon]),.has-icon ::slotted(mdui-radio[slot=icon]){margin-left:-.5rem}.has-end-icon .end-icon{margin-left:1rem}.has-end-icon ::slotted(mdui-checkbox[slot=end-icon]),.has-end-icon ::slotted(mdui-radio[slot=end-icon]){margin-right:-.5rem}`;

// node_modules/mdui/components/list/list-item.js
var ListItem = class ListItem2 extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.active = false;
    this.nonclickable = false;
    this.rounded = false;
    this.alignment = "center";
    this.rippleRef = createRef();
    this.itemRef = createRef();
    this.hasSlotController = new HasSlotController(this, "[default]", "description", "icon", "end-icon", "custom");
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.focusDisabled;
  }
  get focusElement() {
    return this.href && !this.disabled ? this.itemRef.value : this;
  }
  get focusDisabled() {
    return this.href ? this.disabled : this.disabled || this.nonclickable;
  }
  render() {
    const preset = !this.hasSlotController.test("custom");
    const hasIcon = this.icon || this.hasSlotController.test("icon");
    const hasEndIcon = this.endIcon || this.hasSlotController.test("end-icon");
    const hasDescription = this.description || this.hasSlotController.test("description");
    const isIcon = (element) => isNodeName(element, "mdui-icon") || getNodeName(element).startsWith("mdui-icon-");
    const className2 = cc({
      container: true,
      preset,
      "has-icon": hasIcon,
      "has-end-icon": hasEndIcon,
      "has-description": hasDescription,
      // icon, end-icon slot 中的元素是否为 mdui-icon 或 mdui-icon-* 组件
      "is-icon": isIcon(this.iconElements[0]),
      "is-end-icon": isIcon(this.endIconElements[0])
    });
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.href && !this.disabled ? this.renderAnchor({
      className: className2,
      content: this.renderInner(),
      part: "container",
      refDirective: ref(this.itemRef)
    }) : html`<div part="container" class="${className2}" ${ref(this.itemRef)}>${this.renderInner()}</div>`}`;
  }
  renderInner() {
    const hasDefaultSlot = this.hasSlotController.test("[default]");
    return html`<slot name="custom"><slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}"></mdui-icon>` : nothingTemplate}</slot><div part="body" class="body">${hasDefaultSlot ? html`<slot part="headline" class="headline"></slot>` : html`<div part="headline" class="headline">${this.headline}</div>`}<slot name="description" part="description" class="description">${this.description}</slot></div><slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon ? html`<mdui-icon name="${this.endIcon}"></mdui-icon>` : nothingTemplate}</slot></slot>`;
  }
};
ListItem.styles = [
  componentStyle,
  listItemStyle
];
__decorate([
  property({ reflect: true })
], ListItem.prototype, "headline", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "headline-line" })
], ListItem.prototype, "headlineLine", void 0);
__decorate([
  property({ reflect: true })
], ListItem.prototype, "description", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "description-line" })
], ListItem.prototype, "descriptionLine", void 0);
__decorate([
  property({ reflect: true })
], ListItem.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-icon" })
], ListItem.prototype, "endIcon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ListItem.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ListItem.prototype, "active", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ListItem.prototype, "nonclickable", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], ListItem.prototype, "rounded", void 0);
__decorate([
  property({ reflect: true })
], ListItem.prototype, "alignment", void 0);
__decorate([
  queryAssignedElements({ slot: "icon", flatten: true })
], ListItem.prototype, "iconElements", void 0);
__decorate([
  queryAssignedElements({ slot: "end-icon", flatten: true })
], ListItem.prototype, "endIconElements", void 0);
ListItem = __decorate([
  customElement("mdui-list-item")
], ListItem);

// node_modules/mdui/components/list/list-subheader-style.js
var listSubheaderStyle = css`:host{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;cursor:default;color:rgb(var(--mdui-color-on-surface-variant));font-size:var(--mdui-typescale-label-small-size);font-weight:var(--mdui-typescale-label-small-weight);letter-spacing:var(--mdui-typescale-label-small-tracking);line-height:var(--mdui-typescale-label-small-line-height);padding-left:1rem;padding-right:1.5rem;height:3.5rem;line-height:3.5rem}`;

// node_modules/mdui/components/list/list-subheader.js
var ListSubheader = class ListSubheader2 extends MduiElement {
  render() {
    return html`<slot></slot>`;
  }
};
ListSubheader.styles = [
  componentStyle,
  listSubheaderStyle
];
ListSubheader = __decorate([
  customElement("mdui-list-subheader")
], ListSubheader);

// node_modules/mdui/components/list/list-style.js
var listStyle = css`:host{display:block;padding:.5rem 0}::slotted(mdui-divider[middle]){margin-left:1rem;margin-right:1.5rem}`;

// node_modules/mdui/components/list/list.js
var List = class List2 extends MduiElement {
  render() {
    return html`<slot></slot>`;
  }
};
List.styles = [componentStyle, listStyle];
List = __decorate([
  customElement("mdui-list")
], List);

// node_modules/@mdui/shared/icons/arrow-right.js
var IconArrowRight = class IconArrowRight2 extends LitElement {
  render() {
    return svgTag('<path d="m10 17 5-5-5-5v10z"/>');
  }
};
IconArrowRight.styles = style10;
IconArrowRight = __decorate([
  customElement("mdui-icon-arrow-right")
], IconArrowRight);

// node_modules/mdui/components/menu/menu-item-style.js
var menuItemStyle = css`:host{position:relative;display:block}:host([selected]){background-color:rgba(var(--mdui-color-primary),12%)}:host([disabled]:not([disabled=false i])){pointer-events:none}.container{cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}:host([disabled]:not([disabled=false i])) .container{cursor:default;opacity:.38}.preset{display:flex;align-items:center;text-decoration:none;height:3rem;padding:0 .75rem}.preset.dense{height:2rem}.label-container{flex:1 1 100%;min-width:0}.label{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:rgb(var(--mdui-color-on-surface));font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking)}.end-icon,.end-text,.icon,.selected-icon{display:none;flex:0 0 auto;color:rgb(var(--mdui-color-on-surface-variant))}.has-end-icon .end-icon,.has-end-text .end-text,.has-icon .icon,.has-icon .selected-icon{display:flex}.end-icon,.icon,.selected-icon{font-size:1.5rem}.end-icon::slotted(mdui-avatar),.icon::slotted(mdui-avatar),.selected-icon::slotted(mdui-avatar){width:1.5rem;height:1.5rem}.dense .end-icon,.dense .icon,.dense .selected-icon{font-size:1.125rem}.dense .end-icon::slotted(mdui-avatar),.dense .icon::slotted(mdui-avatar),.dense .selected-icon::slotted(mdui-avatar){width:1.125rem;height:1.125rem}.end-icon .i,.icon .i,.selected-icon .i,::slotted([slot=end-icon]),::slotted([slot=icon]),::slotted([slot=selected-icon]){font-size:inherit}.end-text{font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking);line-height:var(--mdui-typescale-label-large-line-height)}.icon,.selected-icon{margin-right:.75rem}.end-icon,.end-text{margin-left:.75rem}.arrow-right{color:rgb(var(--mdui-color-on-surface))}.submenu{--shape-corner:var(--mdui-shape-corner-extra-small);display:block;position:absolute;z-index:1;border-radius:var(--shape-corner);background-color:rgb(var(--mdui-color-surface-container));box-shadow:var(--mdui-elevation-level2);min-width:7rem;max-width:17.5rem;padding-top:.5rem;padding-bottom:.5rem;--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}.submenu::slotted(mdui-divider){margin-top:.5rem;margin-bottom:.5rem}`;

// node_modules/mdui/components/menu/menu-item.js
var MenuItem = class MenuItem2 extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
  constructor() {
    super();
    this.disabled = false;
    this.submenuOpen = false;
    this.selected = false;
    this.dense = false;
    this.focusable = false;
    this.key = uniqueId();
    this.rippleRef = createRef();
    this.containerRef = createRef();
    this.submenuRef = createRef();
    this.hasSlotController = new HasSlotController(this, "[default]", "icon", "end-icon", "end-text", "submenu", "custom");
    this.definedController = new DefinedController(this, {
      relatedElements: [""]
    });
    this.onOuterClick = this.onOuterClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  get focusDisabled() {
    return this.disabled || !this.focusable;
  }
  get focusElement() {
    return this.href && !this.disabled ? this.containerRef.value : this;
  }
  get rippleDisabled() {
    return this.disabled;
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get hasSubmenu() {
    return this.hasSlotController.test("submenu");
  }
  async onOpenChange() {
    const hasUpdated = this.hasUpdated;
    if (!this.submenuOpen && !hasUpdated) {
      return;
    }
    await this.definedController.whenDefined();
    if (!hasUpdated) {
      await this.updateComplete;
    }
    const easingLinear = getEasing(this, "linear");
    const easingEmphasizedDecelerate = getEasing(this, "emphasized-decelerate");
    const easingEmphasizedAccelerate = getEasing(this, "emphasized-accelerate");
    if (this.submenuOpen) {
      if (hasUpdated) {
        const eventProceeded = this.emit("submenu-open", { cancelable: true });
        if (!eventProceeded) {
          return;
        }
      }
      const duration = getDuration(this, "medium4");
      await stopAnimations(this.submenuRef.value);
      this.submenuRef.value.hidden = false;
      this.updateSubmenuPositioner();
      await Promise.all([
        animateTo(this.submenuRef.value, [{ transform: "scaleY(0.45)" }, { transform: "scaleY(1)" }], {
          duration: hasUpdated ? duration : 0,
          easing: easingEmphasizedDecelerate
        }),
        animateTo(this.submenuRef.value, [{ opacity: 0 }, { opacity: 1, offset: 0.125 }, { opacity: 1 }], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear
        })
      ]);
      if (hasUpdated) {
        this.emit("submenu-opened");
      }
    } else {
      const eventProceeded = this.emit("submenu-close", { cancelable: true });
      if (!eventProceeded) {
        return;
      }
      const duration = getDuration(this, "short4");
      await stopAnimations(this.submenuRef.value);
      await Promise.all([
        animateTo(this.submenuRef.value, [{ transform: "scaleY(1)" }, { transform: "scaleY(0.45)" }], { duration, easing: easingEmphasizedAccelerate }),
        animateTo(this.submenuRef.value, [{ opacity: 1 }, { opacity: 1, offset: 0.875 }, { opacity: 0 }], { duration, easing: easingLinear })
      ]);
      if (this.submenuRef.value) {
        this.submenuRef.value.hidden = true;
      }
      this.emit("submenu-closed");
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.definedController.whenDefined().then(() => {
      document.addEventListener("pointerdown", this.onOuterClick);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onOuterClick);
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.definedController.whenDefined().then(() => {
      this.addEventListener("focus", this.onFocus);
      this.addEventListener("blur", this.onBlur);
      this.addEventListener("click", this.onClick);
      this.addEventListener("keydown", this.onKeydown);
      this.addEventListener("mouseenter", this.onMouseEnter);
      this.addEventListener("mouseleave", this.onMouseLeave);
    });
  }
  render() {
    const hasSubmenu = this.hasSubmenu;
    const hasCustomSlot = this.hasSlotController.test("custom");
    const hasEndIconSlot = this.hasSlotController.test("end-icon");
    const useDefaultEndIcon = !this.endIcon && hasSubmenu && !hasEndIconSlot;
    const hasEndIcon = this.endIcon || hasSubmenu || hasEndIconSlot;
    const hasIcon = !isUndefined(this.icon) || this.selects === "single" || this.selects === "multiple" || this.hasSlotController.test("icon");
    const hasEndText = !!this.endText || this.hasSlotController.test("end-text");
    const className2 = cc({
      container: true,
      dense: this.dense,
      preset: !hasCustomSlot,
      "has-icon": hasIcon,
      "has-end-text": hasEndText,
      "has-end-icon": hasEndIcon
    });
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.href && !this.disabled ? this.renderAnchor({
      part: "container",
      className: className2,
      content: this.renderInner(useDefaultEndIcon, hasIcon),
      refDirective: ref(this.containerRef),
      tabIndex: this.focusable ? 0 : -1
    }) : html`<div part="container" ${ref(this.containerRef)} class="${className2}">${this.renderInner(useDefaultEndIcon, hasIcon)}</div>`} ${when(hasSubmenu, () => html`<slot name="submenu" ${ref(this.submenuRef)} part="submenu" class="submenu" hidden></slot>`)}`;
  }
  /**
   * 点击子菜单外面的区域，关闭子菜单
   */
  onOuterClick(event) {
    if (!this.disabled && this.submenuOpen && this !== event.target && !$.contains(this, event.target)) {
      this.submenuOpen = false;
    }
  }
  hasTrigger(trigger) {
    return this.submenuTrigger ? this.submenuTrigger.split(" ").includes(trigger) : false;
  }
  onFocus() {
    if (this.disabled || this.submenuOpen || !this.hasTrigger("focus") || !this.hasSubmenu) {
      return;
    }
    this.submenuOpen = true;
  }
  onBlur() {
    if (this.disabled || !this.submenuOpen || !this.hasTrigger("focus") || !this.hasSubmenu) {
      return;
    }
    this.submenuOpen = false;
  }
  onClick(event) {
    if (this.disabled || event.button) {
      return;
    }
    if (!this.hasTrigger("click") || event.target !== this || !this.hasSubmenu) {
      return;
    }
    if (this.submenuOpen && (this.hasTrigger("hover") || this.hasTrigger("focus"))) {
      return;
    }
    this.submenuOpen = !this.submenuOpen;
  }
  onKeydown(event) {
    if (this.disabled || !this.hasSubmenu) {
      return;
    }
    if (!this.submenuOpen && event.key === "Enter") {
      event.stopPropagation();
      this.submenuOpen = true;
    }
    if (this.submenuOpen && event.key === "Escape") {
      event.stopPropagation();
      this.submenuOpen = false;
    }
  }
  onMouseEnter() {
    if (this.disabled || !this.hasTrigger("hover") || !this.hasSubmenu) {
      return;
    }
    window.clearTimeout(this.submenuCloseTimeout);
    if (this.submenuOpenDelay) {
      this.submenuOpenTimeout = window.setTimeout(() => {
        this.submenuOpen = true;
      }, this.submenuOpenDelay);
    } else {
      this.submenuOpen = true;
    }
  }
  onMouseLeave() {
    if (this.disabled || !this.hasTrigger("hover") || !this.hasSubmenu) {
      return;
    }
    window.clearTimeout(this.submenuOpenTimeout);
    this.submenuCloseTimeout = window.setTimeout(() => {
      this.submenuOpen = false;
    }, this.submenuCloseDelay || 50);
  }
  // 更新子菜单的位置
  updateSubmenuPositioner() {
    const $window = $(window);
    const $submenu = $(this.submenuRef.value);
    const itemRect = this.getBoundingClientRect();
    const submenuWidth = $submenu.innerWidth();
    const submenuHeight = $submenu.innerHeight();
    const screenMargin = 8;
    let placementX = "bottom";
    let placementY = "right";
    if ($window.height() - itemRect.top > submenuHeight + screenMargin) {
      placementX = "bottom";
    } else if (itemRect.top + itemRect.height > submenuHeight + screenMargin) {
      placementX = "top";
    }
    if ($window.width() - itemRect.left - itemRect.width > submenuWidth + screenMargin) {
      placementY = "right";
    } else if (itemRect.left > submenuWidth + screenMargin) {
      placementY = "left";
    }
    $(this.submenuRef.value).css({
      top: placementX === "bottom" ? 0 : itemRect.height - submenuHeight,
      left: placementY === "right" ? itemRect.width : -submenuWidth,
      transformOrigin: [
        placementY === "right" ? 0 : "100%",
        placementX === "bottom" ? 0 : "100%"
      ].join(" ")
    });
  }
  renderInner(useDefaultEndIcon, hasIcon) {
    return html`<slot name="custom">${this.selected ? html`<slot name="selected-icon" part="selected-icon" class="selected-icon">${this.selectedIcon ? html`<mdui-icon name="${this.selectedIcon}" class="i"></mdui-icon>` : html`<mdui-icon-check class="i"></mdui-icon-check>`}</slot>` : html`<slot name="icon" part="icon" class="icon">${hasIcon ? html`<mdui-icon name="${this.icon}" class="i"></mdui-icon>` : nothingTemplate}</slot>`}<div class="label-container"><slot part="label" class="label"></slot></div><slot name="end-text" part="end-text" class="end-text">${this.endText}</slot>${useDefaultEndIcon ? html`<mdui-icon-arrow-right part="end-icon" class="end-icon arrow-right"></mdui-icon-arrow-right>` : html`<slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon ? html`<mdui-icon name="${this.endIcon}"></mdui-icon>` : nothingTemplate}</slot>`}</slot>`;
  }
};
MenuItem.styles = [
  componentStyle,
  menuItemStyle
];
__decorate([
  property({ reflect: true })
], MenuItem.prototype, "value", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], MenuItem.prototype, "disabled", void 0);
__decorate([
  property({ reflect: true })
], MenuItem.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-icon" })
], MenuItem.prototype, "endIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-text" })
], MenuItem.prototype, "endText", void 0);
__decorate([
  property({ reflect: true, attribute: "selected-icon" })
], MenuItem.prototype, "selectedIcon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "submenu-open"
  })
], MenuItem.prototype, "submenuOpen", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], MenuItem.prototype, "selected", void 0);
__decorate([
  state()
], MenuItem.prototype, "dense", void 0);
__decorate([
  state()
], MenuItem.prototype, "selects", void 0);
__decorate([
  state()
], MenuItem.prototype, "submenuTrigger", void 0);
__decorate([
  state()
], MenuItem.prototype, "submenuOpenDelay", void 0);
__decorate([
  state()
], MenuItem.prototype, "submenuCloseDelay", void 0);
__decorate([
  state()
], MenuItem.prototype, "focusable", void 0);
__decorate([
  watch("submenuOpen")
], MenuItem.prototype, "onOpenChange", null);
MenuItem = __decorate([
  customElement("mdui-menu-item")
], MenuItem);

// node_modules/mdui/components/menu/menu-style.js
var menuStyle = css`:host{--shape-corner:var(--mdui-shape-corner-extra-small);position:relative;display:block;border-radius:var(--shape-corner);background-color:rgb(var(--mdui-color-surface-container));box-shadow:var(--mdui-elevation-level2);min-width:7rem;max-width:17.5rem;padding-top:.5rem;padding-bottom:.5rem;--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}::slotted(mdui-divider){margin-top:.5rem;margin-bottom:.5rem}`;

// node_modules/mdui/components/menu/menu.js
var Menu = class Menu2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.dense = false;
    this.submenuTrigger = "click hover";
    this.submenuOpenDelay = 200;
    this.submenuCloseDelay = 200;
    this.selectedKeys = [];
    this.isInitial = true;
    this.lastActiveItems = [];
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-menu-item"]
    });
  }
  // 菜单项元素（包含子菜单中的菜单项）
  get items() {
    return $(this.childrenItems).find("mdui-menu-item").add(this.childrenItems).get();
  }
  // 菜单项元素（不包含已禁用的，包含子菜单中的菜单项）
  get itemsEnabled() {
    return this.items.filter((item) => !item.disabled);
  }
  // 当前菜单是否为单选
  get isSingle() {
    return this.selects === "single";
  }
  // 当前菜单是否为多选
  get isMultiple() {
    return this.selects === "multiple";
  }
  // 当前菜单是否可选择
  get isSelectable() {
    return this.isSingle || this.isMultiple;
  }
  // 当前菜单是否为子菜单
  get isSubmenu() {
    return !$(this).parent().length;
  }
  // 最深层级的子菜单中，最后交互过的 menu-item
  get lastActiveItem() {
    const index = this.lastActiveItems.length ? this.lastActiveItems.length - 1 : 0;
    return this.lastActiveItems[index];
  }
  set lastActiveItem(item) {
    const index = this.lastActiveItems.length ? this.lastActiveItems.length - 1 : 0;
    this.lastActiveItems[index] = item;
  }
  async onSlotChange() {
    await this.definedController.whenDefined();
    this.items.forEach((item) => {
      item.dense = this.dense;
      item.selects = this.selects;
      item.submenuTrigger = this.submenuTrigger;
      item.submenuOpenDelay = this.submenuOpenDelay;
      item.submenuCloseDelay = this.submenuCloseDelay;
    });
  }
  async onSelectsChange() {
    if (!this.isSelectable) {
      this.setSelectedKeys([]);
    } else if (this.isSingle) {
      this.setSelectedKeys(this.selectedKeys.slice(0, 1));
    }
    await this.onSelectedKeysChange();
  }
  async onSelectedKeysChange() {
    await this.definedController.whenDefined();
    const values = this.itemsEnabled.filter((item) => this.selectedKeys.includes(item.key)).map((item) => item.value);
    const value = this.isMultiple ? values : values[0] || void 0;
    this.setValue(value);
    if (!this.isInitial) {
      this.emit("change");
    }
  }
  async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();
    if (!this.isSelectable) {
      this.updateSelected();
      return;
    }
    const values = (this.isSingle ? [this.value] : (
      // 多选时，传入的值可能是字符串（通过 attribute 属性设置）；或字符串数组（通过 property 属性设置）
      isString(this.value) ? [this.value] : this.value
    )).filter((i) => i);
    if (!values.length) {
      this.setSelectedKeys([]);
    } else if (this.isSingle) {
      const firstItem = this.itemsEnabled.find((item) => item.value === values[0]);
      this.setSelectedKeys(firstItem ? [firstItem.key] : []);
    } else if (this.isMultiple) {
      this.setSelectedKeys(this.itemsEnabled.filter((item) => values.includes(item.value)).map((item) => item.key));
    }
    this.updateSelected();
    this.updateFocusable();
  }
  /**
   * 将焦点设置在当前元素上
   */
  focus(options) {
    if (this.lastActiveItem) {
      this.focusOne(this.lastActiveItem, options);
    }
  }
  /**
   * 从当前元素中移除焦点
   */
  blur() {
    if (this.lastActiveItem) {
      this.lastActiveItem.blur();
    }
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.definedController.whenDefined().then(() => {
      this.updateFocusable();
      this.lastActiveItem = this.items.find((item) => item.focusable);
    });
    this.addEventListener("submenu-open", (e) => {
      const $parentItem = $(e.target);
      const submenuItemsEnabled = $parentItem.children("mdui-menu-item:not([disabled])").get();
      const submenuLevel = $parentItem.parents("mdui-menu-item").length + 1;
      if (submenuItemsEnabled.length) {
        this.lastActiveItems[submenuLevel] = submenuItemsEnabled[0];
        this.updateFocusable();
        this.focusOne(this.lastActiveItems[submenuLevel]);
      }
    });
    this.addEventListener("submenu-close", (e) => {
      const $parentItem = $(e.target);
      const submenuLevel = $parentItem.parents("mdui-menu-item").length + 1;
      if (this.lastActiveItems.length - 1 === submenuLevel) {
        this.lastActiveItems.pop();
        this.updateFocusable();
        if (this.lastActiveItems[submenuLevel - 1]) {
          this.focusOne(this.lastActiveItems[submenuLevel - 1]);
        }
      }
    });
  }
  render() {
    return html`<slot @slotchange="${this.onSlotChange}" @click="${this.onClick}" @keydown="${this.onKeyDown}"></slot>`;
  }
  setSelectedKeys(selectedKeys) {
    if (!arraysEqualIgnoreOrder(this.selectedKeys, selectedKeys)) {
      this.selectedKeys = selectedKeys;
    }
  }
  setValue(value) {
    if (this.isSingle || isUndefined(this.value) || isUndefined(value)) {
      this.value = value;
    } else if (!arraysEqualIgnoreOrder(this.value, value)) {
      this.value = value;
    }
  }
  // 获取和指定菜单项同级的所有菜单项
  getSiblingsItems(item, onlyEnabled = false) {
    return $(item).parent().children(`mdui-menu-item${onlyEnabled ? ":not([disabled])" : ""}`).get();
  }
  // 更新 menu-item 的可聚焦状态
  updateFocusable() {
    if (this.lastActiveItem) {
      this.items.forEach((item) => {
        item.focusable = item.key === this.lastActiveItem.key;
      });
      return;
    }
    if (!this.selectedKeys.length) {
      this.itemsEnabled.forEach((item, index) => {
        item.focusable = !index;
      });
      return;
    }
    if (this.isSingle) {
      this.items.forEach((item) => {
        item.focusable = this.selectedKeys.includes(item.key);
      });
      return;
    }
    if (this.isMultiple) {
      const focusableItem = this.items.find((item) => item.focusable);
      if (!focusableItem?.key || !this.selectedKeys.includes(focusableItem.key)) {
        this.itemsEnabled.filter((item) => this.selectedKeys.includes(item.key)).forEach((item, index) => item.focusable = !index);
      }
    }
  }
  updateSelected() {
    this.items.forEach((item) => {
      item.selected = this.selectedKeys.includes(item.key);
    });
  }
  // 切换一个菜单项的选中状态
  selectOne(item) {
    if (this.isMultiple) {
      const selectedKeys = [...this.selectedKeys];
      if (selectedKeys.includes(item.key)) {
        selectedKeys.splice(selectedKeys.indexOf(item.key), 1);
      } else {
        selectedKeys.push(item.key);
      }
      this.setSelectedKeys(selectedKeys);
    }
    if (this.isSingle) {
      if (this.selectedKeys.includes(item.key)) {
        this.setSelectedKeys([]);
      } else {
        this.setSelectedKeys([item.key]);
      }
    }
    this.isInitial = false;
    this.updateSelected();
  }
  // 使一个 menu-item 可聚焦
  async focusableOne(item) {
    this.items.forEach((_item) => _item.focusable = _item.key === item.key);
    await delay();
  }
  // 聚焦一个 menu-item
  focusOne(item, options) {
    item.focus(options);
  }
  async onClick(event) {
    if (!this.definedController.isDefined()) {
      return;
    }
    if (this.isSubmenu) {
      return;
    }
    if (event.button) {
      return;
    }
    const target = event.target;
    const item = target.closest("mdui-menu-item");
    if (!item || item.disabled) {
      return;
    }
    this.lastActiveItem = item;
    if (this.isSelectable && item.value) {
      this.selectOne(item);
    }
    await this.focusableOne(item);
    this.focusOne(item);
  }
  async onKeyDown(event) {
    if (!this.definedController.isDefined()) {
      return;
    }
    if (this.isSubmenu) {
      return;
    }
    const item = event.target;
    if (event.key === "Enter") {
      event.preventDefault();
      item.click();
    }
    if (event.key === " ") {
      event.preventDefault();
      if (this.isSelectable && item.value) {
        this.selectOne(item);
        await this.focusableOne(item);
        this.focusOne(item);
      }
    }
    if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      const items = this.getSiblingsItems(item, true);
      const activeItem = items.find((item2) => item2.focusable);
      let index = activeItem ? items.indexOf(activeItem) : 0;
      if (items.length > 0) {
        event.preventDefault();
        if (event.key === "ArrowDown") {
          index++;
        } else if (event.key === "ArrowUp") {
          index--;
        } else if (event.key === "Home") {
          index = 0;
        } else if (event.key === "End") {
          index = items.length - 1;
        }
        if (index < 0) {
          index = items.length - 1;
        }
        if (index > items.length - 1) {
          index = 0;
        }
        this.lastActiveItem = items[index];
        await this.focusableOne(items[index]);
        this.focusOne(items[index]);
        return;
      }
    }
  }
};
Menu.styles = [componentStyle, menuStyle];
__decorate([
  property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
], Menu.prototype, "selects", void 0);
__decorate([
  property()
], Menu.prototype, "value", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Menu.prototype, "dense", void 0);
__decorate([
  property({ reflect: true, attribute: "submenu-trigger" })
], Menu.prototype, "submenuTrigger", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "submenu-open-delay" })
], Menu.prototype, "submenuOpenDelay", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "submenu-close-delay" })
], Menu.prototype, "submenuCloseDelay", void 0);
__decorate([
  state()
], Menu.prototype, "selectedKeys", void 0);
__decorate([
  queryAssignedElements({ flatten: true, selector: "mdui-menu-item" })
], Menu.prototype, "childrenItems", void 0);
__decorate([
  watch("dense"),
  watch("selects"),
  watch("submenuTrigger"),
  watch("submenuOpenDelay"),
  watch("submenuCloseDelay")
], Menu.prototype, "onSlotChange", null);
__decorate([
  watch("selects", true)
], Menu.prototype, "onSelectsChange", null);
__decorate([
  watch("selectedKeys", true)
], Menu.prototype, "onSelectedKeysChange", null);
__decorate([
  watch("value")
], Menu.prototype, "onValueChange", null);
Menu = __decorate([
  customElement("mdui-menu")
], Menu);

// node_modules/mdui/components/navigation-bar/navigation-bar-item-style.js
var navigationBarItemStyle = css`:host{--shape-corner-indicator:var(--mdui-shape-corner-full);position:relative;z-index:0;flex:1;overflow:hidden;min-width:3rem;--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface-variant)}.container{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-decoration:none;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;padding-top:.75rem;padding-bottom:.75rem}.container:not(.initial){transition:padding var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}mdui-ripple{z-index:1;left:50%;transform:translateX(-50%);width:4rem;height:2rem;margin-top:.75rem;border-radius:var(--mdui-shape-corner-full)}mdui-ripple:not(.initial){transition:margin-top var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}.indicator{position:relative;display:flex;align-items:center;justify-content:center;background-color:transparent;border-radius:var(--shape-corner-indicator);height:2rem;width:2rem}:not(.initial) .indicator{transition:background-color var(--mdui-motion-duration-short1) var(--mdui-motion-easing-standard),width var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}::slotted([slot=badge]){position:absolute;transform:translate(50%,-50%)}::slotted([slot=badge][variant=small]){transform:translate(.5625rem,-.5625rem)}.active-icon,.icon{color:rgb(var(--mdui-color-on-surface-variant));font-size:1.5rem}.active-icon mdui-icon,.icon mdui-icon,::slotted([slot=active]),::slotted([slot=icon]){font-size:inherit}.icon{display:flex}.active-icon{display:none}.label{display:flex;align-items:center;height:1rem;color:rgb(var(--mdui-color-on-surface-variant));margin-top:.25rem;margin-bottom:.25rem;font-size:var(--mdui-typescale-label-medium-size);font-weight:var(--mdui-typescale-label-medium-weight);letter-spacing:var(--mdui-typescale-label-medium-tracking);line-height:var(--mdui-typescale-label-medium-line-height)}:not(.initial) .label{transition:opacity var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear)}:host(:not([active])) mdui-ripple.label-visibility-selected,mdui-ripple.label-visibility-unlabeled{margin-top:1.5rem}.container.label-visibility-unlabeled,:host(:not([active])) .container.label-visibility-selected{padding-top:1.5rem;padding-bottom:0}.container.label-visibility-unlabeled .label,:host(:not([active])) .container.label-visibility-selected .label{opacity:0}:host([active]){--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([active]) .indicator{width:4rem;background-color:rgb(var(--mdui-color-secondary-container))}:host([active]) .active-icon,:host([active]) .icon{color:rgb(var(--mdui-color-on-secondary-container))}:host([active]) .has-active-icon .active-icon{display:flex}:host([active]) .has-active-icon .icon{display:none}:host([active]) .label{color:rgb(var(--mdui-color-on-surface))}`;

// node_modules/mdui/components/navigation-bar/navigation-bar-item.js
var NavigationBarItem = class NavigationBarItem2 extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
  constructor() {
    super(...arguments);
    this.isInitial = true;
    this.active = false;
    this.disabled = false;
    this.key = uniqueId();
    this.rippleRef = createRef();
    this.hasSlotController = new HasSlotController(this, "active-icon");
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.disabled;
  }
  get focusElement() {
    return this.href ? this.renderRoot?.querySelector("._a") : this;
  }
  get focusDisabled() {
    return this.disabled;
  }
  render() {
    const labelVisibilityClassName = cc({
      "label-visibility-selected": this.labelVisibility === "selected",
      "label-visibility-labeled": this.labelVisibility === "labeled",
      "label-visibility-unlabeled": this.labelVisibility === "unlabeled",
      initial: this.isInitial
    });
    const className2 = cc([
      {
        container: true,
        "has-active-icon": this.activeIcon || this.hasSlotController.test("active-icon")
      },
      labelVisibilityClassName
    ]);
    return html`<mdui-ripple .noRipple="${!this.active || this.noRipple}" class="${labelVisibilityClassName}" ${ref(this.rippleRef)}></mdui-ripple>${this.href ? this.renderAnchor({
      part: "container",
      className: className2,
      content: this.renderInner()
    }) : html`<div part="container" class="${className2}">${this.renderInner()}</div>`}`;
  }
  renderInner() {
    return html`<div part="indicator" class="indicator"><slot name="badge" part="badge" class="badge"></slot><slot name="active-icon" part="active-icon" class="active-icon">${this.activeIcon ? html`<mdui-icon name="${this.activeIcon}"></mdui-icon>` : nothingTemplate}</slot><slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}"></mdui-icon>` : nothingTemplate}</slot></div><slot part="label" class="label"></slot>`;
  }
};
NavigationBarItem.styles = [
  componentStyle,
  navigationBarItemStyle
];
__decorate([
  property({ reflect: true })
], NavigationBarItem.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "active-icon" })
], NavigationBarItem.prototype, "activeIcon", void 0);
__decorate([
  property({ reflect: true })
], NavigationBarItem.prototype, "value", void 0);
__decorate([
  state()
], NavigationBarItem.prototype, "labelVisibility", void 0);
__decorate([
  state()
], NavigationBarItem.prototype, "isInitial", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationBarItem.prototype, "active", void 0);
__decorate([
  state()
], NavigationBarItem.prototype, "disabled", void 0);
NavigationBarItem = __decorate([
  customElement("mdui-navigation-bar-item")
], NavigationBarItem);

// node_modules/mdui/components/navigation-bar/navigation-bar-style.js
var navigationBarStyle = css`:host{--shape-corner:var(--mdui-shape-corner-none);--z-index:2000;position:fixed;right:0;bottom:0;left:0;display:flex;flex:0 0 auto;overflow:hidden;border-radius:var(--shape-corner) var(--shape-corner) 0 0;z-index:var(--z-index);transition-property:transform;transition-duration:var(--mdui-motion-duration-long2);transition-timing-function:var(--mdui-motion-easing-emphasized);height:5rem;background-color:rgb(var(--mdui-color-surface));box-shadow:var(--mdui-elevation-level2)}:host([scroll-target]:not([scroll-target=''])){position:absolute}:host([hide]:not([hide=false i])){transform:translateY(5.625rem);transition-duration:var(--mdui-motion-duration-short4)}`;

// node_modules/mdui/components/navigation-bar/navigation-bar.js
var NavigationBar = class NavigationBar2 extends ScrollBehaviorMixin(LayoutItemBase) {
  constructor() {
    super(...arguments);
    this.hide = false;
    this.labelVisibility = "auto";
    this.activeKey = 0;
    this.isInitial = true;
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-navigation-bar-item"]
    });
  }
  get scrollPaddingPosition() {
    return "bottom";
  }
  get layoutPlacement() {
    return "bottom";
  }
  async onActiveKeyChange() {
    await this.definedController.whenDefined();
    const item = this.items.find((item2) => item2.key === this.activeKey);
    this.value = item?.value;
    if (!this.isInitial) {
      this.emit("change");
    }
  }
  async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();
    const item = this.items.find((item2) => item2.value === this.value);
    this.activeKey = item?.key ?? 0;
    this.updateItems();
  }
  async onLabelVisibilityChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.addEventListener("transitionend", (event) => {
      if (event.target === this) {
        this.emit(this.hide ? "hidden" : "shown");
      }
    });
  }
  render() {
    return html`<slot @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot>`;
  }
  /**
   * 滚动行为
   * 当前仅支持 hide 这一个行为，所以不做行为类型判断
   */
  runScrollThreshold(isScrollingUp) {
    if (!isScrollingUp && !this.hide) {
      const eventProceeded = this.emit("hide", { cancelable: true });
      if (eventProceeded) {
        this.hide = true;
      }
    }
    if (isScrollingUp && this.hide) {
      const eventProceeded = this.emit("show", { cancelable: true });
      if (eventProceeded) {
        this.hide = false;
      }
    }
  }
  onClick(event) {
    if (event.button) {
      return;
    }
    const target = event.target;
    const item = target.closest("mdui-navigation-bar-item");
    if (!item) {
      return;
    }
    this.activeKey = item.key;
    this.isInitial = false;
    this.updateItems();
  }
  // 更新 <mdui-navigation-bar-item> 的状态
  updateItems() {
    const items = this.items;
    const labelVisibility = this.labelVisibility === "auto" ? items.length <= 3 ? "labeled" : "selected" : this.labelVisibility;
    items.forEach((item) => {
      item.active = this.activeKey === item.key;
      item.labelVisibility = labelVisibility;
      item.isInitial = this.isInitial;
    });
  }
  async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }
};
NavigationBar.styles = [
  componentStyle,
  navigationBarStyle
];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationBar.prototype, "hide", void 0);
__decorate([
  property({ reflect: true, attribute: "label-visibility" })
], NavigationBar.prototype, "labelVisibility", void 0);
__decorate([
  property({ reflect: true })
], NavigationBar.prototype, "value", void 0);
__decorate([
  property({ reflect: true, attribute: "scroll-behavior" })
], NavigationBar.prototype, "scrollBehavior", void 0);
__decorate([
  state()
], NavigationBar.prototype, "activeKey", void 0);
__decorate([
  queryAssignedElements({
    selector: "mdui-navigation-bar-item",
    flatten: true
  })
], NavigationBar.prototype, "items", void 0);
__decorate([
  watch("activeKey", true)
], NavigationBar.prototype, "onActiveKeyChange", null);
__decorate([
  watch("value")
], NavigationBar.prototype, "onValueChange", null);
__decorate([
  watch("labelVisibility", true)
], NavigationBar.prototype, "onLabelVisibilityChange", null);
NavigationBar = __decorate([
  customElement("mdui-navigation-bar")
], NavigationBar);

// node_modules/@mdui/shared/helpers/breakpoint.js
var breakpoint = (width) => {
  const window2 = getWindow();
  const document3 = getDocument();
  const computedStyle = window2.getComputedStyle(document3.documentElement);
  const containerWidth = isElement(width) ? $(width).innerWidth() : isNumber(width) ? width : $(window2).innerWidth();
  const getBreakpointValue = (breakpoint2) => {
    const width2 = computedStyle.getPropertyValue(`--mdui-breakpoint-${breakpoint2}`).toLowerCase();
    return parseFloat(width2);
  };
  const getNextBreakpoint = (breakpoint2) => {
    switch (breakpoint2) {
      case "xs":
        return "sm";
      case "sm":
        return "md";
      case "md":
        return "lg";
      case "lg":
        return "xl";
      case "xl":
        return "xxl";
    }
  };
  return {
    /**
     * 当前宽度是否大于指定断点值
     * @param breakpoint
     */
    up(breakpoint2) {
      return containerWidth >= getBreakpointValue(breakpoint2);
    },
    /**
     * 当前宽度是否小于指定断点值
     * @param breakpoint
     */
    down(breakpoint2) {
      return containerWidth < getBreakpointValue(breakpoint2);
    },
    /**
     * 当前宽度是否在指定断点值内
     * @param breakpoint
     */
    only(breakpoint2) {
      if (breakpoint2 === "xxl") {
        return this.up(breakpoint2);
      } else {
        return this.up(breakpoint2) && this.down(getNextBreakpoint(breakpoint2));
      }
    },
    /**
     * 当前宽度是否不在指定断点值内
     * @param breakpoint
     */
    not(breakpoint2) {
      return !this.only(breakpoint2);
    },
    /**
     * 当前宽度是否在指定断点值之间
     * @param startBreakpoint
     * @param endBreakpoint
     * @returns
     */
    between(startBreakpoint, endBreakpoint) {
      return this.up(startBreakpoint) && this.down(endBreakpoint);
    }
  };
};

// node_modules/mdui/components/navigation-drawer/style.js
var style18 = css`:host{--shape-corner:var(--mdui-shape-corner-large);--z-index:2200;display:none;position:fixed;top:0;bottom:0;left:0;z-index:1;width:22.5rem}:host([placement=right]){left:initial;right:0}:host([mobile]),:host([modal]:not([modal=false i])){top:0!important;right:0;bottom:0!important;width:initial;z-index:var(--z-index)}:host([placement=right][mobile]),:host([placement=right][modal]:not([modal=false i])){left:0}:host([contained]:not([contained=false i])){position:absolute}.overlay{position:absolute;inset:0;z-index:inherit;background-color:rgba(var(--mdui-color-scrim),.4)}.panel{display:block;position:absolute;top:0;bottom:0;left:0;width:100%;overflow:auto;z-index:inherit;background-color:rgb(var(--mdui-color-surface));box-shadow:var(--mdui-elevation-level0)}:host([placement=right]) .panel{left:initial;right:0}:host([mobile]) .panel,:host([modal]:not([modal=false i])) .panel{border-radius:0 var(--shape-corner) var(--shape-corner) 0;max-width:80%;width:22.5rem;background-color:rgb(var(--mdui-color-surface-container-low));box-shadow:var(--mdui-elevation-level1)}:host([placement=right][mobile]) .panel,:host([placement=right][modal]:not([modal=false i])) .panel{border-radius:var(--shape-corner) 0 0 var(--shape-corner)}`;

// node_modules/mdui/components/navigation-drawer/index.js
var NavigationDrawer = class NavigationDrawer2 extends LayoutItemBase {
  constructor() {
    super(...arguments);
    this.open = false;
    this.modal = false;
    this.closeOnEsc = false;
    this.closeOnOverlayClick = false;
    this.placement = "left";
    this.contained = false;
    this.mobile = false;
    this.overlayRef = createRef();
    this.panelRef = createRef();
    this.definedController = new DefinedController(this, {
      needDomReady: true
    });
  }
  get layoutPlacement() {
    return this.placement;
  }
  get lockTarget() {
    return this.contained || this.isParentLayout ? this.parentElement : document.documentElement;
  }
  get isModal() {
    return this.mobile || this.modal;
  }
  // contained 变更后，修改监听尺寸变化的元素。为 true 时，监听父元素；为 false 时，监听 body
  async onContainedChange() {
    await this.definedController.whenDefined();
    this.observeResize?.unobserve();
    this.setObserveResize();
  }
  onPlacementChange() {
    if (this.isParentLayout) {
      this.layoutManager.updateLayout(this);
    }
  }
  async onMobileChange() {
    if (!this.open || this.isParentLayout || this.contained) {
      return;
    }
    await this.definedController.whenDefined();
    if (this.isModal) {
      lockScreen(this, this.lockTarget);
      await this.getLockTargetAnimate(false, 0);
    } else {
      unlockScreen(this, this.lockTarget);
      await this.getLockTargetAnimate(true, 0);
    }
  }
  async onOpenChange() {
    let panel = this.panelRef.value;
    let overlay = this.overlayRef.value;
    const isRight = this.placement === "right";
    const easingLinear = getEasing(this, "linear");
    const easingEmphasized = getEasing(this, "emphasized");
    const setLayoutTransition = (duration, easing) => {
      $(this.layoutManager.getItemsAndMain()).css("transition", isNull(duration) ? null : `all ${duration}ms ${easing}`);
    };
    const stopOldAnimations = async () => {
      const elements = [];
      if (this.isModal) {
        elements.push(overlay, panel);
      } else if (!this.isParentLayout) {
        elements.push(this.lockTarget);
      }
      if (this.isParentLayout) {
        const layoutItems = this.layoutManager.getItemsAndMain();
        const layoutIndex = layoutItems.indexOf(this);
        elements.push(...layoutItems.slice(layoutIndex));
      }
      if (!this.isModal && !elements.includes(this)) {
        elements.push(this);
      }
      await Promise.all(elements.map((element) => stopAnimations(element)));
    };
    if (this.open) {
      const hasUpdated = this.hasUpdated;
      if (!hasUpdated) {
        await this.updateComplete;
        panel = this.panelRef.value;
        overlay = this.overlayRef.value;
      }
      if (hasUpdated) {
        const eventProceeded = this.emit("open", { cancelable: true });
        if (!eventProceeded) {
          return;
        }
      }
      await this.definedController.whenDefined();
      this.style.display = "block";
      this.originalTrigger = document.activeElement;
      if (this.isModal) {
        this.modalHelper.activate();
        if (!this.contained) {
          lockScreen(this, this.lockTarget);
        }
      }
      await stopOldAnimations();
      requestAnimationFrame(() => {
        const autoFocusTarget = this.querySelector("[autofocus]");
        if (autoFocusTarget) {
          autoFocusTarget.focus({ preventScroll: true });
        } else {
          panel.focus({ preventScroll: true });
        }
      });
      const duration = getDuration(this, "long2");
      const animations = [];
      if (this.isModal) {
        animations.push(animateTo(overlay, [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear
        }));
      } else if (!this.isParentLayout) {
        animations.push(this.getLockTargetAnimate(true, hasUpdated ? duration : 0));
      }
      if (this.isParentLayout && hasUpdated) {
        setLayoutTransition(duration, easingEmphasized);
        this.layoutManager.updateLayout(this);
      }
      animations.push(animateTo(this.isModal ? panel : this, [
        { transform: `translateX(${isRight ? "" : "-"}100%)` },
        { transform: "translateX(0)" }
      ], {
        duration: hasUpdated ? duration : 0,
        easing: easingEmphasized
      }));
      await Promise.all(animations);
      if (!this.open) {
        return;
      }
      if (this.isParentLayout && hasUpdated) {
        setLayoutTransition(null);
      }
      if (hasUpdated) {
        this.emit("opened");
      }
    } else if (this.hasUpdated) {
      const eventProceeded = this.emit("close", { cancelable: true });
      if (!eventProceeded) {
        return;
      }
      await this.definedController.whenDefined();
      if (this.isModal) {
        this.modalHelper.deactivate();
      }
      await stopOldAnimations();
      const duration = getDuration(this, "short4");
      const animations = [];
      if (this.isModal) {
        animations.push(animateTo(overlay, [{ opacity: 1 }, { opacity: 0 }], {
          duration,
          easing: easingLinear
        }));
      } else if (!this.isParentLayout) {
        animations.push(this.getLockTargetAnimate(false, duration));
      }
      if (this.isParentLayout) {
        setLayoutTransition(duration, easingEmphasized);
        this.layoutManager.updateLayout(this, { width: 0 });
      }
      animations.push(animateTo(this.isModal ? panel : this, [
        { transform: "translateX(0)" },
        { transform: `translateX(${isRight ? "" : "-"}100%)` }
      ], { duration, easing: easingEmphasized }));
      await Promise.all(animations);
      if (this.open) {
        return;
      }
      if (this.isParentLayout) {
        setLayoutTransition(null);
      }
      this.style.display = "none";
      if (this.isModal && !this.contained) {
        unlockScreen(this, this.lockTarget);
      }
      const trigger = this.originalTrigger;
      if (isFunction(trigger?.focus)) {
        setTimeout(() => trigger.focus());
      }
      this.emit("closed");
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.modalHelper = new Modal(this);
    this.definedController.whenDefined().then(() => {
      this.setObserveResize();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unlockScreen(this, this.lockTarget);
    this.observeResize?.unobserve();
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.addEventListener("keydown", (event) => {
      if (this.open && this.closeOnEsc && event.key === "Escape" && this.isModal) {
        event.stopPropagation();
        this.open = false;
      }
    });
  }
  render() {
    return html`${when(this.isModal, () => html`<div ${ref(this.overlayRef)} part="overlay" class="overlay" @click="${this.onOverlayClick}"></div>`)}<slot ${ref(this.panelRef)} part="panel" class="panel" tabindex="0"></slot>`;
  }
  setObserveResize() {
    this.observeResize = observeResize(this.contained ? this.parentElement : document.documentElement, () => {
      const target = this.contained ? this.parentElement : void 0;
      this.mobile = breakpoint(target).down("md");
      if (this.isParentLayout) {
        this.layoutManager.updateLayout(this, {
          width: this.isModal ? 0 : void 0
        });
      }
    });
  }
  onOverlayClick() {
    this.emit("overlay-click");
    if (this.closeOnOverlayClick) {
      this.open = false;
    }
  }
  getLockTargetAnimate(open, duration) {
    const paddingName = this.placement === "right" ? "paddingRight" : "paddingLeft";
    const panelWidth = $(this.panelRef.value).innerWidth() + "px";
    return animateTo(this.lockTarget, [
      { [paddingName]: open ? 0 : panelWidth },
      { [paddingName]: open ? panelWidth : 0 }
    ], {
      duration,
      easing: getEasing(this, "emphasized"),
      fill: "forwards"
    });
  }
};
NavigationDrawer.styles = [componentStyle, style18];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationDrawer.prototype, "open", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationDrawer.prototype, "modal", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "close-on-esc"
  })
], NavigationDrawer.prototype, "closeOnEsc", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "close-on-overlay-click"
  })
], NavigationDrawer.prototype, "closeOnOverlayClick", void 0);
__decorate([
  property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
], NavigationDrawer.prototype, "placement", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationDrawer.prototype, "contained", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationDrawer.prototype, "mobile", void 0);
__decorate([
  watch("contained", true)
], NavigationDrawer.prototype, "onContainedChange", null);
__decorate([
  watch("placement", true)
], NavigationDrawer.prototype, "onPlacementChange", null);
__decorate([
  watch("mobile", true),
  watch("modal", true)
], NavigationDrawer.prototype, "onMobileChange", null);
__decorate([
  watch("open")
], NavigationDrawer.prototype, "onOpenChange", null);
NavigationDrawer = __decorate([
  customElement("mdui-navigation-drawer")
], NavigationDrawer);

// node_modules/mdui/components/navigation-rail/navigation-rail-style.js
var navigationRailStyle = css`:host{--shape-corner:var(--mdui-shape-corner-none);--z-index:2000;position:fixed;top:0;bottom:0;left:0;display:flex;flex-direction:column;align-items:center;border-radius:0 var(--shape-corner) var(--shape-corner) 0;z-index:var(--z-index);width:5rem;background-color:rgb(var(--mdui-color-surface));padding:.375rem .75rem}:host([contained]:not([contained=false i])){position:absolute}:host([divider]:not([divider=false i])){border-right:.0625rem solid rgb(var(--mdui-color-surface-variant));width:5.0625rem}:host([placement=right]){left:initial;right:0;border-radius:var(--shape-corner) 0 0 var(--shape-corner)}:host([placement=right][divider]:not([divider=false i])){border-right:none;border-left:.0625rem solid rgb(var(--mdui-color-surface-variant))}.bottom,.items,.top{display:flex;flex-direction:column;align-items:center;width:100%}.top{margin-bottom:1.75rem}.bottom{margin-top:1.75rem}::slotted([slot=bottom]),::slotted([slot=top]),::slotted(mdui-navigation-rail-item){margin-top:.375rem;margin-bottom:.375rem}:host([alignment=start]) .top-spacer{flex-grow:0}:host([alignment=start]) .bottom-spacer{flex-grow:1}:host([alignment=end]) .top-spacer{flex-grow:1}:host([alignment=end]) .bottom-spacer{flex-grow:0}:host([alignment=center]){justify-content:center}:host([alignment=center]) .bottom,:host([alignment=center]) .top{position:absolute}:host([alignment=center]) .top{top:.375rem}:host([alignment=center]) .bottom{bottom:.375rem}`;

// node_modules/mdui/components/navigation-rail/navigation-rail.js
var NavigationRail = class NavigationRail2 extends LayoutItemBase {
  constructor() {
    super(...arguments);
    this.placement = "left";
    this.alignment = "start";
    this.contained = false;
    this.divider = false;
    this.activeKey = 0;
    this.hasSlotController = new HasSlotController(this, "top", "bottom");
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-navigation-rail-item"]
    });
    this.isInitial = true;
  }
  get layoutPlacement() {
    return this.placement;
  }
  get parentTarget() {
    return this.contained || this.isParentLayout ? this.parentElement : document.body;
  }
  get isRight() {
    return this.placement === "right";
  }
  get paddingValue() {
    return ["fixed", "absolute"].includes($(this).css("position")) ? this.offsetWidth : void 0;
  }
  async onActiveKeyChange() {
    await this.definedController.whenDefined();
    const item = this.items.find((item2) => item2.key === this.activeKey);
    this.value = item?.value;
    if (!this.isInitial) {
      this.emit("change");
    }
  }
  async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();
    const item = this.items.find((item2) => item2.value === this.value);
    this.activeKey = item?.key ?? 0;
    this.updateItems();
  }
  async onContainedChange() {
    if (this.isParentLayout) {
      return;
    }
    await this.definedController.whenDefined();
    $(document.body).css({
      paddingLeft: this.contained || this.isRight ? null : this.paddingValue,
      paddingRight: this.contained || !this.isRight ? null : this.paddingValue
    });
    $(this.parentElement).css({
      paddingLeft: this.contained && !this.isRight ? this.paddingValue : null,
      paddingRight: this.contained && this.isRight ? this.paddingValue : null
    });
  }
  async onPlacementChange() {
    await this.definedController.whenDefined();
    this.layoutManager?.updateLayout(this);
    this.items.forEach((item) => {
      item.placement = this.placement;
    });
    if (!this.isParentLayout) {
      $(this.parentTarget).css({
        paddingLeft: this.isRight ? null : this.paddingValue,
        paddingRight: this.isRight ? this.paddingValue : null
      });
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.isParentLayout) {
      this.definedController.whenDefined().then(() => {
        $(this.parentTarget).css({
          paddingLeft: this.isRight ? null : this.paddingValue,
          paddingRight: this.isRight ? this.paddingValue : null
        });
      });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (!this.isParentLayout && this.definedController.isDefined()) {
      $(this.parentTarget).css({
        paddingLeft: this.isRight ? void 0 : null,
        paddingRight: this.isRight ? null : void 0
      });
    }
  }
  render() {
    const hasTopSlot = this.hasSlotController.test("top");
    const hasBottomSlot = this.hasSlotController.test("bottom");
    return html`${when(hasTopSlot, () => html`<slot name="top" part="top" class="top"></slot>`)} <span class="top-spacer"></span><slot part="items" class="items" @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot><span class="bottom-spacer"></span> ${when(hasBottomSlot, () => html`<slot name="bottom" part="bottom" class="bottom"></slot>`)}`;
  }
  onClick(event) {
    if (event.button) {
      return;
    }
    const target = event.target;
    const item = target.closest("mdui-navigation-rail-item");
    if (!item) {
      return;
    }
    this.activeKey = item.key;
    this.isInitial = false;
    this.updateItems();
  }
  updateItems() {
    this.items.forEach((item) => {
      item.active = this.activeKey === item.key;
      item.placement = this.placement;
      item.isInitial = this.isInitial;
    });
  }
  async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }
};
NavigationRail.styles = [
  componentStyle,
  navigationRailStyle
];
__decorate([
  property({ reflect: true })
], NavigationRail.prototype, "value", void 0);
__decorate([
  property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
], NavigationRail.prototype, "placement", void 0);
__decorate([
  property({ reflect: true })
], NavigationRail.prototype, "alignment", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationRail.prototype, "contained", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationRail.prototype, "divider", void 0);
__decorate([
  state()
], NavigationRail.prototype, "activeKey", void 0);
__decorate([
  queryAssignedElements({
    selector: "mdui-navigation-rail-item",
    flatten: true
  })
], NavigationRail.prototype, "items", void 0);
__decorate([
  watch("activeKey", true)
], NavigationRail.prototype, "onActiveKeyChange", null);
__decorate([
  watch("value")
], NavigationRail.prototype, "onValueChange", null);
__decorate([
  watch("contained", true)
], NavigationRail.prototype, "onContainedChange", null);
__decorate([
  watch("placement", true)
], NavigationRail.prototype, "onPlacementChange", null);
NavigationRail = __decorate([
  customElement("mdui-navigation-rail")
], NavigationRail);

// node_modules/mdui/components/navigation-rail/navigation-rail-item-style.js
var navigationRailItemStyle = css`:host{--shape-corner-indicator:var(--mdui-shape-corner-full);position:relative;z-index:0;width:100%;--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface-variant)}.container{display:flex;flex-direction:column;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;height:3.5rem}.container:not(.initial){transition:padding var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}mdui-ripple{z-index:1;width:3.5rem;height:2rem;border-radius:var(--mdui-shape-corner-full)}.container:not(.has-label)+mdui-ripple{height:3.5rem}.indicator{position:relative;display:flex;align-items:center;justify-content:center;background-color:transparent;border-radius:var(--shape-corner-indicator);height:2rem;width:2rem}:not(.initial) .indicator{transition:background-color var(--mdui-motion-duration-short1) var(--mdui-motion-easing-standard),width var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard),height var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}::slotted([slot=badge]){position:absolute;transform:translate(50%,-50%)}.placement-right::slotted([slot=badge]){transform:translate(-50%,-50%)}::slotted([slot=badge][variant=small]){transform:translate(.5625rem,-.5625rem)}.placement-right::slotted([slot=badge][variant=small]){transform:translate(-.5625rem,-.5625rem)}.active-icon,.icon{color:rgb(var(--mdui-color-on-surface-variant));font-size:1.5rem}.active-icon mdui-icon,.icon mdui-icon,::slotted([slot=active-icon]),::slotted([slot=icon]){font-size:inherit}.icon{display:flex}.active-icon{display:none}.label{display:flex;align-items:center;height:1rem;color:rgb(var(--mdui-color-on-surface-variant));margin-top:.25rem;margin-bottom:.25rem;font-size:var(--mdui-typescale-label-medium-size);font-weight:var(--mdui-typescale-label-medium-weight);letter-spacing:var(--mdui-typescale-label-medium-tracking);line-height:var(--mdui-typescale-label-medium-line-height)}:not(.initial) .label{transition:opacity var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear)}:host([active]){--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([active]) .indicator{width:3.5rem;background-color:rgb(var(--mdui-color-secondary-container))}:host([active]) :not(.has-label) .indicator{height:3.5rem}:host([active]) .active-icon,:host([active]) .icon{color:rgb(var(--mdui-color-on-secondary-container))}:host([active]) .has-active-icon .active-icon{display:flex}:host([active]) .has-active-icon .icon{display:none}:host([active]) .label{color:rgb(var(--mdui-color-on-surface))}`;

// node_modules/mdui/components/navigation-rail/navigation-rail-item.js
var NavigationRailItem = class NavigationRailItem2 extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
  constructor() {
    super(...arguments);
    this.active = false;
    this.isInitial = true;
    this.placement = "left";
    this.disabled = false;
    this.key = uniqueId();
    this.rippleRef = createRef();
    this.hasSlotController = new HasSlotController(this, "[default]", "active-icon");
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.disabled;
  }
  get focusElement() {
    return this.href ? this.renderRoot?.querySelector("._a") : this;
  }
  get focusDisabled() {
    return this.disabled;
  }
  render() {
    const hasDefaultSlot = this.hasSlotController.test("[default]");
    const className2 = cc({
      container: true,
      "has-label": hasDefaultSlot,
      "has-active-icon": this.activeIcon || this.hasSlotController.test("active-icon"),
      initial: this.isInitial
    });
    return html`${this.href ? this.renderAnchor({
      part: "container",
      className: className2,
      content: this.renderInner(hasDefaultSlot)
    }) : html`<div part="container" class="${className2}">${this.renderInner(hasDefaultSlot)}</div>`}<mdui-ripple .noRipple="${!this.active || this.noRipple}" ${ref(this.rippleRef)}></mdui-ripple>`;
  }
  renderInner(hasDefaultSlot) {
    return html`<div part="indicator" class="indicator"><slot name="badge" part="badge" class="${classMap({
      badge: true,
      "placement-right": this.placement === "right"
    })}"></slot><slot name="active-icon" part="active-icon" class="active-icon">${this.activeIcon ? html`<mdui-icon name="${this.activeIcon}"></mdui-icon>` : nothingTemplate}</slot><slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}"></mdui-icon>` : nothingTemplate}</slot></div>${hasDefaultSlot ? html`<slot part="label" class="label"></slot>` : nothing}`;
  }
};
NavigationRailItem.styles = [
  componentStyle,
  navigationRailItemStyle
];
__decorate([
  property({ reflect: true })
], NavigationRailItem.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "active-icon" })
], NavigationRailItem.prototype, "activeIcon", void 0);
__decorate([
  property({ reflect: true })
], NavigationRailItem.prototype, "value", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], NavigationRailItem.prototype, "active", void 0);
__decorate([
  state()
], NavigationRailItem.prototype, "isInitial", void 0);
__decorate([
  state()
], NavigationRailItem.prototype, "placement", void 0);
__decorate([
  state()
], NavigationRailItem.prototype, "disabled", void 0);
NavigationRailItem = __decorate([
  customElement("mdui-navigation-rail-item")
], NavigationRailItem);

// node_modules/@mdui/shared/icons/circle.js
var IconCircle = class IconCircle2 extends LitElement {
  render() {
    return svgTag('<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"/>');
  }
};
IconCircle.styles = style10;
IconCircle = __decorate([
  customElement("mdui-icon-circle")
], IconCircle);

// node_modules/@mdui/shared/icons/radio-button-unchecked.js
var IconRadioButtonUnchecked = class IconRadioButtonUnchecked2 extends LitElement {
  render() {
    return svgTag('<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>');
  }
};
IconRadioButtonUnchecked.styles = style10;
IconRadioButtonUnchecked = __decorate([
  customElement("mdui-icon-radio-button-unchecked")
], IconRadioButtonUnchecked);

// node_modules/mdui/components/radio/radio-style.js
var radioStyle = css`:host{position:relative;display:inline-flex;align-items:center;cursor:pointer;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;touch-action:manipulation;zoom:1;-webkit-user-drag:none;border-radius:.125rem;font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking);line-height:var(--mdui-typescale-label-large-line-height)}.icon{display:flex;position:absolute;font-size:1.5rem}:not(.initial) .icon{transition-duration:var(--mdui-motion-duration-short4);transition-timing-function:var(--mdui-motion-easing-standard)}.unchecked-icon{transition-property:color;color:rgb(var(--mdui-color-on-surface-variant))}:host([focused]) .unchecked-icon,:host([hover]) .unchecked-icon,:host([pressed]) .unchecked-icon{color:rgb(var(--mdui-color-on-surface))}.checked-icon{opacity:0;transform:scale(.2);transition-property:color,opacity,transform;color:rgb(var(--mdui-color-primary))}.icon .i,::slotted([slot=checked-icon]),::slotted([slot=unchecked-icon]){color:inherit;font-size:inherit}i{position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border-radius:50%;width:2.5rem;height:2.5rem;--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}.label{display:flex;width:100%;padding-top:.625rem;padding-bottom:.625rem;color:rgb(var(--mdui-color-on-surface))}.label:not(.initial){transition:color var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}:host([checked]:not([checked=false i])) i{--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([checked]:not([checked=false i])) .icon{color:rgb(var(--mdui-color-primary))}:host([checked]:not([checked=false i])) .checked-icon{opacity:1;transform:scale(.5)}i.invalid{--mdui-comp-ripple-state-layer-color:var(--mdui-color-error)}i.invalid .icon{color:rgb(var(--mdui-color-error))}.label.invalid{color:rgb(var(--mdui-color-error))}:host([disabled]:not([disabled=false i])),:host([group-disabled]){cursor:default;pointer-events:none}:host([disabled]:not([disabled=false i])) .icon,:host([group-disabled]) .icon{color:rgba(var(--mdui-color-on-surface),38%)}:host([disabled]:not([disabled=false i])) .label,:host([group-disabled]) .label{color:rgba(var(--mdui-color-on-surface),38%)}`;

// node_modules/mdui/components/radio/radio.js
var Radio = class Radio2 extends RippleMixin(FocusableMixin(MduiElement)) {
  constructor() {
    super(...arguments);
    this.value = "";
    this.disabled = false;
    this.checked = false;
    this.invalid = false;
    this.groupDisabled = false;
    this.focusable = true;
    this.isInitial = true;
    this.rippleRef = createRef();
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.isDisabled();
  }
  get focusElement() {
    return this;
  }
  get focusDisabled() {
    return this.isDisabled() || !this.focusable;
  }
  onCheckedChange() {
    this.emit("change");
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.addEventListener("click", () => {
      if (!this.isDisabled()) {
        this.checked = true;
      }
    });
  }
  render() {
    const className2 = classMap({
      invalid: this.invalid,
      initial: this.isInitial
    });
    return html`<i part="control" class="${className2}"><mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple><slot name="unchecked-icon" part="unchecked-icon" class="icon unchecked-icon">${this.uncheckedIcon ? html`<mdui-icon name="${this.uncheckedIcon}" class="i"></mdui-icon>` : html`<mdui-icon-radio-button-unchecked class="i"></mdui-icon-radio-button-unchecked>`}</slot><slot name="checked-icon" part="checked-icon" class="icon checked-icon">${this.checkedIcon ? html`<mdui-icon name="${this.checkedIcon}" class="i"></mdui-icon>` : html`<mdui-icon-circle class="i"></mdui-icon-circle>`}</slot></i><slot part="label" class="label ${className2}"></slot>`;
  }
  isDisabled() {
    return this.disabled || this.groupDisabled;
  }
};
Radio.styles = [componentStyle, radioStyle];
__decorate([
  property({ reflect: true })
], Radio.prototype, "value", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Radio.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Radio.prototype, "checked", void 0);
__decorate([
  property({ reflect: true, attribute: "unchecked-icon" })
], Radio.prototype, "uncheckedIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "checked-icon" })
], Radio.prototype, "checkedIcon", void 0);
__decorate([
  state()
], Radio.prototype, "invalid", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "group-disabled"
  })
], Radio.prototype, "groupDisabled", void 0);
__decorate([
  state()
], Radio.prototype, "focusable", void 0);
__decorate([
  state()
], Radio.prototype, "isInitial", void 0);
__decorate([
  watch("checked", true)
], Radio.prototype, "onCheckedChange", null);
Radio = __decorate([
  customElement("mdui-radio")
], Radio);

// node_modules/mdui/components/radio/radio-group-style.js
var radioGroupStyle = css`:host{display:inline-block}fieldset{border:none;padding:0;margin:0;min-width:0}input{position:absolute;padding:0;opacity:0;pointer-events:none;width:1.25rem;height:1.25rem;margin:0 0 0 .625rem}`;

// node_modules/mdui/components/radio/radio-group.js
var RadioGroup = class RadioGroup2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.name = "";
    this.value = "";
    this.defaultValue = "";
    this.required = false;
    this.invalid = false;
    this.isInitial = true;
    this.inputRef = createRef();
    this.formController = new FormController(this);
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-radio"]
    });
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    return this.inputRef.value.validity;
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    return this.inputRef.value.validationMessage;
  }
  // 为了使 <mdui-radio> 可以不是该组件的直接子元素，这里不用 @queryAssignedElements()
  get items() {
    return $(this).find("mdui-radio").get();
  }
  get itemsEnabled() {
    return $(this).find("mdui-radio:not([disabled])").get();
  }
  async onValueChange() {
    this.isInitial = false;
    await this.definedController.whenDefined();
    this.emit("input");
    this.emit("change");
    this.updateItems();
    this.updateRadioFocusable();
    await this.updateComplete;
    const form = this.formController.getForm();
    if (form && formResets.get(form)?.has(this)) {
      this.invalid = false;
      formResets.get(form).delete(this);
    } else {
      this.invalid = !this.inputRef.value.checkValidity();
    }
  }
  async onInvalidChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    const valid = this.inputRef.value.checkValidity();
    if (!valid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
    }
    return valid;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    this.invalid = !this.inputRef.value.reportValidity();
    if (this.invalid) {
      const eventProceeded = this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      if (!eventProceeded) {
        this.inputRef.value.blur();
        this.inputRef.value.focus();
      }
    }
    return !this.invalid;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    this.inputRef.value.setCustomValidity(message);
    this.invalid = !this.inputRef.value.checkValidity();
  }
  render() {
    return html`<fieldset><input ${ref(this.inputRef)} type="radio" class="input" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .checked="${!!this.value}" .required="${this.required}" tabindex="-1" @keydown="${this.onKeyDown}"><slot @click="${this.onClick}" @keydown="${this.onKeyDown}" @slotchange="${this.onSlotChange}" @change="${this.onCheckedChange}"></slot></fieldset>`;
  }
  // 更新 mdui-radio 的 checked 后，需要更新可聚焦状态
  // 同一个 mdui-radio-group 中的多个 mdui-radio，仅有一个可聚焦
  // 若有已选中的，则已选中的可聚焦；若没有已选中的，则第一个可聚焦
  updateRadioFocusable() {
    const items = this.items;
    const itemChecked = items.find((item) => item.checked);
    if (itemChecked) {
      items.forEach((item) => {
        item.focusable = item === itemChecked;
      });
    } else {
      this.itemsEnabled.forEach((item, index) => {
        item.focusable = !index;
      });
    }
  }
  async onClick(event) {
    await this.definedController.whenDefined();
    const target = event.target;
    const item = target.closest("mdui-radio");
    if (!item || item.disabled) {
      return;
    }
    this.value = item.value;
    await this.updateComplete;
    item.focus();
  }
  /**
   * 在内部的 `<mdui-radio>` 上按下按键时，在 `<mdui-radio>` 之间切换焦点
   */
  async onKeyDown(event) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      return;
    }
    event.preventDefault();
    await this.definedController.whenDefined();
    const items = this.itemsEnabled;
    const itemChecked = items.find((item) => item.checked) ?? items[0];
    const incr = event.key === " " ? 0 : ["ArrowUp", "ArrowLeft"].includes(event.key) ? -1 : 1;
    let index = items.indexOf(itemChecked) + incr;
    if (index < 0) {
      index = items.length - 1;
    }
    if (index > items.length - 1) {
      index = 0;
    }
    this.value = items[index].value;
    await this.updateComplete;
    items[index].focus();
  }
  async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems();
    this.updateRadioFocusable();
  }
  /**
   * slot 中的 mdui-radio 的 checked 变更时触发的事件
   */
  onCheckedChange(event) {
    event.stopPropagation();
  }
  // 更新 <mdui-radio> 的状态
  updateItems() {
    this.items.forEach((item) => {
      item.checked = item.value === this.value;
      item.invalid = this.invalid;
      item.groupDisabled = this.disabled;
      item.isInitial = this.isInitial;
    });
  }
};
RadioGroup.styles = [
  componentStyle,
  radioGroupStyle
];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], RadioGroup.prototype, "disabled", void 0);
__decorate([
  property({ reflect: true })
], RadioGroup.prototype, "form", void 0);
__decorate([
  property({ reflect: true })
], RadioGroup.prototype, "name", void 0);
__decorate([
  property({ reflect: true })
], RadioGroup.prototype, "value", void 0);
__decorate([
  defaultValue()
], RadioGroup.prototype, "defaultValue", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], RadioGroup.prototype, "required", void 0);
__decorate([
  state()
], RadioGroup.prototype, "invalid", void 0);
__decorate([
  watch("value", true)
], RadioGroup.prototype, "onValueChange", null);
__decorate([
  watch("invalid", true),
  watch("disabled")
], RadioGroup.prototype, "onInvalidChange", null);
RadioGroup = __decorate([
  customElement("mdui-radio-group")
], RadioGroup);

// node_modules/lit-html/development/directives/map.js
function* map2(items, f) {
  if (items !== void 0) {
    let i = 0;
    for (const value of items) {
      yield f(value, i++);
    }
  }
}

// node_modules/mdui/components/slider/slider-base-style.js
var sliderBaseStyle = css`:host{position:relative;display:block;width:100%;-webkit-tap-highlight-color:transparent;height:2.5rem;padding:0 1.25rem}label{position:relative;display:block;width:100%;height:100%}input[type=range]{position:absolute;inset:0;z-index:4;height:100%;cursor:pointer;opacity:0;appearance:none;width:calc(100% + 20rem * 2 / 16);margin:0 -1.25rem;padding:0 .75rem}:host([disabled]:not([disabled=false i])) input[type=range]{cursor:not-allowed}.track-active,.track-inactive{position:absolute;top:50%;height:.25rem;margin-top:-.125rem}.track-inactive{left:-.125rem;right:-.125rem;border-radius:var(--mdui-shape-corner-full);background-color:rgb(var(--mdui-color-surface-container-highest))}.invalid .track-inactive{background-color:rgba(var(--mdui-color-error),.12)}:host([disabled]:not([disabled=false i])) .track-inactive{background-color:rgba(var(--mdui-color-on-surface),.12)}.track-active{background-color:rgb(var(--mdui-color-primary))}.invalid .track-active{background-color:rgb(var(--mdui-color-error))}:host([disabled]:not([disabled=false i])) .track-active{background-color:rgba(var(--mdui-color-on-surface),.38)}.handle{position:absolute;top:50%;transform:translate(-50%);cursor:pointer;z-index:2;width:2.5rem;height:2.5rem;margin-top:-1.25rem;--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}.invalid .handle{--mdui-comp-ripple-state-layer-color:var(--mdui-color-error)}.handle .elevation,.handle::before{position:absolute;display:block;content:' ';left:.625rem;top:.625rem;width:1.25rem;height:1.25rem;border-radius:var(--mdui-shape-corner-full)}.handle .elevation{background-color:rgb(var(--mdui-color-primary));box-shadow:var(--mdui-elevation-level1)}.invalid .handle .elevation{background-color:rgb(var(--mdui-color-error))}:host([disabled]:not([disabled=false i])) .handle .elevation{background-color:rgba(var(--mdui-color-on-surface),.38);box-shadow:var(--mdui-elevation-level0)}.handle::before{background-color:rgb(var(--mdui-color-background))}.handle mdui-ripple{border-radius:var(--mdui-shape-corner-full)}.label{position:absolute;left:50%;transform:translateX(-50%) scale(0);transform-origin:center bottom;display:flex;align-items:center;justify-content:center;cursor:default;white-space:nowrap;-webkit-user-select:none;user-select:none;pointer-events:none;transition:transform var(--mdui-motion-duration-short2) var(--mdui-motion-easing-standard);bottom:2.5rem;min-width:1.75rem;height:1.75rem;padding:.375rem .5rem;border-radius:var(--mdui-shape-corner-full);color:rgb(var(--mdui-color-on-primary));font-size:var(--mdui-typescale-label-medium-size);font-weight:var(--mdui-typescale-label-medium-weight);letter-spacing:var(--mdui-typescale-label-medium-tracking);line-height:var(--mdui-typescale-label-medium-line-height);background-color:rgb(var(--mdui-color-primary))}.invalid .label{color:rgb(var(--mdui-color-on-error));background-color:rgb(var(--mdui-color-error))}.label::after{content:' ';position:absolute;z-index:-1;transform:rotate(45deg);width:.875rem;height:.875rem;bottom:-.125rem;background-color:rgb(var(--mdui-color-primary))}.invalid .label::after{background-color:rgb(var(--mdui-color-error))}.label-visible{transform:translateX(-50%) scale(1);transition:transform var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}.tickmark{position:absolute;top:50%;transform:translate(-50%);width:.125rem;height:.125rem;margin-top:-.0625rem;border-radius:var(--mdui-shape-corner-full);background-color:rgba(var(--mdui-color-on-surface-variant),.38)}.invalid .tickmark{background-color:rgba(var(--mdui-color-error),.38)}.tickmark.active{background-color:rgba(var(--mdui-color-on-primary),.38)}.invalid .tickmark.active{background-color:rgba(var(--mdui-color-on-error),.38)}:host([disabled]:not([disabled=false i])) .tickmark{background-color:rgba(var(--mdui-color-on-surface),.38)}`;

// node_modules/mdui/components/slider/slider-base.js
var SliderBase = class extends RippleMixin(FocusableMixin(MduiElement)) {
  constructor() {
    super(...arguments);
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.tickmarks = false;
    this.nolabel = false;
    this.disabled = false;
    this.name = "";
    this.invalid = false;
    this.labelVisible = false;
    this.inputRef = createRef();
    this.trackActiveRef = createRef();
    this.labelFormatter = (value) => value.toString();
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    return this.inputRef.value.validity;
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    return this.inputRef.value.validationMessage;
  }
  get rippleDisabled() {
    return this.disabled;
  }
  get focusElement() {
    return this.inputRef.value;
  }
  get focusDisabled() {
    return this.disabled;
  }
  onDisabledChange() {
    this.invalid = !this.inputRef.value.checkValidity();
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    const valid = this.inputRef.value.checkValidity();
    if (!valid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
    }
    return valid;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    this.invalid = !this.inputRef.value.reportValidity();
    if (this.invalid) {
      const eventProceeded = this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      if (!eventProceeded) {
        this.blur();
        this.focus();
      }
    }
    return !this.invalid;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    this.inputRef.value.setCustomValidity(message);
    this.invalid = !this.inputRef.value.checkValidity();
  }
  /**
   * value 不在 min、max 或 step 的限制范围内时，修正 value 的值
   */
  fixValue(value) {
    const { min, max, step } = this;
    value = Math.min(Math.max(value, min), max);
    const steps = Math.round((value - min) / step);
    let fixedValue = min + steps * step;
    if (fixedValue > max) {
      fixedValue -= step;
    }
    return fixedValue;
  }
  /**
   * 获取候选值组成的数组
   */
  getCandidateValues() {
    return Array.from({ length: this.max - this.min + 1 }, (_, index) => index + this.min).filter((value) => !((value - this.min) % this.step));
  }
  /**
   * 渲染浮动标签
   */
  renderLabel(value) {
    return when(!this.nolabel, () => html`<div part="label" class="label ${classMap({ "label-visible": this.labelVisible })}">${this.labelFormatter(value)}</div>`);
  }
  onChange() {
    this.emit("change");
  }
};
SliderBase.styles = [
  componentStyle,
  sliderBaseStyle
];
__decorate([
  property({ type: Number, reflect: true })
], SliderBase.prototype, "min", void 0);
__decorate([
  property({ type: Number, reflect: true })
], SliderBase.prototype, "max", void 0);
__decorate([
  property({ type: Number, reflect: true })
], SliderBase.prototype, "step", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], SliderBase.prototype, "tickmarks", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], SliderBase.prototype, "nolabel", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], SliderBase.prototype, "disabled", void 0);
__decorate([
  property({ reflect: true })
], SliderBase.prototype, "form", void 0);
__decorate([
  property({ reflect: true })
], SliderBase.prototype, "name", void 0);
__decorate([
  state()
], SliderBase.prototype, "invalid", void 0);
__decorate([
  state()
], SliderBase.prototype, "labelVisible", void 0);
__decorate([
  property({ attribute: false })
], SliderBase.prototype, "labelFormatter", void 0);
__decorate([
  watch("disabled", true)
], SliderBase.prototype, "onDisabledChange", null);

// node_modules/mdui/components/range-slider/index.js
var RangeSlider = class RangeSlider2 extends SliderBase {
  constructor() {
    super(...arguments);
    this.defaultValue = [];
    this.currentHandle = "start";
    this.rippleStartRef = createRef();
    this.rippleEndRef = createRef();
    this.handleStartRef = createRef();
    this.handleEndRef = createRef();
    this.formController = new FormController(this);
    this._value = [];
    this.getRippleIndex = () => {
      if (this.hoverHandle) {
        return this.hoverHandle === "start" ? 0 : 1;
      }
      return this.currentHandle === "start" ? 0 : 1;
    };
  }
  /**
   * 滑块的值，为数组格式，将于表单数据一起提交。
   *
   * **NOTE**：该属性无法通过 HTML 属性设置初始值，如果要修改该值，只能通过修改 JavaScript 属性值实现。
   */
  get value() {
    return this._value;
  }
  set value(_value) {
    const oldValue = [...this._value];
    this._value = [this.fixValue(_value[0]), this.fixValue(_value[1])];
    this.requestUpdate("value", oldValue);
    this.updateComplete.then(() => {
      this.updateStyle();
      const form = this.formController.getForm();
      if (form && formResets.get(form)?.has(this)) {
        this.invalid = false;
        formResets.get(form).delete(this);
      } else {
        this.invalid = !this.inputRef.value.checkValidity();
      }
    });
  }
  get rippleElement() {
    return [this.rippleStartRef.value, this.rippleEndRef.value];
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.value.length) {
      this.value = [this.min, this.max];
    }
    this.value[0] = this.fixValue(this.value[0]);
    this.value[1] = this.fixValue(this.value[1]);
    if (!this.defaultValue.length) {
      this.defaultValue = [...this.value];
    }
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    const getCurrentHandle = (event) => {
      const $this = $(this);
      const paddingLeft = parseFloat($this.css("padding-left"));
      const paddingRight = parseFloat($this.css("padding-right"));
      const percent = (event.offsetX - paddingLeft) / (this.clientWidth - paddingLeft - paddingRight);
      const pointerValue = (this.max - this.min) * percent + this.min;
      const middleValue = (this.value[1] - this.value[0]) / 2 + this.value[0];
      return pointerValue > middleValue ? "end" : "start";
    };
    const onTouchStart = () => {
      if (!this.disabled) {
        this.labelVisible = true;
      }
    };
    const onTouchEnd = () => {
      if (!this.disabled) {
        this.labelVisible = false;
      }
    };
    this.addEventListener("touchstart", onTouchStart);
    this.addEventListener("mousedown", onTouchStart);
    this.addEventListener("touchend", onTouchEnd);
    this.addEventListener("mouseup", onTouchEnd);
    this.addEventListener("pointerdown", (event) => {
      this.currentHandle = getCurrentHandle(event);
    });
    this.addEventListener("pointermove", (event) => {
      const currentHandle = getCurrentHandle(event);
      if (this.hoverHandle !== currentHandle) {
        this.endHover(event);
        this.hoverHandle = currentHandle;
        this.startHover(event);
      }
    });
    this.updateStyle();
  }
  /**
   * <input /> 用于提供拖拽操作
   * <input class="invalid" /> 用于提供 html5 自带的表单错误提示
   */
  render() {
    return html`<label class="${classMap({ invalid: this.invalid })}"><input ${ref(this.inputRef)} type="range" step="${this.step}" min="${this.min}" max="${this.max}" ?disabled="${this.disabled}" @input="${this.onInput}" @change="${this.onChange}"><div part="track-inactive" class="track-inactive"></div><div ${ref(this.trackActiveRef)} part="track-active" class="track-active"></div><div ${ref(this.handleStartRef)} part="handle" class="handle start" style="${styleMap({
      "z-index": this.currentHandle === "start" ? "2" : "1"
    })}"><div class="elevation"></div><mdui-ripple ${ref(this.rippleStartRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.renderLabel(this.value[0])}</div><div ${ref(this.handleEndRef)} part="handle" class="handle end" style="${styleMap({
      "z-index": this.currentHandle === "end" ? "2" : "1"
    })}"><div class="elevation"></div><mdui-ripple ${ref(this.rippleEndRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.renderLabel(this.value[1])}</div>${when(this.tickmarks, () => map2(this.getCandidateValues(), (value) => html`<div part="tickmark" class="tickmark ${classMap({
      active: value > this.value[0] && value < this.value[1]
    })}" style="${styleMap({
      left: `${(value - this.min) / this.max * 100}%`,
      display: value === this.value[0] || value === this.value[1] ? "none" : "block"
    })}"></div>`))}</label>`;
  }
  updateStyle() {
    const getPercent = (value) => (value - this.min) / (this.max - this.min) * 100;
    const startPercent = getPercent(this.value[0]);
    const endPercent = getPercent(this.value[1]);
    this.trackActiveRef.value.style.width = `${endPercent - startPercent}%`;
    this.trackActiveRef.value.style.left = `${startPercent}%`;
    this.handleStartRef.value.style.left = `${startPercent}%`;
    this.handleEndRef.value.style.left = `${endPercent}%`;
  }
  onInput() {
    const isStart = this.currentHandle === "start";
    const value = parseFloat(this.inputRef.value.value);
    const startValue = this.value[0];
    const endValue = this.value[1];
    const doInput = () => {
      this.updateStyle();
    };
    if (isStart) {
      if (value <= endValue) {
        this.value = [value, endValue];
        doInput();
      } else if (startValue !== endValue) {
        this.value = [endValue, endValue];
        doInput();
      }
    } else {
      if (value >= startValue) {
        this.value = [startValue, value];
        doInput();
      } else if (startValue !== endValue) {
        this.value = [startValue, startValue];
        doInput();
      }
    }
  }
};
RangeSlider.styles = [SliderBase.styles];
__decorate([
  defaultValue()
], RangeSlider.prototype, "defaultValue", void 0);
__decorate([
  state()
], RangeSlider.prototype, "currentHandle", void 0);
__decorate([
  property({ type: Array, attribute: false })
], RangeSlider.prototype, "value", null);
RangeSlider = __decorate([
  customElement("mdui-range-slider")
], RangeSlider);

// node_modules/mdui/components/segmented-button/segmented-button-style.js
var segmentedButtonStyle = css`:host{position:relative;display:inline-flex;flex-grow:1;flex-shrink:0;float:left;height:100%;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;border:.0625rem solid rgb(var(--mdui-color-outline))}.button{width:100%;padding:0 .75rem}:host([invalid]){color:rgb(var(--mdui-color-error));border-color:rgb(var(--mdui-color-error))}:host([invalid]) .button{background-color:rgb(var(--mdui-color-error-container))}:host([selected]){color:rgb(var(--mdui-color-on-secondary-container));background-color:rgb(var(--mdui-color-secondary-container));--mdui-comp-ripple-state-layer-color:var(
      --mdui-color-on-secondary-container
    )}:host([disabled]:not([disabled=false i])),:host([group-disabled]){cursor:default;pointer-events:none;color:rgba(var(--mdui-color-on-surface),38%);border-color:rgba(var(--mdui-color-on-surface),12%)}:host([loading]:not([loading=false i])){cursor:default;pointer-events:none}:host(:not(.mdui-segmented-button-first)){margin-left:-.0625rem}:host(.mdui-segmented-button-first){border-radius:var(--shape-corner) 0 0 var(--shape-corner)}:host(.mdui-segmented-button-last){border-radius:0 var(--shape-corner) var(--shape-corner) 0}.end-icon,.icon,.selected-icon{display:inline-flex;font-size:1.28571429em}.end-icon .i,.icon .i,.selected-icon .i,::slotted([slot=end-icon]),::slotted([slot=icon]),::slotted([slot=selected-icon]){font-size:inherit}mdui-circular-progress{width:1.125rem;height:1.125rem}:host([disabled]:not([disabled=false i])) mdui-circular-progress{opacity:.38}.label{display:inline-flex}.has-icon .label{padding-left:.5rem}.has-end-icon .label{padding-right:.5rem}`;

// node_modules/mdui/components/segmented-button/segmented-button.js
var SegmentedButton = class SegmentedButton2 extends ButtonBase {
  constructor() {
    super(...arguments);
    this.selected = false;
    this.invalid = false;
    this.groupDisabled = false;
    this.key = uniqueId();
    this.rippleRef = createRef();
    this.hasSlotController = new HasSlotController(this, "[default]", "icon", "end-icon");
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.isDisabled() || this.loading;
  }
  get focusDisabled() {
    return this.isDisabled() || this.loading;
  }
  render() {
    const className2 = cc({
      button: true,
      "has-icon": this.icon || this.selected || this.loading || this.hasSlotController.test("icon"),
      "has-end-icon": this.endIcon || this.hasSlotController.test("end-icon")
    });
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton() ? this.renderButton({
      className: className2,
      part: "button",
      content: this.renderInner()
    }) : this.isDisabled() || this.loading ? html`<span part="button" class="_a ${className2}">${this.renderInner()}</span>` : this.renderAnchor({
      className: className2,
      part: "button",
      content: this.renderInner()
    })}`;
  }
  isDisabled() {
    return this.disabled || this.groupDisabled;
  }
  renderIcon() {
    if (this.loading) {
      return this.renderLoading();
    }
    if (this.selected) {
      return html`<slot name="selected-icon" part="selected-icon" class="selected-icon">${this.selectedIcon ? html`<mdui-icon name="${this.selectedIcon}" class="i"></mdui-icon>` : html`<mdui-icon-check class="i"></mdui-icon-check>`}</slot>`;
    }
    return html`<slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}" class="i"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderLabel() {
    const hasLabel = this.hasSlotController.test("[default]");
    if (!hasLabel) {
      return nothingTemplate;
    }
    return html`<slot part="label" class="label"></slot>`;
  }
  renderEndIcon() {
    return html`<slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon ? html`<mdui-icon name="${this.endIcon}" class="i"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderInner() {
    return [this.renderIcon(), this.renderLabel(), this.renderEndIcon()];
  }
};
SegmentedButton.styles = [
  ButtonBase.styles,
  segmentedButtonStyle
];
__decorate([
  property({ reflect: true })
], SegmentedButton.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-icon" })
], SegmentedButton.prototype, "endIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "selected-icon" })
], SegmentedButton.prototype, "selectedIcon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], SegmentedButton.prototype, "selected", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], SegmentedButton.prototype, "invalid", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "group-disabled"
  })
], SegmentedButton.prototype, "groupDisabled", void 0);
SegmentedButton = __decorate([
  customElement("mdui-segmented-button")
], SegmentedButton);

// node_modules/mdui/components/segmented-button/segmented-button-group-style.js
var segmentedButtonGroupStyle = css`:host{--shape-corner:var(--mdui-shape-corner-full);position:relative;display:inline-flex;vertical-align:middle;height:2.5rem;font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking);line-height:var(--mdui-typescale-label-large-line-height);color:rgb(var(--mdui-color-on-surface));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([full-width]:not([full-width=false i])){display:flex;flex-wrap:nowrap}input,select{position:absolute;width:100%;height:100%;padding:0;opacity:0;pointer-events:none}`;

// node_modules/mdui/components/segmented-button/segmented-button-group.js
var SegmentedButtonGroup = class SegmentedButtonGroup2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.fullWidth = false;
    this.disabled = false;
    this.required = false;
    this.name = "";
    this.value = "";
    this.defaultValue = "";
    this.selectedKeys = [];
    this.invalid = false;
    this.isInitial = true;
    this.inputRef = createRef();
    this.formController = new FormController(this);
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-segmented-button"]
    });
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    return this.inputRef.value.validity;
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    return this.inputRef.value.validationMessage;
  }
  // 为了使 <mdui-segmented-button> 可以不是该组件的直接子元素，这里不用 @queryAssignedElements()
  get items() {
    return $(this).find("mdui-segmented-button").get();
  }
  // 所有的子项元素（不包含已禁用的）
  get itemsEnabled() {
    return $(this).find("mdui-segmented-button:not([disabled])").get();
  }
  // 是否为单选
  get isSingle() {
    return this.selects === "single";
  }
  // 是否为多选
  get isMultiple() {
    return this.selects === "multiple";
  }
  // 是否可选择
  get isSelectable() {
    return this.isSingle || this.isMultiple;
  }
  async onSelectsChange() {
    if (!this.isSelectable) {
      this.setSelectedKeys([]);
    } else if (this.isSingle) {
      this.setSelectedKeys(this.selectedKeys.slice(0, 1));
    }
    await this.onSelectedKeysChange();
  }
  async onSelectedKeysChange() {
    await this.definedController.whenDefined();
    const values = this.itemsEnabled.filter((item) => this.selectedKeys.includes(item.key)).map((item) => item.value);
    const value = this.isMultiple ? values : values[0] || "";
    this.setValue(value);
    if (!this.isInitial) {
      this.emit("change");
    }
  }
  async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();
    if (!this.isSelectable) {
      this.updateItems();
      return;
    }
    const values = (this.isSingle ? [this.value] : (
      // 多选时，传入的值可能是字符串（通过 attribute 属性设置）；或字符串数组（通过 property 属性设置）
      isString(this.value) ? [this.value] : this.value
    )).filter((i) => i);
    if (!values.length) {
      this.setSelectedKeys([]);
    } else if (this.isSingle) {
      const firstItem = this.itemsEnabled.find((item) => item.value === values[0]);
      this.setSelectedKeys(firstItem ? [firstItem.key] : []);
    } else if (this.isMultiple) {
      this.setSelectedKeys(this.itemsEnabled.filter((item) => values.includes(item.value)).map((item) => item.key));
    }
    this.updateItems();
    if (!this.isInitial) {
      const form = this.formController.getForm();
      if (form && formResets.get(form)?.has(this)) {
        this.invalid = false;
        formResets.get(form).delete(this);
      } else {
        this.invalid = !this.inputRef.value.checkValidity();
      }
    }
  }
  async onInvalidChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }
  connectedCallback() {
    super.connectedCallback();
    this.value = this.isMultiple && isString(this.value) ? this.value ? [this.value] : [] : this.value;
    this.defaultValue = this.selects === "multiple" ? [] : "";
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    const valid = this.inputRef.value.checkValidity();
    if (!valid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
    }
    return valid;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    this.invalid = !this.inputRef.value.reportValidity();
    if (this.invalid) {
      const eventProceeded = this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      if (!eventProceeded) {
        this.inputRef.value.blur();
        this.inputRef.value.focus();
      }
    }
    return !this.invalid;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    this.inputRef.value.setCustomValidity(message);
    this.invalid = !this.inputRef.value.checkValidity();
  }
  render() {
    return html`${when(this.isSelectable && this.isSingle, () => html`<input ${ref(this.inputRef)} type="radio" name="${ifDefined(this.name)}" value="1" .disabled="${this.disabled}" .required="${this.required}" .checked="${!!this.value}" tabindex="-1" @keydown="${this.onInputKeyDown}">`)}${when(this.isSelectable && this.isMultiple, () => html`<select ${ref(this.inputRef)} name="${ifDefined(this.name)}" .disabled="${this.disabled}" .required="${this.required}" multiple="multiple" tabindex="-1" @keydown="${this.onInputKeyDown}">${map2(this.value, (value) => html`<option selected="selected" value="${value}"></option>`)}</select>`)}<slot @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot>`;
  }
  // 切换一个元素的选中状态
  selectOne(item) {
    if (this.isMultiple) {
      const selectedKeys = [...this.selectedKeys];
      if (selectedKeys.includes(item.key)) {
        selectedKeys.splice(selectedKeys.indexOf(item.key), 1);
      } else {
        selectedKeys.push(item.key);
      }
      this.setSelectedKeys(selectedKeys);
    }
    if (this.isSingle) {
      if (this.selectedKeys.includes(item.key)) {
        this.setSelectedKeys([]);
      } else {
        this.setSelectedKeys([item.key]);
      }
    }
    this.isInitial = false;
    this.updateItems();
  }
  async onClick(event) {
    if (event.button) {
      return;
    }
    await this.definedController.whenDefined();
    const target = event.target;
    const item = target.closest("mdui-segmented-button");
    if (!item || item.disabled) {
      return;
    }
    if (this.isSelectable && item.value) {
      this.selectOne(item);
    }
  }
  /**
   * 在隐藏的 `<input>` 或 `<select>` 上按下按键时，切换选中状态
   * 通常为验证不通过时，默认聚焦到 `<input>` 或 `<select>` 上，此时按下按键，切换第一个元素的选中状态
   */
  async onInputKeyDown(event) {
    if (!["Enter", " "].includes(event.key)) {
      return;
    }
    event.preventDefault();
    await this.definedController.whenDefined();
    if (this.isSingle) {
      const input = event.target;
      input.checked = !input.checked;
      this.selectOne(this.itemsEnabled[0]);
      this.itemsEnabled[0].focus();
    }
    if (this.isMultiple) {
      this.selectOne(this.itemsEnabled[0]);
      this.itemsEnabled[0].focus();
    }
  }
  async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems(true);
  }
  setSelectedKeys(selectedKeys) {
    if (!arraysEqualIgnoreOrder(this.selectedKeys, selectedKeys)) {
      this.selectedKeys = selectedKeys;
    }
  }
  setValue(value) {
    if (this.isSingle) {
      this.value = value;
    } else if (!arraysEqualIgnoreOrder(this.value, value)) {
      this.value = value;
    }
  }
  updateItems(slotChange = false) {
    const items = this.items;
    items.forEach((item, index) => {
      item.invalid = this.invalid;
      item.groupDisabled = this.disabled;
      item.selected = this.selectedKeys.includes(item.key);
      if (slotChange) {
        item.classList.toggle("mdui-segmented-button-first", index === 0);
        item.classList.toggle("mdui-segmented-button-last", index === items.length - 1);
      }
    });
  }
};
SegmentedButtonGroup.styles = [
  componentStyle,
  segmentedButtonGroupStyle
];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "full-width"
  })
], SegmentedButtonGroup.prototype, "fullWidth", void 0);
__decorate([
  property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
], SegmentedButtonGroup.prototype, "selects", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], SegmentedButtonGroup.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], SegmentedButtonGroup.prototype, "required", void 0);
__decorate([
  property({ reflect: true })
], SegmentedButtonGroup.prototype, "form", void 0);
__decorate([
  property({ reflect: true })
], SegmentedButtonGroup.prototype, "name", void 0);
__decorate([
  property()
], SegmentedButtonGroup.prototype, "value", void 0);
__decorate([
  defaultValue()
], SegmentedButtonGroup.prototype, "defaultValue", void 0);
__decorate([
  state()
], SegmentedButtonGroup.prototype, "selectedKeys", void 0);
__decorate([
  state()
], SegmentedButtonGroup.prototype, "invalid", void 0);
__decorate([
  watch("selects", true)
], SegmentedButtonGroup.prototype, "onSelectsChange", null);
__decorate([
  watch("selectedKeys", true)
], SegmentedButtonGroup.prototype, "onSelectedKeysChange", null);
__decorate([
  watch("value")
], SegmentedButtonGroup.prototype, "onValueChange", null);
__decorate([
  watch("invalid", true),
  watch("disabled")
], SegmentedButtonGroup.prototype, "onInvalidChange", null);
SegmentedButtonGroup = __decorate([
  customElement("mdui-segmented-button-group")
], SegmentedButtonGroup);

// node_modules/@mdui/shared/icons/cancel--outlined.js
var IconCancel_Outlined = class IconCancel_Outlined2 extends LitElement {
  render() {
    return svgTag('<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/>');
  }
};
IconCancel_Outlined.styles = style10;
IconCancel_Outlined = __decorate([
  customElement("mdui-icon-cancel--outlined")
], IconCancel_Outlined);

// node_modules/@mdui/shared/icons/error.js
var IconError = class IconError2 extends LitElement {
  render() {
    return svgTag('<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>');
  }
};
IconError.styles = style10;
IconError = __decorate([
  customElement("mdui-icon-error")
], IconError);

// node_modules/@mdui/shared/icons/visibility-off.js
var IconVisibilityOff = class IconVisibilityOff2 extends LitElement {
  render() {
    return svgTag('<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>');
  }
};
IconVisibilityOff.styles = style10;
IconVisibilityOff = __decorate([
  customElement("mdui-icon-visibility-off")
], IconVisibilityOff);

// node_modules/@mdui/shared/icons/visibility.js
var IconVisibility = class IconVisibility2 extends LitElement {
  render() {
    return svgTag('<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>');
  }
};
IconVisibility.styles = style10;
IconVisibility = __decorate([
  customElement("mdui-icon-visibility")
], IconVisibility);

// node_modules/mdui/components/text-field/style.js
var style19 = css`:host{display:inline-block;width:100%}:host([disabled]:not([disabled=false i])){pointer-events:none}:host([type=hidden]){display:none}.container{position:relative;display:flex;align-items:center;height:100%;padding:.125rem .125rem .125rem 1rem;transition:box-shadow var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard)}.container.has-icon{padding-left:.75rem}.container.has-action,.container.has-right-icon,.container.has-suffix{padding-right:.75rem}:host([variant=filled]) .container{box-shadow:inset 0 -.0625rem 0 0 rgb(var(--mdui-color-on-surface-variant));background-color:rgb(var(--mdui-color-surface-container-highest));border-radius:var(--mdui-shape-corner-extra-small) var(--mdui-shape-corner-extra-small) 0 0}:host([variant=outlined]) .container{box-shadow:inset 0 0 0 .0625rem rgb(var(--mdui-color-outline));border-radius:var(--mdui-shape-corner-extra-small)}:host([variant=filled]) .container.invalid,:host([variant=filled]) .container.invalid-style{box-shadow:inset 0 -.0625rem 0 0 rgb(var(--mdui-color-error))}:host([variant=outlined]) .container.invalid,:host([variant=outlined]) .container.invalid-style{box-shadow:inset 0 0 0 .0625rem rgb(var(--mdui-color-error))}:host([variant=filled]:hover) .container{box-shadow:inset 0 -.0625rem 0 0 rgb(var(--mdui-color-on-surface))}:host([variant=outlined]:hover) .container{box-shadow:inset 0 0 0 .0625rem rgb(var(--mdui-color-on-surface))}:host([variant=filled]:hover) .container.invalid,:host([variant=filled]:hover) .container.invalid-style{box-shadow:inset 0 -.0625rem 0 0 rgb(var(--mdui-color-on-error-container))}:host([variant=outlined]:hover) .container.invalid,:host([variant=outlined]:hover) .container.invalid-style{box-shadow:inset 0 0 0 .0625rem rgb(var(--mdui-color-on-error-container))}:host([variant=filled][focused-style]) .container,:host([variant=filled][focused]) .container{box-shadow:inset 0 -.125rem 0 0 rgb(var(--mdui-color-primary))}:host([variant=outlined][focused-style]) .container,:host([variant=outlined][focused]) .container{box-shadow:inset 0 0 0 .125rem rgb(var(--mdui-color-primary))}:host([variant=filled][focused-style]) .container.invalid,:host([variant=filled][focused-style]) .container.invalid-style,:host([variant=filled][focused]) .container.invalid,:host([variant=filled][focused]) .container.invalid-style{box-shadow:inset 0 -.125rem 0 0 rgb(var(--mdui-color-error))}:host([variant=outlined][focused-style]) .container.invalid,:host([variant=outlined][focused-style]) .container.invalid-style,:host([variant=outlined][focused]) .container.invalid,:host([variant=outlined][focused]) .container.invalid-style{box-shadow:inset 0 0 0 .125rem rgb(var(--mdui-color-error))}:host([variant=filled][disabled]:not([disabled=false i])) .container{box-shadow:inset 0 -.0625rem 0 0 rgba(var(--mdui-color-on-surface),38%);background-color:rgba(var(--mdui-color-on-surface),4%)}:host([variant=outlined][disabled]:not([disabled=false i])) .container{box-shadow:inset 0 0 0 .125rem rgba(var(--mdui-color-on-surface),12%)}.action,.icon,.prefix,.right-icon,.suffix{display:flex;-webkit-user-select:none;user-select:none;color:rgb(var(--mdui-color-on-surface-variant))}:host([disabled]:not([disabled=false i])) .action,:host([disabled]:not([disabled=false i])) .icon,:host([disabled]:not([disabled=false i])) .prefix,:host([disabled]:not([disabled=false i])) .right-icon,:host([disabled]:not([disabled=false i])) .suffix{color:rgba(var(--mdui-color-on-surface),38%)}.invalid .right-icon,.invalid-style .right-icon{color:rgb(var(--mdui-color-error))}:host(:hover) .invalid .right-icon,:host(:hover) .invalid-style .right-icon{color:rgb(var(--mdui-color-on-error-container))}:host([focused-style]) .invalid .right-icon,:host([focused-style]) .invalid-style .right-icon,:host([focused]) .invalid .right-icon,:host([focused]) .invalid-style .right-icon{color:rgb(var(--mdui-color-error))}.action,.icon,.right-icon{font-size:1.5rem}.action mdui-button-icon,.icon mdui-button-icon,.right-icon mdui-button-icon,::slotted(mdui-button-icon[slot]){margin-left:-.5rem;margin-right:-.5rem}.action .i,.icon .i,.right-icon .i,::slotted([slot$=icon]){font-size:inherit}.has-icon .icon{margin-right:1rem}.has-prefix .prefix{padding-right:.125rem}.has-action .action{margin-left:.75rem}.has-suffix .suffix{padding-right:.25rem;padding-left:.125rem}.has-right-icon .right-icon{margin-left:.75rem}.prefix,.suffix{display:none;font-size:var(--mdui-typescale-body-large-size);font-weight:var(--mdui-typescale-body-large-weight);letter-spacing:var(--mdui-typescale-body-large-tracking);line-height:var(--mdui-typescale-body-large-line-height)}:host([variant=filled][label]) .prefix,:host([variant=filled][label]) .suffix{padding-top:1rem}.has-value .prefix,.has-value .suffix,:host([focused-style]) .prefix,:host([focused-style]) .suffix,:host([focused]) .prefix,:host([focused]) .suffix{display:flex}.input-container{display:flex;width:100%;height:100%}.label{position:absolute;pointer-events:none;max-width:calc(100% - 1rem);display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:1;transition:all var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard);top:1rem;color:rgb(var(--mdui-color-on-surface-variant));font-size:var(--mdui-typescale-body-large-size);font-weight:var(--mdui-typescale-body-large-weight);letter-spacing:var(--mdui-typescale-body-large-tracking);line-height:var(--mdui-typescale-body-large-line-height)}.invalid .label,.invalid-style .label{color:rgb(var(--mdui-color-error))}:host([variant=outlined]) .label{padding:0 .25rem;margin:0 -.25rem}:host([variant=outlined]:hover) .label{color:rgb(var(--mdui-color-on-surface))}:host([variant=filled]:hover) .invalid .label,:host([variant=filled]:hover) .invalid-style .label,:host([variant=outlined]:hover) .invalid .label,:host([variant=outlined]:hover) .invalid-style .label{color:rgb(var(--mdui-color-on-error-container))}:host([variant=filled][focused-style]) .label,:host([variant=filled][focused]) .label,:host([variant=outlined][focused-style]) .label,:host([variant=outlined][focused]) .label{color:rgb(var(--mdui-color-primary))}:host([variant=filled]) .has-value .label,:host([variant=filled][focused-style]) .label,:host([variant=filled][focused]) .label,:host([variant=filled][type=date]) .label,:host([variant=filled][type=datetime-local]) .label,:host([variant=filled][type=month]) .label,:host([variant=filled][type=time]) .label,:host([variant=filled][type=week]) .label{font-size:var(--mdui-typescale-body-small-size);font-weight:var(--mdui-typescale-body-small-weight);letter-spacing:var(--mdui-typescale-body-small-tracking);line-height:var(--mdui-typescale-body-small-line-height);top:.25rem}:host([variant=outlined]) .has-value .label,:host([variant=outlined][focused-style]) .label,:host([variant=outlined][focused]) .label,:host([variant=outlined][type=date]) .label,:host([variant=outlined][type=datetime-local]) .label,:host([variant=outlined][type=month]) .label,:host([variant=outlined][type=time]) .label,:host([variant=outlined][type=week]) .label{font-size:var(--mdui-typescale-body-small-size);font-weight:var(--mdui-typescale-body-small-weight);letter-spacing:var(--mdui-typescale-body-small-tracking);line-height:var(--mdui-typescale-body-small-line-height);top:-.5rem;left:.75rem;background-color:rgb(var(--mdui-color-background))}:host([variant=filled][focused-style]) .invalid .label,:host([variant=filled][focused-style]) .invalid-style .label,:host([variant=filled][focused]) .invalid .label,:host([variant=filled][focused]) .invalid-style .label,:host([variant=outlined][focused-style]) .invalid .label,:host([variant=outlined][focused-style]) .invalid-style .label,:host([variant=outlined][focused]) .invalid .label,:host([variant=outlined][focused]) .invalid-style .label{color:rgb(var(--mdui-color-error))}:host([variant=filled][disabled]:not([disabled=false i])) .label,:host([variant=outlined][disabled]:not([disabled=false i])) .label{color:rgba(var(--mdui-color-on-surface),38%)}.input{display:block;width:100%;border:none;outline:0;background:0 0;appearance:none;resize:none;cursor:inherit;font-family:inherit;padding:.875rem .875rem .875rem 0;font-size:var(--mdui-typescale-body-large-size);font-weight:var(--mdui-typescale-body-large-weight);letter-spacing:var(--mdui-typescale-body-large-tracking);line-height:var(--mdui-typescale-body-large-line-height);color:rgb(var(--mdui-color-on-surface));caret-color:rgb(var(--mdui-color-primary))}.has-action .input,.has-right-icon .input{padding-right:.25rem}.has-suffix .input{padding-right:0}.input.hide-input{opacity:0;height:0;min-height:0;width:0;padding:0!important;overflow:hidden}.input::placeholder{color:rgb(var(--mdui-color-on-surface-variant))}.invalid .input,.invalid-style .input{caret-color:rgb(var(--mdui-color-error))}:host([disabled]:not([disabled=false i])) .input{color:rgba(var(--mdui-color-on-surface),38%)}:host([end-aligned]:not([end-aligned=false i])) .input{text-align:right}textarea.input{padding-top:0;margin-top:.875rem}:host([variant=filled]) .label+.input{padding-top:1.375rem;padding-bottom:.375rem}:host([variant=filled]) .label+textarea.input{padding-top:0;margin-top:1.375rem}.supporting{display:flex;justify-content:space-between;padding:.25rem 1rem;color:rgb(var(--mdui-color-on-surface-variant))}.supporting.invalid,.supporting.invalid-style{color:rgb(var(--mdui-color-error))}.helper{display:block;opacity:1;transition:opacity var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear);font-size:var(--mdui-typescale-body-small-size);font-weight:var(--mdui-typescale-body-small-weight);letter-spacing:var(--mdui-typescale-body-small-tracking);line-height:var(--mdui-typescale-body-small-line-height)}:host([disabled]:not([disabled=false i])) .helper{color:rgba(var(--mdui-color-on-surface),38%)}:host([helper-on-focus]:not([helper-on-focus=false i])) .helper{opacity:0}:host([helper-on-focus][focused-style]:not([helper-on-focus=false i])) .helper,:host([helper-on-focus][focused]:not([helper-on-focus=false i])) .helper{opacity:1}.error{font-size:var(--mdui-typescale-body-small-size);font-weight:var(--mdui-typescale-body-small-weight);letter-spacing:var(--mdui-typescale-body-small-tracking);line-height:var(--mdui-typescale-body-small-line-height)}.counter{flex-wrap:nowrap;padding-left:1rem;font-size:var(--mdui-typescale-body-small-size);font-weight:var(--mdui-typescale-body-small-weight);letter-spacing:var(--mdui-typescale-body-small-tracking);line-height:var(--mdui-typescale-body-small-line-height)}::-ms-reveal{display:none}.input[type=number]::-webkit-inner-spin-button,.input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;display:none}.input[type=number]{-moz-appearance:textfield}.input[type=search]::-webkit-search-cancel-button{-webkit-appearance:none}`;

// node_modules/mdui/components/text-field/index.js
var TextField = class TextField2 extends FocusableMixin(MduiElement) {
  constructor() {
    super(...arguments);
    this.variant = "filled";
    this.type = "text";
    this.name = "";
    this.value = "";
    this.defaultValue = "";
    this.helperOnFocus = false;
    this.clearable = false;
    this.endAligned = false;
    this.readonly = false;
    this.disabled = false;
    this.required = false;
    this.autosize = false;
    this.counter = false;
    this.togglePassword = false;
    this.spellcheck = false;
    this.invalid = false;
    this.invalidStyle = false;
    this.focusedStyle = false;
    this.isPasswordVisible = false;
    this.hasValue = false;
    this.error = "";
    this.inputRef = createRef();
    this.formController = new FormController(this);
    this.hasSlotController = new HasSlotController(this, "icon", "end-icon", "helper", "input");
    this.readonlyButClearable = false;
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    return this.inputRef.value.validity;
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    return this.inputRef.value.validationMessage;
  }
  /**
   * 获取当前值，并转换为 `number` 类型；或设置一个 `number` 类型的值。
   * 如果值无法被转换为 `number` 类型，则会返回 `NaN`。
   */
  get valueAsNumber() {
    return this.inputRef.value?.valueAsNumber ?? parseFloat(this.value);
  }
  set valueAsNumber(newValue) {
    const input = document.createElement("input");
    input.type = "number";
    input.valueAsNumber = newValue;
    this.value = input.value;
  }
  get focusElement() {
    return this.inputRef.value;
  }
  get focusDisabled() {
    return this.disabled;
  }
  /**
   * 是否显示聚焦状态样式
   */
  get isFocusedStyle() {
    return this.focused || this.focusedStyle;
  }
  /**
   * 是否渲染为 textarea。为 false 时渲染为 input
   */
  get isTextarea() {
    return this.rows && this.rows > 1 || this.autosize;
  }
  onDisabledChange() {
    this.inputRef.value.disabled = this.disabled;
    this.invalid = !this.inputRef.value.checkValidity();
  }
  async onValueChange() {
    this.hasValue = !["", null].includes(this.value);
    if (this.hasUpdated) {
      await this.updateComplete;
      this.setTextareaHeight();
      const form = this.formController.getForm();
      if (form && formResets.get(form)?.has(this)) {
        this.invalid = false;
        formResets.get(form).delete(this);
      } else {
        this.invalid = !this.inputRef.value.checkValidity();
      }
    }
  }
  onRowsChange() {
    this.setTextareaHeight();
  }
  async onMaxRowsChange() {
    if (!this.autosize) {
      return;
    }
    if (!this.hasUpdated) {
      await this.updateComplete;
    }
    const $input = $(this.inputRef.value);
    $input.css("max-height", parseFloat($input.css("line-height")) * (this.maxRows ?? 1) + parseFloat($input.css("padding-top")) + parseFloat($input.css("padding-bottom")));
  }
  async onMinRowsChange() {
    if (!this.autosize) {
      return;
    }
    if (!this.hasUpdated) {
      await this.updateComplete;
    }
    const $input = $(this.inputRef.value);
    $input.css("min-height", parseFloat($input.css("line-height")) * (this.minRows ?? 1) + parseFloat($input.css("padding-top")) + parseFloat($input.css("padding-bottom")));
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => {
      this.setTextareaHeight();
      this.observeResize = observeResize(this.inputRef.value, () => this.setTextareaHeight());
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.observeResize?.unobserve();
    offLocaleReady(this);
  }
  /**
   * 选中文本框中的文本
   */
  select() {
    this.inputRef.value.select();
  }
  /**
   * 选中文本框中特定范围的内容
   *
   * @param start 被选中的第一个字符的位置索引，从 `0` 开始。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
   * @param end 被选中的最后一个字符的*下一个*位置索引。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
   * @param direction 一个表示选择方向的字符串，可能的值有：`forward`、`backward`、`none`
   */
  setSelectionRange(start, end, direction = "none") {
    this.inputRef.value.setSelectionRange(start, end, direction);
  }
  /**
   * 将文本框中特定范围的文本替换为新的文本
   * @param replacement 要插入的字符串
   * @param start 要替换的字符的起止位置的索引。默认为当前用户选中的字符的起始位置的索引
   * @param end 要替换的字符的结束位置的索引。默认为当前用户选中的字符的结束位置的索引
   * @param selectMode 文本被替换后，选取的状态。可选值为：
   * * `select`：选择新插入的文本
   * * `start`：将光标移动到新插入的文本的起始位置
   * * `end`：将光标移动到新插入的文本的结束位置
   * * `preserve`：默认值。尝试保留选取
   */
  setRangeText(replacement, start, end, selectMode = "preserve") {
    this.inputRef.value.setRangeText(replacement, start, end, selectMode);
    if (this.value !== this.inputRef.value.value) {
      this.value = this.inputRef.value.value;
      this.setTextareaHeight();
      this.emit("input");
      this.emit("change");
    }
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    const valid = this.inputRef.value.checkValidity();
    if (!valid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
    }
    return valid;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    this.invalid = !this.inputRef.value.reportValidity();
    if (this.invalid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      this.focus();
    }
    return !this.invalid;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    this.setCustomValidityInternal(message);
    offLocaleReady(this);
  }
  render() {
    const hasIcon = !!this.icon || this.hasSlotController.test("icon");
    const hasEndIcon = !!this.endIcon || this.hasSlotController.test("end-icon");
    const hasErrorIcon = this.invalid || this.invalidStyle;
    const hasTogglePasswordButton = this.type === "password" && this.togglePassword && !this.disabled;
    const hasClearButton = this.clearable && !this.disabled && (!this.readonly || this.readonlyButClearable) && (typeof this.value === "number" || this.value.length > 0);
    const hasPrefix = !!this.prefix || this.hasSlotController.test("prefix");
    const hasSuffix = !!this.suffix || this.hasSlotController.test("suffix");
    const hasHelper = !!this.helper || this.hasSlotController.test("helper");
    const hasError = hasErrorIcon && !!(this.error || this.inputRef.value.validationMessage);
    const hasCounter = this.counter && !!this.maxlength;
    const hasInputSlot = this.hasSlotController.test("input");
    const invalidClassNameObj = {
      invalid: this.invalid,
      "invalid-style": this.invalidStyle
    };
    const className2 = classMap({
      container: true,
      "has-value": this.hasValue,
      "has-icon": hasIcon,
      "has-right-icon": hasEndIcon || hasErrorIcon,
      "has-action": hasClearButton || hasTogglePasswordButton,
      "has-prefix": hasPrefix,
      "has-suffix": hasSuffix,
      "is-firefox": navigator.userAgent.includes("Firefox"),
      ...invalidClassNameObj
    });
    return html`<div part="container" class="${className2}">${this.renderPrefix()}<div class="input-container">${this.renderLabel()} ${this.isTextarea ? this.renderTextArea(hasInputSlot) : this.renderInput(hasInputSlot)} ${when(hasInputSlot, () => html`<slot name="input" class="input"></slot>`)}</div>${this.renderSuffix()}${this.renderClearButton(hasClearButton)} ${this.renderTogglePasswordButton(hasTogglePasswordButton)} ${this.renderRightIcon(hasErrorIcon)}</div>${when(hasError || hasHelper || hasCounter, () => html`<div part="supporting" class="${classMap({ supporting: true, ...invalidClassNameObj })}">${this.renderHelper(hasError, hasHelper)} ${this.renderCounter(hasCounter)}</div>`)}`;
  }
  setCustomValidityInternal(message) {
    this.inputRef.value.setCustomValidity(message);
    this.invalid = !this.inputRef.value.checkValidity();
    this.requestUpdate();
  }
  onChange() {
    this.value = this.inputRef.value.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    this.emit("change");
  }
  onClear(event) {
    this.value = "";
    this.emit("clear");
    this.emit("input");
    this.emit("change");
    this.focus();
    event.stopPropagation();
  }
  onInput(event) {
    event.stopPropagation();
    this.value = this.inputRef.value.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    this.emit("input");
  }
  onInvalid(event) {
    event.preventDefault();
  }
  onKeyDown(event) {
    const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.key === "Enter" && !hasModifier) {
      setTimeout(() => {
        if (!event.defaultPrevented) {
          this.formController.submit();
        }
      });
    }
  }
  /**
   * textarea 不支持 pattern 属性，所以在 keyup 时执行验证
   */
  onTextAreaKeyUp() {
    if (this.pattern) {
      const patternRegex = new RegExp(this.pattern);
      const hasError = this.value && !this.value.match(patternRegex);
      if (hasError) {
        this.setCustomValidityInternal(this.getPatternErrorMsg());
        onLocaleReady(this, () => {
          this.setCustomValidityInternal(this.getPatternErrorMsg());
        });
      } else {
        this.setCustomValidityInternal("");
        offLocaleReady(this);
      }
    }
  }
  onTogglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  getPatternErrorMsg() {
    return msg("Please match the requested format.", {
      id: "components.textField.patternError"
    });
  }
  setTextareaHeight() {
    if (this.autosize) {
      this.inputRef.value.style.height = "auto";
      this.inputRef.value.style.height = `${this.inputRef.value.scrollHeight}px`;
    } else {
      this.inputRef.value.style.height = void 0;
    }
  }
  renderLabel() {
    return this.label ? html`<label part="label" class="label">${this.label}</label>` : nothingTemplate;
  }
  renderPrefix() {
    return html`<slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}" class="i"></mdui-icon>` : nothingTemplate}</slot><slot name="prefix" part="prefix" class="prefix">${this.prefix}</slot>`;
  }
  renderSuffix() {
    return html`<slot name="suffix" part="suffix" class="suffix">${this.suffix}</slot>`;
  }
  renderRightIcon(hasErrorIcon) {
    return hasErrorIcon ? html`<slot name="error-icon" part="error-icon" class="right-icon">${this.errorIcon ? html`<mdui-icon name="${this.errorIcon}" class="i"></mdui-icon>` : html`<mdui-icon-error class="i"></mdui-icon-error>`}</slot>` : html`<slot name="end-icon" part="end-icon" class="end-icon right-icon">${this.endIcon ? html`<mdui-icon name="${this.endIcon}" class="i"></mdui-icon>` : nothingTemplate}</slot>`;
  }
  renderClearButton(hasClearButton) {
    return when(hasClearButton, () => html`<slot name="clear-button" part="clear-button" class="action" @click="${this.onClear}"><mdui-button-icon tabindex="-1"><slot name="clear-icon" part="clear-icon">${this.clearIcon ? html`<mdui-icon name="${this.clearIcon}" class="i"></mdui-icon>` : html`<mdui-icon-cancel--outlined class="i"></mdui-icon-cancel--outlined>`}</slot></mdui-button-icon></slot>`);
  }
  renderTogglePasswordButton(hasTogglePasswordButton) {
    return when(hasTogglePasswordButton, () => html`<slot name="toggle-password-button" part="toggle-password-button" class="action" @click="${this.onTogglePassword}"><mdui-button-icon tabindex="-1">${this.isPasswordVisible ? html`<slot name="show-password-icon" part="show-password-icon">${this.showPasswordIcon ? html`<mdui-icon name="${this.showPasswordIcon}" class="i"></mdui-icon>` : html`<mdui-icon-visibility-off class="i"></mdui-icon-visibility-off>`}</slot>` : html`<slot name="hide-password-icon" part="hide-password-icon">${this.hidePasswordIcon ? html`<mdui-icon name="${this.hidePasswordIcon}" class="i"></mdui-icon>` : html`<mdui-icon-visibility class="i"></mdui-icon-visibility>`}</slot>`}</mdui-button-icon></slot>`);
  }
  renderInput(hasInputSlot) {
    return html`<input ${ref(this.inputRef)} part="input" class="input ${classMap({ "hide-input": hasInputSlot })}" type="${this.type === "password" && this.isPasswordVisible ? "text" : this.type}" name="${ifDefined(this.name)}" .value="${live(this.value)}" placeholder="${ifDefined(!this.label || this.isFocusedStyle || this.hasValue ? this.placeholder : void 0)}" ?readonly="${this.readonly}" ?disabled="${this.disabled}" ?required="${this.required}" minlength="${ifDefined(this.minlength)}" maxlength="${ifDefined(this.maxlength)}" min="${ifDefined(this.min)}" max="${ifDefined(this.max)}" step="${ifDefined(this.step)}" autocapitalize="${ifDefined(this.type === "password" ? "off" : this.autocapitalize)}" autocomplete="${this.autocomplete}" autocorrect="${ifDefined(this.type === "password" ? "off" : this.autocorrect)}" spellcheck="${ifDefined(this.spellcheck)}" pattern="${ifDefined(this.pattern)}" enterkeyhint="${ifDefined(this.enterkeyhint)}" inputmode="${ifDefined(this.inputmode)}" @change="${this.onChange}" @input="${this.onInput}" @invalid="${this.onInvalid}" @keydown="${this.onKeyDown}">`;
  }
  renderTextArea(hasInputSlot) {
    return html`<textarea ${ref(this.inputRef)} part="input" class="input ${classMap({ "hide-input": hasInputSlot })}" name="${ifDefined(this.name)}" .value="${live(this.value)}" placeholder="${ifDefined(!this.label || this.isFocusedStyle || this.hasValue ? this.placeholder : void 0)}" ?readonly="${this.readonly}" ?disabled="${this.disabled}" ?required="${this.required}" minlength="${ifDefined(this.minlength)}" maxlength="${ifDefined(this.maxlength)}" rows="${this.rows ?? 1}" autocapitalize="${ifDefined(this.autocapitalize)}" autocorrect="${ifDefined(this.autocorrect)}" spellcheck="${ifDefined(this.spellcheck)}" enterkeyhint="${ifDefined(this.enterkeyhint)}" inputmode="${ifDefined(this.inputmode)}" @change="${this.onChange}" @input="${this.onInput}" @invalid="${this.onInvalid}" @keydown="${this.onKeyDown}" @keyup="${this.onTextAreaKeyUp}"></textarea>`;
  }
  /**
   * @param hasError 是否包含错误提示
   * @param hasHelper 是否含 helper 属性或 helper slot
   */
  renderHelper(hasError, hasHelper) {
    return hasError ? html`<div part="error" class="error">${this.error || this.inputRef.value.validationMessage}</div>` : hasHelper ? html`<slot name="helper" part="helper" class="helper">${this.helper}</slot>` : (
      // 右边有 counter，需要占位
      html`<span></span>`
    );
  }
  renderCounter(hasCounter) {
    return hasCounter ? html`<div part="counter" class="counter">${this.value.length}/${this.maxlength}</div>` : nothingTemplate;
  }
};
TextField.styles = [componentStyle, style19];
__decorate([
  property({ reflect: true })
], TextField.prototype, "variant", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "type", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "name", void 0);
__decorate([
  property()
], TextField.prototype, "value", void 0);
__decorate([
  defaultValue()
], TextField.prototype, "defaultValue", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "label", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "placeholder", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "helper", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "helper-on-focus"
  })
], TextField.prototype, "helperOnFocus", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TextField.prototype, "clearable", void 0);
__decorate([
  property({ reflect: true, attribute: "clear-icon" })
], TextField.prototype, "clearIcon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "end-aligned"
  })
], TextField.prototype, "endAligned", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "prefix", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "suffix", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-icon" })
], TextField.prototype, "endIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "error-icon" })
], TextField.prototype, "errorIcon", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "form", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TextField.prototype, "readonly", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TextField.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TextField.prototype, "required", void 0);
__decorate([
  property({ type: Number, reflect: true })
], TextField.prototype, "rows", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TextField.prototype, "autosize", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "min-rows" })
], TextField.prototype, "minRows", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "max-rows" })
], TextField.prototype, "maxRows", void 0);
__decorate([
  property({ type: Number, reflect: true })
], TextField.prototype, "minlength", void 0);
__decorate([
  property({ type: Number, reflect: true })
], TextField.prototype, "maxlength", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TextField.prototype, "counter", void 0);
__decorate([
  property({ type: Number, reflect: true })
], TextField.prototype, "min", void 0);
__decorate([
  property({ type: Number, reflect: true })
], TextField.prototype, "max", void 0);
__decorate([
  property({ type: Number, reflect: true })
], TextField.prototype, "step", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "pattern", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "toggle-password"
  })
], TextField.prototype, "togglePassword", void 0);
__decorate([
  property({ reflect: true, attribute: "show-password-icon" })
], TextField.prototype, "showPasswordIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "hide-password-icon" })
], TextField.prototype, "hidePasswordIcon", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "autocapitalize", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "autocorrect", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "autocomplete", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "enterkeyhint", void 0);
__decorate([
  property({ type: Boolean, reflect: true, converter: booleanConverter })
], TextField.prototype, "spellcheck", void 0);
__decorate([
  property({ reflect: true })
], TextField.prototype, "inputmode", void 0);
__decorate([
  state()
], TextField.prototype, "invalid", void 0);
__decorate([
  state()
], TextField.prototype, "invalidStyle", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "focused-style"
  })
], TextField.prototype, "focusedStyle", void 0);
__decorate([
  state()
], TextField.prototype, "isPasswordVisible", void 0);
__decorate([
  state()
], TextField.prototype, "hasValue", void 0);
__decorate([
  state()
], TextField.prototype, "error", void 0);
__decorate([
  watch("disabled", true)
], TextField.prototype, "onDisabledChange", null);
__decorate([
  watch("value")
], TextField.prototype, "onValueChange", null);
__decorate([
  watch("rows", true)
], TextField.prototype, "onRowsChange", null);
__decorate([
  watch("maxRows")
], TextField.prototype, "onMaxRowsChange", null);
__decorate([
  watch("minRows")
], TextField.prototype, "onMinRowsChange", null);
TextField = __decorate([
  customElement("mdui-text-field")
], TextField);

// node_modules/mdui/components/select/style.js
var style20 = css`:host{display:inline-block;width:100%}.hidden-input{display:none}.text-field{cursor:pointer}.chips{display:flex;flex-wrap:wrap;margin:-.5rem -.25rem;min-height:2.5rem}:host([variant=filled][label]) .chips{margin:0 -.25rem -1rem -.25rem}.chip{margin:.25rem}mdui-menu{max-width:none}`;

// node_modules/mdui/components/select/index.js
var Select = class Select2 extends FocusableMixin(MduiElement) {
  constructor() {
    super(...arguments);
    this.variant = "filled";
    this.multiple = false;
    this.name = "";
    this.value = "";
    this.defaultValue = "";
    this.clearable = false;
    this.placement = "auto";
    this.endAligned = false;
    this.readonly = false;
    this.disabled = false;
    this.required = false;
    this.invalid = false;
    this.menuRef = createRef();
    this.textFieldRef = createRef();
    this.hiddenInputRef = createRef();
    this.formController = new FormController(this);
    this.hasSlotController = new HasSlotController(this, "icon", "end-icon", "error-icon", "prefix", "suffix", "clear-button", "clear-icon", "helper");
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-menu-item"]
    });
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    return this.hiddenInputRef.value.validity;
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    return this.hiddenInputRef.value.validationMessage;
  }
  get focusElement() {
    return this.textFieldRef.value;
  }
  get focusDisabled() {
    return this.disabled;
  }
  connectedCallback() {
    super.connectedCallback();
    this.value = this.multiple && isString(this.value) ? this.value ? [this.value] : [] : this.value;
    this.defaultValue = this.multiple ? [] : "";
    this.definedController.whenDefined().then(() => {
      this.requestUpdate();
    });
    this.updateComplete.then(() => {
      this.observeResize = observeResize(this.textFieldRef.value, () => this.resizeMenu());
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.observeResize?.unobserve();
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    const valid = this.hiddenInputRef.value.checkValidity();
    if (!valid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
    }
    return valid;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    this.invalid = !this.hiddenInputRef.value.reportValidity();
    if (this.invalid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      this.focus();
    }
    return !this.invalid;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    this.hiddenInputRef.value.setCustomValidity(message);
    this.invalid = !this.hiddenInputRef.value.checkValidity();
  }
  render() {
    const hasSelection = this.multiple ? !!this.value.length : !!this.value;
    return html`${this.multiple ? html`<select ${ref(this.hiddenInputRef)} class="hidden-input" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .required="${this.required}" .disabled="${this.disabled}" multiple="multiple" tabindex="-1">${map2(this.value, (value) => html`<option selected="selected" value="${value}"></option>`)}</select>` : html`<input ${ref(this.hiddenInputRef)} type="radio" class="hidden-input" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .required="${this.required}" .disabled="${this.disabled}" .checked="${hasSelection}" tabindex="-1">`}<mdui-dropdown .stayOpenOnClick="${this.multiple}" .disabled="${this.readonly || this.disabled}" .placement="${this.placement === "top" ? "top-start" : this.placement === "bottom" ? "bottom-start" : "auto"}" @open="${this.onDropdownOpen}" @close="${this.onDropdownClose}"><mdui-text-field ${ref(this.textFieldRef)} slot="trigger" part="text-field" class="text-field" exportparts="${[
      "container",
      "icon",
      "end-icon",
      "error-icon",
      "prefix",
      "suffix",
      "label",
      "input",
      "clear-button",
      "clear-icon",
      "supporting",
      "helper",
      "error"
    ].map((v) => `${v}:text-field__${v}`).join(",")}" readonly="readonly" .readonlyButClearable="${true}" .variant="${this.variant}" .name="${this.name}" .value="${this.multiple ? this.value.length ? " " : "" : this.getMenuItemLabelByValue(this.value)}" .label="${this.label}" .placeholder="${this.placeholder}" .helper="${this.helper}" .error="${this.hiddenInputRef.value?.validationMessage}" .clearable="${this.clearable}" .clearIcon="${this.clearIcon}" .endAligned="${this.endAligned}" .prefix="${this.prefix}" .suffix="${this.suffix}" .icon="${this.icon}" .endIcon="${this.endIcon}" .errorIcon="${this.errorIcon}" .form="${this.form}" .disabled="${this.disabled}" .required="${this.required}" .invalidStyle="${this.invalid}" @clear="${this.onClear}" @change="${(e) => e.stopPropagation()}" @keydown="${this.onTextFieldKeyDown}">${map2([
      "icon",
      "end-icon",
      "error-icon",
      "prefix",
      "suffix",
      "clear-button",
      "clear-icon",
      "helper"
    ], (slotName) => this.hasSlotController.test(slotName) ? html`<slot name="${slotName}" slot="${slotName}"></slot>` : nothing)} ${when(this.multiple && this.value.length, () => html`<div slot="input" class="chips" part="chips">${map2(this.value, (valueItem) => html`<mdui-chip class="chip" part="chip" exportparts="${["button", "label", "delete-icon"].map((v) => `${v}:chip__${v}`).join(",")}" variant="input" deletable tabindex="-1" @delete="${() => this.onDeleteOneValue(valueItem)}">${this.getMenuItemLabelByValue(valueItem)}</mdui-chip>`)}</div>`)}</mdui-text-field><mdui-menu ${ref(this.menuRef)} part="menu" .selects="${this.multiple ? "multiple" : "single"}" .value="${this.value}" @change="${this.onValueChange}"><slot></slot></mdui-menu></mdui-dropdown>`;
  }
  getMenuItemLabelByValue(valueItem) {
    if (!this.menuItems.length) {
      return valueItem;
    }
    return this.menuItems.find((item) => item.value === valueItem)?.textContent?.trim() || valueItem;
  }
  resizeMenu() {
    this.menuRef.value.style.width = `${this.textFieldRef.value.clientWidth}px`;
  }
  async onDropdownOpen() {
    this.textFieldRef.value.focusedStyle = true;
  }
  onDropdownClose() {
    this.textFieldRef.value.focusedStyle = false;
    if (this.contains(document.activeElement) || this.contains(document.activeElement?.assignedSlot ?? null)) {
      setTimeout(() => {
        this.focus();
      });
    }
  }
  async onValueChange(e) {
    const menu = e.target;
    this.value = this.multiple ? menu.value.map((v) => v ?? "") : menu.value ?? "";
    await this.updateComplete;
    const form = this.formController.getForm();
    if (form && formResets.get(form)?.has(this)) {
      this.invalid = false;
      formResets.get(form).delete(this);
    } else {
      this.invalid = !this.hiddenInputRef.value.checkValidity();
    }
  }
  /**
   * multiple 为 true 时，点 chip 的删除按钮，删除其中一个值
   */
  onDeleteOneValue(valueItem) {
    const value = [...this.value];
    if (value.includes(valueItem)) {
      value.splice(value.indexOf(valueItem), 1);
    }
    this.value = value;
  }
  onClear() {
    this.value = this.multiple ? [] : "";
  }
  /**
   * 焦点在 text-field 上时，按下回车键，打开下拉选项
   */
  onTextFieldKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.textFieldRef.value.click();
    }
  }
};
Select.styles = [componentStyle, style20];
__decorate([
  property({ reflect: true })
], Select.prototype, "variant", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Select.prototype, "multiple", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "name", void 0);
__decorate([
  property()
], Select.prototype, "value", void 0);
__decorate([
  defaultValue()
], Select.prototype, "defaultValue", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "label", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "placeholder", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "helper", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Select.prototype, "clearable", void 0);
__decorate([
  property({ reflect: true, attribute: "clear-icon" })
], Select.prototype, "clearIcon", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "placement", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "end-aligned"
  })
], Select.prototype, "endAligned", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "prefix", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "suffix", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "icon", void 0);
__decorate([
  property({ reflect: true, attribute: "end-icon" })
], Select.prototype, "endIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "error-icon" })
], Select.prototype, "errorIcon", void 0);
__decorate([
  property({ reflect: true })
], Select.prototype, "form", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Select.prototype, "readonly", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Select.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Select.prototype, "required", void 0);
__decorate([
  state()
], Select.prototype, "invalid", void 0);
__decorate([
  queryAssignedElements({ flatten: true, selector: "mdui-menu-item" })
], Select.prototype, "menuItems", void 0);
Select = __decorate([
  customElement("mdui-select")
], Select);

// node_modules/mdui/components/slider/style.js
var style21 = css`.track-active{left:-.125rem;border-radius:var(--mdui-shape-corner-full) 0 0 var(--mdui-shape-corner-full)}`;

// node_modules/mdui/components/slider/index.js
var Slider = class Slider2 extends SliderBase {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.defaultValue = 0;
    this.rippleRef = createRef();
    this.handleRef = createRef();
    this.formController = new FormController(this);
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  async onValueChange() {
    this.value = this.fixValue(this.value);
    const form = this.formController.getForm();
    if (form && formResets.get(form)?.has(this)) {
      this.invalid = false;
      formResets.get(form).delete(this);
    } else {
      await this.updateComplete;
      this.invalid = !this.inputRef.value.checkValidity();
    }
    this.updateStyle();
  }
  connectedCallback() {
    super.connectedCallback();
    this.value = this.fixValue(this.value);
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    const onTouchStart = () => {
      if (!this.disabled) {
        this.labelVisible = true;
      }
    };
    const onTouchEnd = () => {
      if (!this.disabled) {
        this.labelVisible = false;
      }
    };
    this.addEventListener("touchstart", onTouchStart);
    this.addEventListener("mousedown", onTouchStart);
    this.addEventListener("touchend", onTouchEnd);
    this.addEventListener("mouseup", onTouchEnd);
    this.updateStyle();
  }
  /**
   * <input /> 用于提供拖拽操作
   * <input class="invalid" /> 用于提供 html5 自带的表单错误提示
   */
  render() {
    return html`<label class="${classMap({ invalid: this.invalid })}"><input ${ref(this.inputRef)} type="range" step="${this.step}" min="${this.min}" max="${this.max}" ?disabled="${this.disabled}" .value="${live(this.value.toString())}" @input="${this.onInput}" @change="${this.onChange}"><div part="track-inactive" class="track-inactive"></div><div ${ref(this.trackActiveRef)} part="track-active" class="track-active"></div><div ${ref(this.handleRef)} part="handle" class="handle"><div class="elevation"></div><mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.renderLabel(this.value)}</div>${when(this.tickmarks, () => map2(this.getCandidateValues(), (value) => html`<div part="tickmark" class="tickmark ${classMap({ active: value < this.value })}" style="${styleMap({
      left: `${(value - this.min) / this.max * 100}%`,
      display: value === this.value ? "none" : "block"
    })}"></div>`))}</label>`;
  }
  updateStyle() {
    const percent = (this.value - this.min) / (this.max - this.min) * 100;
    this.trackActiveRef.value.style.width = `${percent}%`;
    this.handleRef.value.style.left = `${percent}%`;
  }
  onInput() {
    this.value = parseFloat(this.inputRef.value.value);
    this.updateStyle();
  }
};
Slider.styles = [SliderBase.styles, style21];
__decorate([
  property({ type: Number })
], Slider.prototype, "value", void 0);
__decorate([
  defaultValue()
], Slider.prototype, "defaultValue", void 0);
__decorate([
  watch("value", true)
], Slider.prototype, "onValueChange", null);
Slider = __decorate([
  customElement("mdui-slider")
], Slider);

// node_modules/mdui/components/snackbar/style.js
var style22 = css`:host{--shape-corner:var(--mdui-shape-corner-extra-small);--z-index:2400;position:fixed;z-index:var(--z-index);display:none;align-items:center;flex-wrap:wrap;border-radius:var(--shape-corner);transform:scaleY(0);transition:transform 0s var(--mdui-motion-easing-linear) var(--mdui-motion-duration-short4);min-width:20rem;max-width:36rem;padding:.25rem 0;box-shadow:var(--mdui-elevation-level3);background-color:rgb(var(--mdui-color-inverse-surface));color:rgb(var(--mdui-color-inverse-on-surface));font-size:var(--mdui-typescale-body-medium-size);font-weight:var(--mdui-typescale-body-medium-weight);letter-spacing:var(--mdui-typescale-body-medium-tracking);line-height:var(--mdui-typescale-body-medium-line-height)}:host([placement^=top]){transform-origin:top}:host([placement^=bottom]){transform-origin:bottom}:host([placement=bottom-start]:not([mobile])),:host([placement=top-start]:not([mobile])){left:1rem}:host([placement=bottom-end]:not([mobile])),:host([placement=top-end]:not([mobile])){right:1rem}:host([placement=bottom]:not([mobile])),:host([placement=top]:not([mobile])){left:50%;transform:scaleY(0) translateX(-50%)}:host([mobile]){min-width:0;left:1rem;right:1rem}:host([open]){transform:scaleY(1);transition:top var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard),bottom var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard),transform var(--mdui-motion-duration-medium4) var(--mdui-motion-easing-emphasized-decelerate)}:host([placement=bottom][open]:not([mobile])),:host([placement=top][open]:not([mobile])){transform:scaleY(1) translateX(-50%)}.message{display:block;margin:.625rem 1rem}:host([message-line='1']) .message{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host([message-line='2']) .message{display:-webkit-box;overflow:hidden;text-overflow:ellipsis;-webkit-box-orient:vertical;-webkit-line-clamp:2}.action-group{display:flex;align-items:center;margin-left:auto;padding-right:.5rem}.action,.close-button{display:inline-flex;align-items:center;justify-content:center}.action{color:rgb(var(--mdui-color-inverse-primary));font-size:var(--mdui-typescale-label-large-size);font-weight:var(--mdui-typescale-label-large-weight);letter-spacing:var(--mdui-typescale-label-large-tracking)}.action mdui-button,::slotted(mdui-button[slot=action][variant=outlined]),::slotted(mdui-button[slot=action][variant=text]){color:inherit;font-size:inherit;font-weight:inherit;letter-spacing:inherit;--mdui-comp-ripple-state-layer-color:var(--mdui-color-inverse-primary)}.action mdui-button::part(button){padding:0 .5rem}.close-button{margin:0 -.25rem 0 .25rem;font-size:1.5rem;color:rgb(var(--mdui-color-inverse-on-surface))}.close-button mdui-button-icon,::slotted(mdui-button-icon[slot=close-button][variant=outlined]),::slotted(mdui-button-icon[slot=close-button][variant=standard]){font-size:inherit;color:inherit;--mdui-comp-ripple-state-layer-color:var(--mdui-color-inverse-on-surface)}.close-button .i,::slotted([slot=close-icon]){font-size:inherit}`;

// node_modules/mdui/components/snackbar/index.js
var stacks = [];
var reordering = false;
var Snackbar = class Snackbar2 extends MduiElement {
  constructor() {
    super();
    this.open = false;
    this.placement = "bottom";
    this.actionLoading = false;
    this.closeable = false;
    this.autoCloseDelay = 5e3;
    this.closeOnOutsideClick = false;
    this.mobile = false;
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }
  async onOpenChange() {
    const easingLinear = getEasing(this, "linear");
    const children = Array.from(this.renderRoot.querySelectorAll(".message, .action-group"));
    if (this.open) {
      const hasUpdated = this.hasUpdated;
      if (!hasUpdated) {
        await this.updateComplete;
      }
      if (hasUpdated) {
        const eventProceeded = this.emit("open", { cancelable: true });
        if (!eventProceeded) {
          return;
        }
      }
      window.clearTimeout(this.closeTimeout);
      if (this.autoCloseDelay) {
        this.closeTimeout = window.setTimeout(() => {
          this.open = false;
        }, this.autoCloseDelay);
      }
      this.style.display = "flex";
      await Promise.all([
        stopAnimations(this),
        ...children.map((child) => stopAnimations(child))
      ]);
      stacks.push({
        height: this.clientHeight,
        snackbar: this
      });
      await this.reorderStack(this);
      const duration = getDuration(this, "medium4");
      await Promise.all([
        animateTo(this, [{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 1 }], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear,
          fill: "forwards"
        }),
        ...children.map((child) => animateTo(child, [
          { opacity: 0 },
          { opacity: 0, offset: 0.2 },
          { opacity: 1, offset: 0.8 },
          { opacity: 1 }
        ], {
          duration: hasUpdated ? duration : 0,
          easing: easingLinear
        }))
      ]);
      if (hasUpdated) {
        this.emit("opened");
      }
      return;
    }
    if (!this.open && this.hasUpdated) {
      const eventProceeded = this.emit("close", { cancelable: true });
      if (!eventProceeded) {
        return;
      }
      window.clearTimeout(this.closeTimeout);
      await Promise.all([
        stopAnimations(this),
        ...children.map((child) => stopAnimations(child))
      ]);
      const duration = getDuration(this, "short4");
      await Promise.all([
        animateTo(this, [{ opacity: 1 }, { opacity: 0 }], {
          duration,
          easing: easingLinear,
          fill: "forwards"
        }),
        ...children.map((child) => animateTo(child, [{ opacity: 1 }, { opacity: 0, offset: 0.75 }, { opacity: 0 }], {
          duration,
          easing: easingLinear
        }))
      ]);
      this.style.display = "none";
      this.emit("closed");
      const stackIndex = stacks.findIndex((stack) => stack.snackbar === this);
      stacks.splice(stackIndex, 1);
      if (stacks[stackIndex]) {
        await this.reorderStack(stacks[stackIndex].snackbar);
      }
      return;
    }
  }
  /**
   * 这两个属性变更时，需要重新排序该组件后面的 snackbar
   */
  async onStackChange() {
    await this.reorderStack(this);
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.onDocumentClick);
    this.mobile = breakpoint().down("sm");
    this.observeResize = observeResize(document.documentElement, async () => {
      const mobile = breakpoint().down("sm");
      if (this.mobile !== mobile) {
        this.mobile = mobile;
        if (!reordering) {
          reordering = true;
          await this.reorderStack();
          reordering = false;
        }
      }
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onDocumentClick);
    window.clearTimeout(this.closeTimeout);
    if (this.open) {
      this.open = false;
    }
    this.observeResize?.unobserve();
  }
  render() {
    return html`<slot part="message" class="message"></slot><div class="action-group"><slot name="action" part="action" class="action" @click="${this.onActionClick}">${this.action ? html`<mdui-button variant="text" loading="${this.actionLoading}">${this.action}</mdui-button>` : nothingTemplate}</slot>${when(this.closeable, () => html`<slot name="close-button" part="close-button" class="close-button" @click="${this.onCloseClick}"><mdui-button-icon><slot name="close-icon" part="close-icon">${this.closeIcon ? html`<mdui-icon name="${this.closeIcon}" class="i"></mdui-icon>` : html`<mdui-icon-clear class="i"></mdui-icon-clear>`}</slot></mdui-button-icon></slot>`)}</div>`;
  }
  /**
   * 重新排序 snackbar 堆叠
   * @param startSnackbar 从哪个 snackbar 开始重新排列，默认从第一个开始
   * @private
   */
  async reorderStack(startSnackbar) {
    const stackIndex = startSnackbar ? stacks.findIndex((stack) => stack.snackbar === startSnackbar) : 0;
    for (let i = stackIndex; i < stacks.length; i++) {
      const stack = stacks[i];
      const snackbar2 = stack.snackbar;
      if (this.mobile) {
        ["top", "bottom"].forEach((placement) => {
          if (snackbar2.placement.startsWith(placement)) {
            const prevStacks = stacks.filter((stack2, index) => {
              return index < i && stack2.snackbar.placement.startsWith(placement);
            });
            const prevHeight = prevStacks.reduce((prev, current) => prev + current.height, 0);
            snackbar2.style[placement] = `calc(${prevHeight}px + ${prevStacks.length + 1}rem)`;
            snackbar2.style[placement === "top" ? "bottom" : "top"] = "auto";
          }
        });
      } else {
        [
          "top",
          "top-start",
          "top-end",
          "bottom",
          "bottom-start",
          "bottom-end"
        ].forEach((placement) => {
          if (snackbar2.placement === placement) {
            const prevStacks = stacks.filter((stack2, index) => {
              return index < i && stack2.snackbar.placement === placement;
            });
            const prevHeight = prevStacks.reduce((prev, current) => prev + current.height, 0);
            snackbar2.style[placement.startsWith("top") ? "top" : "bottom"] = `calc(${prevHeight}px + ${prevStacks.length + 1}rem)`;
            snackbar2.style[placement.startsWith("top") ? "bottom" : "top"] = "auto";
          }
        });
      }
    }
  }
  /**
   * 在 document 上点击时，根据条件判断是否要关闭 snackbar
   */
  onDocumentClick(e) {
    if (!this.open || !this.closeOnOutsideClick) {
      return;
    }
    const target = e.target;
    if (!this.contains(target) && this !== target) {
      this.open = false;
    }
  }
  onActionClick(event) {
    event.stopPropagation();
    this.emit("action-click");
  }
  onCloseClick() {
    this.open = false;
  }
};
Snackbar.styles = [componentStyle, style22];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Snackbar.prototype, "open", void 0);
__decorate([
  property({ reflect: true })
], Snackbar.prototype, "placement", void 0);
__decorate([
  property({ reflect: true, attribute: "action" })
], Snackbar.prototype, "action", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "action-loading"
  })
], Snackbar.prototype, "actionLoading", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Snackbar.prototype, "closeable", void 0);
__decorate([
  property({ reflect: true, attribute: "close-icon" })
], Snackbar.prototype, "closeIcon", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "message-line" })
  // eslint-disable-next-line prettier/prettier
], Snackbar.prototype, "messageLine", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "auto-close-delay" })
], Snackbar.prototype, "autoCloseDelay", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    attribute: "close-on-outside-click",
    converter: booleanConverter
  })
], Snackbar.prototype, "closeOnOutsideClick", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Snackbar.prototype, "mobile", void 0);
__decorate([
  watch("open")
], Snackbar.prototype, "onOpenChange", null);
__decorate([
  watch("placement", true),
  watch("messageLine", true)
], Snackbar.prototype, "onStackChange", null);
Snackbar = __decorate([
  customElement("mdui-snackbar")
], Snackbar);

// node_modules/mdui/components/switch/style.js
var style23 = css`:host{--shape-corner:var(--mdui-shape-corner-full);--shape-corner-thumb:var(--mdui-shape-corner-full);position:relative;display:inline-block;cursor:pointer;-webkit-tap-highlight-color:transparent;height:2.5rem}:host([disabled]:not([disabled=false i])){cursor:default;pointer-events:none}label{display:inline-flex;align-items:center;width:100%;height:100%;white-space:nowrap;cursor:inherit;-webkit-user-select:none;user-select:none;touch-action:manipulation;zoom:1;-webkit-user-drag:none}.track{position:relative;display:flex;align-items:center;border-radius:var(--shape-corner);transition-property:background-color,border-width;transition-duration:var(--mdui-motion-duration-short4);transition-timing-function:var(--mdui-motion-easing-standard);height:2rem;width:3.25rem;border:.125rem solid rgb(var(--mdui-color-outline));background-color:rgb(var(--mdui-color-surface-container-highest))}:host([checked]:not([checked=false i])) .track{background-color:rgb(var(--mdui-color-primary));border-width:0}.invalid .track{background-color:rgb(var(--mdui-color-error-container));border-color:rgb(var(--mdui-color-error))}:host([disabled]:not([disabled=false i])) .track{background-color:rgba(var(--mdui-color-surface-container-highest),.12);border-color:rgba(var(--mdui-color-on-surface),.12)}:host([disabled][checked]:not([disabled=false i],[checked=false i])) .track{background-color:rgba(var(--mdui-color-on-surface),.12)}input{position:absolute;padding:0;opacity:0;pointer-events:none;width:1.25rem;height:1.25rem;margin:0 0 0 .625rem}mdui-ripple{border-radius:50%;transition-property:left,top;transition-duration:var(--mdui-motion-duration-short4);transition-timing-function:var(--mdui-motion-easing-standard);width:2.5rem;height:2.5rem}.thumb{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:var(--shape-corner-thumb);transition-property:width,height,left,background-color;transition-duration:var(--mdui-motion-duration-short4);transition-timing-function:var(--mdui-motion-easing-standard);height:1rem;width:1rem;left:.375rem;background-color:rgb(var(--mdui-color-outline));--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}.thumb mdui-ripple{left:-.75rem;top:-.75rem}.has-unchecked-icon .thumb{height:1.5rem;width:1.5rem;left:.125rem}.has-unchecked-icon .thumb mdui-ripple{left:-.5rem;top:-.5rem}:host([focus-visible]) .thumb,:host([hover]) .thumb,:host([pressed]) .thumb{background-color:rgb(var(--mdui-color-on-surface-variant))}:host([checked]:not([checked=false i])) .thumb{height:1.5rem;width:1.5rem;left:1.5rem;background-color:rgb(var(--mdui-color-on-primary));--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}:host([checked]:not([checked=false i])) .thumb mdui-ripple{left:-.5rem;top:-.5rem}:host([pressed]) .thumb{height:1.75rem;width:1.75rem;left:0}:host([pressed]) .thumb mdui-ripple{left:-.375rem;top:-.375rem}:host([pressed][checked]:not([checked=false i])) .thumb{left:1.375rem}:host([focus-visible][checked]:not([checked=false i])) .thumb,:host([hover][checked]:not([checked=false i])) .thumb,:host([pressed][checked]:not([checked=false i])) .thumb{background-color:rgb(var(--mdui-color-primary-container))}.invalid .thumb{background-color:rgb(var(--mdui-color-error));--mdui-comp-ripple-state-layer-color:var(--mdui-color-error)}:host([focus-visible]) .invalid .thumb,:host([hover]) .invalid .thumb,:host([pressed]) .invalid .thumb{background-color:rgb(var(--mdui-color-error))}:host([disabled]:not([disabled=false i])) .thumb{background-color:rgba(var(--mdui-color-on-surface),.38)}:host([disabled][checked]:not([disabled=false i],[checked=false i])) .thumb{background-color:rgb(var(--mdui-color-surface))}.checked-icon,.unchecked-icon{display:flex;position:absolute;transition-property:opacity,transform;font-size:1rem}.unchecked-icon{opacity:1;transform:scale(1);transition-delay:var(--mdui-motion-duration-short1);transition-duration:var(--mdui-motion-duration-short3);transition-timing-function:var(--mdui-motion-easing-linear);color:rgb(var(--mdui-color-surface-container-highest))}:host([checked]:not([checked=false i])) .unchecked-icon{opacity:0;transform:scale(.92);transition-delay:0s;transition-duration:var(--mdui-motion-duration-short1)}:host([disabled]:not([disabled=false i])) .unchecked-icon{color:rgba(var(--mdui-color-surface-container-highest),.38)}.checked-icon{opacity:0;transform:scale(.92);transition-delay:0s;transition-duration:var(--mdui-motion-duration-short1);transition-timing-function:var(--mdui-motion-easing-linear);color:rgb(var(--mdui-color-on-primary-container))}:host([checked]:not([checked=false i])) .checked-icon{opacity:1;transform:scale(1);transition-delay:var(--mdui-motion-duration-short1);transition-duration:var(--mdui-motion-duration-short3)}.invalid .checked-icon{color:rgb(var(--mdui-color-error-container))}:host([disabled]:not([disabled=false i])) .checked-icon{color:rgba(var(--mdui-color-on-surface),.38)}.checked-icon .i,.unchecked-icon .i,::slotted([slot=checked-icon]),::slotted([slot=unchecked-icon]){font-size:inherit;color:inherit}`;

// node_modules/mdui/components/switch/index.js
var Switch = class Switch2 extends RippleMixin(FocusableMixin(MduiElement)) {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.checked = false;
    this.defaultChecked = false;
    this.required = false;
    this.name = "";
    this.value = "on";
    this.invalid = false;
    this.rippleRef = createRef();
    this.inputRef = createRef();
    this.formController = new FormController(this, {
      value: (control) => control.checked ? control.value : void 0,
      defaultValue: (control) => control.defaultChecked,
      setValue: (control, checked) => control.checked = checked
    });
    this.hasSlotController = new HasSlotController(this, "unchecked-icon");
  }
  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  get validity() {
    return this.inputRef.value.validity;
  }
  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
   */
  get validationMessage() {
    return this.inputRef.value.validationMessage;
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return this.disabled;
  }
  get focusElement() {
    return this.inputRef.value;
  }
  get focusDisabled() {
    return this.disabled;
  }
  async onDisabledChange() {
    await this.updateComplete;
    this.invalid = !this.inputRef.value.checkValidity();
  }
  async onCheckedChange() {
    await this.updateComplete;
    const form = this.formController.getForm();
    if (form && formResets.get(form)?.has(this)) {
      this.invalid = false;
      formResets.get(form).delete(this);
    } else {
      this.invalid = !this.inputRef.value.checkValidity();
    }
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  checkValidity() {
    const valid = this.inputRef.value.checkValidity();
    if (!valid) {
      this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
    }
    return valid;
  }
  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  reportValidity() {
    this.invalid = !this.inputRef.value.reportValidity();
    if (this.invalid) {
      const eventProceeded = this.emit("invalid", {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      if (!eventProceeded) {
        this.blur();
        this.focus();
      }
    }
    return !this.invalid;
  }
  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  setCustomValidity(message) {
    this.inputRef.value.setCustomValidity(message);
    this.invalid = !this.inputRef.value.checkValidity();
  }
  render() {
    return html`<label class="${classMap({
      invalid: this.invalid,
      "has-unchecked-icon": this.uncheckedIcon || this.hasSlotController.test("unchecked-icon")
    })}"><input ${ref(this.inputRef)} type="checkbox" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .disabled="${this.disabled}" .checked="${live(this.checked)}" .required="${this.required}" @change="${this.onChange}"><div part="track" class="track"><div part="thumb" class="thumb"><mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple><slot name="checked-icon" part="checked-icon" class="checked-icon">${this.checkedIcon ? html`<mdui-icon name="${this.checkedIcon}" class="i"></mdui-icon>` : this.checkedIcon === "" ? nothingTemplate : html`<mdui-icon-check class="i"></mdui-icon-check>`}</slot><slot name="unchecked-icon" part="unchecked-icon" class="unchecked-icon">${this.uncheckedIcon ? html`<mdui-icon name="${this.uncheckedIcon}" class="i"></mdui-icon>` : nothingTemplate}</slot></div></div></label>`;
  }
  /**
   * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
   */
  onChange() {
    this.checked = this.inputRef.value.checked;
    this.emit("change");
  }
};
Switch.styles = [componentStyle, style23];
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Switch.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Switch.prototype, "checked", void 0);
__decorate([
  defaultValue("checked")
], Switch.prototype, "defaultChecked", void 0);
__decorate([
  property({ reflect: true, attribute: "unchecked-icon" })
], Switch.prototype, "uncheckedIcon", void 0);
__decorate([
  property({ reflect: true, attribute: "checked-icon" })
], Switch.prototype, "checkedIcon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Switch.prototype, "required", void 0);
__decorate([
  property({ reflect: true })
], Switch.prototype, "form", void 0);
__decorate([
  property({ reflect: true })
], Switch.prototype, "name", void 0);
__decorate([
  property({ reflect: true })
], Switch.prototype, "value", void 0);
__decorate([
  state()
], Switch.prototype, "invalid", void 0);
__decorate([
  watch("disabled", true),
  watch("required", true)
], Switch.prototype, "onDisabledChange", null);
__decorate([
  watch("checked", true)
], Switch.prototype, "onCheckedChange", null);
Switch = __decorate([
  customElement("mdui-switch")
], Switch);

// node_modules/mdui/components/tabs/tab-style.js
var tabStyle = css`:host{position:relative;--mdui-comp-ripple-state-layer-color:var(--mdui-color-on-surface)}:host([active]){--mdui-comp-ripple-state-layer-color:var(--mdui-color-primary)}.container{display:flex;justify-content:center;align-items:center;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;height:100%}.preset{flex-direction:column;min-height:3rem;padding:.625rem 1rem}:host([inline]:not([inline=false i])) .preset{flex-direction:row}.icon-container,.label-container{position:relative;display:flex;align-items:center;justify-content:center}.icon-container ::slotted([slot=badge]){position:absolute;transform:translate(50%,-50%)}.icon-container ::slotted([slot=badge][variant=small]){transform:translate(.5625rem,-.5625rem)}.label-container ::slotted([slot=badge]){position:absolute;left:100%;bottom:100%;transform:translate(-.75rem,.625rem)}.label-container ::slotted([slot=badge][variant=small]){transform:translate(-.375rem,.375rem)}.icon,.label{display:flex;color:rgb(var(--mdui-color-on-surface-variant))}:host([focused]) .icon,:host([focused]) .label,:host([hover]) .icon,:host([hover]) .label,:host([pressed]) .icon,:host([pressed]) .label{color:rgb(var(--mdui-color-on-surface))}:host([active]) .icon,:host([active]) .label{color:rgb(var(--mdui-color-primary))}:host([active]) .variant-secondary .icon,:host([active]) .variant-secondary .label{color:rgb(var(--mdui-color-on-surface))}.icon{font-size:1.5rem}.label{font-size:var(--mdui-typescale-title-small-size);font-weight:var(--mdui-typescale-title-small-weight);letter-spacing:var(--mdui-typescale-title-small-tracking);line-height:var(--mdui-typescale-title-small-line-height)}.icon mdui-icon,::slotted([slot=icon]){font-size:inherit;color:inherit}`;

// node_modules/mdui/components/tabs/tab.js
var Tab = class Tab2 extends RippleMixin(FocusableMixin(MduiElement)) {
  constructor() {
    super(...arguments);
    this.inline = false;
    this.active = false;
    this.variant = "primary";
    this.key = uniqueId();
    this.rippleRef = createRef();
    this.hasSlotController = new HasSlotController(this, "icon", "custom");
  }
  get rippleElement() {
    return this.rippleRef.value;
  }
  get rippleDisabled() {
    return false;
  }
  get focusElement() {
    return this;
  }
  get focusDisabled() {
    return false;
  }
  render() {
    const hasIcon = this.icon || this.hasSlotController.test("icon");
    const hasCustomSlot = this.hasSlotController.test("custom");
    const renderBadge = () => html`<slot name="badge"></slot>`;
    return html`<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple><div part="container" class="${classMap({
      container: true,
      preset: !hasCustomSlot,
      "variant-secondary": this.variant === "secondary"
    })}"><slot name="custom"><div class="icon-container">${when(hasIcon || this.icon, renderBadge)}<slot name="icon" part="icon" class="icon">${this.icon ? html`<mdui-icon name="${this.icon}"></mdui-icon>` : nothingTemplate}</slot></div><div class="label-container">${when(!hasIcon, renderBadge)}<slot part="label" class="label"></slot></div></slot></div>`;
  }
};
Tab.styles = [componentStyle, tabStyle];
__decorate([
  property({ reflect: true })
], Tab.prototype, "value", void 0);
__decorate([
  property({ reflect: true })
], Tab.prototype, "icon", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Tab.prototype, "inline", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Tab.prototype, "active", void 0);
__decorate([
  state()
], Tab.prototype, "variant", void 0);
Tab = __decorate([
  customElement("mdui-tab")
], Tab);

// node_modules/mdui/components/tabs/tab-panel-style.js
var tabPanelStyle = css`:host{display:block;overflow-y:auto;flex:1 1 auto}:host(:not([active])){display:none}`;

// node_modules/mdui/components/tabs/tab-panel.js
var TabPanel = class TabPanel2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.active = false;
  }
  render() {
    return html`<slot></slot>`;
  }
};
TabPanel.styles = [
  componentStyle,
  tabPanelStyle
];
__decorate([
  property({ reflect: true })
], TabPanel.prototype, "value", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TabPanel.prototype, "active", void 0);
TabPanel = __decorate([
  customElement("mdui-tab-panel")
], TabPanel);

// node_modules/mdui/components/tabs/tabs-style.js
var tabsStyle = css`:host{position:relative;display:flex}:host([placement^=top]){flex-direction:column}:host([placement^=bottom]){flex-direction:column-reverse}:host([placement^=left]){flex-direction:row}:host([placement^=right]){flex-direction:row-reverse}.container{position:relative;display:flex;flex:0 0 auto;overflow-x:auto;background-color:rgb(var(--mdui-color-surface))}:host([placement^=bottom]) .container,:host([placement^=top]) .container{flex-direction:row}:host([placement^=left]) .container,:host([placement^=right]) .container{flex-direction:column}:host([placement$='-start']) .container{justify-content:flex-start}:host([placement=bottom]) .container,:host([placement=left]) .container,:host([placement=right]) .container,:host([placement=top]) .container{justify-content:center}:host([placement$='-end']) .container{justify-content:flex-end}.container::after{content:' ';position:absolute;background-color:rgb(var(--mdui-color-surface-variant))}:host([placement^=bottom]) .container::after,:host([placement^=top]) .container::after{left:0;width:100%;height:.0625rem}:host([placement^=top]) .container::after{bottom:0}:host([placement^=bottom]) .container::after{top:0}:host([placement^=left]) .container::after,:host([placement^=right]) .container::after{top:0;height:100%;width:.0625rem}:host([placement^=left]) .container::after{right:0}:host([placement^=right]) .container::after{left:0}.indicator{position:absolute;z-index:1;background-color:rgb(var(--mdui-color-primary))}.container:not(.initial) .indicator{transition-duration:var(--mdui-motion-duration-medium2);transition-timing-function:var(--mdui-motion-easing-standard-decelerate)}:host([placement^=bottom]) .indicator,:host([placement^=top]) .indicator{transition-property:transform,left,width}:host([placement^=left]) .indicator,:host([placement^=right]) .indicator{transition-property:transform,top,height}:host([placement^=top]) .indicator{bottom:0}:host([placement^=bottom]) .indicator{top:0}:host([placement^=left]) .indicator{right:0}:host([placement^=right]) .indicator{left:0}:host([placement^=bottom][variant=primary]) .indicator,:host([placement^=top][variant=primary]) .indicator{height:.1875rem}:host([placement^=bottom][variant=secondary]) .indicator,:host([placement^=top][variant=secondary]) .indicator{height:.125rem}:host([placement^=left][variant=primary]) .indicator,:host([placement^=right][variant=primary]) .indicator{width:.1875rem}:host([placement^=left][variant=secondary]) .indicator,:host([placement^=right][variant=secondary]) .indicator{width:.125rem}:host([placement^=top][variant=primary]) .indicator{border-top-left-radius:.1875rem;border-top-right-radius:.1875rem}:host([placement^=bottom][variant=primary]) .indicator{border-bottom-right-radius:.1875rem;border-bottom-left-radius:.1875rem}:host([placement^=left][variant=primary]) .indicator{border-top-left-radius:.1875rem;border-bottom-left-radius:.1875rem}:host([placement^=right][variant=primary]) .indicator{border-top-right-radius:.1875rem;border-bottom-right-radius:.1875rem}:host([full-width]:not([full-width=false i])) ::slotted(mdui-tab){flex:1}`;

// node_modules/mdui/components/tabs/tabs.js
var Tabs = class Tabs2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.variant = "primary";
    this.placement = "top-start";
    this.fullWidth = false;
    this.activeKey = 0;
    this.isInitial = true;
    this.containerRef = createRef();
    this.indicatorRef = createRef();
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-tab", "mdui-tab-panel"]
    });
  }
  async onActiveKeyChange() {
    await this.definedController.whenDefined();
    this.value = this.tabs.find((tab) => tab.key === this.activeKey)?.value;
    this.updateActive();
    if (!this.isInitial) {
      this.emit("change");
    }
  }
  async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();
    const tab = this.tabs.find((tab2) => tab2.value === this.value);
    this.activeKey = tab?.key ?? 0;
  }
  async onIndicatorChange() {
    await this.updateComplete;
    this.updateIndicator();
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => {
      this.observeResize = observeResize(this.containerRef.value, () => this.updateIndicator());
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.observeResize?.unobserve();
  }
  render() {
    return html`<div ${ref(this.containerRef)} part="container" class="container ${classMap({ initial: this.isInitial })}"><slot @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot><div ${ref(this.indicatorRef)} part="indicator" class="indicator"></div></div><slot name="panel" @slotchange="${this.onSlotChange}"></slot>`;
  }
  async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateActive();
  }
  async onClick(event) {
    if (event.button) {
      return;
    }
    await this.definedController.whenDefined();
    const target = event.target;
    const tab = target.closest("mdui-tab");
    if (!tab) {
      return;
    }
    this.activeKey = tab.key;
    this.isInitial = false;
    this.updateActive();
  }
  updateActive() {
    this.activeTab = this.tabs.map((tab) => {
      tab.active = this.activeKey === tab.key;
      return tab;
    }).find((tab) => tab.active);
    this.panels.forEach((panel) => panel.active = panel.value === this.activeTab?.value);
    this.updateIndicator();
  }
  updateIndicator() {
    const activeTab = this.activeTab;
    const $indicator = $(this.indicatorRef.value);
    const isVertical = this.placement.startsWith("left") || this.placement.startsWith("right");
    if (!activeTab) {
      $indicator.css({
        transform: isVertical ? "scaleY(0)" : "scaleX(0)"
      });
      return;
    }
    const $activeTab = $(activeTab);
    const offsetTop = activeTab.offsetTop;
    const offsetLeft = activeTab.offsetLeft;
    const commonStyle = isVertical ? { transform: "scaleY(1)", width: "", left: "" } : { transform: "scaleX(1)", height: "", top: "" };
    let shownStyle = {};
    if (this.variant === "primary") {
      const $customSlots = $activeTab.find(':scope > [slot="custom"]');
      const children = $customSlots.length ? $customSlots.get() : $(activeTab.renderRoot).find('slot[name="custom"]').children().get();
      if (isVertical) {
        const top = Math.min(...children.map((child) => child.offsetTop)) + offsetTop;
        const bottom = Math.max(...children.map((child) => child.offsetTop + child.offsetHeight)) + offsetTop;
        shownStyle = { top, height: bottom - top };
      } else {
        const left = Math.min(...children.map((child) => child.offsetLeft)) + offsetLeft;
        const right = Math.max(...children.map((child) => child.offsetLeft + child.offsetWidth)) + offsetLeft;
        shownStyle = { left, width: right - left };
      }
    }
    if (this.variant === "secondary") {
      shownStyle = isVertical ? { top: offsetTop, height: activeTab.offsetHeight } : { left: offsetLeft, width: activeTab.offsetWidth };
    }
    $indicator.css({ ...commonStyle, ...shownStyle });
  }
};
Tabs.styles = [componentStyle, tabsStyle];
__decorate([
  property({ reflect: true })
], Tabs.prototype, "variant", void 0);
__decorate([
  property({ reflect: true })
], Tabs.prototype, "value", void 0);
__decorate([
  property({ reflect: true })
], Tabs.prototype, "placement", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: "full-width"
  })
], Tabs.prototype, "fullWidth", void 0);
__decorate([
  state()
], Tabs.prototype, "activeKey", void 0);
__decorate([
  state()
], Tabs.prototype, "isInitial", void 0);
__decorate([
  queryAssignedElements({ selector: "mdui-tab", flatten: true })
], Tabs.prototype, "tabs", void 0);
__decorate([
  queryAssignedElements({
    selector: "mdui-tab-panel",
    slot: "panel",
    flatten: true
  })
], Tabs.prototype, "panels", void 0);
__decorate([
  watch("activeKey", true)
], Tabs.prototype, "onActiveKeyChange", null);
__decorate([
  watch("value")
], Tabs.prototype, "onValueChange", null);
__decorate([
  watch("variant", true),
  watch("placement", true),
  watch("fullWidth", true)
], Tabs.prototype, "onIndicatorChange", null);
Tabs = __decorate([
  customElement("mdui-tabs")
], Tabs);

// node_modules/@mdui/shared/controllers/hover.js
var HoverController = class {
  /**
   * @param host
   * @param elementRef 检查鼠标是否放在该元素上
   */
  constructor(host, elementRef) {
    this.isHover = false;
    this.uniqueID = uniqueId();
    this.enterEventName = `mouseenter.${this.uniqueID}.hoverController`;
    this.leaveEventName = `mouseleave.${this.uniqueID}.hoverController`;
    this.mouseEnterItems = [];
    this.mouseLeaveItems = [];
    (this.host = host).addController(this);
    this.elementRef = elementRef;
  }
  hostConnected() {
    this.host.updateComplete.then(() => {
      $(this.elementRef.value).on(this.enterEventName, () => {
        this.isHover = true;
        for (let i = this.mouseEnterItems.length - 1; i >= 0; i--) {
          const item = this.mouseEnterItems[i];
          item.callback();
          if (item.one) {
            this.mouseEnterItems.splice(i, 1);
          }
        }
      }).on(this.leaveEventName, () => {
        this.isHover = false;
        for (let i = this.mouseLeaveItems.length - 1; i >= 0; i--) {
          const item = this.mouseLeaveItems[i];
          item.callback();
          if (item.one) {
            this.mouseLeaveItems.splice(i, 1);
          }
        }
      });
    });
  }
  hostDisconnected() {
    $(this.elementRef.value).off(this.enterEventName).off(this.leaveEventName);
  }
  /**
   * 指定鼠标移入时的回调函数
   * @param callback 要执行的回调函数
   * @param one 是否仅执行一次
   */
  onMouseEnter(callback, one = false) {
    this.mouseEnterItems.push({ callback, one });
  }
  /**
   * 指定鼠标移出时的回调函数
   * @param callback 要执行的回调函数
   * @param one 是否仅执行一次
   */
  onMouseLeave(callback, one = false) {
    this.mouseLeaveItems.push({ callback, one });
  }
};

// node_modules/mdui/components/tooltip/style.js
var style24 = css`:host{--shape-corner-plain:var(--mdui-shape-corner-extra-small);--shape-corner-rich:var(--mdui-shape-corner-medium);--z-index:2500;display:contents}.popup{position:fixed;display:flex;flex-direction:column;z-index:var(--z-index);border-radius:var(--shape-corner-plain);background-color:rgb(var(--mdui-color-inverse-surface));padding:0 .5rem;min-width:1.75rem;max-width:20rem}:host([variant=rich]) .popup{border-radius:var(--shape-corner-rich);background-color:rgb(var(--mdui-color-surface-container));box-shadow:var(--mdui-elevation-level2);padding:.75rem 1rem .5rem 1rem}.headline{display:flex;color:rgb(var(--mdui-color-on-surface-variant));font-size:var(--mdui-typescale-title-small-size);font-weight:var(--mdui-typescale-title-small-weight);letter-spacing:var(--mdui-typescale-title-small-tracking);line-height:var(--mdui-typescale-title-small-line-height)}.content{display:flex;padding:.25rem 0;color:rgb(var(--mdui-color-inverse-on-surface));font-size:var(--mdui-typescale-body-small-size);font-weight:var(--mdui-typescale-body-small-weight);letter-spacing:var(--mdui-typescale-body-small-tracking);line-height:var(--mdui-typescale-body-small-line-height)}:host([variant=rich]) .content{color:rgb(var(--mdui-color-on-surface-variant));font-size:var(--mdui-typescale-body-medium-size);font-weight:var(--mdui-typescale-body-medium-weight);letter-spacing:var(--mdui-typescale-body-medium-tracking);line-height:var(--mdui-typescale-body-medium-line-height)}.action{display:flex;justify-content:flex-start;padding-top:.5rem}.action ::slotted(:not(:last-child)){margin-right:.5rem}`;

// node_modules/mdui/components/tooltip/index.js
var Tooltip = class Tooltip2 extends MduiElement {
  constructor() {
    super();
    this.variant = "plain";
    this.placement = "auto";
    this.openDelay = 150;
    this.closeDelay = 150;
    this.trigger = "hover focus";
    this.disabled = false;
    this.open = false;
    this.popupRef = createRef();
    this.hasSlotController = new HasSlotController(this, "headline", "action");
    this.hoverController = new HoverController(this, this.popupRef);
    this.definedController = new DefinedController(this, {
      needDomReady: true
    });
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onWindowScroll = this.onWindowScroll.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  /**
   * 获取第一个非 <style> 和 content slot 的子元素，作为 tooltip 的目标元素
   */
  get target() {
    return [...this.children].find((el) => el.tagName.toLowerCase() !== "style" && el.getAttribute("slot") !== "content");
  }
  async onPositionChange() {
    if (this.open) {
      await this.definedController.whenDefined();
      this.updatePositioner();
    }
  }
  async onOpenChange() {
    const hasUpdated = this.hasUpdated;
    const duration = getDuration(this, "short4");
    const easing = getEasing(this, "standard");
    if (this.open) {
      await this.definedController.whenDefined();
      $(`mdui-tooltip[variant="${this.variant}"]`).filter((_, element) => element !== this).prop("open", false);
      if (!hasUpdated) {
        await this.updateComplete;
      }
      if (hasUpdated) {
        const eventProceeded = this.emit("open", { cancelable: true });
        if (!eventProceeded) {
          return;
        }
      }
      await stopAnimations(this.popupRef.value);
      this.popupRef.value.hidden = false;
      this.updatePositioner();
      await animateTo(this.popupRef.value, [{ transform: "scale(0)" }, { transform: "scale(1)" }], {
        duration: hasUpdated ? duration : 0,
        easing
      });
      if (hasUpdated) {
        this.emit("opened");
      }
      return;
    }
    if (!this.open && hasUpdated) {
      const eventProceeded = this.emit("close", { cancelable: true });
      if (!eventProceeded) {
        return;
      }
      await stopAnimations(this.popupRef.value);
      await animateTo(this.popupRef.value, [{ transform: "scale(1)" }, { transform: "scale(0)" }], { duration, easing });
      this.popupRef.value.hidden = true;
      this.emit("closed");
    }
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.onDocumentClick);
    this.definedController.whenDefined().then(() => {
      this.overflowAncestors = getOverflowAncestors(this.target);
      this.overflowAncestors.forEach((ancestor) => {
        ancestor.addEventListener("scroll", this.onWindowScroll);
      });
      this.observeResize = observeResize(this.target, () => {
        this.updatePositioner();
      });
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onDocumentClick);
    this.overflowAncestors?.forEach((ancestor) => {
      ancestor.removeEventListener("scroll", this.onWindowScroll);
    });
    this.observeResize?.unobserve();
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.definedController.whenDefined().then(() => {
      const target = this.target;
      target.addEventListener("focus", this.onFocus);
      target.addEventListener("blur", this.onBlur);
      target.addEventListener("pointerdown", this.onClick);
      target.addEventListener("keydown", this.onKeydown);
      target.addEventListener("mouseenter", this.onMouseEnter);
      target.addEventListener("mouseleave", this.onMouseLeave);
    });
  }
  render() {
    const hasHeadline = this.isRich() && (this.headline || this.hasSlotController.test("headline"));
    const hasAction = this.isRich() && this.hasSlotController.test("action");
    return html`<slot></slot><div ${ref(this.popupRef)} part="popup" class="popup" hidden>${when(hasHeadline, () => html`<slot name="headline" part="headline" class="headline">${this.headline}</slot>`)}<slot name="content" part="content" class="content">${this.content}</slot>${when(hasAction, () => html`<slot name="action" part="action" class="action"></slot>`)}</div>`;
  }
  isRich() {
    return this.variant === "rich";
  }
  /**
   * 请求关闭 tooltip。鼠标未悬浮在 tooltip 上时，直接关闭；否则等鼠标移走再关闭
   */
  requestClose() {
    if (!this.hoverController.isHover) {
      this.open = false;
      return;
    }
    this.hoverController.onMouseLeave(() => {
      if (this.hasTrigger("hover")) {
        this.hoverTimeout = window.setTimeout(() => {
          this.open = false;
        }, this.closeDelay || 50);
      } else {
        this.open = false;
      }
    }, true);
  }
  hasTrigger(trigger) {
    const triggers = this.trigger.split(" ");
    return triggers.includes(trigger);
  }
  onFocus() {
    if (this.disabled || this.open || !this.hasTrigger("focus")) {
      return;
    }
    this.open = true;
  }
  onBlur() {
    if (this.disabled || !this.open || !this.hasTrigger("focus")) {
      return;
    }
    this.requestClose();
  }
  onClick(e) {
    if (this.disabled || e.button || !this.hasTrigger("click")) {
      return;
    }
    if (this.open && (this.hasTrigger("hover") || this.hasTrigger("focus"))) {
      return;
    }
    this.open = !this.open;
  }
  onKeydown(e) {
    if (this.disabled || !this.open || e.key !== "Escape") {
      return;
    }
    e.stopPropagation();
    this.requestClose();
  }
  onMouseEnter() {
    if (this.disabled || this.open || !this.hasTrigger("hover")) {
      return;
    }
    if (this.openDelay) {
      window.clearTimeout(this.hoverTimeout);
      this.hoverTimeout = window.setTimeout(() => {
        this.open = true;
      }, this.openDelay);
    } else {
      this.open = true;
    }
  }
  onMouseLeave() {
    window.clearTimeout(this.hoverTimeout);
    if (this.disabled || !this.open || !this.hasTrigger("hover")) {
      return;
    }
    this.hoverTimeout = window.setTimeout(() => {
      this.requestClose();
    }, this.closeDelay || 50);
  }
  /**
   * 在 document 上点击时，根据条件判断是否关闭 tooltip
   */
  onDocumentClick(e) {
    if (this.disabled || !this.open) {
      return;
    }
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.requestClose();
    }
  }
  onWindowScroll() {
    window.requestAnimationFrame(() => this.updatePositioner());
  }
  updatePositioner() {
    const $popup = $(this.popupRef.value);
    const targetMargin = this.isRich() ? 0 : 4;
    const popupMargin = 4;
    const targetRect = this.target.getBoundingClientRect();
    const targetTop = targetRect.top;
    const targetLeft = targetRect.left;
    const targetHeight = targetRect.height;
    const targetWidth = targetRect.width;
    const popupHeight = this.popupRef.value.offsetHeight;
    const popupWidth = this.popupRef.value.offsetWidth;
    const popupXSpace = popupWidth + targetMargin + popupMargin;
    const popupYSpace = popupHeight + targetMargin + popupMargin;
    let transformOriginX;
    let transformOriginY;
    let top;
    let left;
    let placement = this.placement;
    if (placement === "auto") {
      const $window = $(window);
      const hasTopSpace = targetTop > popupYSpace;
      const hasBottomSpace = $window.height() - targetTop - targetHeight > popupYSpace;
      const hasLeftSpace = targetLeft > popupXSpace;
      const hasRightSpace = $window.width() - targetLeft - targetWidth > popupXSpace;
      if (this.isRich()) {
        placement = "bottom-right";
        if (hasBottomSpace && hasRightSpace) {
          placement = "bottom-right";
        } else if (hasBottomSpace && hasLeftSpace) {
          placement = "bottom-left";
        } else if (hasTopSpace && hasRightSpace) {
          placement = "top-right";
        } else if (hasTopSpace && hasLeftSpace) {
          placement = "top-left";
        } else if (hasBottomSpace) {
          placement = "bottom";
        } else if (hasTopSpace) {
          placement = "top";
        } else if (hasRightSpace) {
          placement = "right";
        } else if (hasLeftSpace) {
          placement = "left";
        }
      } else {
        placement = "top";
        if (hasTopSpace) {
          placement = "top";
        } else if (hasBottomSpace) {
          placement = "bottom";
        } else if (hasLeftSpace) {
          placement = "left";
        } else if (hasRightSpace) {
          placement = "right";
        }
      }
    }
    const [position, alignment] = placement.split("-");
    switch (position) {
      case "top":
        transformOriginY = "bottom";
        top = targetTop - popupHeight - targetMargin;
        break;
      case "bottom":
        transformOriginY = "top";
        top = targetTop + targetHeight + targetMargin;
        break;
      default:
        transformOriginY = "center";
        switch (alignment) {
          case "start":
            top = targetTop;
            break;
          case "end":
            top = targetTop + targetHeight - popupHeight;
            break;
          default:
            top = targetTop + targetHeight / 2 - popupHeight / 2;
            break;
        }
        break;
    }
    switch (position) {
      case "left":
        transformOriginX = "right";
        left = targetLeft - popupWidth - targetMargin;
        break;
      case "right":
        transformOriginX = "left";
        left = targetLeft + targetWidth + targetMargin;
        break;
      default:
        transformOriginX = "center";
        switch (alignment) {
          case "start":
            left = targetLeft;
            break;
          case "end":
            left = targetLeft + targetWidth - popupWidth;
            break;
          case "left":
            transformOriginX = "right";
            left = targetLeft - popupWidth - targetMargin;
            break;
          case "right":
            transformOriginX = "left";
            left = targetLeft + targetWidth + targetMargin;
            break;
          default:
            left = targetLeft + targetWidth / 2 - popupWidth / 2;
            break;
        }
        break;
    }
    $popup.css({
      top,
      left,
      transformOrigin: [transformOriginX, transformOriginY].join(" ")
    });
  }
};
Tooltip.styles = [componentStyle, style24];
__decorate([
  property({ reflect: true })
], Tooltip.prototype, "variant", void 0);
__decorate([
  property({ reflect: true })
], Tooltip.prototype, "placement", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "open-delay" })
], Tooltip.prototype, "openDelay", void 0);
__decorate([
  property({ type: Number, reflect: true, attribute: "close-delay" })
], Tooltip.prototype, "closeDelay", void 0);
__decorate([
  property({ reflect: true })
], Tooltip.prototype, "headline", void 0);
__decorate([
  property({ reflect: true })
], Tooltip.prototype, "content", void 0);
__decorate([
  property({ reflect: true })
], Tooltip.prototype, "trigger", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Tooltip.prototype, "disabled", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], Tooltip.prototype, "open", void 0);
__decorate([
  watch("placement", true),
  watch("content", true)
], Tooltip.prototype, "onPositionChange", null);
__decorate([
  watch("open")
], Tooltip.prototype, "onOpenChange", null);
Tooltip = __decorate([
  customElement("mdui-tooltip")
], Tooltip);

// node_modules/@mdui/shared/helpers/slot.js
var getInnerHtmlFromSlot = (slot) => {
  const nodes = slot.assignedNodes({ flatten: true });
  let html2 = "";
  [...nodes].forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      html2 += node.outerHTML;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      html2 += node.textContent;
    }
  });
  return html2;
};

// node_modules/mdui/components/top-app-bar/top-app-bar-title-style.js
var topAppBarTitleStyle = css`:host{display:block;width:100%;flex-shrink:initial!important;overflow:hidden;color:rgb(var(--mdui-color-on-surface));font-size:var(--mdui-typescale-title-large-size);font-weight:var(--mdui-typescale-title-large-weight);letter-spacing:var(--mdui-typescale-title-large-tracking);line-height:var(--mdui-typescale-title-large-line-height);line-height:2.5rem}.label{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:1;transition:opacity var(--mdui-motion-duration-short2) var(--mdui-motion-easing-linear)}.label.variant-center-aligned{text-align:center}.label.variant-large:not(.shrink),.label.variant-medium:not(.shrink){opacity:0}.label.variant-large.shrink,.label.variant-medium.shrink{transition-delay:var(--mdui-motion-duration-short2)}.label-large{display:none;position:absolute;width:100%;left:0;margin-right:0;padding:0 1rem;transition:opacity var(--mdui-motion-duration-short2) var(--mdui-motion-easing-linear)}.label-large.variant-large,.label-large.variant-medium{display:block}.label-large.variant-medium{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;bottom:.75rem;font-size:var(--mdui-typescale-headline-small-size);font-weight:var(--mdui-typescale-headline-small-weight);letter-spacing:var(--mdui-typescale-headline-small-tracking);line-height:var(--mdui-typescale-headline-small-line-height)}.label-large.variant-large{display:-webkit-box;overflow:hidden;white-space:normal;-webkit-box-orient:vertical;-webkit-line-clamp:2;bottom:1.25rem;font-size:var(--mdui-typescale-headline-medium-size);font-weight:var(--mdui-typescale-headline-medium-weight);letter-spacing:var(--mdui-typescale-headline-medium-tracking);line-height:var(--mdui-typescale-headline-medium-line-height)}.label-large.variant-large:not(.shrink),.label-large.variant-medium:not(.shrink){opacity:1;transition-delay:var(--mdui-motion-duration-short2)}.label-large.variant-large.shrink,.label-large.variant-medium.shrink{opacity:0;z-index:-1}`;

// node_modules/mdui/components/top-app-bar/top-app-bar-title.js
var TopAppBarTitle = class TopAppBarTitle2 extends MduiElement {
  constructor() {
    super(...arguments);
    this.variant = "small";
    this.shrink = false;
    this.hasSlotController = new HasSlotController(this, "label-large");
    this.labelLargeRef = createRef();
    this.defaultSlotRef = createRef();
  }
  render() {
    const hasLabelLargeSlot = this.hasSlotController.test("label-large");
    const className2 = classMap({
      shrink: this.shrink,
      "variant-center-aligned": this.variant === "center-aligned",
      "variant-small": this.variant === "small",
      "variant-medium": this.variant === "medium",
      "variant-large": this.variant === "large"
    });
    return html`<slot part="label" class="label ${className2}" ${ref(this.defaultSlotRef)} @slotchange="${() => this.onSlotChange(hasLabelLargeSlot)}"></slot>${hasLabelLargeSlot ? html`<slot name="label-large" part="label-large" class="label-large ${className2}"></slot>` : html`<div ${ref(this.labelLargeRef)} part="label-large" class="label-large ${className2}"></div>`}`;
  }
  /**
   * default slot 变化时，同步到 label-large 中
   * @param hasLabelLargeSlot
   * @private
   */
  onSlotChange(hasLabelLargeSlot) {
    if (!hasLabelLargeSlot) {
      this.labelLargeRef.value.innerHTML = getInnerHtmlFromSlot(this.defaultSlotRef.value);
    }
  }
};
TopAppBarTitle.styles = [
  componentStyle,
  topAppBarTitleStyle
];
__decorate([
  state()
], TopAppBarTitle.prototype, "variant", void 0);
__decorate([
  state()
], TopAppBarTitle.prototype, "shrink", void 0);
TopAppBarTitle = __decorate([
  customElement("mdui-top-app-bar-title")
], TopAppBarTitle);

// node_modules/mdui/components/top-app-bar/top-app-bar-style.js
var topAppBarStyle = css`:host{--shape-corner:var(--mdui-shape-corner-none);--z-index:2000;position:fixed;top:0;right:0;left:0;display:flex;flex:0 0 auto;align-items:flex-start;justify-content:flex-start;border-bottom-left-radius:var(--shape-corner);border-bottom-right-radius:var(--shape-corner);z-index:var(--z-index);transition:top var(--mdui-motion-duration-long2) var(--mdui-motion-easing-standard),height var(--mdui-motion-duration-long2) var(--mdui-motion-easing-standard),box-shadow var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear),background-color var(--mdui-motion-duration-short4) var(--mdui-motion-easing-linear);padding:.75rem .5rem;height:4rem;background-color:rgb(var(--mdui-color-surface))}:host([scroll-target]:not([scroll-target=''])){position:absolute}:host([scroll-behavior~=shrink]){transition-duration:var(--mdui-motion-duration-short4)}:host([scrolling]){background-color:rgb(var(--mdui-color-surface-container));box-shadow:var(--mdui-elevation-level2)}::slotted(mdui-button-icon){color:rgb(var(--mdui-color-on-surface-variant));font-size:1.5rem}::slotted(mdui-button-icon:first-child){color:rgb(var(--mdui-color-on-surface))}::slotted(mdui-avatar){width:1.875rem;height:1.875rem;margin-top:.3125rem;margin-bottom:.3125rem}::slotted(*){flex-shrink:0}::slotted(:not(:last-child)){margin-right:.5rem}:host([variant=medium]){height:7rem}:host([variant=large]){height:9.5rem}:host([hide]:not([hide=false i])){transition-duration:var(--mdui-motion-duration-short4);top:-4.625rem}:host([hide][variant=medium]:not([hide=false i])){top:-7.625rem}:host([hide][variant=large]:not([hide=false i])){top:-10.125rem}:host([shrink][variant=large]:not([shrink=false i])),:host([shrink][variant=medium]:not([shrink=false i])){transition-duration:var(--mdui-motion-duration-short4);height:4rem}`;

// node_modules/mdui/components/top-app-bar/top-app-bar.js
var TopAppBar = class TopAppBar2 extends ScrollBehaviorMixin(LayoutItemBase) {
  constructor() {
    super(...arguments);
    this.variant = "small";
    this.hide = false;
    this.shrink = false;
    this.scrolling = false;
    this.definedController = new DefinedController(this, {
      relatedElements: ["mdui-top-app-bar-title"]
    });
  }
  get scrollPaddingPosition() {
    return "top";
  }
  get layoutPlacement() {
    return "top";
  }
  async onVariantChange() {
    if (this.hasUpdated) {
      this.addEventListener("transitionend", async () => {
        await this.scrollBehaviorDefinedController.whenDefined();
        this.setContainerPadding("update", this.scrollTarget);
      }, { once: true });
    } else {
      await this.updateComplete;
    }
    await this.definedController.whenDefined();
    this.titleElements.forEach((titleElement) => {
      titleElement.variant = this.variant;
    });
  }
  async onShrinkChange() {
    if (!this.hasUpdated) {
      await this.updateComplete;
    }
    await this.definedController.whenDefined();
    this.titleElements.forEach((titleElement) => {
      titleElement.shrink = this.shrink;
    });
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.addEventListener("transitionend", (e) => {
      if (e.target === this) {
        this.emit(this.hide ? "hidden" : "shown");
      }
    });
  }
  render() {
    return html`<slot></slot>`;
  }
  runScrollNoThreshold(isScrollingUp, scrollTop) {
    if (this.hasScrollBehavior("shrink")) {
      if (isScrollingUp && scrollTop < 8) {
        this.shrink = false;
      }
    }
  }
  runScrollThreshold(isScrollingUp, scrollTop) {
    if (this.hasScrollBehavior("elevate")) {
      this.scrolling = !!scrollTop;
    }
    if (this.hasScrollBehavior("shrink")) {
      if (!isScrollingUp) {
        this.shrink = true;
      }
    }
    if (this.hasScrollBehavior("hide")) {
      if (!isScrollingUp && !this.hide) {
        const eventProceeded = this.emit("hide", { cancelable: true });
        if (eventProceeded) {
          this.hide = true;
        }
      }
      if (isScrollingUp && this.hide) {
        const eventProceeded = this.emit("show", { cancelable: true });
        if (eventProceeded) {
          this.hide = false;
        }
      }
    }
  }
};
TopAppBar.styles = [
  componentStyle,
  topAppBarStyle
];
__decorate([
  property({ reflect: true })
], TopAppBar.prototype, "variant", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TopAppBar.prototype, "hide", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TopAppBar.prototype, "shrink", void 0);
__decorate([
  property({ reflect: true, attribute: "scroll-behavior" })
], TopAppBar.prototype, "scrollBehavior", void 0);
__decorate([
  property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter
  })
], TopAppBar.prototype, "scrolling", void 0);
__decorate([
  queryAssignedElements({ selector: "mdui-top-app-bar-title", flatten: true })
], TopAppBar.prototype, "titleElements", void 0);
__decorate([
  watch("variant")
], TopAppBar.prototype, "onVariantChange", null);
__decorate([
  watch("shrink")
], TopAppBar.prototype, "onShrinkChange", null);
TopAppBar = __decorate([
  customElement("mdui-top-app-bar")
], TopAppBar);

// node_modules/is-promise/index.mjs
function isPromise2(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}

// node_modules/@mdui/shared/helpers/queue.js
var container = {};
function queue(name, func) {
  if (isUndefined(container[name])) {
    container[name] = [];
  }
  if (isUndefined(func)) {
    return container[name];
  }
  container[name].push(func);
}
function dequeue(name) {
  if (isUndefined(container[name])) {
    return;
  }
  if (!container[name].length) {
    return;
  }
  const func = container[name].shift();
  func();
}

// node_modules/mdui/functions/dialog.js
var defaultAction = {
  onClick: returnTrue
};
var queueName = "mdui.functions.dialog.";
var currentDialog = void 0;
var dialog = (options) => {
  const dialog2 = new Dialog();
  const $dialog = $(dialog2);
  const properties = [
    "headline",
    "description",
    "icon",
    "closeOnEsc",
    "closeOnOverlayClick",
    "stackedActions"
  ];
  const callbacks = ["onOpen", "onOpened", "onClose", "onClosed", "onOverlayClick"];
  Object.entries(options).forEach(([key, value]) => {
    if (properties.includes(key)) {
      dialog2[key] = value;
    } else if (callbacks.includes(key)) {
      const eventName = toKebabCase(key.slice(2));
      $dialog.on(eventName, (e) => {
        if (e.target === dialog2) {
          value.call(dialog2, dialog2);
        }
      });
    }
  });
  if (options.body) {
    $dialog.append(options.body);
  }
  if (options.actions) {
    options.actions.forEach((action) => {
      const mergedAction = Object.assign({}, defaultAction, action);
      $(`<mdui-button
        slot="action"
        variant="text"
      >${mergedAction.text}</mdui-button>`).appendTo($dialog).on("click", function() {
        const clickResult = mergedAction.onClick.call(dialog2, dialog2);
        if (isPromise2(clickResult)) {
          this.loading = true;
          clickResult.then(() => {
            dialog2.open = false;
          }).finally(() => {
            this.loading = false;
          });
        } else if (clickResult !== false) {
          dialog2.open = false;
        }
      });
    });
  }
  $dialog.appendTo("body").on("closed", (e) => {
    if (e.target !== dialog2) {
      return;
    }
    $dialog.remove();
    if (options.queue) {
      currentDialog = void 0;
      dequeue(queueName + options.queue);
    }
  });
  if (!options.queue) {
    setTimeout(() => {
      dialog2.open = true;
    });
  } else if (currentDialog) {
    queue(queueName + options.queue, () => {
      dialog2.open = true;
      currentDialog = dialog2;
    });
  } else {
    setTimeout(() => {
      dialog2.open = true;
    });
    currentDialog = dialog2;
  }
  return dialog2;
};

// node_modules/mdui/functions/alert.js
var getConfirmText = () => {
  return msg("OK", {
    id: "functions.alert.confirmText"
  });
};
var alert = (options) => {
  const mergedOptions = Object.assign({}, {
    confirmText: getConfirmText(),
    onConfirm: returnTrue
  }, options);
  const properties = [
    "headline",
    "description",
    "icon",
    "closeOnEsc",
    "closeOnOverlayClick",
    "queue",
    "onOpen",
    "onOpened",
    "onClose",
    "onClosed",
    "onOverlayClick"
  ];
  return new Promise((resolve, reject) => {
    let isResolve = false;
    const dialog2 = dialog({
      ...Object.fromEntries(properties.filter((key) => !isUndefined(mergedOptions[key])).map((key) => [key, mergedOptions[key]])),
      actions: [
        {
          text: mergedOptions.confirmText,
          onClick: (dialog3) => {
            const clickResult = mergedOptions.onConfirm.call(dialog3, dialog3);
            if (isPromise2(clickResult)) {
              clickResult.then(() => {
                isResolve = true;
              });
            } else if (clickResult !== false) {
              isResolve = true;
            }
            return clickResult;
          }
        }
      ]
    });
    if (!options.confirmText) {
      onLocaleReady(dialog2, () => {
        $(dialog2).find('[slot="action"]').text(getConfirmText());
      });
    }
    $(dialog2).on("close", (e) => {
      if (e.target === dialog2) {
        if (isResolve) {
          resolve();
        } else {
          reject();
        }
        offLocaleReady(dialog2);
      }
    });
  });
};

// node_modules/mdui/functions/confirm.js
var getConfirmText2 = () => {
  return msg("OK", {
    id: "functions.confirm.confirmText"
  });
};
var getCancelText = () => {
  return msg("Cancel", {
    id: "functions.confirm.cancelText"
  });
};
var confirm = (options) => {
  const mergedOptions = Object.assign({}, {
    confirmText: getConfirmText2(),
    cancelText: getCancelText(),
    onConfirm: returnTrue,
    onCancel: returnTrue
  }, options);
  const properties = [
    "headline",
    "description",
    "icon",
    "closeOnEsc",
    "closeOnOverlayClick",
    "stackedActions",
    "queue",
    "onOpen",
    "onOpened",
    "onClose",
    "onClosed",
    "onOverlayClick"
  ];
  return new Promise((resolve, reject) => {
    let isResolve = false;
    const dialog2 = dialog({
      ...Object.fromEntries(properties.filter((key) => !isUndefined(mergedOptions[key])).map((key) => [key, mergedOptions[key]])),
      actions: [
        {
          text: mergedOptions.cancelText,
          onClick: (dialog3) => {
            return mergedOptions.onCancel.call(dialog3, dialog3);
          }
        },
        {
          text: mergedOptions.confirmText,
          onClick: (dialog3) => {
            const clickResult = mergedOptions.onConfirm.call(dialog3, dialog3);
            if (isPromise2(clickResult)) {
              clickResult.then(() => {
                isResolve = true;
              });
            } else if (clickResult !== false) {
              isResolve = true;
            }
            return clickResult;
          }
        }
      ]
    });
    if (!options.confirmText) {
      onLocaleReady(dialog2, () => {
        $(dialog2).find('[slot="action"]').last().text(getConfirmText2());
      });
    }
    if (!options.cancelText) {
      onLocaleReady(dialog2, () => {
        $(dialog2).find('[slot="action"]').first().text(getCancelText());
      });
    }
    $(dialog2).on("close", (e) => {
      if (e.target === dialog2) {
        if (isResolve) {
          resolve();
        } else {
          reject();
        }
        offLocaleReady(dialog2);
      }
    });
  });
};

// node_modules/mdui/functions/getColorFromImage.js
var getColorFromImage = async (image) => {
  const $image = $(image);
  const source = await sourceColorFromImage($image[0]);
  return hexFromArgb(source);
};

// node_modules/mdui/functions/getLocale.js
var getLocale3 = () => {
  if (!getLocale2) {
    throw new Error(uninitializedError);
  }
  return getLocale2();
};

// node_modules/mdui/functions/getTheme.js
var getTheme = (target = document.documentElement) => {
  const element = $(target)[0];
  const themes = ["light", "dark", "auto"];
  const prefix = "mdui-theme-";
  return Array.from(element.classList).find((className2) => themes.map((theme) => prefix + theme).includes(className2))?.slice(prefix.length) ?? "light";
};

// node_modules/mdui/functions/loadLocale.js
var loadLocale2 = (loadFunc) => {
  initializeLocalize(loadFunc);
};

// node_modules/mdui/functions/prompt.js
var getConfirmText3 = () => {
  return msg("OK", {
    id: "functions.prompt.confirmText"
  });
};
var getCancelText2 = () => {
  return msg("Cancel", {
    id: "functions.prompt.cancelText"
  });
};
var prompt = (options) => {
  const mergedOptions = Object.assign({}, {
    confirmText: getConfirmText3(),
    cancelText: getCancelText2(),
    onConfirm: returnTrue,
    onCancel: returnTrue,
    validator: returnTrue,
    textFieldOptions: {}
  }, options);
  const properties = [
    "headline",
    "description",
    "icon",
    "closeOnEsc",
    "closeOnOverlayClick",
    "stackedActions",
    "queue",
    "onOpen",
    "onOpened",
    "onClose",
    "onClosed",
    "onOverlayClick"
  ];
  const textField = new TextField();
  Object.entries(mergedOptions.textFieldOptions).forEach(([key, value]) => {
    textField[key] = value;
  });
  return new Promise((resolve, reject) => {
    let isResolve = false;
    const dialog2 = dialog({
      ...Object.fromEntries(properties.filter((key) => !isUndefined(mergedOptions[key])).map((key) => [key, mergedOptions[key]])),
      body: textField,
      actions: [
        {
          text: mergedOptions.cancelText,
          onClick: (dialog3) => {
            return mergedOptions.onCancel.call(dialog3, textField.value, dialog3);
          }
        },
        {
          text: mergedOptions.confirmText,
          onClick: (dialog3) => {
            const onConfirm = () => {
              const clickResult = mergedOptions.onConfirm.call(dialog3, textField.value, dialog3);
              if (isPromise2(clickResult)) {
                clickResult.then(() => {
                  isResolve = true;
                });
              } else if (clickResult !== false) {
                isResolve = true;
              }
              return clickResult;
            };
            textField.setCustomValidity("");
            if (!textField.reportValidity()) {
              return false;
            }
            const validateResult = mergedOptions.validator.call(textField, textField.value);
            if (isBoolean(validateResult) && !validateResult) {
              textField.setCustomValidity(" ");
              return false;
            }
            if (isString(validateResult)) {
              textField.setCustomValidity(validateResult);
              return false;
            }
            if (isPromise2(validateResult)) {
              return new Promise((resolve2, reject2) => {
                validateResult.then(resolve2).catch((reason) => {
                  textField.setCustomValidity(reason);
                  reject2(reason);
                });
              });
            }
            return onConfirm();
          }
        }
      ]
    });
    if (!options.confirmText) {
      onLocaleReady(dialog2, () => {
        $(dialog2).find('[slot="action"]').last().text(getConfirmText3());
      });
    }
    if (!options.cancelText) {
      onLocaleReady(dialog2, () => {
        $(dialog2).find('[slot="action"]').first().text(getCancelText2());
      });
    }
    $(dialog2).on("close", (e) => {
      if (e.target === dialog2) {
        if (isResolve) {
          resolve(textField.value);
        } else {
          reject();
        }
        offLocaleReady(dialog2);
      }
    });
  });
};

// node_modules/mdui/functions/removeColorScheme.js
var removeColorScheme = (target = document.documentElement) => {
  remove(target);
};

// node_modules/mdui/functions/setLocale.js
var setLocale3 = (locale) => {
  if (!setLocale2) {
    throw new Error(uninitializedError);
  }
  return setLocale2(locale);
};

// node_modules/mdui/functions/setTheme.js
var setTheme = (theme, target = document.documentElement) => {
  const $target = $(target);
  const themes = ["light", "dark", "auto"];
  const prefix = "mdui-theme-";
  $target.removeClass(themes.map((theme2) => prefix + theme2).join(" ")).addClass(prefix + theme);
};

// node_modules/mdui/functions/snackbar.js
var queueName2 = "mdui.functions.snackbar.";
var currentSnackbar = void 0;
var snackbar = (options) => {
  const snackbar2 = new Snackbar();
  const $snackbar = $(snackbar2);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "message") {
      snackbar2.innerHTML = value;
    } else if ([
      "onClick",
      "onActionClick",
      "onOpen",
      "onOpened",
      "onClose",
      "onClosed"
    ].includes(key)) {
      const eventName = toKebabCase(key.slice(2));
      $snackbar.on(eventName, (e) => {
        if (e.target !== snackbar2) {
          return;
        }
        if (key === "onActionClick") {
          const actionClick = (options.onActionClick ?? returnTrue).call(snackbar2, snackbar2);
          if (isPromise2(actionClick)) {
            snackbar2.actionLoading = true;
            actionClick.then(() => {
              snackbar2.open = false;
            }).finally(() => {
              snackbar2.actionLoading = false;
            });
          } else if (actionClick !== false) {
            snackbar2.open = false;
          }
        } else {
          value.call(snackbar2, snackbar2);
        }
      });
    } else {
      snackbar2[key] = value;
    }
  });
  $snackbar.appendTo("body").on("closed", (e) => {
    if (e.target !== snackbar2) {
      return;
    }
    $snackbar.remove();
    if (options.queue) {
      currentSnackbar = void 0;
      dequeue(queueName2 + options.queue);
    }
  });
  if (!options.queue) {
    setTimeout(() => {
      snackbar2.open = true;
    });
  } else if (currentSnackbar) {
    queue(queueName2 + options.queue, () => {
      snackbar2.open = true;
      currentSnackbar = snackbar2;
    });
  } else {
    setTimeout(() => {
      snackbar2.open = true;
    });
    currentSnackbar = snackbar2;
  }
  return snackbar2;
};

// node_modules/@mdui/shared/helpers/throttle.js
var throttle = (func, wait = 0) => {
  const window2 = getWindow();
  let timer;
  let result;
  return function(...args) {
    if (timer === void 0) {
      timer = window2.setTimeout(() => {
        result = func.apply(this, args);
        timer = void 0;
      }, wait);
    }
    return result;
  };
};
export {
  $,
  Avatar,
  Badge,
  BottomAppBar,
  Button,
  ButtonIcon,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  CollapseItem,
  Dialog,
  Divider,
  Dropdown,
  Fab,
  Icon,
  Layout,
  LayoutItem,
  LayoutMain,
  LinearProgress,
  List,
  ListItem,
  ListSubheader,
  Menu,
  MenuItem,
  NavigationBar,
  NavigationBarItem,
  NavigationDrawer,
  NavigationRail,
  NavigationRailItem,
  Radio,
  RadioGroup,
  RangeSlider,
  Ripple,
  SegmentedButton,
  SegmentedButtonGroup,
  Select,
  Slider,
  Snackbar,
  Switch,
  Tab,
  TabPanel,
  Tabs,
  TextField,
  Tooltip,
  TopAppBar,
  TopAppBarTitle,
  alert,
  breakpoint,
  confirm,
  dialog,
  getColorFromImage,
  getLocale3 as getLocale,
  getTheme,
  loadLocale2 as loadLocale,
  observeResize,
  prompt,
  removeColorScheme,
  setColorScheme,
  setLocale3 as setLocale,
  setTheme,
  snackbar,
  throttle
};
//# sourceMappingURL=mdui.js.map
