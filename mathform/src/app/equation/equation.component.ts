import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MathValidators } from "../math-validators";
import { delay, filter, scan } from "rxjs/operators";

@Component({
  selector: "app-equation",
  templateUrl: "./equation.component.html",
  styleUrls: ["./equation.component.css"]
})
export class EquationComponent implements OnInit {
  secondPerSolution = 0;
  mathForm = new FormGroup(
    {
      firstValue: new FormControl(this.randomNumber()),
      secondValue: new FormControl(this.randomNumber()),
      answer: new FormControl("")
    },
    [MathValidators.addtion("answer", "firstValue", "secondValue")]
  );

  constructor() {}

  ngOnInit(): void {
    const startTime = new Date();
    let numberSolved = 0;

    this.mathForm.statusChanges
      .pipe(
        filter(value => value === "VALID"),
        delay(100),
        scan(
          acc => {
            return {
              numberSolved: acc.numberSolved + 1,
              startTime: acc.startTime
            };
          },
          { numberSolved: 0, startTime: new Date() }
        )
      )
      .subscribe(({ numberSolved, startTime }) => {
        this.secondPerSolution =
          (new Date().getTime() - startTime.getTime()) / numberSolved / 1000;

        this.mathForm.setValue({
          firstValue: this.randomNumber(),
          secondValue: this.randomNumber(),
          answer: ""
        });
        // this.mathForm.controls.firstValue.setValue(this.randomNumber());
        // this.mathForm.controls.secondValue.setValue(this.randomNumber());
        // this.mathForm.controls.answer.setValue("");
      });
  }

  get firstValue() {
    return this.mathForm.value.firstValue;
  }

  get secondValue() {
    return this.mathForm.value.secondValue;
  }

  get answer() {
    return this.mathForm.value.answer;
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }
}
