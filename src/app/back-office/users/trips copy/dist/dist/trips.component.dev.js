"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.TripsComponent = void 0;

var core_1 = require("@angular/core");

var TripsComponent =
/** @class */
function () {
  function TripsComponent() {}

  TripsComponent.prototype.ngOnInit = function () {
    this.tableData1 = {
      headerRow: ['ID', 'Type', 'Drivers', 'Start', 'Destination'],
      dataRows: [['T000102620', 'Transport', 'Jean Jacke', 'Bangangte / 02:30PM', 'Yaounde'], ['C000102620', 'Carrier', 'Tagne Tomas', 'Douala / 10:00AM', 'Bafoussam'], ['S000102620', 'Shipper', 'Ngongang Yvan', 'Yaoundé / 05:AM', 'Ebolowa'], ['T001102620', 'Transport', 'Jean Jacke', 'Bangangte / 02:30PM', 'Yaounde'], ['C001102620', 'Carrier', 'Tagne Tomas', 'Douala / 10:00AM', 'Bafoussam'], ['S001102620', 'Shipper', 'Ngongang Yvan', 'Yaoundé / 05:AM', 'Ebolowa']]
    };
    this.tableData2 = {
      headerRow: ['ID', 'Type', 'Drivers', 'Start', 'Destination'],
      dataRows: [['T000102620', 'Transport', 'Jean Jacke', 'Bangangte / 02:30PM', 'Yaounde'], ['C000102620', 'Carrier', 'Tagne Tomas', 'Douala / 10:00AM', 'Bafoussam'], ['S000102620', 'Shipper', 'Ngongang Yvan', 'Yaoundé / 05:AM', 'Ebolowa'], ['T001102620', 'Transport', 'Jean Jacke', 'Bangangte / 02:30PM', 'Yaounde'], ['C001102620', 'Carrier', 'Tagne Tomas', 'Douala / 10:00AM', 'Bafoussam'], ['S001102620', 'Shipper', 'Ngongang Yvan', 'Yaoundé / 05:AM', 'Ebolowa']]
    };
  };

  TripsComponent = __decorate([core_1.Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: ['./trips.component.scss']
  })], TripsComponent);
  return TripsComponent;
}();

exports.TripsComponent = TripsComponent;