import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Hex from "../models/Hex";
import HexUtils from "../HexUtils";

const redStyle = {
  fill: "red",
  stroke: "black",
  strokeWidth: 0.09
};

const blueStyle = {
  fill: "blue",
  stroke: "black",
  strokeWidth: 0.09
};

class Hexagon extends Component {
  static propTypes = {
    q: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired,
    s: PropTypes.number.isRequired,
    fill: PropTypes.string,
    cellStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    data: PropTypes.object,
    onMouseEnter: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragOver: PropTypes.func,
    onDrop: PropTypes.func,
    children: PropTypes.node,

    title: PropTypes.string,
    bottomBlue: PropTypes.boolean,
    bottomRed: PropTypes.boolean,
    topBlue: PropTypes.boolean,
    topRed: PropTypes.boolean
  };

  static contextTypes = {
    layout: PropTypes.object, // TODO Shape
    points: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    const { q, r, s } = props;
    const { layout } = context;
    const hex = new Hex(q, r, s);
    const pixel = HexUtils.hexToPixel(hex, layout);
    this.state = { hex, pixel };
  }

  // TODO Refactor to reduce duplicate
  componentWillReceiveProps(nextProps) {
    const { q, r, s } = nextProps;
    const { layout } = this.context;
    const hex = new Hex(q, r, s);
    const pixel = HexUtils.hexToPixel(hex, layout);
    this.setState({ hex, pixel });
  }
  onMouseEnter(e) {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e, this);
    }
  }
  onMouseOver(e) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(e, this);
    }
  }
  onMouseLeave(e) {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e, this);
    }
  }
  onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e, this);
    }
  }
  onDragStart(e) {
    if (this.props.onDragStart) {
      const targetProps = {
        ...this.state,
        data: this.props.data,
        fill: this.props.fill,
        className: this.props.className
      };
      e.dataTransfer.setData("hexagon", JSON.stringify(targetProps));
      this.props.onDragStart(e, this);
    }
  }
  onDragEnd(e) {
    if (this.props.onDragEnd) {
      e.preventDefault();
      const success = e.dataTransfer.dropEffect !== "none";
      this.props.onDragEnd(e, this, success);
    }
  }
  onDragOver(e) {
    if (this.props.onDragOver) {
      this.props.onDragOver(e, this);
    }
  }
  onDrop(e) {
    if (this.props.onDrop) {
      e.preventDefault();
      const target = JSON.parse(e.dataTransfer.getData("hexagon"));
      this.props.onDrop(e, this, target);
    }
  }
  render() {
    const {
      fill,
      cellStyle,
      className,
      title,
      bottomBlue,
      bottomRed,
      topBlue,
      topRed
    } = this.props;
    const { points } = this.context;
    const { hex, pixel } = this.state;
    const fillId = fill ? `url(#${fill})` : null;

    const titleHTML = title == undefined ? null : <title>{title}</title>;
    const bottomBlueHTML =
      bottomBlue == false ? null : (
        <polygon
          points="-1.75,.5 -1.75,1.5 -.75,1.5 -.75,.5"
          style={blueStyle}
        ></polygon>
      );
    const bottomRedHTML =
      bottomRed == false ? null : (
        <polygon
          points="1.5,.5 1.5,1.5 .75,1.5 .75,.5"
          style={redStyle}
        ></polygon>
      );
    const topBlueHTML =
      topBlue == false ? null : (
        <polygon
          points="-1.75,-1.25 -1.75,-.25 -1,-.75"
          style={blueStyle}
        ></polygon>
      );
    const topRedHTML =
      topRed == false ? null : (
        <polygon
          points="1.75,-1.25 1.75,-.25 1,-.75"
          style={redStyle}
        ></polygon>
      );

    return (
      <g
        className={classNames("hexagon-group", className)}
        transform={`translate(${pixel.x}, ${pixel.y})`}
        draggable="true"
        onMouseEnter={e => this.onMouseEnter(e)}
        onMouseOver={e => this.onMouseOver(e)}
        onMouseLeave={e => this.onMouseLeave(e)}
        onClick={e => this.onClick(e)}
        onDragStart={e => this.onDragStart(e)}
        onDragEnd={e => this.onDragEnd(e)}
        onDragOver={e => this.onDragOver(e)}
        onDrop={e => this.onDrop(e)}
      >
        <g className="hexagon">
          <polygon points={points} fill={fillId} style={cellStyle}>
            {titleHTML}
          </polygon>
          {bottomBlueHTML}
          {bottomRedHTML}
          {topBlueHTML}
          {topRedHTML}
          {this.props.children}
        </g>
      </g>
    );
  }
}

export default Hexagon;
