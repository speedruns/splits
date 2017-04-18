const {dialog}  = require('electron').remote;
const fs        = require('fs');
const {Run}     = require('./');

module.exports.save_run = function(run) {
  let path = dialog.showSaveDialog({ title: 'Save Splits', defaultPath: 'run.splits' });
  if(path === undefined) return;
  console.log("Saving run to", path);
  fs.writeFileSync(path, JSON.stringify(run.as_json()));
};

module.exports.open_run = function() {
  let paths = dialog.showOpenDialog({ title: 'Open Splits' });
  if(paths === undefined) return;

  console.log("Opening run from `" + paths[0] + "`");

  buf = fs.readFileSync(paths[0], 'utf-8');
  run_data = JSON.parse(buf);

  let new_run = Run.from_json(run_data);
  return new_run;
};
