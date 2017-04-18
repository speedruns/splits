const fs = require('fs');

const COMPONENTS_DIR      = __dirname + '/../components/';
const COMPONENT_TEMPLATE  = 'template.html';
module.exports.load = function(document, component_name) {
  let component_path  = require.resolve(COMPONENTS_DIR+component_name+'/'+COMPONENT_TEMPLATE);
  let template_element = document.createElement('link');
  template_element.rel = 'import';
  template_element.href = component_path;

  document.head.appendChild(template_element);
  template_element.import;
};
