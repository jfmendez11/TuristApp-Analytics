import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, } from 'recharts';
import Title from './Title';
  
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
  
  export default class PChart extends PureComponent {
    state = {
      activeIndex: 0,
    };
  
    onPieEnter = (data, index) => {
      this.setState({
        activeIndex: index,
      });
    };

    // Generate Sales Data
    createData(name, count) {
      return { name, count };
    }

    pointsFreq() {
      const freq = {};
      this.props.data.forEach(places => {
        if(!freq[`${places.length} puntos`]) freq[`${places.length} puntos`] = 0;
        freq[`${places.length} puntos`]++;
      });
      return Object.entries(freq).map(d => {
        return this.createData(d[0], d[1]);
      });
    }

    planHourFrequency() {
      const freq = {};
      this.props.data.forEach(date => {
        const jsDate = date.toDate();
        const hour = jsDate.getHours();
        if(!freq[`${hour}:00-${hour+1}:00`]) freq[`${hour}:00-${hour+1}:00`] = 0;
        freq[`${hour}:00-${hour+1}:00`]++;
      });
      return Object.entries(freq).map(d => {
        return this.createData(d[0], d[1]);
      });
    }
  
    render() {
      let data;
      if(this.props.type ===  "users") data = [{name: "Número de usuarios", count: this.props.data}];
      else if (this.props.type === "countPoints") data = this.pointsFreq();
      else if (this.props.type === "hours") data = this.planHourFrequency();
      return (
        <React.Fragment>
        <Title>{this.props.title}</Title>
        <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            innerRadius={80}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
        </ResponsiveContainer>
        </React.Fragment>
      );
    }
  }