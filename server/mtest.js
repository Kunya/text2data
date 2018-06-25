var cool = {};

cool.logg = function() {
  console.log("DAT LOG IS" + JSON.stringify(module.exports.io));
};

module.exports = {
  io: {},
  cool: cool
};
