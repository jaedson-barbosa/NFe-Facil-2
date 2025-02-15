export default function (json) {
  var obj = null
  if (typeof json == 'string') {
    try {
      obj = JSON.parse(json)
    } catch (e) {
      throw new Error('The JSON structure is invalid')
    }
  } else {
    obj = json
  }
  var toXml = new ToXml()
  toXml.parse(obj)
  return toXml.xml
}

class ToXml {
  public xml: string
  private tagIncomplete: boolean
  constructor() {
    this.xml = ''
    this.tagIncomplete = false
  }

  public parse(obj) {
    if (!obj) return

    var keys = Object.keys(obj)
    var len = keys.length

    // First pass, extract strings only
    for (var i = 0; i < len; i++) {
      var key = keys[i],
        value = obj[key],
        isArray = Array.isArray(value)
      var type = typeof value
      if (
        type == 'string' ||
        type == 'number' ||
        type == 'boolean' ||
        isArray
      ) {
        var it = isArray ? value : [value]
        for (const subVal of it) {
          if (typeof subVal != 'object') {
            if (key == '$t') {
              this.addTextContent(subVal)
            } else {
              this.addAttr(key, subVal)
            }
          }
        }
      }
    }

    // Second path, now handle sub-objects and arrays
    for (var i = 0; i < len; i++) {
      var key = keys[i]

      if (Array.isArray(obj[key])) {
        var elems = obj[key]
        var l = elems.length
        for (var j = 0; j < l; j++) {
          var elem = elems[j]

          if (typeof elem == 'object') {
            this.openTag(key)
            this.parse(elem)
            this.closeTag(key)
          }
        }
      } else if (typeof obj[key] == 'object') {
        this.openTag(key)
        this.parse(obj[key])
        this.closeTag(key)
      }
    }
  }

  private openTag(key) {
    this.completeTag()
    this.xml += '<' + key
    this.tagIncomplete = true
  }

  private addAttr(key, val) {
    val = sanitize(val, false, true)
    this.xml += ' ' + key + '="' + val + '"'
  }

  private addTextContent(text) {
    this.completeTag()
    var newText = sanitize(text)
    this.xml += newText
  }

  private closeTag(key) {
    this.completeTag()
    this.xml += '</' + key + '>'
  }

  private completeTag() {
    if (this.tagIncomplete) {
      this.xml += '>'
      this.tagIncomplete = false
    }
  }
}

/**
 * Simple sanitization. It is not intended to sanitize
 * malicious element values.
 *
 * character | escaped
 *      <       &lt;
 *      >       &gt;
 *      (       &#40;
 *      )       &#41;
 *      #       &#35;
 *      &       &amp;
 *      "       &quot;
 *      '       &apos;
 */
// used for body text
var charsEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

var charsUnescape = {
  '&amp;': '&',
  '&#35;': '#',
  '&lt;': '<',
  '&gt;': '>',
  '&#40;': '(',
  '&#41;': ')',
  '&quot;': '"',
  '&apos;': "'",
  '&#31;': '\u001F',
}

// used in attribute values
var charsAttrEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

// sanitize body text
export function sanitize(value, reverse = undefined, attribute = undefined) {
  if (typeof value !== 'string') {
    return value
  }

  var chars = reverse
    ? charsUnescape
    : attribute
    ? charsAttrEscape
    : charsEscape
  var keys = Object.keys(chars)

  keys.forEach(function (key) {
    value = value.replace(new RegExp(escapeRegExp(key), 'g'), chars[key])
  })

  return value
}
