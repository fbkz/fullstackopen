import React from "react";

const Header = ({ course }) => <h1>{course}</h1>;

const Part = ({ part, exercises }) => (
  <p>
    {part} {exercises}
  </p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => {
      return <Part key={part.id} part={part.name} exercises={part.exercises} />;
    })}
  </div>
);

const Total = ({ parts }) => (
  <p>
    <b>
      total of{" "}
      {parts.reduce((acc, curr) => {
        return curr.exercises + acc;
      }, 0)}{" "}
      exercises
    </b>
  </p>
);

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;
