import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProblemsPage } from './problems.page';

describe('ProblemsPage', () => {
  let component: ProblemsPage;
  let fixture: ComponentFixture<ProblemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProblemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
