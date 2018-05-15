import React, { Component } from 'react';
import { format, getDay, addDays } from 'date-fns';

const ROOT = "bear://x-callback-url/create";

const createUrl = ({ title, text, tags }) => {
  return encodeURI(`${ROOT}?title=${getTitle(title)}&text=${text}&tags=${tags}`);
};

const getTitle = title => {
  const dayOfWeek = getDay(new Date());
  let diff = days[title.toLowerCase()] - dayOfWeek;
  if (diff < 0) {
    diff = 5 - diff;
  }
  return format(addDays(new Date(), diff), "M/D/YY dddd");
};

const days = {
  m: 1,
  mon: 1,
  monday: 1,

  t: 2,
  tue: 2,
  tuesday: 2,

  w: 3,
  wed: 3,
  wednesday: 3,

  th: 4,
  thu: 4,
  thursday: 4,

  f: 5,
  fri: 5,
  friday: 5,

  s: 6,
  sat: 6,
  saturday: 6,

  su: 0,
  sun: 0,
  sunday: 0,
};

const KEY = "@todo-templates";

const getInitialValues = () => {
  const day = format(addDays(new Date(), 1), "dddd");
  const initialValues = {
    title: day,
    text: ["Goal", "Review", "Schedule", "Bucket"].map(head => `## ${head}:\n\n\n`).join("") + "\n\n",
    tags: "todos",
  };

  try {
    return {
      ...JSON.parse(localStorage[KEY]),
      title: initialValues.title,
    };
  } catch (err) {
    return initialValues;
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: getInitialValues(),
      output: null,
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    this.setState({
      output: createUrl(this.state.values),
    });
  };

  handleChange = e => {
    const values = {
      ...this.state.values,
      [e.target.name]: e.target.value,
    };

    localStorage[KEY] = JSON.stringify(values);

    this.setState({
      output: null,
      values,
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {[{
          label: "Title",
          name: "title",
        }, {
          label: "Text",
          name: "text",
          type: "textarea",
        }, {
          label: "Tags",
          name: "tags",
        }].map(({
          label,
          name,
          type,
        }) => {
          if (type === "textarea") {
            return (
              <div key={name}>
                <label>{label}:</label>
                <textarea
                  onChange={this.handleChange}
                  type="text"
                  name={name}
                  value={this.state.values[name]}
                />
              </div>
            );
          }

          return (
            <div key={name}>
              <label>{label}:</label>
              <input
                onChange={this.handleChange}
                type="text"
                name={name}
                value={this.state.values[name]}
              />
            </div>
          );
        })}
        <input type="submit" />
        {this.state.output && (<a className="output" href={this.state.output}>Open Link for {this.state.values.title}</a>
        )}
      </form>
    );
  }
}

export default App;
