"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RequestsComponent = void 0;
var core_1 = require("@angular/core");
var RequestsComponent = /** @class */ (function () {
    function RequestsComponent() {
    }
    RequestsComponent.prototype.ngOnInit = function () {
    };
    RequestsComponent.prototype.showNotification = function (from, align, colortype, icon, text) {
        // Differents from are 'top' and 'bottom'
        // Differents align are 'left','center' and 'right'
        // Differents color type are 'info','success','warning','danger' ...
        // Icons is type 'pe-7s-icon'
        $.notify({
            icon: icon,
            message: text
        }, {
            type: colortype,
            timer: 1000,
            placement: {
                from: from,
                align: align
            }
        });
    };
    RequestsComponent = __decorate([
        core_1.Component({
            selector: 'app-requests',
            templateUrl: './requests.component.html',
            styleUrls: ['./requests.component.scss']
        })
    ], RequestsComponent);
    return RequestsComponent;
}());
exports.RequestsComponent = RequestsComponent;
