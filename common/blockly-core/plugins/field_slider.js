/*! For license information please see index.js.LICENSE.txt */
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("blockly/core"));else if("function"==typeof define&&define.amd)define(["blockly/core"],t);else{var r="object"==typeof exports?t(require("blockly/core")):t(e.Blockly);for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(this,(e=>(()=>{"use strict";var t={573:t=>{t.exports=e}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var i=r[e]={exports:{}};return t[e](i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};return(()=>{n.r(o);var e=n(573),t=n.n(e);function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(){return d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,r){var n=a(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(arguments.length<3?e:r):o.value}},d.apply(this,arguments)}function a(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=f(e)););return e}function s(e,t){return s=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},s(e,t)}function c(e,t){if(t&&("object"===r(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function f(e){return f=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},f(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&s(e,t)}(h,e);var r,n,o,a,p,b=(a=h,p=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=f(a);if(p){var r=f(this).constructor;e=Reflect.construct(t,arguments,r)}else e=t.apply(this,arguments);return c(this,e)});function h(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0,u=arguments.length>5&&void 0!==arguments[5]?arguments[5]:void 0;return l(this,h),(e=b.call(this,t,r,n,o,i,u)).boundEvents_=[],e.sliderInput_=null,e}return r=h,n=[{key:"showEditor_",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,r=t().utils.userAgent.MOBILE||t().utils.userAgent.ANDROID||t().utils.userAgent.IPAD;d(f(h.prototype),"showEditor_",this).call(this,e,r);var n=this.dropdownCreate_();t().DropDownDiv.getContentDiv().appendChild(n),t().DropDownDiv.setColour(this.sourceBlock_.style.colourPrimary,this.sourceBlock_.style.colourTertiary),t().DropDownDiv.showPositionedByField(this,this.dropdownDispose_.bind(this))}},{key:"render_",value:function(){d(f(h.prototype),"render_",this).call(this),this.updateSlider_()}},{key:"dropdownCreate_",value:function(){var e=document.createElement("div");e.className="fieldSliderContainer";var r=document.createElement("input");return r.setAttribute("type","range"),r.setAttribute("min",this.min_),r.setAttribute("max",this.max_),r.setAttribute("step",this.precision_),r.setAttribute("value",this.getValue()),r.className="fieldSlider",e.appendChild(r),this.sliderInput_=r,this.boundEvents_.push(t().browserEvents.conditionalBind(r,"input",this,this.onSliderChange_)),e}},{key:"dropdownDispose_",value:function(){var e,r=function(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return i(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?i(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var l,u=!0,d=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return u=e.done,e},e:function(e){d=!0,l=e},f:function(){try{u||null==r.return||r.return()}finally{if(d)throw l}}}}(this.boundEvents_);try{for(r.s();!(e=r.n()).done;){var n=e.value;t().unbindEvent_(n)}}catch(e){r.e(e)}finally{r.f()}this.sliderInput_=null}},{key:"onSliderChange_",value:function(){this.setEditorValue_(this.sliderInput_.value)}},{key:"updateSlider_",value:function(){this.sliderInput_&&this.sliderInput_.setAttribute("value",this.getValue())}}],o=[{key:"fromJson",value:function(e){return new h(e.value,void 0,void 0,void 0,void 0,e)}}],n&&u(r.prototype,n),o&&u(r,o),Object.defineProperty(r,"prototype",{writable:!1}),h}(t().FieldNumber);Object.defineProperty(t(),"FieldSlider",{value:p,writable:!0,enumerable:!0,configurable:!0}),t().fieldRegistry.register("field_slider",t().FieldSlider),t().Css.register([".fieldSliderContainer {\n      align-items: center;\n      display: flex;\n      height: 32px;\n      justify-content: center;\n      width: 150px;\n    }\n    .fieldSlider {\n      -webkit-appearance: none;\n      background: transparent; /* override white in chrome */\n      margin: 4px;\n      padding: 0;\n      width: 100%;\n    }\n    .fieldSlider:focus {\n      outline: none;\n    }\n    /* Webkit */\n    .fieldSlider::-webkit-slider-runnable-track {\n      background: #ddd;\n      border-radius: 5px;\n      height: 10px;\n    }\n    .fieldSlider::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      background: #fff;\n      border-radius: 50%;\n      box-shadow: 0 0 0 4px rgba(255,255,255,.15);\n      cursor: pointer;\n      height: 24px;\n      margin-top: -7px;\n      width: 24px;\n    }\n    /* Firefox */\n    .fieldSlider::-moz-range-track {\n      background: #ddd;\n      border-radius: 5px;\n      height: 10px;\n    }\n    .fieldSlider::-moz-range-thumb {\n      background: #fff;\n      border: none;\n      border-radius: 50%;\n      box-shadow: 0 0 0 4px rgba(255,255,255,.15);\n      cursor: pointer;\n      height: 24px;\n      width: 24px;\n    }\n    .fieldSlider::-moz-focus-outer {\n      /* override the focus border style */\n      border: 0;\n    }\n    /* IE */\n    .fieldSlider::-ms-track {\n      /* IE wont let the thumb overflow the track, so fake it */\n      background: transparent;\n      border-color: transparent;\n      border-width: 15px 0;\n      /* remove default tick marks */\n      color: transparent;\n      height: 10px;\n      width: 100%;\n      margin: -4px 0;\n    }\n    .fieldSlider::-ms-fill-lower  {\n      background: #ddd;\n      border-radius: 5px;\n    }\n    .fieldSlider::-ms-fill-upper  {\n      background: #ddd;\n      border-radius: 5px;\n    }\n    .fieldSlider::-ms-thumb {\n      background: #fff;\n      border: none;\n      border-radius: 50%;\n      box-shadow: 0 0 0 4px rgba(255,255,255,.15);\n      cursor: pointer;\n      height: 24px;\n      width: 24px;\n    }"])})(),o})()));