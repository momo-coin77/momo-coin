import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityID } from '../../../../../shared/entity/EntityID';
import { Pack, PackBuyState, PackState } from '../../../../../shared/entity/pack';
import { PackService } from '../../../../../shared/service/pack/pack.service';

@Component({
  selector: 'app-edit-pack',
  templateUrl: './edit-pack.component.html',
  styleUrls: ['./edit-pack.component.scss']
})
export class EditPackComponent implements OnInit {

  idPack: EntityID = new EntityID();

  pack: Pack = new Pack();
  constructor(private route: ActivatedRoute,
    private router: Router,
    private packService: PackService) { }
  id: '';

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    // this.packService.getPack(this.id)
    //   .subscribe((pack: Pack) => this.pack = pack);
  }

  updatePack(form) {
    if (form.valid) {
      // this.pack.id = this.id;
      // this.packService.updatePack(this.pack)
      //   .then(() => this.router.navigate(['/admin/list-pack']))
      //   .catch((err) => console.error(err));
    }
  }
}
