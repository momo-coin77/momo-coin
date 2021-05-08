"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserComponent = void 0;
var core_1 = require("@angular/core");
var UserComponent = /** @class */ (function () {
    function UserComponent(
    // private userService: UserService,
    authService, router, ngZone) {
        // this.user["name"] = `${this.userService.user.firstName} ${this.userService.user.lastName}`;
        this.authService = authService;
        this.router = router;
        this.ngZone = ngZone;
        // user: any[];
        // users: any[];
        this.firstName = "Flambel";
        this.lastName = "SANOU";
        this.name = this.firstName + " " + this.lastName;
        this.userAddress = "Mandja";
        this.userCity = "Bangangte";
        this.userCountry = "Cameroon";
        this.userZip = "0000";
        this.userPhone = "(+237) 691 224 472";
        this.userCoverImg = "assets/img/userCoverImg1.png";
        this.userProfileImg = "assets/img/faces/face-0.jpg";
        this.userName = "Flambel55";
        this.userEmail = "flambel55@gmail.com";
        this.userLabel = "if we are satisfied with our present, we have no future.";
        this.message = "\<b>Error\</b>\<br>Someone was not going. This option is not available.";
    }
    UserComponent.prototype.ngOnInit = function () {
        // this.users = [this.userService.user];
    };
    UserComponent.prototype.showNotification = function (from, align, colortype, icon, text) {
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
    UserComponent = __decorate([
        core_1.Component({
            selector: 'app-user',
            templateUrl: './user.component.html',
            styleUrls: ['./user.component.scss']
        })
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
