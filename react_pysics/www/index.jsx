/*global React moment ___*/

(() => {
  'use strict';
  //===========================================================================
  (() => {
    var extendMethod = (object, methodName, method) => {
      if (typeof Object.defineProperty !== 'function') {
        object[methodName] = method;
      } else {
        Object.defineProperty(object, methodName, {
          configurable: false,
          enumerable: false,
          value: method
        });
      }
    };
    extendMethod(Object.prototype, 'argumentNames', function() {
      var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
      return names.length === 1 && !names[0] ? [] : names;
    });
    var dynamicKey;
    var instance = false;
    var worldtimestream = (cbF) => {
      if (typeof cbF === "function") {
        return () => {
          if (instance === false) {
            dynamicKey = cbF.argumentNames()[0];
            if (typeof dynamicKey === "undefined") {
              dynamicKey = 't'; //fallback you must use t()
            }
            var o = Date.now;
            o.computeInterval = (...args) => {
              var f = () => {
                setInterval(args[0], args[1]);
              };
              return f;
            };
            o.computeTimeout = (...args) => {
              var f = () => {
                setTimeout(args[0], args[1]);
              };
              return f;
            };
            cbF(o);
            instance = true;
          } else {
            throw "ERROR: This code runs in your single universe.";
          }
        };
      } else {
        var computingF = [];
        var value = {};
        var state;
        Object.defineProperties(value,
          {
            val: //value.val
            {
              get() {
                return state;
              },
              set(x) {
                state = x;
                computingF.map(
                  (f) => {
                    f(x);
                  });
                return;
              }
            }
          });
        var o = {
          compute(f) {
            var f1 = () => {
              computingF[computingF.length] = f; //push  f
            };
            return f1;
          },
          appear(a) {
            var f1 = () => {
              value.val = a;
            };
            return f1;
          }
        };
        o[dynamicKey] = () => {
          return value.val;
        };
        return o;
      }
    };
    Object.defineProperties(worldtimestream,
      {
        world: //our physical world
        {
          set(f) {
            f();
          }
        }
      });
    worldtimestream.log = (...args) => {
      var f = () => {
        console.info.apply(console, args);
      };
      return f;
    };

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = worldtimestream;
    } else {
      window.___ = worldtimestream;
    }

  })();
  //===========================================================================

  ___.world = ___((t) => { // world engine
    //===========================================================================
    //MKS system of units

    var ___coordinate = ___();

    var V0 = 85.0; // m/s
    var deg = 30; //degree
    var THETA = deg / 180 * Math.PI; //radian
    var G = 9.8; //gravity const

    var coordinateEquation = (t) => {
      var x = V0 * Math.cos(THETA) * t;
      var y = V0 * Math.sin(THETA) * t - G * Math.pow(t, 2);
      return {
        x: x,
        y: y
      };
    };
    //
    //==============================================================
    var Drawscale = 4; //4 dot = 1 meter

    class ReactComponent extends React . Component {
      static get defaultProps() {
        return {
          ___x: ___(),
          ___y: ___()
        };
      }
      constructor(props) {
        super(props);
        ___.world = ___coordinate.compute((coordinate) => {
          ___.world = this.props.___x.appear(50 + coordinate.x * Drawscale);
          ___.world = this.props.___y.appear(300 - coordinate.y * Drawscale);
          this.forceUpdate();
        });
        var init = () => {
          var T0 = t();
          var f = () => {
            ___.world = ___coordinate.appear(coordinateEquation((t() - T0) / 1000));
          };
          ___.world = t.computeInterval(f, 10); //calculate 10milsec resolution
        };
        ___.world = t.computeTimeout(init, 0);
      }
      render() {
        var el = (
        <div>
          <h1>For new shot, Just Reload the browser page</h1>
          <svg height = "100%"  width = "100%">
              <circle r="5" fill="blue"
        cx = {this.props.___x.t()}
        cy = {this.props.___y.t()}/>
          </svg>
        </div>
        );
        return el;
      }
    }

    var mount = React.render(<ReactComponent />, document.body);
  //==============================================================
  //===========================================================================
  });
})();
