var components = require('./component');
var systems = module.exports.systems = {};  // Keep track of registered components.

/**
 * System class definition.
 *
 * Systems are pieces of data and logic that are associated to one particular
 * component. They're global to all the instantiated components of that type
 * and provide an API for them to use. An example would be a physics component
 * that would contain a physics system that oversees all the entities and
 * calculate the necessary updates based on the entities interactions.
 *
 * @namespace System
 * @member {Element} sceneEl - Handle to the scene element where the system applies to.
 */
var System = module.exports.System = function () {
  var component = components && components.components[this.name];
  if (component) { component.Component.prototype.system = this; }
};

System.prototype = {

  /**
   * Init handler. Called during scene initialization and is only run once.
   * Systems can use this to set initial state.
   */
  init: function () { /* no-op */ },

  /**
   * Tick handler.
   * Called on each tick of the scene render loop.
   * Affected by play and pause.
   *
   * @param {number} time - Scene tick time.
   * @param {number} timeDelta - Difference in current render time and previous render time.
   */
  tick: undefined,

  /**
   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).
   */
  play: function () { /* no-op */ },

  /**
   * Called to stop any dynamic behavior (e.g., animation, AI, events, physics).
   */
  pause: function () { /* no-op */ },

  /**
   * Remove handler. Shuts down the system
   */
  remove: function () { /* no-op */ }
};

/**
 * Registers a system to A-Frame.
 *
 * @param {string} name - Component name.
 * @param {object} definition - Component property and methods.
 * @returns {object} Component.
 */
module.exports.registerSystem = function (name, definition) {
  var i;
  var NewSystem;
  var proto = {};
  var scenes = document.querySelectorAll('a-scene');

  // Format definition object to prototype object.
  Object.keys(definition).forEach(function (key) {
    proto[key] = {
      value: definition[key],
      writable: true
    };
  });

  if (systems[name]) {
    throw new Error('The system `' + name + '` has been already registered. ' +
                    'Check that you are not loading two versions of the same system ' +
                    'or two different systems of the same name.');
  }
  NewSystem = function () { System.call(this); };
  NewSystem.prototype = Object.create(System.prototype, proto);
  NewSystem.prototype.name = name;
  NewSystem.prototype.constructor = NewSystem;
  systems[name] = NewSystem;

  // Initialize systems for existing scenes
  for (i = 0; i < scenes.length; i++) { scenes[i].initSystem(name); }
};
