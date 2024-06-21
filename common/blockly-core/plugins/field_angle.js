/*! For license information please see index.js.LICENSE.txt */
!function(t,i){if("object"==typeof exports&&"object"==typeof module)module.exports=i(require("blockly/core"));else if("function"==typeof define&&define.amd)define(["blockly/core"],i);else{var e="object"==typeof exports?i(require("blockly/core")):i(t.Blockly);for(var s in e)("object"==typeof exports?exports:t)[s]=e[s]}}(this,(t=>(()=>{"use strict";var i={370:i=>{i.exports=t}},e={};function s(t){var o=e[t];if(void 0!==o)return o.exports;var n=e[t]={exports:{}};return i[t](n,n.exports,s),n.exports}s.d=(t,i)=>{for(var e in i)s.o(i,e)&&!s.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:i[e]})},s.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var o={};s.r(o),s.d(o,{FieldAngle:()=>r,Mode:()=>n,registerFieldAngle:()=>a});var n,l=s(370);class r extends l.FieldNumber{constructor(t,i,e){super(l.Field.SKIP_SETUP),this.clockwise=!1,this.offset=0,this.displayMin=0,this.displayMax=360,this.minorTick=15,this.majorTick=45,this.symbol="°",this.boundEvents=[],this.line=null,this.gauge=null,this.symbolElement=null,t!==l.Field.SKIP_SETUP&&(e?(this.configure_(e),void 0!==e.min&&null!==e.min||this.setMin(r.DEFAULT_MIN),void 0!==e.max&&null!==e.max||this.setMax(r.DEFAULT_MAX),void 0!==e.precision&&null!==e.precision||this.setPrecision(r.DEFAULT_PRECISION)):(this.setMin(r.DEFAULT_MIN),this.setMax(r.DEFAULT_MAX),this.setPrecision(r.DEFAULT_PRECISION)),this.setValue(t),i&&this.setValidator(i))}configure_(t){switch(super.configure_(t),t.mode){case n.COMPASS:this.clockwise=!0,this.offset=90;break;case n.PROTRACTOR:this.clockwise=!1,this.offset=0}if(void 0!==t.clockwise&&(this.clockwise=t.clockwise),void 0!==t.offset&&(this.offset=t.offset),void 0!==t.displayMin&&(this.displayMin=t.displayMin),void 0!==t.displayMax&&(this.displayMax=t.displayMax),void 0!==t.minorTick&&(this.minorTick=t.minorTick),void 0!==t.majorTick&&(this.majorTick=t.majorTick),void 0!==t.symbol&&(this.symbol=t.symbol),this.displayMin>=this.displayMax)throw Error("Display min must be larger than display max");if(this.minorTick<0||this.majorTick<0)throw Error("Ticks cannot be negative")}initView(){super.initView(),this.symbol&&(this.symbolElement=l.utils.dom.createSvgElement(l.utils.Svg.TSPAN,{}),this.symbolElement.appendChild(document.createTextNode(this.symbol)),this.getTextElement().appendChild(this.symbolElement))}render_(){super.render_(),this.updateGraph()}showEditor_(t){const i=l.utils.userAgent.MOBILE||l.utils.userAgent.ANDROID||l.utils.userAgent.IPAD;super.showEditor_(t,i);const e=this.dropdownCreate();l.DropDownDiv.getContentDiv().appendChild(e);const s=this.getSourceBlock();s instanceof l.BlockSvg&&l.DropDownDiv.setColour(s.style.colourPrimary,s.style.colourTertiary),l.DropDownDiv.showPositionedByField(this,this.dropdownDispose.bind(this)),this.updateGraph()}dropdownCreate(){const t=l.utils.dom.createSvgElement(l.utils.Svg.SVG,{xmlns:l.utils.dom.SVG_NS,"xmlns:html":l.utils.dom.HTML_NS,"xmlns:xlink":l.utils.dom.XLINK_NS,version:"1.1",height:2*r.HALF+"px",width:2*r.HALF+"px"});t.style.touchAction="none";const i=l.utils.dom.createSvgElement(l.utils.Svg.CIRCLE,{cx:r.HALF,cy:r.HALF,r:r.RADIUS,class:"blocklyAngleCircle"},t);this.gauge=l.utils.dom.createSvgElement(l.utils.Svg.PATH,{class:"blocklyAngleGauge"},t),this.line=l.utils.dom.createSvgElement(l.utils.Svg.LINE,{x1:r.HALF,y1:r.HALF,class:"blocklyAngleLine"},t);const e=l.utils.math.toDegrees(this.fieldAngleToRadians(this.min_)),s=l.utils.math.toDegrees(this.fieldAngleToRadians(this.max_)),o=(i,o)=>{let n=Math.ceil(e/i)*i,a=Math.floor(s/i)*i;this.clockwise?n<a&&(n+=360):n>a&&(a+=360),a===n&&(a+=360),n>a&&([n,a]=[a,n]);for(let e=n;e<=a;e+=i)l.utils.dom.createSvgElement(l.utils.Svg.LINE,{x1:r.HALF+r.RADIUS,y1:r.HALF,x2:r.HALF+r.RADIUS-o,y2:r.HALF,class:"blocklyAngleMarks",transform:"rotate("+-e+","+r.HALF+","+r.HALF+")"},t)},n=this.displayMax-this.displayMin,a=360/n*this.minorTick;a&&o(a,5);const h=360/n*this.majorTick;return h&&o(h,10),this.boundEvents.push(l.browserEvents.conditionalBind(t,"click",this,this.hide)),this.boundEvents.push(l.browserEvents.conditionalBind(i,"pointerdown",this,this.onMouseMove_,!0)),this.boundEvents.push(l.browserEvents.conditionalBind(i,"pointermove",this,this.onMouseMove_,!0)),t}dropdownDispose(){for(const t of this.boundEvents)l.browserEvents.unbind(t);this.boundEvents.length=0,this.gauge=null,this.line=null}hide(){l.DropDownDiv.hideIfOwner(this),l.WidgetDiv.hide()}onMouseMove_(t){var i,e;const s=null===(e=null===(i=this.gauge)||void 0===i?void 0:i.ownerSVGElement)||void 0===e?void 0:e.getBoundingClientRect();if(!s)return;const o=t.clientX-s.left-r.HALF,n=t.clientY-s.top-r.HALF;let l=Math.atan2(-n,o);isNaN(l)||(l=this.radiansToFieldAngle(l),this.displayMouseOrKeyboardValue(l))}radiansToFieldAngle(t){return t/=2*Math.PI,t-=this.offset/360,this.clockwise&&(t*=-1),(t%=1)<0&&(t+=1),(t*=this.displayMax-this.displayMin)+this.displayMin}fieldAngleToRadians(t){return t-=this.displayMin,t/=this.displayMax-this.displayMin,this.clockwise&&(t*=-1),t+=this.offset/360,(t%=1)>.5&&(t-=1),t<-.5&&(t+=1),t*(2*Math.PI)}displayMouseOrKeyboardValue(t){const i=this.doClassValidation_(t);if(null!==i&&i!==this.value_){const t=this.value_;this.setEditorValue_(i,!1),this.sourceBlock_&&l.Events.isEnabled()&&this.value_!==t&&l.Events.fire(new(l.Events.get(l.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE))(this.sourceBlock_,this.name||null,t,this.value_))}}updateGraph(){if(!this.gauge||!this.line)return;let t=Number(this.getText());if(isNaN(t))return;t=this.fieldAngleToRadians(t);let i=`M ${r.HALF},${r.HALF}`,e=r.HALF,s=r.HALF;if(!isNaN(t)){const o=l.utils.math.toRadians(this.offset),n=Math.cos(o)*r.RADIUS,a=Math.sin(o)*-r.RADIUS;e+=Math.cos(t)*r.RADIUS,s-=Math.sin(t)*r.RADIUS;const h=Number(this.clockwise);let d=Math.abs(Math.floor((t-o)/Math.PI)%2);h&&(d=1-d),i+=` l ${n},${a} A ${r.RADIUS},${r.RADIUS} 0 ${d} ${h} ${e},${s} z`}this.gauge.setAttribute("d",i),this.line.setAttribute("x2",`${e}`),this.line.setAttribute("y2",`${s}`)}onHtmlInputKeyDown_(t){super.onHtmlInputKeyDown_(t);const i=this.getSourceBlock();if(!i)throw new Error("The field has not yet been attached to its input. Call appendField to attach it.");let e=0;switch(t.key){case"ArrowLeft":e=i.RTL?1:-1;break;case"ArrowRight":e=i.RTL?-1:1;break;case"ArrowDown":e=-1;break;case"ArrowUp":e=1}if(e){const i=this.getValue();this.displayMouseOrKeyboardValue(i+e*this.precision_),t.preventDefault(),t.stopPropagation()}}doClassValidation_(t){if(null===t)return null;let i=Number(t);if(isNaN(i)||!isFinite(i))return null;i=this.wrapValue(i),this.precision_&&(i=Math.round(i/this.precision_)*this.precision_),i=Number(i.toFixed(10));const e=this.displayMax-this.displayMin,s=this.max_-this.min_;if(i<this.min_){const t=this.min_-i;i=t<e-t-s?this.min_:this.max_}if(i>this.max_){const t=i-this.max_;i=e-t-s<t?this.min_:this.max_}return i}wrapValue(t){const i=this.displayMax-this.displayMin;for(t%=i;t<this.displayMin;)t+=i;for(;t>=this.displayMax;)t-=i;return t}static fromJson(t){return new this(t.value,void 0,t)}}function a(){l.fieldRegistry.register("field_angle",r),Object.defineProperty(l,"FieldAngle",{value:r,writable:!0,enumerable:!0,configurable:!0})}return r.HALF=50,r.RADIUS=r.HALF-1,r.DEFAULT_PRECISION=15,r.DEFAULT_MIN=0,r.DEFAULT_MAX=360,a(),r.prototype.DEFAULT_VALUE=0,l.Css.register("\n.blocklyAngleCircle {\n  stroke: #444;\n  stroke-width: 1;\n  fill: #ddd;\n  fill-opacity: 0.8;\n}\n\n.blocklyAngleMarks {\n  stroke: #444;\n  stroke-width: 1;\n}\n\n.blocklyAngleGauge {\n  fill: #f88;\n  fill-opacity: 0.8;\n  pointer-events: none;\n}\n\n.blocklyAngleLine {\n  stroke: #f00;\n  stroke-width: 2;\n  stroke-linecap: round;\n  pointer-events: none;\n}\n"),function(t){t.COMPASS="compass",t.PROTRACTOR="protractor"}(n||(n={})),o})()));