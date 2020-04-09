(function () {
  'use strict';

  var _tmpl = void 0;

  /* proxy-compat-disable */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  function detect() {
    // Don't apply polyfill when ProxyCompat is enabled.
    if ('getKey' in Proxy) {
      return false;
    }

    const proxy = new Proxy([3, 4], {});
    const res = [1, 2].concat(proxy);
    return res.length !== 4;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    isConcatSpreadable
  } = Symbol;
  const {
    isArray
  } = Array;
  const {
    slice: ArraySlice,
    unshift: ArrayUnshift,
    shift: ArrayShift
  } = Array.prototype;

  function isObject(O) {
    return typeof O === 'object' ? O !== null : typeof O === 'function';
  } // https://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable


  function isSpreadable(O) {
    if (!isObject(O)) {
      return false;
    }

    const spreadable = O[isConcatSpreadable];
    return spreadable !== undefined ? Boolean(spreadable) : isArray(O);
  } // https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat


  function ArrayConcatPolyfill(..._args) {
    const O = Object(this);
    const A = [];
    let N = 0;
    const items = ArraySlice.call(arguments);
    ArrayUnshift.call(items, O);

    while (items.length) {
      const E = ArrayShift.call(items);

      if (isSpreadable(E)) {
        let k = 0;
        const length = E.length;

        for (k; k < length; k += 1, N += 1) {
          if (k in E) {
            const subElement = E[k];
            A[N] = subElement;
          }
        }
      } else {
        A[N] = E;
        N += 1;
      }
    }

    return A;
  }

  function apply() {
    Array.prototype.concat = ArrayConcatPolyfill;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  if (detect()) {
    apply();
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function detect$1(propName) {
    return Object.getOwnPropertyDescriptor(Element.prototype, propName) === undefined;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    hasAttribute,
    getAttribute,
    setAttribute,
    setAttributeNS,
    removeAttribute,
    removeAttributeNS
  } = Element.prototype;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // that doesn't follow the regular transformation process. e.g.: `aria-labeledby` <=> `ariaLabelBy`

  const ARIA_REGEX = /^aria/;
  const nodeToAriaPropertyValuesMap = new WeakMap();
  const {
    hasOwnProperty
  } = Object.prototype;
  const {
    replace: StringReplace,
    toLowerCase: StringToLowerCase
  } = String.prototype;

  function getAriaPropertyMap(elm) {
    let map = nodeToAriaPropertyValuesMap.get(elm);

    if (map === undefined) {
      map = {};
      nodeToAriaPropertyValuesMap.set(elm, map);
    }

    return map;
  }

  function getNormalizedAriaPropertyValue(value) {
    return value == null ? null : value + '';
  }

  function createAriaPropertyPropertyDescriptor(propName, attrName) {
    return {
      get() {
        const map = getAriaPropertyMap(this);

        if (hasOwnProperty.call(map, propName)) {
          return map[propName];
        } // otherwise just reflect what's in the attribute


        return hasAttribute.call(this, attrName) ? getAttribute.call(this, attrName) : null;
      },

      set(newValue) {
        const normalizedValue = getNormalizedAriaPropertyValue(newValue);
        const map = getAriaPropertyMap(this);
        map[propName] = normalizedValue; // reflect into the corresponding attribute

        if (newValue === null) {
          removeAttribute.call(this, attrName);
        } else {
          setAttribute.call(this, attrName, newValue);
        }
      },

      configurable: true,
      enumerable: true
    };
  }

  function patch(propName) {
    // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch
    const replaced = StringReplace.call(propName, ARIA_REGEX, 'aria-');
    const attrName = StringToLowerCase.call(replaced);
    const descriptor = createAriaPropertyPropertyDescriptor(propName, attrName);
    Object.defineProperty(Element.prototype, propName, descriptor);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // https://wicg.github.io/aom/spec/aria-reflection.html


  const ElementPrototypeAriaPropertyNames = ['ariaAutoComplete', 'ariaChecked', 'ariaCurrent', 'ariaDisabled', 'ariaExpanded', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaLabel', 'ariaLevel', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaPressed', 'ariaReadOnly', 'ariaRequired', 'ariaSelected', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'ariaLive', 'ariaRelevant', 'ariaAtomic', 'ariaBusy', 'ariaActiveDescendant', 'ariaControls', 'ariaDescribedBy', 'ariaFlowTo', 'ariaLabelledBy', 'ariaOwns', 'ariaPosInSet', 'ariaSetSize', 'ariaColCount', 'ariaColIndex', 'ariaDetails', 'ariaErrorMessage', 'ariaKeyShortcuts', 'ariaModal', 'ariaPlaceholder', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaColSpan', 'role'];
  /**
   * Note: Attributes aria-dropeffect and aria-grabbed were deprecated in
   * ARIA 1.1 and do not have corresponding IDL attributes.
   */

  for (let i = 0, len = ElementPrototypeAriaPropertyNames.length; i < len; i += 1) {
    const propName = ElementPrototypeAriaPropertyNames[i];

    if (detect$1(propName)) {
      patch(propName);
    }
  }
  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function invariant(value, msg) {
    if (!value) {
      throw new Error(`Invariant Violation: ${msg}`);
    }
  }

  function isTrue(value, msg) {
    if (!value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function isFalse(value, msg) {
    if (value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function fail(msg) {
    throw new Error(msg);
  }

  var assert = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invariant: invariant,
    isTrue: isTrue,
    isFalse: isFalse,
    fail: fail
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const {
    assign,
    create,
    defineProperties,
    defineProperty,
    freeze,
    getOwnPropertyDescriptor,
    getOwnPropertyNames,
    getPrototypeOf,
    hasOwnProperty: hasOwnProperty$1,
    keys,
    seal,
    setPrototypeOf
  } = Object;
  const {
    isArray: isArray$1
  } = Array;
  const {
    filter: ArrayFilter,
    find: ArrayFind,
    forEach,
    indexOf: ArrayIndexOf,
    join: ArrayJoin,
    map: ArrayMap,
    push: ArrayPush,
    reduce: ArrayReduce,
    reverse: ArrayReverse,
    slice: ArraySlice$1,
    splice: ArraySplice,
    unshift: ArrayUnshift$1
  } = Array.prototype;
  const {
    charCodeAt: StringCharCodeAt,
    replace: StringReplace$1,
    slice: StringSlice,
    toLowerCase: StringToLowerCase$1
  } = String.prototype;

  function isUndefined(obj) {
    return obj === undefined;
  }

  function isNull(obj) {
    return obj === null;
  }

  function isTrue$1(obj) {
    return obj === true;
  }

  function isFalse$1(obj) {
    return obj === false;
  }

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function isObject$1(obj) {
    return typeof obj === 'object';
  }

  function isString(obj) {
    return typeof obj === 'string';
  }

  const OtS = {}.toString;

  function toString(obj) {
    if (obj && obj.toString) {
      // Arrays might hold objects with "null" prototype So using
      // Array.prototype.toString directly will cause an error Iterate through
      // all the items and handle individually.
      if (isArray$1(obj)) {
        return ArrayJoin.call(ArrayMap.call(obj, toString), ',');
      }

      return obj.toString();
    } else if (typeof obj === 'object') {
      return OtS.call(obj);
    } else {
      return obj + emptyString;
    }
  }

  function getPropertyDescriptor(o, p) {
    do {
      const d = getOwnPropertyDescriptor(o, p);

      if (!isUndefined(d)) {
        return d;
      }

      o = getPrototypeOf(o);
    } while (o !== null);
  }

  const emptyString = '';
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * In IE11, symbols are expensive.
   * Due to the nature of the symbol polyfill. This method abstract the
   * creation of symbols, so we can fallback to string when native symbols
   * are not supported. Note that we can't use typeof since it will fail when transpiling.
   */

  const hasNativeSymbolsSupport = Symbol('x').toString() === 'Symbol(x)';

  function createHiddenField(key, namespace) {
    return hasNativeSymbolsSupport ? Symbol(key) : `$$lwc-${namespace}-${key}$$`;
  }

  const hiddenFieldsMap = new WeakMap();

  function setHiddenField(o, field, value) {
    let valuesByField = hiddenFieldsMap.get(o);

    if (isUndefined(valuesByField)) {
      valuesByField = create(null);
      hiddenFieldsMap.set(o, valuesByField);
    }

    valuesByField[field] = value;
  }

  function getHiddenField(o, field) {
    const valuesByField = hiddenFieldsMap.get(o);

    if (!isUndefined(valuesByField)) {
      return valuesByField[field];
    }
  }
  /** version: 1.3.7-226.4 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const defaultDefHTMLPropertyNames = ['accessKey', 'dir', 'draggable', 'hidden', 'id', 'lang', 'spellcheck', 'tabIndex', 'title']; // Few more exceptions that are using the attribute name to match the property in lowercase.
  // this list was compiled from https://msdn.microsoft.com/en-us/library/ms533062(v=vs.85).aspx
  // and https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
  // Note: this list most be in sync with the compiler as well.

  const HTMLPropertyNamesWithLowercasedReflectiveAttributes = ['accessKey', 'readOnly', 'tabIndex', 'bgColor', 'colSpan', 'rowSpan', 'contentEditable', 'dateTime', 'formAction', 'isMap', 'maxLength', 'useMap'];

  function offsetPropertyErrorMessage(name) {
    return `Using the \`${name}\` property is an anti-pattern because it rounds the value to an integer. Instead, use the \`getBoundingClientRect\` method to obtain fractional values for the size of an element and its position relative to the viewport.`;
  } // Global HTML Attributes & Properties
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement


  const globalHTMLProperties = assign(create(null), {
    accessKey: {
      attribute: 'accesskey'
    },
    accessKeyLabel: {
      readOnly: true
    },
    className: {
      attribute: 'class',
      error: 'Using the `className` property is an anti-pattern because of slow runtime behavior and potential conflicts with classes provided by the owner element. Use the `classList` API instead.'
    },
    contentEditable: {
      attribute: 'contenteditable'
    },
    dataset: {
      readOnly: true,
      error: "Using the `dataset` property is an anti-pattern because it can't be statically analyzed. Expose each property individually using the `@api` decorator instead."
    },
    dir: {
      attribute: 'dir'
    },
    draggable: {
      attribute: 'draggable'
    },
    dropzone: {
      attribute: 'dropzone',
      readOnly: true
    },
    hidden: {
      attribute: 'hidden'
    },
    id: {
      attribute: 'id'
    },
    inputMode: {
      attribute: 'inputmode'
    },
    lang: {
      attribute: 'lang'
    },
    slot: {
      attribute: 'slot',
      error: 'Using the `slot` property is an anti-pattern.'
    },
    spellcheck: {
      attribute: 'spellcheck'
    },
    style: {
      attribute: 'style'
    },
    tabIndex: {
      attribute: 'tabindex'
    },
    title: {
      attribute: 'title'
    },
    translate: {
      attribute: 'translate'
    },
    // additional "global attributes" that are not present in the link above.
    isContentEditable: {
      readOnly: true
    },
    offsetHeight: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetHeight')
    },
    offsetLeft: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetLeft')
    },
    offsetParent: {
      readOnly: true
    },
    offsetTop: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetTop')
    },
    offsetWidth: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetWidth')
    },
    role: {
      attribute: 'role'
    }
  });
  const AttrNameToPropNameMap = create(null);
  const PropNameToAttrNameMap = create(null); // Synthetic creation of all AOM property descriptors for Custom Elements

  forEach.call(ElementPrototypeAriaPropertyNames, propName => {
    // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch
    const attrName = StringToLowerCase$1.call(StringReplace$1.call(propName, /^aria/, 'aria-'));
    AttrNameToPropNameMap[attrName] = propName;
    PropNameToAttrNameMap[propName] = attrName;
  });
  forEach.call(defaultDefHTMLPropertyNames, propName => {
    const attrName = StringToLowerCase$1.call(propName);
    AttrNameToPropNameMap[attrName] = propName;
    PropNameToAttrNameMap[propName] = attrName;
  });
  forEach.call(HTMLPropertyNamesWithLowercasedReflectiveAttributes, propName => {
    const attrName = StringToLowerCase$1.call(propName);
    AttrNameToPropNameMap[attrName] = propName;
    PropNameToAttrNameMap[propName] = attrName;
  });

  const CAPS_REGEX = /[A-Z]/g;
  /**
   * This method maps between property names
   * and the corresponding attribute name.
   */

  function getAttrNameFromPropName(propName) {
    if (isUndefined(PropNameToAttrNameMap[propName])) {
      PropNameToAttrNameMap[propName] = StringReplace$1.call(propName, CAPS_REGEX, match => '-' + match.toLowerCase());
    }

    return PropNameToAttrNameMap[propName];
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  let nextTickCallbackQueue = [];
  const SPACE_CHAR = 32;
  const EmptyObject = seal(create(null));
  const EmptyArray = seal([]);

  function flushCallbackQueue() {

    const callbacks = nextTickCallbackQueue;
    nextTickCallbackQueue = []; // reset to a new queue

    for (let i = 0, len = callbacks.length; i < len; i += 1) {
      callbacks[i]();
    }
  }

  function addCallbackToNextTick(callback) {

    if (nextTickCallbackQueue.length === 0) {
      Promise.resolve().then(flushCallbackQueue);
    }

    ArrayPush.call(nextTickCallbackQueue, callback);
  }

  function isCircularModuleDependency(value) {
    return hasOwnProperty$1.call(value, '__circular__');
  }
  /**
   * When LWC is used in the context of an Aura application, the compiler produces AMD
   * modules, that doesn't resolve properly circular dependencies between modules. In order
   * to circumvent this issue, the module loader returns a factory with a symbol attached
   * to it.
   *
   * This method returns the resolved value if it received a factory as argument. Otherwise
   * it returns the original value.
   */


  function resolveCircularModuleDependency(fn) {

    return fn();
  }

  const useSyntheticShadow = hasOwnProperty$1.call(Element.prototype, '$shadowToken$');
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function getComponentTag(vm) {
    // Element.prototype.tagName getter might be poisoned. We need to use a try/catch to protect the
    // engine internal when accessing the tagName property.
    try {
      return `<${StringToLowerCase$1.call(vm.elm.tagName)}>`;
    } catch (error) {
      return '<invalid-tag-name>';
    }
  } // TODO [#1695]: Unify getComponentStack and getErrorComponentStack

  function getErrorComponentStack(vm) {
    const wcStack = [];
    let currentVm = vm;

    while (!isNull(currentVm)) {
      ArrayPush.call(wcStack, getComponentTag(currentVm));
      currentVm = currentVm.owner;
    }

    return wcStack.reverse().join('\n\t');
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function handleEvent(event, vnode) {
    const {
      type
    } = event;
    const {
      data: {
        on
      }
    } = vnode;
    const handler = on && on[type]; // call event handler if exists

    if (handler) {
      handler.call(undefined, event);
    }
  }

  function createListener() {
    return function handler(event) {
      handleEvent(event, handler.vnode);
    };
  }

  function updateAllEventListeners(oldVnode, vnode) {
    if (isUndefined(oldVnode.listener)) {
      createAllEventListeners(vnode);
    } else {
      vnode.listener = oldVnode.listener;
      vnode.listener.vnode = vnode;
    }
  }

  function createAllEventListeners(vnode) {
    const {
      data: {
        on
      }
    } = vnode;

    if (isUndefined(on)) {
      return;
    }

    const elm = vnode.elm;
    const listener = vnode.listener = createListener();
    listener.vnode = vnode;
    let name;

    for (name in on) {
      elm.addEventListener(name, listener);
    }
  }

  var modEvents = {
    update: updateAllEventListeners,
    create: createAllEventListeners
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const xmlNS = 'http://www.w3.org/XML/1998/namespace';
  const ColonCharCode = 58;

  function updateAttrs(oldVnode, vnode) {
    const {
      data: {
        attrs
      }
    } = vnode;

    if (isUndefined(attrs)) {
      return;
    }

    let {
      data: {
        attrs: oldAttrs
      }
    } = oldVnode;

    if (oldAttrs === attrs) {
      return;
    }

    const elm = vnode.elm;
    let key;
    oldAttrs = isUndefined(oldAttrs) ? EmptyObject : oldAttrs; // update modified attributes, add new attributes
    // this routine is only useful for data-* attributes in all kind of elements
    // and aria-* in standard elements (custom elements will use props for these)

    for (key in attrs) {
      const cur = attrs[key];
      const old = oldAttrs[key];

      if (old !== cur) {

        if (StringCharCodeAt.call(key, 3) === ColonCharCode) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur);
        } else if (StringCharCodeAt.call(key, 5) === ColonCharCode) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur);
        } else if (isNull(cur)) {
          elm.removeAttribute(key);
        } else {
          elm.setAttribute(key, cur);
        }
      }
    }
  }

  const emptyVNode = {
    data: {}
  };
  var modAttrs = {
    create: vnode => updateAttrs(emptyVNode, vnode),
    update: updateAttrs
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function isLiveBindingProp(sel, key) {
    // For properties with live bindings, we read values from the DOM element
    // instead of relying on internally tracked values.
    return sel === 'input' && (key === 'value' || key === 'checked');
  }

  function update(oldVnode, vnode) {
    const props = vnode.data.props;

    if (isUndefined(props)) {
      return;
    }

    const oldProps = oldVnode.data.props;

    if (oldProps === props) {
      return;
    }

    const elm = vnode.elm;
    const isFirstPatch = isUndefined(oldProps);
    const {
      sel
    } = vnode;

    for (const key in props) {
      const cur = props[key];


      if (isFirstPatch || cur !== (isLiveBindingProp(sel, key) ? elm[key] : oldProps[key])) {
        elm[key] = cur;
      }
    }
  }

  const emptyVNode$1 = {
    data: {}
  };
  var modProps = {
    create: vnode => update(emptyVNode$1, vnode),
    update
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const classNameToClassMap = create(null);

  function getMapFromClassName(className) {
    // Intentionally using == to match undefined and null values from computed style attribute
    if (className == null) {
      return EmptyObject;
    } // computed class names must be string


    className = isString(className) ? className : className + '';
    let map = classNameToClassMap[className];

    if (map) {
      return map;
    }

    map = create(null);
    let start = 0;
    let o;
    const len = className.length;

    for (o = 0; o < len; o++) {
      if (StringCharCodeAt.call(className, o) === SPACE_CHAR) {
        if (o > start) {
          map[StringSlice.call(className, start, o)] = true;
        }

        start = o + 1;
      }
    }

    if (o > start) {
      map[StringSlice.call(className, start, o)] = true;
    }

    classNameToClassMap[className] = map;

    return map;
  }

  function updateClassAttribute(oldVnode, vnode) {
    const {
      elm,
      data: {
        className: newClass
      }
    } = vnode;
    const {
      data: {
        className: oldClass
      }
    } = oldVnode;

    if (oldClass === newClass) {
      return;
    }

    const {
      classList
    } = elm;
    const newClassMap = getMapFromClassName(newClass);
    const oldClassMap = getMapFromClassName(oldClass);
    let name;

    for (name in oldClassMap) {
      // remove only if it is not in the new class collection and it is not set from within the instance
      if (isUndefined(newClassMap[name])) {
        classList.remove(name);
      }
    }

    for (name in newClassMap) {
      if (isUndefined(oldClassMap[name])) {
        classList.add(name);
      }
    }
  }

  const emptyVNode$2 = {
    data: {}
  };
  var modComputedClassName = {
    create: vnode => updateClassAttribute(emptyVNode$2, vnode),
    update: updateClassAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function updateStyleAttribute(oldVnode, vnode) {
    const {
      style: newStyle
    } = vnode.data;

    if (oldVnode.data.style === newStyle) {
      return;
    }

    const elm = vnode.elm;
    const {
      style
    } = elm;

    if (!isString(newStyle) || newStyle === '') {
      removeAttribute.call(elm, 'style');
    } else {
      style.cssText = newStyle;
    }
  }

  const emptyVNode$3 = {
    data: {}
  };
  var modComputedStyle = {
    create: vnode => updateStyleAttribute(emptyVNode$3, vnode),
    update: updateStyleAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // The compiler takes care of transforming the inline classnames into an object. It's faster to set the
  // different classnames properties individually instead of via a string.

  function createClassAttribute(vnode) {
    const {
      elm,
      data: {
        classMap
      }
    } = vnode;

    if (isUndefined(classMap)) {
      return;
    }

    const {
      classList
    } = elm;

    for (const name in classMap) {
      classList.add(name);
    }
  }

  var modStaticClassName = {
    create: createClassAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // The compiler takes care of transforming the inline style into an object. It's faster to set the
  // different style properties individually instead of via a string.

  function createStyleAttribute(vnode) {
    const {
      elm,
      data: {
        styleMap
      }
    } = vnode;

    if (isUndefined(styleMap)) {
      return;
    }

    const {
      style
    } = elm;

    for (const name in styleMap) {
      style[name] = styleMap[name];
    }
  }

  var modStaticStyle = {
    create: createStyleAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function createContext(vnode) {
    const {
      data: {
        context
      }
    } = vnode;

    if (isUndefined(context)) {
      return;
    }

    const elm = vnode.elm;
    const vm = getAssociatedVMIfPresent(elm);

    if (!isUndefined(vm)) {
      assign(vm.context, context);
    }
  }

  const contextModule = {
    create: createContext
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
  @license
  Copyright (c) 2015 Simon Friis Vindum.
  This code may only be used under the MIT License found at
  https://github.com/snabbdom/snabbdom/blob/master/LICENSE
  Code distributed by Snabbdom as part of the Snabbdom project at
  https://github.com/snabbdom/snabbdom/
  */

  function isUndef(s) {
    return s === undefined;
  }

  function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
  }

  function isVNode(vnode) {
    return vnode != null;
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    const map = {};
    let j, key, ch; // TODO [#1637]: simplify this by assuming that all vnodes has keys

    for (j = beginIdx; j <= endIdx; ++j) {
      ch = children[j];

      if (isVNode(ch)) {
        key = ch.key;

        if (key !== undefined) {
          map[key] = j;
        }
      }
    }

    return map;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];

      if (isVNode(ch)) {
        ch.hook.create(ch);
        ch.hook.insert(ch, parentElm, before);
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]; // text nodes do not have logic associated to them

      if (isVNode(ch)) {
        ch.hook.remove(ch, parentElm);
      }
    }
  }

  function updateDynamicChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (!isVNode(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (!isVNode(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (!isVNode(newStartVnode)) {
        newStartVnode = newCh[++newStartIdx];
      } else if (!isVNode(newEndVnode)) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode);
        newEndVnode.hook.move(oldStartVnode, parentElm, oldEndVnode.elm.nextSibling);
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode);
        newStartVnode.hook.move(oldEndVnode, parentElm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = oldKeyToIdx[newStartVnode.key];

        if (isUndef(idxInOld)) {
          // New element
          newStartVnode.hook.create(newStartVnode);
          newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];

          if (isVNode(elmToMove)) {
            if (elmToMove.sel !== newStartVnode.sel) {
              // New element
              newStartVnode.hook.create(newStartVnode);
              newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
            } else {
              patchVnode(elmToMove, newStartVnode);
              oldCh[idxInOld] = undefined;
              newStartVnode.hook.move(elmToMove, parentElm, oldStartVnode.elm);
            }
          }

          newStartVnode = newCh[++newStartIdx];
        }
      }
    }

    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        const n = newCh[newEndIdx + 1];
        before = isVNode(n) ? n.elm : null;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
      } else {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }

  function updateStaticChildren(parentElm, oldCh, newCh) {
    const {
      length
    } = newCh;

    if (oldCh.length === 0) {
      // the old list is empty, we can directly insert anything new
      addVnodes(parentElm, null, newCh, 0, length);
      return;
    } // if the old list is not empty, the new list MUST have the same
    // amount of nodes, that's why we call this static children


    let referenceElm = null;

    for (let i = length - 1; i >= 0; i -= 1) {
      const vnode = newCh[i];
      const oldVNode = oldCh[i];

      if (vnode !== oldVNode) {
        if (isVNode(oldVNode)) {
          if (isVNode(vnode)) {
            // both vnodes must be equivalent, and se just need to patch them
            patchVnode(oldVNode, vnode);
            referenceElm = vnode.elm;
          } else {
            // removing the old vnode since the new one is null
            oldVNode.hook.remove(oldVNode, parentElm);
          }
        } else if (isVNode(vnode)) {
          // this condition is unnecessary
          vnode.hook.create(vnode); // insert the new node one since the old one is null

          vnode.hook.insert(vnode, parentElm, referenceElm);
          referenceElm = vnode.elm;
        }
      }
    }
  }

  function patchVnode(oldVnode, vnode) {
    if (oldVnode !== vnode) {
      vnode.elm = oldVnode.elm;
      vnode.hook.update(oldVnode, vnode);
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const noop = () => void 0;

  function observeElementChildNodes(elm) {
    elm.$domManual$ = true;
  }

  function setElementShadowToken(elm, token) {
    elm.$shadowToken$ = token;
  }

  function updateNodeHook(oldVnode, vnode) {
    const {
      text
    } = vnode;

    if (oldVnode.text !== text) {
      /**
       * Compiler will never produce a text property that is not string
       */


      vnode.elm.nodeValue = text;
    }
  }

  function insertNodeHook(vnode, parentNode, referenceNode) {

    parentNode.insertBefore(vnode.elm, referenceNode);
  }

  function removeNodeHook(vnode, parentNode) {

    parentNode.removeChild(vnode.elm);
  }

  function createElmHook(vnode) {
    modEvents.create(vnode); // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.

    modAttrs.create(vnode);
    modProps.create(vnode);
    modStaticClassName.create(vnode);
    modStaticStyle.create(vnode);
    modComputedClassName.create(vnode);
    modComputedStyle.create(vnode);
    contextModule.create(vnode);
  }

  var LWCDOMMode;

  (function (LWCDOMMode) {
    LWCDOMMode["manual"] = "manual";
  })(LWCDOMMode || (LWCDOMMode = {}));

  function fallbackElmHook(vnode) {
    const {
      owner
    } = vnode;
    const elm = vnode.elm;

    if (isTrue$1(useSyntheticShadow)) {
      const {
        data: {
          context
        }
      } = vnode;
      const {
        shadowAttribute
      } = owner.context;

      if (!isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual) {
        // this element will now accept any manual content inserted into it
        observeElementChildNodes(elm);
      } // when running in synthetic shadow mode, we need to set the shadowToken value
      // into each element from the template, so they can be styled accordingly.


      setElementShadowToken(elm, shadowAttribute);
    }
  }

  function updateElmHook(oldVnode, vnode) {
    // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.
    modAttrs.update(oldVnode, vnode);
    modProps.update(oldVnode, vnode);
    modComputedClassName.update(oldVnode, vnode);
    modComputedStyle.update(oldVnode, vnode);
  }

  function insertCustomElmHook(vnode) {
    const vm = getAssociatedVM(vnode.elm);
    appendVM(vm);
  }

  function updateChildrenHook(oldVnode, vnode) {
    const {
      children,
      owner
    } = vnode;
    const fn = hasDynamicChildren(children) ? updateDynamicChildren : updateStaticChildren;
    runWithBoundaryProtection(owner, owner.owner, noop, () => {
      fn(vnode.elm, oldVnode.children, children);
    }, noop);
  }

  function allocateChildrenHook(vnode) {
    const vm = getAssociatedVM(vnode.elm); // A component with slots will re-render because:
    // 1- There is a change of the internal state.
    // 2- There is a change on the external api (ex: slots)
    //
    // In case #1, the vnodes in the cmpSlots will be reused since they didn't changed. This routine emptied the
    // slotted children when those VCustomElement were rendered and therefore in subsequent calls to allocate children
    // in a reused VCustomElement, there won't be any slotted children.
    // For those cases, we will use the reference for allocated children stored when rendering the fresh VCustomElement.
    //
    // In case #2, we will always get a fresh VCustomElement.

    const children = vnode.aChildren || vnode.children;
    vm.aChildren = children;

    if (isTrue$1(useSyntheticShadow)) {
      // slow path
      allocateInSlot(vm, children); // save the allocated children in case this vnode is reused.

      vnode.aChildren = children; // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!

      vnode.children = EmptyArray;
    }
  }

  function createViewModelHook(vnode) {
    const elm = vnode.elm;

    if (!isUndefined(getAssociatedVMIfPresent(elm))) {
      // There is a possibility that a custom element is registered under tagName,
      // in which case, the initialization is already carry on, and there is nothing else
      // to do here since this hook is called right after invoking `document.createElement`.
      return;
    }

    const {
      mode,
      ctor,
      owner
    } = vnode;
    const def = getComponentDef(ctor);
    setElementProto(elm, def);

    if (isTrue$1(useSyntheticShadow)) {
      const {
        shadowAttribute
      } = owner.context; // when running in synthetic shadow mode, we need to set the shadowToken value
      // into each element from the template, so they can be styled accordingly.

      setElementShadowToken(elm, shadowAttribute);
    }

    createVM(elm, ctor, {
      mode,
      owner
    });
  }

  function createCustomElmHook(vnode) {
    modEvents.create(vnode); // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.

    modAttrs.create(vnode);
    modProps.create(vnode);
    modStaticClassName.create(vnode);
    modStaticStyle.create(vnode);
    modComputedClassName.create(vnode);
    modComputedStyle.create(vnode);
    contextModule.create(vnode);
  }

  function createChildrenHook(vnode) {
    const {
      elm,
      children
    } = vnode;

    for (let j = 0; j < children.length; ++j) {
      const ch = children[j];

      if (ch != null) {
        ch.hook.create(ch);
        ch.hook.insert(ch, elm, null);
      }
    }
  }

  function rerenderCustomElmHook(vnode) {
    const vm = getAssociatedVM(vnode.elm);

    rerenderVM(vm);
  }

  function updateCustomElmHook(oldVnode, vnode) {
    // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.
    modAttrs.update(oldVnode, vnode);
    modProps.update(oldVnode, vnode);
    modComputedClassName.update(oldVnode, vnode);
    modComputedStyle.update(oldVnode, vnode);
  }

  function removeElmHook(vnode) {
    // this method only needs to search on child vnodes from template
    // to trigger the remove hook just in case some of those children
    // are custom elements.
    const {
      children,
      elm
    } = vnode;

    for (let j = 0, len = children.length; j < len; ++j) {
      const ch = children[j];

      if (!isNull(ch)) {
        ch.hook.remove(ch, elm);
      }
    }
  }

  function removeCustomElmHook(vnode) {
    // for custom elements we don't have to go recursively because the removeVM routine
    // will take care of disconnecting any child VM attached to its shadow as well.
    removeVM(getAssociatedVM(vnode.elm));
  } // Using a WeakMap instead of a WeakSet because this one works in IE11 :(


  const FromIteration = new WeakMap(); // dynamic children means it was generated by an iteration
  // in a template, and will require a more complex diffing algo.

  function markAsDynamicChildren(children) {
    FromIteration.set(children, 1);
  }

  function hasDynamicChildren(children) {
    return FromIteration.has(children);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const Services = create(null);

  function invokeServiceHook(vm, cbs) {

    const {
      component,
      data,
      def,
      context
    } = vm;

    for (let i = 0, len = cbs.length; i < len; ++i) {
      cbs[i].call(undefined, component, data, def, context);
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CHAR_S = 115;
  const CHAR_V = 118;
  const CHAR_G = 103;
  const NamespaceAttributeForSVG = 'http://www.w3.org/2000/svg';
  const SymbolIterator = Symbol.iterator;
  const TextHook = {
    create: vnode => {
      vnode.elm = document.createTextNode(vnode.text);
      linkNodeToShadow(vnode);
    },
    update: updateNodeHook,
    insert: insertNodeHook,
    move: insertNodeHook,
    remove: removeNodeHook
  }; // insert is called after update, which is used somewhere else (via a module)
  // to mark the vm as inserted, that means we cannot use update as the main channel
  // to rehydrate when dirty, because sometimes the element is not inserted just yet,
  // which breaks some invariants. For that reason, we have the following for any
  // Custom Element that is inserted via a template.

  const ElementHook = {
    create: vnode => {
      const {
        data,
        sel,
        clonedElement
      } = vnode;
      const {
        ns
      } = data; // TODO [#1364]: supporting the ability to inject a cloned StyleElement via a vnode this is
      // used for style tags for native shadow

      if (isUndefined(clonedElement)) {
        vnode.elm = isUndefined(ns) ? document.createElement(sel) : document.createElementNS(ns, sel);
      } else {
        vnode.elm = clonedElement;
      }

      linkNodeToShadow(vnode);
      fallbackElmHook(vnode);
      createElmHook(vnode);
    },
    update: (oldVnode, vnode) => {
      updateElmHook(oldVnode, vnode);
      updateChildrenHook(oldVnode, vnode);
    },
    insert: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
      createChildrenHook(vnode);
    },
    move: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
    },
    remove: (vnode, parentNode) => {
      removeNodeHook(vnode, parentNode);
      removeElmHook(vnode);
    }
  };
  const CustomElementHook = {
    create: vnode => {
      const {
        sel
      } = vnode;
      vnode.elm = document.createElement(sel);
      linkNodeToShadow(vnode);
      createViewModelHook(vnode);
      allocateChildrenHook(vnode);
      createCustomElmHook(vnode);
    },
    update: (oldVnode, vnode) => {
      updateCustomElmHook(oldVnode, vnode); // in fallback mode, the allocation will always set children to
      // empty and delegate the real allocation to the slot elements

      allocateChildrenHook(vnode); // in fallback mode, the children will be always empty, so, nothing
      // will happen, but in native, it does allocate the light dom

      updateChildrenHook(oldVnode, vnode); // this will update the shadowRoot

      rerenderCustomElmHook(vnode);
    },
    insert: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
      const vm = getAssociatedVM(vnode.elm);

      runConnectedCallback(vm);
      createChildrenHook(vnode);
      insertCustomElmHook(vnode);
    },
    move: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
    },
    remove: (vnode, parentNode) => {
      removeNodeHook(vnode, parentNode);
      removeCustomElmHook(vnode);
    }
  };

  function linkNodeToShadow(vnode) {
    // TODO [#1164]: this should eventually be done by the polyfill directly
    vnode.elm.$shadowResolver$ = vnode.owner.cmpRoot.$shadowResolver$;
  } // TODO [#1136]: this should be done by the compiler, adding ns to every sub-element


  function addNS(vnode) {
    const {
      data,
      children,
      sel
    } = vnode;
    data.ns = NamespaceAttributeForSVG; // TODO [#1275]: review why `sel` equal `foreignObject` should get this `ns`

    if (isArray$1(children) && sel !== 'foreignObject') {
      for (let j = 0, n = children.length; j < n; ++j) {
        const childNode = children[j];

        if (childNode != null && childNode.hook === ElementHook) {
          addNS(childNode);
        }
      }
    }
  }

  function addVNodeToChildLWC(vnode) {
    ArrayPush.call(getVMBeingRendered().velements, vnode);
  } // [h]tml node


  function h(sel, data, children) {
    const vmBeingRendered = getVMBeingRendered();

    const {
      key
    } = data;
    let text, elm;
    const vnode = {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: ElementHook,
      owner: vmBeingRendered
    };

    if (sel.length === 3 && StringCharCodeAt.call(sel, 0) === CHAR_S && StringCharCodeAt.call(sel, 1) === CHAR_V && StringCharCodeAt.call(sel, 2) === CHAR_G) {
      addNS(vnode);
    }

    return vnode;
  } // [t]ab[i]ndex function


  function ti(value) {
    // if value is greater than 0, we normalize to 0
    // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
    // If value is less than -1, we don't care
    const shouldNormalize = value > 0 && !(isTrue$1(value) || isFalse$1(value));

    return shouldNormalize ? 0 : value;
  } // [s]lot element node


  function s(slotName, data, children, slotset) {

    if (!isUndefined(slotset) && !isUndefined(slotset[slotName]) && slotset[slotName].length !== 0) {
      children = slotset[slotName];
    }

    const vnode = h('slot', data, children);

    if (useSyntheticShadow) {
      // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
      sc(children);
    }

    return vnode;
  } // [c]ustom element node


  function c(sel, Ctor, data, children = EmptyArray) {
    if (isCircularModuleDependency(Ctor)) {
      Ctor = resolveCircularModuleDependency(Ctor);
    }

    const vmBeingRendered = getVMBeingRendered();

    const {
      key
    } = data;
    let text, elm;
    const vnode = {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: CustomElementHook,
      ctor: Ctor,
      owner: vmBeingRendered,
      mode: 'open'
    };
    addVNodeToChildLWC(vnode);
    return vnode;
  } // [i]terable node


  function i(iterable, factory) {
    const list = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

    sc(list);

    if (isUndefined(iterable) || iterable === null) {

      return list;
    }

    const iterator = iterable[SymbolIterator]();

    let next = iterator.next();
    let j = 0;
    let {
      value,
      done: last
    } = next;

    while (last === false) {
      // implementing a look-back-approach because we need to know if the element is the last
      next = iterator.next();
      last = next.done; // template factory logic based on the previous collected value

      const vnode = factory(value, j, j === 0, last);

      if (isArray$1(vnode)) {
        ArrayPush.apply(list, vnode);
      } else {
        ArrayPush.call(list, vnode);
      }


      j += 1;
      value = next.value;
    }

    return list;
  }
  /**
   * [f]lattening
   */


  function f(items) {

    const len = items.length;
    const flattened = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

    sc(flattened);

    for (let j = 0; j < len; j += 1) {
      const item = items[j];

      if (isArray$1(item)) {
        ArrayPush.apply(flattened, item);
      } else {
        ArrayPush.call(flattened, item);
      }
    }

    return flattened;
  } // [t]ext node


  function t(text) {
    const data = EmptyObject;
    let sel, children, key, elm;
    return {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: TextHook,
      owner: getVMBeingRendered()
    };
  } // [d]ynamic value to produce a text vnode


  function d(value) {
    if (value == null) {
      return null;
    }

    return t(value);
  } // [b]ind function


  function b(fn) {
    const vmBeingRendered = getVMBeingRendered();

    if (isNull(vmBeingRendered)) {
      throw new Error();
    }

    const vm = vmBeingRendered;
    return function (event) {
      invokeEventListener(vm, fn, vm.component, event);
    };
  } // [f]unction_[b]ind


  function fb(fn) {
    const vmBeingRendered = getVMBeingRendered();

    if (isNull(vmBeingRendered)) {
      throw new Error();
    }

    const vm = vmBeingRendered;
    return function () {
      return invokeComponentCallback(vm, fn, ArraySlice$1.call(arguments));
    };
  } // [l]ocator_[l]istener function


  function ll(originalHandler, id, context) {
    const vm = getVMBeingRendered();

    if (isNull(vm)) {
      throw new Error();
    } // bind the original handler with b() so we can call it
    // after resolving the locator


    const eventListener = b(originalHandler); // create a wrapping handler to resolve locator, and
    // then invoke the original handler.

    return function (event) {
      // located service for the locator metadata
      const {
        context: {
          locator
        }
      } = vm;

      if (!isUndefined(locator)) {
        const {
          locator: locatorService
        } = Services;

        if (locatorService) {
          locator.resolved = {
            target: id,
            host: locator.id,
            targetContext: isFunction(context) && context(),
            hostContext: isFunction(locator.context) && locator.context()
          }; // a registered `locator` service will be invoked with
          // access to the context.locator.resolved, which will contain:
          // outer id, outer context, inner id, and inner context

          invokeServiceHook(vm, locatorService);
        }
      } // invoke original event listener via b()


      eventListener(event);
    };
  } // [k]ey function


  function k(compilerKey, obj) {
    switch (typeof obj) {
      case 'number':
      case 'string':
        return compilerKey + ':' + obj;

    }
  } // [g]lobal [id] function


  function gid(id) {
    const vmBeingRendered = getVMBeingRendered();

    if (isUndefined(id) || id === '') {

      return id;
    } // We remove attributes when they are assigned a value of null


    if (isNull(id)) {
      return null;
    }

    return `${id}-${vmBeingRendered.idx}`;
  } // [f]ragment [id] function


  function fid(url) {
    const vmBeingRendered = getVMBeingRendered();

    if (isUndefined(url) || url === '') {

      return url;
    } // We remove attributes when they are assigned a value of null


    if (isNull(url)) {
      return null;
    } // Apply transformation only for fragment-only-urls


    if (/^#/.test(url)) {
      return `${url}-${vmBeingRendered.idx}`;
    }

    return url;
  }
  /**
   * Map to store an index value assigned to any dynamic component reference ingested
   * by dc() api. This allows us to generate a unique unique per template per dynamic
   * component reference to avoid diffing algo mismatches.
   */


  const DynamicImportedComponentMap = new Map();
  let dynamicImportedComponentCounter = 0;
  /**
   * create a dynamic component via `<x-foo lwc:dynamic={Ctor}>`
   */

  function dc(sel, Ctor, data, children) {


    if (Ctor == null) {
      return null;
    }

    if (!isComponentConstructor(Ctor)) {
      throw new Error(`Invalid LWC Constructor ${toString(Ctor)} for custom element <${sel}>.`);
    }

    let idx = DynamicImportedComponentMap.get(Ctor);

    if (isUndefined(idx)) {
      idx = dynamicImportedComponentCounter++;
      DynamicImportedComponentMap.set(Ctor, idx);
    } // the new vnode key is a mix of idx and compiler key, this is required by the diffing algo
    // to identify different constructors as vnodes with different keys to avoid reusing the
    // element used for previous constructors.


    data.key = `dc:${idx}:${data.key}`;
    return c(sel, Ctor, data, children);
  }
  /**
   * slow children collection marking mechanism. this API allows the compiler to signal
   * to the engine that a particular collection of children must be diffed using the slow
   * algo based on keys due to the nature of the list. E.g.:
   *
   *   - slot element's children: the content of the slot has to be dynamic when in synthetic
   *                              shadow mode because the `vnode.children` might be the slotted
   *                              content vs default content, in which case the size and the
   *                              keys are not matching.
   *   - children that contain dynamic components
   *   - children that are produced by iteration
   *
   */


  function sc(vnodes) {
    // choose to use the snabbdom virtual dom diffing algo instead of our
    // static dummy algo.


    markAsDynamicChildren(vnodes);
    return vnodes;
  }

  var api = /*#__PURE__*/Object.freeze({
    __proto__: null,
    h: h,
    ti: ti,
    s: s,
    c: c,
    i: i,
    f: f,
    t: t,
    d: d,
    b: b,
    fb: fb,
    ll: ll,
    k: k,
    gid: gid,
    fid: fid,
    dc: dc,
    sc: sc
  });
  const signedTemplateSet = new Set();

  function defaultEmptyTemplate() {
    return [];
  }

  signedTemplateSet.add(defaultEmptyTemplate);

  function isTemplateRegistered(tpl) {
    return signedTemplateSet.has(tpl);
  }
  /**
   * INTERNAL: This function can only be invoked by compiled code. The compiler
   * will prevent this function from being imported by userland code.
   */


  function registerTemplate(tpl) {
    signedTemplateSet.add(tpl); // chaining this method as a way to wrap existing
    // assignment of templates easily, without too much transformation

    return tpl;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CachedStyleFragments = create(null);

  function createStyleElement(styleContent) {
    const elm = document.createElement('style');
    elm.type = 'text/css';
    elm.textContent = styleContent;
    return elm;
  }

  function getCachedStyleElement(styleContent) {
    let fragment = CachedStyleFragments[styleContent];

    if (isUndefined(fragment)) {
      fragment = document.createDocumentFragment();
      const styleElm = createStyleElement(styleContent);
      fragment.appendChild(styleElm);
      CachedStyleFragments[styleContent] = fragment;
    }

    return fragment.cloneNode(true).firstChild;
  }

  const globalStyleParent = document.head || document.body || document;
  const InsertedGlobalStyleContent = create(null);

  function insertGlobalStyle(styleContent) {
    // inserts the global style when needed, otherwise does nothing
    if (isUndefined(InsertedGlobalStyleContent[styleContent])) {
      InsertedGlobalStyleContent[styleContent] = true;
      const elm = createStyleElement(styleContent);
      globalStyleParent.appendChild(elm);
    }
  }

  function createStyleVNode(elm) {
    const vnode = h('style', {
      key: 'style'
    }, EmptyArray); // TODO [#1364]: supporting the ability to inject a cloned StyleElement
    // forcing the diffing algo to use the cloned style for native shadow

    vnode.clonedElement = elm;
    return vnode;
  }
  /**
   * Reset the styling token applied to the host element.
   */


  function resetStyleAttributes(vm) {
    const {
      context,
      elm
    } = vm; // Remove the style attribute currently applied to the host element.

    const oldHostAttribute = context.hostAttribute;

    if (!isUndefined(oldHostAttribute)) {
      removeAttribute.call(elm, oldHostAttribute);
    } // Reset the scoping attributes associated to the context.


    context.hostAttribute = context.shadowAttribute = undefined;
  }
  /**
   * Apply/Update the styling token applied to the host element.
   */


  function applyStyleAttributes(vm, hostAttribute, shadowAttribute) {
    const {
      context,
      elm
    } = vm; // Remove the style attribute currently applied to the host element.

    setAttribute.call(elm, hostAttribute, '');
    context.hostAttribute = hostAttribute;
    context.shadowAttribute = shadowAttribute;
  }

  function collectStylesheets(stylesheets, hostSelector, shadowSelector, isNative, aggregatorFn) {
    forEach.call(stylesheets, sheet => {
      if (isArray$1(sheet)) {
        collectStylesheets(sheet, hostSelector, shadowSelector, isNative, aggregatorFn);
      } else {
        aggregatorFn(sheet(hostSelector, shadowSelector, isNative));
      }
    });
  }

  function evaluateCSS(stylesheets, hostAttribute, shadowAttribute) {

    if (useSyntheticShadow) {
      const hostSelector = `[${hostAttribute}]`;
      const shadowSelector = `[${shadowAttribute}]`;
      collectStylesheets(stylesheets, hostSelector, shadowSelector, false, textContent => {
        insertGlobalStyle(textContent);
      });
      return null;
    } else {
      // Native shadow in place, we need to act accordingly by using the `:host` selector, and an
      // empty shadow selector since it is not really needed.
      let buffer = '';
      collectStylesheets(stylesheets, emptyString, emptyString, true, textContent => {
        buffer += textContent;
      });
      return createStyleVNode(getCachedStyleElement(buffer));
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  var GlobalMeasurementPhase;

  (function (GlobalMeasurementPhase) {
    GlobalMeasurementPhase["REHYDRATE"] = "lwc-rehydrate";
    GlobalMeasurementPhase["HYDRATE"] = "lwc-hydrate";
  })(GlobalMeasurementPhase || (GlobalMeasurementPhase = {})); // Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
  // JSDom (used in Jest) for example doesn't implement the UserTiming APIs.


  const isUserTimingSupported = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

  function getMarkName(phase, vm) {
    // Adding the VM idx to the mark name creates a unique mark name component instance. This is necessary to produce
    // the right measures for components that are recursive.
    return `${getComponentTag(vm)} - ${phase} - ${vm.idx}`;
  }

  function start(markName) {
    performance.mark(markName);
  }

  function end(measureName, markName) {
    performance.measure(measureName, markName); // Clear the created marks and measure to avoid filling the performance entries buffer.
    // Note: Even if the entries get deleted, existing PerformanceObservers preserve a copy of those entries.

    performance.clearMarks(markName);
    performance.clearMarks(measureName);
  }

  function noop$1() {
    /* do nothing */
  }
  const startGlobalMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
    const markName = isUndefined(vm) ? phase : getMarkName(phase, vm);
    start(markName);
  };
  const endGlobalMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
    const markName = isUndefined(vm) ? phase : getMarkName(phase, vm);
    end(phase, markName);
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  let isUpdatingTemplate = false;
  let vmBeingRendered = null;

  function getVMBeingRendered() {
    return vmBeingRendered;
  }

  function setVMBeingRendered(vm) {
    vmBeingRendered = vm;
  }

  const EmptySlots = create(null);

  function validateSlots(vm, html) {
    {
      // this method should never leak to prod
      throw new ReferenceError();
    }
  }

  function validateFields(vm, html) {
    {
      // this method should never leak to prod
      throw new ReferenceError();
    }
  }

  function evaluateTemplate(vm, html) {

    const isUpdatingTemplateInception = isUpdatingTemplate;
    const vmOfTemplateBeingUpdatedInception = vmBeingRendered;
    let vnodes = [];
    runWithBoundaryProtection(vm, vm.owner, () => {
      // pre
      vmBeingRendered = vm;
    }, () => {
      // job
      const {
        component,
        context,
        cmpSlots,
        cmpTemplate,
        tro
      } = vm;
      tro.observe(() => {
        // reset the cache memoizer for template when needed
        if (html !== cmpTemplate) {
          // perf opt: do not reset the shadow root during the first rendering (there is nothing to reset)
          if (!isUndefined(cmpTemplate)) {
            // It is important to reset the content to avoid reusing similar elements generated from a different
            // template, because they could have similar IDs, and snabbdom just rely on the IDs.
            resetShadowRoot(vm);
          } // Check that the template was built by the compiler


          if (isUndefined(html) || !isTemplateRegistered(html)) {
            throw new TypeError(`Invalid template returned by the render() method on ${vm}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString(html)}.`);
          }

          vm.cmpTemplate = html; // Populate context with template information

          context.tplCache = create(null);
          resetStyleAttributes(vm);
          const {
            stylesheets,
            stylesheetTokens
          } = html;

          if (isUndefined(stylesheets) || stylesheets.length === 0) {
            context.styleVNode = null;
          } else if (!isUndefined(stylesheetTokens)) {
            const {
              hostAttribute,
              shadowAttribute
            } = stylesheetTokens;
            applyStyleAttributes(vm, hostAttribute, shadowAttribute); // Caching style vnode so it can be reused on every render

            context.styleVNode = evaluateCSS(stylesheets, hostAttribute, shadowAttribute);
          }

          if ("production" !== 'production') {
            // one time operation for any new template returned by render()
            // so we can warn if the template is attempting to use a binding
            // that is not provided by the component instance.
            validateFields(vm, html);
          }
        }

        if ("production" !== 'production') {
          assert.isTrue(isObject$1(context.tplCache), `vm.context.tplCache must be an object associated to ${cmpTemplate}.`); // validating slots in every rendering since the allocated content might change over time

          validateSlots(vm, html);
        } // right before producing the vnodes, we clear up all internal references
        // to custom elements from the template.


        vm.velements = []; // Set the global flag that template is being updated

        isUpdatingTemplate = true;
        vnodes = html.call(undefined, api, component, cmpSlots, context.tplCache);
        const {
          styleVNode
        } = context;

        if (!isNull(styleVNode)) {
          ArrayUnshift$1.call(vnodes, styleVNode);
        }
      });
    }, () => {
      // post
      isUpdatingTemplate = isUpdatingTemplateInception;
      vmBeingRendered = vmOfTemplateBeingUpdatedInception;
    });

    return vnodes;
  }
  let vmBeingConstructed = null;

  function isBeingConstructed(vm) {
    return vmBeingConstructed === vm;
  }

  const noop$2 = () => void 0;

  function invokeComponentCallback(vm, fn, args) {
    const {
      component,
      callHook,
      owner
    } = vm;
    let result;
    runWithBoundaryProtection(vm, owner, noop$2, () => {
      // job
      result = callHook(component, fn, args);
    }, noop$2);
    return result;
  }

  function invokeComponentConstructor(vm, Ctor) {
    const vmBeingConstructedInception = vmBeingConstructed;
    let error;

    vmBeingConstructed = vm;
    /**
     * Constructors don't need to be wrapped with a boundary because for root elements
     * it should throw, while elements from template are already wrapped by a boundary
     * associated to the diffing algo.
     */

    try {
      // job
      const result = new Ctor(); // Check indirectly if the constructor result is an instance of LightningElement. Using
      // the "instanceof" operator would not work here since Locker Service provides its own
      // implementation of LightningElement, so we indirectly check if the base constructor is
      // invoked by accessing the component on the vm.

      if (vmBeingConstructed.component !== result) {
        throw new TypeError('Invalid component constructor, the class should extend LightningElement.');
      }
    } catch (e) {
      error = Object(e);
    } finally {

      vmBeingConstructed = vmBeingConstructedInception;

      if (!isUndefined(error)) {
        error.wcStack = getErrorComponentStack(vm); // re-throwing the original error annotated after restoring the context

        throw error; // eslint-disable-line no-unsafe-finally
      }
    }
  }

  function invokeComponentRenderMethod(vm) {
    const {
      def: {
        render
      },
      callHook,
      component,
      owner
    } = vm;
    const vmBeingRenderedInception = getVMBeingRendered();
    let html;
    let renderInvocationSuccessful = false;
    runWithBoundaryProtection(vm, owner, () => {
      setVMBeingRendered(vm);
    }, () => {
      // job
      vm.tro.observe(() => {
        html = callHook(component, render);
        renderInvocationSuccessful = true;
      });
    }, () => {
      setVMBeingRendered(vmBeingRenderedInception);
    }); // If render() invocation failed, process errorCallback in boundary and return an empty template

    return renderInvocationSuccessful ? evaluateTemplate(vm, html) : [];
  }

  function invokeComponentRenderedCallback(vm) {
    const {
      def: {
        renderedCallback
      },
      component,
      callHook,
      owner
    } = vm;

    if (!isUndefined(renderedCallback)) {
      runWithBoundaryProtection(vm, owner, () => {
      }, () => {
        // job
        callHook(component, renderedCallback);
      }, () => {
      });
    }
  }

  function invokeEventListener(vm, fn, thisValue, event) {
    const {
      callHook,
      owner
    } = vm;
    runWithBoundaryProtection(vm, owner, noop$2, () => {
      // job
      if ("production" !== 'production') {
        assert.isTrue(isFunction(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
      }

      callHook(thisValue, fn, [event]);
    }, noop$2);
  }
  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    create: create$1
  } = Object;
  const {
    splice: ArraySplice$1,
    indexOf: ArrayIndexOf$1,
    push: ArrayPush$1
  } = Array.prototype;
  const TargetToReactiveRecordMap = new WeakMap();

  function isUndefined$1(obj) {
    return obj === undefined;
  }

  function getReactiveRecord(target) {
    let reactiveRecord = TargetToReactiveRecordMap.get(target);

    if (isUndefined$1(reactiveRecord)) {
      const newRecord = create$1(null);
      reactiveRecord = newRecord;
      TargetToReactiveRecordMap.set(target, newRecord);
    }

    return reactiveRecord;
  }

  let currentReactiveObserver = null;

  function valueMutated(target, key) {
    const reactiveRecord = TargetToReactiveRecordMap.get(target);

    if (!isUndefined$1(reactiveRecord)) {
      const reactiveObservers = reactiveRecord[key];

      if (!isUndefined$1(reactiveObservers)) {
        for (let i = 0, len = reactiveObservers.length; i < len; i += 1) {
          const ro = reactiveObservers[i];
          ro.notify();
        }
      }
    }
  }

  function valueObserved(target, key) {
    // We should determine if an active Observing Record is present to track mutations.
    if (currentReactiveObserver === null) {
      return;
    }

    const ro = currentReactiveObserver;
    const reactiveRecord = getReactiveRecord(target);
    let reactiveObservers = reactiveRecord[key];

    if (isUndefined$1(reactiveObservers)) {
      reactiveObservers = [];
      reactiveRecord[key] = reactiveObservers;
    } else if (reactiveObservers[0] === ro) {
      return; // perf optimization considering that most subscriptions will come from the same record
    }

    if (ArrayIndexOf$1.call(reactiveObservers, ro) === -1) {
      ro.link(reactiveObservers);
    }
  }

  class ReactiveObserver {
    constructor(callback) {
      this.listeners = [];
      this.callback = callback;
    }

    observe(job) {
      const inceptionReactiveRecord = currentReactiveObserver;
      currentReactiveObserver = this;
      let error;

      try {
        job();
      } catch (e) {
        error = Object(e);
      } finally {
        currentReactiveObserver = inceptionReactiveRecord;

        if (error !== undefined) {
          throw error; // eslint-disable-line no-unsafe-finally
        }
      }
    }
    /**
     * This method is responsible for disconnecting the Reactive Observer
     * from any Reactive Record that has a reference to it, to prevent future
     * notifications about previously recorded access.
     */


    reset() {
      const {
        listeners
      } = this;
      const len = listeners.length;

      if (len > 0) {
        for (let i = 0; i < len; i += 1) {
          const set = listeners[i];
          const pos = ArrayIndexOf$1.call(listeners[i], this);
          ArraySplice$1.call(set, pos, 1);
        }

        listeners.length = 0;
      }
    } // friend methods


    notify() {
      this.callback.call(undefined, this);
    }

    link(reactiveObservers) {
      ArrayPush$1.call(reactiveObservers, this); // we keep track of observing records where the observing record was added to so we can do some clean up later on

      ArrayPush$1.call(this.listeners, reactiveObservers);
    }

  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const signedComponentToMetaMap = new Map();
  /**
   * INTERNAL: This function can only be invoked by compiled code. The compiler
   * will prevent this function from being imported by userland code.
   */

  function registerComponent(Ctor, {
    name,
    tmpl: template
  }) {
    signedComponentToMetaMap.set(Ctor, {
      name,
      template
    }); // chaining this method as a way to wrap existing
    // assignment of component constructor easily, without too much transformation

    return Ctor;
  }

  function getComponentRegisteredMeta(Ctor) {
    return signedComponentToMetaMap.get(Ctor);
  }

  function createComponent(uninitializedVm, Ctor) {
    // create the component instance
    invokeComponentConstructor(uninitializedVm, Ctor);
    const initializedVm = uninitializedVm;

    if (isUndefined(initializedVm.component)) {
      throw new ReferenceError(`Invalid construction for ${Ctor}, you must extend LightningElement.`);
    }
  }

  function linkComponent(vm) {
    const {
      def: {
        wire
      }
    } = vm;

    if (!isUndefined(wire)) {
      const {
        wiring
      } = Services;

      if (wiring) {
        invokeServiceHook(vm, wiring);
      }
    }
  }

  function getTemplateReactiveObserver(vm) {
    return new ReactiveObserver(() => {

      const {
        isDirty
      } = vm;

      if (isFalse$1(isDirty)) {
        markComponentAsDirty(vm);
        scheduleRehydration(vm);
      }
    });
  }

  function renderComponent(vm) {

    vm.tro.reset();
    const vnodes = invokeComponentRenderMethod(vm);
    vm.isDirty = false;
    vm.isScheduled = false;

    return vnodes;
  }

  function markComponentAsDirty(vm) {

    vm.isDirty = true;
  }

  const cmpEventListenerMap = new WeakMap();

  function getWrappedComponentsListener(vm, listener) {
    if (!isFunction(listener)) {
      throw new TypeError(); // avoiding problems with non-valid listeners
    }

    let wrappedListener = cmpEventListenerMap.get(listener);

    if (isUndefined(wrappedListener)) {
      wrappedListener = function (event) {
        invokeEventListener(vm, listener, undefined, event);
      };

      cmpEventListenerMap.set(listener, wrappedListener);
    }

    return wrappedListener;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function createObservedFieldsDescriptorMap(fields) {
    return ArrayReduce.call(fields, (acc, field) => {
      acc[field] = createObservedFieldPropertyDescriptor(field);
      return acc;
    }, {});
  }

  function createObservedFieldPropertyDescriptor(key) {
    return {
      get() {
        const vm = getAssociatedVM(this);
        valueObserved(this, key);
        return vm.cmpTrack[key];
      },

      set(newValue) {
        const vm = getAssociatedVM(this);

        if (newValue !== vm.cmpTrack[key]) {
          vm.cmpTrack[key] = newValue;

          if (isFalse$1(vm.isDirty)) {
            valueMutated(this, key);
          }
        }
      },

      enumerable: true,
      configurable: true
    };
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * This is a descriptor map that contains
   * all standard properties that a Custom Element can support (including AOM properties), which
   * determines what kind of capabilities the Base HTML Element and
   * Base Lightning Element should support.
   */


  const HTMLElementOriginalDescriptors = create(null);
  forEach.call(ElementPrototypeAriaPropertyNames, propName => {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
    const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

    if (!isUndefined(descriptor)) {
      HTMLElementOriginalDescriptors[propName] = descriptor;
    }
  });
  forEach.call(defaultDefHTMLPropertyNames, propName => {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
    // this category, so, better to be sure.
    const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

    if (!isUndefined(descriptor)) {
      HTMLElementOriginalDescriptors[propName] = descriptor;
    }
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const ShadowRootInnerHTMLSetter = getOwnPropertyDescriptor(ShadowRoot.prototype, 'innerHTML').set;
  const dispatchEvent = 'EventTarget' in window ? EventTarget.prototype.dispatchEvent : Node.prototype.dispatchEvent; // IE11

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * This operation is called with a descriptor of an standard html property
   * that a Custom Element can support (including AOM properties), which
   * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
   * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
   */

  function createBridgeToElementDescriptor(propName, descriptor) {
    const {
      get,
      set,
      enumerable,
      configurable
    } = descriptor;

    if (!isFunction(get)) {

      throw new TypeError();
    }

    if (!isFunction(set)) {

      throw new TypeError();
    }

    return {
      enumerable,
      configurable,

      get() {
        const vm = getAssociatedVM(this);

        if (isBeingConstructed(vm)) {

          return;
        }

        valueObserved(this, propName);
        return get.call(vm.elm);
      },

      set(newValue) {
        const vm = getAssociatedVM(this);

        if (newValue !== vm.cmpProps[propName]) {
          vm.cmpProps[propName] = newValue;

          if (isFalse$1(vm.isDirty)) {
            // perf optimization to skip this step if not in the DOM
            valueMutated(this, propName);
          }
        }

        return set.call(vm.elm, newValue);
      }

    };
  }

  function getLinkedElement(cmp) {
    return getAssociatedVM(cmp).elm;
  }
  /**
   * This class is the base class for any LWC element.
   * Some elements directly extends this class, others implement it via inheritance.
   **/


  function BaseLightningElementConstructor() {
    // This should be as performant as possible, while any initialization should be done lazily
    if (isNull(vmBeingConstructed)) {
      throw new ReferenceError('Illegal constructor');
    }

    const vm = vmBeingConstructed;
    const {
      elm,
      mode,
      def: {
        ctor
      }
    } = vm;
    const component = this;
    vm.component = component;
    vm.tro = getTemplateReactiveObserver(vm);
    vm.oar = create(null); // interaction hooks
    // We are intentionally hiding this argument from the formal API of LWCElement because
    // we don't want folks to know about it just yet.

    if (arguments.length === 1) {
      const {
        callHook,
        setHook,
        getHook
      } = arguments[0];
      vm.callHook = callHook;
      vm.setHook = setHook;
      vm.getHook = getHook;
    } // attaching the shadowRoot


    const shadowRootOptions = {
      mode,
      delegatesFocus: !!ctor.delegatesFocus,
      '$$lwc-synthetic-mode$$': true
    };
    const cmpRoot = elm.attachShadow(shadowRootOptions); // linking elm, shadow root and component with the VM

    associateVM(component, vm);
    associateVM(cmpRoot, vm);
    associateVM(elm, vm); // VM is now initialized

    vm.cmpRoot = cmpRoot;

    return this;
  } // HTML Element - The Good Parts


  BaseLightningElementConstructor.prototype = {
    constructor: BaseLightningElementConstructor,

    dispatchEvent(_event) {
      const elm = getLinkedElement(this); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch;

      return dispatchEvent.apply(elm, arguments);
    },

    addEventListener(type, listener, options) {
      const vm = getAssociatedVM(this);

      const wrappedListener = getWrappedComponentsListener(vm, listener);
      vm.elm.addEventListener(type, wrappedListener, options);
    },

    removeEventListener(type, listener, options) {
      const vm = getAssociatedVM(this);
      const wrappedListener = getWrappedComponentsListener(vm, listener);
      vm.elm.removeEventListener(type, wrappedListener, options);
    },

    setAttributeNS(ns, attrName, _value) {
      const elm = getLinkedElement(this);
      // @ts-ignore type-mismatch

      elm.setAttributeNS.apply(elm, arguments);
    },

    removeAttributeNS(ns, attrName) {
      const elm = getLinkedElement(this);
      // @ts-ignore type-mismatch

      elm.removeAttributeNS.apply(elm, arguments);
    },

    removeAttribute(attrName) {
      const elm = getLinkedElement(this);
      // @ts-ignore type-mismatch

      elm.removeAttribute.apply(elm, arguments);
    },

    setAttribute(attrName, _value) {
      const elm = getLinkedElement(this);
      // @ts-ignore type-mismatch

      elm.setAttribute.apply(elm, arguments);
    },

    getAttribute(attrName) {
      const elm = getLinkedElement(this);
      // @ts-ignore type-mismatch

      const value = elm.getAttribute.apply(elm, arguments);
      return value;
    },

    getAttributeNS(ns, attrName) {
      const elm = getLinkedElement(this);
      // @ts-ignore type-mismatch

      const value = elm.getAttributeNS.apply(elm, arguments);
      return value;
    },

    getBoundingClientRect() {
      const elm = getLinkedElement(this);

      return elm.getBoundingClientRect();
    },

    /**
     * Returns the first element that is a descendant of node that
     * matches selectors.
     */
    // querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    // querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    querySelector(selectors) {
      const vm = getAssociatedVM(this);

      const {
        elm
      } = vm;
      return elm.querySelector(selectors);
    },

    /**
     * Returns all element descendants of node that
     * match selectors.
     */
    // querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>,
    // querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>,
    querySelectorAll(selectors) {
      const vm = getAssociatedVM(this);

      const {
        elm
      } = vm;
      return elm.querySelectorAll(selectors);
    },

    /**
     * Returns all element descendants of node that
     * match the provided tagName.
     */
    getElementsByTagName(tagNameOrWildCard) {
      const vm = getAssociatedVM(this);

      const {
        elm
      } = vm;
      return elm.getElementsByTagName(tagNameOrWildCard);
    },

    /**
     * Returns all element descendants of node that
     * match the provide classnames.
     */
    getElementsByClassName(names) {
      const vm = getAssociatedVM(this);

      const {
        elm
      } = vm;
      return elm.getElementsByClassName(names);
    },

    get isConnected() {
      const vm = getAssociatedVM(this);
      const {
        elm
      } = vm;
      return elm.isConnected;
    },

    get classList() {

      return getLinkedElement(this).classList;
    },

    get template() {
      const vm = getAssociatedVM(this);
      return vm.cmpRoot;
    },

    get shadowRoot() {
      // From within the component instance, the shadowRoot is always
      // reported as "closed". Authors should rely on this.template instead.
      return null;
    },

    render() {
      const vm = getAssociatedVM(this);
      return vm.def.template;
    },

    toString() {
      const vm = getAssociatedVM(this);
      return `[object ${vm.def.name}]`;
    }

  };
  const baseDescriptors = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (descriptors, propName) => {
    descriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
    return descriptors;
  }, create(null));
  defineProperties(BaseLightningElementConstructor.prototype, baseDescriptors);

  freeze(BaseLightningElementConstructor);
  seal(BaseLightningElementConstructor.prototype); // @ts-ignore

  const BaseLightningElement = BaseLightningElementConstructor;
  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */

  const {
    isArray: isArray$2
  } = Array;
  const {
    getPrototypeOf: getPrototypeOf$1,
    create: ObjectCreate,
    defineProperty: ObjectDefineProperty,
    defineProperties: ObjectDefineProperties,
    isExtensible,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor$1,
    getOwnPropertyNames: getOwnPropertyNames$1,
    getOwnPropertySymbols,
    preventExtensions,
    hasOwnProperty: hasOwnProperty$2
  } = Object;
  const {
    push: ArrayPush$2,
    concat: ArrayConcat,
    map: ArrayMap$1
  } = Array.prototype;

  function isUndefined$2(obj) {
    return obj === undefined;
  }

  function isFunction$1(obj) {
    return typeof obj === 'function';
  }

  function isObject$2(obj) {
    return typeof obj === 'object';
  }

  const proxyToValueMap = new WeakMap();

  function registerProxy(proxy, value) {
    proxyToValueMap.set(proxy, value);
  }

  const unwrap = replicaOrAny => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

  function wrapValue(membrane, value) {
    return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */


  function unwrapDescriptor(descriptor) {
    if (hasOwnProperty$2.call(descriptor, 'value')) {
      descriptor.value = unwrap(descriptor.value);
    }

    return descriptor;
  }

  function lockShadowTarget(membrane, shadowTarget, originalTarget) {
    const targetKeys = ArrayConcat.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols(originalTarget));
    targetKeys.forEach(key => {
      let descriptor = getOwnPropertyDescriptor$1(originalTarget, key); // We do not need to wrap the descriptor if configurable
      // Because we can deal with wrapping it when user goes through
      // Get own property descriptor. There is also a chance that this descriptor
      // could change sometime in the future, so we can defer wrapping
      // until we need to

      if (!descriptor.configurable) {
        descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
      }

      ObjectDefineProperty(shadowTarget, key, descriptor);
    });
    preventExtensions(shadowTarget);
  }

  class ReactiveProxyHandler {
    constructor(membrane, value) {
      this.originalTarget = value;
      this.membrane = membrane;
    }

    get(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const value = originalTarget[key];
      const {
        valueObserved
      } = membrane;
      valueObserved(originalTarget, key);
      return membrane.getProxy(value);
    }

    set(shadowTarget, key, value) {
      const {
        originalTarget,
        membrane: {
          valueMutated
        }
      } = this;
      const oldValue = originalTarget[key];

      if (oldValue !== value) {
        originalTarget[key] = value;
        valueMutated(originalTarget, key);
      } else if (key === 'length' && isArray$2(originalTarget)) {
        // fix for issue #236: push will add the new index, and by the time length
        // is updated, the internal length is already equal to the new length value
        // therefore, the oldValue is equal to the value. This is the forking logic
        // to support this use case.
        valueMutated(originalTarget, key);
      }

      return true;
    }

    deleteProperty(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueMutated
        }
      } = this;
      delete originalTarget[key];
      valueMutated(originalTarget, key);
      return true;
    }

    apply(shadowTarget, thisArg, argArray) {
      /* No op */
    }

    construct(target, argArray, newTarget) {
      /* No op */
    }

    has(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueObserved
        }
      } = this;
      valueObserved(originalTarget, key);
      return key in originalTarget;
    }

    ownKeys(shadowTarget) {
      const {
        originalTarget
      } = this;
      return ArrayConcat.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols(originalTarget));
    }

    isExtensible(shadowTarget) {
      const shadowIsExtensible = isExtensible(shadowTarget);

      if (!shadowIsExtensible) {
        return shadowIsExtensible;
      }

      const {
        originalTarget,
        membrane
      } = this;
      const targetIsExtensible = isExtensible(originalTarget);

      if (!targetIsExtensible) {
        lockShadowTarget(membrane, shadowTarget, originalTarget);
      }

      return targetIsExtensible;
    }

    setPrototypeOf(shadowTarget, prototype) {
    }

    getPrototypeOf(shadowTarget) {
      const {
        originalTarget
      } = this;
      return getPrototypeOf$1(originalTarget);
    }

    getOwnPropertyDescriptor(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueObserved
      } = this.membrane; // keys looked up via hasOwnProperty need to be reactive

      valueObserved(originalTarget, key);
      let desc = getOwnPropertyDescriptor$1(originalTarget, key);

      if (isUndefined$2(desc)) {
        return desc;
      }

      const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

      if (!isUndefined$2(shadowDescriptor)) {
        return shadowDescriptor;
      } // Note: by accessing the descriptor, the key is marked as observed
      // but access to the value, setter or getter (if available) cannot observe
      // mutations, just like regular methods, in which case we just do nothing.


      desc = wrapDescriptor(membrane, desc, wrapValue);

      if (!desc.configurable) {
        // If descriptor from original target is not configurable,
        // We must copy the wrapped descriptor over to the shadow target.
        // Otherwise, proxy will throw an invariant error.
        // This is our last chance to lock the value.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
        ObjectDefineProperty(shadowTarget, key, desc);
      }

      return desc;
    }

    preventExtensions(shadowTarget) {
      const {
        originalTarget,
        membrane
      } = this;
      lockShadowTarget(membrane, shadowTarget, originalTarget);
      preventExtensions(originalTarget);
      return true;
    }

    defineProperty(shadowTarget, key, descriptor) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueMutated
      } = membrane;
      const {
        configurable
      } = descriptor; // We have to check for value in descriptor
      // because Object.freeze(proxy) calls this method
      // with only { configurable: false, writeable: false }
      // Additionally, method will only be called with writeable:false
      // if the descriptor has a value, as opposed to getter/setter
      // So we can just check if writable is present and then see if
      // value is present. This eliminates getter and setter descriptors

      if (hasOwnProperty$2.call(descriptor, 'writable') && !hasOwnProperty$2.call(descriptor, 'value')) {
        const originalDescriptor = getOwnPropertyDescriptor$1(originalTarget, key);
        descriptor.value = originalDescriptor.value;
      }

      ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));

      if (configurable === false) {
        ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
      }

      valueMutated(originalTarget, key);
      return true;
    }

  }

  function wrapReadOnlyValue(membrane, value) {
    return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }

  class ReadOnlyHandler {
    constructor(membrane, value) {
      this.originalTarget = value;
      this.membrane = membrane;
    }

    get(shadowTarget, key) {
      const {
        membrane,
        originalTarget
      } = this;
      const value = originalTarget[key];
      const {
        valueObserved
      } = membrane;
      valueObserved(originalTarget, key);
      return membrane.getReadOnlyProxy(value);
    }

    set(shadowTarget, key, value) {

      return false;
    }

    deleteProperty(shadowTarget, key) {

      return false;
    }

    apply(shadowTarget, thisArg, argArray) {
      /* No op */
    }

    construct(target, argArray, newTarget) {
      /* No op */
    }

    has(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueObserved
        }
      } = this;
      valueObserved(originalTarget, key);
      return key in originalTarget;
    }

    ownKeys(shadowTarget) {
      const {
        originalTarget
      } = this;
      return ArrayConcat.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols(originalTarget));
    }

    setPrototypeOf(shadowTarget, prototype) {
    }

    getOwnPropertyDescriptor(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueObserved
      } = membrane; // keys looked up via hasOwnProperty need to be reactive

      valueObserved(originalTarget, key);
      let desc = getOwnPropertyDescriptor$1(originalTarget, key);

      if (isUndefined$2(desc)) {
        return desc;
      }

      const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

      if (!isUndefined$2(shadowDescriptor)) {
        return shadowDescriptor;
      } // Note: by accessing the descriptor, the key is marked as observed
      // but access to the value or getter (if available) cannot be observed,
      // just like regular methods, in which case we just do nothing.


      desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);

      if (hasOwnProperty$2.call(desc, 'set')) {
        desc.set = undefined; // readOnly membrane does not allow setters
      }

      if (!desc.configurable) {
        // If descriptor from original target is not configurable,
        // We must copy the wrapped descriptor over to the shadow target.
        // Otherwise, proxy will throw an invariant error.
        // This is our last chance to lock the value.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
        ObjectDefineProperty(shadowTarget, key, desc);
      }

      return desc;
    }

    preventExtensions(shadowTarget) {

      return false;
    }

    defineProperty(shadowTarget, key, descriptor) {

      return false;
    }

  }

  function createShadowTarget(value) {
    let shadowTarget = undefined;

    if (isArray$2(value)) {
      shadowTarget = [];
    } else if (isObject$2(value)) {
      shadowTarget = {};
    }

    return shadowTarget;
  }

  const ObjectDotPrototype = Object.prototype;

  function defaultValueIsObservable(value) {
    // intentionally checking for null
    if (value === null) {
      return false;
    } // treat all non-object types, including undefined, as non-observable values


    if (typeof value !== 'object') {
      return false;
    }

    if (isArray$2(value)) {
      return true;
    }

    const proto = getPrototypeOf$1(value);
    return proto === ObjectDotPrototype || proto === null || getPrototypeOf$1(proto) === null;
  }

  const defaultValueObserved = (obj, key) => {
    /* do nothing */
  };

  const defaultValueMutated = (obj, key) => {
    /* do nothing */
  };

  const defaultValueDistortion = value => value;

  function wrapDescriptor(membrane, descriptor, getValue) {
    const {
      set,
      get
    } = descriptor;

    if (hasOwnProperty$2.call(descriptor, 'value')) {
      descriptor.value = getValue(membrane, descriptor.value);
    } else {
      if (!isUndefined$2(get)) {
        descriptor.get = function () {
          // invoking the original getter with the original target
          return getValue(membrane, get.call(unwrap(this)));
        };
      }

      if (!isUndefined$2(set)) {
        descriptor.set = function (value) {
          // At this point we don't have a clear indication of whether
          // or not a valid mutation will occur, we don't have the key,
          // and we are not sure why and how they are invoking this setter.
          // Nevertheless we preserve the original semantics by invoking the
          // original setter with the original target and the unwrapped value
          set.call(unwrap(this), membrane.unwrapProxy(value));
        };
      }
    }

    return descriptor;
  }

  class ReactiveMembrane {
    constructor(options) {
      this.valueDistortion = defaultValueDistortion;
      this.valueMutated = defaultValueMutated;
      this.valueObserved = defaultValueObserved;
      this.valueIsObservable = defaultValueIsObservable;
      this.objectGraph = new WeakMap();

      if (!isUndefined$2(options)) {
        const {
          valueDistortion,
          valueMutated,
          valueObserved,
          valueIsObservable
        } = options;
        this.valueDistortion = isFunction$1(valueDistortion) ? valueDistortion : defaultValueDistortion;
        this.valueMutated = isFunction$1(valueMutated) ? valueMutated : defaultValueMutated;
        this.valueObserved = isFunction$1(valueObserved) ? valueObserved : defaultValueObserved;
        this.valueIsObservable = isFunction$1(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
      }
    }

    getProxy(value) {
      const unwrappedValue = unwrap(value);
      const distorted = this.valueDistortion(unwrappedValue);

      if (this.valueIsObservable(distorted)) {
        const o = this.getReactiveState(unwrappedValue, distorted); // when trying to extract the writable version of a readonly
        // we return the readonly.

        return o.readOnly === value ? value : o.reactive;
      }

      return distorted;
    }

    getReadOnlyProxy(value) {
      value = unwrap(value);
      const distorted = this.valueDistortion(value);

      if (this.valueIsObservable(distorted)) {
        return this.getReactiveState(value, distorted).readOnly;
      }

      return distorted;
    }

    unwrapProxy(p) {
      return unwrap(p);
    }

    getReactiveState(value, distortedValue) {
      const {
        objectGraph
      } = this;
      let reactiveState = objectGraph.get(distortedValue);

      if (reactiveState) {
        return reactiveState;
      }

      const membrane = this;
      reactiveState = {
        get reactive() {
          const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue); // caching the reactive proxy after the first time it is accessed

          const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
          registerProxy(proxy, value);
          ObjectDefineProperty(this, 'reactive', {
            value: proxy
          });
          return proxy;
        },

        get readOnly() {
          const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue); // caching the readOnly proxy after the first time it is accessed

          const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
          registerProxy(proxy, value);
          ObjectDefineProperty(this, 'readOnly', {
            value: proxy
          });
          return proxy;
        }

      };
      objectGraph.set(distortedValue, reactiveState);
      return reactiveState;
    }

  }
  /** version: 0.26.0 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function valueDistortion(value) {
    return value;
  }

  const reactiveMembrane = new ReactiveMembrane({
    valueObserved,
    valueMutated,
    valueDistortion
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // from the element instance, and get the value or set a new value on the component.
  // This means that across different elements, similar names can get the exact same
  // descriptor, so we can cache them:


  const cachedGetterByKey = create(null);
  const cachedSetterByKey = create(null);

  function createGetter(key) {
    let fn = cachedGetterByKey[key];

    if (isUndefined(fn)) {
      fn = cachedGetterByKey[key] = function () {
        const vm = getAssociatedVM(this);
        const {
          getHook
        } = vm;
        return getHook(vm.component, key);
      };
    }

    return fn;
  }

  function createSetter(key) {
    let fn = cachedSetterByKey[key];

    if (isUndefined(fn)) {
      fn = cachedSetterByKey[key] = function (newValue) {
        const vm = getAssociatedVM(this);
        const {
          setHook
        } = vm;
        newValue = reactiveMembrane.getReadOnlyProxy(newValue);
        setHook(vm.component, key, newValue);
      };
    }

    return fn;
  }

  function createMethodCaller(methodName) {
    return function () {
      const vm = getAssociatedVM(this);
      const {
        callHook,
        component
      } = vm;
      const fn = component[methodName];
      return callHook(vm.component, fn, ArraySlice$1.call(arguments));
    };
  }

  function HTMLBridgeElementFactory(SuperClass, props, methods) {
    let HTMLBridgeElement;
    /**
     * Modern browsers will have all Native Constructors as regular Classes
     * and must be instantiated with the new keyword. In older browsers,
     * specifically IE11, those are objects with a prototype property defined,
     * since they are not supposed to be extended or instantiated with the
     * new keyword. This forking logic supports both cases, specifically because
     * wc.ts relies on the construction path of the bridges to create new
     * fully qualifying web components.
     */

    if (isFunction(SuperClass)) {
      HTMLBridgeElement = class extends SuperClass {};
    } else {
      HTMLBridgeElement = function () {
        // Bridge classes are not supposed to be instantiated directly in
        // browsers that do not support web components.
        throw new TypeError('Illegal constructor');
      }; // prototype inheritance dance


      setPrototypeOf(HTMLBridgeElement, SuperClass);
      setPrototypeOf(HTMLBridgeElement.prototype, SuperClass.prototype);
      defineProperty(HTMLBridgeElement.prototype, 'constructor', {
        writable: true,
        configurable: true,
        value: HTMLBridgeElement
      });
    }

    const descriptors = create(null); // expose getters and setters for each public props on the new Element Bridge

    for (let i = 0, len = props.length; i < len; i += 1) {
      const propName = props[i];
      descriptors[propName] = {
        get: createGetter(propName),
        set: createSetter(propName),
        enumerable: true,
        configurable: true
      };
    } // expose public methods as props on the new Element Bridge


    for (let i = 0, len = methods.length; i < len; i += 1) {
      const methodName = methods[i];
      descriptors[methodName] = {
        value: createMethodCaller(methodName),
        writable: true,
        configurable: true
      };
    }

    defineProperties(HTMLBridgeElement.prototype, descriptors);
    return HTMLBridgeElement;
  }

  const BaseBridgeElement = HTMLBridgeElementFactory(HTMLElement, getOwnPropertyNames(HTMLElementOriginalDescriptors), []);
  freeze(BaseBridgeElement);
  seal(BaseBridgeElement.prototype);
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * @track decorator to mark fields as reactive in
   * LWC Components. This function implements the internals of this
   * decorator.
   */

  function track(target, prop, descriptor) {
    if (arguments.length === 1) {
      return reactiveMembrane.getProxy(target);
    }

    return createTrackedPropertyDescriptor(target, prop, isUndefined(descriptor) ? true : descriptor.enumerable === true);
  }

  function createTrackedPropertyDescriptor(Ctor, key, enumerable) {
    return {
      get() {
        const vm = getAssociatedVM(this);
        valueObserved(this, key);
        return vm.cmpTrack[key];
      },

      set(newValue) {
        const vm = getAssociatedVM(this);

        const reactiveOrAnyValue = reactiveMembrane.getProxy(newValue);

        if (reactiveOrAnyValue !== vm.cmpTrack[key]) {
          vm.cmpTrack[key] = reactiveOrAnyValue;

          if (isFalse$1(vm.isDirty)) {
            // perf optimization to skip this step if the track property is on a component that is already dirty
            valueMutated(this, key);
          }
        }
      },

      enumerable,
      configurable: true
    };
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function wireDecorator(target, prop, descriptor) {

    return createTrackedPropertyDescriptor(target, prop, isObject$1(descriptor) ? descriptor.enumerable === true : true);
  }
  /**
   * @wire decorator to wire fields and methods to a wire adapter in
   * LWC Components. This function implements the internals of this
   * decorator.
   */


  function wire(_adapter, _config) {
    const len = arguments.length;

    if (len > 0 && len < 3) {
      return wireDecorator;
    } else {

      throw new TypeError();
    }
  }
  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    assign: assign$1,
    create: create$2,
    defineProperties: defineProperties$1,
    defineProperty: defineProperty$1,
    freeze: freeze$1,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor$2,
    getOwnPropertyNames: getOwnPropertyNames$2,
    getPrototypeOf: getPrototypeOf$2,
    hasOwnProperty: hasOwnProperty$3,
    keys: keys$1,
    seal: seal$1,
    setPrototypeOf: setPrototypeOf$1
  } = Object;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * In IE11, symbols are expensive.
   * Due to the nature of the symbol polyfill. This method abstract the
   * creation of symbols, so we can fallback to string when native symbols
   * are not supported. Note that we can't use typeof since it will fail when transpiling.
   */


  const hasNativeSymbolsSupport$1 = Symbol('x').toString() === 'Symbol(x)';
  /** version: 1.3.7-226.4 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // Cached reference to globalThis

  let _globalThis;

  if (typeof globalThis === 'object') {
    _globalThis = globalThis;
  }

  function getGlobalThis() {
    if (typeof _globalThis === 'object') {
      return _globalThis;
    }

    try {
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(Object.prototype, '__magic__', {
        get: function () {
          return this;
        },
        configurable: true
      }); // @ts-ignore
      // __magic__ is undefined in Safari 10 and IE10 and older.
      // eslint-disable-next-line no-undef

      _globalThis = __magic__; // @ts-ignore

      delete Object.prototype.__magic__;
    } catch (ex) {// In IE8, Object.defineProperty only works on DOM objects.
    } finally {
      // If the magic above fails for some reason we assume that we are in a
      // legacy browser. Assume `window` exists in this case.
      if (typeof _globalThis === 'undefined') {
        _globalThis = window;
      }
    }

    return _globalThis;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const _globalThis$1 = getGlobalThis();

  if (!_globalThis$1.lwcRuntimeFlags) {
    Object.defineProperty(_globalThis$1, 'lwcRuntimeFlags', {
      value: create$2(null)
    });
  }

  const runtimeFlags = _globalThis$1.lwcRuntimeFlags; // This function is not supported for use within components and is meant for
  /** version: 1.3.7-226.4 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * @api decorator to mark public fields and public methods in
   * LWC Components. This function implements the internals of this
   * decorator.
   */

  function api$1(target, propName, descriptor) {

    const meta = getDecoratorsRegisteredMeta(target); // initializing getters and setters for each public prop on the target prototype

    if (isObject$1(descriptor) && (isFunction(descriptor.get) || isFunction(descriptor.set))) {
      // if it is configured as an accessor it must have a descriptor
      // @ts-ignore it must always be set before calling this method
      meta.props[propName].config = isFunction(descriptor.set) ? 3 : 1;
      return createPublicAccessorDescriptor(target, propName, descriptor);
    } else {
      // @ts-ignore it must always be set before calling this method
      meta.props[propName].config = 0;
      return createPublicPropertyDescriptor(target, propName, descriptor);
    }
  }

  function createPublicPropertyDescriptor(proto, key, descriptor) {
    return {
      get() {
        const vm = getAssociatedVM(this);

        if (isBeingConstructed(vm)) {

          return;
        }

        valueObserved(this, key);
        return vm.cmpProps[key];
      },

      set(newValue) {
        const vm = getAssociatedVM(this);

        vm.cmpProps[key] = newValue; // avoid notification of observability if the instance is already dirty

        if (isFalse$1(vm.isDirty)) {
          // perf optimization to skip this step if the component is dirty already.
          valueMutated(this, key);
        }
      },

      enumerable: isUndefined(descriptor) ? true : descriptor.enumerable
    };
  }

  class AccessorReactiveObserver extends ReactiveObserver {
    constructor(vm, set) {
      super(() => {
        if (isFalse$1(this.debouncing)) {
          this.debouncing = true;
          addCallbackToNextTick(() => {
            if (isTrue$1(this.debouncing)) {
              const {
                value
              } = this;
              const {
                isDirty: dirtyStateBeforeSetterCall,
                component,
                idx
              } = vm;
              set.call(component, value); // de-bouncing after the call to the original setter to prevent
              // infinity loop if the setter itself is mutating things that
              // were accessed during the previous invocation.

              this.debouncing = false;

              if (isTrue$1(vm.isDirty) && isFalse$1(dirtyStateBeforeSetterCall) && idx > 0) {
                // immediate rehydration due to a setter driven mutation, otherwise
                // the component will get rendered on the second tick, which it is not
                // desirable.
                rerenderVM(vm);
              }
            }
          });
        }
      });
      this.debouncing = false;
    }

    reset(value) {
      super.reset();
      this.debouncing = false;

      if (arguments.length > 0) {
        this.value = value;
      }
    }

  }

  function createPublicAccessorDescriptor(Ctor, key, descriptor) {
    const {
      get,
      set,
      enumerable
    } = descriptor;

    if (!isFunction(get)) {

      throw new TypeError();
    }

    return {
      get() {

        return get.call(this);
      },

      set(newValue) {
        const vm = getAssociatedVM(this);

        if (set) {
          if (runtimeFlags.ENABLE_REACTIVE_SETTER) {
            let ro = vm.oar[key];

            if (isUndefined(ro)) {
              ro = vm.oar[key] = new AccessorReactiveObserver(vm, set);
            } // every time we invoke this setter from outside (through this wrapper setter)
            // we should reset the value and then debounce just in case there is a pending
            // invocation the next tick that is not longer relevant since the value is changing
            // from outside.


            ro.reset(newValue);
            ro.observe(() => {
              set.call(this, newValue);
            });
          } else {
            set.call(this, newValue);
          }
        }
      },

      enumerable
    };
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * EXPERIMENTAL: This function allows for the registration of "services" in
   * LWC by exposing hooks into the component life-cycle. This API is subject
   * to change or being removed.
   */


  function decorate(Ctor, decorators) {
    // intentionally comparing decorators with null and undefined
    if (!isFunction(Ctor) || decorators == null) {
      throw new TypeError();
    }

    const props = getOwnPropertyNames(decorators); // intentionally allowing decoration of classes only for now

    const target = Ctor.prototype;

    for (let i = 0, len = props.length; i < len; i += 1) {
      const propName = props[i];
      const decorator = decorators[propName];

      if (!isFunction(decorator)) {
        throw new TypeError();
      }

      const originalDescriptor = getOwnPropertyDescriptor(target, propName);
      const descriptor = decorator(Ctor, propName, originalDescriptor);

      if (!isUndefined(descriptor)) {
        defineProperty(target, propName, descriptor);
      }
    }

    return Ctor; // chaining
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const signedDecoratorToMetaMap = new Map();
  /**
   * INTERNAL: This function can only be invoked by compiled code. The compiler
   * will prevent this function from being imported by userland code.
   */

  function registerDecorators(Ctor, meta) {
    const decoratorMap = create(null);
    const props = getPublicPropertiesHash(Ctor, meta.publicProps);
    const methods = getPublicMethodsHash(Ctor, meta.publicMethods);
    const wire$1 = getWireHash(Ctor, meta.wire);
    const track$1 = getTrackHash(Ctor, meta.track);
    const fields = meta.fields;
    signedDecoratorToMetaMap.set(Ctor, {
      props,
      methods,
      wire: wire$1,
      track: track$1,
      fields
    });

    for (const propName in props) {
      decoratorMap[propName] = api$1;
    }

    if (wire$1) {
      for (const propName in wire$1) {
        const wireDef = wire$1[propName];

        if (wireDef.method) {
          // for decorated methods we need to do nothing
          continue;
        }

        decoratorMap[propName] = wire(wireDef.adapter, wireDef.params);
      }
    }

    if (track$1) {
      for (const propName in track$1) {
        decoratorMap[propName] = track;
      }
    }

    decorate(Ctor, decoratorMap);
    return Ctor;
  }

  function getDecoratorsRegisteredMeta(Ctor) {
    return signedDecoratorToMetaMap.get(Ctor);
  }

  function getTrackHash(target, track) {
    if (isUndefined(track) || getOwnPropertyNames(track).length === 0) {
      return EmptyObject;
    } // TODO [#1302]: check that anything in `track` is correctly defined in the prototype


    return assign(create(null), track);
  }

  function getWireHash(target, wire) {
    if (isUndefined(wire) || getOwnPropertyNames(wire).length === 0) {
      return;
    } // TODO [#1302]: check that anything in `wire` is correctly defined in the prototype


    return assign(create(null), wire);
  }

  function getPublicPropertiesHash(target, props) {
    if (isUndefined(props) || getOwnPropertyNames(props).length === 0) {
      return EmptyObject;
    }

    return getOwnPropertyNames(props).reduce((propsHash, propName) => {
      const attr = getAttrNameFromPropName(propName);
      propsHash[propName] = assign({
        config: 0,
        type: 'any',
        attr
      }, props[propName]);
      return propsHash;
    }, create(null));
  }

  function getPublicMethodsHash(target, publicMethods) {
    if (isUndefined(publicMethods) || publicMethods.length === 0) {
      return EmptyObject;
    }

    return publicMethods.reduce((methodsHash, methodName) => {
      const method = target.prototype[methodName];

      methodsHash[methodName] = method;
      return methodsHash;
    }, create(null));
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CtorToDefMap = new WeakMap();

  function getCtorProto(Ctor, subclassComponentName) {
    let proto = getPrototypeOf(Ctor);

    if (isNull(proto)) {
      throw new ReferenceError(`Invalid prototype chain for ${subclassComponentName}, you must extend LightningElement.`);
    } // covering the cases where the ref is circular in AMD


    if (isCircularModuleDependency(proto)) {
      const p = resolveCircularModuleDependency(proto);
      // of our Base class without having to leak it to user-land. If the circular function returns
      // itself, that's the signal that we have hit the end of the proto chain, which must always
      // be base.


      proto = p === proto ? BaseLightningElement : p;
    }

    return proto;
  }

  function createComponentDef(Ctor, meta, subclassComponentName) {

    const {
      name
    } = meta;
    let {
      template
    } = meta;
    const decoratorsMeta = getDecoratorsRegisteredMeta(Ctor);
    let props = {};
    let methods = {};
    let wire;
    let track = {};
    let fields;

    if (!isUndefined(decoratorsMeta)) {
      props = decoratorsMeta.props;
      methods = decoratorsMeta.methods;
      wire = decoratorsMeta.wire;
      track = decoratorsMeta.track;
      fields = decoratorsMeta.fields;
    }

    const proto = Ctor.prototype;
    let {
      connectedCallback,
      disconnectedCallback,
      renderedCallback,
      errorCallback,
      render
    } = proto;
    const superProto = getCtorProto(Ctor, subclassComponentName);
    const superDef = superProto !== BaseLightningElement ? getComponentDef(superProto, subclassComponentName) : null;
    const SuperBridge = isNull(superDef) ? BaseBridgeElement : superDef.bridge;
    const bridge = HTMLBridgeElementFactory(SuperBridge, getOwnPropertyNames(props), getOwnPropertyNames(methods));

    if (!isNull(superDef)) {
      props = assign(create(null), superDef.props, props);
      methods = assign(create(null), superDef.methods, methods);
      wire = superDef.wire || wire ? assign(create(null), superDef.wire, wire) : undefined;
      track = assign(create(null), superDef.track, track);
      connectedCallback = connectedCallback || superDef.connectedCallback;
      disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
      renderedCallback = renderedCallback || superDef.renderedCallback;
      errorCallback = errorCallback || superDef.errorCallback;
      render = render || superDef.render;
      template = template || superDef.template;
    }

    props = assign(create(null), HTML_PROPS, props);

    if (!isUndefined(fields)) {
      defineProperties(proto, createObservedFieldsDescriptorMap(fields));
    }

    if (isUndefined(template)) {
      // default template
      template = defaultEmptyTemplate;
    }

    const def = {
      ctor: Ctor,
      name,
      wire,
      track,
      props,
      methods,
      bridge,
      template,
      connectedCallback,
      disconnectedCallback,
      renderedCallback,
      errorCallback,
      render
    };

    return def;
  }
  /**
   * EXPERIMENTAL: This function allows for the identification of LWC
   * constructors. This API is subject to change or being removed.
   */


  function isComponentConstructor(ctor) {
    if (!isFunction(ctor)) {
      return false;
    } // Fast path: LightningElement is part of the prototype chain of the constructor.


    if (ctor.prototype instanceof BaseLightningElement) {
      return true;
    } // Slow path: LightningElement is not part of the prototype chain of the constructor, we need
    // climb up the constructor prototype chain to check in case there are circular dependencies
    // to resolve.


    let current = ctor;

    do {
      if (isCircularModuleDependency(current)) {
        const circularResolved = resolveCircularModuleDependency(current); // If the circular function returns itself, that's the signal that we have hit the end of the proto chain,
        // which must always be a valid base constructor.

        if (circularResolved === current) {
          return true;
        }

        current = circularResolved;
      }

      if (current === BaseLightningElement) {
        return true;
      }
    } while (!isNull(current) && (current = getPrototypeOf(current))); // Finally return false if the LightningElement is not part of the prototype chain.


    return false;
  }
  /**
   * EXPERIMENTAL: This function allows for the collection of internal
   * component metadata. This API is subject to change or being removed.
   */


  function getComponentDef(Ctor, subclassComponentName) {
    let def = CtorToDefMap.get(Ctor);

    if (isUndefined(def)) {
      if (!isComponentConstructor(Ctor)) {
        throw new TypeError(`${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`);
      }

      let meta = getComponentRegisteredMeta(Ctor);

      if (isUndefined(meta)) {
        // TODO [#1295]: remove this workaround after refactoring tests
        meta = {
          template: undefined,
          name: Ctor.name
        };
      }

      def = createComponentDef(Ctor, meta, subclassComponentName || Ctor.name);
      CtorToDefMap.set(Ctor, def);
    }

    return def;
  }
  // No DOM Patching occurs here


  function setElementProto(elm, def) {
    setPrototypeOf(elm, def.bridge.prototype);
  }

  const HTML_PROPS = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (props, propName) => {
    const attrName = getAttrNameFromPropName(propName);
    props[propName] = {
      config: 3,
      type: 'any',
      attr: attrName
    };
    return props;
  }, create(null));
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  var VMState;

  (function (VMState) {
    VMState[VMState["created"] = 0] = "created";
    VMState[VMState["connected"] = 1] = "connected";
    VMState[VMState["disconnected"] = 2] = "disconnected";
  })(VMState || (VMState = {}));

  let idx = 0;
  /** The internal slot used to associate different objects the engine manipulates with the VM */

  const ViewModelReflection = createHiddenField('ViewModel', 'engine');

  function callHook(cmp, fn, args = []) {
    return fn.apply(cmp, args);
  }

  function setHook(cmp, prop, newValue) {
    cmp[prop] = newValue;
  }

  function getHook(cmp, prop) {
    return cmp[prop];
  }

  function rerenderVM(vm) {
    rehydrate(vm);
  }

  function appendRootVM(vm) {
    runConnectedCallback(vm);
    rehydrate(vm);
  }

  function appendVM(vm) {
    rehydrate(vm);
  } // just in case the component comes back, with this we guarantee re-rendering it
  // while preventing any attempt to rehydration until after reinsertion.


  function resetComponentStateWhenRemoved(vm) {
    const {
      state
    } = vm;

    if (state !== VMState.disconnected) {
      const {
        oar,
        tro
      } = vm; // Making sure that any observing record will not trigger the rehydrated on this vm

      tro.reset(); // Making sure that any observing accessor record will not trigger the setter to be reinvoked

      for (const key in oar) {
        oar[key].reset();
      }

      runDisconnectedCallback(vm); // Spec: https://dom.spec.whatwg.org/#concept-node-remove (step 14-15)

      runShadowChildNodesDisconnectedCallback(vm);
      runLightChildNodesDisconnectedCallback(vm);
    }
  } // this method is triggered by the diffing algo only when a vnode from the
  // old vnode.children is removed from the DOM.


  function removeVM(vm) {

    resetComponentStateWhenRemoved(vm);
  } // this method is triggered by the removal of a root element from the DOM.


  function removeRootVM(vm) {
    resetComponentStateWhenRemoved(vm);
  }

  function createVM(elm, Ctor, options) {

    const def = getComponentDef(Ctor);
    const {
      isRoot,
      mode,
      owner
    } = options;
    idx += 1;
    const uninitializedVm = {
      // component creation index is defined once, and never reset, it can
      // be preserved from one insertion to another without any issue
      idx,
      state: VMState.created,
      isScheduled: false,
      isDirty: true,
      isRoot: isTrue$1(isRoot),
      mode,
      def,
      owner,
      elm,
      data: EmptyObject,
      context: create(null),
      cmpProps: create(null),
      cmpTrack: create(null),
      cmpSlots: useSyntheticShadow ? create(null) : undefined,
      callHook,
      setHook,
      getHook,
      children: EmptyArray,
      aChildren: EmptyArray,
      velements: EmptyArray,
      // Perf optimization to preserve the shape of this obj
      cmpTemplate: undefined,
      component: undefined,
      cmpRoot: undefined,
      tro: undefined,
      oar: undefined
    };


    createComponent(uninitializedVm, Ctor); // link component to the wire service

    const initializedVm = uninitializedVm;
    linkComponent(initializedVm);
  }

  function associateVM(obj, vm) {
    setHiddenField(obj, ViewModelReflection, vm);
  }

  function getAssociatedVM(obj) {
    const vm = getHiddenField(obj, ViewModelReflection);

    return vm;
  }

  function getAssociatedVMIfPresent(obj) {
    const maybeVm = getHiddenField(obj, ViewModelReflection);

    return maybeVm;
  }

  function rehydrate(vm) {

    if (isTrue$1(vm.isDirty)) {
      const children = renderComponent(vm);
      patchShadowRoot(vm, children);
    }
  }

  function patchShadowRoot(vm, newCh) {
    const {
      cmpRoot,
      children: oldCh
    } = vm;
    vm.children = newCh; // caching the new children collection

    if (newCh.length > 0 || oldCh.length > 0) {
      // patch function mutates vnodes by adding the element reference,
      // however, if patching fails it contains partial changes.
      if (oldCh !== newCh) {
        const fn = hasDynamicChildren(newCh) ? updateDynamicChildren : updateStaticChildren;
        runWithBoundaryProtection(vm, vm, () => {
        }, () => {
          // job
          fn(cmpRoot, oldCh, newCh);
        }, () => {
        });
      }
    }

    if (vm.state === VMState.connected) {
      // If the element is connected, that means connectedCallback was already issued, and
      // any successive rendering should finish with the call to renderedCallback, otherwise
      // the connectedCallback will take care of calling it in the right order at the end of
      // the current rehydration process.
      runRenderedCallback(vm);
    }
  }

  function runRenderedCallback(vm) {
    const {
      rendered
    } = Services;

    if (rendered) {
      invokeServiceHook(vm, rendered);
    }

    invokeComponentRenderedCallback(vm);
  }

  let rehydrateQueue = [];

  function flushRehydrationQueue() {
    startGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);

    const vms = rehydrateQueue.sort((a, b) => a.idx - b.idx);
    rehydrateQueue = []; // reset to a new queue

    for (let i = 0, len = vms.length; i < len; i += 1) {
      const vm = vms[i];

      try {
        rehydrate(vm);
      } catch (error) {
        if (i + 1 < len) {
          // pieces of the queue are still pending to be rehydrated, those should have priority
          if (rehydrateQueue.length === 0) {
            addCallbackToNextTick(flushRehydrationQueue);
          }

          ArrayUnshift$1.apply(rehydrateQueue, ArraySlice$1.call(vms, i + 1));
        } // we need to end the measure before throwing.


        endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE); // re-throwing the original error will break the current tick, but since the next tick is
        // already scheduled, it should continue patching the rest.

        throw error; // eslint-disable-line no-unsafe-finally
      }
    }

    endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);
  }

  function runConnectedCallback(vm) {
    const {
      state
    } = vm;

    if (state === VMState.connected) {
      return; // nothing to do since it was already connected
    }

    vm.state = VMState.connected; // reporting connection

    const {
      connected
    } = Services;

    if (connected) {
      invokeServiceHook(vm, connected);
    }

    const {
      connectedCallback
    } = vm.def;

    if (!isUndefined(connectedCallback)) {

      invokeComponentCallback(vm, connectedCallback);
    }
  }

  function runDisconnectedCallback(vm) {

    if (isFalse$1(vm.isDirty)) {
      // this guarantees that if the component is reused/reinserted,
      // it will be re-rendered because we are disconnecting the reactivity
      // linking, so mutations are not automatically reflected on the state
      // of disconnected components.
      vm.isDirty = true;
    }

    vm.state = VMState.disconnected; // reporting disconnection

    const {
      disconnected
    } = Services;

    if (disconnected) {
      invokeServiceHook(vm, disconnected);
    }

    const {
      disconnectedCallback
    } = vm.def;

    if (!isUndefined(disconnectedCallback)) {

      invokeComponentCallback(vm, disconnectedCallback);
    }
  }

  function runShadowChildNodesDisconnectedCallback(vm) {
    const {
      velements: vCustomElementCollection
    } = vm; // reporting disconnection for every child in inverse order since they are inserted in reserved order

    for (let i = vCustomElementCollection.length - 1; i >= 0; i -= 1) {
      const elm = vCustomElementCollection[i].elm; // There are two cases where the element could be undefined:
      // * when there is an error during the construction phase, and an
      //   error boundary picks it, there is a possibility that the VCustomElement
      //   is not properly initialized, and therefore is should be ignored.
      // * when slotted custom element is not used by the element where it is slotted
      //   into it, as a result, the custom element was never initialized.

      if (!isUndefined(elm)) {
        const childVM = getAssociatedVM(elm);
        resetComponentStateWhenRemoved(childVM);
      }
    }
  }

  function runLightChildNodesDisconnectedCallback(vm) {
    const {
      aChildren: adoptedChildren
    } = vm;
    recursivelyDisconnectChildren(adoptedChildren);
  }
  /**
   * The recursion doesn't need to be a complete traversal of the vnode graph,
   * instead it can be partial, when a custom element vnode is found, we don't
   * need to continue into its children because by attempting to disconnect the
   * custom element itself will trigger the removal of anything slotted or anything
   * defined on its shadow.
   */


  function recursivelyDisconnectChildren(vnodes) {
    for (let i = 0, len = vnodes.length; i < len; i += 1) {
      const vnode = vnodes[i];

      if (!isNull(vnode) && isArray$1(vnode.children) && !isUndefined(vnode.elm)) {
        // vnode is a VElement with children
        if (isUndefined(vnode.ctor)) {
          // it is a VElement, just keep looking (recursively)
          recursivelyDisconnectChildren(vnode.children);
        } else {
          // it is a VCustomElement, disconnect it and ignore its children
          resetComponentStateWhenRemoved(getAssociatedVM(vnode.elm));
        }
      }
    }
  } // This is a super optimized mechanism to remove the content of the shadowRoot
  // without having to go into snabbdom. Especially useful when the reset is a consequence
  // of an error, in which case the children VNodes might not be representing the current
  // state of the DOM


  function resetShadowRoot(vm) {
    vm.children = EmptyArray;
    ShadowRootInnerHTMLSetter.call(vm.cmpRoot, ''); // disconnecting any known custom element inside the shadow of the this vm

    runShadowChildNodesDisconnectedCallback(vm);
  }

  function scheduleRehydration(vm) {
    if (!vm.isScheduled) {
      vm.isScheduled = true;

      if (rehydrateQueue.length === 0) {
        addCallbackToNextTick(flushRehydrationQueue);
      }

      ArrayPush.call(rehydrateQueue, vm);
    }
  }

  function getErrorBoundaryVM(vm) {
    let currentVm = vm;

    while (!isNull(currentVm)) {
      if (!isUndefined(currentVm.def.errorCallback)) {
        return currentVm;
      }

      currentVm = currentVm.owner;
    }
  }
  // NOTE: we should probably more this routine to the synthetic shadow folder
  // and get the allocation to be cached by in the elm instead of in the VM


  function allocateInSlot(vm, children) {

    const {
      cmpSlots: oldSlots
    } = vm;
    const cmpSlots = vm.cmpSlots = create(null);

    for (let i = 0, len = children.length; i < len; i += 1) {
      const vnode = children[i];

      if (isNull(vnode)) {
        continue;
      }

      const {
        data
      } = vnode;
      const slotName = data.attrs && data.attrs.slot || '';
      const vnodes = cmpSlots[slotName] = cmpSlots[slotName] || []; // re-keying the vnodes is necessary to avoid conflicts with default content for the slot
      // which might have similar keys. Each vnode will always have a key that
      // starts with a numeric character from compiler. In this case, we add a unique
      // notation for slotted vnodes keys, e.g.: `@foo:1:1`

      vnode.key = `@${slotName}:${vnode.key}`;
      ArrayPush.call(vnodes, vnode);
    }

    if (isFalse$1(vm.isDirty)) {
      // We need to determine if the old allocation is really different from the new one
      // and mark the vm as dirty
      const oldKeys = keys(oldSlots);

      if (oldKeys.length !== keys(cmpSlots).length) {
        markComponentAsDirty(vm);
        return;
      }

      for (let i = 0, len = oldKeys.length; i < len; i += 1) {
        const key = oldKeys[i];

        if (isUndefined(cmpSlots[key]) || oldSlots[key].length !== cmpSlots[key].length) {
          markComponentAsDirty(vm);
          return;
        }

        const oldVNodes = oldSlots[key];
        const vnodes = cmpSlots[key];

        for (let j = 0, a = cmpSlots[key].length; j < a; j += 1) {
          if (oldVNodes[j] !== vnodes[j]) {
            markComponentAsDirty(vm);
            return;
          }
        }
      }
    }
  }

  function runWithBoundaryProtection(vm, owner, pre, job, post) {
    let error;
    pre();

    try {
      job();
    } catch (e) {
      error = Object(e);
    } finally {
      post();

      if (!isUndefined(error)) {
        error.wcStack = error.wcStack || getErrorComponentStack(vm);
        const errorBoundaryVm = isNull(owner) ? undefined : getErrorBoundaryVM(owner);

        if (isUndefined(errorBoundaryVm)) {
          throw error; // eslint-disable-line no-unsafe-finally
        }

        resetShadowRoot(vm); // remove offenders


        const errorCallback = errorBoundaryVm.def.errorCallback;
        invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);
      }
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    appendChild,
    insertBefore,
    removeChild,
    replaceChild
  } = Node.prototype;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const ConnectingSlot = createHiddenField('connecting', 'engine');
  const DisconnectingSlot = createHiddenField('disconnecting', 'engine');

  function callNodeSlot(node, slot) {

    const fn = getHiddenField(node, slot);

    if (!isUndefined(fn)) {
      fn();
    }

    return node; // for convenience
  } // monkey patching Node methods to be able to detect the insertions and removal of
  // root elements created via createElement.


  assign(Node.prototype, {
    appendChild(newChild) {
      const appendedNode = appendChild.call(this, newChild);
      return callNodeSlot(appendedNode, ConnectingSlot);
    },

    insertBefore(newChild, referenceNode) {
      const insertedNode = insertBefore.call(this, newChild, referenceNode);
      return callNodeSlot(insertedNode, ConnectingSlot);
    },

    removeChild(oldChild) {
      const removedNode = removeChild.call(this, oldChild);
      return callNodeSlot(removedNode, DisconnectingSlot);
    },

    replaceChild(newChild, oldChild) {
      const replacedNode = replaceChild.call(this, newChild, oldChild);
      callNodeSlot(replacedNode, DisconnectingSlot);
      callNodeSlot(newChild, ConnectingSlot);
      return replacedNode;
    }

  });
  /**
   * EXPERIMENTAL: This function is almost identical to document.createElement
   * (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
   * with the slightly difference that in the options, you can pass the `is`
   * property set to a Constructor instead of just a string value. The intent
   * is to allow the creation of an element controlled by LWC without having
   * to register the element as a custom element. E.g.:
   *
   * const el = createElement('x-foo', { is: FooCtor });
   *
   * If the value of `is` attribute is not a constructor,
   * then it throws a TypeError.
   */

  function createElement(sel, options) {
    if (!isObject$1(options) || isNull(options)) {
      throw new TypeError(`"createElement" function expects an object as second parameter but received "${toString(options)}".`);
    }

    let Ctor = options.is;

    if (!isFunction(Ctor)) {
      throw new TypeError(`"createElement" function expects a "is" option with a valid component constructor.`);
    }

    const mode = options.mode !== 'closed' ? 'open' : 'closed'; // Create element with correct tagName

    const element = document.createElement(sel);

    if (!isUndefined(getAssociatedVMIfPresent(element))) {
      // There is a possibility that a custom element is registered under tagName,
      // in which case, the initialization is already carry on, and there is nothing else
      // to do here.
      return element;
    }

    if (isCircularModuleDependency(Ctor)) {
      Ctor = resolveCircularModuleDependency(Ctor);
    }

    const def = getComponentDef(Ctor);
    setElementProto(element, def);


    createVM(element, Ctor, {
      mode,
      isRoot: true,
      owner: null
    }); // Handle insertion and removal from the DOM manually

    setHiddenField(element, ConnectingSlot, () => {
      const vm = getAssociatedVM(element);
      startGlobalMeasure(GlobalMeasurementPhase.HYDRATE, vm);

      if (vm.state === VMState.connected) {
        // usually means moving the element from one place to another, which is observable via life-cycle hooks
        removeRootVM(vm);
      }

      appendRootVM(vm);
      endGlobalMeasure(GlobalMeasurementPhase.HYDRATE, vm);
    });
    setHiddenField(element, DisconnectingSlot, () => {
      const vm = getAssociatedVM(element);
      removeRootVM(vm);
    });
    return element;
  }
  /** version: 1.3.7-226.4 */

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  const BEFORE_ALL = 'beforeAll';
  const BEFORE = 'before';
  const AFTER_ALL = 'afterAll';
  const AFTER = 'after';
  const MODE_ONLY = 'only';
  const MODE_SKIP = 'skip';
  const MODES = {
    ONLY: MODE_ONLY,
    SKIP: MODE_SKIP
  };
  const HOOKS = {
    BEFORE_ALL,
    BEFORE,
    AFTER_ALL,
    AFTER
  };
  const RUN_BENCHMARK = 'run_benchmark';

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  const makeDescribe = (name, parent, mode) => ({
    type: "group",
    mode: parent && !mode ? parent.mode : mode,
    children: [],
    hooks: [],
    startedAt: 0,
    aggregate: 0,
    name,
    parent
  });
  const makeBenchmark = (name, parent, mode) => ({
    type: "benchmark",
    mode: parent && !mode ? parent.mode : mode,
    hooks: [],
    name,
    parent,
    startedAt: 0,
    aggregate: 0
  });
  const makeBenchmarkRun = (fn, parent) => ({
    type: "run",
    fn,
    name: RUN_BENCHMARK,
    parent,
    startedAt: 0,
    metrics: {},
    hooks: [],
    aggregate: 0
  });

  const handler = (event, state) => {
    switch (event.nodeType) {
      case 'start_describe_definition':
        {
          const {
            nodeName,
            mode
          } = event;
          const currentDescribeBlock = state.currentDescribeBlock;
          const describeBlock = makeDescribe(nodeName, currentDescribeBlock, mode);
          currentDescribeBlock.children.push(describeBlock);
          state.currentDescribeBlock = describeBlock;
          break;
        }

      case 'start_benchmark_definition':
        {
          const {
            nodeName,
            mode
          } = event;
          const currentDescribeBlock = state.currentDescribeBlock;
          const benchmarkBlock = makeBenchmark(nodeName, currentDescribeBlock, mode);
          currentDescribeBlock.children.push(benchmarkBlock);
          state.currentDescribeBlock = benchmarkBlock;
          break;
        }

      case 'finish_describe_definition':
      case 'finish_benchmark_definition':
        {
          const currentDescribeBlock = state.currentDescribeBlock;

          if (!currentDescribeBlock) {
            throw new Error(`"currentDescribeBlock" has to be there since we're finishing its definition.`);
          }

          if (currentDescribeBlock.type === "benchmark" && !currentDescribeBlock.run) {
            throw new Error(`Benchmark "${currentDescribeBlock.name}" must have a 'run()' function or contain benchmarks inside.`);
          }

          if (currentDescribeBlock.parent) {
            state.currentDescribeBlock = currentDescribeBlock.parent;
          }

          break;
        }

      case 'add_hook':
        {
          const {
            currentDescribeBlock
          } = state;
          const {
            fn,
            hookType: type
          } = event;

          if (fn && type) {
            currentDescribeBlock.hooks.push({
              fn,
              type
            });
          }

          break;
        }

      case 'run_benchmark':
        {
          const currentDescribeBlock = state.currentDescribeBlock;
          const {
            fn
          } = event;

          if (fn) {
            const benchmark = makeBenchmarkRun(fn, currentDescribeBlock);
            currentDescribeBlock.run = benchmark;
          }

          break;
        }
    }
  };

  var primitivesHandler = registerComponent(handler, {
    tmpl: _tmpl
  });

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  var DEFAULT_STATE = registerComponent(Object.freeze({
    benchmarkName: "",
    useMacroTaskAfterBenchmark: true,
    maxDuration: 1000 * 20,
    minSampleCount: 30,
    iterations: 0,
    results: [],
    executedTime: 0,
    executedIterations: 0
  }), {
    tmpl: _tmpl
  });

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  function cloneState(obj) {
    const stateClone = Object.assign({}, obj);

    if (stateClone.children) {
      stateClone.children = stateClone.children.map(obj => cloneState(obj));
    }

    if (stateClone.run) {
      stateClone.run = Object.assign({}, stateClone.run);
    }

    return stateClone;
  }

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  const eventHandlers = [primitivesHandler];
  const ROOT_DESCRIBE_BLOCK_NAME = typeof BEST_CONFIG !== 'undefined' ? BEST_CONFIG.benchmarkName : 'ROOT_DESCRIBE_BLOCK';
  const ROOT_DESCRIBE_BLOCK = makeDescribe(ROOT_DESCRIBE_BLOCK_NAME);
  const STATE = Object.assign({}, DEFAULT_STATE, {
    currentDescribeBlock: ROOT_DESCRIBE_BLOCK,
    rootDescribeBlock: ROOT_DESCRIBE_BLOCK
  });
  const getBenckmarkState = () => cloneState(STATE);
  const getBenchmarkRootNode = () => getBenckmarkState().rootDescribeBlock;
  const initializeBenchmarkConfig = newOpts => {
    if (newOpts.iterations !== undefined) {
      if (newOpts.iterateOnClient === undefined) {
        newOpts.iterateOnClient = true;
      }

      newOpts.minSampleCount = newOpts.iterations;
      newOpts.maxDuration = 1;
    }

    return Object.assign(STATE, newOpts);
  }; // PROTECTED: Should only be used by the primitives

  function dispatch(event) {
    try {
      for (const handler of eventHandlers) {
        handler(event, STATE);
      }
    } catch (err) {
      STATE.benchmarkDefinitionError = err;
    }
  }

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */

  /*
   * This code is a slight modification of VueJS next-tick
   * https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js
   *
   */
  function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
  }

  const callbacks = [];
  let pending = false;

  function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;

    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  function handleError(e, ctx, type) {
    console.error(e, ctx, type);
  }

  let microTimerFunc;
  let macroTimerFunc;
  let useMacroTask = false; // Determine (macro) Task defer implementation.
  // Technically setImmediate should be the ideal choice, but it's only available
  // in IE. The only polyfill that consistently queues the callback after all DOM
  // events triggered in the same loop is by using MessageChannel.

  /* istanbul ignore if */

  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = () => {
      setImmediate(flushCallbacks);
    };
  } else if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) || // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]')) {
    const channel = new MessageChannel();
    const port = channel.port2;
    channel.port1.onmessage = flushCallbacks;

    macroTimerFunc = () => {
      port.postMessage(1);
    };
  } else {
    /* istanbul ignore next */
    macroTimerFunc = () => {
      setTimeout(flushCallbacks, 0);
    };
  } // Determine MicroTask defer implementation.

  /* istanbul ignore next, $flow-disable-line */


  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();

    microTimerFunc = () => {
      p.then(flushCallbacks);
    };
  } else {
    // fallback to macro
    microTimerFunc = macroTimerFunc;
  }
  /*
   * Wrap a function so that if any code inside triggers state change,
   * the changes are queued using a Task instead of a MicroTask.
   */


  function withMacroTask(fn) {
    return fn._withTask || (fn._withTask = function () {
      useMacroTask = true;
      const res = fn.apply(null, arguments);
      useMacroTask = false;
      return res;
    });
  }
  function nextTick(cb, ctx) {
    let _resolve;

    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });

    if (!pending) {
      pending = true;

      if (useMacroTask) {
        macroTimerFunc();
      } else {
        microTimerFunc();
      }
    }

    return cb ? null : new Promise(resolve => {
      _resolve = resolve;
    });
  }
  const time = window.performance.now.bind(window.performance);
  const formatTime = t => Math.round(t * 1000) / 1000;
  const raf = window && window.requestAnimationFrame ? window.requestAnimationFrame : nextTick;

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  var BenchmarkMeasureType;

  (function (BenchmarkMeasureType) {
    BenchmarkMeasureType["Execute"] = "BEST/execute";
    BenchmarkMeasureType["Before"] = "BEST/before";
    BenchmarkMeasureType["After"] = "BEST/after";
  })(BenchmarkMeasureType || (BenchmarkMeasureType = {}));

  const _initHandlers = () => Object.values(HOOKS).reduce((o, k) => {
    o[k] = [];
    return o;
  }, {});

  const _initHooks = hooks => hooks.reduce((m, {
    type,
    fn
  }) => {
    m[type].push(fn);
    return m;
  }, _initHandlers());

  const _forceGC = () => window.gc && window.gc();

  function startMeasure(markName, type) {
    performance.mark(`${type}/${markName}`);
  }

  function endMeasure(markName, type) {
    const eventName = `${type}/${markName}`;
    performance.measure(eventName, eventName);
    performance.clearMarks(eventName);
    performance.clearMeasures(eventName);
  }

  const executeBenchmark = async (benchmarkNode, markName, {
    useMacroTaskAfterBenchmark
  }) => {
    // Force garbage collection before executing an iteration (--js-flags=--expose-gc)
    _forceGC();

    return new Promise((resolve, reject) => {
      raf(async () => {
        benchmarkNode.startedAt = formatTime(time());
        startMeasure(markName, BenchmarkMeasureType.Execute);

        try {
          await benchmarkNode.fn();
          benchmarkNode.metrics.script = formatTime(time() - benchmarkNode.startedAt);

          if (useMacroTaskAfterBenchmark) {
            withMacroTask(async () => {
              await nextTick();
              benchmarkNode.aggregate = formatTime(time() - benchmarkNode.startedAt);
              endMeasure(markName, BenchmarkMeasureType.Execute);
              resolve();
            })();
          } else {
            benchmarkNode.aggregate = formatTime(time() - benchmarkNode.startedAt);
            endMeasure(markName, BenchmarkMeasureType.Execute);
            resolve();
          }
        } catch (e) {
          benchmarkNode.aggregate = -1;
          endMeasure(markName, BenchmarkMeasureType.Execute);
          reject();
        }
      });
    });
  };

  const runBenchmarkIteration = async (node, opts) => {
    const {
      hooks,
      children,
      run
    } = node;

    const hookHandlers = _initHooks(hooks); // -- Before All ----


    for (const hook of hookHandlers[HOOKS.BEFORE_ALL]) {
      await hook();
    } // -- For each children ----


    if (children) {
      for (const child of children) {
        // -- Traverse Child ----
        node.startedAt = formatTime(time());
        await runBenchmarkIteration(child, opts);
        node.aggregate = formatTime(time() - node.startedAt);
      }
    }

    if (run) {
      // -- Before ----
      const markName = run.parent.name;

      for (const hook of hookHandlers[HOOKS.BEFORE]) {
        await hook();
      }


      node.startedAt = formatTime(time());
      await executeBenchmark(run, markName, opts);
      node.aggregate = formatTime(time() - node.startedAt); // -- After ----

      for (const hook of hookHandlers[HOOKS.AFTER]) {
        await hook();
      }
    } // -- After All ----


    for (const hook of hookHandlers[HOOKS.AFTER_ALL]) {
      await hook();
    }

    return node;
  };

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  function normalizeResults(benchmarkState) {
    const {
      benchmarkName,
      executedIterations,
      executedTime: aggregate,
      results
    } = benchmarkState;
    return {
      benchmarkName,
      executedIterations,
      aggregate,
      results
    };
  }

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */
  function validateState(benchmarkState) {
    const {
      rootDescribeBlock,
      currentDescribeBlock,
      benchmarkDefinitionError
    } = benchmarkState;

    if (benchmarkDefinitionError) {
      return; // Nothing to do; there is already an error
    }

    if (rootDescribeBlock !== currentDescribeBlock) {
      benchmarkState.benchmarkDefinitionError = new Error('Benchmark parsing error');
    }

    if (rootDescribeBlock.children.length === 0) {
      benchmarkState.benchmarkDefinitionError = new Error('No benchmarks to run');
    }
  }

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */

  function collectNodeResults(node) {
    const {
      name,
      aggregate,
      startedAt,
      run,
      children
    } = node;
    const type = node.type;
    const resultNode = {
      type,
      name,
      aggregate,
      startedAt
    };

    if (run) {
      resultNode.aggregate = run.aggregate;
      resultNode.metrics = run.metrics;
    } else if (children) {
      resultNode.nodes = children.map(c => collectNodeResults(c));
    }

    return resultNode;
  }

  async function runIterations(config) {
    if (config.executedTime < config.maxDuration || config.executedIterations < config.minSampleCount) {
      const {
        useMacroTaskAfterBenchmark
      } = config;
      const benchmark = await runBenchmarkIteration(getBenchmarkRootNode(), {
        useMacroTaskAfterBenchmark
      });
      const results = collectNodeResults(benchmark);
      config.results.push(results);
      config.executedTime += benchmark.aggregate;
      config.executedIterations += 1;

      if (!config.iterateOnClient) {
        return config;
      }

      return runIterations(config);
    }

    return config;
  }

  async function runBenchmark(benchmarkState) {
    validateState(benchmarkState);

    if (benchmarkState.benchmarkDefinitionError) {
      throw benchmarkState.benchmarkDefinitionError;
    }

    benchmarkState.results = [];
    await runIterations(benchmarkState);
    return normalizeResults(benchmarkState);
  }

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */

  const _dispatchBenchmark = (nodeName, blockFn, mode) => {
    dispatch({
      nodeName,
      mode,
      nodeType: 'start_benchmark_definition'
    });
    blockFn();
    dispatch({
      nodeName,
      nodeType: 'finish_benchmark_definition'
    });
  };

  const benchmark = (benchmarkName, fn) => _dispatchBenchmark(benchmarkName, fn);

  benchmark.only = (benchmarkName, fn) => _dispatchBenchmark(benchmarkName, fn, MODES.ONLY);

  benchmark.skip = (benchmarkName, fn) => _dispatchBenchmark(benchmarkName, fn, MODES.SKIP);

  const _addHook = (fn, hookType) => dispatch({
    nodeName: 'hook',
    fn,
    hookType,
    nodeType: 'add_hook'
  });

  const before = fn => _addHook(fn, HOOKS.BEFORE);

  const after = fn => _addHook(fn, HOOKS.AFTER);

  const run = fn => dispatch({
    nodeName: 'run',
    fn,
    nodeType: RUN_BENCHMARK
  });

  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
  */

  const setupBenchmark = config => initializeBenchmarkConfig(config);

  const runBenchmark$1 = async config => {
    if (config) {
      setupBenchmark(config);
    }

    const benchmarkState = getBenckmarkState();
    const benchmarkResults = await runBenchmark(benchmarkState);
    return benchmarkResults;
  }; // Expose BEST API


  const BEST = {
    setupBenchmark,
    runBenchmark: runBenchmark$1
  };
  window.BEST = BEST;
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  }; // Auto-load

  window.addEventListener('load', async () => {
    const config = setupBenchmark(window.BEST_CONFIG);

    if (config.autoStart) {
      window.BEST_RESULTS = await runBenchmark$1();
    }
  });

  function tmpl($api, $cmp, $slotset, $ctx) {
    const {
      d: api_dynamic,
      h: api_element,
      b: api_bind,
      t: api_text,
      k: api_key,
      i: api_iterator
    } = $api;
    const {
      _m0,
      _m1
    } = $ctx;
    return [api_element("table", {
      key: 7
    }, [api_element("tbody", {
      key: 6
    }, api_iterator($cmp.rows, function (row) {
      return api_element("tr", {
        className: row.className,
        key: api_key(5, row.id)
      }, [api_element("td", {
        key: 0
      }, [api_dynamic(row.id)]), api_element("td", {
        key: 2
      }, [api_element("a", {
        key: 1,
        on: {
          "click": _m0 || ($ctx._m0 = api_bind($cmp.handleSelect))
        }
      }, [api_dynamic(row.label)])]), api_element("td", {
        key: 4
      }, [api_element("a", {
        key: 3,
        on: {
          "click": _m1 || ($ctx._m1 = api_bind($cmp.handleRemove))
        }
      }, [api_text("Remove")])])]);
    }))])];
  }

  var _tmpl$1 = registerTemplate(tmpl);
  tmpl.stylesheets = [];
  tmpl.stylesheetTokens = {
    hostAttribute: "benchmark-table_table-host",
    shadowAttribute: "benchmark-table_table"
  };

  class Table extends BaseLightningElement {
    constructor(...args) {
      super(...args);
      this.rows = [];
    }

    handleSelect() {}

    handleRemove() {}

  }

  registerDecorators(Table, {
    publicProps: {
      rows: {
        config: 0
      }
    }
  });

  var Table$1 = registerComponent(Table, {
    tmpl: _tmpl$1
  });

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
  const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
  const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

  function _random(max) {
    return Math.round(Math.random() * 1000) % max;
  }

  class Store {
    constructor() {
      this.data = [];
      this.selected = undefined;
      this.id = 1;
    }

    buildData(count = 1000) {
      var data = [];

      for (var i = 0; i < count; i++) data.push({
        id: this.id++,
        label: adjectives[_random(adjectives.length)] + ' ' + colours[_random(colours.length)] + ' ' + nouns[_random(nouns.length)]
      });

      return data;
    }

    updateData() {
      // Just assigning setting each tenth this.data doesn't cause a redraw, the following does:
      var newData = [];

      for (let i = 0; i < this.data.length; i++) {
        if (i % 10 === 0) {
          newData[i] = Object.assign({}, this.data[i], {
            label: this.data[i].label + ' !!!'
          });
        } else {
          newData[i] = this.data[i];
        }
      }

      this.data = newData;
    }

    delete(id) {
      const idx = this.data.findIndex(d => d.id == id);
      this.data.splice(idx, 1);
    }

    run() {
      this.data = this.buildData();
      this.selected = undefined;
    }

    add() {
      this.data = this.data.concat(this.buildData(1000));
    }

    update() {
      this.updateData();
    }

    select(id) {
      this.selected = id;
    }

    runLots() {
      this.data = this.buildData(10000);
      this.selected = undefined;
    }

    clear() {
      this.data = [];
      this.selected = undefined;
    }

    swapRows() {
      if (this.data.length > 10) {
        const d4 = this.data[4];
        const d9 = this.data[9];
        var newData = this.data.map(function (data, i) {
          if (i === 4) {
            return d9;
          } else if (i === 9) {
            return d4;
          }

          return data;
        });
        this.data = newData;
      }
    }

  }

  var Store$1 = registerComponent(Store, {
    tmpl: _tmpl
  });

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  /** Wait for the next frame */

  function nextFrame(cb) {
    setTimeout(cb, 0);
  }
  const insertTableComponent = function (el, container = document.body) {
    return new Promise(resolve => {
      container.appendChild(el);
      nextFrame(() => {
        resolve(el);
      });
    });
  };
  const destroyTableComponent = function (el) {
    return el && el.parentElement.removeChild(el);
  };

  benchmark(`benchmark-table/append/1k`, () => {
    let tableElement;
    let store;
    before(async () => {
      tableElement = createElement('benchmark-table', {
        is: Table$1
      });
      await insertTableComponent(tableElement);
      store = new Store$1();
      store.run(); // eslint-disable-next-line require-atomic-updates

      tableElement.rows = store.data;
    });
    run(() => {
      store.add();
      tableElement.rows = store.data;
    });
    after(() => {
      destroyTableComponent(tableElement);
    });
  });

}());
