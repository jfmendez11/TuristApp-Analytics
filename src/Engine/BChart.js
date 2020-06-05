import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(name, value) {
  return { name, value };
}

const placeFrequency = (data) => {
  const freq = {};
  data.forEach(places => {
    places.forEach(place => {
      if(place.name !== undefined) {
        if(!freq[place.name]) freq[place.name] = 0;
        freq[place.name]++;
      }
    });
  });
  return Object.entries(freq).map(d => {
    return createData(d[0], d[1]);
  });
};

const dateFrequency = (data) => {
  const freq = {};
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  data.forEach(date => {
    const jsDate = date.toDate();
    const month = months[jsDate.getMonth()];
    if(!freq[month]) freq[month] = 0;
    freq[month]++;
  });
  return Object.entries(freq).map(d => {
    return createData(d[0], d[1]);
  });
};

const establishmentFrequency = (data) => {
  const freq = {};
  data.forEach(places => {
    places.forEach(place => {
      if(place.name !== undefined) {
        for(let i = 0; i < place.types.length; i++) {
          const type = place.types[i];
          if(type !== "establishment" && type!== "point_of_interest") {
            if(!freq[type]) freq[type] = 0;
            freq[type]++;
          }
        }
      }
    });
  });
  return Object.entries(freq).map(d => {
    return createData(d[0], d[1]);
  });
};

export default function BChart(props) {
  const [data, setData] = React.useState([]);
  React.useEffect(() =>{
    if(props.type === "places") setData(placeFrequency(props.data));
    else if (props.type === "dates") setData(dateFrequency(props.data));
    else if (props.type === "establishments") setData(establishmentFrequency(props.data));
  },[props]);

  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5, right: 5, left: 5, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}