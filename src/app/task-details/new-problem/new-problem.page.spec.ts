import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewProblemPage } from './new-problem.page';

describe('NewProblemPage', () => {
  let component: NewProblemPage;
  let fixture: ComponentFixture<NewProblemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProblemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewProblemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
