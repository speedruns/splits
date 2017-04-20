const {dialog}  = require('electron').remote;
const fs        = require('fs');
const {Run}     = require('./');

module.exports.save_run = function(run) {
  let path = dialog.showSaveDialog({ title: 'Save Splits', defaultPath: 'run.splits' });
  if(path === undefined) return;
  console.log("Saving run to", path);
  fs.writeFileSync(path, JSON.stringify(run.as_json()));
};

module.exports.open_run = function(run_file) {
  if(run_file === undefined) {
    let paths = dialog.showOpenDialog({ title: 'Open Splits' });
    if(paths === undefined) return { new_run: undefined, run_file: undefined };
    run_file = paths[0];
  }

  console.log("Opening run from `" + run_file + "`");

  buf = fs.readFileSync(run_file, 'utf-8');
  run_data = JSON.parse(buf);

  let new_run = Run.from_json(run_data);
  return { new_run: new_run, run_file: run_file };
};
