var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@maxhub/max-bot-api/dist/core/helpers/attachments.js
var require_attachments = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/helpers/attachments.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShareAttachment = exports.LocationAttachment = exports.StickerAttachment = exports.FileAttachment = exports.AudioAttachment = exports.ImageAttachment = exports.VideoAttachment = exports.MediaAttachment = void 0;
    var Attachment = class {
      toJson() {
        throw new Error("Attachment not implemented.");
      }
    };
    var MediaAttachment = class extends Attachment {
      constructor({ token }) {
        super();
        this.token = token;
      }
      get payload() {
        return { token: this.token };
      }
    };
    exports.MediaAttachment = MediaAttachment;
    var VideoAttachment = class extends MediaAttachment {
      constructor() {
        super(...arguments);
        this.type = "video";
      }
      toJson() {
        return {
          type: this.type,
          payload: this.payload
        };
      }
    };
    exports.VideoAttachment = VideoAttachment;
    var ImageAttachment = class extends MediaAttachment {
      constructor(options) {
        super({ token: "token" in options ? options.token : void 0 });
        if ("photos" in options) {
          this.photos = options.photos;
        }
        if ("url" in options) {
          this.url = options.url;
        }
      }
      get payload() {
        if (this.token) {
          return { token: this.token };
        }
        if (this.url) {
          return { url: this.url };
        }
        return { photos: this.photos };
      }
      toJson() {
        return {
          type: "image",
          payload: this.payload
        };
      }
    };
    exports.ImageAttachment = ImageAttachment;
    var AudioAttachment = class extends MediaAttachment {
      toJson() {
        return {
          type: "audio",
          payload: this.payload
        };
      }
    };
    exports.AudioAttachment = AudioAttachment;
    var FileAttachment = class extends MediaAttachment {
      toJson() {
        return {
          type: "file",
          payload: this.payload
        };
      }
    };
    exports.FileAttachment = FileAttachment;
    var StickerAttachment = class extends Attachment {
      constructor({ code }) {
        super();
        this.code = code;
      }
      get payload() {
        return { code: this.code };
      }
      toJson() {
        return {
          type: "sticker",
          payload: this.payload
        };
      }
    };
    exports.StickerAttachment = StickerAttachment;
    var LocationAttachment = class extends Attachment {
      constructor({ lon, lat }) {
        super();
        this.longitude = lon;
        this.latitude = lat;
      }
      toJson() {
        return {
          type: "location",
          latitude: this.latitude,
          longitude: this.longitude
        };
      }
    };
    exports.LocationAttachment = LocationAttachment;
    var ShareAttachment = class extends Attachment {
      constructor({ url, token } = {}) {
        super();
        this.url = url;
        this.token = token;
      }
      get payload() {
        return {
          url: this.url,
          token: this.token
        };
      }
      toJson() {
        return {
          type: "share",
          payload: this.payload
        };
      }
    };
    exports.ShareAttachment = ShareAttachment;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/attachment.js
var require_attachment = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/attachment.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/attachment-request.js
var require_attachment_request = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/attachment-request.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/bot.js
var require_bot = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/bot.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/chat.js
var require_chat = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/chat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/common.js
var require_common = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/common.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/keyboard.js
var require_keyboard = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/keyboard.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/markup.js
var require_markup = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/markup.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/message.js
var require_message = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/message.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/subcription.js
var require_subcription = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/subcription.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/uploads.js
var require_uploads = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/uploads.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/user.js
var require_user = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/user.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/types/index.js
var require_types = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/types/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_attachment(), exports);
    __exportStar(require_attachment_request(), exports);
    __exportStar(require_bot(), exports);
    __exportStar(require_chat(), exports);
    __exportStar(require_common(), exports);
    __exportStar(require_keyboard(), exports);
    __exportStar(require_markup(), exports);
    __exportStar(require_message(), exports);
    __exportStar(require_subcription(), exports);
    __exportStar(require_uploads(), exports);
    __exportStar(require_user(), exports);
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/bots/types.js
var require_types2 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/bots/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/messages/types.js
var require_types3 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/messages/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/subscriptions/types.js
var require_types4 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/subscriptions/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/types.js
var require_types5 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/types.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_types2(), exports);
    __exportStar(require_types3(), exports);
    __exportStar(require_types4(), exports);
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common2 = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common2()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module) {
    var tty = __require("tty");
    var util = __require("util");
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = __require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = require_common2()(exports);
    var { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/client.js
var require_client = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/client.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createClient = void 0;
    var debug_1 = __importDefault(require_src());
    var debug = (0, debug_1.default)("one-me:client");
    var defaultOptions = {
      baseUrl: "https://platform-api.max.ru"
    };
    var createClient = (token, options = {}) => {
      const { baseUrl } = { ...defaultOptions, ...options };
      const call = async ({ method, options: callOptions }) => {
        const httpMethod = callOptions.method || "GET";
        debug(`Call method ${httpMethod} /${method}`, JSON.stringify(callOptions, null, 2));
        if (!token) {
          return {
            status: 401,
            data: {
              code: "verify.token",
              message: "Empty access_token"
            }
          };
        }
        const url = new URL(buildUrl(method, callOptions.path), baseUrl);
        Object.keys(callOptions.query ?? {}).forEach((param) => {
          const value = callOptions.query?.[param];
          if (!value)
            return;
          url.searchParams.set(param, value.toString());
        });
        const init = { ...getResponseInit(callOptions?.body), method: httpMethod };
        init.headers = { ...init.headers, Authorization: token };
        const res = await fetch(url.href, init);
        if (res.status === 401) {
          return {
            status: 401,
            data: {
              code: "verify.token",
              message: "Invalid access_token"
            }
          };
        }
        return {
          status: res.status,
          data: await res.json()
        };
      };
      return { call };
    };
    exports.createClient = createClient;
    var getResponseInit = (body) => {
      if (!body)
        return {};
      return {
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json"
        }
      };
    };
    var buildUrl = (baseUrl, path2) => {
      let url = baseUrl;
      if (path2) {
        Object.keys(path2)?.forEach((key) => {
          const regexp = new RegExp(`{${key}}`, "g");
          const value = path2[key].toString();
          url = url.replace(regexp, value);
        });
      }
      return url;
    };
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/error.js
var require_error = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaxError = void 0;
    var MaxError = class extends Error {
      constructor(status, response) {
        super(`${status}: ${response.message}`);
        this.status = status;
        this.response = response;
      }
      get code() {
        return this.response.code;
      }
      get description() {
        return this.response.message;
      }
    };
    exports.MaxError = MaxError;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/base-api.js
var require_base_api = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/base-api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseApi = void 0;
    var error_1 = require_error();
    var BaseApi = class {
      constructor(client) {
        this.callApi = async (method, options) => {
          const result = await this.call({
            method,
            options
          });
          if (result.status !== 200) {
            throw new error_1.MaxError(result.status, result.data);
          }
          return result.data;
        };
        this._get = async (method, options) => {
          return this.callApi(method, { ...options, method: "GET" });
        };
        this._post = async (method, options) => {
          return this.callApi(method, { ...options, method: "POST" });
        };
        this._patch = async (method, options) => {
          return this.callApi(method, { ...options, method: "PATCH" });
        };
        this._put = async (method, options) => {
          return this.callApi(method, { ...options, method: "PUT" });
        };
        this._delete = async (method, options) => {
          return this.callApi(method, { ...options, method: "DELETE" });
        };
        this.call = client.call;
      }
    };
    exports.BaseApi = BaseApi;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/bots/api.js
var require_api = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/bots/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BotsApi = void 0;
    var base_api_1 = require_base_api();
    var BotsApi = class extends base_api_1.BaseApi {
      constructor() {
        super(...arguments);
        this.getMyInfo = async () => {
          return this._get("me", {});
        };
        this.editMyInfo = async ({ ...body }) => {
          return this._patch("me", { body });
        };
      }
    };
    exports.BotsApi = BotsApi;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/messages/api.js
var require_api2 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/messages/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessagesApi = void 0;
    var promises_1 = __require("node:timers/promises");
    var error_1 = require_error();
    var base_api_1 = require_base_api();
    var MessagesApi = class extends base_api_1.BaseApi {
      constructor() {
        super(...arguments);
        this.get = async ({ ...query }) => {
          return this._get("messages", {
            query
          });
        };
        this.getById = async ({ message_id }) => {
          return this._get("messages/{message_id}", {
            path: { message_id }
          });
        };
        this.send = async ({ chat_id, user_id, disable_link_preview, ...body }) => {
          try {
            return await this._post("messages", {
              body,
              query: { chat_id, user_id, disable_link_preview }
            });
          } catch (err) {
            if (err instanceof error_1.MaxError) {
              if (err.code === "attachment.not.ready") {
                console.log("Attachment not ready");
                await (0, promises_1.setTimeout)(1e3);
                return this.send({
                  chat_id,
                  user_id,
                  disable_link_preview,
                  ...body
                });
              }
            }
            throw err;
          }
        };
        this.edit = async ({ message_id, ...body }) => {
          return this._put("messages", {
            query: { message_id },
            body
          });
        };
        this.delete = async ({ ...query }) => {
          return this._delete("messages", {
            query
          });
        };
        this.answerOnCallback = async ({ callback_id, ...body }) => {
          return this._post("answers", {
            query: { callback_id },
            body
          });
        };
      }
    };
    exports.MessagesApi = MessagesApi;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/subscriptions/api.js
var require_api3 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/subscriptions/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubscriptionsApi = void 0;
    var base_api_1 = require_base_api();
    var SubscriptionsApi = class extends base_api_1.BaseApi {
      constructor() {
        super(...arguments);
        this.getUpdates = async ({ ...query }) => {
          return this._get("updates", { query });
        };
      }
    };
    exports.SubscriptionsApi = SubscriptionsApi;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/uploads/api.js
var require_api4 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/uploads/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UploadsApi = void 0;
    var base_api_1 = require_base_api();
    var UploadsApi = class extends base_api_1.BaseApi {
      constructor() {
        super(...arguments);
        this.getUploadUrl = async ({ ...query }) => {
          return this._post("uploads", { query });
        };
      }
    };
    exports.UploadsApi = UploadsApi;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/uploads/types.js
var require_types6 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/uploads/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/chats/api.js
var require_api5 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/chats/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChatsApi = void 0;
    var base_api_1 = require_base_api();
    var ChatsApi = class extends base_api_1.BaseApi {
      async getAll({ ...query }) {
        return this._get("chats", {
          query
        });
      }
      async getById({ chat_id }) {
        return this._get("chats/{chat_id}", {
          path: { chat_id }
        });
      }
      async getByLink({ chat_link }) {
        return this._get("chats/{chat_link}", {
          path: { chat_link }
        });
      }
      async edit({ chat_id, ...body }) {
        return this._patch("chats/{chat_id}", {
          path: { chat_id },
          body
        });
      }
      async getChatMembership({ chat_id }) {
        return this._get("chats/{chat_id}/members/me", {
          path: { chat_id }
        });
      }
      async getChatAdmins({ chat_id }) {
        return this._get("chats/{chat_id}/members/admins", {
          path: { chat_id }
        });
      }
      async addChatMembers({ chat_id, ...body }) {
        return this._post("chats/{chat_id}/members", {
          path: { chat_id },
          body
        });
      }
      async getChatMembers({ chat_id, ...query }) {
        return this._get("chats/{chat_id}/members", {
          path: { chat_id },
          query
        });
      }
      async removeChatMember({ chat_id, ...body }) {
        return this._delete("chats/{chat_id}/members", {
          path: { chat_id },
          body
        });
      }
      async getPinnedMessage({ chat_id }) {
        return this._get("chats/{chat_id}/pin", {
          path: { chat_id }
        });
      }
      async pinMessage({ chat_id, ...body }) {
        return this._put("chats/{chat_id}/pin", {
          path: { chat_id },
          body
        });
      }
      async unpinMessage({ chat_id }) {
        return this._delete("chats/{chat_id}/pin", {
          path: { chat_id }
        });
      }
      async sendAction({ chat_id, ...body }) {
        return this._post("chats/{chat_id}/actions", {
          path: { chat_id },
          body
        });
      }
      async leaveChat({ chat_id }) {
        return this._delete("chats/{chat_id}/members/me", {
          path: { chat_id }
        });
      }
    };
    exports.ChatsApi = ChatsApi;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/chats/types.js
var require_types7 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/chats/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/index.js
var require_modules = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/modules/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChatsApi = exports.UploadsApi = exports.SubscriptionsApi = exports.MessagesApi = exports.BotsApi = exports.BaseApi = void 0;
    var base_api_1 = require_base_api();
    Object.defineProperty(exports, "BaseApi", { enumerable: true, get: function() {
      return base_api_1.BaseApi;
    } });
    var api_1 = require_api();
    Object.defineProperty(exports, "BotsApi", { enumerable: true, get: function() {
      return api_1.BotsApi;
    } });
    __exportStar(require_types2(), exports);
    var api_2 = require_api2();
    Object.defineProperty(exports, "MessagesApi", { enumerable: true, get: function() {
      return api_2.MessagesApi;
    } });
    __exportStar(require_types3(), exports);
    var api_3 = require_api3();
    Object.defineProperty(exports, "SubscriptionsApi", { enumerable: true, get: function() {
      return api_3.SubscriptionsApi;
    } });
    __exportStar(require_types4(), exports);
    var api_4 = require_api4();
    Object.defineProperty(exports, "UploadsApi", { enumerable: true, get: function() {
      return api_4.UploadsApi;
    } });
    __exportStar(require_types6(), exports);
    var api_5 = require_api5();
    Object.defineProperty(exports, "ChatsApi", { enumerable: true, get: function() {
      return api_5.ChatsApi;
    } });
    __exportStar(require_types7(), exports);
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/raw-api.js
var require_raw_api = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/raw-api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RawApi = void 0;
    var modules_1 = require_modules();
    var RawApi = class extends modules_1.BaseApi {
      constructor(client) {
        super(client);
        this.client = client;
        this.get = this._get;
        this.post = this._post;
        this.patch = this._patch;
      }
      get chats() {
        return this._chats ?? (this._chats = new modules_1.ChatsApi(this.client));
      }
      get bots() {
        return this._bots ?? (this._bots = new modules_1.BotsApi(this.client));
      }
      get messages() {
        return this._messages ?? (this._messages = new modules_1.MessagesApi(this.client));
      }
      get subscriptions() {
        return this._subscriptions ?? (this._subscriptions = new modules_1.SubscriptionsApi(this.client));
      }
      get uploads() {
        return this._uploads ?? (this._uploads = new modules_1.UploadsApi(this.client));
      }
    };
    exports.RawApi = RawApi;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/api/index.js
var require_api6 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/api/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RawApi = exports.MaxError = exports.createClient = void 0;
    __exportStar(require_types(), exports);
    __exportStar(require_types5(), exports);
    var client_1 = require_client();
    Object.defineProperty(exports, "createClient", { enumerable: true, get: function() {
      return client_1.createClient;
    } });
    var error_1 = require_error();
    Object.defineProperty(exports, "MaxError", { enumerable: true, get: function() {
      return error_1.MaxError;
    } });
    var raw_api_1 = require_raw_api();
    Object.defineProperty(exports, "RawApi", { enumerable: true, get: function() {
      return raw_api_1.RawApi;
    } });
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/helpers/upload.js
var require_upload = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/helpers/upload.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Upload = void 0;
    var fs2 = __importStar(__require("fs"));
    var node_crypto_1 = __require("node:crypto");
    var node_path_1 = __importDefault(__require("node:path"));
    var api_1 = require_api6();
    var DEFAULT_UPLOAD_TIMEOUT = 2e4;
    async function uploadRangeChunk({ uploadUrl, chunk, startByte, endByte, fileSize, fileName }, { signal } = {}) {
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: chunk,
        headers: {
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Range": `bytes ${startByte}-${endByte}/${fileSize}`,
          "Content-Type": "application/x-binary; charset=x-user-defined",
          "X-File-Name": fileName,
          "X-Uploading-Mode": "parallel",
          Connection: "keep-alive"
        },
        signal
      });
      if (uploadRes.status >= 400) {
        const error = await uploadRes.json();
        throw new api_1.MaxError(uploadRes.status, error);
      }
      return uploadRes.text();
    }
    async function uploadRange({ uploadUrl, file }, options) {
      const size = file.contentLength;
      let startByte = 0;
      let endByte = 0;
      for await (const chunk of file.stream) {
        endByte = startByte + chunk.length - 1;
        await uploadRangeChunk({
          uploadUrl,
          startByte,
          endByte,
          chunk,
          fileName: file.fileName,
          fileSize: size
        }, options);
        startByte = endByte + 1;
      }
    }
    async function uploadMultipart({ uploadUrl, file }, { signal } = {}) {
      const body = new FormData();
      body.append("data", {
        [Symbol.toStringTag]: "File",
        name: file.fileName,
        stream: () => file.stream,
        size: file.contentLength
      });
      const result = await fetch(uploadUrl, {
        method: "POST",
        body,
        signal
      });
      const response = await result.json();
      return response;
    }
    var Upload = class {
      constructor(api) {
        this.api = api;
        this.getStreamFromSource = async (source) => {
          if (typeof source === "string") {
            const stat2 = await fs2.promises.stat(source);
            const fileName2 = node_path_1.default.basename(source);
            if (!stat2.isFile()) {
              throw new Error(`Failed to upload ${fileName2}. Not a file`);
            }
            const stream = fs2.createReadStream(source);
            return {
              stream,
              fileName: fileName2,
              contentLength: stat2.size
            };
          }
          if (source instanceof Buffer) {
            return {
              buffer: source,
              fileName: (0, node_crypto_1.randomUUID)()
            };
          }
          const stat = await fs2.promises.stat(source.path);
          let fileName;
          if (typeof source.path === "string") {
            fileName = node_path_1.default.basename(source.path);
          } else {
            fileName = (0, node_crypto_1.randomUUID)();
          }
          return {
            stream: source,
            contentLength: stat.size,
            fileName
          };
        };
        this.upload = async (type, file, options) => {
          const res = await this.api.raw.uploads.getUploadUrl({ type });
          const { url: uploadUrl, token } = res;
          const uploadController = new AbortController();
          const uploadInterval = setTimeout(() => {
            uploadController.abort();
          }, options?.timeout || DEFAULT_UPLOAD_TIMEOUT);
          try {
            if ("stream" in file) {
              return await this.uploadFromStream({
                file,
                uploadUrl,
                abortController: uploadController,
                token
              });
            }
            return await this.uploadFromBuffer({
              file,
              uploadUrl,
              abortController: uploadController,
              token
            });
          } finally {
            clearTimeout(uploadInterval);
          }
        };
        this.uploadFromStream = async ({ file, uploadUrl, token, abortController }) => {
          if (token) {
            await uploadRange({ file, uploadUrl }, abortController);
            return {
              token,
              file,
              uploadUrl,
              abortController
            };
          }
          return uploadMultipart({ file, uploadUrl }, abortController);
        };
        this.uploadFromBuffer = async ({ file, uploadUrl, abortController }) => {
          const formData = new FormData();
          formData.append("data", new Blob([file.buffer]), file.fileName);
          const res = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
            signal: abortController?.signal
          });
          return await res.json();
        };
        this.image = async ({ timeout, ...source }) => {
          if ("url" in source) {
            return { url: source.url };
          }
          const fileBlob = await this.getStreamFromSource(source.source);
          return this.upload("image", fileBlob, { timeout });
        };
        this.video = async ({ source, ...options }) => {
          const fileBlob = await this.getStreamFromSource(source);
          return this.upload("video", fileBlob, options);
        };
        this.file = async ({ source, ...options }) => {
          const fileBlob = await this.getStreamFromSource(source);
          return this.upload("file", fileBlob, options);
        };
        this.audio = async ({ source, ...options }) => {
          const fileBlob = await this.getStreamFromSource(source);
          return this.upload("audio", fileBlob, options);
        };
      }
    };
    exports.Upload = Upload;
  }
});

// node_modules/@maxhub/max-bot-api/dist/api.js
var require_api7 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Api = void 0;
    var attachments_1 = require_attachments();
    var upload_1 = require_upload();
    var api_1 = require_api6();
    var Api = class {
      constructor(client) {
        this.getMyInfo = async () => {
          return this.raw.bots.getMyInfo();
        };
        this.editMyInfo = async (extra) => {
          return this.raw.bots.editMyInfo(extra);
        };
        this.setMyCommands = async (commands) => {
          return this.editMyInfo({ commands });
        };
        this.deleteMyCommands = async () => {
          return this.editMyInfo({ commands: [] });
        };
        this.getAllChats = async (extra = {}) => {
          return this.raw.chats.getAll(extra);
        };
        this.getChat = async (id) => {
          return this.raw.chats.getById({ chat_id: id });
        };
        this.getChatByLink = async (link) => {
          return this.raw.chats.getByLink({ chat_link: link });
        };
        this.editChatInfo = async (chatId, extra) => {
          return this.raw.chats.edit({ chat_id: chatId, ...extra });
        };
        this.sendMessageToChat = async (chatId, text, extra) => {
          const { message } = await this.raw.messages.send({
            chat_id: chatId,
            text,
            ...extra
          });
          return message;
        };
        this.sendMessageToUser = async (userId, text, extra) => {
          const { message } = await this.raw.messages.send({
            user_id: userId,
            text,
            ...extra
          });
          return message;
        };
        this.getMessages = async (chatId, { message_ids, ...extra } = {}) => {
          return this.raw.messages.get({
            chat_id: chatId,
            message_ids: message_ids?.join(","),
            ...extra
          });
        };
        this.getMessage = async (id) => {
          return this.raw.messages.getById({ message_id: id });
        };
        this.editMessage = async (messageId, extra) => {
          return this.raw.messages.edit({
            message_id: messageId,
            ...extra
          });
        };
        this.deleteMessage = async (messageId, extra) => {
          return this.raw.messages.delete({ message_id: messageId, ...extra });
        };
        this.answerOnCallback = async (callbackId, extra) => {
          return this.raw.messages.answerOnCallback({ callback_id: callbackId, ...extra });
        };
        this.getChatMembership = (chatId) => {
          return this.raw.chats.getChatMembership({ chat_id: chatId });
        };
        this.getChatAdmins = (chatId) => {
          return this.raw.chats.getChatAdmins({ chat_id: chatId });
        };
        this.addChatMembers = (chatId, userIds) => {
          return this.raw.chats.addChatMembers({
            chat_id: chatId,
            user_ids: userIds
          });
        };
        this.getChatMembers = (chatId, { user_ids, ...extra } = {}) => {
          return this.raw.chats.getChatMembers({
            chat_id: chatId,
            user_ids: user_ids?.join(","),
            ...extra
          });
        };
        this.removeChatMember = (chatId, userId) => {
          return this.raw.chats.removeChatMember({
            chat_id: chatId,
            user_id: userId
          });
        };
        this.getUpdates = async (types = [], extra = {}) => {
          return this.raw.subscriptions.getUpdates({
            types: Array.isArray(types) ? types.join(",") : types,
            ...extra
          });
        };
        this.getPinnedMessage = async (chatId) => {
          return this.raw.chats.getPinnedMessage({ chat_id: chatId });
        };
        this.pinMessage = async (chatId, messageId, extra) => {
          return this.raw.chats.pinMessage({
            chat_id: chatId,
            message_id: messageId,
            ...extra
          });
        };
        this.unpinMessage = async (chatId) => {
          return this.raw.chats.unpinMessage({ chat_id: chatId });
        };
        this.sendAction = async (chatId, action) => {
          return this.raw.chats.sendAction({
            chat_id: chatId,
            action
          });
        };
        this.leaveChat = async (chatId) => {
          return this.raw.chats.leaveChat({ chat_id: chatId });
        };
        this.uploadImage = async (options) => {
          const data = await this.upload.image(options);
          return new attachments_1.ImageAttachment(data);
        };
        this.uploadVideo = async (options) => {
          const data = await this.upload.video(options);
          return new attachments_1.VideoAttachment({ token: data.token });
        };
        this.uploadAudio = async (options) => {
          const data = await this.upload.audio(options);
          return new attachments_1.AudioAttachment({ token: data.token });
        };
        this.uploadFile = async (options) => {
          const data = await this.upload.file(options);
          return new attachments_1.FileAttachment({ token: data.token });
        };
        this.raw = new api_1.RawApi(client);
        this.upload = new upload_1.Upload(this);
      }
    };
    exports.Api = Api;
  }
});

// node_modules/@maxhub/max-bot-api/dist/filters.js
var require_filters = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/filters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createdMessageBodyHas = void 0;
    var createdMessageBodyHas = (...keys) => {
      return (update) => {
        if (update.update_type !== "message_created")
          return false;
        for (const key of keys) {
          if (!(key in update.message.body))
            return false;
          if (update.message.body[key] === void 0)
            return false;
        }
        return true;
      };
    };
    exports.createdMessageBodyHas = createdMessageBodyHas;
  }
});

// node_modules/@maxhub/max-bot-api/dist/composer.js
var require_composer = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/composer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Composer = void 0;
    var filters_1 = require_filters();
    var Composer = class _Composer {
      constructor(...middlewares) {
        this.handler = _Composer.compose(middlewares);
      }
      middleware() {
        return this.handler;
      }
      use(...middlewares) {
        this.handler = _Composer.compose([this.handler, ...middlewares]);
        return this;
      }
      on(filters, ...middlewares) {
        return this.use(this.filter(filters, ...middlewares));
      }
      command(command, ...middlewares) {
        const normalizedTriggers = normalizeTriggers(command);
        const filter = (0, filters_1.createdMessageBodyHas)("text");
        const handler = _Composer.compose(middlewares);
        return this.use(this.filter(filter, (ctx, next) => {
          const text = extractTextFromMessage(ctx.message, ctx.myId);
          const cmd = text.slice(1);
          for (const trigger of normalizedTriggers) {
            const match = trigger(cmd);
            if (match) {
              ctx.match = match;
              return handler(ctx, next);
            }
          }
          return next();
        }));
      }
      hears(triggers, ...middlewares) {
        const normalizedTriggers = normalizeTriggers(triggers);
        const filter = (0, filters_1.createdMessageBodyHas)("text");
        const handler = _Composer.compose(middlewares);
        return this.use(this.filter(filter, (ctx, next) => {
          const text = extractTextFromMessage(ctx.message, ctx.myId);
          for (const trigger of normalizedTriggers) {
            const match = trigger(text);
            if (match) {
              ctx.match = match;
              return handler(ctx, next);
            }
          }
          return next();
        }));
      }
      action(triggers, ...middlewares) {
        const normalizedTriggers = normalizeTriggers(triggers);
        const handler = _Composer.compose(middlewares);
        return this.use(this.filter("message_callback", (ctx, next) => {
          const { payload } = ctx.update.callback;
          if (!payload)
            return next();
          for (const trigger of normalizedTriggers) {
            const match = trigger(payload);
            if (match) {
              ctx.match = match;
              return handler(ctx, next);
            }
          }
          return next();
        }));
      }
      filter(filters, ...middlewares) {
        const handler = _Composer.compose(middlewares);
        return (ctx, next) => {
          return ctx.has(filters) ? handler(ctx, next) : next();
        };
      }
      static flatten(mw) {
        return typeof mw === "function" ? mw : (ctx, next) => mw.middleware()(ctx, next);
      }
      static concat(first, andThen) {
        return async (ctx, next) => {
          let nextCalled = false;
          await first(ctx, async () => {
            if (nextCalled) {
              throw new Error("`next` already called before!");
            }
            nextCalled = true;
            await andThen(ctx, next);
          });
        };
      }
      static pass(_ctx, next) {
        return next();
      }
      static compose(middlewares) {
        if (!Array.isArray(middlewares)) {
          throw new Error("Middlewares must be an array");
        }
        if (middlewares.length === 0) {
          return _Composer.pass;
        }
        return middlewares.map(_Composer.flatten).reduce(_Composer.concat);
      }
    };
    exports.Composer = Composer;
    var normalizeTriggers = (triggers) => {
      return (Array.isArray(triggers) ? triggers : [triggers]).map((trigger) => {
        if (trigger instanceof RegExp) {
          return (value = "") => {
            trigger.lastIndex = 0;
            return trigger.exec(value.trim());
          };
        }
        const regex = new RegExp(`^${trigger}$`);
        return (value) => regex.exec(value.trim());
      });
    };
    var extractTextFromMessage = (message, myId) => {
      const { text } = message.body;
      const mention = message.body.markup?.find((m) => {
        return m.type === "user_mention";
      });
      if (mention && mention.from === 0 && mention.user_id === myId) {
        return text?.slice(mention.length).trim();
      }
      return text;
    };
  }
});

// node_modules/foldline/foldline.js
var require_foldline = __commonJS({
  "node_modules/foldline/foldline.js"(exports, module) {
    var CRLF = "\r\n";
    var SP = " ";
    var MAX_LINE_LENGTH = 998;
    var DEFAULT_LINE_LENGTH = 78;
    var MIN_LINE_LENGTH = 2;
    function foldLine(input, maxLength, hardWrap) {
      if (maxLength != null && maxLength < MIN_LINE_LENGTH) {
        throw new Error("Maximum length must not be less than " + MIN_LINE_LENGTH);
      }
      if (maxLength != null && maxLength > MAX_LINE_LENGTH) {
        throw new Error("Maximum length must not exceed " + MAX_LINE_LENGTH);
      }
      maxLength = maxLength || DEFAULT_LINE_LENGTH;
      input = input.replace(/[\r\n]+/g, "");
      if (input.length <= maxLength) {
        return input;
      }
      var output = "";
      var index = 0;
      var nextIndex = 0;
      var length = input.length;
      var line = 0;
      var trim = 0;
      while (index < length) {
        if (!hardWrap && ~(nextIndex = input.lastIndexOf(SP, index + maxLength))) {
          if (nextIndex > index) {
            output += input.slice(index, nextIndex) + CRLF + SP;
            index = nextIndex;
          } else {
            output += input.slice(index, index + maxLength - trim) + CRLF + SP;
            index = index + maxLength - trim;
            hardWrap = true;
          }
        } else {
          output += input.slice(index, index + maxLength - trim) + CRLF + SP;
          index = index + maxLength - trim;
        }
        if (length - index < maxLength) {
          output += input.slice(index);
          break;
        }
        if (line === 0) {
          trim = 1;
        }
        line++;
      }
      return output;
    }
    foldLine.unfold = function unfold(input) {
      return input.replace(/\r\n\s/gm, "");
    };
    module.exports = foldLine;
  }
});

// node_modules/camelcase/index.js
var require_camelcase = __commonJS({
  "node_modules/camelcase/index.js"(exports, module) {
    "use strict";
    var preserveCamelCase = (string) => {
      let isLastCharLower = false;
      let isLastCharUpper = false;
      let isLastLastCharUpper = false;
      for (let i = 0; i < string.length; i++) {
        const character = string[i];
        if (isLastCharLower && /[a-zA-Z]/.test(character) && character.toUpperCase() === character) {
          string = string.slice(0, i) + "-" + string.slice(i);
          isLastCharLower = false;
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = true;
          i++;
        } else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character) {
          string = string.slice(0, i - 1) + "-" + string.slice(i - 1);
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = false;
          isLastCharLower = true;
        } else {
          isLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;
        }
      }
      return string;
    };
    var camelCase = (input, options) => {
      if (!(typeof input === "string" || Array.isArray(input))) {
        throw new TypeError("Expected the input to be `string | string[]`");
      }
      options = Object.assign({
        pascalCase: false
      }, options);
      const postProcess = (x) => options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;
      if (Array.isArray(input)) {
        input = input.map((x) => x.trim()).filter((x) => x.length).join("-");
      } else {
        input = input.trim();
      }
      if (input.length === 0) {
        return "";
      }
      if (input.length === 1) {
        return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
      }
      const hasUpperCase = input !== input.toLowerCase();
      if (hasUpperCase) {
        input = preserveCamelCase(input);
      }
      input = input.replace(/^[_.\- ]+/, "").toLowerCase().replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase()).replace(/\d+(\w|$)/g, (m) => m.toUpperCase());
      return postProcess(input);
    };
    module.exports = camelCase;
    module.exports.default = camelCase;
  }
});

// node_modules/vcf/lib/property.js
var require_property = __commonJS({
  "node_modules/vcf/lib/property.js"(exports, module) {
    function Property(field, value, params) {
      if (!(this instanceof Property))
        return new Property(value);
      if (params != null)
        Object.assign(this, params);
      this._field = field;
      this._data = value;
      Object.defineProperty(this, "_field", { enumerable: false });
      Object.defineProperty(this, "_data", { enumerable: false });
    }
    Property.fromJSON = function(data) {
      var field = data[0];
      var params = data[1];
      if (!/text/i.test(data[2]))
        params.value = data[2];
      var value = Array.isArray(data[3]) ? data[3].join(";") : data[3];
      return new Property(field, value, params);
    };
    function capitalDashCase(value) {
      return value.replace(/([A-Z])/g, "-$1").toUpperCase();
    }
    Property.prototype = {
      constructor: Property,
      /**
       * Check whether the property is of a given type
       * @param  {String}  type
       * @return {Boolean}
       */
      is: function(type) {
        type = (type + "").toLowerCase();
        return Array.isArray(this.type) ? this.type.indexOf(type) >= 0 : this.type === type;
      },
      /**
       * Check whether the property is empty
       * @return {Boolean}
       */
      isEmpty: function() {
        return this._data == null && Object.keys(this).length === 0;
      },
      /**
       * Clone the property
       * @return {Property}
       */
      clone: function() {
        return new Property(this._field, this._data, this);
      },
      /**
       * Format the property as vcf with given version
       * @param  {String} version
       * @return {String}
       */
      toString: function(version) {
        var propName = (this.group ? this.group + "." : "") + capitalDashCase(this._field);
        var keys = Object.keys(this);
        var params = [];
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === "group") continue;
          switch (propName) {
            case "TEL":
            case "ADR":
            case "EMAIL":
              if (version === "2.1") {
                if (Array.isArray(this[keys[i]]))
                  params.push(this[keys[i]].join(";"));
                else
                  params.push(this[keys[i]]);
              } else
                params.push(capitalDashCase(keys[i]) + "=" + this[keys[i]]);
              break;
            default:
              params.push(capitalDashCase(keys[i]) + "=" + this[keys[i]]);
          }
        }
        if (version === "2.1" || version === "3.0")
          return propName + (params.length ? ";" + params.join(";").toUpperCase() : params.toString().toUpperCase()) + ":" + (Array.isArray(this._data) ? this._data.join(";") : this._data);
        else
          return propName + (params.length ? ";" + params.join(";") : params) + ":" + (Array.isArray(this._data) ? this._data.join(";") : this._data);
      },
      /**
       * Get the property's value
       * @return {String}
       */
      valueOf: function() {
        return this._data;
      },
      /**
       * Format the property as jCard data
       * @return {Array}
       */
      toJSON: function() {
        var params = Object.assign({}, this);
        if (params.value === "text") {
          params.value = void 0;
          delete params.value;
        }
        var data = [this._field, params, this.value || "text"];
        switch (this._field) {
          default:
            data.push(this._data);
            break;
          case "adr":
          case "n":
            data.push(this._data.split(";"));
        }
        return data;
      }
    };
    module.exports = Property;
  }
});

// node_modules/vcf/lib/parse-lines.js
var require_parse_lines = __commonJS({
  "node_modules/vcf/lib/parse-lines.js"(exports, module) {
    var camelCase = require_camelcase();
    var Property = require_property();
    function set(object, key, value) {
      if (Array.isArray(object[key])) {
        object[key].push(value);
      } else if (object[key] != null) {
        object[key] = [object[key], value];
      } else {
        object[key] = value;
      }
    }
    function createParams(params, param) {
      var parts = param.split("=");
      var k = camelCase(parts[0]);
      var value = parts[1];
      if (value == null || value === "") {
        value = parts[0];
        k = "type";
      }
      if (k === "type") {
        if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf(",") !== -1)
          value = value.slice(1, -1);
        value.toLowerCase().split(",").forEach(function(value2) {
          set(params, k, value2);
        });
        return params;
      }
      set(params, k, value);
      return params;
    }
    function parseLines(lines) {
      var data = {};
      var line = null;
      var pattern = /^([^;:]+)((?:;(?:[^;:]+))*)(?:\:([\s\S]+))?$/i;
      var len = lines.length - 1;
      for (var i = 1; i < len; i++) {
        line = lines[i];
        var match = pattern.exec(line);
        if (!match) continue;
        var name = match[1].split(".");
        var property = name.pop();
        var group = name.pop();
        var value = match[3];
        var params = match[2] ? match[2].replace(/^;|;$/g, "").split(";") : [];
        var propParams = params.reduce(createParams, group ? { group } : {});
        var propName = camelCase(property);
        var propVal = new Property(propName, value, propParams);
        set(data, propName, propVal);
      }
      return data;
    }
    module.exports = parseLines;
  }
});

// node_modules/vcf/lib/vcard.js
var require_vcard = __commonJS({
  "node_modules/vcf/lib/vcard.js"(exports, module) {
    function vCard() {
      if (!(this instanceof vCard))
        return new vCard();
      this.version = vCard.versions[vCard.versions.length - 1];
      this.data = {};
    }
    vCard.mimeType = "text/vcard";
    vCard.extension = ".vcf";
    vCard.versions = ["2.1", "3.0", "4.0"];
    vCard.EOL = "\r\n";
    vCard.foldLine = require_foldline();
    vCard.normalize = function(input) {
      return (input + "").replace(/^[\s\r\n]+|[\s\r\n]+$/g, "").replace(/(\r\n)[\x09\x20]?(\r\n)|$/g, "$1").replace(/\r\n[\x20\x09]/g, "");
    };
    vCard.isSupported = function(version) {
      return /^\d\.\d$/.test(version) && vCard.versions.indexOf(version) !== -1;
    };
    vCard.parse = function(value) {
      var objects = (value + "").split(/(?=BEGIN\:VCARD)/gi);
      var cards = [];
      for (var i = 0; i < objects.length; i++) {
        cards.push(new vCard().parse(objects[i]));
      }
      return cards;
    };
    vCard.parseLines = require_parse_lines();
    vCard.fromJSON = function(jcard) {
      jcard = typeof jcard === "string" ? JSON.parse(jcard) : jcard;
      if (jcard == null || !Array.isArray(jcard))
        return new vCard();
      if (!/vcard/i.test(jcard[0]))
        throw new Error("Object not in jCard format");
      var card = new vCard();
      jcard[1].forEach(function(prop) {
        card.addProperty(vCard.Property.fromJSON(prop));
      });
      return card;
    };
    vCard.format = function(card, version) {
      version = version || card.version || vCard.versions[vCard.versions.length - 1];
      if (!vCard.isSupported(version))
        throw new Error('Unsupported vCard version "' + version + '"');
      var vcf = [];
      vcf.push("BEGIN:VCARD");
      vcf.push("VERSION:" + version);
      var props = Object.keys(card.data);
      var prop = "";
      for (var i = 0; i < props.length; i++) {
        if (props[i] === "version") continue;
        prop = card.data[props[i]];
        if (Array.isArray(prop)) {
          for (var k = 0; k < prop.length; k++) {
            if (prop[k].isEmpty()) continue;
            vcf.push(vCard.foldLine(prop[k].toString(version), 75));
          }
        } else if (!prop.isEmpty()) {
          vcf.push(vCard.foldLine(prop.toString(version), 75));
        }
      }
      vcf.push("END:VCARD");
      return vcf.join(vCard.EOL);
    };
    vCard.Property = require_property();
    vCard.prototype = {
      constructor: vCard,
      /**
       * Get a vCard property
       * @param  {String} key
       * @return {Object|Array}
       */
      get: function(key) {
        if (this.data[key] == null) {
          return this.data[key];
        }
        if (Array.isArray(this.data[key])) {
          return this.data[key].map(function(prop) {
            return prop.clone();
          });
        } else {
          return this.data[key].clone();
        }
      },
      /**
       * Set a vCard property
       * @param {String} key
       * @param {String} value
       * @param {Object} params
       */
      set: function(key, value, params) {
        return this.setProperty(new vCard.Property(key, value, params));
      },
      /**
       * Add a vCard property
       * @param {String} key
       * @param {String} value
       * @param {Object} params
       */
      add: function(key, value, params) {
        var prop = new vCard.Property(key, value, params);
        this.addProperty(prop);
        return this;
      },
      /**
       * Set a vCard property from an already
       * constructed vCard.Property
       * @param {vCard.Property} prop
       */
      setProperty: function(prop) {
        this.data[prop._field] = prop;
        return this;
      },
      /**
       * Add a vCard property from an already
       * constructed vCard.Property
       * @param {vCard.Property} prop
       */
      addProperty: function(prop) {
        var key = prop._field;
        if (Array.isArray(this.data[key])) {
          this.data[key].push(prop);
        } else if (this.data[key] != null) {
          this.data[key] = [this.data[key], prop];
        } else {
          this.data[key] = prop;
        }
        return this;
      },
      /**
       * Parse a vcf formatted vCard
       * @param  {String} value
       * @return {vCard}
       */
      parse: function(value) {
        var lines = vCard.normalize(value).split(/\r\n/g);
        var begin = lines[0];
        var version = lines[1];
        var end = lines[lines.length - 1];
        const regexp_version = /VERSION:\d\.\d/i;
        if (!/BEGIN:VCARD/i.test(begin))
          throw new SyntaxError('Invalid vCard: Expected "BEGIN:VCARD" but found "' + begin + '"');
        if (!/END:VCARD/i.test(end))
          throw new SyntaxError('Invalid vCard: Expected "END:VCARD" but found "' + end + '"');
        if (!regexp_version.test(version)) {
          if (!(version = lines.find((line) => regexp_version.test(line))))
            throw new SyntaxError('Invalid vCard: Expected "VERSION:\\d.\\d" but none found');
        }
        this.version = version.substring(8, 11);
        if (!vCard.isSupported(this.version))
          throw new Error('Unsupported version "' + this.version + '"');
        this.data = vCard.parseLines(lines);
        return this;
      },
      /**
       * Format the vCard as vcf with given version
       * @param  {String} version
       * @param  {String} charset
       * @return {String}
       */
      toString: function(version, charset) {
        version = version || this.version;
        return vCard.format(this, version);
      },
      /**
       * Format the card as jCard
       * @param {String} version='4.0'
       * @return {Array} jCard
       */
      toJCard: function(version) {
        version = version || "4.0";
        var keys = Object.keys(this.data);
        var data = [["version", {}, "text", version]];
        var prop = null;
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === "version") continue;
          prop = this.data[keys[i]];
          if (Array.isArray(prop)) {
            for (var k = 0; k < prop.length; k++) {
              data.push(prop[k].toJSON());
            }
          } else {
            data.push(prop.toJSON());
          }
        }
        return ["vcard", data];
      },
      /**
       * Format the card as jCard
       * @return {Array} jCard
       */
      toJSON: function() {
        return this.toJCard(this.version);
      }
    };
    module.exports = vCard;
  }
});

// node_modules/@maxhub/max-bot-api/dist/context.js
var require_context = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/context.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Context = void 0;
    var vcf_1 = __importDefault(require_vcard());
    var Context = class {
      constructor(update, api, botInfo) {
        this.update = update;
        this.api = api;
        this.botInfo = botInfo;
      }
      has(filters) {
        for (const filter of Array.isArray(filters) ? filters : [filters]) {
          if (typeof filter === "function" ? filter(this.update) : filter === this.update.update_type) {
            return true;
          }
        }
        return false;
      }
      assert(value, method) {
        if (value === void 0) {
          throw new TypeError(`Max: "${method}" isn't available for "${this.updateType}"`);
        }
      }
      get updateType() {
        return this.update.update_type;
      }
      get myId() {
        return this.botInfo?.user_id;
      }
      get startPayload() {
        return getStartPayload(this.update);
      }
      get chat() {
        return getChat(this.update);
      }
      get chatId() {
        return getChatId(this.update);
      }
      get message() {
        return getMessage(this.update);
      }
      get messageId() {
        return getMessageId(this.update);
      }
      get callback() {
        return getCallback(this.update);
      }
      get user() {
        return getUser(this.update);
      }
      get contactInfo() {
        return this._contactInfo ?? (this._contactInfo = getContactInfo(this.update));
      }
      get location() {
        return this._location ?? (this._location = getLocation(this.update));
      }
      get sticker() {
        return this._sticker ?? (this._sticker = getSticker(this.update));
      }
      async reply(text, extra) {
        this.assert(this.chatId, "reply");
        return this.api.sendMessageToChat(this.chatId, text, extra);
      }
      async getAllChats(extra) {
        return this.api.getAllChats(extra);
      }
      async getChat(chatId) {
        if (chatId !== void 0) {
          return this.api.getChat(chatId);
        }
        this.assert(this.chatId, "getChat");
        return this.api.getChat(this.chatId);
      }
      async getChatByLink(link) {
        return this.api.getChatByLink(link);
      }
      async editChatInfo(extra) {
        this.assert(this.chatId, "editChatInfo");
        return this.api.editChatInfo(this.chatId, extra);
      }
      async getMessage(id) {
        return this.api.getMessage(id);
      }
      async getMessages(extra) {
        this.assert(this.chatId, "getMessages");
        return this.api.getMessages(this.chatId, extra);
      }
      async getPinnedMessage() {
        this.assert(this.chatId, "getPinnedMessage");
        return this.api.getPinnedMessage(this.chatId);
      }
      async editMessage(extra) {
        this.assert(this.messageId, "editMessage");
        return this.api.editMessage(this.messageId, extra);
      }
      async deleteMessage(messageId) {
        if (messageId !== void 0) {
          return this.api.deleteMessage(messageId);
        }
        this.assert(this.messageId, "deleteMessage");
        return this.api.deleteMessage(this.messageId);
      }
      async answerOnCallback(extra) {
        this.assert(this.callback, "answerOnCallback");
        return this.api.answerOnCallback(this.callback.callback_id, extra);
      }
      async getChatMembership() {
        this.assert(this.chatId, "getChatMembership");
        return this.api.getChatMembership(this.chatId);
      }
      async getChatAdmins() {
        this.assert(this.chatId, "getChatAdmins");
        return this.api.getChatAdmins(this.chatId);
      }
      async addChatMembers(userIds) {
        this.assert(this.chatId, "addChatMembers");
        return this.api.addChatMembers(this.chatId, userIds);
      }
      async getChatMembers(extra) {
        this.assert(this.chatId, "getChatMembers");
        return this.api.getChatMembers(this.chatId, extra);
      }
      async removeChatMember(userId) {
        this.assert(this.chatId, "removeChatMember");
        return this.api.removeChatMember(this.chatId, userId);
      }
      async pinMessage(messageId, extra) {
        this.assert(this.chatId, "pinMessage");
        return this.api.pinMessage(this.chatId, messageId, extra);
      }
      async unpinMessage() {
        this.assert(this.chatId, "unpinMessage");
        return this.api.unpinMessage(this.chatId);
      }
      async sendAction(action) {
        this.assert(this.chatId, "sendAction");
        return this.api.sendAction(this.chatId, action);
      }
      async leaveChat() {
        this.assert(this.chatId, "leaveChat");
        return this.api.leaveChat(this.chatId);
      }
    };
    exports.Context = Context;
    var getChatId = (update) => {
      if ("chat_id" in update) {
        return update.chat_id;
      }
      if ("message" in update && update.message && "recipient" in update.message) {
        return update.message.recipient.chat_id;
      }
      if ("chat" in update) {
        return update.chat.chat_id;
      }
      return void 0;
    };
    var getChat = (update) => {
      if ("chat" in update) {
        return update.chat;
      }
      return void 0;
    };
    var getMessage = (update) => {
      if ("message" in update) {
        return update.message;
      }
      return void 0;
    };
    var getMessageId = (update) => {
      if ("message_id" in update) {
        return update.message_id;
      }
      if ("message" in update) {
        return update.message?.body.mid;
      }
      return void 0;
    };
    var getCallback = (update) => {
      if ("callback" in update) {
        return update.callback;
      }
      return void 0;
    };
    var getContactInfo = (update) => {
      const message = getMessage(update);
      if (!message)
        return void 0;
      const contact = message.body.attachments?.find((attachment) => {
        return attachment.type === "contact";
      });
      if (!contact?.payload.vcf_info)
        return void 0;
      const vcf = new vcf_1.default().parse(contact.payload.vcf_info);
      return {
        tel: vcf.get("tel").valueOf(),
        fullName: vcf.get("fn").valueOf()
      };
    };
    var getLocation = (update) => {
      const message = getMessage(update);
      if (!message)
        return void 0;
      const location = message.body.attachments?.find((attachment) => {
        return attachment.type === "location";
      });
      if (!location)
        return void 0;
      return {
        latitude: location.latitude,
        longitude: location.longitude
      };
    };
    var getSticker = (update) => {
      const message = getMessage(update);
      if (!message)
        return void 0;
      const sticker = message.body.attachments?.find((attachment) => {
        return attachment.type === "sticker";
      });
      if (!sticker)
        return void 0;
      return {
        width: sticker.width,
        height: sticker.height,
        url: sticker.payload.url,
        code: sticker.payload.code
      };
    };
    var getUser = (update) => {
      if ("user" in update) {
        return update.user;
      }
      if (update.update_type === "message_callback") {
        return update.callback.user;
      }
      if (update.update_type === "message_created") {
        return update.message.sender || void 0;
      }
      return void 0;
    };
    var getStartPayload = (update) => {
      if (update.update_type === "bot_started") {
        return update.payload;
      }
      return void 0;
    };
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/network/polling.js
var require_polling = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/network/polling.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Polling = void 0;
    var debug_1 = __importDefault(require_src());
    var api_1 = require_api6();
    var debug = (0, debug_1.default)("one-me:polling");
    var RETRY_INTERVAL = 5e3;
    var Polling = class {
      constructor(api, allowedUpdates = []) {
        this.api = api;
        this.allowedUpdates = allowedUpdates;
        this.abortController = new AbortController();
        this.loop = async (handleUpdate) => {
          debug("Starting long polling");
          while (!this.abortController.signal.aborted) {
            try {
              const { updates, marker } = await this.api.getUpdates(this.allowedUpdates, {
                marker: this.marker
              });
              this.marker = marker;
              await Promise.all(updates.map(handleUpdate));
            } catch (err) {
              if (err instanceof Error) {
                if (err.name === "AbortError")
                  return;
                if (err.name === "FetchError" || err instanceof api_1.MaxError && err.status === 429 || err instanceof api_1.MaxError && err.status >= 500) {
                  debug(`Failed to fetch updates, retrying after ${RETRY_INTERVAL}ms.`, err);
                  await new Promise((resolve) => {
                    setTimeout(resolve, RETRY_INTERVAL);
                  });
                  return;
                }
              }
              throw err;
            }
          }
          debug("Long polling is done");
        };
        this.stop = () => {
          debug("Stopping long polling");
          this.abortController.abort();
        };
      }
    };
    exports.Polling = Polling;
  }
});

// node_modules/@maxhub/max-bot-api/dist/bot.js
var require_bot2 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/bot.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bot = void 0;
    var debug_1 = __importDefault(require_src());
    var composer_1 = require_composer();
    var context_1 = require_context();
    var api_1 = require_api6();
    var polling_1 = require_polling();
    var api_2 = require_api7();
    var debug = (0, debug_1.default)("one-me:main");
    var defaultConfig = {
      contextType: context_1.Context
    };
    var Bot = class extends composer_1.Composer {
      constructor(token, config) {
        super();
        this.pollingIsStarted = false;
        this.handleError = (err, ctx) => {
          process.exitCode = 1;
          console.error("Unhandled error while processing", ctx.update);
          throw err;
        };
        this.start = async (options) => {
          if (this.pollingIsStarted) {
            debug("Long polling already running");
            return;
          }
          this.pollingIsStarted = true;
          this.botInfo ?? (this.botInfo = await this.api.getMyInfo());
          this.polling = new polling_1.Polling(this.api, options?.allowedUpdates);
          debug(`Starting @${this.botInfo.username}`);
          await this.polling.loop(this.handleUpdate);
        };
        this.stop = () => {
          if (!this.pollingIsStarted) {
            debug("Long polling is not running");
            return;
          }
          this.polling?.stop();
          this.pollingIsStarted = false;
        };
        this.handleUpdate = async (update) => {
          const updateId = `${update.update_type}:${update.timestamp}`;
          debug(`Processing update ${updateId}`);
          const UpdateContext = this.config.contextType;
          const ctx = new UpdateContext(update, this.api, this.botInfo);
          try {
            await this.middleware()(ctx, () => Promise.resolve(void 0));
          } catch (err) {
            await this.handleError(err, ctx);
          } finally {
            debug(`Finished processing update ${updateId}`);
          }
        };
        this.config = { ...defaultConfig, ...config };
        this.api = new api_2.Api((0, api_1.createClient)(token, this.config.clientOptions));
        debug("Created `Bot` instance");
      }
      catch(handler) {
        this.handleError = handler;
        return this;
      }
    };
    exports.Bot = Bot;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/helpers/buttons.js
var require_buttons = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/helpers/buttons.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.chat = exports.requestGeoLocation = exports.requestContact = exports.link = exports.callback = void 0;
    var callback = (text, payload, extra) => {
      return {
        type: "callback",
        text,
        payload,
        ...extra
      };
    };
    exports.callback = callback;
    var link = (text, url) => {
      return {
        type: "link",
        text,
        url
      };
    };
    exports.link = link;
    var requestContact = (text) => {
      return {
        type: "request_contact",
        text
      };
    };
    exports.requestContact = requestContact;
    var requestGeoLocation = (text, extra) => {
      return {
        type: "request_geo_location",
        text,
        ...extra
      };
    };
    exports.requestGeoLocation = requestGeoLocation;
    var chat = (text, chatTitle, extra) => {
      return {
        type: "chat",
        text,
        chat_title: chatTitle,
        ...extra
      };
    };
    exports.chat = chat;
  }
});

// node_modules/@maxhub/max-bot-api/dist/core/helpers/keyboard.js
var require_keyboard2 = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/core/helpers/keyboard.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.button = exports.inlineKeyboard = void 0;
    var inlineKeyboard = (buttons) => {
      return {
        type: "inline_keyboard",
        payload: { buttons }
      };
    };
    exports.inlineKeyboard = inlineKeyboard;
    exports.button = __importStar(require_buttons());
  }
});

// node_modules/@maxhub/max-bot-api/dist/index.js
var require_dist = __commonJS({
  "node_modules/@maxhub/max-bot-api/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaxError = exports.Keyboard = exports.ShareAttachment = exports.LocationAttachment = exports.VideoAttachment = exports.StickerAttachment = exports.ImageAttachment = exports.FileAttachment = exports.AudioAttachment = exports.Context = exports.Composer = exports.Bot = exports.Api = void 0;
    var api_1 = require_api7();
    Object.defineProperty(exports, "Api", { enumerable: true, get: function() {
      return api_1.Api;
    } });
    var bot_1 = require_bot2();
    Object.defineProperty(exports, "Bot", { enumerable: true, get: function() {
      return bot_1.Bot;
    } });
    var composer_1 = require_composer();
    Object.defineProperty(exports, "Composer", { enumerable: true, get: function() {
      return composer_1.Composer;
    } });
    var context_1 = require_context();
    Object.defineProperty(exports, "Context", { enumerable: true, get: function() {
      return context_1.Context;
    } });
    var attachments_1 = require_attachments();
    Object.defineProperty(exports, "AudioAttachment", { enumerable: true, get: function() {
      return attachments_1.AudioAttachment;
    } });
    Object.defineProperty(exports, "FileAttachment", { enumerable: true, get: function() {
      return attachments_1.FileAttachment;
    } });
    Object.defineProperty(exports, "ImageAttachment", { enumerable: true, get: function() {
      return attachments_1.ImageAttachment;
    } });
    Object.defineProperty(exports, "StickerAttachment", { enumerable: true, get: function() {
      return attachments_1.StickerAttachment;
    } });
    Object.defineProperty(exports, "VideoAttachment", { enumerable: true, get: function() {
      return attachments_1.VideoAttachment;
    } });
    Object.defineProperty(exports, "LocationAttachment", { enumerable: true, get: function() {
      return attachments_1.LocationAttachment;
    } });
    Object.defineProperty(exports, "ShareAttachment", { enumerable: true, get: function() {
      return attachments_1.ShareAttachment;
    } });
    exports.Keyboard = __importStar(require_keyboard2());
    var api_2 = require_api6();
    Object.defineProperty(exports, "MaxError", { enumerable: true, get: function() {
      return api_2.MaxError;
    } });
  }
});

// .tsc-out/index.js
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

// .tsc-out/runtime.js
var runtime = null;
function setRuntime(next) {
  runtime = next;
}
function getRuntime() {
  if (!runtime)
    throw new Error("MAX channel runtime not initialized");
  return runtime;
}

// .tsc-out/media.js
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as crypto from "crypto";
var MEDIA_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "audio/ogg": ".ogg",
  "audio/mpeg": ".mp3",
  "audio/mp4": ".m4a",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf"
};
function tempDir() {
  const dir = path.join(os.tmpdir(), "openclaw-max-media");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function uniqueFilename(ext) {
  return `max-${crypto.randomUUID()}${ext}`;
}
async function downloadMedia(url, maxMb = 20) {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to download media: ${resp.status} ${resp.statusText}`);
  }
  const contentType = resp.headers.get("content-type") ?? "application/octet-stream";
  const mimeBase = contentType.split(";")[0].trim();
  const ext = MEDIA_EXTENSIONS[mimeBase] ?? extensionFromUrl(url) ?? ".bin";
  const contentLength = resp.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > maxMb * 1024 * 1024) {
    throw new Error(`Media too large: ${contentLength} bytes (max ${maxMb}MB)`);
  }
  const buffer = Buffer.from(await resp.arrayBuffer());
  if (buffer.length > maxMb * 1024 * 1024) {
    throw new Error(`Media too large: ${buffer.length} bytes (max ${maxMb}MB)`);
  }
  const filename = uniqueFilename(ext);
  const localPath = path.join(tempDir(), filename);
  await fs.promises.writeFile(localPath, buffer);
  return { localPath, mimeType: mimeBase };
}
function extensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    return ext || null;
  } catch {
    return null;
  }
}
function detectMediaType(url) {
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/.test(lower))
    return "image";
  if (/\.(mp3|ogg|oga|opus|wav|m4a|aac|flac)(\?|$)/.test(lower))
    return "audio";
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/.test(lower))
    return "video";
  return "file";
}
async function uploadAndSendMedia(api, chatId, mediaUrl, text) {
  const type = detectMediaType(mediaUrl);
  if (type === "image" && /^https?:\/\//.test(mediaUrl)) {
    const attachment = await api.uploadImage({ url: mediaUrl });
    await api.sendMessageToChat(chatId, text ?? "", {
      attachments: [attachment.toJson()]
    });
    return;
  }
  const { localPath } = await downloadMedia(mediaUrl);
  try {
    let attachment;
    switch (type) {
      case "image":
        attachment = await api.uploadImage({ source: localPath });
        break;
      case "audio":
        attachment = await api.uploadAudio({ source: localPath });
        break;
      case "video":
        attachment = await api.uploadVideo({ source: localPath });
        break;
      default:
        attachment = await api.uploadFile({ source: localPath });
        break;
    }
    await api.sendMessageToChat(chatId, text ?? "", {
      attachments: [attachment.toJson()]
    });
  } finally {
    fs.promises.unlink(localPath).catch(() => {
    });
  }
}

// .tsc-out/normalizer.js
var CHANNEL_ID = "max";
function extractAttachmentUrl(att) {
  if (att.url)
    return att.url;
  const payload = att.payload;
  if (!payload)
    return void 0;
  if (typeof payload.url === "string")
    return payload.url;
  if (typeof payload.token === "string")
    return void 0;
  return void 0;
}
async function processAttachment(att, maxMb) {
  const attType = att.type;
  const url = extractAttachmentUrl(att);
  switch (attType) {
    case "image": {
      if (!url)
        return { placeholder: "[image attachment \u2014 no URL]" };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media = { type: "image", localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<image:${localPath}>>` };
      } catch {
        return { placeholder: `[image: ${url}]` };
      }
    }
    case "audio": {
      if (!url)
        return { placeholder: "[audio attachment \u2014 no URL]" };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media = { type: "audio", localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<audio:${localPath}>>` };
      } catch {
        return { placeholder: `[audio: ${url}]` };
      }
    }
    case "video": {
      if (!url)
        return { placeholder: "[video attachment \u2014 no URL]" };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media = { type: "video", localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<video:${localPath}>>` };
      } catch {
        return { placeholder: `[video: ${url}]` };
      }
    }
    case "file": {
      if (!url)
        return { placeholder: "[file attachment \u2014 no URL]" };
      try {
        const { localPath, mimeType } = await downloadMedia(url, maxMb);
        const media = { type: "file", localPath, mimeType, originalUrl: url };
        return { media, placeholder: `<<file:${localPath}>>` };
      } catch {
        return { placeholder: `[file: ${url}]` };
      }
    }
    case "sticker": {
      const payload = att.payload;
      const stickerUrl = payload?.url;
      const code = payload?.code;
      if (stickerUrl) {
        try {
          const { localPath, mimeType } = await downloadMedia(stickerUrl, maxMb);
          const media = { type: "sticker", localPath, mimeType, originalUrl: stickerUrl };
          return { media, placeholder: `<<image:${localPath}>>` };
        } catch {
          return { placeholder: `[sticker: ${code ?? stickerUrl}]` };
        }
      }
      return { placeholder: `[sticker: ${code ?? "unknown"}]` };
    }
    case "location": {
      const lat = att.latitude ?? 0;
      const lon = att.longitude ?? 0;
      return { placeholder: `[location: ${lat}, ${lon}]` };
    }
    case "contact": {
      const payload = att.payload;
      const vcf = payload?.vcf_info;
      return { placeholder: vcf ? `[contact: ${vcf}]` : "[contact]" };
    }
    case "share": {
      const payload = att.payload;
      const shareUrl = payload?.url;
      return { placeholder: shareUrl ? `[shared: ${shareUrl}]` : "[share]" };
    }
    default:
      return { placeholder: `[attachment: ${attType}]` };
  }
}
function buildReplyContext(message) {
  if (!message.link || message.link.type !== "reply")
    return null;
  const linked = message.link.message;
  if (!linked) {
    return message.link.mid ? { replyText: "", replyToId: message.link.mid } : null;
  }
  const senderName = linked.sender?.name ?? "Unknown";
  const body = linked.body?.text ?? "";
  const mid = linked.body?.mid ?? message.link.mid;
  return {
    replyText: `[Replying to ${senderName}: ${body.slice(0, 200)}]
`,
    replyToId: mid,
    replyToBody: body,
    replyToSender: senderName
  };
}
async function normalizeMessage(update, maxMb = 5) {
  const message = update.message;
  if (!message)
    return null;
  const sender = message.sender;
  const senderId = sender?.user_id?.toString() ?? "unknown";
  const senderName = sender?.name ?? "Unknown";
  const senderUsername = sender?.username;
  const chatId = message.recipient?.chat_id;
  const chatType = message.recipient?.chat_type === "dialog" ? "direct" : "group";
  const mid = message.body?.mid ?? `max-${update.timestamp}`;
  const timestamp = message.timestamp ?? update.timestamp ?? Date.now();
  const parts = [];
  const mediaFiles = [];
  const reply = buildReplyContext(message);
  if (reply?.replyText) {
    parts.push(reply.replyText);
  }
  const text = message.body?.text;
  if (text) {
    parts.push(text);
  }
  const attachments = message.body?.attachments;
  if (attachments?.length) {
    for (const att of attachments) {
      const { media, placeholder } = await processAttachment(att, maxMb);
      if (media)
        mediaFiles.push(media);
      parts.push(placeholder);
    }
  }
  const bodyText = parts.join("\n").trim();
  if (!bodyText)
    return null;
  return {
    id: mid,
    timestamp,
    channelId: CHANNEL_ID,
    chatType,
    chatId,
    sender: {
      id: senderId,
      name: senderName,
      username: senderUsername
    },
    content: {
      text: bodyText,
      mediaFiles: mediaFiles.length > 0 ? mediaFiles : void 0
    },
    metadata: {
      updateType: update.update_type,
      ...reply?.replyToId ? { replyToId: reply.replyToId } : {},
      ...reply?.replyToBody ? { replyToBody: reply.replyToBody } : {},
      ...reply?.replyToSender ? { replyToSender: reply.replyToSender } : {}
    }
  };
}
function normalizeBotStarted(update) {
  const user = update.user;
  const chatId = update.chat_id;
  if (!user || !chatId)
    return null;
  const payload = update.payload;
  const text = payload ? `/start ${payload}` : "/start";
  return {
    id: `max-start-${update.timestamp}`,
    timestamp: update.timestamp ?? Date.now(),
    channelId: CHANNEL_ID,
    chatType: "direct",
    chatId,
    sender: {
      id: user.user_id.toString(),
      name: user.name,
      username: user.username
    },
    content: { text },
    metadata: { updateType: "bot_started", payload }
  };
}
function normalizeCallback(update) {
  const cb = update.callback;
  if (!cb)
    return null;
  const user = cb.user;
  const chatId = update.chat_id ?? update.message?.recipient?.chat_id;
  if (!chatId)
    return null;
  const text = cb.payload ? `callback_data: ${cb.payload}` : "[button pressed]";
  return {
    id: `max-cb-${cb.callback_id}`,
    timestamp: update.timestamp ?? Date.now(),
    channelId: CHANNEL_ID,
    chatType: "direct",
    chatId,
    sender: {
      id: user.user_id.toString(),
      name: user.name,
      username: user.username
    },
    content: { text },
    metadata: {
      updateType: "message_callback",
      callbackId: cb.callback_id,
      callbackPayload: cb.payload
    }
  };
}

// .tsc-out/adapter.js
var BACKOFF_STEPS = [1e3, 2e3, 5e3, 1e4, 3e4];
function formatError(err) {
  if (err instanceof Error)
    return err.stack ?? err.message;
  if (typeof err === "string")
    return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
function backoffDelay(attempt) {
  return BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)];
}
var MaxAdapter = class {
  opts;
  bot = null;
  api = null;
  stopped = false;
  BotClass = null;
  lastPollOk = null;
  reconnectAttempt = 0;
  token;
  mediaMaxMb;
  onMessage;
  onReady;
  onError;
  logger;
  constructor(opts) {
    this.opts = opts;
    this.token = opts.config.botToken;
    this.mediaMaxMb = opts.config.mediaMaxMb ?? 5;
    this.onMessage = opts.onMessage;
    this.onReady = opts.onReady;
    this.onError = opts.onError;
    this.logger = opts.logger ?? {};
    if (opts.signal) {
      opts.signal.addEventListener("abort", () => this.stop(), { once: true });
    }
  }
  /**
   * Start Long Polling with supervised reconnect loop.
   */
  async start() {
    if (this.stopped)
      return;
    const maxBotApi = await Promise.resolve().then(() => __toESM(require_dist(), 1));
    this.BotClass = maxBotApi.Bot;
    await this.connectAndPoll();
  }
  /**
   * Create a fresh Bot instance, register handlers, verify connection, start polling.
   * On polling crash — automatically retries with backoff unless stopped.
   */
  async connectAndPoll() {
    while (!this.stopped) {
      try {
        this.bot = new this.BotClass(this.token);
        this.api = this.bot.api;
        this.registerHandlers();
        const info = await this.api.getMyInfo();
        this.logger.info?.(`[MAX] Connected as @${info.username ?? info.name ?? "bot"}`);
        this.lastPollOk = Date.now();
        if (this.reconnectAttempt > 0) {
          this.logger.info?.(`[MAX] Polling resumed after ${this.reconnectAttempt} reconnect attempt(s)`);
        }
        this.reconnectAttempt = 0;
        this.onReady?.();
        this.logger.info?.("[MAX] Starting Long Polling...");
        await this.bot.start();
        if (!this.stopped) {
          this.logger.warn?.("[MAX] bot.start() exited unexpectedly, will reconnect");
        }
      } catch (err) {
        if (this.stopped)
          return;
        const delay = backoffDelay(this.reconnectAttempt);
        this.reconnectAttempt++;
        this.logger.error?.(`[MAX] Polling failed (attempt #${this.reconnectAttempt}, last ok: ${this.lastPollOk ? new Date(this.lastPollOk).toISOString() : "never"}): ` + formatError(err));
        this.logger.info?.(`[MAX] Reconnecting in ${delay / 1e3}s...`);
        this.onError?.(err);
        this.cleanupBot();
        await this.sleep(delay);
      }
    }
  }
  registerHandlers() {
    this.bot.on("bot_started", async (ctx) => {
      try {
        const update = ctx.update;
        const envelope = normalizeBotStarted(update);
        if (envelope) {
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling bot_started: ${formatError(err)}`);
        this.onError?.(err);
      }
    });
    this.bot.on("message_created", async (ctx) => {
      try {
        const update = ctx.update;
        const envelope = await normalizeMessage(update, this.mediaMaxMb);
        if (envelope) {
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling message_created: ${formatError(err)}`);
        this.onError?.(err);
      }
    });
    this.bot.on("message_edited", async (ctx) => {
      try {
        const update = ctx.update;
        const envelope = await normalizeMessage(update, this.mediaMaxMb);
        if (envelope) {
          envelope.metadata.edited = true;
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling message_edited: ${formatError(err)}`);
        this.onError?.(err);
      }
    });
    this.bot.on("message_callback", async (ctx) => {
      try {
        const update = ctx.update;
        const envelope = normalizeCallback(update);
        if (envelope) {
          this.lastPollOk = Date.now();
          await this.onMessage(envelope);
        }
      } catch (err) {
        this.logger.error?.(`[MAX] Error handling message_callback: ${formatError(err)}`);
        this.onError?.(err);
      }
    });
    this.bot.catch((err) => {
      this.logger.error?.(`[MAX] Bot catch handler: ${formatError(err)}`);
      this.onError?.(err);
    });
  }
  cleanupBot() {
    try {
      this.bot?.stop?.();
    } catch {
    }
    this.bot = null;
  }
  sleep(ms) {
    return new Promise((resolve) => {
      if (this.stopped) {
        resolve();
        return;
      }
      const timer = setTimeout(resolve, ms);
      if (this.opts.signal) {
        const onAbort = () => {
          clearTimeout(timer);
          resolve();
        };
        this.opts.signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  }
  /**
   * Stop Long Polling and clean up. Only called on abort signal or explicit stop.
   */
  stop() {
    if (this.stopped)
      return;
    this.stopped = true;
    this.cleanupBot();
    this.logger.info?.("[MAX] Adapter stopped");
  }
  getApi() {
    return this.api;
  }
  async sendText(chatId, text, extra) {
    if (!this.api)
      throw new Error("MAX adapter not started");
    await this.api.sendMessageToChat(chatId, text, extra);
  }
  async sendReply(chatId, text, replyToMid, extra) {
    if (!this.api)
      throw new Error("MAX adapter not started");
    await this.api.sendMessageToChat(chatId, text, {
      ...extra,
      link: { type: "reply", mid: replyToMid }
    });
  }
  isStopped() {
    return this.stopped;
  }
};

// .tsc-out/index.js
var CHANNEL_ID2 = "max";
function formatError2(err) {
  if (err instanceof Error)
    return err.stack ?? err.message;
  if (typeof err === "string")
    return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
var adapters = /* @__PURE__ */ new Map();
var maxPlugin = {
  id: CHANNEL_ID2,
  meta: {
    id: CHANNEL_ID2,
    label: "MAX Messenger",
    selectionLabel: "MAX (Messenger)",
    docsPath: "/channels/max",
    blurb: "Connect your AI agent to MAX messenger \u2014 text, voice, images, video, inline buttons.",
    aliases: ["max"]
  },
  configSchema: {
    schema: {
      type: "object",
      properties: {
        botToken: { type: "string" },
        enabled: { type: "boolean", default: true },
        dmPolicy: { type: "string", default: "open" },
        allowFrom: { type: "array", items: { type: "string" } },
        groupPolicy: { type: "string", default: "allowlist" },
        groupAllowFrom: { type: "array", items: { type: "string" } },
        groups: { type: "object", additionalProperties: true },
        requireMention: { type: "boolean", default: true },
        mediaMaxMb: { type: "number", default: 5 },
        streaming: { type: "string", default: "off" },
        textChunkLimit: { type: "number", default: 4e3 }
      },
      required: ["botToken"]
    }
  },
  capabilities: {
    chatTypes: ["direct", "group"]
  },
  config: {
    listAccountIds: (cfg) => {
      const max = cfg.channels?.max;
      if (!max)
        return [];
      if (max.accounts && Object.keys(max.accounts).length > 0) {
        return Object.keys(max.accounts);
      }
      if (max.botToken || process.env.MAX_BOT_TOKEN) {
        return ["default"];
      }
      return [];
    },
    resolveAccount: (cfg, accountId) => {
      const channels = cfg.channels;
      const id = accountId ?? "default";
      const account = channels?.max?.accounts?.[id] ?? channels?.max ?? {};
      const botToken = account.botToken ?? channels?.max?.botToken ?? process.env.MAX_BOT_TOKEN ?? "";
      return { accountId: id, ...account, botToken };
    }
  },
  outbound: {
    deliveryMode: "direct",
    sendText: async (ctx) => {
      const adapter = adapters.get(ctx.accountId ?? "default");
      if (!adapter)
        return { ok: false };
      const rawTo = ctx.to?.replace(/^max:/, "") ?? "";
      const chatId = parseInt(rawTo, 10);
      if (isNaN(chatId)) {
        console.error(`[MAX] sendText: invalid chatId from ctx.to="${ctx.to}"`);
        return { ok: false };
      }
      try {
        const mediaUrl = ctx.mediaUrl;
        const mediaUrls = ctx.mediaUrls;
        if (mediaUrl) {
          await uploadAndSendMedia(adapter.getApi(), chatId, mediaUrl, ctx.text);
        } else if (mediaUrls?.length) {
          await uploadAndSendMedia(adapter.getApi(), chatId, mediaUrls[0], ctx.text);
          for (let i = 1; i < mediaUrls.length; i++) {
            await uploadAndSendMedia(adapter.getApi(), chatId, mediaUrls[i]);
          }
        } else {
          const btnResult = await resolveButtons(ctx.text, ctx);
          if (btnResult) {
            await adapter.sendText(chatId, btnResult.cleanText, {
              format: "markdown",
              attachments: [btnResult.keyboard]
            });
          } else {
            await adapter.sendText(chatId, ctx.text, {
              format: "markdown"
            });
          }
        }
        return { ok: true };
      } catch (err) {
        console.error("[MAX] sendText error:", err);
        return { ok: false };
      }
    }
  },
  gateway: {
    startAccount: async (ctx) => {
      const rt = getRuntime();
      const { cfg, accountId, account, abortSignal, log } = ctx;
      log?.info?.(`[MAX] startAccount called for ${accountId}`);
      ctx.setStatus({
        accountId,
        running: true,
        connected: false,
        lastStartAt: Date.now()
      });
      const existing = adapters.get(accountId);
      if (existing) {
        existing.stop();
      }
      const adapter = new MaxAdapter({
        config: account,
        logger: log,
        signal: abortSignal,
        onReady: () => {
          ctx.setStatus({
            accountId,
            running: true,
            connected: true,
            lastConnectedAt: Date.now(),
            lastError: null
          });
          log?.info?.("[MAX] Bot connected and polling");
        },
        onError: (err) => {
          const detail = err instanceof Error ? err.stack ?? err.message : String(err);
          log?.error?.(`[MAX] Adapter error: ${detail}`);
          ctx.setStatus({
            ...ctx.getStatus(),
            lastError: detail,
            lastErrorAt: Date.now()
          });
        },
        onMessage: async (envelope) => {
          log?.info?.(`[MAX] Inbound: ${envelope.id} from=${envelope.sender.name} chat=${envelope.chatId} type=${envelope.chatType}`);
          if (envelope.chatType === "direct") {
            const policy = account.dmPolicy ?? "open";
            if (policy === "disabled")
              return;
            if (policy === "allowlist") {
              const allow = account.allowFrom ?? [];
              const senderId = String(envelope.sender.id);
              const chatId = String(envelope.chatId);
              if (!allow.includes("*") && !allow.includes(senderId) && !allow.includes(chatId)) {
                log?.debug?.(`[MAX] Ignoring DM from ${senderId} (not in allowFrom)`);
                return;
              }
            }
          } else if (envelope.chatType === "group") {
            const chatId = String(envelope.chatId);
            const groupCfg = account.groups?.[chatId] ?? account.groups?.["*"];
            const groupPolicy = groupCfg?.groupPolicy ?? account.groupPolicy ?? "disabled";
            if (groupPolicy === "disabled")
              return;
            if (groupPolicy === "allowlist") {
              const allow = groupCfg?.allowFrom ?? account.groupAllowFrom ?? [];
              const senderId = String(envelope.sender.id);
              if (!allow.includes("*") && !allow.includes(senderId) && !allow.includes(chatId)) {
                log?.debug?.(`[MAX] Ignoring group msg from ${senderId} in ${chatId} (not in groupAllowFrom)`);
                return;
              }
            }
          }
          let route;
          try {
            const peer = {
              kind: envelope.chatType,
              id: String(envelope.chatId)
            };
            route = await rt.channel.routing.resolveAgentRoute({
              cfg,
              channel: CHANNEL_ID2,
              accountId,
              peer,
              chatType: envelope.chatType,
              peerId: envelope.sender.id,
              senderId: envelope.sender.id,
              ...envelope.chatType === "group" ? { groupId: String(envelope.chatId) } : {}
            });
            const dmScope = cfg.session?.dmScope ?? "per-channel-peer";
            if (envelope.chatType === "direct" && dmScope === "per-channel-peer") {
              route.sessionKey = `agent:${route.agentId}:${CHANNEL_ID2}:direct:${envelope.chatId}`;
            } else if (envelope.chatType === "group") {
              route.sessionKey = `agent:${route.agentId}:${CHANNEL_ID2}:group:${envelope.chatId}`;
            }
            log?.info?.(`[MAX] Route: agent=${route.agentId} session=${route.sessionKey}`);
          } catch (err) {
            log?.error?.(`[MAX] resolveAgentRoute failed: ${formatError2(err)}`);
            throw err;
          }
          const rawCtx = {
            Body: envelope.content.text,
            RawBody: envelope.content.text,
            CommandBody: envelope.content.text,
            From: `${CHANNEL_ID2}:${envelope.sender.id}`,
            To: `${CHANNEL_ID2}:${accountId}`,
            SessionKey: route.sessionKey,
            AccountId: accountId,
            ChatType: envelope.chatType,
            ConversationLabel: envelope.sender.name,
            SenderName: envelope.sender.name,
            SenderId: envelope.sender.id,
            Provider: CHANNEL_ID2,
            Surface: CHANNEL_ID2,
            MessageSid: envelope.id,
            Timestamp: envelope.timestamp,
            OriginatingChannel: CHANNEL_ID2,
            OriginatingTo: `${CHANNEL_ID2}:${accountId}`
          };
          if (envelope.metadata.replyToId) {
            rawCtx.ReplyToId = envelope.metadata.replyToId;
          }
          if (envelope.metadata.replyToBody) {
            rawCtx.ReplyToBody = envelope.metadata.replyToBody;
          }
          if (envelope.metadata.replyToSender) {
            rawCtx.ReplyToSender = envelope.metadata.replyToSender;
          }
          log?.info?.(`[MAX] MsgContext built, SessionKey=${rawCtx.SessionKey}`);
          let msgCtx;
          try {
            msgCtx = rt.channel.reply.finalizeInboundContext(rawCtx);
            log?.info?.(`[MAX] Finalized, CommandAuthorized=${msgCtx.CommandAuthorized}`);
          } catch (err) {
            log?.error?.(`[MAX] finalizeInboundContext failed: ${formatError2(err)}`);
            throw err;
          }
          try {
            const sessionObj = rt.channel.session;
            const storePath = sessionObj.resolveStorePath(cfg.session?.store, { agentId: route.agentId });
            await sessionObj.recordInboundSession({
              storePath,
              sessionKey: msgCtx.SessionKey ?? route.sessionKey,
              ctx: msgCtx,
              updateLastRoute: {
                sessionKey: route.mainSessionKey ?? route.sessionKey,
                channel: CHANNEL_ID2,
                to: `${CHANNEL_ID2}:${accountId}`,
                accountId
              },
              onRecordError: (err) => {
                log?.error?.(`[MAX] recordInboundSession onRecordError: ${formatError2(err)}`);
              }
            });
            log?.info?.("[MAX] Session recorded");
          } catch (err) {
            log?.error?.(`[MAX] recordInboundSession failed: ${formatError2(err)}`);
            throw err;
          }
          try {
            const targetChatId = envelope.chatId;
            await rt.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
              ctx: msgCtx,
              cfg,
              dispatcherOptions: {
                deliver: async (payload) => {
                  const text = payload.text;
                  log?.info?.(`[MAX] Deliver: text=${text ? text.slice(0, 80) + "..." : "(empty)"}`);
                  if (!text && !payload.mediaUrl && !payload.mediaUrls?.length)
                    return;
                  try {
                    const api = adapter.getApi();
                    const mediaUrl = payload.mediaUrl;
                    const mediaUrls = payload.mediaUrls;
                    if (mediaUrl) {
                      await uploadAndSendMedia(api, targetChatId, mediaUrl, text);
                    } else if (mediaUrls?.length) {
                      await uploadAndSendMedia(api, targetChatId, mediaUrls[0], text);
                      for (let i = 1; i < mediaUrls.length; i++) {
                        await uploadAndSendMedia(api, targetChatId, mediaUrls[i]);
                      }
                    } else if (text) {
                      const chunkLimit = account.textChunkLimit ?? 4e3;
                      const btnResult = await resolveButtons(text, payload);
                      if (btnResult) {
                        const chunks = chunkText(btnResult.cleanText, chunkLimit);
                        for (let i = 0; i < chunks.length - 1; i++) {
                          await adapter.sendText(targetChatId, chunks[i], {
                            format: "markdown"
                          });
                        }
                        await adapter.sendText(targetChatId, chunks[chunks.length - 1] || "", {
                          format: "markdown",
                          attachments: [btnResult.keyboard]
                        });
                        log?.info?.(`[MAX] Sent with inline keyboard (${btnResult.cleanText.length} chars)`);
                      } else {
                        const chunks = chunkText(text, chunkLimit);
                        for (const chunk of chunks) {
                          await adapter.sendText(targetChatId, chunk, {
                            format: "markdown"
                          });
                        }
                      }
                    }
                  } catch (err) {
                    log?.error?.(`[MAX] Deliver error: ${formatError2(err)}`);
                  }
                },
                onError: (err, info) => {
                  log?.error?.(`[MAX] Dispatch onError (${info.kind}): ${formatError2(err)}`);
                }
              }
            });
            log?.info?.("[MAX] Dispatch complete");
          } catch (err) {
            log?.error?.(`[MAX] Dispatch failed: ${formatError2(err)}`);
            throw err;
          }
        }
      });
      adapters.set(accountId, adapter);
      log?.info?.("[MAX] Starting adapter...");
      await adapter.start();
      log?.info?.("[MAX] Adapter started");
      return new Promise((resolve) => {
        const onAbort = () => {
          log?.info?.(`[MAX] Abort signal \u2014 shutting down account ${accountId}`);
          adapter.stop();
          adapters.delete(accountId);
          ctx.setStatus({
            accountId,
            running: false,
            connected: false,
            lastStopAt: Date.now()
          });
          resolve();
        };
        if (abortSignal.aborted) {
          onAbort();
        } else {
          abortSignal.addEventListener("abort", onAbort, { once: true });
        }
      });
    }
  }
};
function extractInlineButtons(text) {
  const btnRe = /<<([^>|]+?)(?:\|(.*?))?>>/g;
  const lines = text.split("\n");
  const clean = [];
  const rows = [];
  for (const line of lines) {
    const matches = [...line.matchAll(btnRe)];
    if (matches.length === 0) {
      clean.push(line);
      continue;
    }
    const row = [];
    for (const m of matches) {
      const label = m[1].trim();
      const value = m[2]?.trim();
      if (value && /^https?:\/\//.test(value)) {
        row.push({ text: label, url: value });
      } else {
        row.push({ text: label, payload: value || label });
      }
    }
    rows.push(row);
    const leftover = line.replace(/<<([^>|]+?)(?:\|(.*?))?>>/g, "").trim();
    if (leftover)
      clean.push(leftover);
  }
  if (rows.length === 0)
    return null;
  return {
    cleanText: clean.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    rows
  };
}
async function buildMaxKeyboard(rows) {
  const { Keyboard } = await Promise.resolve().then(() => __toESM(require_dist(), 1));
  const kbRows = rows.map((row) => row.map((btn) => btn.url ? Keyboard.button.link(btn.text, btn.url) : Keyboard.button.callback(btn.text, btn.payload ?? btn.text)));
  return Keyboard.inlineKeyboard(kbRows);
}
async function resolveButtons(text, payload) {
  const maxData = payload.channelData?.max;
  if (maxData?.buttons?.length) {
    const rows = maxData.buttons.map((row) => row.map((btn) => ({
      text: btn.text ?? btn.label ?? "",
      payload: btn.payload ?? btn.callback_data,
      url: btn.url
    })));
    return {
      cleanText: text ?? "",
      keyboard: await buildMaxKeyboard(rows)
    };
  }
  if (!text)
    return null;
  const parsed = extractInlineButtons(text);
  if (!parsed)
    return null;
  return {
    cleanText: parsed.cleanText,
    keyboard: await buildMaxKeyboard(parsed.rows)
  };
}
function chunkText(text, limit) {
  if (text.length <= limit)
    return [text];
  const chunks = [];
  let remaining = text;
  while (remaining.length > limit) {
    let splitAt = remaining.lastIndexOf("\n\n", limit);
    if (splitAt <= 0)
      splitAt = remaining.lastIndexOf("\n", limit);
    if (splitAt <= 0)
      splitAt = remaining.lastIndexOf(" ", limit);
    if (splitAt <= 0)
      splitAt = limit;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }
  if (remaining)
    chunks.push(remaining);
  return chunks;
}
var plugin = {
  id: CHANNEL_ID2,
  name: "MAX Messenger Channel",
  configSchema: emptyPluginConfigSchema(),
  register(api) {
    setRuntime(api.runtime);
    api.registerChannel({ plugin: maxPlugin });
  }
};
var index_default = plugin;
export {
  index_default as default
};
