import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProjectView1Page } from './project-view1.page';

describe('ProjectView1Page', () => {
  let component: ProjectView1Page;
  let fixture: ComponentFixture<ProjectView1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectView1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectView1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
