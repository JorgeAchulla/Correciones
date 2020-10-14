import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


import {
  GAP_FORM_CHILDS_PX,
  GAP_FORM_PX,
  MAX_BIG_TEXT_INPUT_FORM, MAX_SIZE_PAGINATION_COMBO,

} from '../../shared/constants/constants';
import {errorMessages} from '../../shared/constants/custom-messages';
import {ErrorResponse} from '../../shared/models/error-response';
import {RoadMapDetails} from '../../shared/models/road-map-details';
import {RoadMapService} from '../../shared/services/road-map.service';
import {forkJoin, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {RoadMapRequest} from '../../shared/models/road-map-request';
import {ColumnDataSourceType} from '../../bitacore/table-server-side/column-data-source-type';
import {ColumnDataSource} from '../../bitacore/table-server-side/column-data-source';



@Component({
  selector: 'app-roadmap-view',
  templateUrl: './roadmap-view.component.html',
  styleUrls: ['./roadmap-view.component.scss']
})
export class RoadmapViewComponent implements OnInit {
  fecha = new Date();
  roadMap = new RoadMapDetails();
  roadMapForm: FormGroup;
  errors = errorMessages;
  roadMapId: number;
  formGap = GAP_FORM_PX;
  formChildGap = GAP_FORM_CHILDS_PX;
  openModalError = new Subject<ErrorResponse>();
  columns: ColumnDataSource[];



  color: string;
  status: string;
/*  color = {
      generado: '#707070',
      enRuta: '#FBB03B',
      concluido: '#70CB54',
      anulado: '#C1272D'
  };*/



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<RoadmapViewComponent>,
              private roadMapService: RoadMapService,
              ) { }


  ngOnInit(): void {
    this.roadMapId = this.data;
    this.form();
    this.loadDataForView();


    this.columns = [

      {
        name: 'ESTADO DE RUTA',
        property: 'status',
        isModelProperty: true,
        type: ColumnDataSourceType.CHIPS,
        colorChipProperty: 'statusColor'
      },
    ];

  }

  /**
   * Cargar la data en form.
   */
  loadDataForView() {
    const roadMapResponse = this.roadMapService.findById(this.roadMapId);
    forkJoin([roadMapResponse]).subscribe((arrayResponse: any[]) => {
      const road = arrayResponse[0];
      this.update(road);
    });
  }

  form() {
        this.roadMapForm = this.formBuilder.group(  {
          code: ['', [Validators.required]],
          deliveryZone: ['', [Validators.required]],
          scheduledDate: ['', [Validators.required, ]],
          duration: ['', [Validators.required]],
          vehiculeLicensePlate: ['', [Validators.required]],
          driverName: ['', [Validators.required]],
          userAsigned: ['', [Validators.required]],
          totalDocuments: ['', [Validators.required]],
          statusColor: ['', [Validators.required]],

        });
      }

  /**
   * Insertar los campos en el formulario.
   */

 update(data: any) {
      this.roadMapForm.setValue(  {
        code: data.code,
        deliveryZone: data.deliveryZone,
        scheduledDate: new Date(data.scheduledDate),
        duration: data.duration,
        vehiculeLicensePlate: data.vehiculeLicensePlate,
        driverName: data.driverName,
        userAsigned: data.userAsigned,
        totalDocuments: data.totalDocuments,
        statusColor: data.statusName,
      });
      console.log('>>>>>>>>>>>>>>>>>>  ' + data.statusColor , data.statusName);
      this.disabledOrEnableFields(false);
}

  disabledOrEnableFields(enabled: boolean) {
    enabled ? this.roadMapForm.controls.code.enable() : this.roadMapForm.controls.code.disable();
    enabled ? this.roadMapForm.controls.deliveryZone.enable() : this.roadMapForm.controls.deliveryZone.disable();
    enabled ? this.roadMapForm.controls.scheduledDate.enable() : this.roadMapForm.controls.scheduledDate.disable();
    enabled ? this.roadMapForm.controls.duration.enable() : this.roadMapForm.controls.duration.disable();
    enabled ? this.roadMapForm.controls.vehiculeLicensePlate.enable() : this.roadMapForm.controls.vehiculeLicensePlate.disable();
    enabled ? this.roadMapForm.controls.driverName.enable() : this.roadMapForm.controls.driverName.disable();
    enabled ? this.roadMapForm.controls.userAsigned.enable() : this.roadMapForm.controls.userAsigned.disable();
    enabled ? this.roadMapForm.controls.totalDocuments.enable() : this.roadMapForm.controls.totalDocuments.disable();
    enabled ? this.roadMapForm.controls.statusColor.enable() : this.roadMapForm.controls.statusColor.disable();
  }



/*  colorStatus(color: string) {
    if (color === '#707070') {
      return     'Generado';
    } else if (color === '#FBB03B') {
      return 'En Ruta';
    } else  if (color === '#70CB54')  {
      return 'Concluido';
    } else if (color === '#C1272D') {
      return 'Anulado';
    }
  }*/

/*  colorStatus(status: string) {
    if (status === 'Generado') {
      return   '#707070';
    } else if (status === 'En Ruta') {
      return '#FBB03B';
    } else  if (status === 'Concluido')  {
      return '#70CB54';
    } else if (status === 'Anulado') {
      return '#C1272D';
    }
  }*/



}
