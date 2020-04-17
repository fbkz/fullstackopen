import React from "react";
import ReactDOM from "react-dom";

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
    Number of exercises{" "}
    {parts.reduce((acc, curr) => {
      return curr.exercises + acc;
    }, 0)}
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

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        name: "State of a component",
        exercises: 20,
        id: 4,
      },
      {
        name: "State of a component",
        exercises: 20,
        id: 5,
      },
    ],
  };

  return (
    <div>
      <Course course={course} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
